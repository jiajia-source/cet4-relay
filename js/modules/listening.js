/* 听力专项模块（Phase 3 实现，含真题套卷）
 * 数据：window.LISTENING（短/长/新闻/篇章/拓展） + window.LISTENING_EXAM（真题套卷）
 * 依赖：Store（进度/狗粮/错题）、TTS（离线发音）、window.floatHearts
 */
window.CET4Modules = window.CET4Modules || {};
window.CET4Modules.listening = {
  mount(c) {
    const L = (window.LISTENING || []).concat(window.LISTENING_EXAM || []);
    const TYPE_LABEL = {
      short: '短对话', long: '长对话', news: '新闻',
      passage: '篇章', feature: '拓展', exam: '真题套卷'
    };
    const TYPES = [
      { key: 'all', label: '全部' },
      { key: 'short', label: '短对话' },
      { key: 'long', label: '长对话' },
      { key: 'news', label: '新闻' },
      { key: 'passage', label: '篇章' },
      { key: 'feature', label: '拓展' },
      { key: 'exam', label: '真题套卷' }
    ];
    const ABCD = ['A', 'B', 'C', 'D'];

    let curType = 'all';
    let curYear = 'all';

    const ESC = s => String(s == null ? '' : s).replace(/[&<>"]/g,
      m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]));

    function years() {
      const set = new Set();
      L.forEach(it => { if (it.year) set.add(it.year); });
      return Array.from(set).sort();
    }

    function list() {
      let items = L.slice();
      if (curType !== 'all') items = items.filter(it => it.type === curType);
      if (curYear !== 'all') items = items.filter(it => it.year === curYear);
      // 错题本优先排前
      const wrong = (Store.getWrong && Store.getWrong('listening')) || [];
      items.sort((a, b) => (wrong.includes(b.id) - wrong.includes(a.id)));

      const wrongBtn = `<button class="btn sm ls-wrongbook" id="lsWrong">⭐ 错题本 (${wrong.length})</button>`;
      const tabs = `<div class="ls-tabs">` + TYPES.map(t =>
        `<button class="ls-tab ${t.key === curType ? 'active' : ''}" data-type="${t.key}">${t.label}</button>`).join('') + `</div>`;
      const yb = `<div class="ls-year-bar"><span class="ls-year-label">年份</span>` +
        `<button class="ls-year ${curYear === 'all' ? 'active' : ''}" data-year="all">全部</button>` +
        years().map(y => `<button class="ls-year ${curYear === y ? 'active' : ''}" data-year="${ESC(y)}">${ESC(y)}</button>`).join('') + `</div>`;

      const grid = items.length ? `<div class="ls-grid">` + items.map(it => {
        const tl = TYPE_LABEL[it.type] || it.type;
        const stars = '★'.repeat(it.stars || 0) + '☆'.repeat(5 - (it.stars || 0));
        const isWrong = wrong.includes(it.id);
        const yearBadge = it.year ? `<span class="ls-card-year ${it.type === 'exam' ? 'ext' : ''}">${ESC(it.year)}</span>` : '';
        return `<div class="ls-card cloud-card" data-id="${ESC(it.id)}">
          <div class="ls-card-top">${yearBadge}<span class="ls-card-type">${tl}</span>
            ${isWrong ? '<span class="ls-card-wrong">⭐</span>' : ''}</div>
          <div class="ls-card-title">${ESC(it.title)}</div>
          <div class="ls-card-scene">${ESC(it.scene || '')}</div>
          <div class="ls-card-stars">${stars}</div>
          <div class="ls-card-meta">${it.questions ? it.questions.length + ' 题' : ''}${it.audio ? ' · 真题原声' : ''}</div>
        </div>`;
      }).join('') + `</div>` : `<div class="ls-empty">没有符合条件的听力材料～换个筛选试试 🐾</div>`;

      c.innerHTML = `<div class="ls-wrap">
        <div class="ls-head">${tabs}${wrongBtn}</div>
        ${yb}
        ${grid}
      </div>`;

      c.querySelectorAll('.ls-tab').forEach(b => b.onclick = () => { curType = b.dataset.type; list(); });
      c.querySelectorAll('.ls-year').forEach(b => b.onclick = () => { curYear = b.dataset.year; list(); });
      c.querySelectorAll('.ls-card').forEach(el => el.onclick = () => open(el.dataset.id));
      const wb = c.querySelector('#lsWrong');
      if (wb) wb.onclick = () => wrongbook();
    }

    function wrongbook() {
      const wrong = (Store.getWrong && Store.getWrong('listening')) || [];
      if (!wrong.length) { list(); return; }
      const items = L.filter(it => wrong.includes(it.id));
      c.innerHTML = `<div class="ls-wrap">
        <button class="btn soft ls-back" id="lsBack">← 返回</button>
        <div class="ls-section-title">⭐ 听力错题本（${items.length}）</div>
        <div class="ls-grid">` + items.map(it => `<div class="ls-card cloud-card" data-id="${ESC(it.id)}">
          <div class="ls-card-top"><span class="ls-card-type">${TYPE_LABEL[it.type] || it.type}</span></div>
          <div class="ls-card-title">${ESC(it.title)}</div>
          <div class="ls-card-scene">${ESC(it.scene || '')}</div>
        </div>`).join('') + `</div></div>`;
      c.querySelector('#lsBack').onclick = list;
      c.querySelectorAll('.ls-card').forEach(el => el.onclick = () => open(el.dataset.id));
    }

    function open(id) {
      const it = L.find(x => x.id === id);
      if (!it) { list(); return; }
      const hasLines = !!(it.lines && it.lines.length);
      const tl = TYPE_LABEL[it.type] || it.type;
      const stars = '★'.repeat(it.stars || 0) + '☆'.repeat(5 - (it.stars || 0));

      const isExam = it.type === 'exam';
      if (isExam) {
        // 真题套卷：原声音频 + 答题；提交后弹原文
        c.innerHTML = `<div class="ls-player">
          <button class="btn soft ls-back" id="lsBack">← 返回列表</button>
          <div class="ls-player-bar">
            <span class="ls-badge">${tl}</span>
            <span class="ls-title">${ESC(it.title)}</span>
            <span class="ls-card-stars" style="margin-left:auto">${stars}</span>
          </div>
          <div class="ls-audio">
            <span class="ls-audio-label">🎧 真题原声</span>
            <audio class="ls-audio-el" controls preload="none" src="${ESC(it.audio || '')}"></audio>
          </div>
          <div class="ls-transcript" id="lsTranscript">
            <div class="ls-empty">🎧 本套为真题原声，请听上方音频作答～<br/>共 ${it.questions ? it.questions.length : 0} 题，完成后可查看听力原文并逐句跟读。</div>
          </div>
          ${quizHTML(it)}
        </div>`;
      } else if (hasLines) {
        c.innerHTML = `<div class="ls-player">
          <button class="btn soft ls-back" id="lsBack">← 返回列表</button>
          <div class="ls-player-bar">
            <span class="ls-badge">${tl}</span>
            <span class="ls-title">${ESC(it.title)}</span>
            <span class="ls-card-stars" style="margin-left:auto">${stars}</span>
          </div>
          <div class="ls-speed">
            <span class="ls-speed-label">倍速</span>
            <button class="ls-rate" data-rate="0.8">0.8×</button>
            <button class="ls-rate active" data-rate="1">1.0×</button>
            <button class="ls-rate" data-rate="1.2">1.2×</button>
          </div>
          <div class="ls-controls">
            <div class="ls-mode">
              <button class="ls-mode-btn active" data-mode="sentence">逐句播放</button>
              <button class="ls-mode-btn" data-mode="all">全部播放</button>
            </div>
            <div class="ls-actions">
              <button class="ls-mode-btn" id="lsToggleEn">隐藏英文</button>
              <label class="ls-loop"><input type="checkbox" id="lsLoop"> 单句循环</label>
            </div>
          </div>
          <div class="ls-transcript" id="lsTranscript">
            ${it.lines.map((ln, i) => `
              <div class="ls-line" data-i="${i}">
                <button class="ls-line-play" data-i="${i}">▶</button>
                <span class="ls-spk ${ESC(ln.spk || 'N')}">${ESC(ln.spk || 'N')}</span>
                <span class="ls-en">${ESC(ln.en)}</span>
                <span class="ls-zh zh-hidden">${ESC(ln.zh || '')}</span>
              </div>`).join('')}
          </div>
          ${quizHTML(it)}
        </div>`;
      }

      c.querySelector('#lsBack').onclick = list;
      if (!isExam && hasLines) bindPlayer(it);
      bindQuiz(it);
    }

    function quizHTML(it) {
      const qs = it.questions || [];
      const blocks = qs.map((q, i) => `
        <div class="ls-quiz-block" data-i="${i}">
          <div class="ls-quiz-q"><span class="ls-qnum">${i + 1}.</span>${ESC(q.q || '')}</div>
          <div class="ls-opts">
            ${(q.options || []).map((o, k) => `
              <button class="ls-opt" data-key="${k}">
                <span class="ls-opt-key">${ABCD[k]}</span><span>${ESC(o)}</span>
              </button>`).join('')}
          </div>
          <div class="ls-result" hidden></div>
        </div>`).join('');
      return `<div class="ls-quiz">
        <div class="ls-quiz-head">📝 配套练习（${qs.length} 题）</div>
        ${blocks}
        <div class="ls-wrong-actions"><button class="btn play-lg" id="lsSubmit">📝 提交判分</button></div>
        <div class="ls-done" hidden id="lsDone"></div>
      </div>`;
    }

    /* ---------- 播放器（TTS） ---------- */
    function bindPlayer(it) {
      const lines = it.lines || [];
      const transcriptEl = c.querySelector('#lsTranscript');
      const lineEls = Array.from(c.querySelectorAll('.ls-line'));
      let curRate = 1, mode = 'sentence', loopOn = false;
      let loopI = -1, playingAll = false;

      c.querySelectorAll('.ls-rate').forEach(b => b.onclick = () => {
        c.querySelectorAll('.ls-rate').forEach(x => x.classList.remove('active'));
        b.classList.add('active');
        curRate = parseFloat(b.dataset.rate);
      });
      c.querySelectorAll('.ls-mode-btn[data-mode]').forEach(b => b.onclick = () => {
        c.querySelectorAll('.ls-mode-btn[data-mode]').forEach(x => x.classList.remove('active'));
        b.classList.add('active');
        mode = b.dataset.mode;
        if (mode === 'all') playAll(); else stopAll();
      });
      const loopEl = c.querySelector('#lsLoop');
      loopEl.onchange = () => { loopOn = loopEl.checked; if (!loopOn) loopI = -1; };
      const toggleEn = c.querySelector('#lsToggleEn');
      toggleEn.onclick = () => {
        const hide = transcriptEl.classList.toggle('en-hidden');
        toggleEn.textContent = hide ? '显示英文' : '隐藏英文';
      };

      function speakOne(i, after) {
        if (!lines[i]) { if (after) after(); return; }
        lineEls[i].classList.add('playing');
        if (typeof TTS !== 'undefined') {
          TTS.speakEn(lines[i].en, {
            rate: curRate,
            onend: () => {
              lineEls[i].classList.remove('playing');
              if (loopOn && loopI === i) speakOne(i, null);
              else if (after) after();
            }
          });
        } else if (after) after();
      }

      function playLine(i) {
        stopAll();
        loopI = loopOn ? i : -1;
        speakOne(i, null);
      }
      function playAll() {
        stopAll();
        playingAll = true;
        transcriptEl.classList.add('playing-all');
        let i = 0;
        (function step() {
          if (!playingAll || i >= lines.length) { stopAll(); return; }
          speakOne(i, () => { i++; step(); });
        })();
      }
      function stopAll() {
        playingAll = false; loopI = -1;
        transcriptEl.classList.remove('playing-all');
        lineEls.forEach(e => e.classList.remove('playing'));
        if (typeof TTS !== 'undefined') TTS.stop();
      }

      lineEls.forEach(el => {
        const i = +el.dataset.i;
        el.querySelector('.ls-line-play').onclick = (e) => { e.stopPropagation(); playLine(i); };
        el.onclick = () => {
          const zh = el.querySelector('.ls-zh');
          if (zh) zh.classList.toggle('zh-hidden');
          playLine(i);
        };
      });
    }

    /* ---------- 真题原文面板（提交后：按钮展开 + 整篇连续朗读） ---------- */
    function showExamTranscript(it) {
      const done = c.querySelector('#lsDone');
      if (!done) return;
      const lines = it.lines || [];
      const wrap = document.createElement('div');
      wrap.className = 'ls-exam-area';
      wrap.innerHTML = `
        <button class="btn play-lg" id="lsShowTranscript">📜 点击查看听力原文（边听边看）</button>
        <div class="ls-exam-transcript" id="lsExamTranscript" hidden>
          <div class="ls-exam-bar">
            <button class="btn ls-play-all" id="lsPlayAll">▶ 整篇朗读</button>
            <button class="btn" id="lsReplayAudio">🎧 听真题原声</button>
            <button class="btn sm" id="lsHideTranscript">收起原文</button>
          </div>
          <div class="ls-exam-lines">
            ${lines.map((ln, i) => `<div class="ls-exam-line" data-i="${i}">
              <span class="ls-exam-num">${i + 1}</span>
              <span class="ls-exam-en">${ESC(ln.en)}</span>
            </div>`).join('')}
          </div>
        </div>`;
      done.insertAdjacentElement('afterend', wrap);

      const showBtn = wrap.querySelector('#lsShowTranscript');
      const panel = wrap.querySelector('#lsExamTranscript');
      const lineEls = Array.from(panel.querySelectorAll('.ls-exam-line'));
      let playing = false;
      const playBtns = () => Array.from(wrap.querySelectorAll('.ls-play-all'));
      function setPlayLabel(txt) { playBtns().forEach(pb => pb.textContent = txt); }
      function stopAll() {
        playing = false;
        lineEls.forEach(e => e.classList.remove('playing'));
        if (typeof TTS !== 'undefined') TTS.stop();
        setPlayLabel('▶ 整篇朗读');
      }
      function startAll() {
        if (playing) return;
        playing = true;
        setPlayLabel('⏸ 停止朗读');
        let i = 0;
        (function step() {
          if (!playing || i >= lines.length) { stopAll(); return; }
          lineEls.forEach((e, j) => e.classList.toggle('playing', j === i));
          if (typeof TTS !== 'undefined') {
            TTS.speakEn(lines[i].en, { rate: 1, onend: () => { if (lineEls[i]) lineEls[i].classList.remove('playing'); i++; step(); } });
          } else { if (lineEls[i]) lineEls[i].classList.remove('playing'); i++; step(); }
        })();
      }
      function togglePlay() { if (playing) stopAll(); else startAll(); }
      showBtn.onclick = () => { panel.hidden = false; showBtn.hidden = true; };
      wrap.querySelector('#lsHideTranscript').onclick = () => {
        panel.hidden = true; showBtn.hidden = false; stopAll();
        const a = c.querySelector('.ls-audio-el'); if (a) a.pause();
        const ab = wrap.querySelector('#lsReplayAudio'); if (ab) ab.textContent = '🎧 听真题原声';
      };
      const audioBtn = wrap.querySelector('#lsReplayAudio');
      function syncAudioLabel() {
        const a = c.querySelector('.ls-audio-el');
        if (audioBtn) audioBtn.textContent = (a && !a.paused) ? '⏸ 暂停原声' : '🎧 听真题原声';
      }
      function toggleAudio() {
        const a = c.querySelector('.ls-audio-el');
        if (!a) return;
        if (!a.paused) a.pause();
        else { if (a.ended) a.currentTime = 0; a.play(); }
        syncAudioLabel();
      }
      audioBtn.onclick = toggleAudio;
      const audioEl0 = c.querySelector('.ls-audio-el');
      if (audioEl0) audioEl0.addEventListener('ended', syncAudioLabel);
      playBtns().forEach(pb => pb.onclick = togglePlay);
    }

    /* ---------- 答题判分 ---------- */
    function bindQuiz(it) {
      const blocks = Array.from(c.querySelectorAll('.ls-quiz-block'));
      const submitBtn = c.querySelector('#lsSubmit');
      const doneEl = c.querySelector('#lsDone');
      let awarded = false;

      submitBtn.onclick = () => {
        let correct = 0;
        blocks.forEach(block => {
          const i = +block.dataset.i;
          const q = (it.questions || [])[i];
          if (!q) return;
          const opts = Array.from(block.querySelectorAll('.ls-opt'));
          const sel = opts.find(o => o.classList.contains('selected'));
          const selKey = sel ? +sel.dataset.key : -1;
          const ans = q.answer;
          let ok = false;
          opts.forEach(o => {
            o.disabled = true;
            const k = +o.dataset.key;
            if (k === ans) o.classList.add('correct');
            else if (k === selKey) o.classList.add('wrong');
          });
          const res = block.querySelector('.ls-result');
          if (selKey === ans) { correct++; ok = true; }
          const wrong = !ok;
          res.hidden = false;
          res.innerHTML = `<div class="ls-judge ${ok ? 'ok' : 'bad'}">${ok ? '✅ 回答正确' : '❌ 回答错误'}（正确答案 ${ABCD[ans]}）</div>
            <div class="ls-explain">${ESC(q.explain || '解析暂缺～')}</div>` +
            (wrong ? `<div class="ls-wrong-actions"><button class="btn sm" data-fav>⭐ 收藏到错题本</button></div>` : '');
          const fav = res.querySelector('[data-fav]');
          if (fav) fav.onclick = () => {
            if (Store.addWrong) { Store.addWrong('listening', it.id); fav.textContent = '✅ 已收藏'; fav.disabled = true; }
          };
        });

        const total = blocks.length;
        const score = total ? Math.round(correct / total * 100) : 0;
        if (!awarded && total > 0) {
          awarded = true;
          if (Store.addFood) Store.addFood(40);
          if (window.PuppyStudy) window.PuppyStudy.gain('listening', 3);
          if (Store.bumpStat) Store.bumpStat('listening', 1);
          if (typeof window.floatHearts === 'function') window.floatHearts(10);
          if (typeof window.updateChrome === 'function') window.updateChrome();
        }
        doneEl.hidden = false;
        doneEl.textContent = `🎉 完成！正确 ${correct}/${total}（${score}分），获得 🦴 +40 狗粮～`;
        submitBtn.disabled = true;
        if (it.type === 'exam' && it.lines && it.lines.length) showExamTranscript(it);
      };

      blocks.forEach(block => {
        block.querySelectorAll('.ls-opt').forEach(o => o.onclick = () => {
          if (o.disabled) return;
          block.querySelectorAll('.ls-opt').forEach(x => x.classList.remove('selected'));
          o.classList.add('selected');
        });
      });
    }

    list();
  }
};
