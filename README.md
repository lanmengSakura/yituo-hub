> 🤝 **本项目由 [颜](https://github.com/yan9651688) × 蓝梦（[lanmengSakura](https://github.com/lanmengSakura)）联合打造** —— 排版引擎与产品体验来自颜，动效组件库来自蓝梦的 wechat-motion-layout-studio。

<div align="center">

# Yi Tuo Hub · 公众号排版工坊

**把 Markdown 一键排成可直接粘贴进微信公众号编辑器的精致 HTML**

33 套主题 · 75 个动效组件 · 平台合规校验 · 关键词智能标记 · 一键复制 · 零构建纯静态

[![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL--3.0-blue.svg)](LICENSE)
[![Themes](https://img.shields.io/badge/themes-33-1D4ED8)](#-33-套主题)
[![Motion](https://img.shields.io/badge/动效组件-75-7C3AED)](#-动效组件库)
[![No Build](https://img.shields.io/badge/构建-零依赖-success)](#-快速开始)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](#-作者)

</div>

---

打开网页，粘贴 Markdown，选一套主题，点「复制到公众号」——粘贴进编辑器，**样式纹丝不丢**。每段自动标关键词下划线、章节自动编号配英文小标、引言卡与导读目录自动生成、文末签名自动合并、中英标点自动全角化，并在你点击复制前用合规校验器把公众号编辑器的所有红线兜一遍。

## 🌐 在线体验

- **<https://studio.yituohub.com>** —— 打开首页，点「开始排版」即可

## ✨ 核心特性

- **33 套主题，四种气质**：杂志编辑部（原创）· 经典复刻（致敬 gzh-design-skill）· 新锐系列 · 动效系列（复刻自蓝梦动效排版库）——从科技蓝到黑金衬线，从宣纸朱砂到新粗野撞色。
- **不掉格式**：样式全部内联、文字一律 `<span leaf="">` 包裹，规避 `<style>/<div>/class/grid/position` 等公众号会过滤的写法。
- **智能排版**：每段第一个 `**加粗**` 自动升级为主题色关键词下划线；`==荧光笔==`、`++下划线++` 扩展语法；章节自动编号（01/02…）+ 英文小标（实战→PRACTICE、总结→SUMMARY）。
- **杂志级封面**：`# 标题 / 副标题` 一行生成编辑部风杂志卡——刊头小字、双色大标题、关键词行、彩色底栏。
- **动效组件库**：75 个 SMIL 动画 SVG（15 套风格 × 主标题/章节标题/装饰/边框/尾饰），面板内实时预览，一键插入封面下方——公众号编辑器原生支持。
- **双关卡质量校验**：产物实时过平台红线检查（禁用标签/属性、`span leaf` 覆盖率、中英混排半角标点提醒），ERROR 清零才建议交付。
- **一键复制 / 下载**：富文本直接进剪贴板，公众号编辑器 ⌘V 即达；另提供 .html 下载兜底。
- **零构建零后端**：纯静态文件，无依赖无框架，任何一台 nginx 都能跑。

## 👀 产品预览

<table>
<tr>
<td width="50%" align="center"><img src="assets/landing-preview.png" width="100%"><br><sub><b>电影感首页 · 照片级雪山 + 云雾漂移 + 鼠标视差</b></sub></td>
<td width="50%" align="center"><img src="assets/studio-preview.png" width="100%"><br><sub><b>排版工坊 · 粘贴即所得，右侧实时预览</b></sub></td>
</tr>
</table>

## 🎨 33 套主题

| 分组 | 主题 |
|------|------|
| **杂志编辑部**（原创 6 套） | 深海蓝 `#1D4ED8` · 曙光橙 `#EA580C` · 星穹紫 `#7C3AED` · 鎏金黑 `#111827` · 青瓷 `#0F766E` · 绯樱 `#DB2777` |
| **经典复刻**（致敬 [gzh-design-skill](https://github.com/isjiamu/gzh-design-skill)） | 摸鱼绿 · 红白风 · 石墨极简 · 留白禅意 · 摸鱼票据 · 橄榄手记 |
| **新锐系列** | 摩卡 · 勃艮第 · 午夜靛蓝 · 芒果琥珀 · 湖水青 · 燕麦拿铁 |
| **动效系列**（复刻自 [wechat-motion-layout-studio](https://github.com/lanmengSakura/wechat-motion-layout-studio)） | 档案棕褐 · 工程蓝图 · 植物笔记 · 青柠报告 · 珊瑚志 · 深海终端 · 朱砂编辑部 · 雾感研究 · 素金手记 · 新粗野 · 夜航评论 · 宣纸 · 软陶 · 瑞士信号 · 紫罗兰工作室 |

> 🎨 **加一套主题 = 加一个对象**。主题是参数化 spec（配色 + 组件形态），在 `themes.js` 的 `SPECS` 数组追加即可，界面自动出现新卡片。

## ✨ 动效组件库

75 个纯 SMIL 动画 SVG（15 套风格 × 5 角色），`motion/` 目录整库分发：

| 角色 | 说明 |
|------|------|
| 主标题 / 章节标题 | 带笔触流动、摇曳动效的标题艺术字 |
| 装饰 / 边框 / 尾饰 | 插画框线、分隔装饰、文尾点缀 |

工坊工具栏点「✨ 动效」打开面板：左侧选风格，右侧实时预览动画，**插入文首**（排在封面下方）或**复制 SVG** 自由放置。公众号编辑器原生支持 SMIL 动效。

## ✅ 适合 / ❌ 不适合

**✅ 适合**：教程 · 测评 · 观点长文 · 知识清单 · 数据复盘 · 生活随笔 · 品牌专栏 —— 凡是要发公众号的 Markdown / 纯文本，选主题一键排成合规 HTML。

**❌ 不适合**：普通网页 / 落地页 · PPT · 纯图片海报 · **代写文章**（本工具只排版、不写作——先有稿子再用它）。

## 🚀 快速开始

```bash
git clone https://github.com/yan9651688/yituo-hub.git
cd yituo-hub
python3 -m http.server 8123
# 打开 http://localhost:8123 —— 首页
# 打开 http://localhost:8123/studio.html —— 排版工坊
```

部署到服务器（任选）：

```bash
./deploy.sh root@你的服务器IP                          # rsync + nginx reload
docker build -t yituo-hub . && docker run -d -p 80:80 yituo-hub
```

## ⌨️ 输入语法速览

````markdown
# 标题 / 副标题        ← 自动生成杂志封面（刊头 + 双色标题 + 彩色底栏）
## 章节标题            ← 自动编号 + 英文小标（01 PART · PRACTICE）
**加粗**               ← 每段第一个自动升级为主题色关键词下划线
==荧光笔==  ++下划线++  ← 扩展标记语法
> 引用                 ← 文首自动转引言卡，正文为左竖条引用
```bash … ```           ← macOS 红绿灯代码块，粘贴后缩进不乱
文末「我是 XX，…点赞在看转发」 ← 自动识别并合并进统一签名区
````

## 🗂 项目结构

```
├── index.html        电影感首页（雪山云雾 + 鼠标视差）
├── studio.html       排版工坊
├── themes.js         参数化主题引擎（33 套 spec，加主题=加对象）
├── converter.js      Markdown → 语义 token（含智能标记策略）
├── validator.js      公众号平台红线校验器
├── app.js            工坊前端（主题选择器 + 动效面板）
├── motion/           动效组件库（75 SMIL SVG + 授权声明）
└── deploy.sh / Dockerfile / nginx.conf
```

## 🤝 作者

<div align="center">

<table>
<tr>
<td width="50%" align="center"><img src="assets/qr-yan.jpg" width="200" height="200"><br><sub><b>颜</b> · <a href="https://github.com/yan9651688">yan9651688</a> · 排版引擎与产品</sub></td>
<td width="50%" align="center"><img src="assets/qr-lanmeng.jpg" width="200" height="200"><br><sub><b>蓝梦</b> · <a href="https://github.com/lanmengSakura">lanmengSakura</a> · 动效组件库</sub></td>
</tr>
</table>

欢迎扫码交流公众号排版与 AI 写作工作流，PR 与 Issue 同样欢迎。

</div>

## 🙏 致谢

- [gzh-design-skill](https://github.com/isjiamu/gzh-design-skill)（AGPL-3.0，甲木 × 摸鱼小李）——本项目的排版工作流、平台红线标准与「经典复刻」组主题的配色来源
- [wechat-motion-layout-studio](https://github.com/lanmengSakura/wechat-motion-layout-studio)（蓝梦）——动效组件库与「动效系列」主题的风格来源
- 首页雪山摄影来自 [Pexels](https://www.pexels.com/)（免费商用许可）

## 📄 License

[AGPL-3.0](LICENSE)。基于 gzh-design-skill 二次开发，修改与分发须遵循同一协议并保留原项目署名；`motion/` 动效库版权归蓝梦所有。
