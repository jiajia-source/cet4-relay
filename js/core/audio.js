/*!
 * audio.js —— 全局语音播放引擎（Web Speech API 封装）
 * ---------------------------------------------------------------------------
 * 这一版集中解决移动端「点了没声音 / 声音重叠 / 第一次特别慢」三类顽疾：
 *
 *   ① 自动播放解锁：浏览器要求「用户手势」之后才允许出声。
 *      这里在 document 上挂一次性捕获监听，用户点页面任何位置都会静默解锁，
 *      不需要额外的「点我开启声音」按钮。
 *   ② 单例播放：每次 speak 前先 cancel 上一条，并暂停页面里正在播的真题原声，
 *      保证任意时刻只有一个声音。
 *   ③ 兼容性检测：不支持 Web Speech 的内核（部分微信 X5、老安卓）只提示一次。
 *   ④ 按钮状态：加载中 / 播放中 / 失败 三种 class，配合 css/mobile.css 呈现。
 *   ⑤ 预热与预加载：解锁时唤醒引擎并预取 voice 列表；按下（pointerdown）发音按钮
 *      的瞬间就预热，比等到 click 再启动约提前 80~150ms。
 *   ⑥ 看门狗：部分内核 speak() 之后既不 onstart 也不 onerror（静默失败），
 *      超时后自动重试一次，仍失败才提示用户。
 *
 * 对外 API（完全向后兼容旧版）：
 *   TTS.speak(text, opts) / speakEn / speakZh / stop / setRate / getRate
 *   TTS.isEnabled() / pickVoice(lang)
 *   新增：TTS.isSupported() / isUnlocked() / unlock() / preload(list) / env
 * ---------------------------------------------------------------------------
 */
(function (global) {
  'use strict';

  /* ===================== 0. 运行环境探测 ===================== */
  var UA = (global.navigator && global.navigator.userAgent) || '';
  var ENV = {
    ua: UA,
    isWeChat:  /MicroMessenger/i.test(UA),                        // 微信内置浏览器
    isX5:      /(TBS\/|X5Core|MQQBrowser|QQBrowser)/i.test(UA),   // 腾讯 X5 内核（微信/QQ/QQ浏览器）
    isIOS:     /iPad|iPhone|iPod/i.test(UA),
    isAndroid: /Android/i.test(UA),
    isHarmony: /HarmonyOS|OpenHarmony/i.test(UA),
    isUC:      /UCBrowser/i.test(UA),
    isQuark:   /Quark/i.test(UA)
  };

  var synth = global.speechSynthesis;
  var Utter = global.SpeechSynthesisUtterance;
  /** 当前内核是否具备朗读能力 */
  var SUPPORTED = !!(synth && typeof Utter === 'function' && typeof synth.speak === 'function');

  /* ===================== 1. 提示与日志出口 ===================== */

  /** 统一走 toast.js；toast.js 没加载时降级到控制台，绝不抛错 */
  function tip(msg, type) {
    if (global.UI && typeof global.UI.toast === 'function') global.UI.toast(msg, type || 'warn');
    else console.warn('[TTS]', msg);
  }
  function log() {
    if (!TTSConfig.debug) return;
    try { console.log.apply(console, ['[TTS]'].concat([].slice.call(arguments))); } catch (e) {}
  }
  function logErr(msg, extra) {
    try { console.error('[TTS] ' + msg, extra === undefined ? '' : extra); } catch (e) {}
  }

  /** 可调参数，方便二次开发时改行为 */
  var TTSConfig = {
    debug: false,          // 打开后控制台会输出播放全过程
    warmOnPress: true,     // 按下发音按钮即预热引擎
    watchdogMs: 1600,      // 看门狗超时（超过这个时间没开始播就判定异常）
    autoRetry: true        // 静默失败后自动重试一次
  };

  /* ===================== 2. 兼容性检测（只提示一次） ===================== */
  var unsupportedNotified = false;
  function notifyUnsupported() {
    if (unsupportedNotified) return;
    unsupportedNotified = true;
    if (ENV.isWeChat) {
      tip('微信内置浏览器不支持单词朗读，点右上角「···」→ 在浏览器中打开就能听啦 🌸', 'warn');
    } else {
      tip('当前浏览器不支持单词朗读，换 Chrome / Edge / 系统浏览器可正常发音 🔇', 'warn');
    }
    logErr('当前内核不支持 Web Speech Synthesis：' + UA);
  }

  /* ===================== 3. 自动播放解锁 ===================== */
  var unlocked = false;
  var silentEl = null;   // 一段 44 字节的静音 wav，用来顺便解锁 HTMLAudio 通道
  var audioCtx = null;

  /** 创建静音音频元素（真题原声播放器也依赖同一次手势解锁） */
  function silentAudio() {
    if (silentEl) return silentEl;
    silentEl = new Audio('data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAgD4AAAB9AAACABAAZGF0YQAAAAA=');
    silentEl.volume = 0;
    silentEl.preload = 'auto';
    silentEl.setAttribute('playsinline', 'true'); // iOS 不要全屏接管
    return silentEl;
  }

  /**
   * 真正的解锁动作：静音播一下 + 唤醒 AudioContext + 空发声唤醒 TTS 引擎。
   * 必须在用户手势的同步调用栈里执行才有效，所以监听用的是捕获阶段。
   */
  function unlock(reason) {
    if (unlocked) return true;
    unlocked = true;
    log('解锁音频，触发来源：' + reason);

    // ——① HTMLAudio 通道（真题原声 <audio> 用得到）——
    try {
      var p = silentAudio().play();
      if (p && typeof p.catch === 'function') {
        p.catch(function (e) { log('静音解锁被拒绝（不影响朗读）', e && e.name); });
      }
    } catch (e) { log('静音解锁异常', e); }

    // ——② WebAudio 上下文（部分内核不 resume 就整体静音）——
    try {
      var AC = global.AudioContext || global.webkitAudioContext;
      if (AC) {
        audioCtx = audioCtx || new AC();
        if (audioCtx.state === 'suspended' && audioCtx.resume) audioCtx.resume();
      }
    } catch (e) { log('AudioContext 唤醒异常', e); }

    // ——③ TTS 引擎预热：发一条音量为 0 的空白语音——
    if (SUPPORTED) {
      try {
        synth.cancel();
        var u = new Utter(' ');
        u.volume = 0;
        u.rate = 1;
        synth.speak(u);
      } catch (e) { log('引擎预热异常', e); }
      refreshVoices();
    }

    detachUnlockListeners();
    return true;
  }

  // 任意一种首次交互都算手势：优先 pointerdown（最早触发），其余作兜底
  var UNLOCK_EVENTS = ['pointerdown', 'touchstart', 'mousedown', 'keydown', 'click'];
  function onFirstInteract() { unlock('用户首次交互'); }
  function attachUnlockListeners() {
    for (var i = 0; i < UNLOCK_EVENTS.length; i++) {
      document.addEventListener(UNLOCK_EVENTS[i], onFirstInteract, { capture: true, passive: true });
    }
  }
  function detachUnlockListeners() {
    for (var i = 0; i < UNLOCK_EVENTS.length; i++) {
      document.removeEventListener(UNLOCK_EVENTS[i], onFirstInteract, true);
    }
  }
  attachUnlockListeners();

  // 微信 X5 专属：JSBridge 就绪后才允许出声，这里补一次解锁时机
  if (ENV.isWeChat) {
    if (global.WeixinJSBridge && global.WeixinJSBridge.invoke) {
      unlock('WeixinJSBridge 已就绪');
    } else {
      document.addEventListener('WeixinJSBridgeReady', function () { unlock('WeixinJSBridgeReady'); }, false);
    }
  }

  /* ===================== 4. 发音人（voice）管理 ===================== */
  var voices = [];
  var voiceCache = {};   // lang -> voice，避免每次朗读都重新遍历
  var voiceTries = 0;

  /**
   * 拉取系统发音人列表。
   * 安卓/部分内核首次返回空数组，需要轮询等待（onvoiceschanged 不一定触发）。
   */
  function refreshVoices() {
    if (!SUPPORTED) return;
    try { voices = synth.getVoices() || []; } catch (e) { voices = []; }
    if (voices.length) {
      voiceCache = {};
      log('发音人已就绪，共 ' + voices.length + ' 个');
      return;
    }
    if (voiceTries++ < 20) setTimeout(refreshVoices, 250);  // 最多等 5 秒
  }
  if (SUPPORTED) {
    refreshVoices();
    try { synth.onvoiceschanged = refreshVoices; } catch (e) {}
  }

  // 英文发音人优先级：优先挑发音自然、口音标准的
  var EN_PREFER = [/google.*us.*english/i, /google.*uk.*english/i, /samantha/i,
                   /microsoft.*(aria|jenny|zira|guy)/i, /english.*united states/i];
  var ZH_PREFER = [/google.*(中文|mandarin)/i, /microsoft.*(xiaoxiao|yaoyao|huihui|kangkang)/i, /ting-ting/i];

  /**
   * 按语言挑一个最合适的发音人
   * @param {string} langPref 'en' | 'zh'
   */
  function pickVoice(langPref) {
    langPref = (langPref || 'en').toLowerCase();
    if (voiceCache[langPref]) return voiceCache[langPref];
    if (!voices.length) refreshVoices();
    if (!voices.length) return null;

    var pool = voices.filter(function (v) {
      return ((v.lang || '').toLowerCase().replace('_', '-')).indexOf(langPref) === 0;
    });
    if (!pool.length) pool = voices.slice();

    var prefer = langPref.indexOf('zh') === 0 ? ZH_PREFER : EN_PREFER;
    var best = null, bestScore = -1;
    pool.forEach(function (v) {
      var score = 0;
      for (var i = 0; i < prefer.length; i++) {
        if (prefer[i].test(v.name || '')) { score += (prefer.length - i) * 10; break; }
      }
      if (v.localService) score += 3;   // 本地发音人不依赖网络，弱网更稳
      if (v.default) score += 1;
      if (score > bestScore) { bestScore = score; best = v; }
    });
    voiceCache[langPref] = best || pool[0];
    return voiceCache[langPref];
  }

  /* ===================== 5. 发音按钮状态 ===================== */
  var CLS = { loading: 'spk-loading', playing: 'spk-playing', error: 'spk-error' };

  /** 项目里所有「点了会出声」的元素，命中后自动挂状态 class */
  var BTN_SELECTOR = [
    '.wl-play',        // 单词学习：音标旁的小喇叭 / 读例句
    '.spk',            // 消消乐卡片喇叭
    '#spk',            // 闯关听音题喇叭
    '#wrPlay',         // 复习：听音默写大按钮
    '.play-lg',
    '[data-spk]', '[data-spk-ex]', '[data-say]',
    '.ls-line',        // 听力逐句：点句朗读
    '[data-audio-btn]' // 二次开发预留：任意元素加这个属性即可获得状态样式
  ].join(',');

  var lastBtn = null, lastBtnAt = 0;
  var knownRoots = [];   // 记录遇到过的 Shadow Root（闯关/消消乐/看板/养成页都用了 Shadow DOM）

  /**
   * 取事件的真实目标。
   * 闯关、消消乐、数据看板、小狗养成这几个模块用了 Shadow DOM，
   * 事件冒泡到 document 时 target 会被重定向成宿主元素，
   * 必须用 composedPath()[0] 才能拿到影子树内真正被点的那个按钮。
   */
  function realTarget(e) {
    if (e && typeof e.composedPath === 'function') {
      var path = e.composedPath();
      if (path && path.length) return path[0];
    }
    return e && e.target;
  }

  /** 记录影子根，供样式注入与音频扫描使用 */
  function rememberRoot(el) {
    if (!el || !el.getRootNode) return null;
    var r = el.getRootNode();
    if (r && r.host && knownRoots.indexOf(r) === -1) knownRoots.push(r);
    return r;
  }

  /** closest 兜底（极老的 X5 内核缺这个 API） */
  function closest(el, sel) {
    if (!el) return null;
    if (el.closest) { try { return el.closest(sel); } catch (e) { return null; } }
    var m = Element.prototype.matches || Element.prototype.msMatchesSelector;
    while (el && el.nodeType === 1) {
      if (m && m.call(el, sel)) return el;
      el = el.parentElement;
    }
    return null;
  }

  // 捕获阶段记录「刚刚被点的发音按钮」——这样各业务模块不用改一行代码，
  // 也能自动获得「加载中 / 播放中 / 失败」的视觉反馈。
  document.addEventListener('click', function (e) {
    var el = closest(realTarget(e), BTN_SELECTOR);
    if (el) { lastBtn = el; lastBtnAt = Date.now(); rememberRoot(el); }
  }, true);

  // 按下即预热：pointerdown 比 click 早约 80~150ms，能明显缩短首字延迟
  document.addEventListener('pointerdown', function (e) {
    if (!TTSConfig.warmOnPress) return;
    if (closest(realTarget(e), BTN_SELECTOR)) warmEngine();
  }, { capture: true, passive: true });

  function pickBtn(opts) {
    if (opts && opts.btn) return opts.btn;
    // 1.2s 内点过发音按钮，就认为这次朗读是它触发的
    if (lastBtn && Date.now() - lastBtnAt < 1200) return lastBtn;
    return null;
  }

  /**
   * Shadow DOM 内部拿不到外层 css/mobile.css 的规则，
   * 因此第一次给影子树里的按钮加状态时，往这棵影子树里补一份最小状态样式。
   * 好处：各业务模块一行代码都不用改，就能获得统一的播放/失败反馈。
   */
  var SHADOW_STATE_CSS =
    '.spk-loading{opacity:.75;animation:ttsBlink .9s ease-in-out infinite}' +
    '.spk-playing{animation:ttsPulse .8s ease-in-out infinite;box-shadow:0 0 0 3px rgba(255,143,196,.35)!important}' +
    '.spk-error{animation:ttsShake .4s ease;filter:grayscale(.5)}' +
    '@keyframes ttsBlink{0%,100%{opacity:.45}50%{opacity:1}}' +
    '@keyframes ttsPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.12)}}' +
    '@keyframes ttsShake{0%,100%{transform:translateX(0)}25%{transform:translateX(-4px)}75%{transform:translateX(4px)}}';

  function ensureShadowStyle(el) {
    var r = rememberRoot(el);
    if (!r || !r.host) return;                              // 主文档由 css/mobile.css 负责
    if (r.querySelector && r.querySelector('style[data-tts-state]')) return;
    try {
      var st = document.createElement('style');
      st.setAttribute('data-tts-state', '1');
      st.textContent = SHADOW_STATE_CSS;
      r.appendChild(st);
    } catch (e) { log('影子样式注入失败', e); }
  }

  function setBtnState(btn, state) {
    if (!btn || !btn.classList) return;
    ensureShadowStyle(btn);
    btn.classList.remove(CLS.loading, CLS.playing, CLS.error);
    if (state) btn.classList.add(CLS[state]);
    if (state === 'error') {
      // 失败样式自动褪去，不留残影
      setTimeout(function () { try { btn.classList.remove(CLS.error); } catch (e) {} }, 2200);
    }
  }

  /* ===================== 6. 预热 / 预加载 ===================== */
  var lastWarmAt = 0, lastSpeakAt = 0;

  /**
   * 冷启动的 TTS 引擎第一次出声要额外等几百毫秒。
   * 预热做两件事：
   *   1) resume() 把可能处于挂起态的引擎叫醒（对非挂起状态是安全的空操作）；
   *   2) 提前解析好发音人，省掉朗读那一刻的遍历与等待。
   * 注意：这里刻意不塞「静音语音再 cancel」——部分安卓 WebView 在 speak 后立刻
   * cancel 会进入静默状态，反而更糟。首次的引擎唤醒已在 unlock() 里做过了。
   */
  function warmEngine() {
    if (!SUPPORTED || !unlocked) return;
    var now = Date.now();
    if (now - lastWarmAt < 1500) return;                    // 节流，避免连点时空转
    lastWarmAt = now;
    try {
      if (!synth.speaking && synth.paused) synth.resume();
      if (!voices.length) refreshVoices();
      pickVoice('en');
      log('引擎预热');
    } catch (e) { log('预热失败', e); }
  }

  /**
   * 预加载：Web Speech 的语音由系统本地合成，没有「下载音频」这一步，
   * 真正会造成延迟的是「发音人列表未就绪」和「引擎冷启动」，这里一次性处理掉。
   * @param {string[]} [texts] 预留参数：后续若接入在线 TTS 可在此预取音频
   */
  function preload(texts) {
    if (!SUPPORTED) return false;
    refreshVoices();
    pickVoice('en');
    pickVoice('zh');
    warmEngine();
    if (texts && texts.length) log('预加载 ' + texts.length + ' 条文本');
    return true;
  }

  /* ===================== 7. 单例播放控制 ===================== */
  var current = { utter: null, btn: null, watchdog: null, resumeTimer: null };
  var speakSeq = 0;   // 每次发起朗读自增；用于丢弃被新朗读取代的「迟到 fire」，避免连按时旧音残留/串音

  /** 收集主文档 + 已知影子树里的所有媒体元素 */
  function collectMedia() {
    var out = [].slice.call(document.querySelectorAll('audio, video'));
    for (var i = 0; i < knownRoots.length; i++) {
      try { out = out.concat([].slice.call(knownRoots[i].querySelectorAll('audio, video'))); } catch (e) {}
    }
    return out;
  }

  /** 暂停页面上所有 <audio>/<video>（真题原声），except 指定的除外 */
  function pauseAllMedia(except) {
    var list = collectMedia();
    for (var i = 0; i < list.length; i++) {
      var el = list[i];
      if (el === except || el === silentEl) continue;
      if (!el.paused) { try { el.pause(); } catch (e) {} }
    }
  }

  /** 停掉朗读（silent=true 表示是主动打断，不要弹失败提示） */
  function stopSpeech(silent) {
    clearTimeout(current.watchdog);
    stopResumeGuard();
    if (current.btn) setBtnState(current.btn, null);
    // 打上「被我们主动掐掉」的标记：部分内核 cancel 后仍会触发 onend，
    // 若不拦住，听力模块的连续播放会误以为本句读完而跳到下一句，造成串音。
    if (current.utter) current.utter._cancelled = true;
    current.utter = null;
    current.btn = null;
    if (!SUPPORTED) return;
    // ⚠️ 关键修复：仅在确实「正在播 / 排队中」时才 cancel。
    // 否则「空 cancel」会让 Chrome/Edge 的引擎进入静默态，紧接着的 speak()
    // 会被静默丢弃——这正是「按一次没声音、按两次才有」顽疾的根因之一。
    if (synth.speaking || synth.pending) {
      try { synth.cancel(); } catch (e) { if (!silent) logErr('取消朗读失败', e); }
    }
  }

  /** 对外的「全停」：朗读 + 原声一起停 */
  function stop() {
    stopSpeech(true);
    pauseAllMedia(null);
  }

  // 页面里任何 <audio> 开始播放时，自动掐掉朗读和其它音源 —— 全局单例的最后一道保险
  document.addEventListener('play', function (e) {
    var t = realTarget(e);
    if (!t || (t.tagName !== 'AUDIO' && t.tagName !== 'VIDEO')) return;
    if (t === silentEl) return;
    rememberRoot(t);
    stopSpeech(true);
    pauseAllMedia(t);
  }, true);

  // 音频加载出错（弱网 / 文件缺失 / 跨域被拦）—— 捕获阶段才能收到
  document.addEventListener('error', function (e) {
    var t = realTarget(e);
    if (!t || (t.tagName !== 'AUDIO' && t.tagName !== 'VIDEO')) return;
    logErr('音频加载失败：' + (t.currentSrc || t.src || ''));
    tip(navigator.onLine ? '这段原声没能加载出来，稍后再试试 🎧'
                         : '当前处于离线状态，真题原声需要联网收听 📶', 'warn');
  }, true);

  // 切到后台 / 切走标签页时停止发音，避免回来时突然冒出一句
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stopSpeech(true);
  });

  /**
   * 桌面 Chrome 有个老 bug：连续朗读超过约 15 秒会自己卡住。
   * 定时 pause+resume 可以绕过。移动端内核不需要且可能反而出问题，故只在桌面启用。
   */
  function startResumeGuard() {
    stopResumeGuard();
    if (ENV.isAndroid || ENV.isIOS) return;
    current.resumeTimer = setInterval(function () {
      if (!synth.speaking) { stopResumeGuard(); return; }
      try { synth.pause(); synth.resume(); } catch (e) {}
    }, 9000);
  }
  function stopResumeGuard() {
    if (current.resumeTimer) { clearInterval(current.resumeTimer); current.resumeTimer = null; }
  }

  /* ===================== 8. 失败处理 ===================== */
  function failMessage(reason) {
    if (reason === 'not-allowed') return '浏览器拦截了自动播放，先点一下页面任意位置再点发音 🔇';
    if (reason === 'audio-busy')  return '系统音频被别的应用占用了，关掉后台播放器再试 🎧';
    if (!navigator.onLine)        return '网络不太稳，发音没能加载出来，联网后再点一次 📶';
    if (ENV.isWeChat)             return '微信内置浏览器朗读支持有限，点右上角「···」→ 在浏览器中打开 🌸';
    return '这条发音没播出来，再点一次试试 🔇';
  }

  function handleFail(btn, reason) {
    setBtnState(btn, 'error');
    logErr('播放失败，原因：' + reason);
    tip(failMessage(reason), 'warn');
  }

  /* ===================== 9. 核心：speak ===================== */
  var rate = 1.0;   // 全局语速，听力模块的倍速按钮会改它

  /**
   * 朗读一段文本
   * @param {string} text
   * @param {object} [opts] { lang:'en'|'zh', rate, pitch, volume, onend, btn }
   * @returns {boolean} 是否成功发起（不代表一定出声）
   */
  function speak(text, opts) {
    opts = opts || {};
    text = (text === null || text === undefined) ? '' : String(text).trim();
    var btn = pickBtn(opts);
    if (!text) return false;

    // ——① 能力检测——
    if (!SUPPORTED) { notifyUnsupported(); setBtnState(btn, 'error'); return false; }

    // ——② 兜底解锁：多数调用发生在点击回调里，此时仍处在手势栈内，解锁有效——
    if (!unlocked) unlock('speak 调用兜底');

    // ——③ 单例：先停掉上一条朗读，再暂停正在播的真题原声——
    var interrupting = SUPPORTED && (synth.speaking || synth.pending);
    stopSpeech(true);
    pauseAllMedia(null);

    var u;
    try {
      u = new Utter(text);
    } catch (e) {
      logErr('创建语音对象失败', e);
      handleFail(btn, 'create-failed');
      return false;
    }

    u.rate   = opts.rate   != null ? opts.rate   : rate;
    u.pitch  = opts.pitch  != null ? opts.pitch  : 1;
    u.volume = opts.volume != null ? opts.volume : 1;

    var lang = (opts.lang || 'en').toLowerCase();
    var v = pickVoice(lang);
    if (v) { u.voice = v; u.lang = v.lang; }
    else { u.lang = lang.indexOf('zh') === 0 ? 'zh-CN' : 'en-US'; }

    setBtnState(btn, 'loading');
    var started = false;
    var tried = opts._retry ? 2 : 1;

    u.onstart = function () {
      started = true;
      lastSpeakAt = Date.now();
      clearTimeout(current.watchdog);
      setBtnState(btn, 'playing');
      startResumeGuard();
      log('开始朗读：' + text.slice(0, 24));
    };

    u.onend = function () {
      clearTimeout(current.watchdog);
      stopResumeGuard();
      setBtnState(btn, null);
      if (u._cancelled) return;            // 被主动打断，不算「读完」，也不触发回调
      current.utter = null;
      if (typeof opts.onend === 'function') {
        try { opts.onend(); } catch (e) { logErr('onend 回调异常', e); }
      }
    };

    u.onerror = function (ev) {
      clearTimeout(current.watchdog);
      stopResumeGuard();
      var reason = (ev && ev.error) || 'unknown';
      // 主动 cancel 造成的中断属于正常流程，不当作错误
      if (reason === 'interrupted' || reason === 'canceled') { setBtnState(btn, null); return; }
      handleFail(btn, reason);
    };

    current.utter = u;
    current.btn = btn;

    var mySeq = ++speakSeq;   // 本帧朗读的序号，用于丢弃被新朗读取代的迟到 fire
    function fire() {
      if (mySeq !== speakSeq) return;   // 已有更新的朗读发起，本帧作废，避免旧音串入
      try {
        synth.speak(u);
      } catch (e) {
        logErr('synth.speak 抛异常', e);
        handleFail(btn, 'speak-throw');
      }
    }
    if (interrupting) {
      // Chrome / Edge 在 cancel() 之后同步调用 speak() 会静默丢弃新语音，
      // 留约 60ms 让引擎先处理完「取消」事件，再发新语音——首按即出声，无需连按。
      setTimeout(fire, 60);
    } else {
      fire();
    }

    // ——④ 看门狗：静默失败（既不 onstart 也不 onerror）时自动重试一次——
    current.watchdog = setTimeout(function () {
      if (started) return;
      if (TTSConfig.autoRetry && tried < 2) {
        log('未在预期时间内开始，自动重试一次');
        try { synth.cancel(); } catch (e) {}
        var next = {};
        for (var k in opts) if (Object.prototype.hasOwnProperty.call(opts, k)) next[k] = opts[k];
        next._retry = true;
        next.btn = btn;
        setTimeout(function () { speak(text, next); }, 60);
      } else {
        handleFail(btn, 'timeout');
      }
    }, TTSConfig.watchdogMs);

    return true;
  }

  /* ===================== 10. 语言快捷方法 ===================== */
  /** 英文朗读（单词、例句、听力原文） */
  function speakEn(text, opts) {
    return speak(text, Object.assign({}, { lang: 'en', rate: rate }, opts || {}));
  }
  /** 中文朗读（小狗互动语音、翻译播放） */
  function speakZh(text, opts) {
    return speak(text, Object.assign({}, { lang: 'zh', rate: 1 }, opts || {}));
  }

  function setRate(r) { rate = Number(r) || 1; }
  function getRate() { return rate; }
  function isEnabled() { return SUPPORTED; }
  function isSupported() { return SUPPORTED; }
  function isUnlocked() { return unlocked; }

  /* ===================== 11. 启动自检 ===================== */
  // 不支持朗读的内核：等页面就绪后温柔提示一次，不阻塞任何功能
  if (!SUPPORTED) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () { setTimeout(notifyUnsupported, 1200); });
    } else {
      setTimeout(notifyUnsupported, 1200);
    }
  }

  /* ===================== 12. 导出 ===================== */
  var TTS = {
    speak: speak,
    speakEn: speakEn,
    speakZh: speakZh,
    stop: stop,
    setRate: setRate,
    getRate: getRate,
    isEnabled: isEnabled,
    isSupported: isSupported,
    isUnlocked: isUnlocked,
    unlock: unlock,
    preload: preload,
    pickVoice: pickVoice,
    pauseAllMedia: pauseAllMedia,
    config: TTSConfig,
    env: ENV
  };

  /* 顶层变量不会自动成为 window 属性；各模块普遍写的是
     `if (window.TTS && TTS.speakEn) {...}`，不显式导出会静默失效。 */
  global.TTS = TTS;

})(window);
