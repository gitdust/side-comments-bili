<p align="center">
  <img src="public/icons/icon128.png" width="96" height="96" alt="Side Comments Logo" />
</p>

<h1 align="center">B站侧边评论 (Side Comments - Bilibili)</h1>

<p align="center">
  <b>让 B 站视频与评论区并排展示，边看视频边刷神评。</b>
</p>

<p align="center">
  <a href="https://developer.chrome.com/docs/extensions/mv3/intro/"><img src="https://img.shields.io/badge/Manifest-V3-4285F4?style=flat-square&logo=googlechrome&logoColor=white" alt="Manifest V3" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.9+-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" /></a>
  <img src="https://img.shields.io/badge/Privacy-100%25%20Local-success?style=flat-square" alt="Privacy First" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" alt="License" />
</p>

<p align="center">
  <a href="./README.md"><b>简体中文</b></a> | <a href="./README_EN.md"><b>English</b></a>
</p>

---

## 💡 为什么需要它？

在电脑端刷 B 站视频时，精彩的评论往往都在视频下方。想要一边看视频内容、一边看弹幕与精彩评论，只能来回上下滚动网页，体验割裂。

**B站侧边评论** 是一款专为 B 站（bilibili.com）网页端设计的轻量 Chrome 扩展。它能够在视频播放页右下角提供一个开关，一键将原生评论区平移到播放器右侧，实现**左侧播放视频、右侧浏览与回复评论**的沉浸式并排体验。

> [!NOTE]
> **100% 原生节点平移，非接口重写**：插件直接复用 B 站原生评论区 DOM，发表评论、回复、点赞、查看楼中楼以及输入框吸底等功能全部保持原生，账号状态与交互体验毫无损耗。

---

## ✨ 核心特性

- 📺 **视频与评论并排浏览**：一键将评论区以独立侧边栏形式固定在播放器右侧，充分利用宽屏显示器空间。
- ⚡ **原生体验全保留**：直接移动原生评论节点，点赞、回复、查看子评论（楼中楼）、发表新评论、表情包均正常可用。
- 📋 **BV 号一键复制**：自动在视频标题旁注入 BV 号胶囊按钮，轻轻一点即可复制视频 BV 号。
- ↔️ **便捷展开与收起**：侧栏边缘提供快捷收起按钮，收起后自动显示原右侧推荐视频；随时点击边缘手柄滑回展开。
- 🔄 **智能状态感知与自适应**：
  - **SPA 路由感知**：切换选集或通过推荐点击新视频时，自动清理与复位，杜绝页面错位。
  - **全屏自适应**：进入全屏播放时自动隐藏侧栏，退出全屏后优雅恢复。
  - **位置记忆**：收起/展开过程中记忆滚动位置与输入草稿。
- 🎨 **专属排版调优**：为侧栏宽度精细调优文字字号与行距，评论输入框智能吸附侧栏底部。
- 🔒 **极致轻量，零隐私风险**：
  - 纯本地 JavaScript/CSS 运行，无后台常驻进程（No Background Service Worker）。
  - **零权限索取、零网络请求、零遥测打点、无任何第三方追踪**。

---

## 🖥️ 效果演示

> 可以在此处添加你的演示动图或截图：`assets/preview.png`

| 开启前（默认原版布局） | 开启后（视频与评论并排） |
| :---: | :---: |
| 评论区在视频下方，需反复下翻 | 评论在播放器右侧，边看边刷 |

---

## 📥 安装指南

### 方法一：直接下载安装包（推荐）

1. 在 GitHub Releases 页面下载最新的打包压缩包（如 `side-comments-bili-v0.1.0.zip`）并解压到本地。
2. 打开 Chrome 或 Chromium 内核浏览器（Edge、Brave、Arc、Vivaldi 等），在地址栏输入：
   ```text
   chrome://extensions/
   ```
3. 在页面右上角打开 **「开发者模式」 (Developer mode)**。
4. 点击左上角的 **「加载已解压的扩展程序」 (Load unpacked)**。
5. 选择解压后的文件夹（确保选中的目录下包含 `manifest.json`）。
6. 打开或刷新任意 [B 站视频页](https://www.bilibili.com/video/) 即可开始使用！

### 方法二：从源码构建

如果你希望自行构建或进行二次开发：

```bash
# 1. 克隆本仓库
git clone https://github.com/gitdust/side-comments-bili.git
cd side-comments-bili

# 2. 安装依赖
pnpm install

# 3. 编译打包生成 dist 目录
pnpm build

# 4. （可选）执行类型检查与自动化测试
pnpm check
pnpm test
```

构建完成后，在 `chrome://extensions` 中加载生成的 `dist` 目录即可。

---

## 🎮 使用方法

1. 打开任意 B 站视频页（URL 形式如 `https://www.bilibili.com/video/BV...`）。
2. 在**页面右下角**会看到一个扩展悬浮图标（未启用时为灰色）。
3. **点击图标开启**：
   - 图标点亮，页面自动平滑滚至顶部。
   - 原生评论区移至播放器右侧，评论区支持独立滚动。
4. **收起侧栏**：点击侧栏左侧的箭头按钮 `›`，侧栏向右收起，露出原视频推荐列表；点击屏幕右侧边缘手柄 `‹` 可再次滑出。
5. **复制 BV 号**：点击视频标题旁边的 `BVxxxxxxxxxx` 按钮即可一键复制。
6. **关闭侧栏**：再次点击右下角彩色图标，评论区立即无缝回归原位。

---

## 🔍 技术实现原理

不同于重新实现一套评论界面的第三方插件，本项目采用了**原生 DOM 劫持与重绑定（Node Re-parenting）**方案：

1. **节点迁移与占位追踪**：在原 `#commentapp` 位置前插入 HTML Comment 占位标记，并将实际评论 DOM 移入高层级的 `#mySideComment` 容器中；关闭时精确复位至占位标记前。
2. **滚动容器重定向**：B 站的原生组件（`bili-comments` 及其 shadowRoot 内的 `bili-comments-header-renderer`）依赖页面外层滚动来实现评论框吸底。本插件在挂载后主动重置其 `scrollContainer` 属性并触发初始化，使得评论发布框能在侧栏中正确吸附到底部。
3. **Shadow DOM 样式穿透**：通过 `MutationObserver` 监听动态生成的 ShadowRoot，动态注入字体与紧凑间距样式，保证在较窄的侧栏宽度下依然拥有舒适的排版。
4. **全链路生命周期清理**：监听 `resize`、`fullscreenchange`、`popstate` 以及 SPA URL 变动，确保换视频、全屏切换与窗口调整时零残存、零报错。

---

## 📌 支持范围与限制

| 分类 | 支持情况 | 说明 |
| :--- | :---: | :--- |
| **普通视频播放页 (`/video/BV...`)** | ✅ 支持 | 完整适配普通横屏视频与合集播放 |
| **Chromium 系列浏览器** | ✅ 支持 | Chrome, Edge, Brave, Vivaldi, Opera 等 |
| **番剧/电视剧/电影 (`/bangumi/...`)** | ❌ 暂不支持 | 番剧页面 DOM 结构不同，后续视需求跟进 |
| **直播间 (`live.bilibili.com`)** | ❌ 暂不支持 | 直播已有自带弹幕侧栏 |
| **移动端/手机浏览器** | ❌ 暂不支持 | 仅适配 PC 桌面端宽屏网页版 |

---

## 🛠️ 本地开发指令

```bash
# 生成图标（自动调用 Chrome 无头模式生成多尺寸 PNG）
pnpm icons

# 编译 TypeScript 并打包 CSS/静态资源到 dist/
pnpm build

# 打包发布用的 zip 压缩包（输出到 release/ 目录）
pnpm zip

# 类型检查 (TypeScript Strict)
pnpm check

# 运行自动化布局与节点回归测试 (Playwright)
pnpm test
```

---

## 🔒 隐私与安全承诺

- **无网络请求**：插件代码仅对当前页面 DOM 执行样式和层级调整，不会发起任何外部网络请求。
- **无账号风险**：不窃取或中转任何 Cookie、Token，所有评论、点赞、回复均由用户浏览器直接向 B 站官方接口发送。
- **无数据统计**：无 Google Analytics、百度统计或任何遥测埋点代码。

---

## 📄 开源许可

本项目基于 [MIT License](./LICENSE) 开源。
欢迎提交 Issue 和 Pull Request！
