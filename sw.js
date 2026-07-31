/*!
 * sw.js —— Service Worker：缓存应用外壳，支持手机离线启动
 * ---------------------------------------------------------------------------
 * ⚠️ 维护铁律：只要改动了 SHELL 里列出的任何文件，就必须提升下面的 CACHE 版本号，
 *    否则已经「添加到主屏幕」的手机会一直吃旧缓存，永远看不到新功能。
 *    新增可缓存文件（比如新写的模块 js）也要同步加进 SHELL 数组。
 *
 * 缓存策略：
 *   · 应用外壳（html/css/js/图标）→ stale-while-revalidate：先秒开缓存，
 *     后台静默拉最新版，下次打开即为新版本。
 *   · 音频（.mp3）→ 网络优先、成功后写缓存：保证第一次能听到，之后省流量。
 *   · 跨域资源（CDN）→ 完全交给浏览器，不做任何拦截。
 * ---------------------------------------------------------------------------
 */
const CACHE = 'cet4-v5';

const SHELL = [
  './',
  'index.html',
  'manifest.webmanifest',

  // 样式
  'css/theme.css', 'css/layout.css', 'css/animations.css', 'css/modules.css', 'css/mobile.css',

  // 核心脚本
  'js/core/toast.js', 'js/core/store.js', 'js/core/sync.js',
  'js/core/audio.js', 'js/core/dog.js', 'js/core/app.js',

  // 静态数据
  'js/data/words.js', 'js/data/listening.js', 'js/data/listening_exam.js',
  'js/data/reading.js', 'js/data/essays.js',

  // 业务模块
  'js/modules/words-learn.js', 'js/modules/words-review.js', 'js/modules/listening.js',
  'js/modules/reading.js', 'js/modules/essays.js', 'js/modules/puppy.js',
  'js/modules/puppy-buddy.js', 'js/modules/word-quiz.js', 'js/modules/word-match.js',
  'js/modules/dashboard.js',

  // 静态素材
  'assets/images/dog.png', 'assets/icons/icon.svg', 'assets/icons/icon-maskable.svg'
];

/* 安装：预缓存整个外壳。逐个 add 而非 addAll，
   避免个别文件 404 就导致整次安装失败。 */
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) =>
      Promise.all(SHELL.map((url) => c.add(url).catch((err) => {
        console.warn('[SW] 预缓存跳过', url, err && err.message);
      })))
    )
  );
  self.skipWaiting();
});

/* 激活：清掉所有旧版本缓存，立即接管现有页面 */
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;

  let url;
  try { url = new URL(req.url); } catch (err) { return; }

  // 跨域第三方资源（CDN、Supabase 接口）一律直连，不进缓存
  if (url.origin !== self.location.origin) return;

  // 音频：网络优先，成功后写入缓存（第二次收听即离线可用）
  if (url.pathname.endsWith('.mp3') || url.pathname.includes('/assets/audio/')) {
    e.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
          return res;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  // 应用外壳：stale-while-revalidate
  e.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req)
        .then((res) => {
          if (res && res.status === 200) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
          }
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
