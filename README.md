<div align="center">

# 🐾 四级软萌备考工作台

**一个纯静态的英语四级备考 Web App —— 背单词 + 练听力 + 读文章 + 写作文，还有一只金毛小狗陪你成长。**

零后端 · 零构建 · 双击 `index.html` 就能用 · 手机电脑云端同步

![license](https://img.shields.io/badge/license-MIT-ff8fc4)
![vanilla](https://img.shields.io/badge/stack-Vanilla_JS-ffd9ec)
![pwa](https://img.shields.io/badge/PWA-offline_ready-c9bbf2)
![words](https://img.shields.io/badge/词库-4544_词-bdebd6)

</div>

---

## ✨ 项目简介

这是一个**完全跑在浏览器里**的四级备考工具：没有 Node 服务、没有打包器、没有框架依赖。
所有学习数据存在 `localStorage`，可选接入 Supabase 实现手机 ↔ 电脑进度互通。

它最初是为一个人做的备考工具，现在整理成开源项目 —— 你可以直接拿去用，也可以换掉词库做成自己学科的记忆工具。

### 为什么是「纯静态」

- **打开即用**：`file://` 双击就能跑，U 盘随身带，机房电脑也能学。
- **可离线**：内置 Service Worker，加进手机主屏后断网照常背单词。
- **易魔改**：没有构建步骤，改完 `Ctrl+R` 立刻看到效果，新手也能上手。
- **数据在自己手里**：进度只存在你的浏览器里，可一键导出成 JSON 备份。

---

## 🎯 功能一览

| 模块 | 说明 |
| --- | --- |
| 📚 **单词学习** | 4544 词四级词库，每词 14 个字段：音标、词根词缀、趣味联想、谐音速记、词性变形、高频搭配、真题例句、同义替换 |
| 🔁 **单词复习** | 艾宾浩斯智能排期，**只推送已学过的词**；听音默写 / 释义填词 / 真题挖空三种模式，进度各自独立 |
| 🏆 **单词闯关** | 每关 10 题，看词选义 / 看义选词 / 听音选义混合出题，连击加分，答错自动进错题本 |
| 🧩 **单词消消乐** | 英中左右连线配对，限时消除，积分直接换算成狗粮 |
| 🎧 **听力专项** | 44 篇分类材料（短对话 / 长对话 / 新闻 / 篇章 / 泛听拓展）+ 4 套 2025 年真题原声；倍速、逐句循环、点句翻译、配套判分 |
| 📖 **分级阅读** | 29 篇整篇横排阅读，点句出译文，按话题筛选，附真题级阅读题与解析 |
| ✍️ **作文素材** | 万能模板、高级句式、低分词替换表、范文解析 |
| 🐶 **小狗养成** | 学习行为产出狗粮，喂养金毛成长（幼年 → 少年 → 成年），互动动画 + 语音陪伴 |
| 📊 **数据看板** | 每日任务、词汇进度、打卡日历、错题本（可发音复习）、周统计 |
| 🔄 **数据同步** | 基于 Supabase 的多端同步：房间名哈希 + 内容加密，手机和电脑填同一个房间名即互通 |

---

## 📁 目录结构

```
cet4-vocab-workbench/
├── index.html                  # 唯一入口页：所有模块面板 + 脚本装配顺序
├── manifest.webmanifest        # PWA 清单（添加到主屏幕）
├── sw.js                       # Service Worker：外壳缓存 / 离线启动
│
├── css/                        # 样式：按职责拆分，加载顺序即层叠顺序
│   ├── theme.css               #   设计变量（马卡龙配色）+ 通用组件
│   ├── layout.css              #   页面骨架：侧边栏 / 主区 / 首页
│   ├── animations.css          #   关键帧与特效（飘心、进度条、浮动）
│   ├── modules.css             #   各业务模块样式
│   └── mobile.css              #   移动端适配 / 触摸反馈 / 发音状态 / toast
│
├── js/
│   ├── core/                   # 基础设施
│   │   ├── toast.js            #   轻提示 + 全局异常兜底（最先加载）
│   │   ├── store.js            #   localStorage 数据层：进度模型与读写
│   │   ├── sync.js             #   Supabase 云端同步 + 同步设置面板
│   │   ├── audio.js            #   语音引擎：解锁 / 单例 / 状态 / 容错
│   │   ├── dog.js              #   小狗立绘出口
│   │   └── app.js              #   入口：路由、首页、打卡、导入导出、PWA
│   │
│   ├── data/                   # 静态数据（纯数据，无逻辑）
│   │   ├── words.js            #   4544 词词库
│   │   ├── listening.js        #   听力材料
│   │   ├── listening_exam.js   #   真题套卷（引用 assets/audio 下的原声）
│   │   ├── reading.js          #   阅读篇目
│   │   └── essays.js           #   作文素材
│   │
│   └── modules/                # 业务模块：各自注册到 window.CET4Modules
│       ├── words-learn.js      words-review.js   word-quiz.js
│       ├── word-match.js       listening.js      reading.js
│       ├── essays.js           puppy.js          puppy-buddy.js
│       └── dashboard.js
│
├── assets/
│   ├── images/dog.png          # 金毛立绘
│   ├── icons/                  # PWA 图标
│   └── audio/                  # 真题原声（已含 4 套 cet4-2025-*.mp3，详见 .gitignore）
│
├── README.md
├── DEPLOY.md                   # GitHub Pages 一键部署详细指引
├── LICENSE                     # MIT（含音频版权声明）
├── .gitignore
└── .nojekyll                   # 关掉 Jekyll，确保静态资源不被过滤
```

---

## 🚀 快速开始

### 方式一：双击打开（最简单）

下载仓库后直接双击 `index.html`。全部功能可用，**唯独 Service Worker 与云端同步需要 http(s) 环境**。

### 方式二：本地起个静态服务（推荐）

```bash
# Python 3
python -m http.server 8000

# 或者 Node
npx serve .
```

浏览器打开 <http://localhost:8000> 即可。

### 方式三：一键部署到 GitHub Pages（推荐，免费公开域名）

完整图文步骤见 **[DEPLOY.md](./DEPLOY.md)**。要点：

1. 在 GitHub 新建仓库（仓库名任意，例如 `cet4-vocab`；若想要 `用户名.github.io` 裸域名则仓库名必须叫 `<用户名>.github.io`）；
2. 用 Git 命令行推送到仓库（本仓库已 `git init` 并提交好，直接 `git remote add origin <地址>` + `git push` 即可）；
3. 仓库 **Settings → Pages → Source** 选 `main` 分支根目录 → 等待 1~2 分钟；
4. 访问 `https://<你的用户名>.github.io/<仓库名>/`，把链接发给任何人都能直接打开。

> ✅ 仓库已包含 4 套真题原声（`assets/audio/cet4-2025-*.mp3`），GitHub Pages 部署后「真题套卷」可直接播放，**全部功能（音频修复 / 移动端 / 金毛养成 / Supabase 同步）均保留**。
> ⚠️ 因单文件最大约 33MB（超网页 25MB 限制），**必须用 Git 命令行推送，不能用网页拖拽上传**（详见 DEPLOY.md）。
> 📱 手机浏览器打开 → 「添加到主屏幕」即得离线 APP；改代码后记得把 `sw.js` 的 `CACHE` 版本号 +1 再推送。

---

## ☁️ 多端同步配置（可选）

同步基于 [Supabase](https://supabase.com) 免费额度，5 分钟即可配好。

1. 注册 Supabase，新建一个项目（区域选新加坡，国内访问较快）；
2. 打开 **SQL Editor**，执行建表语句：

   ```sql
   create table if not exists cet4_sync (
     room       text primary key,
     state      jsonb,
     updated_at timestamptz default now()
   );

   alter table cet4_sync enable row level security;

   create policy anon_rw on cet4_sync
     for all to anon
     using (true) with check (true);
   ```

3. 在项目的 **Settings → API** 里复制 `Project URL` 与 `anon public key`；
4. 打开网页 → 侧栏「🔄 数据同步」→ 填入地址与 key → 设置一个**只有你自己知道的房间名** → 保存；
5. 手机和电脑填**同一个房间名**即可互通，约 15 秒同步一次。

### 关于安全

- `anon key` 本就是设计给前端公开使用的，真正敏感的 `service_role` key 从不出现在前端。
- 即便如此，本项目额外做了两层保护：
  - **房间名不明文入库** —— 数据库主键存的是房间名的哈希（`r_xxxxx`），无法被枚举；
  - **进度内容加密** —— 以房间名为密钥做异或加密后再存，拿不到房间名就读不懂内容。
- 不填房间名 = 纯本地模式，数据完全不出设备。填不同房间名的用户之间互相隔离。

---

## 🔊 音频方案说明

单词与句子的发音使用浏览器内置的 **Web Speech API（SpeechSynthesis）**，不依赖任何在线 TTS 服务，因此离线可用、零成本。

`js/core/audio.js` 针对移动端做了这些处理：

| 问题 | 处理方式 |
| --- | --- |
| 浏览器禁止自动播放 | 在 `document` 上挂一次性捕获监听，用户点页面**任意位置**即静默解锁，无需专门的「开启声音」按钮 |
| 多个发音重叠 | 每次朗读前 `cancel()` 上一条，并暂停页面内所有 `<audio>`；任一 `<audio>` 开始播放时也会反向掐掉朗读 |
| 内核不支持朗读 | 启动自检，仅提示一次；微信内会引导「在浏览器中打开」 |
| 首次发音有延迟 | 解锁时预热引擎、轮询等待发音人列表；手指按下按钮（`pointerdown`）时提前预热 |
| 静默失败（不响也不报错） | 看门狗 1.6 秒超时后自动重试一次，仍失败才提示用户 |
| 桌面 Chrome 长句卡住 | 播放期间定时 `pause()/resume()` 绕过已知 bug（仅桌面启用） |
| 发音按钮无反馈 | 自动挂 `.spk-loading / .spk-playing / .spk-error` 三种状态样式，Shadow DOM 内部的按钮由脚本自动注入同款样式 |

> 想给自定义按钮加上同款状态反馈？给元素加 `data-audio-btn` 属性即可，无需改动 `audio.js`。

---

## 📱 移动端适配要点

- 标准 viewport（含 `viewport-fit=cover`），支持刘海屏安全区；
- 导航在窄屏变为**单行横向滑动**，11 个入口不再挤成四排；
- 断点覆盖 700 / 430 / 360 三档，另有横屏与矮视口专用规则；
- 所有可点元素带按压缩放反馈，`touch-action: manipulation` 消除 300ms 延迟；
- 输入框在移动端字号 ≥16px，避免 iOS 聚焦时整页放大导致溢出；
- 长英文单词、音标、例句允许折行，绝不撑破卡片；
- 兼容微信 / QQ 的 X5 内核（`WeixinJSBridgeReady` 补一次音频解锁，Shadow DOM 事件用 `composedPath` 取真实目标）。

---

## 🧩 二次开发指南

### 新增一个模块

```js
// js/modules/my-module.js
window.CET4Modules = window.CET4Modules || {};
window.CET4Modules['my-module'] = {
  /** @param {HTMLElement} c 模块容器（#body-my-module） */
  mount(c) {
    c.innerHTML = '<div class="cloud-card">Hello 🐾</div>';
  }
};
```

再做三件事：`index.html` 加一个 `nav-item` 与 `module-panel`、加一行 `<script>`、`app.js` 的 `MODULE_META` 补一条文案。

### 换掉词库

`js/data/words.js` 导出 `window.WORDS` 数组，每项字段如下（缺字段不会崩，只是对应区块留空）：

```
id, word, uk, us, pos, cn, root, mnemonic, homo,
forms, colloc, example, exampleCn, syn
```

### 可用的全局工具

| API | 用途 |
| --- | --- |
| `TTS.speakEn(text[, opts])` | 英文朗读（`opts` 支持 `rate / onend / btn`） |
| `TTS.speakZh(text)` / `TTS.stop()` | 中文朗读 / 停止一切声音 |
| `UI.toast(msg, 'info'\|'success'\|'warn'\|'error')` | 弹一条轻提示 |
| `UI.logError(tag, err[, userMsg])` | 控制台记完整堆栈，页面只弹一句人话 |
| `Store.addFood(n)` / `Store.bumpStat(k, n)` | 加狗粮 / 累计统计 |
| `Store.addWrong(type, id)` | 收进错题本 |
| `window.floatHearts(n)` | 飘心特效 |
| `window.switchTo(moduleId)` | 跳转到指定模块 |

### ⚠️ 两条容易踩的坑

1. **改了被缓存的文件，一定要提升 `sw.js` 里的 `CACHE` 版本号**，并把新文件加进 `SHELL` 数组，
   否则已「添加到主屏幕」的手机会一直吃旧缓存。
2. **顶层 `const` 不会自动挂到 `window` 上**。经典 `<script>` 里的顶层 `const/let` 属于 script 词法环境，
   任何 `if (window.Xxx && ...)` 的守卫都会静默短路。写全局单例时记得在文件末尾显式 `window.Xxx = Xxx;`。

---

## 🛠️ 技术栈

- 原生 HTML / CSS / JavaScript（ES2015+），**零依赖、零构建**
- Web Speech API —— 离线语音合成
- Shadow DOM —— 闯关 / 消消乐 / 看板 / 养成页样式隔离
- Service Worker + Web App Manifest —— PWA 离线与主屏安装
- localStorage —— 本地进度；Supabase REST —— 可选云端同步

浏览器要求：Chrome / Edge / Safari / 各安卓系统浏览器的近三年版本均可。
微信内置浏览器可正常浏览与做题，但语音朗读支持有限，建议「在浏览器中打开」。

---

## 🤝 参与贡献

欢迎提 Issue 和 PR。提交前请确认：

- [ ] 未破坏既有的粉嫩配色与小狗互动动画（视觉改动请附截图）
- [ ] 未改动 `localStorage` 的数据结构（会导致老用户进度丢失）
- [ ] 若改了会被缓存的文件，已提升 `sw.js` 的 `CACHE` 版本号
- [ ] 在手机浏览器上实测过（至少一款安卓机 + 一次横屏）
- [ ] 关键逻辑写了中文注释

---

## 📄 开源协议

本项目源码基于 [MIT License](./LICENSE) 开源。

词库、阅读与作文素材整理自公开备考资料，仅供学习使用。
**真题听力音频不包含在本仓库中**，版权归原权利人所有，请自行准备后放入 `assets/audio/`。

---

<div align="center">

如果它帮到了你的四级，给只小狗点个 ⭐ 吧 🐾

</div>
