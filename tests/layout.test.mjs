import assert from "node:assert/strict";
import { test } from "node:test";
import { chromium } from "playwright";
import { readFile } from "node:fs/promises";

test("manifest icons exist as PNGs at the declared sizes", async () => {
  const manifest = JSON.parse(await readFile("dist/manifest.json", "utf8"));
  for (const [size, path] of Object.entries(manifest.icons)) {
    assert.equal(manifest.action.default_icon[size], path);
    const png = await readFile(`dist/${path}`);
    assert.equal(png.subarray(1, 4).toString(), "PNG");
    assert.equal(png.readUInt32BE(16), Number(size));
    assert.equal(png.readUInt32BE(20), Number(size));
  }
});

test("native comments overlay, interaction, restore and replacement", async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROME_PATH ||
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    headless: true,
  });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.route("https://www.bilibili.com/**", (route) =>
      route.fulfill({ contentType: "text/html", body: "<!doctype html><html><body></body></html>" }));
    await page.goto("https://www.bilibili.com/video/BVtest");
    await page.setContent(`
      <style>
        body { margin: 0; }
        main { width: 1000px; margin: 80px auto; display: flex; gap: 20px; }
        article { width: 650px; }
        .right-container { width: 330px; height: 2400px; flex-shrink: 0; }
        #commentapp { margin-top: 700px; }
        span, a { font-size: 18px; }
        i#top { display: inline-block; height: 18px; }
      </style>
      <main><article><div id="commentapp">
        <textarea>draft reply</textarea><button>Reply</button>
        <div id="vote">Vote</div><div id="native-comments"></div>
        <bili-comments id="comments-host"></bili-comments>
        <span id="plain-text">Comment</span><i id="top">Top</i>
        <a id="plain-user" href="//space.bilibili.com/1">User</a>
        <a id="other-link" href="//www.bilibili.com">Other</a>
        <div style="height: 1800px">Native comments</div>
      </div><span id="after">After comments</span></article>
      <aside class="right-container">Recommendations</aside></main>
    `);
    await page.evaluate(() => {
      window.originalComment = document.querySelector("#commentapp");
      window.originalParent = window.originalComment.parentElement;
      window.replies = 0;
      document.querySelector("#native-comments").attachShadow({ mode: "open" })
        .innerHTML = '<style>span, a, i {font-size:18px} i#top {display:inline-block;height:18px}</style><div id="vote">Shadow vote</div><span id="shadow-text">Native content</span><a id="shadow-user" href="//space.bilibili.com/1">User</a><i id="top">Top</i>';
      window.originalComment.querySelector("button").addEventListener("click", () => {
        window.replies++;
      });
      class Header extends HTMLElement {
        constructor() {
          super();
          this.scrollContainer = null;
          this.commentboxInited = false;
          this.stuck = false;
          this.sources = [];
        }
        initCommentbox() {
          if (this.commentboxInited) return;
          this.commentboxInited = true;
          const handler = () => {
            this.sources.push(this.scrollContainer ? "container" : "window");
            this.stuck = this.scrollContainer
              ? this.scrollContainer.scrollTop > 100
              : window.scrollY > 100;
          };
          (this.scrollContainer || window).addEventListener("scroll", handler, { passive: true });
        }
      }
      class Comments extends HTMLElement {
        constructor() {
          super();
          this.scrollContainer = null;
          this.attachShadow({ mode: "open" })
            .append(document.createElement("bili-comments-header-renderer"));
        }
      }
      if (!customElements.get("bili-comments-header-renderer")) {
        customElements.define("bili-comments-header-renderer", Header);
      }
      if (!customElements.get("bili-comments")) customElements.define("bili-comments", Comments);
      document.querySelector("#comments-host").shadowRoot
        .querySelector("bili-comments-header-renderer").initCommentbox();
    });
    await page.addStyleTag({ path: "dist/content.css" });
    await page.addScriptTag({ path: "dist/content.js" });
    // Let the initial reconciliation run before asserting the untouched layout.
    await page.evaluate(() => new Promise((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(resolve))));
    assert.equal(await page.locator("#mySideComment").count(), 0);
    const toggle = page.locator("#side-comments-toggle");
    assert.equal((await toggle.boundingBox()).width, 44);
    assert.equal((await toggle.locator("img").boundingBox()).width, 32);
    assert.equal(await toggle.getAttribute("aria-pressed"), "false");
    assert.equal(await toggle.locator("img").evaluate((el) =>
      getComputedStyle(el).filter), "grayscale(1)");
    assert.equal(await toggle.locator("img").evaluate((el) =>
      el.complete && el.naturalWidth > 0), true);
    assert.equal(await page.evaluate(() =>
      window.originalComment.parentElement === window.originalParent), true);
    assert.equal(await page.locator(".right-container").evaluate((el) =>
      getComputedStyle(el).visibility), "visible");
    assert.equal(await page.locator("textarea").inputValue(), "draft reply");
    assert.equal(await page.locator("#commentapp #vote").count(), 2);
    assert.ok(await page.evaluate(() => document.documentElement.scrollHeight > innerHeight));
    await page.evaluate(() => window.scrollTo(0, 400));
    assert.equal(await page.evaluate(() => window.scrollY), 400);
    await toggle.click();
    await page.waitForFunction(() => window.scrollY === 0);
    assert.equal(await toggle.getAttribute("aria-pressed"), "true");
    assert.equal(await toggle.locator("img").evaluate((el) =>
      getComputedStyle(el).filter), "none");
    await page.waitForSelector("#mySideComment > #commentapp");
    const box = await page.locator("#mySideComment").boundingBox();
    assert.equal(box.y, 64);
    assert.equal(box.height, 836);
    assert.equal(box.x, 890);
    assert.equal(box.width, 550);
    const collapse = page.locator("#side-comments-collapse");
    const collapseBox = await collapse.boundingBox();
    assert.equal(collapseBox.x + collapseBox.width, box.x);
    assert.equal(await page.locator("#mySideComment").evaluate((el) =>
      getComputedStyle(el).padding), "0px 16px 0px 8px");
    assert.equal(await page.locator("#commentapp #vote").count(), 2);
    for (const id of ["plain-text", "plain-user", "shadow-text", "shadow-user"]) {
      assert.equal(await page.locator(`#${id}`).evaluate((el) =>
        getComputedStyle(el).fontSize), "13px");
    }
    assert.equal(await page.locator("#commentapp > #top").evaluate((el) =>
      getComputedStyle(el).height), "13px");
    assert.equal(await page.locator("#native-comments").evaluate((el) =>
      getComputedStyle(el.shadowRoot.querySelector("#top")).height), "13px");
    assert.equal(await page.locator("#other-link").evaluate((el) =>
      getComputedStyle(el).fontSize), "13px");
    assert.equal(await page.locator("#after").evaluate((el) =>
      getComputedStyle(el).fontSize), "18px");
    assert.equal(await page.evaluate(() => document.documentElement.scrollHeight), 900);
    await page.evaluate(() => {
      const vote = document.createElement("div");
      vote.id = "vote";
      document.querySelector("#native-comments").shadowRoot.append(vote);
      const host = document.createElement("div");
      host.id = "late-host";
      host.attachShadow({ mode: "open" }).innerHTML = '<span id="late-text">Reply</span>';
      document.querySelector("#native-comments").shadowRoot.append(host);
    });
    await page.waitForFunction(() =>
      getComputedStyle(document.querySelector("#native-comments").shadowRoot
        .querySelector("#late-host").shadowRoot.querySelector("#late-text")).fontSize === "13px");
    assert.equal(await page.locator("#commentapp #vote").count(), 3);
    assert.equal(await page.evaluate(() =>
      window.originalComment === document.querySelector("#commentapp") &&
      window.originalComment.parentElement.id === "mySideComment"), true);
    await page.locator("#commentapp button").click();
    assert.equal(await page.evaluate(() => window.replies), 1);
    assert.equal(await page.locator("textarea").inputValue(), "draft reply");
    await page.locator("#commentapp").evaluate((el) => { el.scrollTop = 300; });
    assert.equal(await page.evaluate(() => window.scrollY), 0);
    assert.equal(await page.locator("#commentapp").evaluate((el) => el.scrollTop), 300);
    assert.deepEqual(await page.evaluate(() => {
      const host = document.querySelector("#comments-host");
      const header = host.shadowRoot.querySelector("bili-comments-header-renderer");
      window.originalComment.scrollTop = 0;
      window.scrollTo(0, 500);
      const stuckAfterPageScroll = header.stuck;
      window.originalComment.scrollTop = 300;
      window.originalComment.dispatchEvent(new Event("scroll"));
      return {
        host: host.scrollContainer === window.originalComment,
        header: header.scrollContainer === window.originalComment,
        pageStuck: stuckAfterPageScroll,
        sideStuck: header.stuck,
        sawContainer: header.sources.includes("container"),
      };
    }), { host: true, header: true, pageStuck: false, sideStuck: true, sawContainer: true });

    await page.setViewportSize({ width: 1300, height: 720 });
    await page.waitForFunction(() =>
      document.querySelector("#mySideComment").getBoundingClientRect().x === 820);
    assert.equal((await page.locator("#mySideComment").boundingBox()).height, 656);

    await collapse.click();
    await page.waitForFunction(() => {
      const sidebar = document.querySelector("#mySideComment").getBoundingClientRect();
      const button = document.querySelector("#side-comments-collapse").getBoundingClientRect();
      return sidebar.x >= innerWidth - 1 && Math.abs(button.right - innerWidth) <= 1;
    });
    assert.equal(await toggle.getAttribute("aria-pressed"), "true");
    assert.equal(await collapse.getAttribute("aria-expanded"), "false");
    assert.equal(await page.locator(".right-container").evaluate((el) =>
      getComputedStyle(el).visibility), "visible");
    assert.equal(await page.evaluate(() =>
      window.originalComment.parentElement.id), "mySideComment");
    assert.equal(await page.locator("textarea").inputValue(), "draft reply");
    await collapse.hover();
    assert.equal(await collapse.evaluate((el) => getComputedStyle(el).outlineStyle), "none");
    assert.equal(await collapse.evaluate((el) => getComputedStyle(el).borderLeftWidth), "0px");
    await collapse.click();
    assert.equal(await collapse.getAttribute("aria-expanded"), "true");
    await page.waitForFunction(() =>
      document.querySelector("#mySideComment").getBoundingClientRect().x === 820);
    assert.equal(await page.locator("#commentapp").evaluate((el) => el.scrollTop), 300);
    assert.equal(await page.locator(".right-container").evaluate((el) =>
      getComputedStyle(el).visibility), "hidden");
    await toggle.click();
    assert.equal(await toggle.getAttribute("aria-pressed"), "false");
    assert.equal(await page.locator("#side-comments-collapse").count(), 0);
    assert.equal(await page.locator("#mySideComment").count(), 0);
    assert.equal(await page.locator("#commentapp #vote").count(), 3);
    for (const id of ["plain-text", "plain-user", "shadow-text", "shadow-user"]) {
      assert.equal(await page.locator(`#${id}`).evaluate((el) =>
        getComputedStyle(el).fontSize), "18px");
    }
    assert.equal(await page.locator("#commentapp > #top").evaluate((el) =>
      getComputedStyle(el).height), "18px");
    assert.equal(await page.locator("#native-comments").evaluate((el) =>
      getComputedStyle(el.shadowRoot.querySelector("#top")).height), "18px");
    assert.equal(await page.evaluate(() =>
      window.originalComment.parentElement === window.originalParent), true);
    assert.equal(await page.locator(".right-container").evaluate((el) =>
      getComputedStyle(el).visibility), "visible");
    assert.equal(await page.locator(".right-container").evaluate((el) =>
      el.getBoundingClientRect().height), 2400);
    assert.equal(await page.locator("textarea").inputValue(), "draft reply");
    assert.equal(await page.locator("#commentapp").evaluate((el) =>
      el.nextElementSibling.id), "after");

    await toggle.click();
    await page.evaluate(() => {
      const replacement = document.createElement("div");
      replacement.id = "commentapp";
      replacement.textContent = "Next video";
      document.querySelector("#commentapp").replaceWith(replacement);
    });
    await page.waitForSelector("#mySideComment > #commentapp");
    assert.equal(await page.locator("#commentapp").textContent(), "Next video");
    assert.equal(await page.evaluate(() =>
      window.originalComment.isConnected), false);
    await page.evaluate(() => history.pushState({}, "", "/"));
    await page.waitForFunction(() => !document.querySelector("#side-comments-toggle"));
    assert.equal(await page.locator("#mySideComment").count(), 0);
    assert.equal(await page.locator("#commentapp").evaluate((el) =>
      el.parentElement === window.originalParent), true);
    await page.evaluate(() => history.pushState({}, "", "/video/BVnext"));
    await toggle.waitFor();
    assert.equal(await toggle.getAttribute("aria-pressed"), "false");
    await toggle.click();
    await page.waitForSelector("#mySideComment");
    await page.evaluate(() => history.pushState({}, "", "/video/BVanother"));
    await page.waitForFunction(() =>
      document.querySelector("#side-comments-toggle")?.getAttribute("aria-pressed") === "false");
    assert.equal(await page.locator("#mySideComment").count(), 0);
    await toggle.click();
    await page.evaluate(() => document.querySelector(".right-container").remove());
    await page.waitForFunction(() =>
      !document.querySelector("#mySideComment"));
    assert.equal(await page.locator("#commentapp").evaluate((el) =>
      el.parentElement === window.originalParent && el.nextElementSibling.id === "after"), true);
  } finally {
    await browser.close();
  }
});
