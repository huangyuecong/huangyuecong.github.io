/* Static-page navigation keeps one document and one music player alive. */
(() => {
  'use strict';

  if (window.YuecongNavigation || !/^https?:$/.test(location.protocol)) return;

  const scriptURL = document.currentScript?.src;
  const siteRoot = scriptURL ? new URL('../', scriptURL) : new URL('./', location.href);
  const pages = new Set(['index.html', 'about.html', 'projects.html', 'project.html', 'notes.html', 'contact.html']);
  const historyKey = '__yuecongNavigation';
  const snapshots = new Map();
  const pageCache = new Map();
  let currentURL = new URL(location.href);
  let currentKey = makeKey();
  let activeRequest = null;
  let requestNumber = 0;
  let snapshotFrame = 0;
  let toastTimer = 0;
  let restoring = false;

  function makeKey() {
    return `page-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
  }

  function isPageURL(url) {
    if (url.origin !== siteRoot.origin || !url.pathname.startsWith(siteRoot.pathname)) return false;
    const filename = url.pathname.slice(siteRoot.pathname.length) || 'index.html';
    return pages.has(filename);
  }

  function sameDocument(a, b) {
    return a.pathname === b.pathname && a.search === b.search;
  }

  function stateObject() {
    return history.state && typeof history.state === 'object' && !Array.isArray(history.state) ? history.state : {};
  }

  function capture() {
    const pageState = window.Yuecong?.capturePageState?.();
    const inputs = pageState?.inputs || {};
    if (!pageState) document.querySelectorAll('#projectSearch, #noteSearch').forEach(input => { inputs[input.id] = input.value; });
    return {
      key: currentKey,
      url: currentURL.href,
      scroll: { x: window.scrollX, y: window.scrollY, sidebar: document.querySelector('.sidebar-inner')?.scrollTop || 0 },
      inputs,
      filter: pageState?.filter || document.querySelector('#projectFilters [data-filter].active')?.dataset.filter || null
    };
  }

  function saveCurrent(writeHistory = true) {
    const snapshot = capture();
    snapshots.set(currentKey, snapshot);
    if (writeHistory && location.href === currentURL.href) {
      try { history.replaceState({ ...stateObject(), [historyKey]: snapshot }, '', location.href); } catch { /* Navigation still works without stored form state. */ }
    }
    return snapshot;
  }

  function queueSnapshot() {
    if (restoring || snapshotFrame) return;
    snapshotFrame = requestAnimationFrame(() => { snapshotFrame = 0; saveCurrent(); });
  }

  function writeEntry(url, mode, snapshot) {
    currentURL = new URL(url.href);
    currentKey = snapshot?.key || makeKey();
    const entry = snapshot || { key: currentKey, url: url.href, scroll: { x: 0, y: 0, sidebar: 0 }, inputs: {}, filter: null };
    snapshots.set(currentKey, entry);
    if (mode === 'push') history.pushState({ [historyKey]: entry }, '', url.href);
    else history.replaceState({ ...stateObject(), [historyKey]: entry }, '', url.href);
  }

  function setBusy(busy) {
    if (busy) {
      document.documentElement.dataset.navigation = 'loading';
      document.querySelector('main')?.setAttribute('aria-busy', 'true');
    } else {
      delete document.documentElement.dataset.navigation;
      document.querySelector('main')?.removeAttribute('aria-busy');
    }
  }

  function updateHead(next) {
    document.title = next.title;
    const selector = 'meta[name="description"], meta[name="keywords"], meta[property^="og:"], meta[name^="twitter:"], link[rel="canonical"]';
    document.head.querySelectorAll(selector).forEach(node => node.remove());
    next.head.querySelectorAll(selector).forEach(node => document.head.append(document.importNode(node, true)));
  }

  function replaceBody(next) {
    const dock = document.getElementById('siteMusicDock');
    dock?.remove();
    const body = document.body;
    [...body.attributes].forEach(attribute => body.removeAttribute(attribute.name));
    [...next.body.attributes].forEach(attribute => {
      if (!attribute.name.startsWith('on')) body.setAttribute(attribute.name, attribute.value);
    });
    // Scripts are loaded once in the original document; mounting initializes each new page.
    next.body.querySelectorAll('script').forEach(script => script.remove());
    body.replaceChildren(...[...next.body.childNodes].map(node => document.importNode(node, true)));
    return dock;
  }

  function restoreInputs(snapshot) {
    if (!snapshot) return;
    if (typeof window.Yuecong?.restorePageState === 'function') {
      window.Yuecong.restorePageState(snapshot);
      return;
    }
    if (snapshot.filter) {
      const filter = [...document.querySelectorAll('#projectFilters [data-filter]')].find(button => button.dataset.filter === snapshot.filter);
      filter?.click();
    }
    Object.entries(snapshot.inputs || {}).forEach(([id, value]) => {
      const input = document.getElementById(id);
      if (!input || !['projectSearch', 'noteSearch'].includes(id)) return;
      input.value = value;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
  }

  function hashTarget(url) {
    if (!url.hash || url.hash === '#') return null;
    let id;
    try { id = decodeURIComponent(url.hash.slice(1)); } catch { return null; }
    return document.getElementById(id) || [...document.getElementsByName(id)].find(node => node instanceof HTMLElement) || null;
  }

  function focusElement(element) {
    if (!(element instanceof HTMLElement)) return;
    const originalTabindex = element.getAttribute('tabindex');
    if (originalTabindex === null) element.setAttribute('tabindex', '-1');
    element.focus({ preventScroll: true });
    if (originalTabindex === null) element.addEventListener('blur', () => element.removeAttribute('tabindex'), { once: true });
  }

  function restorePosition(url, snapshot, focus) {
    const anchor = hashTarget(url);
    const scrollStyle = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto';
    try {
      if (snapshot?.scroll) window.scrollTo({ left: snapshot.scroll.x || 0, top: snapshot.scroll.y || 0, behavior: 'instant' });
      else if (anchor) anchor.scrollIntoView({ block: 'start', behavior: 'instant' });
      else window.scrollTo({ left: 0, top: 0, behavior: 'instant' });
      const sidebar = document.querySelector('.sidebar-inner');
      if (sidebar) sidebar.scrollTop = snapshot?.scroll?.sidebar || 0;
      if (focus) focusElement(anchor || document.querySelector('.story-header h1, .page-intro h1, .page-intro h2, .hero-copy h2, main h1, main h2, main'));
    } finally {
      document.documentElement.style.scrollBehavior = scrollStyle;
    }
  }

  function announcePage() {
    let status = document.getElementById('siteNavigationStatus');
    if (!status) {
      status = document.createElement('div');
      status.id = 'siteNavigationStatus';
      status.className = 'sr-only';
      status.setAttribute('role', 'status');
      status.setAttribute('aria-live', 'polite');
      document.body.append(status);
    }
    status.textContent = document.title;
  }

  function fallback(url, mode) {
    const english = document.documentElement.lang.toLowerCase().startsWith('en');
    let toast = document.getElementById('toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      toast.className = 'toast';
      toast.setAttribute('role', 'status');
      document.body.append(toast);
    }
    toast.textContent = english ? 'Opening this page directly…' : '正在重新打开页面…';
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      if (mode === 'replace' || mode === 'none') location.replace(url.href);
      else location.assign(url.href);
    }, 180);
  }

  async function loadPage(url, signal) {
    let html = pageCache.get(url.pathname);
    if (!html) {
      const response = await fetch(new URL(url.pathname + url.search, url.origin), { signal, credentials: 'same-origin', headers: { Accept: 'text/html' }, cache: 'no-cache' });
      if (!response.ok || !response.headers.get('content-type')?.includes('text/html') || !isPageURL(new URL(response.url))) throw new Error('Page unavailable');
      html = await response.text();
      pageCache.set(url.pathname, html);
    }
    const next = new DOMParser().parseFromString(html, 'text/html');
    if (!next.body?.dataset.page || !next.querySelector('main') || !next.title) throw new Error('Invalid page');
    return next;
  }

  async function navigate(value, options = {}) {
    let url;
    try { url = new URL(value, location.href); } catch { return false; }
    if (!isPageURL(url)) return false;
    const mode = options.history || (options.replace ? 'replace' : 'push');
    const source = options.source || 'navigation';
    const snapshot = options.snapshot || null;
    clearTimeout(toastTimer);
    activeRequest?.abort();
    const controller = new AbortController();
    activeRequest = controller;
    const request = ++requestNumber;
    if (snapshotFrame) { cancelAnimationFrame(snapshotFrame); snapshotFrame = 0; }
    saveCurrent(mode !== 'none');

    if (sameDocument(currentURL, url)) {
      const entryMode = mode === 'none' || url.href === currentURL.href ? 'replace' : mode;
      writeEntry(url, entryMode, snapshot || (url.href === currentURL.href ? capture() : null));
      restoring = true;
      restoreInputs(snapshot);
      restorePosition(url, snapshot, source !== 'popstate');
      document.body.classList.remove('sidebar-open');
      restoring = false;
      setBusy(false);
      activeRequest = null;
      saveCurrent();
      return true;
    }

    setBusy(true);
    let persistentDock = null;
    let dockHome = null;
    let committed = false;
    const timeout = window.setTimeout(() => controller.abort('timeout'), 12000);
    try {
      const next = await loadPage(url, controller.signal);
      if (request !== requestNumber || controller.signal.aborted) return false;
      document.dispatchEvent(new CustomEvent('site:page-before-render', { detail: { url: url.href, source } }));
      writeEntry(url, mode === 'none' ? 'replace' : mode, snapshot);
      committed = true;
      updateHead(next);
      persistentDock = document.getElementById('siteMusicDock');
      dockHome = persistentDock?.parentElement;
      persistentDock = replaceBody(next);
      document.querySelector('main')?.setAttribute('aria-busy', 'true');
      restoring = true;
      if (typeof window.Yuecong?.mountPage !== 'function') throw new Error('Page initializer unavailable');
      await window.Yuecong.mountPage({ url: url.href, source, state: snapshot });
      if (request !== requestNumber) return false;
      if (persistentDock) {
        const host = document.querySelector('.sidebar-bottom, .story-toc');
        if (host && !persistentDock.isConnected) host.prepend(persistentDock);
      }
      window.YuecongMusic?.mount?.();
      restoreInputs(snapshot);
      document.dispatchEvent(new CustomEvent('site:page-render', { detail: { url: url.href, source, state: snapshot } }));
      // Restore synchronously before another click/Back can snapshot this entry.
      restorePosition(url, snapshot, source !== 'popstate');
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      if (request !== requestNumber) return false;
      restorePosition(url, snapshot, source !== 'popstate');
      announcePage();
      restoring = false;
      saveCurrent();
      return true;
    } catch (error) {
      if (request !== requestNumber || (controller.signal.aborted && controller.signal.reason !== 'timeout')) return false;
      // A detached player keeps playing; reconnect its controls while a full-page fallback starts.
      if (persistentDock && !persistentDock.isConnected) {
        (document.querySelector('.sidebar-bottom, .story-toc') || (dockHome?.isConnected ? dockHome : document.body)).prepend(persistentDock);
      }
      fallback(url, committed ? 'replace' : mode);
      return false;
    } finally {
      clearTimeout(timeout);
      if (request === requestNumber) {
        restoring = false;
        activeRequest = null;
        setBusy(false);
      }
    }
  }

  document.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const anchor = event.target instanceof Element ? event.target.closest('a[href]') : null;
    if (!anchor || anchor.hasAttribute('download') || (anchor.target && anchor.target.toLowerCase() !== '_self') || anchor.closest('[data-no-pjax]') || anchor.relList.contains('external')) return;
    const href = anchor.getAttribute('href')?.trim();
    if (!href || href === '#' || /^(mailto:|tel:|javascript:|data:)/i.test(href)) return;
    let url;
    try { url = new URL(anchor.href); } catch { return; }
    if (!isPageURL(url)) return;
    event.preventDefault();
    void navigate(url.href, { source: sameDocument(currentURL, url) ? 'anchor' : 'navigation' });
  });

  window.addEventListener('popstate', event => {
    const url = new URL(location.href);
    if (!isPageURL(url)) { location.reload(); return; }
    const stored = event.state?.[historyKey];
    const snapshot = stored?.key ? snapshots.get(stored.key) || stored : null;
    void navigate(url.href, { history: 'none', source: 'popstate', snapshot });
  });

  window.addEventListener('scroll', queueSnapshot, { passive: true });
  document.addEventListener('input', event => { if (event.target.matches?.('#projectSearch, #noteSearch')) queueSnapshot(); });
  document.addEventListener('click', event => { if (event.target.closest?.('#projectFilters [data-filter]')) queueSnapshot(); });
  window.addEventListener('pagehide', () => saveCurrent());
  window.addEventListener('pageshow', event => {
    if (!event.persisted) return;
    currentURL = new URL(location.href);
    currentKey = history.state?.[historyKey]?.key || currentKey;
    setBusy(false);
  });

  const initial = history.state?.[historyKey];
  if (initial?.key && initial.url === location.href) currentKey = initial.key;
  try { history.scrollRestoration = 'manual'; } catch { /* Optional in older browsers. */ }
  saveCurrent();
  window.YuecongNavigation = { navigate, saveState: () => saveCurrent() };
})();
