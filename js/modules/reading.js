/* 分级阅读模块（Phase 4 重做）：整篇横排、点句出翻译、无朗读、下出真题级阅读理解题
 * 契约：window.CET4Modules.reading = { mount(c) }，c = #body-reading
 * 复用：Store.addWrong / Store.addFood / Store.bumpStat / Store.getWrong / window.floatHearts / window.updateChrome
 */
(function () {
  const CET4 = window.CET4Modules = window.CET4Modules || {};
  function ESC(s) {
    return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  }
  function stars(n) { return '★'.repeat(n) + '☆'.repeat(5 - n); }

  let cur = null;

  function mount(c) {
    cur = c;
    renderList();
  }

  /* ---------- 列表 ---------- */
  function renderList() {
    const list = (window.READING || []);
    const wrongSet = (typeof Store !== 'undefined') ? new Set(Store.getWrong('reading') || []) : new Set();
    const topics = [];
    list.forEach(it => { const t = it.genre || '未分类'; if (!topics.includes(t)) topics.push(t); });
    const tabs = [{ key: 'all', label: '全部' }, { key: 'exam', label: '📌 真题' }]
      .concat(topics.map(t => ({ key: 't:' + t, label: t })))
      .map(t => `<button class="rd-tab ${t.key === 'all' ? 'active' : ''}" data-key="${t.key}">${t.label}</button>`).join('');
    const cards = list.map(it => {
      const wrong = wrongSet.has(it.id) ? '<span class="rd-card-wrong" title="有错题">⭐</span>' : '';
      const examBadge = it.isExam ? '<span class="rd-exam-badge" title="四级真题">真题</span>' : '';
      return `<div class="cloud-card rd-card" data-id="${it.id}" data-topic="${ESC(it.genre || '未分类')}" data-exam="${it.isExam ? 1 : 0}">
        <div class="rd-card-top"><span class="rd-level">${ESC(it.genre || '未分类')}</span>${examBadge}${wrong}</div>
        <div class="rd-card-title">${ESC(it.title)}</div>
        <div class="rd-card-topic">${ESC(it.year || '原创')} · 阅读理解 ${(it.questions || []).length} 题</div>
        <div class="rd-card-stars">${stars(it.stars || 3)}</div>
      </div>`;
    }).join('');

    cur.innerHTML = `<div class="rd-wrap">
      <div class="rd-head">
        <div class="module-desc">点开一篇，整篇文章横排呈现；<b>点句子</b>才浮现中文翻译，下方直接出真题级阅读题。按<b>话题</b>筛选，「📌 真题」单独成栏。</div>
        <button class="btn sm rd-wrongbook" id="rdWrongBook">⭐ 错题本 (${wrongSet.size})</button>
      </div>
      <div class="rd-tabs rd-tabs-wrap" id="rdTabs">${tabs}</div>
      <div class="rd-grid" id="rdGrid">${cards}</div>
    </div>`;

    cur.querySelectorAll('.rd-card').forEach(card => {
      card.onclick = () => { const it = list.find(x => x.id === card.dataset.id); if (it) open(it); };
    });
    const wb = cur.querySelector('#rdWrongBook');
    if (wb) wb.onclick = renderWrongBook;
    cur.querySelectorAll('.rd-tab').forEach(tab => {
      tab.onclick = () => {
        const key = tab.dataset.key;
        cur.querySelectorAll('.rd-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        cur.querySelectorAll('#rdGrid .rd-card').forEach(c => {
          if (key === 'all') c.style.display = '';
          else if (key === 'exam') c.style.display = (c.dataset.exam === '1') ? '' : 'none';
          else c.style.display = (c.dataset.topic === key.slice(2)) ? '' : 'none';
        });
      };
    });
  }

  function renderWrongBook() {
    const all = (window.READING || []);
    const wrongSet = new Set((typeof Store !== 'undefined') ? (Store.getWrong('reading') || []) : []);
    const items = all.filter(it => wrongSet.has(it.id));
    if (!items.length) {
      cur.innerHTML = `<div class="rd-wrap">
        <button class="btn sm rd-back" id="rdBack">← 返回</button>
        <div class="rd-empty">🎉 还没有收藏的阅读错题～<br>做阅读时答错的题点「收藏到错题本」就会出现在这里。</div>
      </div>`;
      cur.querySelector('#rdBack').onclick = renderList;
      return;
    }
    cur.innerHTML = `<div class="rd-wrap">
      <button class="btn sm rd-back" id="rdBack">← 返回</button>
      <div class="module-desc" style="margin-bottom:14px">⭐ 阅读错题本（共 ${items.length} 篇）</div>
      <div class="rd-grid">
        ${items.map(it => `<div class="cloud-card rd-card" data-id="${it.id}">
          <div class="rd-card-top"><span class="rd-level">${ESC(it.genre || '未分类')}</span></div>
          <div class="rd-card-title">${ESC(it.title)}</div>
          <div class="rd-card-topic">${ESC(it.year || '原创')}</div>
        </div>`).join('')}
      </div>
    </div>`;
    cur.querySelector('#rdBack').onclick = renderList;
    cur.querySelectorAll('.rd-card').forEach(card => {
      card.onclick = () => { const it = all.find(x => x.id === card.dataset.id); if (it) open(it); };
    });
  }

  /* ---------- 阅读器 ---------- */
  function open(it) {
    const paras = it.paras || [];
    const articleHTML = paras.map((para, pi) => {
      const inner = para.map((s, si) => {
        const k = pi + '-' + si;
        return `<span class="rd-s" data-k="${k}">${ESC(s.en)} </span><span class="rd-s-zh" data-k="${k}">${ESC(s.zh)}</span>`;
      }).join('');
      return `<div class="rd-para">${inner}</div>`;
    }).join('');

    const vocabHTML = (it.vocab && it.vocab.length) ? `
      <div class="rd-vocab">
        <button class="btn sm" id="rdVocabBtn">📘 生词提示（点击展开 ${it.vocab.length} 个）</button>
        <div class="rd-notes" id="rdNotes" hidden>${it.vocab.map(v => `<span class="rd-note"><b>${ESC(v.w)}</b> ${ESC(v.m)}</span>`).join('')}</div>
      </div>` : '';

    const quizHTML = (it.questions || []).map((qn, qi) => `
      <div class="rd-quiz-block" data-q="${qi}">
        <div class="rd-quiz-q"><span class="rd-qnum">${qi + 1}.</span>${ESC(qn.q)}</div>
        <div class="rd-opts">
          ${qn.options.map((o, oi) => `<button class="rd-opt" data-q="${qi}" data-o="${oi}">
            <span class="rd-opt-key">${String.fromCharCode(65 + oi)}</span><span class="rd-opt-txt">${ESC(o)}</span>
          </button>`).join('')}
        </div>
      </div>`).join('');

    cur.innerHTML = `<div class="rd-wrap">
      <button class="btn sm rd-back" id="rdBack">← 返回列表</button>
      <div class="rd-reader">
        <div class="rd-bar">
          <span class="rd-badge">Lv.${it.level}</span>
          ${it.isExam ? '<span class="rd-badge rd-badge-exam">📌 真题</span>' : ''}
          <span class="rd-title">${ESC(it.title)}</span>
        </div>
        <div class="rd-topic-pill">${ESC(it.genre)} · ${ESC(it.year || '')}${it.isExam && it.source ? ' · ' + ESC(it.source) : ''}</div>
        <div class="rd-tip">💡 整篇文章横排阅读；<b>点任意一句英文</b>，它的中文翻译就会在下方浮现。读完直接做下面的阅读题。</div>
        <div class="rd-article">${articleHTML}</div>
        ${vocabHTML}
        <div class="rd-quiz">
          <div class="rd-quiz-head">📝 阅读理解（提交后判分）</div>
          ${quizHTML}
        </div>
        <div style="margin-top:14px"><button class="btn play-lg" id="rdSubmit">提交判分</button></div>
        <div id="rdResult"></div>
      </div>
    </div>`;

    cur.querySelector('#rdBack').onclick = renderList;

    // 点句出翻译
    cur.querySelectorAll('.rd-s').forEach(sp => {
      sp.onclick = () => {
        const k = sp.dataset.k;
        sp.classList.toggle('on');
        const zh = cur.querySelector('.rd-s-zh[data-k="' + k + '"]');
        if (zh) zh.classList.toggle('show');
      };
    });

    // 生词折叠
    const vb = cur.querySelector('#rdVocabBtn');
    if (vb) vb.onclick = () => {
      const notes = cur.querySelector('#rdNotes');
      notes.hidden = !notes.hidden;
      vb.textContent = notes.hidden ? `📘 生词提示（点击展开 ${it.vocab.length} 个）` : '📕 收起生词';
    };

    // 选项选中
    cur.querySelectorAll('.rd-opt').forEach(op => {
      op.onclick = () => {
        const qi = op.dataset.q;
        cur.querySelectorAll('.rd-opt[data-q="' + qi + '"]').forEach(o => o.classList.remove('selected'));
        op.classList.add('selected');
      };
    });

    cur.querySelector('#rdSubmit').onclick = () => submit(it);
  }

  /* ---------- 判分 ---------- */
  function submit(it) {
    const qns = it.questions || [];
    let correct = 0;
    const wrongIdx = [];
    qns.forEach((qn, qi) => {
      const block = cur.querySelector('.rd-quiz-block[data-q="' + qi + '"]');
      const chosen = block.querySelector('.rd-opt.selected');
      const chosenO = chosen ? +chosen.dataset.o : -1;
      block.querySelectorAll('.rd-opt').forEach(o => {
        const oi = +o.dataset.o;
        o.classList.remove('selected');
        if (oi === qn.answer) o.classList.add('correct');
        if (oi === chosenO && oi !== qn.answer) o.classList.add('wrong');
        o.disabled = true;
      });
      if (chosenO === qn.answer) {
        correct++;
      } else {
        wrongIdx.push(qi);
        if (typeof Store !== 'undefined') Store.addWrong('reading', it.id);
      }
      const exp = document.createElement('div');
      exp.className = 'rd-explain';
      exp.innerHTML = `<b>解析：</b>${ESC(qn.explain)}`;
      block.appendChild(exp);
    });

    const total = qns.length;
    const pct = Math.round((correct / total) * 100);
    const ok = correct === total;
    const result = cur.querySelector('#rdResult');
    result.innerHTML = `
      <div class="rd-result">
        <div class="rd-judge ${ok ? 'ok' : 'bad'}">${ok ? '🎉 全对！' : '判分结果'}　${correct} / ${total}（${pct}分）</div>
        ${wrongIdx.length ? `<div class="rd-wrong-actions"><button class="btn sm" id="rdCollect">⭐ 收藏错题到错题本</button></div>` : ''}
        <div class="rd-done">🦴 完成阅读 +40 狗粮　·　坚持每天一篇，四级阅读稳了！</div>
      </div>`;
    const submitBtn = cur.querySelector('#rdSubmit');
    if (submitBtn) submitBtn.disabled = true;

    if (typeof Store !== 'undefined') {
      Store.addFood(40);
      if (window.PuppyStudy) window.PuppyStudy.gain('reading', 3);
      Store.bumpStat('reading', 1);
    }
    if (typeof window.floatHearts === 'function') window.floatHearts(ok ? 14 : 8);
    if (typeof window.updateChrome === 'function') window.updateChrome();

    const collect = result.querySelector('#rdCollect');
    if (collect) collect.onclick = () => {
      collect.textContent = '✅ 已收藏'; collect.disabled = true;
    };
  }

  CET4.reading = { mount };
})();
