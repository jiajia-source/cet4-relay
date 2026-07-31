/* ===== 单词闯关模块 =====
 * · 独立导航页：调用四级词库（window.WORDS，4544 词）随机出题，每关 10 题
 * · 题型混合：看词选义 / 看义选词 / 听音选义（TTS 发音）
 * · 答对：+10 分（连击≥3 每题额外 +5），复用 ReviewBuddy 悬浮小狗特效
 *   （小狗内部自带狗粮奖励 +2/题、连对 5 题加餐 +3，与复习页同一套逻辑）
 * · 答错：高亮正确答案 + 展开词根/巧记/真题例句解析，并收入错题本
 * · 过关（≥8/10）：额外 +15 狗粮；结算积分经 Store.addQuizScore 落库，
 *   数据看板「🏆 闯关积分」实时同步。
 * · Shadow DOM 隔离：零样式冲突，不改动任何现有模块逻辑。
 */
(function () {
  'use strict';

  const ROUND_SIZE = 10;      // 每关题数
  const PASS_NEED = 8;        // 过关所需答对题数
  const PT_BASE = 10;         // 每题基础分
  const PT_STREAK = 5;        // 连击≥3 的每题加成
  const STREAK_ON = 3;        // 连击加成起点
  const PASS_FOOD = 15;       // 过关额外狗粮

  const TYPE_NAME = { w2c: '看词选义', c2w: '看义选词', listen: '听音选义' };

  let root = null;            // shadow root
  let hostC = null;           // 模块容器（供 ReviewBuddy 挂载）
  let S = null;               // 本关运行态

  const $ = sel => root && root.querySelector(sel);
  const esc = s => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];
  const shuffle = arr => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  /* ---------- 出题 ---------- */
  function buildQuestions() {
    const all = window.WORDS || [];
    if (all.length < 8) return [];
    const chosen = shuffle(all).slice(0, ROUND_SIZE);
    return chosen.map((w, i) => {
      // 题型轮换 + 随机：保证三种都会出现
      const types = ['w2c', 'c2w', 'listen'];
      const type = i < 3 ? types[i] : pick(types);
      // 干扰项：随机抽 3 个不同词
      const distractors = [];
      const used = new Set([w.id]);
      while (distractors.length < 3) {
        const d = pick(all);
        if (used.has(d.id)) continue;
        // 干扰项内容不能与正确项相同（少数词释义重复）
        const key = (type === 'c2w') ? d.word : d.cn;
        const okKey = (type === 'c2w') ? w.word : w.cn;
        if (key === okKey) continue;
        used.add(d.id);
        distractors.push(d);
      }
      const options = shuffle([w].concat(distractors));
      return { w, type, options, answer: options.indexOf(w) };
    });
  }

  /* ---------- 关卡运行态 ---------- */
  function newRound() {
    S = {
      qs: buildQuestions(),
      idx: 0, score: 0, correct: 0, streak: 0, maxStreak: 0,
      locked: false, over: false
    };
  }

  /* ---------- 渲染 ---------- */
  function levelNow() { return (Store.getQuiz ? Store.getQuiz().rounds : 0) + 1; }

  function renderStart() {
    const q = Store.getQuiz ? Store.getQuiz() : { points: 0, rounds: 0, best: 0, passed: 0, correct: 0, total: 0 };
    const acc = q.total ? Math.round(q.correct / q.total * 100) : 0;
    $('#stage').innerHTML = `
      <div class="start">
        <div class="big">🏆</div>
        <h3>第 ${levelNow()} 关</h3>
        <p class="tip">每关随机 ${ROUND_SIZE} 题 · 三种题型混合 · 答对 ${PASS_NEED} 题过关</p>
        <div class="rules">
          <span>✅ 答对 +${PT_BASE} 分 · 小狗奖励狗粮</span>
          <span>🔥 连对 ${STREAK_ON} 题起每题加 +${PT_STREAK} 分</span>
          <span>🎁 过关额外 +${PASS_FOOD} 🦴</span>
          <span>📖 答错立刻看词根巧记解析</span>
        </div>
        <button class="btn main" id="go">🚀 开始闯关</button>
        <div class="hist">
          <span>累计积分 <b>${q.points}</b></span>
          <span>已闯 <b>${q.rounds}</b> 关 · 过 <b>${q.passed}</b> 关</span>
          <span>单关最高 <b>${q.best}</b> 分</span>
          <span>总正确率 <b>${acc}%</b></span>
        </div>
      </div>`;
    $('#go').onclick = () => { newRound(); renderQuestion(); };
  }

  function renderQuestion() {
    const q = S.qs[S.idx];
    const w = q.w;
    S.locked = false;

    let stem;
    if (q.type === 'w2c') {
      stem = `<div class="word">${esc(w.word)}</div>
              <div class="phon">${esc(w.uk || '')} <button class="spk" id="spk" title="发音">🔊</button></div>
              <div class="ask">这个单词是什么意思？</div>`;
    } else if (q.type === 'c2w') {
      stem = `<div class="word cnword">${esc(w.cn)}</div>
              <div class="ask">对应的英文单词是？</div>`;
    } else {
      stem = `<div class="word listen"><button class="spk big" id="spk" title="再听一遍">🔊</button></div>
              <div class="ask">听发音，选出正确的意思（可反复点喇叭）</div>
              <div class="spktip" id="spkTip"></div>`;
    }

    const opts = q.options.map((o, i) => {
      const label = (q.type === 'c2w') ? o.word : o.cn;
      return `<button class="opt" data-i="${i}">${'ABCD'[i]}. ${esc(label)}</button>`;
    }).join('');

    $('#stage').innerHTML = `
      <div class="head">
        <span class="lv">第 ${levelNow()} 关</span>
        <span class="type">${TYPE_NAME[q.type]}</span>
        <span class="score">⭐ ${S.score} 分</span>
        <span class="streak ${S.streak >= STREAK_ON ? 'hot' : ''}">🔥 连击 ${S.streak}</span>
      </div>
      <div class="prog"><i style="width:${(S.idx) / ROUND_SIZE * 100}%"></i>
        <span class="pnum">${S.idx + 1} / ${ROUND_SIZE}</span></div>
      <div class="qcard">${stem}<div class="opts">${opts}</div>
        <div id="explain"></div><div id="nextRow"></div></div>`;

    const spk = $('#spk');
    if (spk) {
      const tip = $('#spkTip');
      const speak = () => {
        // 点击反馈：无论能否出声，都让按钮有可见响应
        spk.classList.remove('ring'); void spk.offsetWidth; spk.classList.add('ring');
        try {
          if (window.TTS && TTS.speakEn) {           // 首选项目统一 TTS
            TTS.speakEn(w.word);
          } else if ('speechSynthesis' in window) {  // 降级：直接调浏览器语音合成
            const u = new SpeechSynthesisUtterance(w.word);
            u.lang = 'en-US';
            speechSynthesis.cancel();
            speechSynthesis.speak(u);
          } else {
            if (tip) { tip.textContent = '当前浏览器不支持语音朗读，可根据选项作答'; tip.classList.add('warn'); }
            return;
          }
          if (tip) { tip.textContent = ''; tip.classList.remove('warn'); }
        } catch (e) {
          if (tip) { tip.textContent = '发音失败，可根据选项作答'; tip.classList.add('warn'); }
        }
      };
      spk.onclick = speak;
      if (q.type === 'listen') setTimeout(speak, 350); // 听音题自动先读一遍
    }
    root.querySelectorAll('.opt').forEach(b => b.onclick = () => judge(+b.dataset.i));
  }

  /* ---------- 判分 ---------- */
  function judge(i) {
    if (S.locked) return;
    S.locked = true;
    const q = S.qs[S.idx];
    const w = q.w;
    const ok = i === q.answer;

    root.querySelectorAll('.opt').forEach((b, bi) => {
      b.disabled = true;
      if (bi === q.answer) b.classList.add('right');
      else if (bi === i) b.classList.add('wrong');
    });

    // 悬浮小狗特效 + 狗粮/亲密度（完全复用复习页同一套逻辑）
    if (window.ReviewBuddy) ReviewBuddy.react(ok);

    if (ok) {
      S.correct++;
      S.streak++;
      if (S.streak > S.maxStreak) S.maxStreak = S.streak;
      let pts = PT_BASE;
      if (S.streak >= STREAK_ON) pts += PT_STREAK;
      S.score += pts;
      // 连击里程碑：全屏飘心小庆祝
      if (S.streak > 0 && S.streak % 5 === 0 && typeof window.floatHearts === 'function') window.floatHearts(8);
      $('#explain').innerHTML = `<div class="judge ok">✅ 答对啦 +${pts} 分${S.streak >= STREAK_ON ? `（连击 x${S.streak}）` : ''}</div>`;
      setTimeout(next, 900);
    } else {
      S.streak = 0;
      Store.addWrong('words', w.id); // 收入错题本，供看板错题页巩固
      $('#explain').innerHTML = `
        <div class="judge bad">❌ 正确答案是 <b>${'ABCD'[q.answer]}. ${esc(q.type === 'c2w' ? w.word : w.cn)}</b>（已收入错题本）</div>
        <div class="exp">
          <div class="row"><span class="tag">单词</span><b>${esc(w.word)}</b> ${esc(w.uk || '')} <i>${esc(w.pos || '')}.</i> ${esc(w.cn)}</div>
          ${w.root ? `<div class="row"><span class="tag">词根</span>${esc(w.root)}</div>` : ''}
          ${w.mnemonic ? `<div class="row"><span class="tag">巧记</span>${esc(w.mnemonic)}</div>` : ''}
          ${w.example ? `<div class="row"><span class="tag">例句</span>${esc(w.example)}<br><span class="zh">${esc(w.exampleCn || '')}</span></div>` : ''}
        </div>`;
      $('#nextRow').innerHTML = `<button class="btn main" id="nextBtn">下一题 →</button>`;
      $('#nextBtn').onclick = next;
      $('#nextBtn').focus();
    }
    // 更新头部计分
    const sc = $('.score'), st = $('.streak');
    if (sc) sc.textContent = `⭐ ${S.score} 分`;
    if (st) { st.textContent = `🔥 连击 ${S.streak}`; st.classList.toggle('hot', S.streak >= STREAK_ON); }
  }

  function next() {
    S.idx++;
    if (S.idx >= S.qs.length) finish();
    else renderQuestion();
  }

  /* ---------- 结算 ---------- */
  function finish() {
    if (S.over) return;
    S.over = true;
    const passed = S.correct >= PASS_NEED;
    if (passed) {
      Store.addFood(PASS_FOOD);
      if (typeof window.floatHearts === 'function') window.floatHearts(10);
    }
    const q = Store.addQuizScore(S.score, S.correct, S.qs.length, passed);
    if (typeof window.updateChrome === 'function') window.updateChrome();
    if (window.ReviewBuddy && ReviewBuddy.say) {
      ReviewBuddy.say(passed ? `太棒啦！第 ${q.rounds} 关通过！🎉` : '差一点点，再来一关一定行！', passed ? 'ok' : 'bad');
    }

    $('#stage').innerHTML = `
      <div class="fin ${passed ? 'pass' : 'fail'}">
        <div class="big">${passed ? '🎉' : '🐾'}</div>
        <h3>${passed ? `第 ${q.rounds} 关 · 闯关成功！` : `第 ${q.rounds} 关 · 差一点点～`}</h3>
        <div class="nums">
          <span>本关得分 <b>${S.score}</b></span>
          <span>答对 <b>${S.correct} / ${S.qs.length}</b></span>
          <span>最高连击 <b>x${S.maxStreak}</b></span>
        </div>
        <div class="reward">${passed
          ? `🎁 过关奖励 +${PASS_FOOD} 🦴 已发放（答题狗粮已由小狗实时发过啦）`
          : `答对 ${PASS_NEED} 题即可过关，错题已收入错题本，看完解析再战！`}</div>
        <div class="hist">累计积分 <b>${q.points}</b> · 已闯 ${q.rounds} 关 · 单关最高 ${q.best} 分（看板已同步）</div>
        <div class="acts">
          <button class="btn main" id="again">🚀 ${passed ? '挑战下一关' : '再闯一次'}</button>
          <button class="btn" id="toDash">📊 去看板看积分</button>
        </div>
      </div>`;
    $('#again').onclick = () => { newRound(); renderQuestion(); };
    $('#toDash').onclick = () => { if (typeof window.switchTo === 'function') window.switchTo('dashboard'); };
  }

  /* ---------- 样式 ---------- */
  const STYLE = `<style>
    :host{ --pink:#ff8fab; --pink-soft:#ffd6e0; --cream:#fff7f0; --ink:#6b5563; --ink-soft:#9a8593;
      font-family:'PingFang SC','Microsoft YaHei','Hiragino Sans GB',sans-serif; display:block; }
    *{box-sizing:border-box;}
    .wrap{max-width:720px; margin:0 auto;}
    .btn{ border:none; cursor:pointer; border-radius:14px; padding:11px 22px; font-size:15px; font-weight:700;
      background:#fff; color:var(--ink); border:1px solid #ffd6e0; transition:.15s; }
    .btn:hover{transform:translateY(-1px); box-shadow:0 6px 16px rgba(255,143,171,.25);}
    .btn.main{ background:linear-gradient(135deg,#ff8fab,#ffb3c6); color:#fff; border:none; }

    /* 开始页 / 结算页 */
    .start,.fin{ background:#fff; border:1px solid #ffe3ec; border-radius:20px; padding:34px 26px; text-align:center;
      box-shadow:0 12px 34px rgba(255,143,171,.14); }
    .big{font-size:52px; line-height:1;}
    .start h3,.fin h3{margin:12px 0 6px; color:var(--ink); font-size:22px;}
    .tip{color:var(--ink-soft); margin:0 0 14px; font-size:14px;}
    .rules{display:flex; flex-wrap:wrap; gap:8px; justify-content:center; margin-bottom:18px;}
    .rules span{background:var(--cream); border:1px solid #ffe3ec; color:var(--ink); font-size:12.5px;
      padding:6px 12px; border-radius:999px;}
    .hist{margin-top:18px; display:flex; flex-wrap:wrap; gap:14px; justify-content:center;
      color:var(--ink-soft); font-size:13px;}
    .hist b{color:var(--ink); font-size:15px;}

    /* 答题页 */
    .head{display:flex; align-items:center; gap:10px; flex-wrap:wrap; margin-bottom:10px;}
    .head .lv{background:linear-gradient(135deg,#ff8fab,#ffb3c6); color:#fff; font-weight:800;
      padding:5px 14px; border-radius:999px; font-size:13.5px;}
    .head .type{background:#fff; border:1px solid #ffd6e0; color:var(--ink); padding:5px 12px;
      border-radius:999px; font-size:12.5px;}
    .head .score{margin-left:auto; font-weight:800; color:var(--ink);}
    .head .streak{color:var(--ink-soft); font-size:13px;}
    .head .streak.hot{color:#ff6b81; font-weight:800; animation:pulse .6s ease infinite alternate;}
    @keyframes pulse{from{transform:scale(1)}to{transform:scale(1.12)}}
    .prog{position:relative; height:10px; background:#ffe9f0; border-radius:999px; margin-bottom:16px;}
    .prog i{position:absolute; left:0; top:0; bottom:0; background:linear-gradient(90deg,#ff8fab,#ffb3c6);
      border-radius:999px; transition:width .3s;}
    .prog .pnum{position:absolute; right:0; top:-22px; font-size:12px; color:var(--ink-soft);}

    .qcard{background:#fff; border:1px solid #ffe3ec; border-radius:20px; padding:26px 24px;
      box-shadow:0 12px 34px rgba(255,143,171,.12);}
    .word{font-size:34px; font-weight:800; color:var(--ink); text-align:center; letter-spacing:.5px;}
    .word.cnword{font-size:26px;}
    .word.listen{text-align:center;}
    .phon{text-align:center; color:var(--ink-soft); margin-top:4px; font-size:14px;}
    .spk{border:none; background:var(--cream); border:1px solid #ffe3ec; border-radius:50%;
      width:34px; height:34px; cursor:pointer; font-size:15px;}
    .spk.big{width:74px; height:74px; font-size:32px;}
    .spk:hover{background:#ffe9f0;}
    .spk.ring{animation:spkRing .55s ease;}
    @keyframes spkRing{
      0%{transform:scale(1); box-shadow:0 0 0 0 rgba(255,143,171,.55);}
      60%{transform:scale(1.12); box-shadow:0 0 0 12px rgba(255,143,171,0);}
      100%{transform:scale(1); box-shadow:0 0 0 0 rgba(255,143,171,0);}
    }
    .spktip{text-align:center; font-size:12px; color:var(--ink-soft); margin-top:6px; min-height:16px;}
    .spktip.warn{color:#e5734f;}
    .ask{text-align:center; color:var(--ink-soft); font-size:13.5px; margin:10px 0 18px;}
    .opts{display:grid; grid-template-columns:1fr 1fr; gap:10px;}
    .opt{ text-align:left; padding:13px 16px; border-radius:14px; border:1.5px solid #ffe3ec;
      background:var(--cream); color:var(--ink); font-size:15px; cursor:pointer; transition:.15s; }
    .opt:hover:not(:disabled){border-color:var(--pink); background:#fff; transform:translateY(-1px);}
    .opt:disabled{cursor:default; opacity:.92;}
    .opt.right{background:#e9f9ef; border-color:#7bd8a0; color:#2e7d4f; font-weight:700;}
    .opt.wrong{background:#ffecec; border-color:#ff9c9c; color:#c0392b;}

    .judge{margin-top:16px; font-size:15px; font-weight:700; padding:10px 14px; border-radius:12px;}
    .judge.ok{background:#e9f9ef; color:#2e7d4f;}
    .judge.bad{background:#ffecec; color:#c0392b;}
    .exp{margin-top:10px; background:var(--cream); border:1px solid #ffe3ec; border-radius:14px;
      padding:12px 14px; font-size:13.5px; color:var(--ink); line-height:1.65;}
    .exp .row{margin:5px 0;}
    .exp .tag{display:inline-block; background:#fff; border:1px solid #ffd6e0; color:#ff6b81;
      font-size:11.5px; padding:1px 8px; border-radius:999px; margin-right:8px;}
    .exp .zh{color:var(--ink-soft);}
    #nextRow{margin-top:14px; text-align:center;}

    .fin .nums{display:flex; gap:16px; justify-content:center; flex-wrap:wrap; margin:10px 0 12px;
      color:var(--ink-soft); font-size:14px;}
    .fin .nums b{color:var(--ink); font-size:20px;}
    .fin .reward{background:var(--cream); border:1px solid #ffe3ec; display:inline-block;
      padding:9px 16px; border-radius:12px; color:var(--ink); font-size:13.5px; margin-bottom:10px;}
    .fin .acts{margin-top:16px; display:flex; gap:12px; justify-content:center; flex-wrap:wrap;}

    @media (max-width:560px){
      .opts{grid-template-columns:1fr;}
      .word{font-size:27px;} .word.cnword{font-size:21px;}
      .qcard{padding:18px 14px;}
      .start,.fin{padding:24px 14px;}
    }
  </style>`;

  /* ---------- 挂载 ---------- */
  window.CET4Modules = window.CET4Modules || {};
  window.CET4Modules['word-quiz'] = {
    mount(c) {
      hostC = c;
      const host = document.createElement('div');
      c.appendChild(host);
      root = host.attachShadow({ mode: 'open' });
      root.innerHTML = STYLE + `<div class="wrap"><div id="stage"></div></div>`;
      // 右上角悬浮小狗伙伴（与复习页同一只，动画/狗粮/亲密度逻辑完全复用）
      if (window.ReviewBuddy) ReviewBuddy.attach(c);
      renderStart();
    }
  };
})();
