# 部署到 GitHub Pages（一键发布公开网站）

本指南帮你把 `cet4-vocab-oss` 这个纯静态网站免费部署到 GitHub Pages，
得到形如 `https://<你的用户名>.github.io/<仓库名>/` 的公开链接，任何人都能直接打开，
**全部功能（音频播放修复、移动端适配、金毛养成、Supabase 多端同步）均保留**。

> 本仓库是**纯静态站点，零构建**。无需 Node、无需打包，推上去即可访问。

---

## ⚠️ 两种地址，先看清楚

| 方式 | 仓库名 | 最终访问地址 | 说明 |
|------|--------|--------------|------|
| **A. 根域名（最像「你的专属网站」）** | 必须叫 `<你的用户名>.github.io` | `https://<你的用户名>.github.io/` | 仓库名 = 用户名 + `.github.io`，唯一一种能拿到「裸域名」的办法 |
| **B. 项目页（最简单，推荐新手）** | 任意名字，如 `cet4-vocab` | `https://<你的用户名>.github.io/cet4-vocab/` | 仓库名随意；地址多一级 `/仓库名` |

> 本项目**所有资源路径都是相对路径**，所以两种方式都能正常工作，你随便选。
> 想拿到 `用户名.github.io` 这种「主页式」地址就选 A（仓库名有硬性要求）；否则选 B 最省事。

---

## 准备条件

1. 一个 [GitHub](https://github.com) 账号（免费）。
2. 本机安装 **Git**（本机已检测到 `git 2.54.0`）。不会装的看文末。
3. 因为仓库含 4 个真题音频（单文件最大约 33MB，超过 GitHub 网页 25MB 上传限制），
   **必须用 Git 命令行推送，不能用 GitHub 网页直接拖拽上传**。命令行对单文件 100MB 以内都没问题。

---

## 方式 B（推荐）：任意仓库名 → 项目页

### 第 1 步：在 GitHub 新建空仓库
1. 登录 GitHub，右上角 **+ → New repository**。
2. **Repository name** 填一个你喜欢的，例如 `cet4-vocab`（**不要**勾选 "Add a README" / "Add .gitignore" / "Add license"，保持空仓库）。
3. 点 **Create repository**。

### 第 2 步：在本机把代码推上去
打开命令行，进入本仓库目录（就是含 `index.html` 的这个文件夹），执行：

```bash
# 1) 初始化 git 仓库（本仓库已初始化好，可跳过这步；若你另存到了新目录则执行）
git init -b main

# 2) 关联远端（把下面 URL 换成你刚建的仓库地址）
git remote add origin https://github.com/<你的用户名>/cet4-vocab.git

# 3) 暂存全部文件（含 4 个 mp3）
git add -A

# 4) 提交
git commit -m "feat: CET-4 vocab workbench (audio fix + mobile + puppy + supabase)"

# 5) 推送（首次推送用 -u；若提示登录，按提示用浏览器授权或填 token）
git push -u origin main
```

> 若是**私有仓库**也能部署到 Pages（GitHub 现在允许私有库免费开 Pages），但链接只对能访问仓库的人可见；要**完全公开给任何人**，请把仓库设为 **Public**（仓库 Settings → Change visibility → Make public）。

### 第 3 步：开启 GitHub Pages
1. 进仓库 **Settings → Pages**（左侧边栏）。
2. **Build and deployment → Source** 选 **Deploy from a branch**。
3. **Branch** 选 `main`，目录选 **/ (root)**。
4. 点 **Save**。
5. 等 1～2 分钟，顶部会出现 `Your site is live at https://<你的用户名>.github.io/cet4-vocab/`。
6. 把这个链接发给朋友即可。

---

## 方式 A：拿到 `用户名.github.io` 裸域名

步骤与上面几乎一样，唯一区别：
- 第 1 步建仓库时，**Repository name 必须填 `<你的用户名>.github.io`**（一字不差，用户名区分大小写）。
- 第 2 步 `git remote add origin` 的地址对应改成 `https://github.com/<你的用户名>/<你的用户名>.github.io.git`。
- 第 3 步开启 Pages 后，地址就是 `https://<你的用户名>.github.io/`（没有 `/仓库名`）。

---

## 🔄 多端同步（Supabase）在 GitHub Pages 上能用吗？

能用，且和本地 / CloudStudio 版共用同一套机制。两点注意：

1. **CORS**：Supabase 的 `anon` 公开接口默认允许任意来源（`Access-Control-Allow-Origin: *`），
   所以 `用户名.github.io` 直接就能调通，通常无需改动。
   若你曾在 Supabase 里**限制了允许的来源**，请把你的 Pages 地址加进去：
   Supabase 后台 **Settings → API → CORS / Additional allowed origins** 增加
   `https://<你的用户名>.github.io` 和 `https://<你的用户名>.github.io/<仓库名>`。
2. **房间名**：手机和电脑（或手机与 GitHub Pages 网页）在「🔄 数据同步」里填**同一个房间名**即互通。
   朋友打开你的公开链接默认**不填房间名**，天然与你隔离，不会混数据。

---

## 📱 手机上当 APP 用（PWA 离线）

浏览器打开你的 Pages 地址 → 菜单 **「添加到主屏幕」**（iOS Safari 分享按钮 / 安卓 Chrome 三点菜单）。
之后桌面会有金毛图标，点开即全屏 APP，且**断网也能用**（Service Worker 已缓存外壳）。

> 更新网站后，已「添加到主屏幕」的老用户可能短暂看到旧版：
> 本项目 `sw.js` 用 `stale-while-revalidate` + 版本号 `cet4-v5`。
> 改了任何前端文件后，**务必把 `sw.js` 里的 `CACHE` 版本号 +1**（如 `cet4-v6`）再推送，
> 否则已安装 PWA 的用户会一直吃旧缓存。改完推送后，用户下次打开会自动静默更新。

---

## 🛠 更新网站（改完代码后）

```bash
git add -A
git commit -m "update: ..."
git push
```
GitHub Pages 会在 1～2 分钟内自动重新发布。**记得 bump `sw.js` 的 CACHE 版本号**。

---

## ❓ 常见问题

- **页面空白 / 资源 404？** 确认推送时 `git add -A` 包含了 `css/ js/ assets/` 等子目录；
  并检查仓库里这些文件确实在（GitHub 网页里能点开）。项目页地址自带 `/仓库名` 前缀，
  本项目路径是相对的，正常不会 404。
- **真题套卷没声音？** 4 个 mp3 已随仓库推送（见上）。若你 `git rm` 掉了它们，
  该标签页会提示加载失败，但其余 44 篇用浏览器语音合成朗读，不受影响。
- **网页上传报错 / 卡住？** 单文件 > 25MB 不能用网页拖拽，必须走 Git 命令行（见上）。
- **音发不响 / 手机不发音？** 首次需用户点一下页面任意位置解锁音频（浏览器自动播放限制），
  这是设计内的；之后点单词即朗读。详见 README「音频方案」。
- **GitHub CLI（gh）没装 / 不会用？** 直接用上面给的 `git` 命令即可，不需要 gh。

---

## 附：安装 Git（若本机没有）

- Windows：下载 <https://git-scm.com/download/win> 安装，全程下一步。
- macOS：`brew install git` 或装 Xcode Command Line Tools。
- Linux：`sudo apt install git`（Debian/Ubuntu）。

装好后重启命令行，执行 `git --version` 能看到版本即成功。

---

## 不想用 Git 命令行？备选方案

如果你**没有**那 4 个 mp3（或已 `git rm` 移除），仓库就变得很小（几 MB），这时也可以：
1. 在 GitHub 网页新建仓库；
2. 直接把本目录里的文件**拖拽**到 GitHub 网页的上传区（无大文件时可行）；
3. 再按「第 3 步」开启 Pages。

> 只要仓库里还有 `cet4-2025-*.mp3`（>25MB），网页拖拽就会失败，请务必用 Git 命令行。
