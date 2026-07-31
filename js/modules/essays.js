/* 作文素材模块：万能模板 / 高级句式 / 低分词替换 / 话题语料 / 范文解析
 * 契约：window.CET4Modules.essays = { mount(c) }，c = #body-essays
 * 复用通用类 .btn / .cloud-card / .pill；tab 用 .es-tab
 */
(function () {
  const CET4 = window.CET4Modules = window.CET4Modules || {};
  function ESC(s) {
    return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  }

  let cur = null;

  function mount(c) {
    cur = c;
    render('templates');
  }

  /* 复制（file:// 下 clipboard 可能不可用，降级用 textarea+execCommand） */
  function copyText(text, btn) {
    const done = () => {
      const old = btn.textContent;
      btn.textContent = '✓ 已复制';
      btn.classList.add('copied');
      setTimeout(() => { btn.textContent = old; btn.classList.remove('copied'); }, 1200);
    };
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done));
      } else {
        fallbackCopy(text, done);
      }
    } catch (e) {
      fallbackCopy(text, done);
    }
  }
  function fallbackCopy(text, done) {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      done();
    } catch (e) { /* 忽略 */ }
  }

  /* ---------- 外壳：tab + 面板 ---------- */
  const TABS = [
    { k: 'templates', label: '📐 万能模板' },
    { k: 'sentences', label: '✨ 高级句式' },
    { k: 'upgrades', label: '🔁 低分词替换' },
    { k: 'topics', label: '📚 话题语料' },
    { k: 'models', label: '📝 范文解析' },
    { k: 'write', label: '✍️ 写作练习' }
  ];

  function render(kind) {
    const data = window.ESSAYS || {};
    const tabs = TABS.map(t => `<button class="es-tab ${t.k === kind ? 'active' : ''}" data-k="${t.k}">${t.label}</button>`).join('');
    cur.innerHTML = `<div class="es-wrap">
      <div class="module-desc es-desc">点任意「📋 复制」把素材存到剪贴板，写作时直接套用。挑一个话题开写吧～</div>
      <div class="es-tabs" id="esTabs">${tabs}</div>
      <div class="es-panel" id="esPanel">${panel(kind, data)}</div>
    </div>`;
    cur.querySelectorAll('.es-tab').forEach(tab => {
      tab.onclick = () => render(tab.dataset.k);
    });
    bindPanel(kind);
  }

  function panel(kind, data) {
    if (kind === 'templates') return templatesHTML(data.templates || []);
    if (kind === 'sentences') return sentencesHTML(data.sentences || []);
    if (kind === 'upgrades') return upgradesHTML(data.upgrades || []);
    if (kind === 'topics') return topicsHTML(data.topics || []);
    if (kind === 'models') return modelsHTML(data.models || []);
    if (kind === 'write') return writeHTML();
    return '';
  }

  function bindPanel(kind) {
    if (kind === 'write') { bindWrite(); return; }
    cur.querySelectorAll('.es-copy').forEach(b => {
      b.onclick = () => copyText(b.dataset.copy || '', b);
    });
  }

  /* ---------- 万能模板 ---------- */
  function templatesHTML(list) {
    if (!list.length) return emptyHTML();
    return list.map((t, ti) => `
      <div class="cloud-card es-tpl">
        <div class="es-tpl-head">
          <span class="es-tpl-type">${ESC(t.type)}</span>
          <button class="btn sm es-copy" data-copy="${ESC(t.blocks.map(b => b.label + '：' + b.text).join('\n\n'))}">📋 复制全部</button>
        </div>
        <div class="es-tpl-desc">${ESC(t.desc || '')}</div>
        <div class="es-tpl-blocks">
          ${t.blocks.map(b => `
            <div class="es-tpl-block">
              <div class="es-tpl-label">${ESC(b.label)}</div>
              <div class="es-tpl-text">${ESC(b.text)}</div>
              <button class="btn tiny es-copy" data-copy="${ESC(b.text)}">📋 复制此段</button>
            </div>`).join('')}
        </div>
      </div>`).join('');
  }

  /* ---------- 高级句式 ---------- */
  function sentencesHTML(list) {
    if (!list.length) return emptyHTML();
    return `<div class="es-list">
      ${list.map(s => `
        <div class="cloud-card es-row">
          <div class="es-row-cat">${ESC(s.cat)}</div>
          <div class="es-row-main">
            <div class="es-row-en">${ESC(s.en)}</div>
            <div class="es-row-zh">${ESC(s.zh)}</div>
          </div>
          <button class="btn tiny es-copy" data-copy="${ESC(s.en)}">📋</button>
        </div>`).join('')}
    </div>`;
  }

  /* ---------- 低分词替换 ---------- */
  function upgradesHTML(list) {
    if (!list.length) return emptyHTML();
    return `<div class="es-list">
      ${list.map(u => `
        <div class="cloud-card es-up">
          <div class="es-up-low">${ESC(u.low)}</div>
          <div class="es-up-arrow">→</div>
          <div class="es-up-high">${ESC(u.high)}</div>
          <div class="es-up-note">${ESC(u.note || '')}</div>
          <button class="btn tiny es-copy" data-copy="${ESC(u.high)}">📋</button>
        </div>`).join('')}
    </div>`;
  }

  /* ---------- 话题语料 ---------- */
  function topicsHTML(list) {
    if (!list.length) return emptyHTML();
    return list.map(t => `
      <div class="cloud-card es-topic">
        <div class="es-topic-title">${ESC(t.topic)}</div>
        <div class="es-topic-sub">核心词</div>
        <div class="es-chips">${t.words.map(w => `<span class="es-chip">${ESC(w)}</span>`).join('')}</div>
        <div class="es-topic-sub">实用短语</div>
        <div class="es-phrases">${t.phrases.map(p => `<span class="es-phrase">${ESC(p)}</span>`).join('')}</div>
      </div>`).join('');
  }

  /* ---------- 范文解析 ---------- */
  function modelsHTML(list) {
    if (!list.length) return emptyHTML();
    return list.map(m => `
      <div class="cloud-card es-model">
        <div class="es-model-head">
          <span class="es-model-title">${ESC(m.title)}</span>
          <span class="es-model-type">${ESC(m.type)}</span>
        </div>
        <div class="es-model-outline">🧭 结构：${ESC(m.outline || '')}</div>
        <div class="es-model-paras">
          ${m.paras.map(p => `
            <div class="es-model-para">
              <span class="es-para-role">${ESC(p.role)}</span>
              <div class="es-para-en">${ESC(p.en)}</div>
              <div class="es-para-zh">${ESC(p.zh)}</div>
            </div>`).join('')}
        </div>
        <div class="es-model-notes">💡 ${ESC(m.notes || '')}</div>
        <button class="btn sm es-copy" data-copy="${ESC(m.paras.map(p => p.role + '：' + p.en).join('\n\n'))}">📋 复制全文</button>
      </div>`).join('');
  }

  function emptyHTML() { return '<div class="es-empty">暂无内容～</div>'; }

  /* ---------- 写作练习 / 智能批改（规则辅助，离线可用） ---------- */
  const WRITE_TOPICS = [
    { zh: "人工智能会取代人类思考吗？", en: "Will artificial intelligence replace human thinking?" },
    { zh: "短视频对注意力与阅读习惯的影响", en: "The impact of short videos on attention and reading habits" },
    { zh: "如何应对焦虑与压力（心理健康）", en: "How to cope with anxiety and stress" },
    { zh: "绿色低碳生活：我们能做什么", en: "Low-carbon living: what we can do" },
    { zh: "人际交往与代际沟通", en: "Interpersonal relationships and communication across generations" },
    { zh: "终身学习为什么重要", en: "Why lifelong learning matters" },
    { zh: "传统文化与文化自信", en: "Traditional culture and cultural confidence" },
    { zh: "网络安全与数字素养", en: "Cyber security and digital literacy" }
  ];

  function writeHTML() {
    const opts = WRITE_TOPICS.map((t, i) => `<option value="${i}">${ESC(t.zh)}</option>`).join('')
      + `<option value="custom">✏️ 自定义话题…</option>`;
    return `
    <div class="es-write">
      <div class="es-write-tip">📌 选一个近年四级真题方向的话题（或自定义），用英文写 120–180 词，提交后系统会按<b>字数 / 结构 / 高级词汇 / 句式 / 词汇丰富度 / 语言规范</b>给你打分并给改进建议。<br><span class="es-note">说明：这是基于规则的<b>辅助批改</b>（离线、无需联网），帮你自检，不等于真人 / AI 精批。</span></div>
      <div class="es-write-row">
        <label class="es-write-lab">话题</label>
        <select class="es-write-sel" id="esTopic">${opts}</select>
      </div>
      <div class="es-write-custom" id="esCustomWrap" hidden>
        <input class="es-write-input" id="esCustom" placeholder="输入你的作文话题，如：是否应该限制中小学生使用手机？" />
      </div>
      <div class="es-write-prompt" id="esPrompt"></div>
      <textarea class="es-write-area" id="esWrite" placeholder="在这里写你的英文作文…（写完后点下方「提交批改」）" spellcheck="false"></textarea>
      <div class="es-write-bar">
        <span class="es-wc" id="esWc">0 词</span>
        <button class="btn play-lg" id="esGrade">📊 提交批改</button>
      </div>
      <div id="esWriteResult"></div>
    </div>`;
  }

  function bindWrite() {
    const topicSel = cur.querySelector('#esTopic');
    const customWrap = cur.querySelector('#esCustomWrap');
    const customInput = cur.querySelector('#esCustom');
    const promptBox = cur.querySelector('#esPrompt');
    const area = cur.querySelector('#esWrite');
    const wc = cur.querySelector('#esWc');
    function refreshPrompt() {
      const v = topicSel.value;
      if (v === 'custom') {
        customWrap.hidden = false;
        promptBox.textContent = 'Directions: For this part, you are allowed 30 minutes to write an essay on the topic given by yourself. You should write at least 120 words but no more than 180 words.';
      } else {
        customWrap.hidden = true;
        const t = WRITE_TOPICS[+v];
        promptBox.textContent = 'Directions: For this part, you are allowed 30 minutes to write an essay on the topic "' + t.en + '". You should write at least 120 words but no more than 180 words.';
      }
    }
    topicSel.onchange = refreshPrompt;
    refreshPrompt();
    const updWc = () => {
      const n = (area.value.trim().match(/\S+/g) || []).length;
      wc.textContent = n + ' 词';
    };
    area.oninput = updWc;
    cur.querySelector('#esGrade').onclick = () => {
      const v = topicSel.value;
      const topicName = (v === 'custom') ? (customInput.value.trim() || '自定义话题') : WRITE_TOPICS[+v].zh;
      const val = area.value.trim();
      if (val.length) {
        if (typeof Store !== 'undefined' && Store.bumpStat) Store.bumpStat('essays', 1);
        if (window.PuppyStudy) window.PuppyStudy.gain('essays', 3);
        if (typeof window.updateChrome === 'function') window.updateChrome();
      }
      cur.querySelector('#esWriteResult').innerHTML = gradeEssay(val, topicName);
    };
  }

  function gradeEssay(text, topicName) {
    const raw = (text || '').trim();
    const tokens = raw ? raw.split(/\s+/) : [];
    const wc = tokens.length;
    const sentences = raw.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 0);
    const paras = raw.split(/\n\s*\n/).map(s => s.trim()).filter(s => s.length > 0);

    const ups = (window.ESSAYS && window.ESSAYS.upgrades) || [];
    const advSet = new Set();
    const lowMap = {};
    ups.forEach(u => {
      (u.high || '').split('/').forEach(w => { const x = w.trim().toLowerCase(); if (x) advSet.add(x); });
      const low = (u.low || '').toLowerCase();
      const high = (u.high || '').split('/')[0].trim();
      if (low) lowMap[low] = high;
    });
    const words = tokens.map(t => t.toLowerCase().replace(/[^a-z']/g, '')).filter(Boolean);
    const advHits = new Set();
    words.forEach(w => { if (advSet.has(w)) advHits.add(w); });

    const CONNECTORS = ['however', 'moreover', 'therefore', 'furthermore', 'in addition', 'nevertheless', 'while', 'although', 'besides', "what's more", 'consequently', 'in contrast', 'on the other hand', 'for example', 'for instance'];
    const connHits = new Set();
    CONNECTORS.forEach(c => { if (new RegExp('\\b' + c.replace(/'/g, "\\'") + '\\b', 'i').test(raw)) connHits.add(c); });

    const structList = [];
    if (/only by/i.test(raw)) structList.push('Only by…（倒装）');
    if (/it is .*? that/i.test(raw)) structList.push('It is…that（强调）');
    if (/there is no denying/i.test(raw)) structList.push('There is no denying…');
    if (/not only .*? but also/i.test(raw)) structList.push('not only…but also');
    if (/so .*? that/i.test(raw)) structList.push('so…that');

    const unique = new Set(words);
    const richness = wc ? unique.size / wc : 0;

    let normPenalty = 0;
    const normIssues = [];
    sentences.forEach(s => {
      const first = s.charAt(0);
      if (first && /[a-z]/.test(first)) { normPenalty += 2; normIssues.push('句首未大写'); }
      if (!/[.!?]$/.test(s)) { normPenalty += 1; normIssues.push('句末缺标点'); }
    });
    if (sentences.some(s => s.split(/\s+/).length > 45)) { normPenalty += 2; normIssues.push('存在超长句(>45词)'); }
    normPenalty = Math.min(normPenalty, 10);

    let wordScore;
    if (wc < 80) wordScore = 0; else if (wc < 100) wordScore = 14; else if (wc < 120) wordScore = 20; else if (wc <= 180) wordScore = 25; else if (wc <= 220) wordScore = 22; else wordScore = 18;

    const paraCount = Math.max(paras.length, sentences.length ? 1 : 0);
    const tail = sentences.slice(-2).join(' ');
    const hasConclusion = /in conclusion|to sum up|all in all|in summary|as a result|in brief/i.test(tail);
    let structScore;
    if (paraCount >= 3 && hasConclusion) structScore = 20;
    else if (paraCount >= 2 && (hasConclusion || sentences.length >= 4)) structScore = 16;
    else if (paraCount >= 2) structScore = 12;
    else if (paraCount === 1) structScore = 6;
    else structScore = 3;

    const vocabScore = Math.min(20, advHits.size * 4);
    const sentScore = Math.min(15, connHits.size * 3 + (structList.length ? 3 : 0));
    const richScore = richness >= 0.55 ? 10 : richness >= 0.45 ? 7 : richness >= 0.35 ? 4 : 2;
    const normScore = Math.max(0, 10 - normPenalty);
    const total = wordScore + structScore + vocabScore + sentScore + richScore + normScore;

    let band, emoji;
    if (total >= 85) { band = '优秀'; emoji = '🌟'; }
    else if (total >= 70) { band = '良好'; emoji = '👍'; }
    else if (total >= 55) { band = '及格偏上'; emoji = '🙂'; }
    else { band = '需加强'; emoji = '💪'; }

    const sug = [];
    if (wc < 120) sug.push('字数偏少（当前 ' + wc + ' 词）。四级建议 120–180 词，可再展开理由或举例。');
    if (wc > 200) sug.push('篇幅偏长（' + wc + ' 词），建议精简到 180 词内。');
    if (advHits.size === 0) sug.push('几乎没用到加分词，试着把 good / important / think 换成 beneficial / crucial / maintain 等（见「低分词替换」）。');
    if (connHits.size < 3) sug.push('连接词偏少（仅 ' + connHits.size + ' 个）。多用 However / Moreover / Therefore / In addition 让逻辑更连贯。');
    if (paraCount < 2) sug.push('建议至少分 2–3 段（开头—主体—结尾），结构更清晰。');
    if (richness < 0.45) sug.push('词汇重复偏多（丰富度 ' + (richness * 100).toFixed(0) + '%），用同义词替换提升表达。');
    const lowFound = words.filter(w => lowMap[w]);
    if (lowFound.length) {
      const seen = new Set(); const tips = [];
      lowFound.forEach(w => { if (!seen.has(w)) { seen.add(w); tips.push('“' + w + '” → ' + lowMap[w]); } });
      sug.push('发现可升级的平淡词：' + tips.slice(0, 6).join('；') + '。');
    }
    if (normIssues.length) sug.push('语言规范：' + [...new Set(normIssues)].join('、') + '。注意句首大写、句末标点，避免超长句。');
    if (!sug.length) sug.push('整体很棒！继续保持四段式结构与高级表达。');

    const hi = [];
    if (advHits.size) hi.push('加分词：' + [...advHits].slice(0, 8).join(', '));
    if (connHits.size) hi.push('连接词：' + [...connHits].join(', '));
    if (structList.length) hi.push('高级句型：' + structList.join('；'));

    const bar = (label, val, max) => `<div class="es-score-row"><span class="es-score-lab">${label}</span><div class="es-score-track"><div class="es-score-fill" style="width:${Math.round(val / max * 100)}%"></div></div><span class="es-score-val">${val}/${max}</span></div>`;
    return `<div class="es-report">
      <div class="es-report-head">${emoji} 批改结果：<b>${band}</b> · 综合 ${total}/100</div>
      ${bar('字数', wordScore, 25)}${bar('结构', structScore, 20)}${bar('高级词汇', vocabScore, 20)}${bar('句式多样性', sentScore, 15)}${bar('词汇丰富度', richScore, 10)}${bar('语言规范', normScore, 10)}
      <div class="es-report-sec">✨ 亮点</div>
      <div class="es-report-hi">${hi.length ? hi.join('<br>') : '（暂无明显亮点，多用加分词和连接词）'}</div>
      <div class="es-report-sec">🛠 改进建议</div>
      <ul class="es-report-sug">${sug.map(s => `<li>${s}</li>`).join('')}</ul>
      <div class="es-report-foot">话题：<b>${ESC(topicName)}</b> · 字数 ${wc} 词。以上为规则辅助批改，正式考试请以阅卷标准为准～</div>
    </div>`;
  }

  CET4.essays = { mount };
})();
