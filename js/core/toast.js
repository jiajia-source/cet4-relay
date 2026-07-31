/*!
 * toast.js —— 轻量级前端提示 + 全局异常兜底
 * ---------------------------------------------------------------------------
 * 职责：
 *   1. 提供 UI.toast()：右上角（手机为顶部居中）浮出的一行小提示，不打断操作。
 *   2. 全局捕获：JS 运行时错误 / Promise 未处理拒绝 / 静态资源加载失败 / 断网。
 *      —— 控制台一律打印完整错误日志（方便开发者排查）；
 *      —— 页面上只给用户一句「人话」提示（避免技术噪音吓到使用者）。
 *
 * 设计约束：
 *   - 无任何第三方依赖，纯 DOM 操作，可直接在 file:// 下运行。
 *   - 必须在 audio.js 之前引入：音频模块会调用 UI.toast() 反馈发音异常。
 *   - 提示做了去重与节流，避免同一错误刷屏。
 * ---------------------------------------------------------------------------
 */
(function (global) {
  'use strict';

  /* ========================= 配置常量 ========================= */
  var MAX_VISIBLE   = 3;      // 同屏最多显示几条，超出自动挤掉最旧的
  var DEFAULT_MS    = 2600;   // 普通提示存活时长
  var ERROR_MS      = 4200;   // 错误提示存活时长（给用户多点阅读时间）
  var DEDUPE_MS     = 1500;   // 相同文案在该时间窗口内只弹一次
  var ERR_THROTTLE  = 10000;  // 运行时报错提示的节流窗口（10s 内最多一条）

  var wrap = null;                    // toast 容器（懒创建）
  var recent = Object.create(null);   // 去重记录：文案 -> 上次弹出时间戳
  var lastRuntimeTip = 0;             // 上次因 JS 报错弹提示的时间

  /* ========================= 内部工具 ========================= */

  /** 懒创建 toast 容器，挂在 body 最后，z-index 高于一切模块内容 */
  function ensureWrap() {
    if (wrap && wrap.isConnected) return wrap;
    wrap = document.createElement('div');
    wrap.className = 'wb-toast-wrap';
    // 关键：容器本身不吃点击，保证提示浮在上层也不挡住按钮
    wrap.setAttribute('role', 'status');
    wrap.setAttribute('aria-live', 'polite');
    (document.body || document.documentElement).appendChild(wrap);
    return wrap;
  }

  /** 不同类型对应的小图标，保持项目一贯的软萌语气 */
  function iconOf(type) {
    return ({
      info:    '💬',
      success: '🌸',
      warn:    '⚠️',
      error:   '🐾'
    })[type] || '💬';
  }

  /* ========================= 对外：toast ========================= */

  /**
   * 弹一条轻提示
   * @param {string} msg  提示文案（已经是给用户看的「人话」）
   * @param {string} [type] info | success | warn | error
   * @param {number} [ms]   自定义存活毫秒数
   * @returns {HTMLElement|null}
   */
  function toast(msg, type, ms) {
    if (!msg) return null;
    type = type || 'info';

    // —— 去重：短时间内重复的同一句话直接丢弃，避免连点刷屏 ——
    var now = Date.now();
    if (recent[msg] && now - recent[msg] < DEDUPE_MS) return null;
    recent[msg] = now;

    // DOM 还没就绪时（极少数：脚本报错发生在 head 阶段）延后再弹
    if (!document.body) {
      document.addEventListener('DOMContentLoaded', function () { toast(msg, type, ms); });
      return null;
    }

    var box = ensureWrap();
    var el = document.createElement('div');
    el.className = 'wb-toast wb-toast-' + type;
    el.innerHTML = '<span class="wb-toast-ico">' + iconOf(type) + '</span>' +
                   '<span class="wb-toast-txt"></span>';
    // 用 textContent 赋值，杜绝提示文案里的特殊字符造成 XSS
    el.querySelector('.wb-toast-txt').textContent = msg;
    box.appendChild(el);

    // 超出数量上限时，把最旧的一条提前收走
    while (box.children.length > MAX_VISIBLE) dismiss(box.children[0]);

    // 点一下可以手动关掉
    el.addEventListener('click', function () { dismiss(el); });

    var life = ms || (type === 'error' || type === 'warn' ? ERROR_MS : DEFAULT_MS);
    setTimeout(function () { dismiss(el); }, life);
    return el;
  }

  /** 收起一条 toast（带退场动画，动画结束后移除节点） */
  function dismiss(el) {
    if (!el || el.dataset.closing === '1') return;
    el.dataset.closing = '1';
    el.classList.add('wb-toast-out');
    setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 240);
  }

  /* ========================= 对外：错误日志 ========================= */

  /**
   * 统一错误出口：控制台打完整堆栈，页面只给一句轻提示
   * @param {string} tag       模块标签，如 'TTS' / 'Sync'
   * @param {any}    err       原始错误对象或描述
   * @param {string} [userMsg] 想给用户看的话；不传则只记日志、不弹窗
   */
  function logError(tag, err, userMsg) {
    try {
      console.error('[' + tag + ']', err && err.stack ? err.stack : err);
    } catch (e) { /* 控制台被禁用时忽略 */ }
    if (userMsg) toast(userMsg, 'error');
  }

  /* ========================= 全局异常兜底 ========================= */

  /**
   * 资源加载失败（img / script / link / audio）会在捕获阶段冒出 error 事件，
   * 且 event.target 不是 window —— 用这一点区分「资源挂了」和「代码报错」。
   */
  window.addEventListener('error', function (e) {
    var t = e && e.target;

    // ——① 静态资源加载失败——
    if (t && t !== window && t.tagName) {
      var tag = t.tagName.toUpperCase();
      var src = t.currentSrc || t.src || t.href || '';
      console.error('[资源加载失败]', tag, src);

      // 标了 data-optional 的资源（如可选的 Gun CDN）挂了属正常，离线时不打扰用户
      if (t.dataset && t.dataset.optional) return;

      // 音视频的用户提示交给 audio.js 统一处理（它更清楚是弱网还是权限问题），
      // 这里只留日志，避免同一件事弹两条 toast
      if (tag === 'AUDIO' || tag === 'VIDEO') {
        return;
      } else if (tag === 'SCRIPT' || tag === 'LINK') {
        toast('有个文件没加载成功，刷新一下页面试试 🌸', 'warn');
      }
      // 图片加载失败（比如小狗立绘）不打扰用户，只留日志
      return;
    }

    // ——② JS 运行时错误——
    console.error('[运行时错误]', e && (e.error || e.message), e && e.filename, e && e.lineno);
    var now = Date.now();
    if (now - lastRuntimeTip > ERR_THROTTLE) {
      lastRuntimeTip = now;
      toast('页面有个小状况，功能可能不完整，刷新一下就好 🐾', 'warn');
    }
  }, true); // ← 必须用捕获阶段，资源错误不冒泡

  /** Promise 里抛出的错误（如 fetch 失败、同步接口异常） */
  window.addEventListener('unhandledrejection', function (e) {
    console.error('[未处理的 Promise 异常]', e && e.reason);
    var now = Date.now();
    if (now - lastRuntimeTip > ERR_THROTTLE) {
      lastRuntimeTip = now;
      // 网络类失败给更贴切的话术
      var offline = !navigator.onLine;
      toast(offline ? '当前好像断网了，云端同步会稍后自动重试 📶'
                    : '有个后台请求失败了，不影响继续学习 🌸', 'warn');
    }
  });

  /** 断网 / 恢复联网 —— 直接影响云端同步与真题原声，值得告诉用户 */
  window.addEventListener('offline', function () {
    toast('网络断开了，本地进度会照常保存 💾', 'warn');
  });
  window.addEventListener('online', function () {
    toast('网络恢复啦，云端同步继续 ☁️', 'success');
  });

  /* ========================= 导出 ========================= */
  /* 顶层 var/const 不会自动挂到 window，这里显式导出，
     避免其它模块里 `window.UI && UI.toast(...)` 这类判断静默失效。 */
  global.UI = global.UI || {};
  global.UI.toast = toast;
  global.UI.dismiss = dismiss;
  global.UI.logError = logError;

})(window);
