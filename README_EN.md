<p align="center">
  <img src="public/icons/icon128.png" width="80" height="80" alt="Side Comments Logo" />
</p>

<h1 align="center">Side Comments for Bilibili</h1>

<p align="center">
  Move the comment section to the right side of the video on Bilibili to watch and browse simultaneously.
</p>

<p align="center">
  <a href="https://github.com/gitdust/side-comments-bili/releases/latest"><img src="https://img.shields.io/github/v/release/gitdust/side-comments-bili?label=Download%20ZIP&color=2ea44f&style=flat-square" alt="Download Latest Release" /></a>
  <a href="https://developer.chrome.com/docs/extensions/mv3/intro/"><img src="https://img.shields.io/badge/Manifest-V3-4285F4?style=flat-square&logo=googlechrome&logoColor=white" alt="Manifest V3" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.9+-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" /></a>
  <img src="https://img.shields.io/badge/Privacy-100%25%20Local-success?style=flat-square" alt="Privacy First" />
  <a href="./LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" alt="License" /></a>
</p>

<p align="center">
  <a href="./README.md"><b>简体中文</b></a> | <a href="./README_EN.md"><b>English</b></a>
</p>

---

## Demo

<p align="center">
  <video src="assets/side-comments-bili.mp4" controls="controls" width="100%"></video>
</p>

---

## Features

- 📺 **Side-by-Side Viewing**: Shows a toggle button in the bottom-right corner of Bilibili video pages to move comments to the right of the player.
- ⚡ **100% Native Interaction**: Keeps all native functionality intact—upvotes, replies, nested threads, comment drafting, and stickers.
- 📋 **One-Click BV ID Copy**: Adds a handy pill button next to the video title to copy the BV identifier in one click.
- ↔️ **Collapse & Expand**: Sidebar handle lets you collapse comments to view recommended videos and slide back anytime.
- 🔄 **Smart Adaptation**:
  - Automatically resets when navigating to another video.
  - Automatically hides during fullscreen playback and restores on exit.
  - Preserves reading position and unsent comment drafts.
- 🔒 **Lightweight & Clean**: No background service worker, zero tracking, no extra permissions required.

---

## 📥 Installation & Usage

### 1. Download Extension
📦 **[Download the Latest Release from GitHub](https://github.com/gitdust/side-comments-bili/releases/latest)**

Download `side-comments-*.zip` from the **Assets** section and extract it locally.

### 2. Load into Browser
1. In Chrome (or Edge, Brave, Arc, etc.), navigate to:
   ```text
   chrome://extensions/
   ```
2. Enable **"Developer mode"** in the top-right corner.
3. Click **"Load unpacked"** in the top-left corner and select the extracted folder (make sure `manifest.json` is directly in this directory).
4. Open any [Bilibili Video](https://www.bilibili.com/video/) and click the toggle icon in the bottom-right corner!

---

## Contributing

This is a lightweight utility tool. Pull Requests and Issues are warmly welcome!

## License

[MIT](./LICENSE)
