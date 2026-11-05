<p align="center">
  <img src="public/icons/icon128.png" width="80" height="80" alt="Side Comments Logo" />
</p>

<h1 align="center">B站侧边评论 (Side Comments - Bilibili)</h1>

<p align="center">
  在 B 站视频页把评论区移动到播放器右侧，边看视频边刷神评。
</p>

<p align="center">
  <a href="https://github.com/gitdust/side-comments-bili/releases/latest"><img src="https://img.shields.io/github/v/release/gitdust/side-comments-bili?label=%E4%B8%8B%E8%BD%BD%20ZIP&color=2ea44f&style=flat-square" alt="Download Latest Release" /></a>
  <a href="https://developer.chrome.com/docs/extensions/mv3/intro/"><img src="https://img.shields.io/badge/Manifest-V3-4285F4?style=flat-square&logo=googlechrome&logoColor=white" alt="Manifest V3" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.9+-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" /></a>
  <img src="https://img.shields.io/badge/Privacy-100%25%20Local-success?style=flat-square" alt="Privacy First" />
  <a href="./LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" alt="License" /></a>
</p>

<p align="center">
  <a href="./README.md"><b>简体中文</b></a> | <a href="./README_EN.md"><b>English</b></a>
</p>

---

## 效果演示

<p align="center">
  <img src="https://media.wanweishiyi.com/web/crafts/side-comments-bili.gif" alt="效果演示" width="100%" />
</p>

---

## 功能介绍

- 📺 **视频与评论同屏**：在视频播放页右下角显示开关图标，点击即可将原生评论区移至视频右侧，充分利用宽屏。
- ⚡ **完整保留原生操作**：直接复用原生评论区，点赞、回复、查看楼中楼、发表新评论、发送表情包等完全不受影响。
- 📋 **一键复制 BV 号**：视频标题旁自带 BV 号小按钮，点击即可快速复制。
- ↔️ **便捷收起与展开**：侧栏边缘提供收起按钮，收起后显示原推荐视频；随时点击屏幕边缘滑出展开。
- 🔄 **智能自适应**：
  - 切换视频（选集/推荐）时自动复位，无需手动刷新。
  - 全屏播放时自动隐藏，退出全屏自动恢复。
  - 展开与收起时保留原阅读位置和未发送的评论草稿。
- 🔒 **纯净无后台**：无后台常驻进程，不收集任何数据，不需要多余权限。

---

## 📥 安装使用

### 1. 下载安装包
📦 **[前往 GitHub Releases 下载最新安装包](https://github.com/gitdust/side-comments-bili/releases/latest)**

进入页面后，在 **Assets** 区域下载 `side-comments-*.zip` 并解压到本地。

### 2. 加载到浏览器
1. 打开 Chrome（或 Edge、Brave、Arc 等 Chromium 浏览器），地址栏访问：
   ```text
   chrome://extensions/
   ```
2. 打开右上角的 **「开发者模式」**。
3. 点击左上角的 **「加载已解压的扩展程序」**，选择解压出的文件夹（确保目录下直接包含 `manifest.json`）。
4. 打开任意 [B 站视频页](https://www.bilibili.com/video/)，页面右下角即可看到侧边评论开关！

---

## 欢迎贡献

这是一个轻量实用的小工具，欢迎提交 Issue 和 Pull Request 一起改进！

## 开源协议

[MIT](./LICENSE)
