<p align="center">
  <img src="public/icons/icon128.png" width="96" height="96" alt="Side Comments Logo" />
</p>

<h1 align="center">Side Comments for Bilibili</h1>

<p align="center">
  <b>Watch Bilibili videos and browse comments side-by-side with full native interaction.</b>
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

## 💡 Why Side Comments?

On the desktop web version of Bilibili, comments are situated underneath the video player. When you want to watch the video and follow community discussions simultaneously, you are forced to scroll up and down repeatedly, interrupting the playback experience.

**Side Comments - Bilibili** is a lightweight, zero-tracking Chrome extension. It adds an unobtrusive toggle button in the bottom-right corner of video pages (`https://www.bilibili.com/video/BV...`), moving the native comment section directly to the right side of the video player in a full-height column.

> [!NOTE]
> **100% Native DOM Re-parenting, Zero API Wrapping**: Unlike plugins that reconstruct comments with external APIs, this extension mounts Bilibili's authentic comment DOM directly into the sidebar. Posting comments, replies, upvoting, sub-thread expanding, and sticky bottom input boxes work out of the box with zero loss of functionality.

---

## ✨ Features

- 📺 **Side-by-Side Viewing**: Moves comments to the right of the player for a seamless split-screen experience, optimizing widescreen displays.
- ⚡ **Full Native Interaction**: Every native feature is preserved—submitting comments, replying, upvoting, nested replies (楼中楼), and stickers.
- 📋 **One-Click BV ID Copy**: Automatically inserts a clean pill badge next to the video title—click to copy the BV identifier instantly.
- ↔️ **Smooth Expand & Collapse**: Toggle handle on the sidebar edge lets you collapse comments to view recommendations/playlists, and slide back whenever you want.
- 🔄 **Smart Lifecycle Handling**:
  - **SPA Route Detection**: Cleans up and rebinds seamlessly during in-page video switches (Single-Page App routing).
  - **Fullscreen Auto-Hide**: Automatically conceals itself during player/browser fullscreen and restores smoothly upon exit.
  - **Scroll & Input Preservation**: Remembers scroll position and draft inputs across collapses and expansions.
- 🎨 **Tailored Typography**: Refines font sizes (13px) and layout spacing for narrower sidebar widths; keeps the input area docked at the bottom.
- 🔒 **Privacy-First & Ultralight**:
  - Runs purely in local content scripts—no background service worker overhead.
  - **Zero extra permissions, zero analytics, zero external network requests**.

---

## 🖥️ Preview

> Place your demo preview GIF or screenshot here: `assets/preview.png`

| Before (Default Layout) | After (Side-by-Side Layout) |
| :---: | :---: |
| Comments hidden below the viewport | Comments right beside the video |

---

## 📥 Installation

### Method 1: Load Unpacked Extension (Recommended)

1. Download the latest release zip archive (e.g. `side-comments-bili-v0.1.0.zip`) from the GitHub Releases page and extract it.
2. In Chrome or any Chromium-based browser (Edge, Brave, Arc, Vivaldi, etc.), navigate to:
   ```text
   chrome://extensions/
   ```
3. Enable **"Developer mode"** in the top-right corner.
4. Click **"Load unpacked"** in the top-left corner.
5. Select the extracted folder (make sure the chosen directory contains `manifest.json`).
6. Navigate to or refresh any [Bilibili Video Page](https://www.bilibili.com/video/) to start using it!

### Method 2: Build from Source

To compile the extension locally:

```bash
# 1. Clone the repository
git clone https://github.com/gitdust/side-comments-bili.git
cd side-comments-bili

# 2. Install dependencies
pnpm install

# 3. Build bundle into dist/
pnpm build

# 4. (Optional) Run type check and tests
pnpm check
pnpm test
```

After building, load the generated `dist/` directory in `chrome://extensions`.

---

## 🎮 How to Use

1. Navigate to any regular Bilibili video page (e.g., `https://www.bilibili.com/video/BV...`).
2. A floating toggle icon will appear in the **bottom-right corner** of the page (gray when inactive).
3. **Click the toggle icon**:
   - The icon lights up, and the page smoothly scrolls to top.
   - The comment section relocates to the right of the video with independent scrolling.
4. **Collapse Sidebar**: Click the `›` arrow button on the sidebar edge to slide it out and view recommended videos; click `‹` on the right screen edge to slide it back.
5. **Copy BV ID**: Click the `BVxxxxxxxxxx` pill button beside the video title to copy the video identifier.
6. **Turn Off**: Click the bottom-right toggle icon again to return the comments back to their original position.

---

## 🔍 Technical Architecture

Instead of re-implementing comment UIs via third-party APIs, this extension utilizes **DOM Re-parenting & Reactive Binding**:

1. **DOM Relocation with Comment Marker**: An HTML Comment placeholder node is created right before `#commentapp`. The real comment DOM node is mounted into the `#mySideComment` container; toggling off cleanly replaces the placeholder with the original node.
2. **Scroller Container Redirection**: Bilibili's custom components (`bili-comments` and `bili-comments-header-renderer` in the shadow DOM) rely on the page scroll container for docking the reply bar. The extension repoints their `scrollContainer` property and triggers re-initialization so that input docking follows the sidebar's own scrollbar.
3. **Shadow DOM Style Injection**: Observes dynamically attached ShadowRoots via `MutationObserver` to inject optimized font size (13px) and margin rules, ensuring readability inside the sidebar column.
4. **Lifecycle & Clean-up**: Listens to `resize`, `fullscreenchange`, `popstate`, and URL polling to handle route mutations, window resizing, and fullscreen events without DOM leaks.

---

## 📌 Scope & Compatibility

| Platform / Page | Support | Note |
| :--- | :---: | :--- |
| **Standard Video (`/video/BV...`)** | ✅ Supported | Full support for desktop web video pages |
| **Chromium Browsers** | ✅ Supported | Chrome, Edge, Brave, Vivaldi, Opera, Arc, etc. |
| **Bangumi / Anime (`/bangumi/...`)** | ❌ Not yet | Uses distinct DOM structure; may be added in future |
| **Live Streams (`live.bilibili.com`)** | ❌ Not yet | Live rooms already provide a dedicated chat column |
| **Mobile Web** | ❌ Not planned | Designed specifically for PC desktop widescreen layouts |

---

## 🛠️ Development Scripts

```bash
# Generate extension PNG icons from public/logo.svg via headless Chrome
pnpm icons

# Compile TypeScript and bundle assets into dist/
pnpm build

# Package extension zip for distribution (into release/)
pnpm zip

# Strict TypeScript type check
pnpm check

# Run end-to-end regression & layout tests using Playwright
pnpm test
```

---

## 🔒 Security & Privacy

- **No Remote Requests**: The extension does not initiate any external network connections.
- **No Account Tampering**: Does not read or transmit your cookies, credentials, or session tokens. All comments, likes, and replies are handled directly by your browser communicating with official Bilibili endpoints.
- **Zero Telemetry**: No Google Analytics, telemetry, or third-party trackers.

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE). Contributions, bug reports, and pull requests are welcome!
