declare const __SIDE_COMMENTS_LOGO__: string;

const COPY_ICON_SVG = '<svg class="side-comments-bvid-icon" viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="5" width="8.5" height="8.5" rx="1.5"/><path d="M11 2.5H4C3.17 2.5 2.5 3.17 2.5 4V11"/></svg>';
const CHECK_ICON_SVG = '<svg class="side-comments-bvid-icon" viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="3.5 8.5 6.5 11.5 12.5 5"/></svg>';

(() => {
  const coveredAttribute = "data-side-comments-covered";
  let enabled = false;
  let collapsed = false;
  let expandedScrollTop = 0;
  let comment: HTMLElement | null = null;
  let right: HTMLElement | null = null;
  let sidebar: HTMLDivElement | null = null;
  let placeholder: Comment | null = null;
  let frame = 0;
  let lastUrl = location.href;
  let routePath = location.pathname;
  let toggle: HTMLButtonElement | null = null;
  let bvidBadge: HTMLButtonElement | null = null;
  let copiedTimer: number | undefined;
  const commentStyles = new Map<ShadowRoot, HTMLStyleElement>();
  const reboundHeaders = new WeakSet<HTMLElement>();
  const commentObserver = new MutationObserver(() => {
    if (sidebar && comment) styleComments(comment);
  });

  type BiliHost = HTMLElement & {
    scrollContainer?: HTMLElement | null;
    commentboxInited?: boolean;
    commentBoxDisabledState?: unknown;
    commentBoxTeleportDisabled?: boolean;
    initCommentbox?: () => void;
    revertTeleportCommentbox?: (() => void) | null;
  };

  function bindCommentScroll(root: HTMLElement) {
    for (const host of Array.from(root.querySelectorAll<BiliHost>("bili-comments"))) {
      host.scrollContainer = root;
      const header = host.shadowRoot?.querySelector<BiliHost>("bili-comments-header-renderer");
      if (!header) continue;
      header.scrollContainer = root;
      if (reboundHeaders.has(header) || typeof header.initCommentbox !== "function" ||
        header.commentBoxTeleportDisabled || header.commentBoxDisabledState) continue;
      // Wait until Bilibili completes its own initialization, then bind this scroller.
      if (!header.commentboxInited) continue;
      header.commentboxInited = false;
      header.initCommentbox();
      reboundHeaders.add(header);
    }
  }

  function releaseCommentScroll(root: HTMLElement | null) {
    if (!root) return;
    for (const host of Array.from(root.querySelectorAll<BiliHost>("bili-comments"))) {
      const header = host.shadowRoot?.querySelector<BiliHost>("bili-comments-header-renderer");
      header?.revertTeleportCommentbox?.();
      if (header) header.scrollContainer = null;
      host.scrollContainer = null;
    }
  }

  function styleComments(root: HTMLElement | ShadowRoot) {
    for (const element of Array.from(root.querySelectorAll("*"))) {
      if (!element.shadowRoot) continue;
      const shadow = element.shadowRoot;
      if (!commentStyles.has(shadow)) {
        const style = document.createElement("style");
        style.textContent = 'span, a { font-size: 13px !important; } i#top { height: 13px !important; }';
        commentStyles.set(shadow, style);
        commentObserver.observe(shadow, { childList: true, subtree: true });
      }
      const style = commentStyles.get(shadow)!;
      if (style.parentNode !== shadow) shadow.append(style);
      styleComments(shadow);
    }
  }

  function restore(preserveComment = true) {
    releaseCommentScroll(sidebar?.querySelector<HTMLElement>("#commentapp") ?? comment);
    commentObserver.disconnect();
    for (const style of commentStyles.values()) style.remove();
    commentStyles.clear();
    const mountedComment = sidebar?.querySelector("#commentapp");
    if (preserveComment && mountedComment && placeholder?.isConnected) {
      placeholder.replaceWith(mountedComment);
    }
    placeholder?.remove();
    sidebar?.remove();
    placeholder = null;
    sidebar = null;
    right?.removeAttribute(coveredAttribute);
  }

  const resizeObserver = new ResizeObserver(schedule);

  function updateToggle() {
    if (!toggle?.isConnected) {
      toggle = document.createElement("button");
      toggle.id = "side-comments-toggle";
      toggle.type = "button";
      const logo = document.createElement("img");
      logo.src = `data:image/svg+xml,${encodeURIComponent(__SIDE_COMMENTS_LOGO__)}`;
      logo.alt = "";
      logo.draggable = false;
      toggle.append(logo);
      toggle.addEventListener("click", () => {
        enabled = !enabled;
        collapsed = false;
        if (enabled) window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        reconcile();
      });
      document.body.append(toggle);
    }
    toggle.setAttribute("aria-pressed", String(enabled));
    toggle.setAttribute("aria-label", enabled ? "关闭侧边评论" : "开启侧边评论");
    toggle.title = enabled ? "关闭侧边评论" : "开启侧边评论";
    toggle.hidden = !!document.fullscreenElement;
  }

  function getBvid(): string | null {
    const match = location.pathname.match(/\/(BV[0-9a-zA-Z]+)/i);
    if (!match) return null;
    const raw = match[1];
    return "BV" + raw.slice(2);
  }

  async function copyText(text: string): Promise<boolean> {
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch {
        // Fall through to textarea fallback
      }
    }
    try {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      textarea.style.pointerEvents = "none";
      textarea.style.left = "-9999px";
      document.body.append(textarea);
      textarea.focus();
      textarea.select();
      const ok = document.execCommand("copy");
      textarea.remove();
      return ok;
    } catch {
      return false;
    }
  }

  function renderBvBadgeNormal(badge: HTMLButtonElement, bvid: string) {
    badge.removeAttribute("data-copied");
    badge.title = `点击复制 BV号: ${bvid}`;
    badge.setAttribute("aria-label", `点击复制 BV号: ${bvid}`);
    badge.innerHTML = `${COPY_ICON_SVG}<span class="side-comments-bvid-text">${bvid}</span>`;
  }

  function removeBvBadge() {
    if (copiedTimer) {
      window.clearTimeout(copiedTimer);
      copiedTimer = undefined;
    }
    bvidBadge?.remove();
    bvidBadge = null;
  }

  function reconcileBvBadge() {
    if (!enabled) {
      removeBvBadge();
      return;
    }
    const bvid = getBvid();
    const targetH1 = document.querySelector<HTMLElement>(
      ".video-info-title-inner h1.video-title, .video-info-title-inner h1, h1.video-title, #viewbox_report h1"
    );
    if (!bvid || !targetH1) {
      removeBvBadge();
      return;
    }

    if (!bvidBadge) {
      bvidBadge = document.createElement("button");
      bvidBadge.id = "side-comments-bvid";
      bvidBadge.type = "button";
      bvidBadge.addEventListener("click", async (e) => {
        e.stopPropagation();
        e.preventDefault();
        const currentBvid = bvidBadge?.dataset.bvid;
        if (!currentBvid) return;
        const ok = await copyText(currentBvid);
        if (!ok || !bvidBadge?.isConnected) return;
        if (copiedTimer) window.clearTimeout(copiedTimer);
        bvidBadge.setAttribute("data-copied", "true");
        bvidBadge.title = `已复制 BV号: ${currentBvid}`;
        bvidBadge.setAttribute("aria-label", `已复制 BV号: ${currentBvid}`);
        bvidBadge.innerHTML = `${CHECK_ICON_SVG}<span class="side-comments-bvid-text">已复制</span>`;
        copiedTimer = window.setTimeout(() => {
          if (!bvidBadge?.isConnected) return;
          renderBvBadgeNormal(bvidBadge, currentBvid);
        }, 1500);
      });
    }

    if (bvidBadge.dataset.bvid !== bvid) {
      if (copiedTimer) {
        window.clearTimeout(copiedTimer);
        copiedTimer = undefined;
      }
      bvidBadge.dataset.bvid = bvid;
      renderBvBadgeNormal(bvidBadge, bvid);
    }

    if (targetH1.nextElementSibling !== bvidBadge) {
      targetH1.after(bvidBadge);
    }
  }

  function reconcile() {
    frame = 0;
    if (routePath !== location.pathname) {
      routePath = location.pathname;
      enabled = false;
      collapsed = false;
      restore();
    }
    if (location.origin !== "https://www.bilibili.com" ||
      !location.pathname.startsWith("/video/")) {
      enabled = false;
      restore();
      resizeObserver.disconnect();
      comment = null;
      right = null;
      toggle?.remove();
      toggle = null;
      removeBvBadge();
      return;
    }
    updateToggle();
    reconcileBvBadge();
    // Discard a sidebar belonging to a page whose original comment location was removed.
    if (sidebar && !placeholder?.isConnected) restore();
    const candidates = Array.from(document.querySelectorAll<HTMLElement>("#commentapp"));
    const nextComment = candidates.find((node) => !sidebar?.contains(node)) ??
      candidates[0] ?? null;
    const nextRight = document.querySelector<HTMLElement>(".right-container");
    if (nextComment !== comment || nextRight !== right) {
      restore(nextComment === comment || !nextComment || !!sidebar?.contains(nextComment));
      resizeObserver.disconnect();
      comment = nextComment;
      right = nextRight;
      if (right) resizeObserver.observe(right);
    }

    if (!enabled || !comment || !right || document.fullscreenElement) {
      restore();
      return;
    }

    const bounds = right.getBoundingClientRect();
    const left = Math.max(0, bounds.left);
    const width = document.documentElement.clientWidth - left;
    if (bounds.width <= 0 || width <= 0) {
      restore();
      return;
    }

    if (!sidebar) {
      placeholder = document.createComment("side-comments-original-position");
      comment.before(placeholder);
      sidebar = document.createElement("div");
      sidebar.id = "mySideComment";
      const collapse = document.createElement("button");
      collapse.id = "side-comments-collapse";
      collapse.type = "button";
      collapse.setAttribute("aria-controls", "mySideComment");
      collapse.addEventListener("click", () => {
        if (!collapsed) expandedScrollTop = comment?.scrollTop ?? 0;
        collapsed = !collapsed;
        reconcile();
      });
      sidebar.append(collapse);
      document.body.append(sidebar);
      sidebar.append(comment);
    }
    const leftValue = `${left}px`;
    if (sidebar.style.getPropertyValue("--side-comments-left") !== leftValue) {
      sidebar.style.setProperty("--side-comments-left", leftValue);
    }
    const widthValue = `${width}px`;
    if (sidebar.style.getPropertyValue("--side-comments-width") !== widthValue) {
      sidebar.style.setProperty("--side-comments-width", widthValue);
    }
    sidebar.toggleAttribute("data-collapsed", collapsed);
    const collapse = sidebar.querySelector<HTMLButtonElement>("#side-comments-collapse")!;
    collapse.title = collapsed ? "展开评论" : "收起评论，显示原右栏";
    collapse.setAttribute("aria-label", collapse.title);
    collapse.setAttribute("aria-expanded", String(!collapsed));
    const arrow = collapsed ? "\u2039" : "\u203a";
    if (collapse.textContent !== arrow) collapse.textContent = arrow;
    right.toggleAttribute(coveredAttribute, !collapsed);
    styleComments(comment);
    bindCommentScroll(comment);
  }

  function schedule() {
    if (!frame) frame = requestAnimationFrame(reconcile);
  }

  const observer = new MutationObserver((records) => {
    if (records.some((record) => {
      if (record.target === bvidBadge || bvidBadge?.contains(record.target as Node)) return false;
      return record.type === "childList" ||
        (record.target !== sidebar && record.target !== comment && record.target !== right);
    })) schedule();
  });
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["class", "style"],
  });
  window.addEventListener("resize", schedule);
  window.addEventListener("scroll", schedule, { passive: true });
  document.addEventListener("fullscreenchange", schedule);
  window.addEventListener("popstate", schedule);

  // SPA navigation can change the URL without a popstate event.
  window.setInterval(() => {
    if (lastUrl !== location.href) {
      lastUrl = location.href;
      schedule();
    }
  }, 500);

  schedule();
})();
