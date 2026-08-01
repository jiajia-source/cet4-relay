/* 小狗养成模块 · 世代循环玩法（汤姆猫软萌风）
 * 用 Shadow DOM 隔离样式，数据走 Store（state.puppy），喂食消耗狗粮（Store.food），
 * 学习联动通过 window.PuppyStudy.gain() 驱动寿命/邂逅/天赋增益。
 */
window.CET4Modules = window.CET4Modules || {};

(function () {
  "use strict";

  /* ============ 常量 ============ */
  const COLORS = {
    gold:  { c: '#f6d98a', l: '#fbe6b0' },
    brown: { c: '#d9a066', l: '#f0d3b0' },
    white: { c: '#f3e9dc', l: '#ffffff' },
    cream: { c: '#e9c46a', l: '#fbe6b0' },
    gray:  { c: '#b9b2a6', l: '#ddd9d2' },
    choco: { c: '#a9744f', l: '#d8b48f' }
  };
  const NPC_NAMES = ['旺财','小白','巧克力','咖啡','雪球','布丁','奶昔','大金','黑米','花卷','麻薯','汤圆','年糕','可乐'];
  const GIFTS = [
    { icon: '💌', name: '旅行明信片', desc: '奶糖在远方寄来的明信片，画着它看到的风景，背面写着「主人也要好好学哦」。' },
    { icon: '📮', name: '手绘信封', desc: '奶糖用爪印画了一幅小画塞进信封，歪歪扭扭却格外可爱。' },
    { icon: '🎫', name: '当地邮票', desc: '一张印着海边小花的邮票，奶糖说集邮这件事它偷偷学会了。' },
    { icon: '🐚', name: '小贝壳', desc: '从海边捡来的贝壳，贴在耳边仿佛能听见海浪声，是奶糖的小珍藏。' },
    { icon: '🍬', name: '当地小零食', desc: '旅行地特色糖果，香香甜甜的，奶糖舍不得吃特意带回来给你尝。' },
    { icon: '🧸', name: '绒毛玩具', desc: '一只和它长得一模一样的小绒狗，放在收藏柜里像多了个迷你奶糖。' },
    { icon: '🦴', name: '异乡骨头', desc: '当地特产的磨牙骨头，带着淡淡的青草香，奶糖说这是最爱的伴手礼。' },
    { icon: '🪨', name: '幸运小石头', desc: '一块被海水磨得圆润的小石头，奶糖说摸一摸会带来好运。' },
    { icon: '🍃', name: '树叶书签', desc: '夹着干枯枫叶的手作书签，带着森林的气息，最适合夹进单词本。' },
    { icon: '🍖', name: '特色肉干', desc: '旅行地风味肉干，香喷喷的，奶糖说这是它一路上最想念的味道。' }
  ];
  const STAGE_NAMES = { baby: '宝宝', teen: '少年', adult: '成年', elder: '老年' };
  const STAGE_ORDER = ['baby', 'teen', 'adult', 'elder'];

  /* ============ 模块级状态 ============ */
  function darker(hex) {
    const n = parseInt(hex.slice(1), 16);
    let r = (n >> 16) - 32, g = ((n >> 8) & 255) - 32, b = (n & 255) - 32;
    return '#' + ((1 << 24) + (Math.max(0, r) << 16) + (Math.max(0, g) << 8) + Math.max(0, b)).toString(16).slice(1);
  }
  function makeDog(o) {
    return Object.assign({
      id: '', name: '小狗', gen: 1, sex: 'F', colorKey: 'gold',
      stage: 'baby', age: 0, alive: true, bornAt: Date.now(),
      hunger: 80, mood: 90, energy: 75, intimacy: 50,
      friends: [], partnerId: null, spouseId: null, married: false,
      affection: 0, offspring: [], talent: 50, parentId: null
    }, o);
  }
  function refreshS() { S = Store.state.puppy; }

  const STAGE_SCALE = { baby: 0.66, teen: 0.86, adult: 1.06, elder: 1.0 };

  let S = Store.state.puppy;
  const save = () => Store.save();
  let root = null;
  let timers = [];
  const setT = (fn, ms) => { const id = setInterval(fn, ms); timers.push(id); return id; };
  const $ = s => (root ? root.querySelector(s) : null);
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const rnd = n => Math.floor(Math.random() * n);
  const pick = a => a[rnd(a.length)];
  const me = () => S.dogs[S.currentId];
  const npc = id => S.npcs[id];

  /* ============ 成长节奏（真实时间驱动） ============
   * 1 岁 = 1 个真实自然日，年龄由「出生时间戳 → 现在」推导，页面关不关都照常走。
   * 基础寿命 32 天，学习越多越长寿（+25 上限），所以完整一生 32~57 天，一个月起步。 */
  const DAY_MS = 24 * 60 * 60 * 1000;
  const BASE_LIFE = 32;
  const STAGE_BOUND = [0, 0.15, 0.40, 0.80, 1];   // 宝宝 / 少年 / 成年 / 老年 的分界比例

  /* ============ 增益计算 ============ */
  function lifeBonus()    { return Math.min(25, Math.floor(S.study.total / 4)); }
  function encounterBonus(){ return Math.min(0.6, S.study.total / 120); }
  function talentBonus()  { return Math.min(45, Math.floor(S.study.total / 3)); }
  function maxLife()      { return BASE_LIFE + lifeBonus(); }
  function stageOf(age, ml) {
    if (age < ml * STAGE_BOUND[1]) return 'baby';
    if (age < ml * STAGE_BOUND[2]) return 'teen';
    if (age < ml * STAGE_BOUND[3]) return 'adult';
    return 'elder';
  }
  // 精确年龄（带小数的天），用于成长进度条
  function ageFloatOf(d) {
    if (!d) return 0;
    if (!d.bornAt) d.bornAt = Date.now() - (d.age || 0) * DAY_MS;
    return Math.max(0, (Date.now() - d.bornAt) / DAY_MS);
  }
  function fmtDur(days) {
    if (days >= 1) {
      const d = Math.floor(days), h = Math.floor((days - d) * 24);
      return h ? d + ' 天 ' + h + ' 小时' : d + ' 天';
    }
    const h = Math.floor(days * 24), mi = Math.floor((days * 24 - h) * 60);
    return h ? h + ' 小时 ' + mi + ' 分' : Math.max(1, mi) + ' 分钟';
  }
  function lifeInfo() {
    const m = me(), ml = maxLife(), af = ageFloatOf(m);
    const idx = Math.max(0, STAGE_ORDER.indexOf(m.stage));
    const nextAt = idx < 3 ? STAGE_BOUND[idx + 1] * ml : ml;
    return { m, ml, af, idx, nextAt, pct: Math.min(100, af / ml * 100), remain: Math.max(0, nextAt - af) };
  }

  /* ============ 基础动画 ============ */
  function pose(x, y, rot) {
    const d = $('#dog'); if (!d) return;
    const st = $('#stage'); const k = st ? st.clientWidth / 440 : 1;
    const s = STAGE_SCALE[me().stage] || 0.9;
    d.style.transform = `translate(${x*k}px,${y*k}px) rotate(${rot || 0}deg) scale(${s})`;
  }
  function applyStagePose() {
    pose(0, 0, 0);
    const d = $('#dog'); if (!d) return;
    if (me().stage === 'elder') d.classList.add('elder'); else d.classList.remove('elder');
  }
  function say(t) { const b = $('#bubble'); if (!b) return; b.textContent = t; b.classList.add('show'); clearTimeout(say._t); say._t = setTimeout(() => b.classList.remove('show'), 1700); }
  function speak(t) { try { if (window.TTS && TTS.speakZh) TTS.speakZh(t); else if ('speechSynthesis' in window) { const u = new SpeechSynthesisUtterance(t); u.lang = 'zh-CN'; speechSynthesis.cancel(); speechSynthesis.speak(u); } } catch (e) {} }
  function mouthOpen(on) { const m = $('#mouth'), mo = $('#mouthOpen'); if (m) m.style.opacity = on ? 0 : 1; if (mo) mo.style.opacity = on ? 1 : 0; }
  function mouthScreen() {
    const mo = $('#mouthOpen'); const st = $('#stage'); if (!mo || !st) return { x: 50, y: 78 };
    const r = mo.getBoundingClientRect(); const s = st.getBoundingClientRect();
    return { x: (r.left - s.left + r.width / 2) / s.width * 100, y: (r.top - s.top + r.height / 2) / s.height * 100 };
  }

  /* ============ 基础交互 ============ */
  let busy = false, locked = false;
  function setBusy(b) { locked = b; root.querySelectorAll('.acts button').forEach(x => { if (!x.classList.contains('hot')) x.disabled = b; }); }
  function setBtn(act, on) { const b = root.querySelector(`.acts button[data-act="${act}"]`); if (b) b.classList.toggle('on', on); }

  async function doFeed() {
    if (busy || locked) return;
    if (Store.getFood() < 5) { say('狗粮不够啦，先去学习赚狗粮吧～'); toast('🦴 狗粮不足'); return; }
    busy = true; setBtn('feed', true);
    Store.spendFood(5); if (window.updateChrome) window.updateChrome();
    me().hunger = Math.min(100, me().hunger + 15); renderBars(); save();
    pose(0, 74, 8); mouthOpen(true); say('呜呜…（吃）');
    await sleep(1150);
    const m = mouthScreen(); const bone = $('#bone');
    if (bone) { bone.style.left = (m.x - 3.4) + '%'; bone.style.top = (m.y - 2.4) + '%'; bone.style.opacity = 1; }
    for (let i = 0; i < 3; i++) { await sleep(260); mouthOpen(false); await sleep(220); mouthOpen(true); }
    mouthOpen(false); if (bone) bone.style.opacity = 0; pose(0, 0, 0);
    me().mood = Math.min(100, me().mood + 5); renderBars(); save();
    say('吃饱啦～'); setBtn('feed', false); busy = false;
  }
  async function doPet() {
    if (busy || locked) return; busy = true; setBtn('pet', true);
    const hand = $('#hand'), head = $('#head');
    if (hand) hand.style.opacity = 1; say('最喜欢你摸头了'); speak('好舒服');
    if (head) head.style.transform = 'translateY(-2px)';
    await sleep(1500);
    if (hand) hand.style.opacity = 0; if (head) head.style.transform = '';
    me().mood = Math.min(100, me().mood + 8); me().intimacy = Math.min(100, me().intimacy + 5); renderBars(); save();
    say('再摸一下嘛～'); setBtn('pet', false); busy = false;
  }
  async function doPlay() {
    if (busy || locked) return; busy = true; setBtn('play', true);
    say('去捡球！'); speak('去捡球');
    const ball = $('#ball');
    for (let r = 0; r < 3; r++) {
      const breath = $('#breath');
      if (ball) { ball.style.opacity = 1; ball.style.left = '45.5%'; ball.style.top = '75.3%'; }
      if (breath) breath.classList.add('hop'); await sleep(420); if (breath) breath.classList.remove('hop');
      if (ball) { ball.style.left = '50.5%'; ball.style.top = '57.6%'; } await sleep(400); say('捡到啦！');
      await sleep(500); if (ball) { ball.style.top = '256px'; ball.style.left = '200px'; } await sleep(400);
    }
    if (ball) ball.style.opacity = 0;
    me().energy = Math.max(0, me().energy - 12); me().mood = Math.min(100, me().mood + 6); renderBars(); save();
    say('玩得好开心～'); setBtn('play', false); busy = false;
  }
  async function doSleep() {
    if (busy || locked) return; busy = true; setBtn('sleep', true);
    const bed = $('#bed'), z = $('#z'), dog = $('#dog');
    if (bed) bed.style.opacity = 1; say('去睡觉觉'); speak('晚安');
    pose(120, 0, 0); await sleep(1150);
    pose(120, 60, 8); if (dog) dog.classList.add('sleeping'); await sleep(1000);
    if (z) z.style.opacity = 1; await sleep(10500);
    if (z) z.style.opacity = 0; if (dog) dog.classList.remove('sleeping'); pose(0, 0, 0); if (bed) bed.style.opacity = 0;
    me().energy = Math.min(100, me().energy + 30); me().mood = Math.min(100, me().mood + 4); renderBars(); save();
    say('睡饱啦，精神多了！'); setBtn('sleep', false); busy = false;
  }

  /* ============ 外出：交友 / 邂逅 ============ */
  async function doOut() {
    if (busy || locked) return;
    const st = me().stage;
    if (st === 'baby') { say('宝宝还不能自己出门哦～'); return; }
    if (me().energy < 15) { say('太累啦，先睡一觉吧'); return; }
    busy = true; setBusy(true);
    const isTeen = st === 'teen';
    me().energy -= 15; renderBars(); save();
    say(isTeen ? '出门交朋友啦！' : '出门去邂逅啦！'); speak('我出门啦');
    pose(-480, 0, 0); await sleep(1100);
    const n = makeNpc(isTeen); S.npcs[n.id] = n; S.currentNPC = n.id; save();
    await sleep(3200);
    pose(0, 0, 0); await sleep(1100);
    showVisitor(n);
    if (isTeen) {
      if (!me().friends.includes(n.id)) me().friends.push(n.id);
      say('认识了新朋友 ' + n.name + '！'); renderSocial();
    } else {
      say('遇到了 ' + n.name + '～（好感 ' + me().affection + '）'); renderSocial();
    }
    renderFamily(); setBusy(false); busy = false;
  }
  function makeNpc(teen) {
    const opp = me().sex === 'M' ? 'F' : 'M';
    const sex = teen ? (Math.random() < 0.5 ? 'M' : 'F') : opp;
    const p = Math.random() < encounterBonus() ? 1 : 0;
    return { id: 'n' + Date.now() + rnd(999), name: pick(NPC_NAMES), sex,
      colorKey: pick(['brown', 'white', 'cream', 'gray', 'choco']),
      personality: pick(['活泼', '温柔', '傲娇', '憨厚', '机灵', '粘人']), quality: p };
  }
  function showVisitor(n) {
    const visitor = $('#visitor'); if (!visitor) return;
    if (!n) { visitor.classList.remove('show'); visitor.innerHTML = ''; return; }
    const cm = COLORS[n.colorKey] || COLORS.brown;
    visitor.innerHTML = `<div class="vclose" id="vClose">×</div>` + buildNpcSvg(cm) + `<div class="vname">${n.name}·${n.sex === 'M' ? '♂' : '♀'}</div>`;
    visitor.classList.add('show');
    const vc = $('#vClose'); if (vc) vc.onclick = () => { visitor.classList.remove('show'); S.currentNPC = null; save(); };
  }
  function buildNpcSvg(cm, decor) {
    const c = cm.c, l = cm.l, d = darker(c);
    let extra = '';
    if (decor === 'tie') {
      extra = `<polygon points="60,84 45,77 45,91" fill="#c0392b"/><polygon points="60,84 75,77 75,91" fill="#c0392b"/>`
            + `<rect x="56" y="80" width="8" height="8" rx="2" fill="#7d2018"/>`;
    } else if (decor === 'bow') {
      extra = `<path d="M60,84 C52,76 45,78 46,84 C45,90 52,92 60,84 Z" fill="#ffaed3"/>`
            + `<path d="M60,84 C68,76 75,78 74,84 C75,90 68,92 60,84 Z" fill="#ffaed3"/>`
            + `<circle cx="60" cy="84" r="3.6" fill="#ef8fb8"/>`
            + `<path d="M59,87 q-3,7 -5,10" stroke="#ffaed3" stroke-width="2.4" fill="none" stroke-linecap="round"/>`
            + `<path d="M61,87 q3,7 5,10" stroke="#ffaed3" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
    }
    return `<svg viewBox="0 0 120 130" width="72" height="78">
      <ellipse cx="60" cy="96" rx="36" ry="32" fill="${c}"/>
      <ellipse cx="60" cy="104" rx="22" ry="20" fill="${l}"/>
      <ellipse cx="42" cy="44" rx="9" ry="14" fill="${d}" transform="rotate(-14 42 44)"/>
      <ellipse cx="78" cy="44" rx="9" ry="14" fill="${d}" transform="rotate(14 78 44)"/>
      <circle cx="60" cy="62" r="30" fill="${c}"/>
      <ellipse cx="60" cy="74" rx="19" ry="14" fill="${l}"/>
      <ellipse cx="60" cy="69" rx="6" ry="4.5" fill="#5b4636"/>
      <circle cx="51" cy="58" r="4.6" fill="#3a2c22"/><circle cx="69" cy="58" r="4.6" fill="#3a2c22"/>
      <path d="M60,73 q0,7 -6,8 M60,73 q0,7 6,8" stroke="#5b4636" stroke-width="2" fill="none" stroke-linecap="round"/>
      ${extra}
    </svg>`;
  }

  /* ============ 社交互动 ============ */
  function socialInteract(kind) {
    const n = npc(S.currentNPC); if (!n) return;
    if (me().energy < 6) { say('体力不够，先休息'); return; }
    me().energy -= 6;
    if (me().stage === 'teen') {
      if (kind === 'play') { me().intimacy = Math.min(100, me().intimacy + 8); me().mood = Math.min(100, me().mood + 6); say('和 ' + n.name + ' 玩得好开心！'); }
    } else {
      if (kind === 'chat') { me().affection = Math.min(100, me().affection + 2); say('和 ' + n.name + ' 聊得投机～'); }
      else if (kind === 'gift') { openGiftChoice(n); return; }
      else if (kind === 'confess') { if (me().affection >= 60) { me().partnerId = n.id; say('💞 和 ' + n.name + ' 恋爱啦！'); } else say('好感还不够哦（需≥60）'); }
      else if (kind === 'propose') { if (me().affection >= 100) { doMarry(n); return; } else say('好感要拉满才能求婚哦'); }
    }
    renderBars(); renderSocial(); renderFamily(); save();
  }
  // 送礼：真实接入时恢复「必须有旅行礼物才能送」（去掉 testMode 分支即可）
  function openGiftChoice(n) {
    const testMode = !S.gifts.length;
    const list = testMode ? [{ icon: '💝', name: '心意', note: '一份心意' }] : S.gifts;
    const btns = list.map((g, i) => ({ t: g.icon + ' ' + g.name, cls: '', fn: () => {
      if (!testMode) { S.gifts.splice(i, 1); }
      me().affection = Math.min(100, me().affection + 15);
      closeModal(); say('送了' + g.name + '，' + n.name + ' 超开心💝'); renderBars(); renderSocial(); renderShelf(); save();
    }}));
    openModal('🎁 送礼物给 ' + n.name, testMode ? '（演示）暂无旅行礼物，直接送一份心意也能涨好感～' : '挑一件旅游带回来的礼物送给它吧：', btns);
  }
  function doMarry(n) {
    me().married = true; me().spouseId = n.id; me().partnerId = n.id;
    weddingEffect();
    openModal('💍 婚礼进行中', `${me().name} 与 ${n.name} 结为伴侣！<br>从此一起经营温暖的狗生～<br><span class="hearts">❤️ 💍 ❤️ 💍 ❤️</span>`,
      [{ t: '好耶！💕', cls: 'hot', fn: () => { closeModal(); say('我们要幸福下去～'); renderActions(); renderFamily(); renderScene(); save(); } }]);
  }

  /* ============ 繁育：自定义命名 ============ */
  function doBreed() {
    if (!me().married) { say('要先结婚才能孕育宝宝哦'); return; }
    if (me().stage === 'baby') { say('还太小啦'); return; }
    openModal('🐾 迎接新生命', `给即将诞生的小狗起个名字吧：`,
      [{ t: '确定', cls: '', fn: () => {
        const inp = $('#mInput'); let nm = (inp && inp.value ? inp.value.trim() : '') || '小宝宝';
        const id = 'd' + Date.now();
        const baby = makeDog({ id, name: nm, gen: me().gen + 1, sex: (Math.random() < 0.5 ? 'M' : 'F'),
          colorKey: me().colorKey, age: 0, parentId: me().id, talent: 50 + talentBonus() + rnd(10) });
        S.dogs[id] = baby; me().offspring.push(id); S.currentNPC = null; save();
        closeModal(); showVisitor(null);
        say('🐶 ' + nm + ' 诞生啦！（天赋 ' + baby.talent + '）');
        toast('🎉 新成员 ' + nm + ' 加入家族，天赋上限 +' + talentBonus());
        renderFamily(); renderSocial(); renderScene();
      }}],
      true, '例如：奶糖二世 / 团团 / 布丁…');
  }

  /* ============ 时间 / 年龄 / 阶段 / 死亡 ============ */
  /* 按真实时间同步年龄 / 阶段 / 自然离世（取代旧的「每几秒 +1 天」定时器） */
  function syncAge() {
    refreshS();
    const m = me(); if (!m || !m.alive) return false;
    const ml = maxLife();
    const days = Math.floor(ageFloatOf(m));
    const grew = days !== m.age;
    m.age = days;
    const ns = stageOf(days, ml);
    const staged = ns !== m.stage;
    if (staged) m.stage = ns;
    if (days >= ml) { save(); onDeath(m); return true; }
    if (staged) onStageChange(ns);
    if (grew || staged) save();
    return grew || staged;
  }

  /* 饥饿 / 心情 / 精力：按真实经过时间自然衰减（页面关着也会算，但最多补 48 小时） */
  const DECAY_PER_HOUR = { hunger: 4, mood: 2.5, energy: 3 };
  const cap100 = v => Math.max(0, Math.min(100, v));
  function decayByTime() {
    refreshS();
    const now = Date.now();
    if (!S.lastTick) { S.lastTick = now; return false; }
    const hours = (now - S.lastTick) / 3600000;
    if (hours < 1 / 120) return false;              // 不足 30 秒不结算，省写盘
    S.lastTick = now;
    const m = me(); if (!m || !m.alive) { save(); return false; }
    const h = Math.min(hours, 48);
    m.hunger = cap100(m.hunger - DECAY_PER_HOUR.hunger * h);
    m.mood   = cap100(m.mood   - DECAY_PER_HOUR.mood   * h - (m.hunger < 30 ? 1.5 * h : 0));
    m.energy = cap100(m.energy - DECAY_PER_HOUR.energy * h);
    save();
    return true;
  }

  /* ============ 自动投喂：学完赚到的狗粮由系统直接喂给小狗 ============ */
  const FEED_UNIT = 5, FEED_HUNGER = 15, FEED_MOOD = 4;
  let autoFeeding = false;
  function autoFeed(gained, silent) {
    if (autoFeeding) return 0;
    if (S.autoFeed === false) return 0;            // 用户关闭自动投喂：狗粮留库存，手动喂
    autoFeeding = true;
    try {
      refreshS();
      const m = me();
      if (!m || !m.alive) return 0;
      if (m.hunger >= 90) return 0;                       // 已经吃饱，新赚的狗粮照常入账
      const need = Math.ceil((100 - m.hunger) / FEED_HUNGER);
      const afford = Math.floor(Store.getFood() / FEED_UNIT);
      const byGain = Math.max(1, Math.ceil((gained || 0) / FEED_UNIT));
      const portions = Math.min(need, afford, byGain);
      if (portions <= 0) return 0;
      if (!Store.spendFood(portions * FEED_UNIT)) return 0;
      m.hunger   = cap100(m.hunger + portions * FEED_HUNGER);
      m.mood     = cap100(m.mood + portions * FEED_MOOD);
      m.intimacy = cap100(m.intimacy + 1);
      Store.save();
      if (window.updateChrome) window.updateChrome();
      if (root) { renderBars(); }
      if (!silent && window.UI && UI.toast) {
        UI.toast('🍚 系统已自动喂 ' + m.name + ' ' + portions + ' 份狗粮（饥饿 ' + Math.round(m.hunger) + '）', 'ok');
      }
      return portions;
    } catch (e) { console.warn('[Puppy] 自动投喂失败', e); return 0; }
    finally { autoFeeding = false; }
  }
  // 供 Store.addFood 调用：不依赖养成页是否打开，学习即投喂。
  // 投喂前先按真实时间把状态与年龄结算到此刻，保证数值连续。
  window.PuppyAuto = {
    autoFeed: n => { try { decayByTime(); syncAge(); } catch (e) {} return autoFeed(n, false); },
    syncAge, decayByTime
  };
  function onStageChange(ns) {
    applyStagePose(); renderTop(); renderActions();
    if (ns === 'teen') { toast('🎉 ' + me().name + ' 长大成少年，解锁『外出交友』！'); say('我长大啦，可以交朋友咯'); }
    else if (ns === 'adult') { toast('🎉 ' + me().name + ' 成年啦，解锁『恋爱系统』！'); say('成年咯，邂逅爱情吧～'); }
    else if (ns === 'elder') { toast('🌿 ' + me().name + ' 步入老年，请珍惜相伴时光'); say('我变老啦，但依然爱你'); }
  }
  function onDeath(m) {
    m.alive = false; save();
    const heirs = m.offspring.filter(id => S.dogs[id] && S.dogs[id].alive);
    let body = `<p>${m.name} 走完了第 ${m.gen} 代的一生：<br>享年 ${m.age} 天，天赋 ${m.talent}，后代 ${m.offspring.length} 位。<br>它把温暖留给了这个家。</p>`;
    const btns = [];
    if (heirs.length) {
      const h = S.dogs[heirs[0]];
      body += `<p class="mini">血脉将交由 <b>${h.name}</b>（第 ${h.gen} 代）延续……</p>`;
      btns.push({ t: '继承血脉', cls: '', fn: () => { S.currentId = h.id; closeModal(); showVisitor(null); toast('🐾 世代传承：' + h.name + ' 成为新主角'); say('我是 ' + h.name + '，新的故事开始啦'); afterSwitch(); } });
    } else {
      body += `<p class="mini">这一脉暂未留下后代。要領养一只新小狗，让陪伴继续吗？</p>`;
      btns.push({ t: '🥚 领养新小狗', cls: '', fn: () => { const id = 'd' + Date.now(); const b = makeDog({ id, name: '奶糖', gen: m.gen + 1, sex: (Math.random() < 0.5 ? 'M' : 'F'), age: 0 }); S.dogs[id] = b; S.currentId = id; closeModal(); showVisitor(null); toast('🐾 新一代小狗来了，陪伴继续'); say('我是新来的奶糖，请多关照～'); afterSwitch(); } });
    }
    openModal('🌟 ' + m.name + ' 安详离世', body, btns);
  }
  function afterSwitch() { applyStagePose(); renderTop(); renderBars(); renderActions(); renderSocial(); renderFamily(); save(); }

  /* ============ 主界面露面：伴侣 + 幼崽 ============ */
  function renderScene() {
    const m = me();
    const mate = $('#mate'), mateName = mate ? mate.querySelector('.cm-name') : null, mateFace = mate ? mate.querySelector('.cm-face') : null;
    if (m.married && m.spouseId && npc(m.spouseId)) {
      const s = npc(m.spouseId);
      if (mateName) mateName.textContent = s.name + (s.sex === 'M' ? '♂' : '♀');
      const cm = COLORS[s.colorKey] || COLORS.brown;
      if (mateFace) mateFace.innerHTML = buildNpcSvg(cm, s.sex === 'M' ? 'tie' : 'bow');
      if (mate) mate.classList.add('show', 'flip');
    } else { if (mate) mate.classList.remove('show', 'flip'); if (mateFace) mateFace.innerHTML = ''; }
    const baby = $('#babyDog'), babyName = baby ? baby.querySelector('.cm-name') : null, babyFace = baby ? baby.querySelector('.cm-face') : null;
    const kids = m.offspring.map(id => S.dogs[id]).filter(c => c && c.alive);
    if (kids.length) {
      const k = kids[kids.length - 1]; if (babyName) babyName.textContent = k.name;
      const cm = COLORS[k.colorKey] || COLORS.gold;
      if (babyFace) babyFace.innerHTML = buildNpcSvg(cm);
      if (baby) baby.classList.add('show');
    } else { if (baby) baby.classList.remove('show'); if (babyFace) babyFace.innerHTML = ''; }
  }
  function interactBuddy() {
    const mate = $('#mate'), baby = $('#babyDog'); const ts = [];
    if (mate && mate.classList.contains('show')) ts.push(mate);
    if (baby && baby.classList.contains('show')) ts.push(baby);
    if (!ts.length) return;
    const t = ts[Math.floor(Math.random() * ts.length)];
    t.classList.add('buddy-hop'); setTimeout(() => t.classList.remove('buddy-hop'), 650);
    const st = $('#stage');
    if (Math.random() < 0.55 && st) {
      const h = document.createElement('div'); h.textContent = Math.random() < 0.5 ? '💕' : '✨';
      h.style.cssText = 'position:absolute;left:' + (t === mate ? '62%' : '22%') + ';top:42%;font-size:18px;z-index:9;pointer-events:none;animation:hfade 1s ease-out forwards;';
      st.appendChild(h); setTimeout(() => h.remove(), 1000);
    }
  }
  function weddingEffect() {
    const st = $('#stage'); if (!st) return;
    for (let i = 0; i < 16; i++) {
      const h = document.createElement('div');
      h.textContent = Math.random() < 0.5 ? '❤️' : '💕';
      h.style.cssText = 'position:absolute;left:' + (8 + Math.random() * 82) + '%;top:-24px;font-size:' +
        (18 + Math.random() * 18).toFixed(0) + 'px;opacity:.92;pointer-events:none;z-index:30;animation:fall ' + (1.6 + Math.random() * 1.4).toFixed(2) + 's ease-in forwards;';
      st.appendChild(h); setTimeout(() => h.remove(), 3300);
    }
    toast('💍 喜结连理！');
  }
  // 今日学习任务标记（旅游解锁用）
  function todayStudyKey() { return 'cet4pup_study_' + new Date().toISOString().slice(0, 10); }
  function todayStudyDone() { try { return localStorage.getItem(todayStudyKey()) === '1'; } catch (e) { return false; } }
  function markTodayStudy() { try { localStorage.setItem(todayStudyKey(), '1'); } catch (e) {} }

  /* ============ 学习联动（增益） ============ */
  function gain(kind, amount) {
    refreshS();
    kind = kind || 'words'; amount = amount || 1;
    S.study.total += amount; S.study[kind] = (S.study[kind] || 0) + amount;
    markTodayStudy(); save();
    // 若学习面板正在显示则刷新增益
    const p = $('#panel');
    if (p && p.dataset.tab === 'study') renderStudy();
    return S.study.total;
  }
  window.PuppyStudy = { gain, getState: () => S.study };

  /* ============ 渲染 ============ */
  function renderTop() {
    const m = me();
    const dn = $('#dogName'); if (dn) dn.textContent = m.name;
    const gb = $('#genBadge'); if (gb) gb.textContent = '第 ' + m.gen + ' 代';
    const sl = $('#subLine'); if (sl) sl.textContent = '世代循环 · ' + STAGE_NAMES[m.stage] + '期 · 已陪伴 ' + m.age + '/' + maxLife() + ' 天';
    const pills = $('#stagePills'); if (pills) {
      pills.innerHTML = '';
      const curIdx = STAGE_ORDER.indexOf(m.stage);
      STAGE_ORDER.forEach((s, i) => {
        const b = document.createElement('button'); b.className = 'sp';
        if (i === curIdx) b.classList.add('active');
        else if (i > curIdx) b.classList.add('locked');
        b.textContent = STAGE_NAMES[s];
        pills.appendChild(b);
      });
    }
    renderScene();
  }
  function barRow(lab, val, color, extra) {
    return `<div class="bar"><span class="lab">${lab}</span>
    <div class="track"><div class="fill" style="width:${val}%;background:${color}"></div></div>
    <span class="v">${val}</span></div>` + (extra || '');
  }
  function renderBars() {
    const m = me(); const ml = maxLife(); let h = '';
    h += barRow('饥饿', Math.round(m.hunger), '#ffb3c6');
    h += barRow('心情', Math.round(m.mood), '#ffd166');
    h += barRow('精力', Math.round(m.energy), '#8ecae6');
    h += barRow('成长', Math.min(100, Math.round(ageFloatOf(m) / ml * 100)), '#b08bd6',
      `<span class="mini">${STAGE_NAMES[m.stage]}期 · ${m.age}/${ml}天</span>`);
    if (m.stage !== 'baby') h += barRow('好感', Math.round(m.affection), '#ff8fab', m.married ? '<span class="mini">已婚💍</span>' : '');
    h += barRow('天赋', Math.round(m.talent), '#6dd6c0');
    const bars = $('#bars'); if (bars) bars.innerHTML = h;
  }
  function renderActions() {
    const m = me(); const a = $('#acts'); if (!a) return; a.innerHTML = '';
    const add = (act, ic, txt, dis, hot) => { const b = document.createElement('button'); b.dataset.act = act; b.innerHTML = `<span class="ic">${ic}</span>${txt}`; if (dis) b.disabled = true; if (hot) b.classList.add('hot'); a.appendChild(b); b.onclick = () => onAct(act); };
    add('feed', '🦴', '喂食'); add('pet', '✋', '抚摸'); add('play', '⚽', '玩耍'); add('sleep', '😴', '睡觉');
    if (m.stage === 'baby') { add('out', '🚫', '外出', 'disabled'); }
    else if (m.stage === 'teen') { add('out', '🚶', '外出交友'); }
    else { add('out', '💞', '外出邂逅'); }
    if (m.married && m.stage !== 'baby') { add('breed', '🐾', '孕育', '', true); }
  }
  function onAct(act) {
    if (act === 'feed') doFeed();
    else if (act === 'pet') doPet();
    else if (act === 'play') doPlay();
    else if (act === 'sleep') doSleep();
    else if (act === 'out') doOut();
    else if (act === 'breed') doBreed();
  }
  function renderStudy() {
    const p = $('#panel'); if (!p) return; p.dataset.tab = 'study';
    const lb = lifeBonus(), eb = Math.round(encounterBonus() * 100), tb = talentBonus();
    const st = S.study || {};
    p.innerHTML = `<h3>📚 学习中心 <span class="mini">（与备考系统打通的增益）</span></h3>
      <div class="prow"><span class="name">📝 背单词</span><span class="mini">${st.words || 0}</span></div>
      <div class="prow"><span class="name">🎧 练听力</span><span class="mini">${st.listening || 0}</span></div>
      <div class="prow"><span class="name">📖 做阅读</span><span class="mini">${st.reading || 0}</span></div>
      <div class="prow"><span class="name">✍️ 写作</span><span class="mini">${st.essays || 0}</span></div>
      <div class="prow"><span class="name">🔁 复习</span><span class="mini">${st.review || 0}</span></div>
      <div class="prow"><span class="name">🎮 消消乐</span><span class="mini">${st.match || 0}</span></div>
      <div class="prow"><span class="name"><b>累计学习量</b></span><span class="mini"><b>${st.total || 0}</b></span></div>
      <div class="buff">
        <span class="chip">⏳ 一生 ${maxLife()} 天（基础 ${BASE_LIFE} ＋ 延寿 ${lb}）</span>
        <span class="chip">💞 邂逅优质率 +${eb}%</span>
        <span class="chip">🌟 后代天赋上限 +${tb}</span>
      </div>
      <div class="hint">学习越久，增益越强：① 陪伴你的时间更长；② 外出更易遇优质伙伴 / 伴侣；③ 繁育时幼犬天赋上限更高。<br>
      <b>真实联动</b>：在单词 / 听力 / 阅读 / 作文模块完成学习会自动累加，赚到的狗粮默认由系统直接喂给它（可在「养成」页关闭自动投喂、改为手动喂）。</div>`;
  }
  function renderSocial() {
    const p = $('#panel'); if (!p) return; p.dataset.tab = 'social';
    const m = me(); const n = npc(S.currentNPC);
    let h = `<h3>🤝 社交</h3>`;
    if (m.stage !== 'baby') {
      const done = todayStudyDone();
      h += `<div class="prow" style="margin-top:6px"><span class="name">🧳 今日旅行</span>
        <button class="pbtn ${done ? 'gold' : 'dis'}" id="travelBtn" ${done ? '' : 'disabled'}>${done ? '出发旅游' : '先完成学习'}</button></div>`;
      if (!done) h += `<div class="hint">完成「学习中心」任一学习任务，即可解锁今日旅游；旅途带回的礼物还能用来送给邂逅的对象。</div>`;
    }
    if (m.stage === 'baby') { h += `<div class="hint">宝宝期还不能出门，先在家好好长大吧～</div>`; p.innerHTML = h; return; }
    if (!n) { h += `<div class="hint">点下方「外出${m.stage === 'teen' ? '交友' : '邂逅'}」去遇见小伙伴吧。</div>`; p.innerHTML = h; return; }
    h += `<div class="prow"><span class="name">当前访客：<b>${n.name}</b> ${n.sex === 'M' ? '♂' : '♀'} · ${n.personality}${n.quality ? ' · 优质✨' : ''}</span></div>`;
    if (m.stage === 'teen') {
      h += `<div class="prow"><span class="mini">友谊仅限陪伴，不可恋爱</span><button class="pbtn" data-soc="play">一起玩</button></div>`;
    } else {
      h += `<div class="prow"><span class="name">好感度</span><span class="mini">${m.affection}/100</span></div>`;
      h += `<div class="prow"><span class="mini">聊天 +8 / 送礼 +15</span><span>
        <button class="pbtn" data-soc="chat">聊天</button>
        <button class="pbtn gold" data-soc="gift">送礼</button></span></div>`;
      if (!m.partnerId && m.affection >= 60) h += `<div class="prow"><span class="mini">好感达标，可表白</span><button class="pbtn" data-soc="confess">💗 表白</button></div>`;
      if (m.partnerId && !m.married && m.affection >= 100) h += `<div class="prow"><span class="mini">好感拉满，可求婚</span><button class="pbtn hot" data-soc="propose">💍 求婚</button></div>`;
      if (m.married) h += `<div class="hint">已与 ${npc(m.spouseId) ? npc(m.spouseId).name : '伴侣'} 结婚💍，可在「家庭」孕育后代。</div>`;
    }
    p.innerHTML = h;
    const tb = $('#travelBtn'); if (tb) tb.onclick = () => doTravel();
    p.querySelectorAll('[data-soc]').forEach(b => b.onclick = () => socialInteract(b.dataset.soc));
  }
  function renderFamily() {
    const p = $('#panel'); if (!p) return; p.dataset.tab = 'family';
    const m = me();
    let h = `<h3>💞 家庭 · 第 ${m.gen} 代</h3>`;
    let rel = [`性别 ${m.sex === 'M' ? '♂ 公' : '♀ 母'}`];
    if (m.parentId && S.dogs[m.parentId]) rel.push('父母：' + S.dogs[m.parentId].name);
    h += `<div class="prow"><span class="mini">${rel.join(' · ')}</span></div>`;
    if (m.married && m.spouseId && npc(m.spouseId)) h += `<div class="prow"><span class="name">💍 配偶：${npc(m.spouseId).name}</span></div>`;
    if (m.offspring.length) {
      h += `<div class="prow"><span class="name">🐾 后代（${m.offspring.length}）</span></div>`;
      m.offspring.forEach(id => { const c = S.dogs[id]; if (!c) return;
        h += `<div class="prow"><span class="name">${c.alive ? '' : '🌟'} ${c.name} · 第${c.gen}代 · 天赋${c.talent}</span>
          <button class="pbtn" data-sw="${id}">切换主角</button></div>`; });
    } else {
      if (m.married) h += `<div class="hint">结婚后点下方「🐾 孕育」迎接宝宝，可自定义名字哦。</div>`;
      else if (m.stage === 'adult') h += `<div class="hint">先外出邂逅、恋爱、结婚，才能繁育后代。</div>`;
      else h += `<div class="hint">长大成年并结婚后，可在此孕育后代、传承世代。</div>`;
    }
    if (m.married && m.stage !== 'baby') h += `<div class="fam-acts"><button id="famBreed" class="hot">🐾 孕育宝宝（自定义命名）</button></div>`;
    p.innerHTML = h;
    const fb = $('#famBreed'); if (fb) fb.onclick = () => doBreed();
    p.querySelectorAll('[data-sw]').forEach(b => b.onclick = () => { if (busy || locked) return; S.currentId = b.dataset.sw; showVisitor(null); save(); afterSwitch(); say('我是 ' + me().name + '～'); });
  }
  function renderShelf() {
    const p = $('#panel'); if (!p) return; p.dataset.tab = 'shelf';
    let h = `<h3>🎁 旅游收藏柜 <span class="mini">（${S.gifts.length} 件）</span></h3>`;
    if (!S.gifts.length) { h += `<div class="shelf"><div class="empty">完成今日学习任务让奶糖出发旅游，收集远方礼物吧～</div></div>`; p.innerHTML = h; return; }
    h += `<div class="shelf">`;
    S.gifts.forEach((g, i) => { h += `<div class="gift" data-g="${i}">${g.icon}${i === 0 ? '<span class="badge">新</span>' : ''}</div>`; });
    h += `</div>`; p.innerHTML = h;
    p.querySelectorAll('[data-g]').forEach(b => b.onclick = () => { const g = S.gifts[+b.dataset.g]; if (g) openModal('🎁 ' + g.name, g.desc, [{ t: '收下啦', cls: '', fn: closeModal }]); });
  }

  /* ============ 旅游 ============ */
  async function doTravel() {
    if (busy || locked) return;
    if (!todayStudyDone()) { say('今天还没完成学习任务，先去「学习中心」学一会儿再出发旅游吧～'); toast('🔒 完成今日学习任务解锁旅游'); return; }
    busy = true; setBusy(true);
    say('出发去旅行啦！'); speak('我要去旅行啦');
    pose(-480, 0, 0); await sleep(1300);
    const giftBox = $('#giftBox'), giftItem = $('#giftItem');
    if (giftBox) giftBox.style.opacity = 0; if (giftItem) giftItem.style.opacity = 0;
    await sleep(5000);
    pose(0, 0, 0); await sleep(1300);
    if (giftBox) { giftBox.textContent = '🎁'; giftBox.style.opacity = 1; giftBox.classList.add('show'); }
    say('我给你带了礼物！'); speak('我给你带了礼物');
    await sleep(900);
    if (giftBox) { giftBox.style.opacity = 0; giftBox.classList.remove('show'); }
    await sleep(250);
    const g = pick(GIFTS);
    if (giftItem) { giftItem.textContent = g.icon; giftItem.classList.add('biu'); giftItem.style.opacity = 1; giftItem.onclick = () => openModal('🎁 ' + g.name, g.desc, [{ t: '收下啦', cls: '', fn: closeModal }]); }
    await sleep(2600);
    if (giftItem) { giftItem.style.opacity = 0; giftItem.classList.remove('biu'); giftItem.onclick = null; }
    S.gifts.unshift(g); save(); renderShelf();
    setBusy(false); busy = false;
  }

  /* ============ 弹窗 / Toast ============ */
  function openModal(title, html, btns, withInput, placeholder) {
    const c = $('#modalCard'); if (!c) return;
    const wedding = title.indexOf('💍') >= 0 || title.indexOf('婚礼') >= 0;
    c.className = 'card' + (wedding ? ' wedding' : '');
    let inner = `<div class="big"></div><h2>${title}</h2><p>${html}</p>`;
    if (withInput) inner += `<input id="mInput" maxlength="12" placeholder="${placeholder || ''}" />`;
    inner += `<div class="mbtns">` + btns.map((b, i) => `<button class="${b.cls || ''}" data-i="${i}">${b.t}</button>`).join('') + `</div>`;
    c.innerHTML = inner;
    c.querySelectorAll('button[data-i]').forEach(b => b.onclick = () => btns[+b.dataset.i] && btns[+b.dataset.i].fn && btns[+b.dataset.i].fn());
    if (withInput) { const inp = $('#mInput'); if (inp) inp.focus(); }
    const modal = $('#modal'); if (modal) modal.classList.add('show');
  }
  function closeModal() { const modal = $('#modal'); if (modal) modal.classList.remove('show'); }
  let toastT; function toast(t) { const el = $('#toast'); if (!el) return; el.textContent = t; el.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('show'), 2600); }

  /* ============ Tab 切换 ============ */
  const STAGE_EMOJI = { baby: '🐣', teen: '🐕', adult: '🦮', elder: '🌿' };
  function growthHTML() {
    const L = lifeInfo(), m = L.m;
    const marks = STAGE_ORDER.map((s, i) => {
      const left = STAGE_BOUND[i] * 100;
      const cls = 'gm' + (i < L.idx ? ' done' : i === L.idx ? ' cur' : '');
      return `<span class="${cls}" style="left:${left}%">${STAGE_NAMES[s]}</span>`;
    }).join('');
    const nodes = [1, 2, 3].map(i => `<i class="gn${i <= L.idx ? ' on' : ''}" style="left:${STAGE_BOUND[i] * 100}%"></i>`).join('');
    const next = L.idx < 3
      ? `距离「<b>${STAGE_NAMES[STAGE_ORDER[L.idx + 1]]}期</b>」还有 <b>${fmtDur(L.remain)}</b>`
      : `正在安享晚年，还剩 <b>${fmtDur(L.remain)}</b> 的相伴时光`;
    return `<div class="grow">
      <div class="grow-head">
        <span class="gh-stage">${STAGE_EMOJI[m.stage]} ${STAGE_NAMES[m.stage]}期</span>
        <span class="gh-age">已陪伴 ${fmtDur(L.af)}</span>
      </div>
      <div class="grow-track"><div class="grow-fill" style="width:${L.pct.toFixed(2)}%"></div>${nodes}</div>
      <div class="grow-marks">${marks}</div>
      <div class="grow-next">${next}</div>
      <div class="grow-tip">🕒 成长按<b>真实时间</b>走：1 天长 1 岁，页面关着也在长。
      预计一生 <b>${L.ml} 天</b>（基础 ${BASE_LIFE} 天 ＋ 学习延寿 ${lifeBonus()} 天），学得越多陪你越久。</div>
    </div>`;
  }
  const HELP_HTML = `
    <div class="hc-title">🐶 小狗养成怎么玩</div>
    <ul class="hc-list">
      <li>🕒 <b>成长按真实时间</b>：1 个真实天 = 1 岁，页面关着也在长，不会瞬间老死。</li>
      <li>⏳ <b>一生约 32~57 天</b>（基础 32 天 ＋ 学习越多延寿越多），专注背单词不理它也能自然走完。</li>
      <li>🍚 <b>狗粮</b>：背单词 / 做题赚到后，开启自动投喂则系统直接喂；关闭则存库存，可随时手动喂。</li>
      <li>📊 <b>成长进度条</b>：显示当前阶段与距下一阶段的时间。</li>
      <li>🔄 <b>世代循环</b>：老去离世后，有后代则继承血脉，无后代可领养新小狗继续陪伴。</li>
      <li>💡 <b>旧档迁移</b>：首次打开会把测试期跑飞的狗重置为新生（名字 / 世代 / 婚姻 / 天赋 / 后代都保留）。</li>
    </ul>`;
  function renderRaise() {
    const p = $('#panel'); if (!p) return; p.dataset.tab = 'raise';
    const af = S.autoFeed !== false;
    p.innerHTML = `<h3>🐾 养成</h3>
      ${growthHTML()}
      <div class="raise-ctrl">
        <div class="af-row">
          <span class="af-label">🍚 自动投喂</span>
          <button id="afSwitch" class="af-sw ${af ? 'on' : 'off'}">${af ? '开启' : '关闭'}</button>
        </div>
        ${af
          ? `<div class="hint">背单词 / 做题赚到的狗粮，系统会<b>直接喂给它</b>，你专心学习就行。</div>`
          : `<div class="hint">自动投喂已关闭，赚到的狗粮会存进库存。想喂时点下方「🍚 手动喂食」或养成区的🦴喂食按钮。</div>
             <button id="manualFeedBtn" class="af-feed">🍚 手动喂食（库存 ${Store.getFood()}）</button>`}
        <button id="helpBtn" class="af-help">❓ 使用说明</button>
        <div id="helpCard" class="help-card" style="display:none">${HELP_HTML}</div>
      </div>
      <div class="hint">手动互动：喂食 / 抚摸 / 玩耍 / 睡觉，都会加心情和亲密度。<br>
      阶段解锁：<b>少年</b>外出交友 · <b>成年</b>恋爱结婚 · <b>老年</b>自然老去。</div>`;
    const sw = $('#afSwitch'); if (sw) sw.onclick = toggleAutoFeed;
    const mf = $('#manualFeedBtn');
    if (mf) mf.onclick = () => { doFeed().then(() => { const pp = $('#panel'); if (pp && pp.dataset.tab === 'raise') renderRaise(); }); };
    const hb = $('#helpBtn');
    if (hb) hb.onclick = () => { const c = $('#helpCard'); if (c) c.style.display = c.style.display === 'none' ? 'block' : 'none'; };
  }
  function toggleAutoFeed() {
    if (typeof S.autoFeed !== 'boolean') S.autoFeed = true;   // 兜底：旧档视为开启
    S.autoFeed = !S.autoFeed;                                 // 翻转开关
    save();
    renderRaise();
    toast(S.autoFeed ? '🍚 自动投喂已开启' : '🍚 自动投喂已关闭，狗粮将存库存');
  }
  const TAB_RENDER = { raise: renderRaise, study: renderStudy, social: renderSocial, family: renderFamily, shelf: renderShelf };
  function renderTab(t) { (TAB_RENDER[t] || renderStudy)(); }
  // 成长进度条每分钟自刷新（只在养成页可见时）
  function refreshGrowth() {
    const p = $('#panel'); if (!p || p.dataset.tab !== 'raise') return;
    const g = p.querySelector('.grow'); if (!g) return;
    const wrap = document.createElement('div'); wrap.innerHTML = growthHTML();
    g.replaceWith(wrap.firstElementChild);
  }

  /* ============ 初始化（每次 mount 调用） ============ */
  function startPuppy() {
    refreshS();
    // 先按真实经过的时间把年龄与状态补算到「此刻」，再渲染
    decayByTime();
    const gone = syncAge();
    applyStagePose(); renderTop(); renderBars(); renderActions(); renderTab('raise');
    if (S.currentNPC && npc(S.currentNPC)) showVisitor(npc(S.currentNPC));
    renderShelf();
    // 若上次离开期间小狗已到寿终，补上告别弹窗（世代传承不会被漏掉）
    if (!gone && me() && !me().alive) onDeath(me());
    const tabs = root.querySelectorAll('#tabs button');
    tabs.forEach(b => b.onclick = () => {
      root.querySelectorAll('#tabs button').forEach(x => x.classList.remove('active'));
      b.classList.add('active'); renderTab(b.dataset.tab);
    });
    // 真实时间心跳：每分钟结算一次状态衰减 + 年龄，并刷新成长进度条
    setT(() => {
      if (busy || locked) return;
      const changed = decayByTime();
      const aged = syncAge();
      const m = me();
      if (m && m.alive && m.hunger < 45) autoFeed(FEED_UNIT * 2, true);   // 饿了自动补粮，不打扰
      if (changed || aged) { renderBars(); renderTop(); }
      refreshGrowth();
    }, 60000);
    // 伴侣 / 幼崽偶尔互动
    setT(() => { if (!busy && !locked) interactBuddy(); }, 8000);
  }

  /* ============ CSS（Shadow DOM 内嵌隔离） ============ */
  const STYLE = `<style>
    :host{
      display:block; height:100%; min-height:0;
      --pink:#ff8fab; --pink-soft:#ffd6e0; --cream:#fff7f0;
      --ink:#6b5563; --ink-soft:#9a8593; --gold:#f6d98a; --gold-deep:#e9c46a;
    }
    *{box-sizing:border-box;}
    .wrap{
      display:flex; flex-direction:column; height:100%; min-height:0; width:100%;
      background:#fff; overflow:hidden;
    }
    .body{ flex:1; min-height:0; display:flex; flex-direction:column; }
    .scene-area{ display:flex; flex-direction:column; min-height:0; }
    .stageWrap{ display:flex; align-items:center; justify-content:center; padding:6px 8px 0; min-height:0; }
    .side{ display:flex; flex-direction:column; min-height:0; overflow:auto; }
    .topbar{ background:linear-gradient(120deg,var(--pink),#ffb3c6); color:#fff; padding:14px 16px; }
    .topbar .row1{display:flex; align-items:center; justify-content:space-between;}
    .topbar h1{font-size:17px; margin:0; font-weight:700; display:flex; gap:8px; align-items:center;}
    .genbadge{background:rgba(255,255,255,.35); border-radius:20px; padding:3px 10px; font-size:11px;}
    .topbar .sub{font-size:11px; opacity:.92; margin-top:3px;}
    .stages{display:flex; gap:6px; margin-top:10px;}
    .stages .sp{ flex:1; text-align:center; border:none; background:rgba(255,255,255,.28); color:#fff;
      font-size:12px; padding:6px 0; border-radius:12px; transition:.2s; }
    .stages .sp.active{background:#fff; color:var(--pink); font-weight:700;}
    .stages .sp.locked{opacity:.45;}
    .bars{padding:12px 16px 2px; display:flex; flex-direction:column; gap:7px;}
    .bar{display:flex; align-items:center; gap:8px; font-size:12px;}
    .bar .lab{width:38px; color:var(--ink-soft);}
    .bar .track{flex:1; height:9px; background:#fff0f4; border-radius:6px; overflow:hidden;}
    .bar .fill{height:100%; border-radius:6px; transition:width .4s;}
    .bar .v{width:34px; text-align:right; color:var(--ink-soft); font-size:11px;}
    .stage{ position:relative; width:100%; max-width:480px; aspect-ratio:440/340; margin:0 auto;
      background:linear-gradient(180deg,#fff,#fef3f7); border-radius:18px; overflow:hidden; border:1px solid #ffe3ec;
      container-type:size; }
    .ground{position:absolute; left:0; right:0; bottom:0; height:62px; background:linear-gradient(180deg,#fde9d2,#f7d9b0);}
    .ground:before{content:""; position:absolute; top:0; left:0; right:0; height:3px; background:#eccfa0;}
    #dog{transform-box:view-box; transform-origin:220px 250px; transition:transform 1.1s ease;}
    #breath{transform-box:view-box; transform-origin:220px 262px; animation:breathe 3.2s ease-in-out infinite;}
    #breath.hop{animation:hop .42s ease;}
    @keyframes breathe{0%,100%{transform:scale(1);}50%{transform:scale(1.03);}}
    @keyframes hop{0%,100%{transform:translateY(0);}50%{transform:translateY(-16px);}}
    #tail{transform-box:view-box; transform-origin:278px 238px; animation:wag 1.3s ease-in-out infinite;}
    @keyframes wag{0%,100%{transform:rotate(-14deg);}50%{transform:rotate(14deg);}}
    .eye{transform-box:view-box;}
    #eyeL{transform-origin:198px 158px;} #eyeR{transform-origin:242px 158px;}
    .eye{animation:blink 4.2s infinite;}
    @keyframes blink{0%,92%,100%{transform:scaleY(1);}96%{transform:scaleY(.1);}}
    .eye .eyeClosed{opacity:0;}
    #dog.sleeping .eye{animation:none;}
    #dog.sleeping .eye circle{opacity:0;}
    #dog.sleeping .eye .eyeClosed{opacity:1;}
    .companion.flip .cm-face svg{transform:scaleX(-1);}
    @keyframes hfade{0%{transform:translateY(0);opacity:1;}100%{transform:translateY(-30px);opacity:0;}}
    .buddy-hop{animation:hop .6s ease;}
    #dog.elder{filter:grayscale(.5) brightness(.98) saturate(.78);}
    .obj{position:absolute; transform-box:view-box; pointer-events:none;}
    #bone{left:44.5%; top:78.2%; font-size:6.8cqw; opacity:0; transition:opacity .3s;}
    #ball{left:45.5%; top:75.3%; font-size:6.8cqw; opacity:0; transition:left .7s ease-in-out, top .5s, opacity .3s;}
    #hand{left:45.7%; top:23.5%; font-size:8.2cqw; opacity:0; transition:opacity .25s; transform-box:view-box; animation:pet 1s ease-in-out infinite;}
    @keyframes pet{0%,100%{transform:translateY(0) rotate(-6deg);}50%{transform:translateY(10px) rotate(6deg);}}
    #z{left:53.6%; top:23.5%; font-size:5.9cqw; opacity:0; transition:opacity .3s; animation:zfloat 2s ease-in-out infinite;}
    @keyframes zfloat{0%,100%{transform:translateY(0);opacity:.9;}50%{transform:translateY(-10px);opacity:.5;}}
    #giftBox{left:50%; top:34.7%; margin-left:-5.2cqw; font-size:10.5cqw; opacity:0; transition:opacity .3s; pointer-events:auto; cursor:pointer;}
    #giftBox.show{animation:giftPop .4s ease;}
    @keyframes giftPop{0%{transform:scale(0) translateY(36px); opacity:0;}60%{transform:scale(1.2) translateY(0); opacity:1;}100%{transform:scale(1);}}
    #giftItem{left:50%; top:35.3%; margin-left:-4.5cqw; font-size:9.1cqw; opacity:0; transition:opacity .3s; pointer-events:auto; cursor:pointer;}
    #giftItem.biu{animation:biu .4s ease;}
    @keyframes biu{0%{transform:scale(0) rotate(-25deg); opacity:0;}55%{transform:scale(1.3) rotate(10deg); opacity:1;}100%{transform:scale(1) rotate(0);}}
    #bed{right:1.5%; top:69.4%; width:40.5%; height:26.5%; opacity:0; transition:opacity .4s; pointer-events:none;}
    .bed-base{position:absolute; left:0; right:0; bottom:0; height:58px; background:linear-gradient(180deg,#ffd0dd,#ff9fb6); border-radius:20px 20px 28px 28px; box-shadow:inset 0 -7px 0 rgba(0,0,0,.07);}
    .bed-rim{position:absolute; left:-4px; right:-4px; bottom:40px; height:20px; background:#ffe0ea; border-radius:14px; box-shadow:0 3px 8px rgba(0,0,0,.08);}
    .bed-pillow{position:absolute; top:0; right:12px; width:62px; height:40px; background:#fff; border-radius:16px; box-shadow:0 3px 8px rgba(0,0,0,.08);}
    .visitor{position:absolute; left:3.2%; bottom:19.4%; text-align:center; opacity:0; transition:.3s;}
    .visitor.show{opacity:1;}
    .visitor .vname{font-size:12px; background:#fff; border-radius:10px; padding:1px 8px; box-shadow:0 2px 6px rgba(0,0,0,.08); margin-top:-4px;}
    .visitor .vclose{position:absolute; top:-6px; right:-6px; background:var(--pink); color:#fff; border-radius:50%; width:18px; height:18px; font-size:11px; line-height:18px; cursor:pointer; box-shadow:0 2px 6px rgba(0,0,0,.15);}
    .bubble{ position:absolute; left:50%; top:3.5%; transform:translateX(-50%); background:#fff; color:var(--ink); padding:8px 14px; border-radius:16px; font-size:13px; box-shadow:0 6px 16px rgba(0,0,0,.08); opacity:0; transition:.3s; border:1px solid #ffe3ec; max-width:82%; text-align:center; }
    .bubble.show{opacity:1;}
    .acts{display:flex; flex-wrap:wrap; gap:7px; padding:13px 15px;}
    .acts button{ flex:1 1 28%; border:none; border-radius:14px; padding:10px 4px; font-size:13px; background:var(--pink-soft); color:var(--ink); cursor:pointer; transition:.15s; display:flex; flex-direction:column; align-items:center; gap:2px; font-weight:600; }
    .acts button .ic{font-size:19px;}
    .acts button:hover:not(:disabled){background:var(--pink); color:#fff; transform:translateY(-2px);}
    .acts button:disabled{opacity:.38; cursor:not-allowed;}
    .acts button.on{background:var(--pink); color:#fff;}
    .acts button.hot{background:#ffd166; color:#6b5563;}
    .tabs{display:flex; gap:4px; padding:4px 14px 0; flex-wrap:wrap;}
    .tabs button{border:none; background:#fff0f4; color:var(--ink-soft); font-size:12px; padding:7px 10px; border-radius:12px 12px 0 0; cursor:pointer;}
    .tabs button.active{background:var(--cream); color:var(--pink); font-weight:700;}
    .panel{margin:0 12px 12px; background:var(--cream); border-radius:0 14px 16px 16px; padding:13px; border:1px solid #ffe3ec; flex:1; min-height:0; overflow:auto;}
    .panel h3{margin:0 0 8px; font-size:14px; display:flex; align-items:center; gap:6px;}
    .panel .hint{font-size:11px; color:var(--ink-soft); line-height:1.55; margin-top:8px;}
    .prow{display:flex; align-items:center; gap:8px; font-size:13px; padding:6px 0; border-bottom:1px dashed #ffe3ec;}
    .prow:last-child{border-bottom:none;}
    .prow .name{flex:1;}
    .pbtn{border:none; background:var(--pink); color:#fff; border-radius:10px; padding:6px 11px; font-size:12px; cursor:pointer;}
    .pbtn.gray{background:#e7dde2;}
    .pbtn.gold{background:var(--gold-deep);}
    .mini{font-size:11px; color:var(--ink-soft);}
    .studyBtns{display:flex; flex-wrap:wrap; gap:7px; margin:8px 0;}
    .studyBtns button{flex:1 1 40%; border:none; border-radius:12px; padding:9px 6px; font-size:12px; background:#fff; color:var(--ink); cursor:pointer; box-shadow:0 2px 6px rgba(0,0,0,.05); font-weight:600;}
    .studyBtns button:hover{background:var(--pink-soft);}
    .buff{display:flex; gap:8px; flex-wrap:wrap; margin-top:8px;}
    .buff .chip{background:#fff; border:1px solid #ffd0dd; border-radius:20px; padding:4px 11px; font-size:11px;}
    /* —— 成长进度（真实时间驱动） —— */
    .grow{background:#fff; border:1px solid #ffe3ec; border-radius:14px; padding:12px 13px 10px; box-shadow:0 2px 8px rgba(0,0,0,.04);}
    .grow-head{display:flex; align-items:baseline; justify-content:space-between; gap:8px; margin-bottom:9px;}
    .gh-stage{font-size:14px; font-weight:700; color:var(--ink);}
    .gh-age{font-size:11px; color:var(--ink-soft);}
    .grow-track{position:relative; height:11px; border-radius:8px; background:#ffeef3; overflow:visible;}
    .grow-fill{height:100%; border-radius:8px; background:linear-gradient(90deg,#ffd166,#ff8fab,#b08bd6); transition:width .6s ease;}
    .grow-track .gn{position:absolute; top:50%; width:7px; height:7px; margin:-3.5px 0 0 -3.5px; border-radius:50%; background:#fff; border:2px solid #ffd0dd; box-sizing:content-box;}
    .grow-track .gn.on{background:var(--pink); border-color:#fff;}
    .grow-marks{position:relative; height:15px; margin-top:5px;}
    .grow-marks .gm{position:absolute; transform:translateX(-50%); font-size:10px; color:var(--ink-soft); white-space:nowrap;}
    .grow-marks .gm:first-child{transform:none;}
    .grow-marks .gm.done{color:var(--pink);}
    .grow-marks .gm.cur{color:var(--pink); font-weight:700;}
    .grow-next{margin-top:7px; font-size:12px; color:var(--ink);}
    .grow-next b{color:var(--pink);}
    .grow-tip{margin-top:6px; font-size:11px; color:var(--ink-soft); line-height:1.55;}
    .grow-tip b{color:var(--ink);}
    .raise-ctrl{background:#fff; border:1px solid #ffe3ec; border-radius:14px; padding:11px 13px; margin-top:10px; box-shadow:0 2px 8px rgba(0,0,0,.04);}
    .af-row{display:flex; align-items:center; justify-content:space-between;}
    .af-label{font-size:13px; font-weight:600; color:var(--ink);}
    .af-sw{border:none; border-radius:20px; padding:5px 16px; font-size:12px; font-weight:700; cursor:pointer; transition:.15s;}
    .af-sw.on{background:var(--pink); color:#fff;}
    .af-sw.off{background:#e7dde2; color:var(--ink-soft);}
    .af-feed{display:block; width:100%; margin-top:9px; border:none; border-radius:12px; padding:10px; font-size:13px; font-weight:700; background:var(--gold-deep); color:#6b5563; cursor:pointer;}
    .af-feed:hover{filter:brightness(1.04);}
    .af-help{margin-top:9px; border:none; background:transparent; color:var(--ink-soft); font-size:12px; cursor:pointer; text-decoration:underline; padding:2px 0;}
    .help-card{margin-top:8px; background:#fff7f0; border:1px solid #ffe3ec; border-radius:12px; padding:11px 13px;}
    .help-card .hc-title{font-size:13px; font-weight:700; color:var(--ink); margin-bottom:6px;}
    .help-card .hc-list{margin:0; padding-left:18px; font-size:11.5px; color:var(--ink-soft); line-height:1.7;}
    .help-card .hc-list b{color:var(--ink);}
    .fam-acts{margin-top:14px;}
    .fam-acts .hot{font-size:14px; padding:10px 18px;}
    .companion{position:absolute; bottom:38px; opacity:0; transition:.45s; pointer-events:none; z-index:6; text-align:center;}
    .companion .cm-face{width:80px; height:70px; filter:drop-shadow(0 4px 6px rgba(0,0,0,.18)); display:flex; align-items:flex-end; justify-content:center;}
    .companion .cm-face svg{width:100%; height:100%; display:block; overflow:visible;}
    .companion .cm-name{font-size:11px; color:var(--ink); margin-top:2px; background:rgba(255,255,255,.75); border-radius:8px; padding:1px 5px; display:inline-block;}
    #mate{right:3.6%;}
    #babyDog{left:3.2%; bottom:15.9%;} #babyDog .cm-face{width:54px; height:48px;}
    .companion.show{opacity:1; transform:translateY(-4px);}
    @keyframes fall{0%{transform:translateY(0) rotate(0);opacity:.95;}100%{transform:translateY(360px) rotate(40deg);opacity:0;}}
    .card.wedding{border:3px solid #ffd166; box-shadow:0 14px 40px rgba(255,160,190,.5); animation:pop .5s cubic-bezier(.2,1.4,.5,1);}
    .card.wedding h2{color:#e64980;} .card.wedding .hearts{font-size:22px; display:inline-block; margin-top:6px;}
    .pbtn.gold{background:#ffe9a8; color:#b8860b;} .pbtn.dis{opacity:.5; cursor:not-allowed;}
    .shelf{display:flex; flex-wrap:wrap; gap:10px; margin-top:4px; min-height:52px;}
    .shelf .empty{font-size:12px; color:var(--ink-soft); padding:14px 0;}
    .gift{width:52px; height:52px; border-radius:12px; background:#fff; border:1px solid #ffd0dd; display:flex; align-items:center; justify-content:center; font-size:26px; cursor:pointer; transition:.15s; position:relative;}
    .gift:hover{transform:translateY(-3px); box-shadow:0 6px 14px rgba(255,143,171,.3);}
    .gift .badge{position:absolute; top:-6px; right:-6px; background:var(--pink); color:#fff; font-size:10px; border-radius:10px; padding:1px 5px;}
    .modal{position:fixed; inset:0; background:rgba(80,50,60,.45); display:none; align-items:center; justify-content:center; z-index:50;}
    .modal.show{display:flex;}
    .card{background:#fff; border-radius:22px; padding:24px; width:310px; text-align:center; box-shadow:0 20px 50px rgba(0,0,0,.25); animation:pop .25s ease; max-height:84vh; overflow:auto;}
    @keyframes pop{from{transform:scale(.8); opacity:0;}to{transform:scale(1); opacity:1;}}
    .card .big{font-size:60px;}
    .card h2{margin:8px 0 4px; font-size:18px;}
    .card .meta{font-size:12px; color:var(--ink-soft);}
    .card p{font-size:13px; color:var(--ink); line-height:1.6; margin:10px 0 16px;}
    .card input{width:100%; border:1px solid #ffd0dd; border-radius:12px; padding:10px 12px; font-size:14px; text-align:center; outline:none;}
    .card .mbtns{display:flex; gap:8px; justify-content:center; margin-top:14px;}
    .card button{border:none; background:var(--pink); color:#fff; border-radius:12px; padding:9px 20px; font-size:14px; cursor:pointer;}
    .card button.ghost{background:#e7dde2; color:var(--ink);}
    .toast{position:fixed; bottom:30px; left:50%; transform:translateX(-50%); background:var(--ink); color:#fff; padding:10px 18px; border-radius:20px; font-size:13px; opacity:0; transition:.3s; z-index:60; max-width:80%; text-align:center;}
    .toast.show{opacity:1;}
    @media (min-width:820px){
      .body{ flex-direction:row; }
      .scene-area{ flex:1.3; border-right:1px solid #ffe3ec; }
      .stageWrap{ flex:1; padding:10px 14px; }
      .stage{ max-width:none; width:auto; height:100%; }
      .side{ flex:1; max-width:400px; min-width:300px; }
      .acts button{ flex:1 1 45%; }
    }
    @media (max-width:560px){
      .topbar{ padding:10px 12px; }
      .topbar h1{ font-size:15px; }
      .bars{ padding:8px 12px 2px; }
      .stageWrap{ padding:4px 6px 0; }
      .acts{ padding:10px 12px; gap:6px; }
      .acts button{ font-size:12px; padding:9px 2px; }
      .tabs{ padding:4px 12px 0; }
      .tabs button{ font-size:11px; padding:6px 8px; }
      .panel{ margin:0 10px 10px; padding:11px; }
      .stage{ max-width:100%; }
    }
  </style>`;

  const HTML = `<div class="wrap">
    <div class="topbar">
      <div class="row1"><h1>🐶 <span id="dogName">奶糖</span>的房间 <span class="genbadge" id="genBadge">第 1 代</span></h1></div>
      <div class="sub" id="subLine"></div>
      <div class="stages" id="stagePills"></div>
    </div>
    <div class="body">
      <div class="scene-area">
    <div class="bars" id="bars"></div>
      <div class="stageWrap"><div class="stage" id="stage">
      <div class="ground"></div>
      <svg width="100%" height="100%" viewBox="0 0 440 340" style="position:absolute;inset:0">
        <g id="dog">
          <path id="tail" d="M278,238 q54,-16 40,-70" stroke="var(--gold-deep)" stroke-width="15" fill="none" stroke-linecap="round"/>
          <g id="breath">
            <ellipse cx="220" cy="250" rx="70" ry="62" fill="var(--gold)"/>
            <ellipse cx="220" cy="266" rx="46" ry="46" fill="#fbe6b0"/>
            <rect x="188" y="292" width="24" height="30" rx="12" fill="#f0cf78"/>
            <rect x="228" y="292" width="24" height="30" rx="12" fill="#e9c46a"/>
            <g id="head">
              <ellipse cx="186" cy="112" rx="18" ry="27" fill="#e9c46a" transform="rotate(-16 186 112)"/>
              <ellipse cx="254" cy="112" rx="18" ry="27" fill="#e0b85a" transform="rotate(16 254 112)"/>
              <circle cx="220" cy="162" r="58" fill="var(--gold)"/>
              <ellipse cx="220" cy="190" rx="36" ry="28" fill="#fbe6b0"/>
              <ellipse cx="220" cy="180" rx="11" ry="8" fill="#5b4636"/>
              <path id="mouth" d="M220,188 q0,12 -12,14 M220,188 q0,12 12,14" stroke="#5b4636" stroke-width="2.6" fill="none" stroke-linecap="round"/>
              <ellipse id="mouthOpen" cx="220" cy="200" rx="11" ry="9" fill="#7a4a3a" opacity="0"/>
              <g class="eye" id="eyeL"><circle cx="198" cy="158" r="9" fill="#3a2c22"/><circle cx="201" cy="155" r="2.8" fill="#fff"/><path class="eyeClosed" d="M190,160 q8,7 16,0" stroke="#3a2c22" stroke-width="2.4" fill="none" stroke-linecap="round"/></g>
              <g class="eye" id="eyeR"><circle cx="242" cy="158" r="9" fill="#3a2c22"/><circle cx="245" cy="155" r="2.8" fill="#fff"/><path class="eyeClosed" d="M234,160 q8,7 16,0" stroke="#3a2c22" stroke-width="2.4" fill="none" stroke-linecap="round"/></g>
              <ellipse cx="180" cy="182" rx="12" ry="7" fill="#ffc2d1" opacity=".5"/>
              <ellipse cx="260" cy="182" rx="12" ry="7" fill="#ffc2d1" opacity=".5"/>
            </g>
          </g>
        </g>
      </svg>
      <div class="obj" id="bone">🦴</div>
      <div class="obj" id="ball">⚽</div>
      <div class="obj" id="hand">✋</div>
      <div class="obj" id="z">💤</div>
      <div class="obj" id="giftBox">🎁</div>
      <div class="obj" id="giftItem">🎁</div>
      <div class="obj" id="bed"><div class="bed-base"></div><div class="bed-rim"></div><div class="bed-pillow"></div></div>
      <div class="visitor" id="visitor"></div>
      <div class="companion" id="mate"><div class="cm-face">🐶</div><div class="cm-name" id="mateName"></div></div>
      <div class="companion" id="babyDog"><div class="cm-face">🐶</div><div class="cm-name" id="babyName"></div></div>
      <div class="bubble" id="bubble"></div>
    </div>
      </div>
    </div>
    <div class="side">
    <div class="acts" id="acts"></div>
    <div class="tabs" id="tabs">
      <button data-tab="raise" class="active">🐾 养成</button>
      <button data-tab="study">📚 学习中心</button>
      <button data-tab="social">🤝 社交</button>
      <button data-tab="family">💞 家庭</button>
      <button data-tab="shelf">🎁 收藏</button>
    </div>
    <div class="panel" id="panel"></div>
    </div>
  </div>
  </div>
  <div class="modal" id="modal"><div class="card" id="modalCard"></div></div>
  <div class="toast" id="toast"></div>`;

  /* ============ 对外共享：形象/亲密度（供复习页悬浮伙伴等模块复用） ============
   * 与养成模块共用同一份 Store.state.puppy 数据与上限规则，不新增第二套数值体系。
   * 全部方法与 DOM 无关，养成模块未挂载时也可安全调用。 */
  window.PuppyPet = {
    colors: () => COLORS,
    name() { refreshS(); const m = me(); return (m && m.name) || '奶糖'; },
    stage() { refreshS(); const m = me(); return (m && m.stage) || 'adult'; },
    alive() { refreshS(); const m = me(); return !!(m && m.alive); },
    colorKey() { refreshS(); const m = me(); return (m && m.colorKey) || 'gold'; },
    stats() {
      refreshS(); const m = me();
      return m ? { intimacy: m.intimacy, mood: m.mood, hunger: m.hunger, energy: m.energy } : null;
    },
    /* 复用养成模块的亲密度/心情加成算法（0~100 截断），并即时刷新养成页状态条 */
    reward(intimacy, mood) {
      refreshS(); const m = me();
      if (!m || !m.alive) return null;
      if (intimacy) m.intimacy = Math.max(0, Math.min(100, m.intimacy + intimacy));
      if (mood) m.mood = Math.max(0, Math.min(100, m.mood + mood));
      save();
      if (root) { try { renderBars(); } catch (e) {} }
      return { intimacy: m.intimacy, mood: m.mood };
    }
  };

  window.CET4Modules.puppy = {
    mount(c) {
      refreshS();
      timers.forEach(id => clearInterval(id)); timers = [];
      let r = c.shadowRoot;
      if (!r) r = c.attachShadow({ mode: 'open' });
      root = r;
      r.innerHTML = STYLE + HTML;
      startPuppy();
    }
  };
})();
