# 自定义域名绑定指南（GitHub Pages + 免费 eu.org 二级域名）

本项目已开启 GitHub Pages，当前地址：`https://jiajia-source.github.io/cet4-relay/`

本文件说明如何把一个**免费 eu.org 二级域名**（如 `jiajia.eu.org`）绑定到本项目，
并开启 **HTTPS 加密**，适配开源长期使用。

> ✅ 兼容性已就绪：本站所有资源均使用**相对路径**，因此无论部署在
> `用户名.github.io/仓库名/`（项目页）还是自定义域名根路径 `jiajia.eu.org/`，
> 都能正确加载，**无需改任何代码**。

---

## 一、DNS 解析记录（在你的 DNS 服务商后台添加）

因为 `jiajia.eu.org` 是**子域名**（非裸域），用 **CNAME** 即可：

| 类型 | 主机名 / Name | 值 / Value | 说明 |
|------|---------------|------------|------|
| CNAME | `jiajia` | `jiajia-source.github.io` | 末尾的 `.` 可加可不加，取决于 DNS 商 |

> 不需要 A 记录（A 记录只用于裸域 `example.com`）。
> 若用 Cloudflare，记录默认走代理（橙色云）也可，GitHub 证书照常签发；
> 想纯 DNS 解析就点灰云。

---

## 二、在 GitHub Pages 绑定自定义域名（域名审核通过、DNS 生效后做）

### 方式 A：网页操作（最简单）
1. 仓库 **Settings → Pages → Custom domain** 填入 `jiajia.eu.org` → Save。
2. 勾选 **Enforce HTTPS**（DNS 生效后约 15 分钟~24 小时可选，GitHub 自动签发证书）。
3. 仓库根目录会出现 `CNAME` 文件，内容为 `jiajia.eu.org`（方式 B 可手动加）。

### 方式 B：命令行（用具备 `repo` 权限的 PAT）
```bash
# 1) 写入 CNAME 文件
echo "jiajia.eu.org" > CNAME
git add CNAME && git commit -m "chore: add custom domain CNAME" && git push

# 2) 通过 API 设置自定义域名并强制 HTTPS
curl -s -X PUT \
  -H "Authorization: Bearer <你的PAT>" \
  -H "Accept: application/vnd.github+json" \
  -d '{"cname":"jiajia.eu.org","enforced_https":true}' \
  "https://api.github.com/repos/jiajia-source/cet4-relay/pages"
```
> 设完自定义域名后，`jiajia-source.github.io/cet4-relay/` 会自动 301 跳转到 `jiajia.eu.org`。

---

## 三、申请免费 eu.org 域名（需本人完成邮箱验证）

> eu.org 为志愿运营，注册需邮箱激活 + 人工审核（通常 1–5 天，偶尔数周）。
> **申请必须由你本人操作邮箱验证**，助手无法代收邮件。

### 步骤
1. **准备免费 DNS 账号**：注册 Cloudflare（免费）或 DNSPod（dnspod.cn，中文友好）或 he.net。
2. **建解析区**：在 DNS 商添加站点 `jiajia.eu.org`，获取分配给你的两条 NS 地址
   （如 Cloudflare 的 `xxx.ns.cloudflare.com` / `yyy.ns.cloudflare.com`）。
   > 这一步必须先做——eu.org 审核会校验你填的 NS 是否真能权威解析该域名。
3. **注册 eu.org 账号**：打开 https://nic.eu.org/arf/en/ ，用常用邮箱注册，
   去邮箱点激活链接（邮件里含一个 `nic-hdl` Handle，用于登录）。
4. **提交域名申请**：登录 → **New Domain** →
   - Complete domain name：`jiajia.eu.org`（前缀至少 4 字符）
   - DNS：选 "server names"，填入第 2 步拿到的两条 NS
   - 验证方式选第一项（Check for correctness of server names）
   - 提交，页面提示 `No error` / `Done` 即进入审核队列。
5. **等待审核邮件**：注意查收（含垃圾邮件），标题类似
   `request [...] (domain XXX.EU.ORG) accepted` 表示通过。
6. **添加解析**：审核通过后，在 DNS 商后台加第一节的 **CNAME 记录**
   （`jiajia` → `jiajia-source.github.io`）。
7. **绑定 + HTTPS**：按第二节操作，GitHub 自动签发证书并开启强制 HTTPS。

### 备注
- 一人可申请多个 eu.org 域名，均永久免费。
- whois 公开，联系人资料勿填明显虚假（会被退），但用专用邮箱 + 最低限度地址即可。
- 域名每约两年需登录确认一次活跃度，否则可能被回收。

---

## 四、排错
- **Enforce HTTPS 是灰的/报错**：DNS 的 CNAME 还没完全生效，等几分钟刷新；
  用 `dig jiajia.eu.org` 确认已指向 `jiajia-source.github.io`。
- **打开显示 GitHub 404**：确认仓库 `main` 分支根目录有 `index.html` 且 Pages 源选 `main` / root。
- **证书一直没下发**：确认 CNAME 值拼写无误、未多打空格；Cloudflare 若开代理需等边缘证书。
- **改代码后线上不变**：把 `sw.js` 的 `CACHE` 版本号 +1 再推（PWA 缓存导致）。
