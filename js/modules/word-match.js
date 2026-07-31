/* ===== 单词消消乐模块 =====
 * · 左栏英文单词 / 右栏中文释义，点选两张卡进行连线匹配，配对成功即消除
 * · 匹配成功：画出连线光效 + 双卡消除动画，发放【养成积分】
 *   养成积分经 window.PuppyStudy.gain('match', n) 直接计入小狗成长系统
 *   （延长寿命 / 提升邂逅优质率 / 提高后代天赋），并复用 ReviewBuddy 悬浮小狗
 *   的开心特效与狗粮/亲密度奖励，不新建第二套数值体系。
 * · 匹配失败：两卡红色震动 + 小狗安慰，仅断连击，不扣任何数值
 * · 三档难度（6/8/10 对）· 计时 · 连击加成 · 零失误完美奖励
 * · 结算经 Store.addMatchScore 落库，模块内展示历史最佳
 * · Shadow DOM 隔离：沿用项目粉色 UI 风格，零样式冲突，不改动任何现有模块逻辑
 */
(function () {
  'use strict';

  const LEVELS = {
    easy:   { pairs: 6,  name: '轻松', emoji: '🌱' },
    normal: { pairs: 8,  name: '标准', emoji: '🌸' },
    hard:   { pairs: 10, name: '挑战', emoji: '🔥' }
  };

  const PT_BASE = 1;      // 每消除一对的养成积分
  const PT_COMBO = 1;     // 连击≥3 时每对额外养成积分
  const COMBO_ON = 3;     // 连击加成起点
  const PERFECT_PT = 3;   // 零失误通关额外养成积分
  const CLEAR_FOOD = 10;  // 通关基础狗粮
  const PERFECT_FOOD = 10;// 零失误额外狗粮

  let root = null;        // shadow root
  let S = null;           // 本局运行态
  let tick = null;        // 计时器

  const $ = sel => root && root.querySelector(sel);
  const $$ = sel => root ? Array.prototype.slice.call(root.querySelectorAll(sel)) : [];
  const esc = s => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const shuffle = arr => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  };
  const fmtTime = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  /* ---------- 选词：同一局内中文释义不重复，避免出现两个正确答案 ---------- */
  function pickWords(n) {
    const all = window.WORDS || [];
    if (all.length < n) return [];
    const out = [], seenCn = new Set(), seenEn = new Set();
    const bag = shuffle(all);
    for (let i = 0; i < bag.length && out.length < n; i++) {
      const w = bag[i];
      if (!w || !w.word || !w.cn) continue;
      if (seenCn.has(w.cn) || seenEn.has(w.word)) continue;
      seenCn.add(w.cn); seenEn.add(w.word);
      out.push(w);
    }
    return out;
  }

  /* ---------- 新一局 ---------- */
  function newGame(levelKey) {
    stopTick();
    const lv = LEVELS[levelKey] || LEVELS.normal;
    const words = pickWords(lv.pairs);
    S = {
      level: levelKey, lv,
      words,
      en: shuffle(words),
      cn: shuffle(words),
      pickedEn: null, pickedCn: null,
      left: words.length,
      points: 0, combo: 0, maxCombo: 0, miss: 0,
      missBy: {},          // wordId -> 错配次数（≥2 收入错题本）
      seconds: 0, locked: false, over: false
    };
    renderBoard();
    startTick();
  }

  function startTick() {
    stopTick();
    tick = setInterval(() => {
      if (!S || S.over) return;
      S.seconds++;
      const t = $('#time');
      if (t) t.textContent = '⏱ ' + fmtTime(S.seconds);
    }, 1000);
  }
  function stopTick() { if (tick) { clearInterval(tick); tick = null; } }

  /* ---------- 渲染：开始页 ---------- */
  function renderStart() {
    stopTick();
    const m = Store.getMatch ? Store.getMatch() : { points: 0, rounds: 0, best: 0, pairs: 0, miss: 0, bestTime: 0 };
    const grow = (window.PuppyStudy && PuppyStudy.getState) ? (PuppyStudy.getState().total || 0) : 0;
    const dog = (window.PuppyPet && PuppyPet.name) ? PuppyPet.name() : '奶糖';
    const cards = Object.keys(LEVELS).map(k => {
      const l = LEVELS[k];
      return `<button class="lvcard" data-lv="${k}">
        <span class="e">${l.emoji}</span>
        <span class="n">${l.name}</span>
        <span class="d">${l.pairs} 对单词</span>
      </button>`;
    }).join('');

    $('#stage').innerHTML = `
      <div class="start">
        <div class="big">🧩</div>
        <h3>单词消消乐</h3>
        <p class="tip">左边英文、右边中文，点两张卡连成一对就能消除～</p>
        <div class="rules">
          <span>🌱 每消一对 +${PT_BASE} 养成积分</span>
          <span>🔥 连击 ${COMBO_ON} 起每对再 +${PT_COMBO}</span>
          <span>🦴 全部消完 +${CLEAR_FOOD} 狗粮</span>
          <span>💯 零失误再 +${PERFECT_FOOD} 🦴 与 +${PERFECT_PT} 积分</span>
        </div>
        <div class="grow">养成积分会直接喂进「🐶 小狗养成」的成长系统：<b>延长寿命 · 提升邂逅优质率 · 提高后代天赋</b><br>
          <span class="mini">${esc(dog)}当前累计成长值 <b>${grow}</b></span></div>
        <div class="lvs">${cards}</div>
        <div class="hist">
          <span>累计养成积分 <b>${m.points}</b></span>
          <span>已完成 <b>${m.rounds}</b> 局 · 消除 <b>${m.pairs}</b> 对</span>
          <span>单局最高 <b>${m.best}</b> 分</span>
          <span>最快通关 <b>${m.bestTime ? fmtTime(m.bestTime) : '--:--'}</b></span>
        </div>
      </div>`;
    $$('.lvcard').forEach(b => b.onclick = () => newGame(b.dataset.lv));
  }

  /* ---------- 渲染：棋盘 ---------- */
  function renderBoard() {
    const enCards = S.en.map(w => `
      <button class="card en" data-id="${w.id}">
        <span class="t">${esc(w.word)}</span>
        <span class="p">${esc(w.uk || '')}</span>
        <i class="spk" data-spk="${esc(w.word)}" title="发音">🔊</i>
      </button>`).join('');
    const cnCards = S.cn.map(w => `
      <button class="card cn" data-id="${w.id}">
        <span class="t">${esc(w.cn)}</span>
      </button>`).join('');

    $('#stage').innerHTML = `
      <div class="head">
        <span class="lv">${S.lv.emoji} ${S.lv.name} · ${S.lv.pairs} 对</span>
        <span class="chip" id="time">⏱ ${fmtTime(S.seconds)}</span>
        <span class="chip" id="left">🧩 剩 ${S.left} 对</span>
        <span class="chip pt" id="pt">🌱 ${S.points} 积分</span>
        <span class="chip streak ${S.combo >= COMBO_ON ? 'hot' : ''}" id="combo">🔥 连击 ${S.combo}</span>
        <button class="btn sm" id="quit">↩ 换难度</button>
      </div>
      <div class="prog"><i id="progBar" style="width:0%"></i></div>
      <div class="board" id="board">
        <svg class="lines" id="lines" preserveAspectRatio="none"></svg>
        <div class="col" id="colEn">${enCards}</div>
        <div class="col" id="colCn">${cnCards}</div>
      </div>
      <div class="foot" id="foot">点一个英文，再点它对应的中文意思～ 点卡片上的 🔊 可以听发音</div>`;

    $$('.card').forEach(b => b.onclick = e => {
      if (e.target && e.target.classList.contains('spk')) return; // 喇叭不触发选中
      onPick(b);
    });
    $$('.spk').forEach(s => s.onclick = e => { e.stopPropagation(); speak(s.dataset.spk, s); });
    const q = $('#quit'); if (q) q.onclick = () => { stopTick(); renderStart(); };
  }

  /* ---------- 发音（与项目统一 TTS 一致，带降级） ---------- */
  function speak(text, el) {
    if (el) { el.classList.remove('ring'); void el.offsetWidth; el.classList.add('ring'); }
    try {
      if (window.TTS && TTS.speakEn) { TTS.speakEn(text); return; }
      if ('speechSynthesis' in window) {
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'en-US';
        speechSynthesis.cancel(); speechSynthesis.speak(u);
      }
    } catch (e) {}
  }

  /* ---------- 选卡与判定 ---------- */
  function onPick(btn) {
    if (!S || S.locked || S.over) return;
    if (btn.classList.contains('gone')) return;
    const isEn = btn.classList.contains('en');

    // 再次点击同一张 = 取消选择
    if (btn.classList.contains('sel')) {
      btn.classList.remove('sel');
      if (isEn) S.pickedEn = null; else S.pickedCn = null;
      return;
    }
    // 同侧改选
    const prev = isEn ? S.pickedEn : S.pickedCn;
    if (prev) prev.classList.remove('sel');
    btn.classList.add('sel');
    if (isEn) S.pickedEn = btn; else S.pickedCn = btn;

    if (S.pickedEn && S.pickedCn) judge();
  }

  function judge() {
    const a = S.pickedEn, b = S.pickedCn;
    const ok = a.dataset.id === b.dataset.id;
    S.pickedEn = null; S.pickedCn = null;
    S.locked = true;

    if (ok) {
      drawLine(a, b);
      a.classList.add('hit'); b.classList.add('hit');
      S.combo++;
      if (S.combo > S.maxCombo) S.maxCombo = S.combo;
      let pts = PT_BASE + (S.combo >= COMBO_ON ? PT_COMBO : 0);
      S.points += pts;
      S.left--;

      // ① 养成积分 → 小狗成长系统（寿命 / 邂逅 / 天赋增益）
      grantGrowth(pts);
      // ② 悬浮小狗开心特效 + 狗粮 + 亲密度（与复习页/闯关页同一套逻辑）
      if (window.ReviewBuddy) ReviewBuddy.react(true);

      const w = S.words.filter(x => String(x.id) === String(a.dataset.id))[0];
      setFoot(`✅ <b>${esc(w ? w.word : '')}</b> = ${esc(w ? w.cn : '')} &nbsp;<span class="gain">🌱 养成积分 +${pts}${S.combo >= COMBO_ON ? `（连击 x${S.combo}）` : ''}</span>`, 'ok');
      popPts(a, '+' + pts);
      if (S.combo > 0 && S.combo % 5 === 0 && typeof window.floatHearts === 'function') window.floatHearts(6);

      setTimeout(() => {
        a.classList.add('gone'); b.classList.add('gone');
        a.classList.remove('sel', 'hit'); b.classList.remove('sel', 'hit');
        S.locked = false;
        refreshHead();
        if (S.left <= 0) finish();
      }, 460);
    } else {
      S.miss++;
      S.combo = 0;
      const id = a.dataset.id;
      S.missBy[id] = (S.missBy[id] || 0) + 1;
      a.classList.add('bad'); b.classList.add('bad');
      if (window.ReviewBuddy) ReviewBuddy.react(false); // 只安慰，不扣分

      const wa = S.words.filter(x => String(x.id) === String(a.dataset.id))[0];
      setFoot(`❌ 不是这一对哦，<b>${esc(wa ? wa.word : '')}</b> 的意思是「${esc(wa ? wa.cn : '')}」`, 'bad');
      setTimeout(() => {
        a.classList.remove('bad', 'sel'); b.classList.remove('bad', 'sel');
        S.locked = false;
        refreshHead();
      }, 620);
    }
  }

  /* ---------- 养成积分 → 小狗成长系统 ---------- */
  function grantGrowth(pts) {
    try { if (window.PuppyStudy && PuppyStudy.gain) PuppyStudy.gain('match', pts); } catch (e) {}
  }

  /* ---------- 连线光效 ---------- */
  function drawLine(a, b) {
    const svg = $('#lines');
    if (!svg) return;
    // 以 SVG 自身的框为坐标基准（棋盘有内边距，用 board 会整体偏移）
    const br = svg.getBoundingClientRect();
    if (!br.width || !br.height) return;
    const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
    svg.setAttribute('viewBox', `0 0 ${br.width} ${br.height}`);
    const x1 = ra.right - br.left, y1 = ra.top - br.top + ra.height / 2;
    const x2 = rb.left - br.left, y2 = rb.top - br.top + rb.height / 2;

    const ns = 'http://www.w3.org/2000/svg';
    const g = document.createElementNS(ns, 'g');
    const line = document.createElementNS(ns, 'line');
    line.setAttribute('x1', x1); line.setAttribute('y1', y1);
    line.setAttribute('x2', x2); line.setAttribute('y2', y2);
    line.setAttribute('class', 'ln');
    const d1 = document.createElementNS(ns, 'circle');
    d1.setAttribute('cx', x1); d1.setAttribute('cy', y1); d1.setAttribute('r', 5); d1.setAttribute('class', 'dot');
    const d2 = document.createElementNS(ns, 'circle');
    d2.setAttribute('cx', x2); d2.setAttribute('cy', y2); d2.setAttribute('r', 5); d2.setAttribute('class', 'dot');
    g.appendChild(line); g.appendChild(d1); g.appendChild(d2);
    svg.appendChild(g);
    setTimeout(() => { if (g.parentNode) g.parentNode.removeChild(g); }, 800);
  }

  /* ---------- 积分飘字 ---------- */
  function popPts(card, txt) {
    const board = $('#board'); if (!board) return;
    const br = board.getBoundingClientRect(), cr = card.getBoundingClientRect();
    const el = document.createElement('span');
    el.className = 'pop';
    el.textContent = txt;
    el.style.left = (cr.left - br.left + cr.width / 2) + 'px';
    el.style.top = (cr.top - br.top) + 'px';
    board.appendChild(el);
    setTimeout(() => { if (el.parentNode) el.parentNode.removeChild(el); }, 900);
  }

  function setFoot(html, cls) {
    const f = $('#foot'); if (!f) return;
    f.innerHTML = html;
    f.className = 'foot ' + (cls || '');
  }

  function refreshHead() {
    const pt = $('#pt'), lf = $('#left'), cb = $('#combo'), pb = $('#progBar');
    if (pt) pt.textContent = `🌱 ${S.points} 积分`;
    if (lf) lf.textContent = `🧩 剩 ${S.left} 对`;
    if (cb) { cb.textContent = `🔥 连击 ${S.combo}`; cb.classList.toggle('hot', S.combo >= COMBO_ON); }
    if (pb) pb.style.width = ((S.lv.pairs - S.left) / S.lv.pairs * 100) + '%';
  }

  /* ---------- 结算 ---------- */
  function finish() {
    if (S.over) return;
    S.over = true;
    stopTick();

    const perfect = S.miss === 0;
    let bonusPt = 0, food = CLEAR_FOOD;
    if (perfect) { bonusPt = PERFECT_PT; food += PERFECT_FOOD; }
    if (bonusPt) { S.points += bonusPt; grantGrowth(bonusPt); }
    Store.addFood(food);

    // 反复配错（≥2 次）的单词收入错题本，便于后续巩固
    let wrongAdded = 0;
    Object.keys(S.missBy).forEach(id => {
      if (S.missBy[id] < 2) return;
      const w = S.words.filter(x => String(x.id) === String(id))[0];
      if (w) { Store.addWrong('words', w.id); wrongAdded++; } // 用词库原始 id，保证与错题本类型一致
    });

    const m = Store.addMatchScore(S.points, S.lv.pairs, S.miss, S.seconds);
    if (typeof window.updateChrome === 'function') window.updateChrome();
    if (typeof window.floatHearts === 'function') window.floatHearts(perfect ? 12 : 8);
    if (window.ReviewBuddy && ReviewBuddy.say) {
      ReviewBuddy.say(perfect ? '全对通关！一次都没错，太厉害啦～🎉' : '全部消完啦，辛苦你了！🎉', 'ok');
    }

    const grow = (window.PuppyStudy && PuppyStudy.getState) ? (PuppyStudy.getState().total || 0) : 0;
    const dog = (window.PuppyPet && PuppyPet.name) ? PuppyPet.name() : '奶糖';

    $('#stage').innerHTML = `
      <div class="fin ${perfect ? 'perfect' : ''}">
        <div class="big">${perfect ? '💯' : '🎉'}</div>
        <h3>${perfect ? '完美通关！一次都没配错' : '全部消除完成！'}</h3>
        <div class="nums">
          <span>用时 <b>${fmtTime(S.seconds)}</b></span>
          <span>消除 <b>${S.lv.pairs}</b> 对</span>
          <span>失误 <b>${S.miss}</b> 次</span>
          <span>最高连击 <b>x${S.maxCombo}</b></span>
        </div>
        <div class="reward">
          🌱 本局养成积分 <b>+${S.points}</b>${perfect ? `（含完美奖励 +${PERFECT_PT}）` : ''} 已计入${esc(dog)}的成长系统<br>
          🦴 通关狗粮 <b>+${food}</b>${perfect ? `（含零失误 +${PERFECT_FOOD}）` : ''} · 消除过程中的狗粮已由小狗实时发放
        </div>
        <div class="growbar">
          ${esc(dog)}累计成长值 <b>${grow}</b> · 影响寿命 / 邂逅优质率 / 后代天赋
          ${wrongAdded ? `<br><span class="mini">📕 ${wrongAdded} 个反复配错的单词已收入错题本</span>` : ''}
        </div>
        <div class="hist">累计养成积分 <b>${m.points}</b> · 已完成 ${m.rounds} 局 · 单局最高 ${m.best} 分 · 最快 ${m.bestTime ? fmtTime(m.bestTime) : '--:--'}</div>
        <div class="acts">
          <button class="btn main" id="again">🔁 再来一局（${S.lv.name}）</button>
          <button class="btn" id="back">🎚 换个难度</button>
          <button class="btn" id="toDog">🐶 去看小狗</button>
        </div>
      </div>`;
    $('#again').onclick = () => newGame(S.level);
    $('#back').onclick = () => renderStart();
    $('#toDog').onclick = () => { if (typeof window.switchTo === 'function') window.switchTo('puppy'); };
  }

  /* ---------- 样式（沿用项目粉色系 UI） ---------- */
  const STYLE = `<style>
    :host{ --pink:#ff8fab; --pink-soft:#ffd6e0; --cream:#fff7f0; --ink:#6b5563; --ink-soft:#9a8593;
      font-family:'PingFang SC','Microsoft YaHei','Hiragino Sans GB',sans-serif; display:block; }
    *{box-sizing:border-box;}
    .wrap{max-width:860px; margin:0 auto;}
    .btn{ cursor:pointer; border-radius:14px; padding:11px 22px; font-size:15px; font-weight:700;
      background:#fff; color:var(--ink); border:1px solid #ffd6e0; transition:.15s; }
    .btn:hover{transform:translateY(-1px); box-shadow:0 6px 16px rgba(255,143,171,.25);}
    .btn.main{ background:linear-gradient(135deg,#ff8fab,#ffb3c6); color:#fff; border:none; }
    .btn.sm{padding:5px 12px; font-size:12.5px; border-radius:999px;}

    /* ---- 开始页 / 结算页 ---- */
    .start,.fin{ background:#fff; border:1px solid #ffe3ec; border-radius:20px; padding:32px 26px; text-align:center;
      box-shadow:0 12px 34px rgba(255,143,171,.14); }
    .big{font-size:52px; line-height:1;}
    .start h3,.fin h3{margin:12px 0 6px; color:var(--ink); font-size:22px;}
    .tip{color:var(--ink-soft); margin:0 0 14px; font-size:14px;}
    .rules{display:flex; flex-wrap:wrap; gap:8px; justify-content:center; margin-bottom:14px;}
    .rules span{background:var(--cream); border:1px solid #ffe3ec; color:var(--ink); font-size:12.5px;
      padding:6px 12px; border-radius:999px;}
    .grow{background:linear-gradient(135deg,#fff5f8,#fff9f4); border:1px dashed #ffc9da; border-radius:14px;
      padding:11px 14px; color:var(--ink); font-size:13px; line-height:1.7; margin-bottom:18px;}
    .grow b{color:#ff6b81;}
    .mini{color:var(--ink-soft); font-size:12px;}
    .lvs{display:flex; gap:12px; justify-content:center; flex-wrap:wrap;}
    .lvcard{ cursor:pointer; background:var(--cream); border:1.5px solid #ffe3ec; border-radius:18px;
      padding:16px 26px; display:flex; flex-direction:column; align-items:center; gap:3px; transition:.16s; }
    .lvcard:hover{border-color:var(--pink); background:#fff; transform:translateY(-3px);
      box-shadow:0 10px 24px rgba(255,143,171,.22);}
    .lvcard .e{font-size:26px;}
    .lvcard .n{font-weight:800; color:var(--ink); font-size:16px;}
    .lvcard .d{color:var(--ink-soft); font-size:12.5px;}
    .hist{margin-top:18px; display:flex; flex-wrap:wrap; gap:14px; justify-content:center;
      color:var(--ink-soft); font-size:13px;}
    .hist b{color:var(--ink); font-size:15px;}

    /* ---- 顶部信息条 ---- */
    .head{display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:10px;}
    .head .lv{background:linear-gradient(135deg,#ff8fab,#ffb3c6); color:#fff; font-weight:800;
      padding:5px 14px; border-radius:999px; font-size:13.5px;}
    .head .chip{background:#fff; border:1px solid #ffd6e0; color:var(--ink); padding:5px 12px;
      border-radius:999px; font-size:12.5px; font-weight:700;}
    .head .chip.pt{color:#3f9d6d; border-color:#c7ecd6; background:#f2fbf6;}
    .head .streak{color:var(--ink-soft); font-weight:600;}
    .head .streak.hot{color:#ff6b81; font-weight:800; border-color:var(--pink);
      animation:pulse .6s ease infinite alternate;}
    @keyframes pulse{from{transform:scale(1)}to{transform:scale(1.09)}}
    .head #quit{margin-left:auto;}
    .prog{position:relative; height:9px; background:#ffe9f0; border-radius:999px; margin-bottom:14px; overflow:hidden;}
    .prog i{position:absolute; left:0; top:0; bottom:0; background:linear-gradient(90deg,#ff8fab,#ffb3c6);
      border-radius:999px; transition:width .35s;}

    /* ---- 棋盘 ---- */
    .board{ position:relative; display:grid; grid-template-columns:1fr 1fr; gap:0 54px;
      background:#fff; border:1px solid #ffe3ec; border-radius:20px; padding:18px 18px;
      box-shadow:0 12px 34px rgba(255,143,171,.12); }
    .lines{position:absolute; left:18px; top:18px; right:18px; bottom:18px; width:calc(100% - 36px);
      height:calc(100% - 36px); pointer-events:none; z-index:6; overflow:visible;}
    .lines .ln{stroke:#ff8fab; stroke-width:3; stroke-linecap:round; animation:lnIn .42s ease forwards;}
    .lines .dot{fill:#ff6b81; animation:dotIn .42s ease forwards;}
    @keyframes lnIn{0%{opacity:0} 25%{opacity:1} 70%{opacity:1} 100%{opacity:0}}
    @keyframes dotIn{0%{opacity:0; transform:scale(.4)} 30%{opacity:1; transform:scale(1.25)}
      100%{opacity:0; transform:scale(1)}}
    .lines .dot{transform-box:fill-box; transform-origin:center;}
    .col{display:flex; flex-direction:column; gap:10px;}

    .card{ position:relative; cursor:pointer; text-align:left; width:100%;
      background:var(--cream); border:1.5px solid #ffe3ec; border-radius:14px;
      padding:12px 14px; color:var(--ink); transition:transform .14s, background .14s, border-color .14s, box-shadow .14s;
      display:flex; flex-direction:column; gap:2px; min-height:56px; justify-content:center; }
    .card:hover:not(.gone){border-color:var(--pink); background:#fff; transform:translateY(-2px);
      box-shadow:0 8px 18px rgba(255,143,171,.18);}
    .card .t{font-size:16px; font-weight:700; line-height:1.35;}
    .card.en .t{letter-spacing:.3px;}
    .card .p{font-size:11.5px; color:var(--ink-soft);}
    .card .spk{ position:absolute; right:9px; top:50%; transform:translateY(-50%);
      font-size:14px; font-style:normal; opacity:.55; cursor:pointer; padding:3px 4px; border-radius:50%; }
    .card .spk:hover{opacity:1; background:#ffe9f0;}
    .card .spk.ring{animation:spkRing .5s ease;}
    @keyframes spkRing{0%{transform:translateY(-50%) scale(1)} 55%{transform:translateY(-50%) scale(1.3)} 100%{transform:translateY(-50%) scale(1)}}

    .card.sel{ background:#fff; border-color:var(--pink); box-shadow:0 0 0 3px rgba(255,143,171,.2);
      transform:translateY(-2px); }
    .card.hit{ background:#e9f9ef; border-color:#7bd8a0; color:#2e7d4f;
      box-shadow:0 0 0 4px rgba(123,216,160,.25); }
    .card.bad{ background:#ffecec; border-color:#ff9c9c; color:#c0392b; animation:shake .34s ease; }
    @keyframes shake{0%,100%{transform:translateX(0)} 20%{transform:translateX(-7px)}
      45%{transform:translateX(6px)} 70%{transform:translateX(-4px)}}
    .card.gone{ visibility:hidden; opacity:0; transform:scale(.7); pointer-events:none;
      transition:opacity .3s, transform .3s; }

    .pop{ position:absolute; z-index:8; pointer-events:none; transform:translate(-50%,0);
      color:#3f9d6d; font-weight:800; font-size:16px; text-shadow:0 1px 3px rgba(255,255,255,.9);
      animation:popUp .9s ease-out forwards; }
    @keyframes popUp{0%{opacity:0; transform:translate(-50%,6px) scale(.8)}
      25%{opacity:1; transform:translate(-50%,-6px) scale(1.1)}
      100%{opacity:0; transform:translate(-50%,-34px) scale(1)}}

    .foot{margin-top:12px; text-align:center; font-size:13.5px; color:var(--ink-soft);
      background:var(--cream); border:1px solid #ffe3ec; border-radius:12px; padding:9px 14px; min-height:38px;}
    .foot.ok{background:#e9f9ef; border-color:#c7ecd6; color:#2e7d4f;}
    .foot.bad{background:#ffecec; border-color:#ffd0d0; color:#c0392b;}
    .foot .gain{color:#3f9d6d; font-weight:800;}

    /* ---- 结算 ---- */
    .fin .nums{display:flex; gap:16px; justify-content:center; flex-wrap:wrap; margin:10px 0 12px;
      color:var(--ink-soft); font-size:14px;}
    .fin .nums b{color:var(--ink); font-size:19px;}
    .fin .reward{background:var(--cream); border:1px solid #ffe3ec; display:inline-block;
      padding:11px 18px; border-radius:14px; color:var(--ink); font-size:13.5px; line-height:1.8;}
    .fin .reward b{color:#ff6b81; font-size:16px;}
    .fin .growbar{margin-top:12px; color:var(--ink-soft); font-size:13px; line-height:1.7;}
    .fin .growbar b{color:#3f9d6d; font-size:15px;}
    .fin.perfect .big{animation:pulse .7s ease infinite alternate;}
    .fin .acts{margin-top:18px; display:flex; gap:10px; justify-content:center; flex-wrap:wrap;}

    @media (max-width:640px){
      .board{gap:0 14px; padding:12px 10px;}
      .lines{left:10px; right:10px; top:12px; bottom:12px; width:calc(100% - 20px); height:calc(100% - 24px);}
      .card{padding:10px 10px; min-height:50px;}
      .card .t{font-size:14px;}
      .card .p{display:none;}
      .card .spk{right:4px; font-size:12px;}
      .start,.fin{padding:22px 14px;}
      .lvcard{padding:12px 18px;}
      .head .chip{font-size:11.5px; padding:4px 9px;}
    }
  </style>`;

  /* ---------- 挂载 ---------- */
  window.CET4Modules = window.CET4Modules || {};
  window.CET4Modules['word-match'] = {
    mount(c) {
      stopTick();
      const host = document.createElement('div');
      c.appendChild(host);
      root = host.attachShadow({ mode: 'open' });
      root.innerHTML = STYLE + `<div class="wrap"><div id="stage"></div></div>`;
      // 右上角悬浮小狗伙伴（与复习页/闯关页同一只，特效与狗粮逻辑完全复用）
      if (window.ReviewBuddy) ReviewBuddy.attach(c);
      renderStart();
    }
  };
})();
