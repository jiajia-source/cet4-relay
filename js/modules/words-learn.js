/* 单词学习模块（Phase 1 实现） */
window.CET4Modules = window.CET4Modules || {};
window.CET4Modules['words-learn'] = {
  mount(c) {
    const W = window.WORDS || [];
    let filter = 'all';
    let query = '';
    let idx = 0;

    c.innerHTML = `
      <div class="wl-toolbar">
        <input class="input" id="wlSearch" placeholder="🔍 搜索单词或释义…">
        <select class="input" id="wlFilter">
          <option value="all">全部状态</option>
          <option value="mastered">✅ 已掌握</option>
          <option value="fuzzy">🌫️ 模糊不熟</option>
          <option value="unknown">❓ 完全陌生</option>
        </select>
        <span class="wl-progress" id="wlProg"></span>
        <button class="btn sm" id="wlListBtn">📋 列表</button>
      </div>
      <div id="wlView"></div>
    `;

    const search = c.querySelector('#wlSearch');
    const filterSel = c.querySelector('#wlFilter');
    const prog = c.querySelector('#wlProg');
    const view = c.querySelector('#wlView');
    const listBtn = c.querySelector('#wlListBtn');

    const ESC = s => String(s).replace(/[&<>"]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));

    function filtered() {
      return W.filter(w => {
        if (filter !== 'all' && Store.getWordStatus(w.id) !== filter) return false;
        if (query) {
          const q = query.toLowerCase();
          if (!w.word.toLowerCase().includes(q) && !w.cn.includes(query)) return false;
        }
        return true;
      });
    }

    function updateProg() {
      const total = W.length;
      const learned = W.filter(w => Store.getWordStatus(w.id)).length;
      prog.textContent = `已学 ${learned} / ${total}`;
    }

    function cardHTML(w) {
      return `
      <div class="wl-card cloud-card">
        <div class="wl-word-row">
          <span class="wl-word">${ESC(w.word)}</span>
          <span class="wl-pos">${ESC(w.pos)}</span>
        </div>
        <div class="wl-phon">
          <span>🇬🇧 ${ESC(w.uk)} <button class="wl-play" data-spk="${encodeURIComponent(w.word)}">🔊 英</button></span>
          <span>🇺🇸 ${ESC(w.us)} <button class="wl-play" data-spk="${encodeURIComponent(w.word)}">🔊 美</button></span>
        </div>
        <div class="wl-cn">${ESC(w.cn)}</div>

        <div class="wl-section"><span class="lbl">🌱 词根词缀</span><div class="val">${ESC(w.root)}</div></div>
        <div class="wl-section"><span class="lbl lav">💡 趣味联想</span><div class="val">${ESC(w.mnemonic)}</div></div>
        <div class="wl-section"><span class="lbl mint">🔤 谐音速记</span><div class="val">${ESC(w.homo)}</div></div>
        <div class="wl-section"><span class="lbl">🔄 词性变形</span><div class="val">${ESC(w.forms)}</div></div>
        <div class="wl-section"><span class="lbl">✨ 高频搭配</span><div class="val">${ESC(w.colloc)}</div></div>
        <div class="wl-section"><span class="lbl lav">📝 真题例句</span>
          <div class="val"><b>${ESC(w.example)}</b>
          <button class="wl-play" data-spk-ex="${encodeURIComponent(w.example)}">🔊 读例句</button></div>
          <div class="val muted">${ESC(w.exampleCn)}</div>
        </div>
        <div class="wl-section"><span class="lbl mint">⭐ 高分同义替换</span><div class="val">${ESC(w.syn)}</div></div>

        <div class="wl-status-row">
          <button class="btn mastered" data-mark="mastered">✅ 已掌握</button>
          <button class="btn fuzzy" data-mark="fuzzy">🌫️ 模糊不熟</button>
          <button class="btn unknown" data-mark="unknown">❓ 完全陌生</button>
        </div>
        <div class="wl-marked-tip" id="wlTip"></div>
        <div class="wl-nav">
          <button class="btn soft" id="wlPrev">← 上一个</button>
          <button class="btn soft" id="wlRand">🎲 随机</button>
          <button class="btn soft" id="wlNext">下一个 →</button>
        </div>
      </div>`;
    }

    function bindCard(host, w) {
      host.querySelectorAll('.wl-play[data-spk]').forEach(b =>
        b.onclick = () => TTS.speakEn(decodeURIComponent(b.dataset.spk)));
      const ex = host.querySelector('[data-spk-ex]');
      if (ex) ex.onclick = () => TTS.speakEn(decodeURIComponent(ex.dataset.spkEx));

      host.querySelectorAll('[data-mark]').forEach(b => b.onclick = () => {
        const mark = b.dataset.mark;
        const prev = Store.getWordStatus(w.id);
        Store.setWordStatus(w.id, mark);
        Store.scheduleWord(w.id, 0);            // 进入复习清单
        if (!prev) Store.bumpStat('learned');
        if (window.PuppyStudy) window.PuppyStudy.gain('words', 1);
        const labels = { mastered: '已掌握', fuzzy: '模糊不熟', unknown: '完全陌生' };
        host.querySelector('#wlTip').textContent =
          '已标记「' + labels[mark] + '」并加入复习清单 🐾';
        if (typeof window.floatHearts === 'function') window.floatHearts(5);
        updateProg();
      });

      host.querySelector('#wlPrev').onclick = () => { const l = filtered().length; idx = (idx - 1 + l) % l; render(); };
      host.querySelector('#wlNext').onclick = () => { const l = filtered().length; idx = (idx + 1) % l; render(); };
      host.querySelector('#wlRand').onclick = () => { idx = Math.floor(Math.random() * filtered().length); render(); };
    }

    function render() {
      const list = filtered();
      if (!list.length) { view.innerHTML = '<div class="placeholder">没有匹配的单词～换个筛选条件试试 🐾</div>'; updateProg(); return; }
      idx = Math.max(0, Math.min(idx, list.length - 1));
      const w = list[idx];
      view.innerHTML = cardHTML(w);
      updateProg();
      bindCard(view, w);
    }

    function renderList() {
      const list = filtered();
      view.innerHTML = '<div class="wl-grid">' + list.map(w => {
        const st = Store.getWordStatus(w.id) || 'none';
        return `<div class="wl-chip" data-word="${w.id}">
          <div class="w">${ESC(w.word)}<span class="s-dot dot-${st}"></span></div>
          <div class="muted" style="font-size:12px">${ESC(w.cn.split('；')[0])}</div>
        </div>`;
      }).join('') + '</div>';
      updateProg();
      view.querySelectorAll('.wl-chip').forEach(ch => ch.onclick = () => {
        filter = 'all'; filterSel.value = 'all'; query = ''; search.value = '';
        idx = filtered().findIndex(x => x.id === ch.dataset.word);
        listBtn.dataset.on = '0'; listBtn.textContent = '📋 列表';
        render();
      });
    }

    search.oninput = e => { query = e.target.value.trim(); idx = 0; (listBtn.dataset.on === '1' ? renderList() : render()); };
    filterSel.onchange = e => { filter = e.target.value; idx = 0; (listBtn.dataset.on === '1' ? renderList() : render()); };
    listBtn.onclick = () => {
      if (listBtn.dataset.on === '1') { listBtn.dataset.on = '0'; listBtn.textContent = '📋 列表'; render(); }
      else { listBtn.dataset.on = '1'; listBtn.textContent = '🃏 卡片'; renderList(); }
    };

    render();
  }
};
