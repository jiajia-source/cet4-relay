/* ===== 数据同步层（Supabase 云端 / 可选 Gun 专属中继） =====
 * 设计目标：让「手机(在线链接)」与「电脑桌面(file://)」两份*你自己的*进度自动互通。
 *  - 用「私密房间名」做命名空间：两台设备填同一个房间名 → 互通；朋友不填/填不同名 → 隔离。
 *  - 默认走 Supabase（你在自己项目里建的 cet4_sync 表，数据私有、国内可连）；Gun 公共中继已全部失效，仅保留「专属中继」可选模式。
 *  - 合并策略：对象递归合并、数组去重合并、数字取最大值、标量以远端为准 → 两台设备进度都不丢。
 *  - 防回环：用状态哈希抑制自己的回声；Store.save 内有 _applying 守卫，避免远端合并触发死循环推送。
 */
(function () {
  'use strict';

  const ROOM_KEY = 'cet4_sync_room';
  const BACKEND_KEY = 'cet4_sync_backend';
  const SB_URL_KEY = 'cet4_sb_url';
  const SB_KEY_KEY = 'cet4_sb_key';
  const RELAY_KEY = 'cet4_sync_relay';
  const NET = 'cet4-sync-net';

  // 你提供的 Supabase 凭据（anon public key 本就设计为前端公开使用），作为预填默认值。
  const DEFAULT_SB = {
    url: 'https://wecyqdpgmuvhyiasdmma.supabase.co',
    key: 'sb_publishable_m4sM8BwVlCmQrWNQpqN5VQ_14RSmF97'
  };

  let room = '';
  let backend = localStorage.getItem(BACKEND_KEY) || 'supabase';
  let lastPushedHash = '';
  let lastPushedTs = 0;
  let sbOk = false, sbMsg = '';
  let pollTimer = null, pushTimer = null;
  let gun = null, node = null, peersConnected = 0, connectFailed = false, connectTimer = null, gunLibLoading = false;
  const statusListeners = [];

  /* ---------- 工具：哈希（回声抑制 + 房间名脱敏） ---------- */
  function hashText(str) {
    let h = 5381;
    for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) >>> 0;
    return h.toString(36);
  }
  function hashState(s) { try { return hashText(JSON.stringify(s)); } catch (e) { return ''; } }
  // 房间名做哈希后再当数据库主键：别人即使能查表也看不到房间名、无法枚举/猜。
  function hashRoom(r) { return 'r_' + hashText(r); }

  /* ---------- 工具：轻量 XOR 混淆（Gun 模式用） ---------- */
  function xorCrypt(str, key) {
    const enc = new TextEncoder(), dec = new TextDecoder();
    const sb = enc.encode(str), kb = enc.encode(key);
    const out = new Uint8Array(sb.length);
    for (let i = 0; i < sb.length; i++) out[i] = sb[i] ^ kb[i % kb.length];
    let bin = '';
    for (let i = 0; i < out.length; i++) bin += String.fromCharCode(out[i]);
    return btoa(bin);
  }
  function xorDecrypt(b64, key) {
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    const enc = new TextEncoder(), kb = enc.encode(key);
    const sb = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) sb[i] = bytes[i] ^ kb[i % kb.length];
    return new TextDecoder().decode(sb);
  }

  /* ---------- 工具：合并两份状态（并集 / 最大值） ---------- */
  function isObj(v) { return v && typeof v === 'object' && !Array.isArray(v); }
  function mergeStates(a, b) {
    if (Array.isArray(a) && Array.isArray(b)) {
      const seen = new Set(), out = [];
      for (const it of a.concat(b)) {
        const k = (typeof it === 'object') ? JSON.stringify(it) : String(it);
        if (!seen.has(k)) { seen.add(k); out.push(it); }
      }
      return out;
    }
    if (isObj(a) && isObj(b)) {
      const out = {}, keys = new Set([...Object.keys(a), ...Object.keys(b)]);
      for (const k of keys) {
        const av = a[k], bv = b[k];
        if (av === undefined) out[k] = bv;
        else if (bv === undefined) out[k] = av;
        else if (typeof av === 'number' && typeof bv === 'number') out[k] = Math.max(av, bv);
        else if (typeof av !== 'object' && typeof bv !== 'object') out[k] = bv;
        else out[k] = mergeStates(av, bv);
      }
      return out;
    }
    if (typeof a === 'number' && typeof b === 'number') return Math.max(a, b);
    return (b === undefined) ? a : b;
  }

  /* ---------- 状态通知 ---------- */
  function getStatus() {
    if (!room) return { on: false, txt: '未开启同步' };
    if (backend === 'supabase') {
      const sb = getSb();
      if (!sb.url || !sb.key) return { on: true, txt: '请先填写 Supabase 地址与密钥' };
      return { on: true, txt: sbMsg || '云端连接中 · 同步中' };
    } else {
      if (typeof Gun === 'undefined') return { on: true, txt: '需联网（Gun 未加载）' };
      if (!hasRelay()) return { on: true, txt: '未配置专属中继地址' };
      if (connectFailed) return { on: true, txt: '中继连接失败：检查地址/网络后重试' };
      return { on: true, txt: peersConnected > 0 ? '已连接中继 · 同步中' : '连接中继中…' };
    }
  }
  function updateStatus() {
    const s = getStatus();
    statusListeners.forEach(fn => { try { fn(s); } catch (e) {} });
  }

  /* ---------- Supabase 后端 ---------- */
  function getSb() {
    return {
      url: (localStorage.getItem(SB_URL_KEY) || '').trim() || DEFAULT_SB.url,
      key: (localStorage.getItem(SB_KEY_KEY) || '').trim() || DEFAULT_SB.key
    };
  }
  function sbEndpoint() { return getSb().url.replace(/\/+$/, '') + '/rest/v1/cet4_sync'; }
  function sbHeaders() {
    const sb = getSb();
    return { 'apikey': sb.key, 'Authorization': 'Bearer ' + sb.key, 'Content-Type': 'application/json' };
  }

  async function sbFetchRows(roomKey) {
    const res = await fetch(sbEndpoint() + '?room=eq.' + encodeURIComponent(roomKey), { headers: sbHeaders() });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return await res.json();
  }
  async function sbUpsert(row) {
    const res = await fetch(sbEndpoint(), {
      method: 'POST',
      headers: Object.assign(sbHeaders(), { 'Prefer': 'resolution=merge-duplicates,return=minimal' }),
      body: JSON.stringify(row)
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
  }
  async function sbDelete(roomKey) {
    const res = await fetch(sbEndpoint() + '?room=eq.' + encodeURIComponent(roomKey), {
      method: 'DELETE', headers: sbHeaders()
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
  }
  async function sbPush(stateObj) {
    const sb = getSb();
    if (!sb.url || !sb.key || !room) return;
    lastPushedHash = hashState(stateObj);
    const dbRoom = hashRoom(room);
    try {
      await sbUpsert({ room: dbRoom, state: xorCrypt(JSON.stringify(stateObj), room), updated_at: new Date().toISOString() });
      sbOk = true; sbMsg = '云端已同步 · 互通中';
    } catch (e) { sbOk = false; sbMsg = '云端写入失败：' + (e.message || e); }
    updateStatus();
  }
  async function sbPull() {
    const sb = getSb();
    if (!sb.url || !sb.key || !room) return;
    const dbRoom = hashRoom(room);
    try {
      let rows = await sbFetchRows(dbRoom);
      let enc = null, legacy = false;
      if (rows && rows.length) {
        enc = rows[0].state;
      } else {
        // 兼容升级前的明文房间名旧数据：读到后迁移到哈希键并删除旧明文行
        rows = await sbFetchRows(room);
        if (rows && rows.length) { enc = rows[0].state; legacy = true; }
      }
      if (enc) {
        const remote = legacy ? enc : JSON.parse(xorDecrypt(enc, room));
        if (legacy) {
          try {
            await sbUpsert({ room: dbRoom, state: xorCrypt(JSON.stringify(remote), room), updated_at: new Date().toISOString() });
            await sbDelete(room);
          } catch (e) { console.warn('[Sync] 旧数据迁移失败', e); }
        }
        if (hashState(remote) === lastPushedHash) { sbOk = true; sbMsg = '云端连接正常 · 同步中'; updateStatus(); return; }
        applyRemote(remote);
      }
      sbOk = true; sbMsg = '云端连接正常 · 同步中';
    } catch (e) { sbOk = false; sbMsg = '云端读取失败：' + (e.message || e); }
    updateStatus();
  }
  function startPoll() { stopPoll(); pollTimer = setInterval(function () { if (room && backend === 'supabase') sbPull(); }, 15000); }
  function stopPoll() { if (pollTimer) { clearInterval(pollTimer); pollTimer = null; } }
  function scheduleSbPush(stateObj) { if (pushTimer) clearTimeout(pushTimer); pushTimer = setTimeout(function () { sbPush(stateObj); }, 700); }

  /* ---------- Gun 后端（可选：需自己部署专属中继） ---------- */
  function getRelays() { const custom = (localStorage.getItem(RELAY_KEY) || '').trim(); return custom ? [custom] : []; }
  function hasRelay() { return getRelays().length > 0; }
  function ensureGunLib(cb) {
    if (typeof Gun !== 'undefined') { cb(); return; }
    if (gunLibLoading) return;
    gunLibLoading = true;
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/gun/gun.js';
    s.onload = function () { gunLibLoading = false; cb(); };
    s.onerror = function () { gunLibLoading = false; connectFailed = true; updateStatus(); };
    document.head.appendChild(s);
  }
  function ensureGun() {
    if (gun) return gun;
    if (typeof Gun === 'undefined') return null;
    const relays = getRelays();
    if (!relays.length) return null;
    gun = Gun({ peers: relays, radisk: false, localStorage: false });
    gun.on('hi', function () { peersConnected++; connectFailed = false; updateStatus(); });
    gun.on('bye', function () { peersConnected = Math.max(0, peersConnected - 1); updateStatus(); });
    if (connectTimer) clearTimeout(connectTimer);
    connectTimer = setTimeout(function () { if (peersConnected === 0) { connectFailed = true; updateStatus(); } }, 12000);
    return gun;
  }
  function gunConnect() {
    ensureGunLib(function () {
      room = (localStorage.getItem(ROOM_KEY) || '').trim();
      if (!room || !hasRelay()) { updateStatus(); return; }
      const g = ensureGun(); if (!g) { updateStatus(); return; }
      node = g.get(NET).get(room);
      node.on(function (data) {
        if (data && data.data) {
          try { applyRemote(JSON.parse(xorDecrypt(data.data, room)), data.ts || 0); } catch (e) { console.warn('[Sync] 收包解析失败', e); }
        }
      });
      updateStatus();
    });
  }
  function gunPush(stateObj) {
    if (!node || !room) return;
    if (pushTimer) clearTimeout(pushTimer);
    pushTimer = setTimeout(function () {
      try {
        const ts = Date.now();
        lastPushedTs = Math.max(lastPushedTs, ts);
        node.put({ ts: ts, data: xorCrypt(JSON.stringify(stateObj), room) });
      } catch (e) { console.warn('[Sync] 推送失败', e); }
    }, 700);
  }

  /* ---------- 合并应用（远端 → 本地） ---------- */
  function applyRemote(remote, ts) {
    if (!remote || typeof remote !== 'object') return;
    if (ts && ts <= lastPushedTs) return;          // 跳过 Gun 自己的回声 / 旧数据
    window.CET4Sync._applying = true;
    try {
      const merged = mergeStates(Store.state, remote);
      Store.importState(merged);                  // 写入 localStorage（被 _applying 守卫，不回推）
    } catch (e) { console.warn('[Sync] 合并失败', e); }
    finally { window.CET4Sync._applying = false; }
    refreshUI();
  }
  function refreshUI() {
    if (window.updateChrome) { try { window.updateChrome(); } catch (e) {} }
    const active = document.querySelector('.nav-item.active');
    const id = active ? active.dataset.module : 'home';
    if (window.switchTo) { try { window.switchTo(id); } catch (e) {} }
  }

  /* ---------- 对外 API ---------- */
  function isOn() { return !!room; }
  function setRoom(r) {
    r = (r || '').trim();
    if (!r) return { ok: false, msg: '房间名不能为空' };
    localStorage.setItem(ROOM_KEY, r);
    localStorage.setItem(BACKEND_KEY, backend);
    room = r;
    if (backend === 'supabase') { sbPull(); startPoll(); bindFocus(); }
    else { gunConnect(); }
    updateStatus();
    return { ok: true };
  }
  function disable() {
    localStorage.setItem(ROOM_KEY, '');
    room = ''; node = null; stopPoll();
    updateStatus();
  }
  function getRoom() { return room; }
  function setBackend(b) { backend = b; localStorage.setItem(BACKEND_KEY, b); }
  function bindFocus() {
    if (bindFocus._done) return; bindFocus._done = true;
    window.addEventListener('focus', function () { if (room && backend === 'supabase') sbPull(); });
    document.addEventListener('visibilitychange', function () { if (!document.hidden && room && backend === 'supabase') sbPull(); });
  }

  window.CET4Sync = {
    isOn, setRoom, disable, getRoom,
    push: function (stateObj) {
      if (backend === 'supabase') scheduleSbPush(stateObj);
      else gunPush(stateObj);
    },
    _applying: false,
    onStatus: function (fn) { statusListeners.push(fn); },
    getBackend: function () { return backend; },
    setBackend: setBackend,
    getSb: getSb,
    getRelays: getRelays
  };

  /* ---------- 启动：若已设置过房间则自动连接 ---------- */
  function connect() {
    room = (localStorage.getItem(ROOM_KEY) || '').trim();
    if (!room) { updateStatus(); return; }
    if (backend === 'supabase') { sbPull(); startPoll(); bindFocus(); }
    else { gunConnect(); }
    updateStatus();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', connect);
  else connect();

  /* ---------- 同步面板（侧边导航「🔄 数据同步」） ---------- */
  window.CET4Modules = window.CET4Modules || {};
  window.CET4Modules.sync = {
    mount(c) {
      function render() {
        const on = window.CET4Sync.isOn();
        const st = window.CET4Sync.getRoom() ? getStatus() : { on: false, txt: '未开启同步' };
        const bk = window.CET4Sync.getBackend();
        const sb = window.CET4Sync.getSb();
        const relay = window.CET4Sync.getRelays()[0] || '';
        c.innerHTML = `
          <div class="cloud-card" style="padding:20px;max-width:680px">
            <h3 style="margin:0 0 6px">🔄 手机 ↔ 电脑 进度互通</h3>
            <p class="muted" style="margin:0 0 12px;line-height:1.6">
              在<strong>手机</strong>和<strong>电脑</strong>两台设备填<strong>同一个房间名</strong>，进度自动同步。
              房间名就是唯一密钥——朋友不填、或填不一样的房间名，就和你完全隔离，不会混。
            </p>
            <div style="margin-bottom:12px">
              <label class="muted" style="font-size:13px;display:block;margin-bottom:6px">同步方式</label>
              <select id="syncBackend" class="sync-input" style="padding:10px 12px;border:2px solid var(--pink-200);border-radius:12px;font-size:14px;max-width:280px">
                <option value="supabase" ${bk === 'supabase' ? 'selected' : ''}>☁️ Supabase 云端（推荐）</option>
                <option value="gun" ${bk === 'gun' ? 'selected' : ''}>🔧 专属 Gun 中继</option>
              </select>
            </div>
            ${bk === 'supabase' ? `
            <div id="sbForm">
              <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px">
                <input id="sbUrl" class="sync-input" placeholder="Project URL" value="${sb.url}"
                       style="flex:1;min-width:220px;padding:10px 12px;border:2px solid var(--pink-200);border-radius:12px;font-size:14px" />
              </div>
              <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px">
                <input id="sbKey" class="sync-input" placeholder="anon public key" value="${sb.key}"
                       style="flex:1;min-width:220px;padding:10px 12px;border:2px solid var(--pink-200);border-radius:12px;font-size:14px" />
              </div>
              <div style="font-size:12px;color:#888;margin-bottom:10px">数据存在你自己的 Supabase 项目（已设匿名读写策略）。地址与密钥已按你提供的预填，一般无需改动。</div>
            </div>` : `
            <div id="gunForm">
              <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px">
                <input id="syncRelay" class="sync-input" placeholder="https://你的专属中继/gun" value="${relay}"
                       style="flex:1;min-width:220px;padding:10px 12px;border:2px solid var(--pink-200);border-radius:12px;font-size:14px" />
                <button id="syncRelaySave" class="backup-btn">保存中继</button>
              </div>
              <div style="font-size:12px;color:#888;margin-bottom:10px">Gun 公共中继已全部失效，需你自己部署一个专属中继（如 Render/Replit）后填入地址。</div>
            </div>`}
            <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin:10px 0">
              <input id="syncRoom" class="sync-input" placeholder="私密房间名，如 my-cet4-886" value="${window.CET4Sync.getRoom() ? window.CET4Sync.getRoom() : ''}"
                     style="flex:1;min-width:220px;padding:10px 12px;border:2px solid var(--pink-200);border-radius:12px;font-size:14px" />
              <button id="syncSet" class="backup-btn" style="background:#ff8fab;color:#fff">${on ? '更新房间' : '开启同步'}</button>
              ${on ? '<button id="syncOff" class="backup-btn">断开同步</button>' : ''}
            </div>
            <div id="syncStatus" class="muted" style="font-size:13px;margin-bottom:10px">状态：${st.txt}</div>
            <div class="muted" style="font-size:12px;line-height:1.7;background:rgba(255,143,171,.08);padding:10px 12px;border-radius:10px">
              <strong>使用步骤：</strong><br/>
              ① 手机和电脑桌面都填<strong>一模一样</strong>的房间名 → 点「开启同步」。<br/>
              ② 之后任一台学到哪，另一台打开本页约 15 秒内自动跟到哪。<br/>
              ③ 想停止：点「断开同步」，本地进度保留。
            </div>
            <div id="syncMsg" style="color:#ff5e9a;font-size:13px;margin-top:10px;min-height:18px"></div>
          </div>`;
        const msg = c.querySelector('#syncMsg');
        const stEl = c.querySelector('#syncStatus');
        window.CET4Sync.onStatus(function (s) { if (stEl) stEl.textContent = '状态：' + s.txt; });

        c.querySelector('#syncBackend').addEventListener('change', function (e) {
          window.CET4Sync.setBackend(e.target.value);
          if (e.target.value === 'gun' && window.CET4Sync.isOn()) gunConnect();
          if (e.target.value === 'supabase' && window.CET4Sync.isOn()) { sbPull(); startPoll(); bindFocus(); }
          render();
        });

        if (bk === 'supabase') {
          c.querySelector('#sbUrl').addEventListener('change', function (e) { localStorage.setItem(SB_URL_KEY, e.target.value.trim()); });
          c.querySelector('#sbKey').addEventListener('change', function (e) { localStorage.setItem(SB_KEY_KEY, e.target.value.trim()); });
        } else {
          const relaySaveBtn = c.querySelector('#syncRelaySave');
          if (relaySaveBtn) relaySaveBtn.addEventListener('click', function () {
            const v = c.querySelector('#syncRelay').value.trim();
            if (v) { localStorage.setItem(RELAY_KEY, v); msg.textContent = '✅ 已保存专属中继，点「开启同步」或刷新生效'; }
            else { localStorage.removeItem(RELAY_KEY); msg.textContent = '已清除专属中继'; }
            gun = null; peersConnected = 0; connectFailed = false; node = null;
            if (window.CET4Sync.isOn()) gunConnect(); else updateStatus();
          });
        }

        c.querySelector('#syncSet').addEventListener('click', function () {
          const r = c.querySelector('#syncRoom').value.trim();
          if (!r) { msg.textContent = '请先输入房间名'; return; }
          const res = window.CET4Sync.setRoom(r);
          if (res.ok) { msg.textContent = '✅ 已开启，正在与同房间名的设备同步…'; render(); }
          else { msg.textContent = '❌ ' + res.msg; }
        });
        const offBtn = c.querySelector('#syncOff');
        if (offBtn) offBtn.addEventListener('click', function () {
          window.CET4Sync.disable(); msg.textContent = '已断开同步，本地进度保留'; render();
        });
      }
      render();
    }
  };
})();
