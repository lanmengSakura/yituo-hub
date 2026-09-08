# 交接文档 → Codex：GZH CLI / cli.yituohub.com

> 交接时间：2026-09-03 · 交接方：ZCode 会话（测试 + 修复 + PR #6）
> 接手前必读：`TEST-REPORT-2026-09-02.md`（完整测试报告，含更正记录）
> 本文档自包含：假设你没有任何前置对话上下文。

---

## 0. 30 秒速览

- **项目**：YI TUO HUB GZH CLI（Markdown → 公众号高级排版 → 微信草稿箱）+ 其官网 cli.yituohub.com
- **已完成**：CLI 四项修复补丁、官网首页中文优先改版、端到端真实推稿验证、体积/动效上限系列实验 —— 全部在 **PR #6**
- **PR**：https://github.com/yan9651688/yituo-hub-studio/pull/6
  （分支 `lanmengSakura:feat/gzh-cli-l6-motion-and-homepage` → `yan9651688/yituo-hub-studio:main`，commit `630a5a5`）
- **你接手的**：推动合并、合并后上线（需服务器凭证）、把 CLI 补丁集成进真正的源码仓库、若干 P2
- **最重要的警告**：测试浏览器的滚动/文字发虚"故障"是工具伪影（已用金丝雀页面对照证实），**不要据此改站点代码**。详见 §3.2。

---

## 1. 仓库与角色关系（易混淆，注意）

| 名称 | 地址 | 内容 | 角色 |
|---|---|---|---|
| origin | `lanmengSakura/yituo-hub` | STUDIO 项目（工作副本所在仓库） | 本机 fork，gh 已登录 lanmengSakura |
| 上游（PR 目标） | `yan9651688/yituo-hub-studio` | 同上（STUDIO），**合作者维护** | PR #6 的 base |
| 注意 | `yan9651688/yituo-hub` | 也是 STUDIO（local remote `upstream` 指向它，但 fork 父仓库实际是 yituo-hub-studio） | —— |
| **CLI 项目源** | **⚠️ 无 git 仓库** | 发布包内容 == 项目根（含 `cli/`、`install.sh`、官网 `index.html`、`docs/` 等） | 只有服务器副本和本机解压副本 |

- 本机 CLI 项目解压副本（已打补丁，可直接用）：`~/.local/share/yituo-hub-gzh/`
- 打包脚本：`~/.local/share/yituo-hub-gzh/scripts/build-release.sh`（产出 `dist/yituo-hub-gzh-cli.tar.gz`）
- **历史遗留问题**：CLI 项目源码不受版本管理。§4 待办 3 就是把 `cli-patches/` 集成进真正的源仓库——接手后建议先问合作者"CLI 源码仓库在哪"，找不到就把整个项目根建仓。

## 2. 已完成并验证的工作（不要重做）

| 工作 | 状态 | 证据 |
|---|---|---|
| CLI 补丁 0001：draft 放开 L6 动效渲染（`--preserve-visuals` → `motion:true`）+ writeResult 文本模式失败输出 | ✅ 实机验证 | 真实推稿 deep-sea L6 海报 17/17 动效存活 |
| CLI 补丁 0002：容纳上限按实测修正（chars 220000 / bytes 600KB，2 万字符降为软警告） | ✅ 实机验证 | 44,768 字符 violet L6 全文全动效推稿成功，软警告正常 |
| CLI 补丁 0003：install.sh Windows（MSYS `ln -s` 实为复制 → node 转发包装脚本） | ✅ 语法/逻辑验证 | 检测表达式 `uname -s` = MINGW64_NT 实测命中 |
| 官网首页中文优先改版（H1/CTA/导航/页脚 + 中文字形适配 + overflow-x clip） | ✅ IAB 实测 | `gui-test-screenshots/t8_*.png` |
| l6-draft-kit 复刻包（l6-push.js + 指南 + 示例） | ✅ | motionSurvived=true 多次实测 |
| 完整测试报告 | ✅ | `TEST-REPORT-2026-09-02.md` |

- 本机安装的 CLI **已经是补丁版**（改动同时落在 `~/.local/share/yituo-hub-gzh/`，原始备份在 `cli-patches/orig/`）。
- 补丁后发布包已重打包：`~/.local/share/yituo-hub-gzh/dist/yituo-hub-gzh-cli.tar.gz`（4MB），**尚未上传服务器**。

## 3. 关键事实（避免重复踩坑）

### 3.1 微信 API 实测结论（2026-09 探测，均真实接口验证）

1. **`draft/add` 原样存储 SVG/SMIL 动画**：`<animate>`/`<animateTransform>`、stroke-dashoffset、`begin` 属性、`data-*` 全部保留。不存在"API 清洗 SVG"。
2. **文档口径"正文少于 2 万字符"服务端不强制**：150,209 字符照收。`45002 content size out of limit` 才是真上限。
3. **真实硬上限按字节计 ≈690KB**（边界 669~691KB，与字符集/内容形态无关；纯文字和动效海报撞同一堵墙）。超限报 `45002`，错误里带 rid。
4. **40164（IP 不在白名单）的错误信息里就是该加白名单的 IP**——CLI 已实现自动提取（`whitelistIp` 字段）。
5. 本机访问微信的出口 IP 是 `223.79.252.216`（直连），与境外 IP 服务看到的代理出口 `154.44.12.39` 不同——配白名单用前者。
6. 账号配置：`~/.config/yituo-hub-gzh/config.json`（0600，appid=wx62d31f38f9cb0025，密钥已配置）；环境变量 `WECHAT_APPID/WECHAT_APPSECRET` 优先。

### 3.2 测试环境伪影警告（前车之鉴）

本项目的浏览器自动化环境（IAB）有三个坑，初测时曾被误判为"站点 P0 故障"，后经对照实验全部推翻并更正：

| 伪影 | 表现 | 证实方法 | 教训 |
|---|---|---|---|
| 合成滚动失效 | wheel/PageDown/scrollIntoView 全部无效，`window.scrollY` 恒 0 | 金丝雀对照：无 CSS/JS 的普通长页同样滚不动 → 工具缺陷 | 先跑无影响面对照页，再下"页面坏了"的结论 |
| 合成渲染发虚 | 视频层 + backdrop-filter 页面小字模糊 | DOM 计算样式无滤镜、移动端清晰、源码无 blur | 计算样式与截图矛盾时，优先怀疑渲染层 |
| fullPage 截图拼接 | fixed/sticky 元素在每一屏重复 | —— | 整页截图只看内容完整性，不看视觉 |

**可用**的交互：元素定位点击（偶发超时，重试或换坐标点击）、锚点跳转、`scrollY` 程序化读取、`getDraft` 回读。**不可用**：合成滚轮/键盘滚动、`evaluate` 有时被拒（换 locator 读）。

### 3.3 服务器信息

- cli.yituohub.com → `154.21.197.221`（SSH 22 端口开放，Ubuntu OpenSSH）
- nginx root：`/var/www/screensprout-gzh`（conf 在项目根 `deploy/nginx-screensprout-gzh.conf`）
- **本机无 SSH 凭证**。专用密钥已生成未授权：`~/.ssh/yituo_deploy(.pub)`（ed25519，注释 zcode-deploy-cli-site）——合作者或用户把公钥加进服务器 `authorized_keys` 后即可直接部署；或继续走用户自有通道。

## 4. 待办（建议顺序）

1. **推动 PR #6 合并**（合作者侧审核）。
2. **合并后上线**（需服务器凭证，二选一）：
   - 首页：`cd cli-site && ./deploy-cli-site.sh user@154.21.197.221`（服务器端自动备份 `*.bak.<时间戳>`，回滚命令脚本会打印）
   - CLI 分发：上传 `~/.local/share/yituo-hub-gzh/dist/yituo-hub-gzh-cli.tar.gz` 覆盖 `/var/www/screensprout-gzh/releases/yituo-hub-gzh-cli.tar.gz`
   - 上线后回归验证清单：首页标题为中文 ✓ / `curl -fsSL https://cli.yituohub.com/install.sh | bash` 新装流程走通（Windows Git Bash 下 `yituo-hub-gzh --version` 应输出版本号）✓ / `docs/` 正常 ✓
3. **CLI 补丁集成进源仓库**（见 §1 历史遗留）：把 `cli-patches/` 应用到 CLI 真正的源码处并纳入版本管理；建议顺手把版本号提到 0.2.0。
4. **人工验证项**（API 无法探测）：
   - 草稿箱样本《动效密度阶梯 1600 单元》（3,200 动画/669KB）在后台打开 + 手机预览，确认编辑器/客户端不卡不白屏、动效播放——这是"微信客户端侧上限"的唯一未知数；
   - 改版首页在真实 Chrome/Edge 的滚动与文字清晰度复核（预期正常）；
   - layout 产物粘贴进微信编辑器，确认 SVG 是否被编辑器清洗。
5. **P2 零散**（报告第十节）：移动端导航缺汉堡菜单；`--version` 单独作为参数时会落入 help 分支（`main()` 里 positional 为空默认 `help`，应先判 `flags.version`）；tar xattr 警告（打包加 `COPYFILE_DISABLE=1`）；SVG 过编辑器白名单复验。
6. **草稿箱整理**：同名验收稿《一行命令…》现存静态版 + 全动效版共 2~3 篇，保留全动效版即可。

## 5. 文件地图（本仓库分支 `feat/gzh-cli-l6-motion-and-homepage`）

```
TEST-REPORT-2026-09-02.md   完整测试报告（先读这个）
l6-draft-kit/               复刻包：l6-push.js（推稿工具）/L6存稿指南.md/示例文
cli-site/                   官网改版：index.html + cinematic.css（改动文件）/
                            deploy-cli-site.sh（上线脚本）/scroll-canary.html（滚动对照金丝雀）
cli-patches/                CLI 补丁：0001~0003 .patch / orig/ 原文件 / patched/ 补丁后文件 / README.md
gui-test-screenshots/       网页测试证据截图
cli-func-test/              全部实验脚本与结果 JSON（svg 对照、密度阶梯、体积探测…）
```

本机（不在仓库内）：
```
~/.local/share/yituo-hub-gzh/   CLI 项目根（已打补丁）+ dist/ 新发布包
~/.config/yituo-hub-gzh/        公众号配置（含密钥，勿动勿传）
~/.ssh/yituo_deploy(.pub)       部署密钥（待授权）
```

## 6. 常用命令速查

```bash
CLI=~/.local/share/yituo-hub-gzh/cli/bin/yituo-hub-gzh.js

# L6 动效文章推稿（官方命令，已打补丁）
node "$CLI" draft 文章.md --style night-editorial --level L6 --preserve-visuals \
  --cover cover.png --author "Y visual" --json
# → 校验 storedAnim：用 cli/lib/wechat.js 的 getDraft 回读数 <animate>

# 体积审计（哪些主题塞得下当前文章）
node l6-draft-kit/l6-push.js 文章.md --audit

# 官网本地预览（cli-site/ 目录）
# 见 cli-site/deploy-cli-site.sh 同目录的本地服务器脚本，或任意静态服务器指向该目录

# 真实推稿后回读验证动效存活（Agent 可编程复用）
node -e "const w=require('$HOME/.local/share/yituo-hub-gzh/cli/lib/wechat.js');
  const cfg=JSON.parse(require('fs').readFileSync(process.env.HOME+'/.config/yituo-hub-gzh/config.json','utf8'));
  (async()=>{const t=await w.getAccessToken(cfg.appid,cfg.appsecret);
    const d=await w.getDraft(t,'<draftMediaId>');
    const c=d.news_item[0].content;
    console.log('svg=',(c.match(/<svg/g)||[]).length,'animate=',(c.match(/<animate/g)||[]).length)})()"
```

## 7. 改动后自测清单（Codex 版）

- [ ] JS：`node --check`；install.sh：`bash -n`
- [ ] `draft --dry-run --json`：`ok:true` + 软警告出现在 `validationWarnings`
- [ ] 真实推稿（小文）→ 回读 `verified:true` + 数 `animate` 标记 == 提交数
- [ ] 网页改动：桌面/移动截图 + 锚点点击后 `scrollY` 读取；滚动问题先用金丝雀对照排除环境（§3.2）
- [ ] 任何"微信限制"结论：必须先绕开 CLI 自有管线直推对照（`cli/lib/wechat.js` 直连），再下结论
