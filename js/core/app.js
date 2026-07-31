/*!
 * app.js —— 应用入口：路由、首页渲染、打卡、进度导入导出、PWA 注册
 * ---------------------------------------------------------------------------
 * 它是最后执行的脚本，此时 Store / TTS / 各业务模块都已就绪。
 *
 * 路由机制很朴素：每个模块在 index.html 里对应一个 <section class="module-panel">，
 * 切换时给目标面板加 .active，并调用 window.CET4Modules[id].mount(容器元素)。
 * 各模块之间零耦合，新增一个模块只需三步：
 *   1) index.html 加一个 nav 按钮 + 一个 module-panel 容器；
 *   2) js/modules/ 下新建文件，注册 window.CET4Modules['xxx'] = { mount(c){...} }；
 *   3) 这里的 MODULE_META / HOME_CARDS 补一条文案。
 * ---------------------------------------------------------------------------
 */
(function () {
  // 读取 localStorage 里的学习进度（每台设备一份，用户之间互不影响）
  Store.load();

  const MODULE_META = {
    home:         { title: '欢迎回来，小可爱～', sub: '今天也要元气满满地备考哦' },
    'words-learn':  { title: '📚 单词学习', sub: '核心单词卡片 · 发音 · 趣味记忆 · 真题例句' },
    'words-review': { title: '🔁 单词复习', sub: '听音默写 · 释义填词 · 真题挖空 · 艾宾浩斯推送' },
    'word-quiz':    { title: '🏆 单词闯关', sub: '随机出题 · 连击加分 · 小狗陪闯 · 积分同步看板' },
    'word-match':   { title: '🧩 单词消消乐', sub: '左右连线配对 · 消除积分喂小狗成长' },
    listening:    { title: '🎧 听力专项', sub: '对话/新闻/篇章 · 倍速 · 逐句循环 · 点句翻译' },
    reading:      { title: '📖 分级阅读', sub: '一句一译 · 长难句拆解 · 答案解析' },
    essays:       { title: '✍️ 作文素材库', sub: '万能模板 · 高级句式 · 低分词替换 · 范文解析' },
    puppy:        { title: '🐶 小狗养成', sub: '软萌金毛 · 狗粮养成 · 成长闭环 · 繁育玩法' },
    dashboard:    { title: '📊 学习数据看板', sub: '任务清单 · 词汇进度 · 打卡日历 · 错题本 · 周统计' },
    sync:         { title: '🔄 数据同步', sub: '手机 ↔ 电脑 进度互通 · 私密房间名 · 公共中继' }
  };

  const HOME_CARDS = [
    { id: 'words-learn',  emoji: '📚', title: '单词学习', desc: '卡片发音 + 趣味记忆' },
    { id: 'words-review', emoji: '🔁', title: '单词复习', desc: '听音默写 + 艾宾浩斯' },
    { id: 'word-quiz',    emoji: '🏆', title: '单词闯关', desc: '随机出题 + 连击积分' },
    { id: 'word-match',   emoji: '🧩', title: '单词消消乐', desc: '连线配对 + 养成积分' },
    { id: 'listening',    emoji: '🎧', title: '听力专项', desc: '倍速 + 逐句循环' },
    { id: 'reading',      emoji: '📖', title: '分级阅读', desc: '一句一译 + 解析' },
    { id: 'essays',       emoji: '✍️', title: '作文素材', desc: '模板 + 范文解析' },
    { id: 'puppy',        emoji: '🐶', title: '小狗养成', desc: '狗粮 + 成长闭环' },
    { id: 'dashboard',    emoji: '📊', title: '数据看板', desc: '进度 + 错题 + 周报' }
  ];

  const nav = document.getElementById('nav');
  const panels = document.querySelectorAll('.module-panel');
  const topTitle = document.getElementById('topTitle');
  const topSub = document.getElementById('topSub');
  const builtModules = window.CET4Modules || {};

  function updateChrome() {
    document.getElementById('foodCount').textContent = Store.getFood();
    const btn = document.getElementById('checkinBtn');
    if (Store.hasCheckedToday()) {
      btn.textContent = '✅ 已打卡';
      btn.classList.add('done');
    } else {
      btn.textContent = '☀️ 今日打卡';
      btn.classList.remove('done');
    }
  }

  function renderHome() {
    const s = Store.state;
    const dog = s.dog;
    const stats = s.stats;
    const totalReviews = s.reviewLog.length;
    const correct = s.reviewLog.reduce((a, r) => a + r.correct, 0);
    const totalQ = s.reviewLog.reduce((a, r) => a + r.total, 0);
    const acc = totalQ ? Math.round(correct / totalQ * 100) : 0;

    const statHtml = [
      ['📚 已学单词', stats.learned],
      ['🎯 复习正确率', acc + '%'],
      ['🦴 狗粮', Store.getFood()],
      ['🔥 连续打卡', s.checkin.streak + ' 天'],
      ['🐶 小狗等级', 'Lv.' + dog.level + '（' + stageName(dog.stage) + '）']
    ].map(([k, v]) =>
      `<div class="cloud-card" style="padding:12px 16px;min-width:120px">
         <div class="muted" style="font-size:12px">${k}</div>
         <div style="font-size:20px;font-weight:800;color:var(--ink-strong)">${v}</div>
       </div>`).join('');

    document.getElementById('homeStats').innerHTML = statHtml;

    document.getElementById('homeGrid').innerHTML = HOME_CARDS.map(c =>
      `<div class="home-card" data-go="${c.id}">
         <div class="hc-emoji">${c.emoji}</div>
         <div class="hc-title">${c.title}</div>
         <div class="hc-desc">${c.desc}</div>
       </div>`).join('');

    document.querySelectorAll('.home-card').forEach(el =>
      el.addEventListener('click', () => switchTo(el.dataset.go)));
  }

  function stageName(st) {
    return { baby: '幼年奶狗', teen: '少年幼犬', adult: '成年大狗' }[st] || st;
  }

  function switchTo(id) {
    // 离开当前模块前先掐掉所有声音（朗读 + 真题原声），
    // 否则从听力页切走后音频还在后台响，属于典型的「声音重叠」体验问题。
    try { if (window.TTS && TTS.stop) TTS.stop(); } catch (e) {}

    const meta = MODULE_META[id] || MODULE_META.home;
    topTitle.textContent = meta.title;
    topSub.textContent = meta.sub;
    // 每个模块进入后只保留页内大标题（module-head 里的 h2），隐藏顶部标题栏
    // 首页（home）保留顶部欢迎标题
    const showTop = (id === 'home');
    topTitle.style.display = showTop ? '' : 'none';
    topSub.style.display = showTop ? '' : 'none';

    nav.querySelectorAll('.nav-item').forEach(b =>
      b.classList.toggle('active', b.dataset.module === id));
    panels.forEach(p => p.classList.toggle('active', p.id === 'mod-' + id));

    if (id === 'home') { renderHome(); }
    else {
      const body = document.getElementById('body-' + id);
      const mod = builtModules[id];
      if (mod && typeof mod.mount === 'function') {
        body.innerHTML = '';
        mod.mount(body);
      } else {
        body.innerHTML =
          `<div class="placeholder"><span class="ph-emoji">🛠️</span>
           该模块将在后续阶段建设中～<br/>当前为 Phase 0 脚手架。</div>`;
      }
    }
    updateChrome();
  }

  // 导航事件
  nav.addEventListener('click', e => {
    const b = e.target.closest('.nav-item');
    if (b) switchTo(b.dataset.module);
  });

  // 打卡
  document.getElementById('checkinBtn').addEventListener('click', () => {
    if (Store.hasCheckedToday()) { updateChrome(); return; }
    const r = Store.doCheckin();
    if (r.ok) {
      Store.addFood(10);
      floatHearts(8);
      updateChrome();
      renderHome();
    }
  });

  /* ---- 进度备份 / 恢复（跨设备 / U 盘携带） ---- */
  const importFile = document.getElementById('importFile');
  document.getElementById('exportBtn').addEventListener('click', () => {
    const payload = {
      app: 'cet4-workbench',
      v: 1,
      exportedAt: new Date().toISOString(),
      data: Store.exportState()
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const ts = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `四级进度_${ts}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    floatHearts(4);
    alert('已导出进度文件 💾\n把它存到 U 盘，换电脑后用「📂 恢复进度」就能接着学～');
  });
  document.getElementById('importBtn').addEventListener('click', () => importFile.click());
  importFile.addEventListener('change', e => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const obj = JSON.parse(reader.result);
        if (!obj || obj.app !== 'cet4-workbench' || !obj.data) {
          alert('这不是本平台的进度文件，导入已取消 ❌');
          return;
        }
        if (!confirm('恢复进度会覆盖当前这台电脑上的学习记录，确定继续吗？\n（建议先点「💾 备份进度」留个底）')) return;
        Store.importState(obj.data);
        alert('进度已恢复 ✅ 页面即将刷新…');
        location.reload();
      } catch (err) {
        alert('文件读取失败，请确认是有效的进度备份 ❌');
      } finally {
        importFile.value = '';
      }
    };
    reader.readAsText(file);
  });

  // 飘心特效
  function floatHearts(n) {
    for (let i = 0; i < n; i++) {
      const h = document.createElement('div');
      h.className = 'fx-heart';
      h.textContent = ['💗', '🌸', '🐾', '⭐'][i % 4];
      h.style.left = (window.innerWidth / 2 + (Math.random() * 200 - 100)) + 'px';
      h.style.top = (window.innerHeight / 2) + 'px';
      document.body.appendChild(h);
      setTimeout(() => h.remove(), 1200);
    }
  }
  window.floatHearts = floatHearts;

  /* ---- PWA：注册 Service Worker ----
     手机上「添加到主屏幕」后可像 APP 一样全屏打开，外壳资源离线可用。
     注意：改动任何被 sw.js 缓存的文件后，必须同时提升 sw.js 里的 CACHE 版本号，
     否则已安装的手机端会一直吃旧缓存、看不到新功能。 */
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch(e => console.warn('[SW] 注册失败', e));
    });
  }

  /* ---- 语音预热 ----
     首屏空闲时提前把发音人列表拉好，消除「第一次点喇叭要等一下」的延迟。
     真正的出声权限仍需用户手势，audio.js 已在 document 上挂了一次性解锁监听。 */
  const warmTTS = () => { try { window.TTS && TTS.preload && TTS.preload(); } catch (e) {} };
  if ('requestIdleCallback' in window) requestIdleCallback(warmTTS, { timeout: 2500 });
  else setTimeout(warmTTS, 1200);

  // 暴露给各模块
  window.switchTo = switchTo;
  window.updateChrome = updateChrome;
  window.stageName = stageName;

  // 启动
  renderHome();
  updateChrome();
  // 首页 hero 软萌金毛（替换丑丑的 emoji）
  const hd = document.getElementById('homeDog');
  if (hd && window.CuteDog) hd.innerHTML = window.CuteDog.svg('adult');
})();
