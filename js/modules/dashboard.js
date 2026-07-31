/* ===== 数据看板模块 =====
 * 任务清单 · 词汇进度 · 学习趋势 · 打卡日历 · 错题本 · 周报
 * 采用 Shadow DOM 隔离，样式全部内嵌，零外部 CSS 依赖、零样式冲突。
 * 数据来源：Store（words / reviewLog / wrong / checkin / stats / daily / goals / food）
 */
window.CET4Modules = window.CET4Modules || {};
window.CET4Modules.dashboard = (() => {

  const GOAL_META = [
    { key: 'learned',   emoji: '📚', name: '学新单词', unit: '词',  go: 'words-learn',  color: '#FF8FC4' },
    { key: 'reviews',   emoji: '🔁', name: '复习单词', unit: '词',  go: 'words-review', color: '#B8A6F0' },
    { key: 'listening', emoji: '🎧', name: '听力练习', unit: '篇',  go: 'listening',    color: '#7FC4E8' },
    { key: 'reading',   emoji: '📖', name: '阅读练习', unit: '篇',  go: 'reading',      color: '#7FD4AE' },
    { key: 'essays',    emoji: '✍️', name: '写作练习', unit: '篇',  go: 'essays',       color: '#F2C94C' }
  ];

  const CSS = `
  <style>
    :host{
      --pink:#FF8FC4; --pink-100:#FFEAF4; --pink-200:#FFD9EC; --pink-50:#FFF7FB;
      --lav:#B8A6F0; --mint:#7FD4AE; --sky:#7FC4E8; --lemon:#F2C94C;
      --ink:#8A6378; --ink-soft:#B08FA0; --ink-strong:#6E4B60; --cream:#FFFDF9;
      display:block; font-family:"PingFang SC","Microsoft YaHei","Segoe UI",system-ui,sans-serif;
      color:var(--ink);
    }
    *{box-sizing:border-box;}
    .db{display:flex; flex-direction:column; gap:14px; padding-bottom:10px;}

    /* ---------- KPI ---------- */
    .kpis{display:grid; grid-template-columns:repeat(auto-fit,minmax(132px,1fr)); gap:10px;}
    .kpi{background:var(--cream); border:2px solid var(--pink-200); border-radius:18px; padding:12px 14px;
         box-shadow:0 6px 16px rgba(255,150,195,.14);}
    .kpi .k{font-size:12px; color:var(--ink-soft); display:flex; align-items:center; gap:4px;}
    .kpi .v{font-size:22px; font-weight:800; color:var(--ink-strong); line-height:1.35; margin-top:2px;}
    .kpi .s{font-size:11px; color:var(--ink-soft);}

    /* ---------- 卡片栅格 ---------- */
    .grid{display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:14px;}
    .card{background:var(--cream); border:2px solid var(--pink-200); border-radius:20px; padding:16px 18px;
          box-shadow:0 8px 22px rgba(255,150,195,.14); min-width:0;}
    .card.wide{grid-column:1 / -1;}
    .ch{display:flex; align-items:center; justify-content:space-between; gap:8px; margin-bottom:12px; flex-wrap:wrap;}
    .ct{font-size:15px; font-weight:800; color:var(--ink-strong);}
    .cs{font-size:12px; color:var(--ink-soft);}

    .btn{border:none; cursor:pointer; font-family:inherit; border-radius:999px; padding:6px 13px; font-size:12px;
         background:var(--pink-100); color:var(--ink-strong); font-weight:700; transition:.18s;}
    .btn:hover{background:var(--pink-200); transform:translateY(-1px);}
    .btn.main{background:linear-gradient(135deg,#FFA9D4,#FF8FC4); color:#fff; box-shadow:0 6px 14px rgba(255,143,196,.35);}
    .btn.tiny{padding:4px 9px; font-size:11px;}
    .btn:disabled{opacity:.55; cursor:default; transform:none;}
    .seg{display:inline-flex; background:var(--pink-50); border:1px solid var(--pink-200); border-radius:999px; padding:2px;}
    .seg button{border:none; background:transparent; font-family:inherit; cursor:pointer; font-size:12px; font-weight:700;
                color:var(--ink-soft); padding:5px 12px; border-radius:999px;}
    .seg button.on{background:#fff; color:var(--ink-strong); box-shadow:0 2px 6px rgba(255,150,195,.25);}

    /* ---------- 任务清单 ---------- */
    .task{display:flex; align-items:center; gap:11px; padding:9px 10px; border-radius:14px; transition:.18s; cursor:pointer;}
    .task:hover{background:var(--pink-50);}
    .task .em{font-size:20px; width:26px; text-align:center; flex:none;}
    .task .body{flex:1; min-width:0;}
    .task .row1{display:flex; justify-content:space-between; align-items:baseline; gap:8px; font-size:13px;}
    .task .nm{font-weight:700; color:var(--ink-strong);}
    .task .num{font-size:12px; color:var(--ink-soft); font-variant-numeric:tabular-nums;}
    .bar{height:8px; border-radius:999px; background:var(--pink-100); overflow:hidden; margin-top:6px;}
    .bar i{display:block; height:100%; border-radius:999px; transition:width .5s cubic-bezier(.4,1.4,.5,1);}
    .task .ok{font-size:16px; width:20px; text-align:center; flex:none;}
    .goal-edit{display:none; gap:8px; flex-wrap:wrap; padding:10px; background:var(--pink-50); border-radius:14px; margin-top:8px;}
    .goal-edit.show{display:flex;}
    .ge{display:flex; align-items:center; gap:5px; font-size:12px; color:var(--ink-soft);}
    .ge input{width:56px; border:1px solid var(--pink-200); border-radius:9px; padding:4px 6px; font-family:inherit;
              font-size:12px; color:var(--ink-strong); text-align:center; background:#fff;}
    .bonus{margin-top:10px; padding:11px 13px; border-radius:15px; background:linear-gradient(135deg,#FFF4EE,#FFEAF4);
           border:1px dashed var(--pink-200); display:flex; align-items:center; justify-content:space-between; gap:10px; flex-wrap:wrap;}
    .bonus .t{font-size:12.5px; color:var(--ink-strong); font-weight:700;}

    /* ---------- 环形图 ---------- */
    .donut-wrap{display:flex; align-items:center; gap:14px; flex-wrap:wrap;}
    .donut{position:relative; width:150px; height:150px; flex:none;}
    .donut .mid{position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center;}
    .donut .mid b{font-size:22px; color:var(--ink-strong);}
    .donut .mid span{font-size:11px; color:var(--ink-soft);}
    .legend{flex:1; min-width:130px; display:flex; flex-direction:column; gap:7px;}
    .lg{display:flex; align-items:center; gap:7px; font-size:12.5px;}
    .lg .dot{width:10px; height:10px; border-radius:50%; flex:none;}
    .lg .nm{flex:1; color:var(--ink);}
    .lg .vl{font-weight:800; color:var(--ink-strong); font-variant-numeric:tabular-nums;}

    /* ---------- 趋势图 ---------- */
    .chart{width:100%;}
    .chart svg{width:100%; height:auto; display:block;}
    .tl{display:flex; gap:12px; flex-wrap:wrap; margin-top:8px;}
    .tl span{display:flex; align-items:center; gap:5px; font-size:11.5px; color:var(--ink-soft);}
    .tl i{width:9px; height:9px; border-radius:3px; display:block;}

    /* ---------- 日历 ---------- */
    .cal{display:grid; grid-template-columns:repeat(7,1fr); gap:5px;}
    .cal .wd{text-align:center; font-size:11px; color:var(--ink-soft); padding-bottom:2px;}
    .cell{aspect-ratio:1/1; border-radius:11px; display:flex; flex-direction:column; align-items:center; justify-content:center;
          font-size:12px; color:var(--ink-soft); background:var(--pink-50); position:relative;}
    .cell.empty{background:transparent;}
    .cell.study{background:var(--pink-100); color:var(--ink-strong);}
    .cell.checked{background:linear-gradient(135deg,#FFA9D4,#FF8FC4); color:#fff; font-weight:800;
                  box-shadow:0 4px 10px rgba(255,143,196,.3);}
    .cell.today{outline:2px solid var(--lav); outline-offset:1px;}
    .cell .d{line-height:1;}
    .cell .dt{font-size:8px; line-height:1; margin-top:2px; opacity:.9;}
    .calfoot{display:flex; gap:14px; flex-wrap:wrap; margin-top:10px; font-size:12px; color:var(--ink-soft);}
    .calfoot b{color:var(--ink-strong);}

    /* ---------- 错题本 ---------- */
    .tabs{display:flex; gap:7px; flex-wrap:wrap;}
    .tab{border:none; cursor:pointer; font-family:inherit; font-size:12.5px; font-weight:700; padding:6px 13px;
         border-radius:999px; background:var(--pink-50); color:var(--ink-soft); border:1px solid transparent;}
    .tab.on{background:var(--pink-100); color:var(--ink-strong); border-color:var(--pink-200);}
    .wlist{display:flex; flex-direction:column; gap:8px; max-height:330px; overflow-y:auto; padding-right:3px;}
    .wlist::-webkit-scrollbar{width:7px;}
    .wlist::-webkit-scrollbar-thumb{background:var(--pink-200); border-radius:99px;}
    .wi{display:flex; align-items:center; gap:10px; padding:9px 11px; background:var(--pink-50); border-radius:14px;}
    .wi .main{flex:1; min-width:0;}
    .wi .t1{font-size:13.5px; font-weight:700; color:var(--ink-strong); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;}
    .wi .t2{font-size:11.5px; color:var(--ink-soft); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; margin-top:1px;}
    .wi .acts{display:flex; gap:5px; flex:none;}
    .empty-tip{text-align:center; padding:26px 10px; color:var(--ink-soft); font-size:13px;}
    .empty-tip .e{font-size:30px; display:block; margin-bottom:6px;}

    /* ---------- 周报 ---------- */
    .rrow{display:flex; align-items:center; gap:10px; padding:7px 2px; font-size:13px; border-bottom:1px dashed var(--pink-100);}
    .rrow:last-of-type{border-bottom:none;}
    .rrow .nm{flex:1; color:var(--ink);}
    .rrow .nowv{font-weight:800; color:var(--ink-strong); font-variant-numeric:tabular-nums;}
    .rrow .dl{font-size:11.5px; font-weight:700; padding:2px 7px; border-radius:999px; min-width:48px; text-align:center;}
    .dl.up{background:#FFE7F1; color:#E0568F;}
    .dl.down{background:#E7F5EE; color:#3E9C74;}
    .dl.flat{background:#F1EEF6; color:#9186A8;}
    .advice{margin-top:11px; padding:11px 13px; border-radius:14px; background:var(--pink-50); font-size:12.5px;
            line-height:1.7; color:var(--ink);}
    .advice b{color:var(--ink-strong);}

    .toast{position:fixed; left:50%; bottom:38px; transform:translateX(-50%); background:rgba(110,75,96,.94); color:#fff;
           padding:10px 20px; border-radius:999px; font-size:13px; opacity:0; transition:.3s; pointer-events:none; z-index:99;}
    .toast.show{opacity:1;}

    @media (max-width:820px){
      .grid{grid-template-columns:1fr;}
      .card.wide{grid-column:auto;}
    }
    @media (max-width:560px){
      .card{padding:13px 14px; border-radius:17px;}
      .kpi{padding:10px 11px;} .kpi .v{font-size:19px;}
      .donut{width:126px; height:126px;}
    }
  </style>`;

  const HTML = `
  <div class="db">
    <div class="kpis" id="kpis"></div>
    <div class="grid">
      <section class="card wide" id="cTask"></section>
      <section class="card" id="cVocab"></section>
      <section class="card" id="cCal"></section>
      <section class="card wide" id="cTrend"></section>
      <section class="card wide" id="cWrong"></section>
      <section class="card wide" id="cReport"></section>
    </div>
  </div>
  <div class="toast" id="toast"></div>`;

  let root = null;              // shadow root
  let trendRange = 7;           // 7 | 30
  let wrongTab = 'words';
  let calOffset = 0;            // 0 = 当月，-1 上月
  let editingGoals = false;

  const $ = s => root.querySelector(s);
  const esc = s => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const todayStr = () => new Date().toISOString().slice(0, 10);

  function toast(msg) {
    const t = $('#toast'); if (!t) return;
    t.textContent = msg; t.classList.add('show');
    clearTimeout(t._tm); t._tm = setTimeout(() => t.classList.remove('show'), 1800);
  }

  /* ---------- 数据聚合 ---------- */
  function wordMap() {
    if (!window.WORDS) return {};
    if (!wordMap._m) {
      wordMap._m = {};
      window.WORDS.forEach(w => { wordMap._m[w.id] = w; });
    }
    return wordMap._m;
  }
  function allListening() {
    return (window.LISTENING || []).concat(window.LISTENING_EXAM || []);
  }
  function accuracy() {
    const log = Store.state.reviewLog || [];
    const c = log.reduce((a, r) => a + (r.correct || 0), 0);
    const t = log.reduce((a, r) => a + (r.total || 0), 0);
    return { acc: t ? Math.round(c / t * 100) : 0, correct: c, total: t };
  }
  function vocabBreakdown() {
    const words = Store.state.words || {};
    const total = (window.WORDS || []).length || 4544;
    let mastered = 0, fuzzy = 0, unknown = 0;
    Object.keys(words).forEach(id => {
      const st = (words[id] || {}).status;
      if (st === 'mastered') mastered++;
      else if (st === 'fuzzy') fuzzy++;
      else if (st === 'unknown') unknown++;
    });
    const touched = mastered + fuzzy + unknown;
    return { total, mastered, fuzzy, unknown, untouched: Math.max(0, total - touched), touched };
  }

  /* ---------- KPI ---------- */
  function renderKpis() {
    const s = Store.state;
    const v = vocabBreakdown();
    const a = accuracy();
    const due = Store.getDueWords ? Store.getDueWords().length : 0;
    const days = Store.getStudyDays ? Store.getStudyDays() : 0;
    const pct = v.total ? (v.touched / v.total * 100).toFixed(1) : 0;
    const wrongTotal = ['words', 'listening', 'reading'].reduce((n, k) => n + Store.getWrong(k).length, 0);

    const cards = [
      { k: '📚 词库进度', v: v.touched, s: '/ ' + v.total + ' 词 · ' + pct + '%' },
      { k: '🎯 复习正确率', v: a.acc + '%', s: a.total ? (a.correct + ' / ' + a.total + ' 题') : '还没开始复习' },
      { k: '⏰ 待复习', v: due, s: due ? '到期该巩固啦' : '暂时都记牢了～' },
      { k: '🔥 连续打卡', v: (s.checkin.streak || 0) + ' 天', s: '累计学习 ' + days + ' 天' },
      { k: '📕 错题本', v: wrongTotal, s: '道题待消灭' },
      { k: '🦴 狗粮', v: Store.getFood(), s: '可喂给奶糖' },
      (function () {
        const q = (Store.getQuiz && Store.getQuiz()) || { points: 0, rounds: 0, passed: 0, best: 0, correct: 0, total: 0 };
        const qa = q.total ? Math.round(q.correct / q.total * 100) : 0;
        return { k: '🏆 闯关积分', v: q.points,
                 s: q.rounds ? ('已闯 ' + q.rounds + ' 关 · 过 ' + q.passed + ' 关 · 最高 ' + q.best + ' 分 · 正确率 ' + qa + '%') : '还没闯过关，去试试～' };
      })()
    ];
    $('#kpis').innerHTML = cards.map(c =>
      `<div class="kpi"><div class="k">${c.k}</div><div class="v">${esc(c.v)}</div><div class="s">${esc(c.s)}</div></div>`
    ).join('');
  }

  /* ---------- 今日任务 ---------- */
  function renderTasks() {
    const d = Store.getDay();
    const g = Store.getGoals();
    const doneCount = GOAL_META.filter(m => (g[m.key] || 0) <= 0 || (d[m.key] || 0) >= g[m.key]).length;
    const all = Store.allGoalsDone();
    const claimed = Store.bonusClaimed();

    const rows = GOAL_META.map(m => {
      const goal = g[m.key] || 0;
      const now = d[m.key] || 0;
      const ok = goal <= 0 || now >= goal;
      const w = goal <= 0 ? 100 : Math.min(100, Math.round(now / goal * 100));
      return `<div class="task" data-go="${m.go}">
        <div class="em">${m.emoji}</div>
        <div class="body">
          <div class="row1"><span class="nm">${m.name}</span>
            <span class="num">${now} / ${goal} ${m.unit}</span></div>
          <div class="bar"><i style="width:${w}%;background:${m.color}"></i></div>
        </div>
        <div class="ok">${ok ? '✅' : '⬜'}</div>
      </div>`;
    }).join('');

    const editRow = GOAL_META.map(m =>
      `<label class="ge">${m.emoji}<input type="number" min="0" max="999" data-goal="${m.key}" value="${g[m.key] || 0}"></label>`
    ).join('') + '<button class="btn main tiny" id="saveGoals">保存目标</button>';

    let bonusHtml;
    if (claimed) bonusHtml = `<div class="bonus"><span class="t">🎉 今日全勤奖励已领取，明天继续加油！</span></div>`;
    else if (all) bonusHtml = `<div class="bonus"><span class="t">🎁 今日任务全部完成！领取 20 狗粮奖励～</span>
        <button class="btn main" id="claimBtn">领取奖励</button></div>`;
    else bonusHtml = `<div class="bonus"><span class="t">还差 ${5 - doneCount} 项就能拿到今日全勤奖励（+20 🦴）</span></div>`;

    $('#cTask').innerHTML = `
      <div class="ch">
        <div><span class="ct">📋 今日任务清单</span>
          <span class="cs">　已完成 ${doneCount} / 5</span></div>
        <button class="btn tiny" id="editGoals">${editingGoals ? '收起' : '⚙️ 自定义目标'}</button>
      </div>
      ${rows}
      <div class="goal-edit ${editingGoals ? 'show' : ''}">${editRow}</div>
      ${bonusHtml}`;

    root.querySelectorAll('.task').forEach(el => el.onclick = () => {
      if (typeof window.switchTo === 'function') window.switchTo(el.dataset.go);
    });
    $('#editGoals').onclick = () => { editingGoals = !editingGoals; renderTasks(); };
    const sg = $('#saveGoals');
    if (sg) sg.onclick = () => {
      const patch = {};
      root.querySelectorAll('[data-goal]').forEach(i => {
        patch[i.dataset.goal] = Math.max(0, Math.min(999, parseInt(i.value, 10) || 0));
      });
      Store.setGoals(patch);
      editingGoals = false;
      renderTasks(); renderKpis();
      toast('目标已保存 🎯');
    };
    const cb = $('#claimBtn');
    if (cb) cb.onclick = () => {
      const r = Store.claimDailyBonus(20);
      if (r.ok) {
        if (typeof window.floatHearts === 'function') window.floatHearts(8);
        if (typeof window.updateChrome === 'function') window.updateChrome();
        toast('+20 狗粮已到账 🦴');
        renderTasks(); renderKpis();
      }
    };
  }

  /* ---------- 词汇掌握环形图 ---------- */
  function renderVocab() {
    const v = vocabBreakdown();
    const segs = [
      { nm: '已掌握', val: v.mastered,  c: '#7FD4AE' },
      { nm: '模糊不熟', val: v.fuzzy,   c: '#F2C94C' },
      { nm: '完全陌生', val: v.unknown, c: '#FF8FC4' },
      { nm: '尚未学习', val: v.untouched, c: '#EFE7F3' }
    ];
    const total = v.total || 1;
    const R = 54, C = 2 * Math.PI * R;
    let acc = 0;
    const circles = segs.map(s => {
      const len = s.val / total * C;
      const el = `<circle cx="60" cy="60" r="${R}" fill="none" stroke="${s.c}" stroke-width="13"
        stroke-dasharray="${len.toFixed(2)} ${(C - len).toFixed(2)}"
        stroke-dashoffset="${(-acc).toFixed(2)}" transform="rotate(-90 60 60)"
        stroke-linecap="butt"><title>${s.nm}：${s.val}</title></circle>`;
      acc += len;
      return el;
    }).join('');

    const pct = (v.touched / total * 100).toFixed(1);
    $('#cVocab').innerHTML = `
      <div class="ch"><span class="ct">🍬 词汇掌握分布</span><span class="cs">共 ${total} 词</span></div>
      <div class="donut-wrap">
        <div class="donut">
          <svg viewBox="0 0 120 120" width="100%" height="100%">
            <circle cx="60" cy="60" r="${R}" fill="none" stroke="#F7F2F6" stroke-width="13"></circle>
            ${circles}
          </svg>
          <div class="mid"><b>${pct}%</b><span>已学 ${v.touched} 词</span></div>
        </div>
        <div class="legend">
          ${segs.map(s => `<div class="lg"><span class="dot" style="background:${s.c}"></span>
            <span class="nm">${s.nm}</span><span class="vl">${s.val}</span></div>`).join('')}
        </div>
      </div>`;
  }

  /* ---------- 学习趋势 ---------- */
  function renderTrend() {
    const days = Store.getRecentDays(trendRange);
    const keys = GOAL_META.map(m => m.key);
    const totals = days.map(d => keys.reduce((a, k) => a + (d[k] || 0), 0));
    const max = Math.max(1, ...totals);

    const W = 680, H = 210, padL = 30, padR = 8, padT = 10, padB = 26;
    const iw = W - padL - padR, ih = H - padT - padB;
    const step = iw / days.length;
    const bw = Math.max(4, Math.min(26, step * 0.62));

    let bars = '';
    days.forEach((d, i) => {
      const cx = padL + step * i + step / 2;
      let y = padT + ih;
      const detail = keys.map(k => (d[k] ? GOAL_META.find(m => m.key === k).name + ' ' + d[k] : '')).filter(Boolean).join(' / ');
      keys.forEach(k => {
        const val = d[k] || 0;
        if (!val) return;
        const h = val / max * ih;
        y -= h;
        const col = GOAL_META.find(m => m.key === k).color;
        bars += `<rect x="${(cx - bw / 2).toFixed(1)}" y="${y.toFixed(1)}" width="${bw.toFixed(1)}" height="${h.toFixed(1)}"
          fill="${col}" rx="2"><title>${d.date}\n${detail}</title></rect>`;
      });
      if (!totals[i]) {
        bars += `<rect x="${(cx - bw / 2).toFixed(1)}" y="${(padT + ih - 3).toFixed(1)}" width="${bw.toFixed(1)}" height="3"
          fill="#F3EAF0" rx="1.5"><title>${d.date}\n这天没有学习记录</title></rect>`;
      }
      const showLabel = trendRange <= 7 || i % Math.ceil(days.length / 7) === 0 || i === days.length - 1;
      if (showLabel) {
        bars += `<text x="${cx.toFixed(1)}" y="${H - 8}" font-size="10" fill="#B08FA0" text-anchor="middle">${d.date.slice(5)}</text>`;
      }
    });

    let axis = '';
    for (let g = 0; g <= 2; g++) {
      const yv = Math.round(max * g / 2);
      const yy = padT + ih - (yv / max) * ih;
      axis += `<line x1="${padL}" y1="${yy.toFixed(1)}" x2="${W - padR}" y2="${yy.toFixed(1)}"
                stroke="#F7EDF4" stroke-width="1"></line>
               <text x="${padL - 5}" y="${(yy + 3.5).toFixed(1)}" font-size="10" fill="#C6AEBC" text-anchor="end">${yv}</text>`;
    }

    const sum = totals.reduce((a, b) => a + b, 0);
    const activeDays = totals.filter(t => t > 0).length;

    $('#cTrend').innerHTML = `
      <div class="ch">
        <div><span class="ct">📈 学习趋势</span>
          <span class="cs">　近 ${trendRange} 天完成 ${sum} 项 · 有效学习 ${activeDays} 天</span></div>
        <div class="seg">
          <button data-range="7" class="${trendRange === 7 ? 'on' : ''}">近 7 天</button>
          <button data-range="30" class="${trendRange === 30 ? 'on' : ''}">近 30 天</button>
        </div>
      </div>
      <div class="chart"><svg viewBox="0 0 ${W} ${H}">${axis}${bars}</svg></div>
      <div class="tl">${GOAL_META.map(m =>
        `<span><i style="background:${m.color}"></i>${m.name}</span>`).join('')}</div>`;

    root.querySelectorAll('[data-range]').forEach(b => b.onclick = () => {
      trendRange = +b.dataset.range; renderTrend();
    });
  }

  /* ---------- 打卡日历 ---------- */
  function renderCalendar() {
    // 与 Store 的日期口径保持一致（Store 用 toISOString 切片），避免日历与打卡记录错位
    const tp = todayStr().split('-').map(Number);
    const base = new Date(tp[0], tp[1] - 1 + calOffset, 1);
    const y = base.getFullYear(), m = base.getMonth();
    const firstDow = new Date(y, m, 1).getDay();
    const dim = new Date(y, m + 1, 0).getDate();
    const checkin = Store.state.checkin.dates || {};
    const daily = Store.state.daily || {};
    const tStr = todayStr();

    let cells = ['日', '一', '二', '三', '四', '五', '六'].map(w => `<div class="wd">${w}</div>`).join('');
    for (let i = 0; i < firstDow; i++) cells += '<div class="cell empty"></div>';

    let checkedCnt = 0, studyCnt = 0;
    for (let day = 1; day <= dim; day++) {
      const key = y + '-' + String(m + 1).padStart(2, '0') + '-' + String(day).padStart(2, '0');
      const ck = !!checkin[key];
      const dd = daily[key];
      const amount = dd ? (dd.learned || 0) + (dd.reviews || 0) + (dd.listening || 0) + (dd.reading || 0) + (dd.essays || 0) : 0;
      if (ck) checkedCnt++;
      if (amount > 0) studyCnt++;
      const cls = ['cell'];
      if (ck) cls.push('checked'); else if (amount > 0) cls.push('study');
      if (key === tStr) cls.push('today');
      const tip = key + (ck ? ' 已打卡' : '') + (amount ? ' · 学习 ' + amount + ' 项' : '');
      cells += `<div class="${cls.join(' ')}" title="${tip}">
        <span class="d">${day}</span>${amount ? `<span class="dt">${amount}</span>` : ''}</div>`;
    }

    $('#cCal').innerHTML = `
      <div class="ch">
        <span class="ct">🗓️ 打卡日历</span>
        <div class="seg">
          <button id="calPrev">‹</button>
          <button class="on" style="cursor:default">${y}.${String(m + 1).padStart(2, '0')}</button>
          <button id="calNext" ${calOffset >= 0 ? 'disabled style="opacity:.35"' : ''}>›</button>
        </div>
      </div>
      <div class="cal">${cells}</div>
      <div class="calfoot">
        <span>本月打卡 <b>${checkedCnt}</b> 天</span>
        <span>有学习记录 <b>${studyCnt}</b> 天</span>
        <span>连续 <b>${Store.state.checkin.streak || 0}</b> 天</span>
      </div>`;

    $('#calPrev').onclick = () => { calOffset--; renderCalendar(); };
    const nx = $('#calNext');
    if (nx && calOffset < 0) nx.onclick = () => { calOffset++; renderCalendar(); };
  }

  /* ---------- 错题本 ---------- */
  function renderWrong() {
    const tabs = [
      { k: 'words', nm: '📚 单词', n: Store.getWrong('words').length },
      { k: 'listening', nm: '🎧 听力', n: Store.getWrong('listening').length },
      { k: 'reading', nm: '📖 阅读', n: Store.getWrong('reading').length }
    ];
    const ids = Store.getWrong(wrongTab);
    let list = '';

    if (!ids.length) {
      list = `<div class="empty-tip"><span class="e">🌈</span>这里还没有错题，继续保持～</div>`;
    } else if (wrongTab === 'words') {
      const wm = wordMap();
      list = ids.slice().reverse().map(id => {
        const w = wm[id];
        const title = w ? w.word : id;
        const sub = w ? ((w.pos ? '[' + w.pos + '] ' : '') + (w.cn || '') + (w.uk ? '  ' + w.uk : '')) : '（词库中未找到）';
        return `<div class="wi">
          <div class="main"><div class="t1">${esc(title)}</div><div class="t2">${esc(sub)}</div></div>
          <div class="acts">
            <button class="btn tiny" data-say="${esc(title)}">🔊</button>
            <button class="btn tiny" data-rm="${esc(id)}">移除</button>
          </div></div>`;
      }).join('');
    } else {
      const src = wrongTab === 'listening' ? allListening() : (window.READING || []);
      const map = {}; src.forEach(x => { map[x.id] = x; });
      list = ids.slice().reverse().map(id => {
        const it = map[id];
        const title = it ? it.title : id;
        const sub = it
          ? [it.year || '', it.scene || it.genre || '', it.stars ? '★'.repeat(it.stars) : ''].filter(Boolean).join(' · ')
          : '（题库中未找到）';
        return `<div class="wi">
          <div class="main"><div class="t1">${esc(title)}</div><div class="t2">${esc(sub)}</div></div>
          <div class="acts">
            <button class="btn tiny" data-go2="${wrongTab}">去重做</button>
            <button class="btn tiny" data-rm="${esc(id)}">移除</button>
          </div></div>`;
      }).join('');
    }

    $('#cWrong').innerHTML = `
      <div class="ch">
        <span class="ct">📕 错题本</span>
        <div class="tabs">${tabs.map(t =>
          `<button class="tab ${wrongTab === t.k ? 'on' : ''}" data-tab="${t.k}">${t.nm} ${t.n}</button>`).join('')}
        </div>
      </div>
      <div class="wlist">${list}</div>`;

    root.querySelectorAll('[data-tab]').forEach(b => b.onclick = () => { wrongTab = b.dataset.tab; renderWrong(); });
    root.querySelectorAll('[data-say]').forEach(b => b.onclick = () => {
      if (window.TTS) TTS.speakEn(b.dataset.say);
    });
    root.querySelectorAll('[data-go2]').forEach(b => b.onclick = () => {
      if (typeof window.switchTo === 'function') window.switchTo(b.dataset.go2);
    });
    root.querySelectorAll('[data-rm]').forEach(b => b.onclick = () => {
      Store.removeWrong(wrongTab, b.dataset.rm);
      renderWrong(); renderKpis();
      toast('已从错题本移除 ✨');
    });
  }

  /* ---------- 本周报告 ---------- */
  function renderReport() {
    const d14 = Store.getRecentDays(14);
    const prev = d14.slice(0, 7), curr = d14.slice(7);
    const sum = (arr, k) => arr.reduce((a, x) => a + (x[k] || 0), 0);

    const rows = GOAL_META.map(m => {
      const a = sum(curr, m.key), b = sum(prev, m.key);
      const diff = a - b;
      const cls = diff > 0 ? 'up' : (diff < 0 ? 'down' : 'flat');
      const txt = diff > 0 ? '↑ ' + diff : (diff < 0 ? '↓ ' + Math.abs(diff) : '持平');
      return { m, a, b, cls, txt };
    });

    const thisTotal = rows.reduce((n, r) => n + r.a, 0);
    const lastTotal = rows.reduce((n, r) => n + r.b, 0);
    const activeDays = curr.filter(x => GOAL_META.some(m => x[m.key])).length;
    const best = rows.slice().sort((x, y) => y.a - x.a)[0];
    const weak = rows.slice().sort((x, y) => x.a - y.a)[0];

    let advice;
    if (!thisTotal) {
      advice = '本周还没有学习记录哦。先从<b>今日任务清单</b>里最简单的一项开始，学 5 个单词也算数，奶糖在等你 🐶';
    } else {
      const trend = thisTotal >= lastTotal
        ? `本周共完成 <b>${thisTotal}</b> 项，比上周多了 <b>${thisTotal - lastTotal}</b> 项，状态在变好 🎉`
        : `本周共完成 <b>${thisTotal}</b> 项，比上周少了 <b>${lastTotal - thisTotal}</b> 项，明天补回来就行～`;
      const rhythm = activeDays >= 5
        ? `一周有 <b>${activeDays}</b> 天在学，节奏非常稳。`
        : `一周只学了 <b>${activeDays}</b> 天，建议把每天目标调小一点、但天天都碰一下，效果比突击好很多。`;
      advice = `${trend}<br/>${rhythm}<br/>最投入的是<b>${best.m.emoji} ${best.m.name}</b>；` +
        (weak.a === 0
          ? `本周还完全没碰<b>${weak.m.emoji} ${weak.m.name}</b>，明天补一次吧。`
          : `相对薄弱的是<b>${weak.m.emoji} ${weak.m.name}</b>（${weak.a} 次），可以再加一点。`);
    }

    $('#cReport').innerHTML = `
      <div class="ch"><span class="ct">📊 本周学习报告</span><span class="cs">近 7 天 vs 前 7 天</span></div>
      ${rows.map(r => `<div class="rrow">
          <span class="nm">${r.m.emoji} ${r.m.name}</span>
          <span class="nowv">${r.a}</span>
          <span class="cs">上周 ${r.b}</span>
          <span class="dl ${r.cls}">${r.txt}</span>
        </div>`).join('')}
      <div class="advice">${advice}</div>`;
  }

  function renderAll() {
    renderKpis();
    renderTasks();
    renderVocab();
    renderCalendar();
    renderTrend();
    renderWrong();
    renderReport();
  }

  return {
    mount(c) {
      c.innerHTML = '';
      root = c.shadowRoot || c.attachShadow({ mode: 'open' });
      root.innerHTML = CSS + HTML;
      trendRange = 7; wrongTab = 'words'; calOffset = 0; editingGoals = false;
      renderAll();
    },
    refresh() { if (root) renderAll(); }
  };
})();
