/* 单词复习模块（Phase 2 实现） */
window.CET4Modules = window.CET4Modules || {};
window.CET4Modules['words-review'] = {
  mount(c) {
    const W = window.WORDS || [];
    const byId = id => W.find(w => w.id === id);
    const ESC = s => String(s == null ? '' : s).replace(/[&<>"]/g, m => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[m]));
    const norm = s => (s || '').trim().toLowerCase();
    const modeName = m => ({ dictation:'听音默写', cn2word:'释义填词', cloze:'真题挖空' }[m] || m);

    let session = null;

    /* ---- 复习池：仅用户在单词学习板块主动学过的单词（有学习状态且到达复习时间点）
     * 关键：三个模式（听音默写/释义填词/真题挖空）各自维护独立的「已复习」集合，互不影响显示。 ---- */
    function buildQueue(mode) {
      // 只返回「本模式尚未复习过」且到达艾宾浩斯复习时间点的单词；其他模式做没做过不干扰本模式
      const ids = Store.getDueWordsForMode(mode).slice();
      // 每个模式独立随机打乱顺序：避免三个模式复习顺序一致，导致在 A 模式靠「位置/顺序记忆」
      // 直接套用到 B 模式（例如听音默写记下的顺序泄露到真题挖空，凭印象选而非真懂句子）。
      for (let i = ids.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [ids[i], ids[j]] = [ids[j], ids[i]];
      }
      return ids;
    }

    function newSession(mode) {
      const due = buildQueue(mode);
      if (!due.length) {
        session = { mode, queue: [], idx: 0, correct: 0, total: 0, done: false, empty: true };
        renderDue();
        const pe = c.querySelector('#wrProg');
        if (pe) pe.innerHTML = '';
        renderEmpty();
        return;
      }
      session = { mode, queue: due, idx: 0, correct: 0, total: 0, done: false, empty: false };
      renderDue();
      renderProgress();
      renderQuestion();
    }

    /* ---- 🧪 试玩模式：随机抽词，纯体验小狗互动，不写入任何学习记录 ---- */
    function newDemoSession(mode) {
      let pool = W.filter(w => w.word && w.word.length > 2 && w.cn);
      if (mode === 'cloze') pool = pool.filter(w => w.example && w.example !== '—');
      const ids = pool.map(w => w.id);
      for (let i = ids.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [ids[i], ids[j]] = [ids[j], ids[i]];
      }
      session = { mode, queue: ids.slice(0, 6), idx: 0, correct: 0, total: 0, done: false, empty: false, demo: true };
      renderDue();
      renderProgress();
      renderQuestion();
    }

    function renderDue() {
      const el = c.querySelector('#wrDue');
      const mode = session.mode;
      if (session.demo) {
        const bs = 'border:1px solid #ffd6e0;background:#fff;color:#ff8fab;border-radius:999px;padding:2px 10px;margin-left:6px;font-size:12px;cursor:pointer';
        el.innerHTML =
          `<div class="wr-due-card">🧪 <b>试玩模式</b>：随机抽了 <b>${session.queue.length}</b> 个词，专门用来体验右上角小狗的反应——` +
          `答对会跳跃撒花并加狗粮，答错会耷拉耳朵安慰你。<b>不写入学习记录，也不影响艾宾浩斯排期</b>。` +
          `<div style="margin-top:6px">换题型：` +
          `<button class="wr-demo-m" data-m="cloze" style="${bs}">🔍 选词（最快）</button>` +
          `<button class="wr-demo-m" data-m="cn2word" style="${bs}">📝 填词</button>` +
          `<button class="wr-demo-m" data-m="dictation" style="${bs}">🔊 听写</button>` +
          `</div></div>`;
        el.querySelectorAll('.wr-demo-m').forEach(b => b.onclick = () => newDemoSession(b.dataset.m));
        return;
      }
      const totalDue = Store.getDueWords().length;        // 系统排期：到达复习时间点的单词总数（资格）
      const modeDue = Store.getDueWordsForMode(mode).length; // 本模式尚未复习的到期词
      const hasLearned = Object.keys(Store.state.words).length > 0;
      const mLabel = modeName(mode);
      if (totalDue === 0 && !hasLearned) {
        el.innerHTML = `<div class="wr-due-card soft">🌸 暂无学习记录，快去单词学习板块开始背词吧～</div>`;
      } else if (modeDue > 0) {
        el.innerHTML = `<div class="wr-due-card">📌 艾宾浩斯智能推送：<b>${mLabel}</b> 模式有 <b>${modeDue}</b> 个到期单词待复习。三种模式进度独立，需在本模式亲自复习才算完成～</div>`;
      } else if (totalDue > 0) {
        el.innerHTML = `<div class="wr-due-card soft">✅ <b>${mLabel}</b> 模式的到期单词都已复习完啦～ 可切换其他练习模式或稍后再来</div>`;
      } else {
        el.innerHTML = `<div class="wr-due-card soft">🌸 今天没有到达复习时间点的单词，去学习新词或稍后再来吧～</div>`;
      }
    }

    function renderEmpty() {
      const stage = c.querySelector('#wrStage');
      const hasLearned = Object.keys(Store.state.words).length > 0;
      const totalDue = Store.getDueWords().length;
      let emoji, title, desc, showGo = false;
      if (!hasLearned) {
        emoji = '📭'; title = '还没开始背词哦';
        desc = '快去「📚 单词学习」板块背词吧～<br/>首次学完的单词会自动加入艾宾浩斯复习计划，<br/>到达复习时间点就会在这里等你 🐾';
        showGo = true;
      } else if (totalDue === 0) {
        emoji = '🌸'; title = '今天没有到期单词';
        desc = '你学过的单词都还没到复习时间点～<br/>去学习新词，或稍后再来巩固吧 🐾';
        showGo = true;
      } else {
        emoji = '🌟'; title = `${modeName(session.mode)} 模式复习完成 🎉`;
        desc = `本模式的到期单词都复习完啦～<br/>其他练习模式可能还有单词没复习，切换上方标签看看吧 🐾`;
        showGo = false;
      }
      stage.innerHTML = `
        <div class="wr-empty cloud-card">
          <div class="wr-empty-emoji">${emoji}</div>
          <h3>${title}</h3>
          <p>${desc}</p>
          <div class="wr-finish-actions">
            ${showGo ? '<button class="btn primary" id="wrGoLearn">📚 去背单词</button>' : ''}
            <button class="btn soft" id="wrEmptyDemo">🧪 先试玩几个词（体验小狗）</button>
          </div>
        </div>`;
      const b = c.querySelector('#wrGoLearn');
      if (b) b.onclick = () => {
        const nav = document.querySelector('.nav-item[data-module="words-learn"]');
        if (nav) nav.click();
      };
      const dm = c.querySelector('#wrEmptyDemo');
      if (dm) dm.onclick = () => {
        c.querySelectorAll('.wr-tab').forEach(x => x.classList.remove('active'));
        const t = c.querySelector('#wrDemo'); if (t) t.classList.add('active');
        newDemoSession('cloze');
      };
    }

    function renderProgress() {
      const el = c.querySelector('#wrProg');
      if (session.empty) { el.innerHTML = ''; return; }
      const total = session.queue.length;
      const answered = session.idx; // 已提交题数 = 当前题索引
      const pct = answered ? Math.round(session.correct / answered * 100) : 0;
      const cur = Math.min(session.idx + 1, total);
      el.innerHTML =
        `<span class="wr-pill">模式：${modeName(session.mode)}</span>` +
        `<span class="wr-pill">进度：${cur} / ${total}</span>` +
        `<span class="wr-pill ok">✅ ${session.correct}</span>` +
        `<span class="wr-pill bad">❌ ${session.total - session.correct}</span>` +
        `<span class="wr-pill">正确率：${pct}%</span>`;
    }

    /* ---- 听音默写 / 释义填词（共用文本输入） ---- */
    function renderText(w, withAudio) {
      const stage = c.querySelector('#wrStage');
      stage.innerHTML = `
        <div class="wr-card cloud-card">
          <div class="wr-qhead">${withAudio ? '🔊 听音默写 — 根据发音写出单词' : '📝 释义填词 — 根据中文写出单词'}</div>
          ${withAudio
            ? `<div class="wr-play-big"><button class="btn play-lg" id="wrPlay">▶ 点击播放发音</button><span class="wr-hint">（发音只读单词，不显示拼写）</span></div>`
            : `<div class="wr-cn">${ESC(w.cn)} <span class="wr-pos">${ESC(w.pos)}</span></div>`}
          <div class="wr-input-row">
            <input class="input wr-ans" id="wrAns" placeholder="输入英文拼写…" autocomplete="off">
            <button class="btn primary" id="wrSubmit">提交</button>
          </div>
          ${withAudio ? `<div class="wr-cn-hint" id="wrCnHint"><span class="wr-cn-hint-label">💡 词义提示</span><span class="wr-cn-hint-text">${ESC(w.cn)}</span><button class="wr-hint-toggle" id="wrToggleHint" type="button">👁 隐藏</button></div>` : ''}
          <div class="wr-result" id="wrRes"></div>
          <div class="wl-nav"><button class="btn soft" id="wrNext" style="display:none">下一题 →</button></div>
        </div>`;
      const input = c.querySelector('#wrAns');
      if (withAudio) {
        c.querySelector('#wrPlay').onclick = () => TTS.speakEn(w.word);
        TTS.speakEn(w.word); // 自动播放一次
      }
      const submit = () => {
        const v = input.value;
        if (!v.trim()) { input.focus(); return; }
        answer(v, w);
      };
      c.querySelector('#wrSubmit').onclick = submit;
      input.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
      c.querySelector('#wrNext').onclick = goNext;
      const toggle = c.querySelector('#wrToggleHint');
      if (toggle) toggle.onclick = () => {
        const txt = c.querySelector('.wr-cn-hint-text');
        const lab = c.querySelector('.wr-cn-hint-label');
        const hidden = txt.style.display === 'none';
        txt.style.display = hidden ? '' : 'none';
        lab.style.display = hidden ? '' : 'none';
        toggle.textContent = hidden ? '👁 隐藏' : '👁 显示';
      };
      setTimeout(() => input.focus(), 50);
    }

    /* ---- 真题挖空选词 ---- */
    function renderCloze(w) {
      // 无例句则跳过该题（不计入统计）
      if (!w.example || w.example === '—') {
        session.idx++;
        if (session.idx >= session.queue.length) return finishSession();
        return renderQuestion();
      }
      const safe = w.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const re = new RegExp('\\b' + safe + '\\b', 'i');
      const cloze = w.example.replace(re, '＿＿＿＿＿＿');

      const cands = [w.word];
      const pool = W.filter(x => x.id !== w.id && x.word.length > 2);
      while (cands.length < 4 && pool.length) {
        const r = pool.splice(Math.floor(Math.random() * pool.length), 1)[0];
        cands.push(r.word);
      }
      for (let i = cands.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cands[i], cands[j]] = [cands[j], cands[i]];
      }

      const stage = c.querySelector('#wrStage');
      stage.innerHTML = `
        <div class="wr-card cloud-card">
          <div class="wr-qhead">🔍 真题挖空 — 选出合适的词填入横线</div>
          <div class="wr-cloze">${ESC(cloze)}</div>
          <div class="wr-candidates" id="wrCands">
            ${cands.map(cw => `<button class="wr-cand" data-c="${ESC(cw)}">${ESC(cw)}</button>`).join('')}
          </div>
          <div class="wr-result" id="wrRes"></div>
          <div class="wl-nav"><button class="btn soft" id="wrNext" style="display:none">下一题 →</button></div>
        </div>`;

      c.querySelectorAll('#wrCands .wr-cand').forEach(b => b.onclick = () => {
        const chosen = b.dataset.c;
        const isCorrect = norm(chosen) === norm(w.word);
      session.total++;
      if (isCorrect) session.correct++;
      if (!session.demo) {                                   // 试玩模式不写入任何学习数据
        if (!isCorrect) Store.addWrong('words', w.id);
        Store.markModeReviewed(w.id, session.mode, isCorrect); // 仅记录本模式；三模式都做过才推进全局排期
      }
        c.querySelectorAll('#wrCands .wr-cand').forEach(x => {
          if (norm(x.dataset.c) === norm(w.word)) x.classList.add('right');
          else if (x === b) x.classList.add('wrong');
          x.disabled = true;
        });
        showResult(w, isCorrect, chosen);
        renderProgress();
        if (window.ReviewBuddy) window.ReviewBuddy.react(isCorrect); // 悬浮小狗陪伴反馈（不影响判分）
      });
      c.querySelector('#wrNext').onclick = goNext;
    }

    /* ---- 提交判定（文本模式） ---- */
    function answer(userRaw, w) {
      const isCorrect = norm(userRaw) === norm(w.word);
      session.total++;
      if (isCorrect) session.correct++;
      if (!session.demo) {                                   // 试玩模式不写入任何学习数据
        if (!isCorrect) Store.addWrong('words', w.id);
        Store.markModeReviewed(w.id, session.mode, isCorrect); // 仅记录本模式；三模式都做过才推进全局排期
      }
      const inp = c.querySelector('#wrAns');
      if (inp) inp.disabled = true;
      showResult(w, isCorrect, userRaw);
      renderProgress();
      if (window.ReviewBuddy) window.ReviewBuddy.react(isCorrect); // 悬浮小狗陪伴反馈（不影响判分）
    }

    function showResult(w, isCorrect, userRaw) {
      const res = c.querySelector('#wrRes');
      const head = w.cn.split('；')[0];
      const sentence = (w.example && w.example !== '—')
        ? `<div class="wr-ex">📖 真题原句：${ESC(w.example)}<br/><span class="muted">译文：${ESC(w.exampleCn)}</span></div>`
        : '';
      // 真题挖空：无论对错都展示句子及翻译；其他模式仅答错时展示
      const showSentence = session.mode === 'cloze' || !isCorrect;
      if (isCorrect) {
        res.innerHTML = `<div class="wr-ok">✅ 回答正确！<span class="wr-w">${ESC(w.word)}</span> ${ESC(w.pos)} · ${ESC(head)}</div>`
          + (showSentence ? sentence : '');
      } else {
        const youLabel = session.mode === 'cloze' ? '你选的' : '你写的';
        res.innerHTML =
          `<div class="wr-bad">❌ 正确答案：<span class="wr-w">${ESC(w.word)}</span> ${ESC(w.pos)} · ${ESC(head)}` +
          `${userRaw ? `（${youLabel}：${ESC(userRaw)}）` : ''}</div>`
          + (showSentence ? sentence : '');
      }
      const nx = c.querySelector('#wrNext');
      if (nx) nx.style.display = '';
    }

    function goNext() {
      session.idx++;
      if (session.idx >= session.queue.length) finishSession();
      else { renderQuestion(); renderProgress(); }
    }

    function renderQuestion() {
      if (session.empty) return;
      const w = byId(session.queue[session.idx]);
      if (!w) return finishSession();
      if (session.mode === 'dictation') renderText(w, true);
      else if (session.mode === 'cn2word') renderText(w, false);
      else renderCloze(w);
    }

    /* ---- 一轮结算 ---- */
    function finishSession() {
      session.done = true;
      if (!session.demo) {
        Store.logReview(session.mode, session.correct, session.total);
        Store.bumpStat('reviews', session.total);
      }
      const allRight = !session.demo && session.total > 0 && session.correct === session.total;
      let reward = '';
      if (allRight) {
        Store.addFood(30);
        if (window.PuppyStudy) window.PuppyStudy.gain('review', 3);
        if (typeof window.floatHearts === 'function') window.floatHearts(8);
        reward = `<div class="wr-reward">🎉 本轮全对！小狗获得 <b>+30 🦴</b> 狗粮～</div>`;
      }
      const stage = c.querySelector('#wrStage');
      const pct = session.total ? Math.round(session.correct / session.total * 100) : 0;
      stage.innerHTML = `
        <div class="wr-card cloud-card">
          <div class="wr-finish">
            <div class="wr-finish-emoji">🐾</div>
            <h3>本轮复习完成！</h3>
            <p>共练习 <b>${session.total}</b> 词，正确 <b>${session.correct}</b>，正确率 <b>${pct}%</b></p>
            ${reward}
            <div class="wr-finish-actions">
              <button class="btn primary" id="wrAgain">🔁 再来一轮（${session.demo ? '试玩 · ' : ''}${modeName(session.mode)}）</button>
            </div>
            <p class="muted" style="margin-top:12px;font-size:13px">${session.demo ? '试玩不计入学习记录～点上方标签可回到真实复习' : '想换种方式？点上方标签切换其他练习模式即可～'}</p>
          </div>
        </div>`;
      c.querySelector('#wrAgain').onclick = () => (session.demo ? newDemoSession(session.mode) : newSession(session.mode));
    }

    /* ---- 容器与事件绑定 ---- */
    c.innerHTML = `
      <div class="wr-wrap">
        <div class="wr-tabs">
          <button class="wr-tab active" data-mode="dictation">🔊 听音默写</button>
          <button class="wr-tab" data-mode="cn2word">📝 释义填词</button>
          <button class="wr-tab" data-mode="cloze">🔍 真题挖空</button>
          <button class="wr-tab" id="wrDemo" style="margin-left:auto" title="随机抽几个词，仅用于体验小狗互动，不写入学习记录">🧪 试玩</button>
        </div>
        <div class="wr-due" id="wrDue"></div>
        <div class="wr-progress" id="wrProg"></div>
        <div class="wr-stage" id="wrStage"></div>
      </div>`;

    // 右上角常驻悬浮小狗伙伴（独立浮层，不参与复习布局，也不改动任何复习逻辑）
    if (window.ReviewBuddy) window.ReviewBuddy.attach(c);

    c.querySelectorAll('.wr-tab[data-mode]').forEach(t => t.onclick = () => {
      c.querySelectorAll('.wr-tab').forEach(x => x.classList.remove('active'));
      t.classList.add('active');
      newSession(t.dataset.mode);
    });

    const demoBtn = c.querySelector('#wrDemo');
    if (demoBtn) demoBtn.onclick = () => {
      c.querySelectorAll('.wr-tab').forEach(x => x.classList.remove('active'));
      demoBtn.classList.add('active');
      newDemoSession(session && session.mode ? session.mode : 'cn2word');
    };

    newSession('dictation');
  }
};
