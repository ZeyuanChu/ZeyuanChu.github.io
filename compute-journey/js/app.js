/* ========================================================================
   算力之旅 · 应用核心 V2：路由、状态、渲染调度、localStorage、地铁线、
   讲解模式、进度、命令面板(⌘K)、设置面板、toast、无障碍。
   单向渲染：hash 变化 → 解析 → 更新状态 → render()。
   ======================================================================== */
(function () {
  "use strict";

  const DATA = window.DATA;
  const stations = DATA.stations;
  const N = stations.length; // 10

  /* ------------------------------ 状态 ------------------------------ */
  const App = {
    state: { route: "home", stationId: null, drawerPath: [], advanced: false, presenter: false },
    renderedStationId: null,
    stageController: null
  };
  window.App = App;

  /* --------------------------- localStorage --------------------------- */
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
    del(k) { try { localStorage.removeItem(k); } catch (e) {} },
    visited(id) { return this.get("visited:" + id) === "1"; },
    markVisited(id) { this.set("visited:" + id, "1"); },
    badged(id) { return this.get("badge:" + id) === "1"; },
    markBadge(id) { this.set("badge:" + id, "1"); },
    badgeCount() { return stations.filter(s => this.badged(s.id)).length; },
    presenter() { return this.get("presenter") === "1"; },
    setPresenter(on) { this.set("presenter", on ? "1" : "0"); },
    /* 进度：已读节点 */
    read(sid, nid) { return this.get("progress:" + sid + "/" + nid) === "1"; },
    markRead(sid, nid) { this.set("progress:" + sid + "/" + nid, "1"); },
    stationProgress(station) {
      const tops = station.nodes.length;
      const done = station.nodes.filter(n => this.read(station.id, n.id)).length;
      return { done, total: tops, frac: tops ? done / tops : 0 };
    },
    /* 设置 */
    theme() { return this.get("settings:theme") || "dark"; },
    setTheme(v) { this.set("settings:theme", v); },
    motion() { return this.get("settings:motion") || "full"; },
    setMotion(v) { this.set("settings:motion", v); },
    quality() { return this.get("settings:quality") === "low" ? "low" : "high"; },
    setQuality(v) { this.set("settings:quality", v === "low" ? "low" : "high"); },
    fontsize() { return this.get("settings:fontsize") || "normal"; },
    setFontsize(v) { this.set("settings:fontsize", v); },
    depth() { return this.get("settings:depth") || ""; },
    setDepth(v) { this.set("settings:depth", v); },
    role() { return this.get("role") || ""; },
    setRole(v) { this.set("role", v); },
    resume() { return this.get("resume") || ""; },
    setResume(v) { this.set("resume", v); },
    tourDone() { return this.get("tour:done") === "1"; },
    setTourDone() { this.set("tour:done", "1"); }
  };
  App.store = store;

  App.reducedMotion = function () {
    if (store.motion() === "reduce") return true;
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  };
  App.lowQuality = function () { return store.quality() === "low"; };

  /* ------------------------------ 查找 ------------------------------ */
  function findStation(id) { return stations.find(s => s.id === id) || null; }
  App.findStation = findStation;

  function resolvePath(station, ids) {
    const chain = [];
    let level = station.nodes;
    for (const id of ids) {
      if (!level) break;
      const node = level.find(n => n.id === id);
      if (!node) break;
      chain.push(node);
      level = node.children;
    }
    return chain;
  }
  App.resolvePath = resolvePath;

  // 进阶层解析：始终以一个合成的“进阶”根开头，其 children = advanced.nodes
  function resolveAdvanced(station, ids) {
    if (!station.advanced) return [];
    const root = {
      id: "__adv", name: station.advanced.title, brief: "进阶 · 内行想深挖再点",
      plain: "这一层收着更硬核、会随硬件与模型换代更新的内容——主线够用就先跳过，想深挖的内行再逐项点开。",
      children: station.advanced.nodes, __adv: true
    };
    const chain = [root];
    let level = station.advanced.nodes;
    for (const id of ids) {
      if (!level) break;
      const n = level.find(x => x.id === id);
      if (!n) break;
      chain.push(n);
      level = n.children;
    }
    return chain;
  }
  App.resolveAdvanced = resolveAdvanced;

  const LAYER_NODES = { model: { training: 1, inference: 1 } };
  function crumbLabel(station, node, depth) {
    if (node.__adv) return "进阶";
    if (depth === 0 && LAYER_NODES[station.id] && LAYER_NODES[station.id][node.id]) return node.name + "层";
    return node.name;
  }
  App.crumbLabel = crumbLabel;

  /* ------------------------------ 主题色 ------------------------------ */
  function setAccent(color) {
    document.documentElement.style.setProperty("--accent", color || "var(--blue)");
  }

  /* ------------------------------ 路由 ------------------------------ */
  const KNOWN = { glossary: 1, scenarios: 1, graph: 1, cost: 1, atlas: 1, labs: 1 };
  function parseHash() {
    let h = location.hash.replace(/^#/, "");
    if (!h || h === "/") return { route: "home" };
    const parts = h.split("/").filter(Boolean);
    if (KNOWN[parts[0]] && parts.length === 1) return { route: parts[0] };
    if (parts[0] === "lab") return parts[1] ? { route: "lab", labId: parts[1] } : { route: "labs" };
    if (parts[0] === "s" && parts[1]) {
      if (!findStation(parts[1])) return { route: "notfound" };
      return { route: "station", stationId: parts[1], drawerPath: parts.slice(2) };
    }
    return { route: "notfound" };
  }

  function go(hash) {
    if (location.hash === hash) render();
    else location.hash = hash;
  }
  App.go = go;

  function openNode(stationId, pathIds) {
    const suffix = pathIds && pathIds.length ? "/" + pathIds.join("/") : "";
    go("#/s/" + stationId + suffix);
  }
  App.openNode = openNode;

  function closeDrawer() {
    if (App.state.route === "station" && App.state.stationId) go("#/s/" + App.state.stationId);
  }
  App.closeDrawer = closeDrawer;

  /* ------------------------------ 渲染 ------------------------------ */
  const appEl = document.getElementById("app");
  const drawerEl = document.getElementById("drawer");
  const drawerInner = document.getElementById("drawerInner");

  function cleanupStageController() {
    const controller = App.stageController;
    App.stageController = null;
    if (controller && typeof controller.cleanup === "function") controller.cleanup();
  }

  function redrawCurrentStation() {
    if (App.state.route !== "station" || !App.state.stationId) return;
    cleanupStageController();
    App.renderedStationId = null;
    render();
  }

  function simplePage(route) {
    cleanupStageController();
    App.state.stationId = null; App.state.drawerPath = []; App.state.advanced = false;
    App.renderedStationId = null;
    setAccent("var(--blue)");
    syncDrawer();
    appEl.innerHTML = "";
    if (route === "home") appEl.appendChild(Components.buildHome());
    else if (route === "glossary") appEl.appendChild(Components.buildGlossary());
    else if (route === "scenarios") appEl.appendChild(Components.buildScenarios());
    else if (route === "graph") appEl.appendChild(Components.buildGraph());
    else if (route === "cost") appEl.appendChild(Components.buildCost());
    else if (route === "atlas") appEl.appendChild(LabsUI.buildAtlas());
    else if (route === "labs") appEl.appendChild(LabsUI.buildLabsIndex());
    else if (route === "lab") appEl.appendChild(LabsUI.buildLab(App.state.labId));
    else appEl.appendChild(Components.buildNotFound());
    window.scrollTo(0, 0);
  }

  function render() {
    hideTooltip();
    const parsed = parseHash();
    App.state.route = parsed.route;
    App.state.labId = parsed.labId || null;

    if (parsed.route !== "station") {
      simplePage(parsed.route);
    } else {
      const station = findStation(parsed.stationId);
      App.state.stationId = station.id;

      const raw = parsed.drawerPath || [];
      const advanced = raw[0] === "adv";
      const chain = advanced ? resolveAdvanced(station, raw.slice(1)) : resolvePath(station, raw);
      App.state.advanced = advanced;
      App.state.drawerPath = advanced ? ["adv"].concat(chain.slice(1).map(n => n.id)) : chain.map(n => n.id);

      setAccent(station.color);

      if (App.renderedStationId !== station.id) {
        cleanupStageController();
        store.markVisited(station.id);
        App.renderedStationId = station.id;
        appEl.innerHTML = "";
        const page = Components.buildStationPage(station);
        appEl.appendChild(page);
        const stageMount = page.querySelector(".station-stage");
        App.stageController = Stages.renderStage(station, stageMount) || null;
        Components.wireLinking(page);
        window.scrollTo(0, 0);
      }
      syncDrawer();
      if (App.stageController && typeof App.stageController.syncDrawer === "function") {
        App.stageController.syncDrawer(App.state.drawerPath.slice());
      }
      store.setResume(location.hash);
    }

    updateMetro();
    updateBadgeCount();
    updateGlossaryBtn();
  }
  App.render = render;

  function syncDrawer() {
    const path = App.state.drawerPath;
    if (App.state.route === "station" && path.length > 0) {
      const station = findStation(App.state.stationId);
      const advanced = App.state.advanced;
      const chain = advanced ? resolveAdvanced(station, path.slice(1)) : resolvePath(station, path);
      // 记录已读（真实节点，最后一层）
      const last = chain[chain.length - 1];
      if (!advanced && last && last.id) { store.markRead(station.id, chain[0].id); refreshProgressUI(); }
      drawerInner.innerHTML = "";
      drawerInner.appendChild(Components.buildCard(station, chain, { advanced: advanced }));
      drawerEl.classList.add("open");
      drawerEl.setAttribute("aria-hidden", "false");
      drawerEl.scrollTop = 0;
    } else {
      drawerEl.classList.remove("open");
      drawerEl.setAttribute("aria-hidden", "true");
    }
  }
  App.syncDrawer = syncDrawer;

  // 打开某节点后，刷新首页/站点页的完成度环（若可见）
  function refreshProgressUI() {
    if (App.state.route !== "station") return;
    const station = findStation(App.state.stationId);
    const ring = appEl.querySelector(".station-left .progress-ring");
    if (ring && station) Components.updateRing(ring, store.stationProgress(station).frac);
    // 左栏行“读过”勾选
    appEl.querySelectorAll(".part-row[data-node]").forEach(row => {
      if (store.read(station.id, row.dataset.node)) row.classList.add("read");
    });
  }
  App.refreshProgressUI = refreshProgressUI;

  /* --------------------------- 部件联动高亮 --------------------------- */
  App.setHighlight = function (nodeId, on) {
    appEl.querySelectorAll('[data-node="' + cssEscape(nodeId) + '"]').forEach(el => el.classList.toggle("hl", on));
  };
  function cssEscape(s) { return String(s).replace(/["\\]/g, "\\$&"); }
  App.cssEscape = cssEscape;

  /* ------------------------------ 徽章 ------------------------------ */
  App.earnBadge = function (stationId) {
    if (store.badged(stationId)) return;
    store.markBadge(stationId);
    updateMetro();
    updateBadgeCount();
    Components.animateBadge(stationId);
    announce("恭喜，获得本站徽章");
  };

  /* --------------------------- 地铁线导航 --------------------------- */
  const metroEl = document.getElementById("metro");
  const metroSelect = document.getElementById("metroSelect");
  const metroSelectBtn = document.getElementById("metroSelectBtn");
  const metroSelectLabel = document.getElementById("metroSelectLabel");
  const metroSelectMenu = document.getElementById("metroSelectMenu");

  function buildMetro() {
    const track = document.createElement("div");
    track.className = "metro-track";
    stations.forEach((s, i) => {
      if (i > 0) { const link = document.createElement("span"); link.className = "metro-link"; track.appendChild(link); }
      const stop = document.createElement("button");
      stop.className = "metro-stop";
      stop.dataset.stationId = s.id;
      stop.style.setProperty("--stop-color", s.color);
      stop.setAttribute("aria-label", "第 " + s.num + " 站 " + s.name);
      stop.innerHTML = '<span class="metro-dot"></span>';
      stop.addEventListener("click", () => go("#/s/" + s.id));
      stop.addEventListener("mouseenter", e => showTooltip(e.currentTarget, "第 " + s.num + " 站 · " + s.name, s.color));
      stop.addEventListener("mouseleave", hideTooltip);
      stop.addEventListener("focus", e => showTooltip(e.currentTarget, "第 " + s.num + " 站 · " + s.name, s.color));
      stop.addEventListener("blur", hideTooltip);
      track.appendChild(stop);
    });
    metroEl.innerHTML = "";
    metroEl.appendChild(track);

    const homeLi = document.createElement("li");
    homeLi.setAttribute("role", "option");
    homeLi.innerHTML = '<span class="num-dot" style="background:var(--blue)"></span>首页';
    homeLi.addEventListener("click", () => { go("#/"); closeMetroMenu(); });
    metroSelectMenu.appendChild(homeLi);
    stations.forEach(s => {
      const li = document.createElement("li");
      li.setAttribute("role", "option");
      li.dataset.stationId = s.id;
      li.innerHTML = '<span class="num-dot" style="background:' + s.color + '"></span>第 ' + s.num + " 站 · " + s.name;
      li.addEventListener("click", () => { go("#/s/" + s.id); closeMetroMenu(); });
      metroSelectMenu.appendChild(li);
    });
  }

  function updateMetro() {
    metroEl.querySelectorAll(".metro-stop").forEach(stop => {
      const id = stop.dataset.stationId;
      stop.classList.toggle("visited", store.visited(id));
      stop.classList.toggle("current", App.state.stationId === id);
      stop.classList.toggle("badged", store.badged(id));
    });
    const kids = Array.from(metroEl.querySelectorAll(".metro-track > *"));
    kids.forEach((el, i) => {
      if (el.classList.contains("metro-link")) {
        const prev = kids[i - 1];
        el.classList.toggle("filled", prev && prev.classList.contains("visited"));
      }
    });
    if (App.state.route === "station") {
      const s = findStation(App.state.stationId);
      metroSelectLabel.textContent = "第 " + s.num + " 站 · " + s.name;
    } else {
      const map = { glossary: "术语表", scenarios: "场景库", graph: "知识图谱", atlas: "图谱 Atlas", labs: "实验室", lab: "实验室", cost: "成本估算", notfound: "走岔了" };
      metroSelectLabel.textContent = map[App.state.route] || "首页";
    }
  }

  function openMetroMenu() { metroSelectMenu.hidden = false; metroSelectBtn.setAttribute("aria-expanded", "true"); }
  function closeMetroMenu() { metroSelectMenu.hidden = true; metroSelectBtn.setAttribute("aria-expanded", "false"); }
  metroSelectBtn.addEventListener("click", () => { if (metroSelectMenu.hidden) openMetroMenu(); else closeMetroMenu(); });
  document.addEventListener("click", e => { if (!metroSelect.contains(e.target)) closeMetroMenu(); });

  /* ------------------------------ 徽章计数 ------------------------------ */
  const badgeCountBtn = document.getElementById("badgeCount");
  const badgeCountText = document.getElementById("badgeCountText");
  function updateBadgeCount() {
    const n = store.badgeCount();
    badgeCountText.textContent = n + "/" + N;
    badgeCountBtn.classList.toggle("complete", n === N);
  }
  badgeCountBtn.addEventListener("click", () => { if (store.badgeCount() === N) Components.showCertificate(); });

  /* ------------------------------ 术语表按钮 ------------------------------ */
  const glossaryBtn = document.getElementById("glossaryBtn");
  function updateGlossaryBtn() { glossaryBtn.classList.toggle("active", App.state.route === "glossary"); }

  /* ------------------------------ 讲解模式 ------------------------------ */
  const presenterToggle = document.getElementById("presenterToggle");
  function applyPresenter(on) {
    document.body.classList.toggle("presenter", on);
    presenterToggle.checked = on;
    App.state.presenter = on;
  }
  App.applyPresenter = applyPresenter;
  presenterToggle.addEventListener("change", e => { store.setPresenter(e.target.checked); applyPresenter(e.target.checked); });

  /* ------------------------------ 设置应用 ------------------------------ */
  function applyTheme(v) {
    const root = document.documentElement;
    if (v === "light") root.setAttribute("data-theme", "light");
    else if (v === "dark") root.setAttribute("data-theme", "dark");
    else root.removeAttribute("data-theme"); // system → 跟随
  }
  function applyMotion(v) { document.documentElement.setAttribute("data-motion", v === "reduce" ? "reduce" : "full"); }
  function applyQuality(v) { document.documentElement.setAttribute("data-quality", v === "low" ? "low" : "high"); }
  function applyFontsize(v) { document.documentElement.setAttribute("data-fontsize", v === "large" ? "large" : "normal"); }
  function applyRole(v) { document.body.setAttribute("data-role", v || "none"); }
  App.applyTheme = applyTheme; App.applyMotion = applyMotion; App.applyQuality = applyQuality;
  App.applyFontsize = applyFontsize; App.applyRole = applyRole;

  /* ------------------------------ tooltip ------------------------------ */
  const tooltipEl = document.getElementById("tooltip");
  function showTooltip(target, text, color) {
    const r = target.getBoundingClientRect();
    tooltipEl.textContent = text;
    if (color) tooltipEl.style.setProperty("--tt-color", color);
    tooltipEl.hidden = false;
    tooltipEl.style.left = (r.left + r.width / 2) + "px";
    // 修复：顶栏内元素（如地铁线站点）离视口顶部很近，tooltip 若朝上会被裁掉——翻到下方。
    if (r.top < 88) {
      tooltipEl.style.top = (r.bottom + 8) + "px";
      tooltipEl.style.transform = "translate(-50%, 0)";
      tooltipEl.classList.add("below");
    } else {
      tooltipEl.style.top = (r.top - 8) + "px";
      tooltipEl.style.transform = "translate(-50%, -100%)";
      tooltipEl.classList.remove("below");
    }
  }
  function hideTooltip() { tooltipEl.hidden = true; }
  App.showTooltip = showTooltip;
  App.hideTooltip = hideTooltip;

  /* ------------------------------ toast ------------------------------ */
  const toastHost = document.getElementById("toastHost");
  App.toast = function (msg) {
    const t = document.createElement("div");
    t.className = "toast";
    t.textContent = msg;
    toastHost.appendChild(t);
    requestAnimationFrame(() => t.classList.add("in"));
    setTimeout(() => { t.classList.remove("in"); setTimeout(() => t.remove(), 220); }, 2600);
  };

  /* ------------------------------ aria-live ------------------------------ */
  const ariaLive = document.getElementById("ariaLive");
  function announce(msg) { ariaLive.textContent = ""; setTimeout(() => { ariaLive.textContent = msg; }, 30); }
  App.announce = announce;

  /* ------------------------------ 焦点陷阱 ------------------------------ */
  function trapFocus(container) {
    function handler(e) {
      if (e.key !== "Tab") return;
      const f = container.querySelectorAll('a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])');
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    container.addEventListener("keydown", handler);
    return () => container.removeEventListener("keydown", handler);
  }
  App.trapFocus = trapFocus;

  /* ==================================================================
     命令面板 / 全局搜索（⌘K）
     ================================================================== */
  let searchIndex = null;
  function buildSearchIndex() {
    const idx = [];
    stations.forEach(s => {
      idx.push({ kind: "站点", label: s.name, sub: s.sub, hash: "#/s/" + s.id, color: s.color });
      (function walk(nodes, trail) {
        nodes.forEach(n => {
          const path = trail.concat(n.id);
          const concept = DATA.v4 && DATA.v4.concepts && n.contentRef ? DATA.v4.concepts[n.contentRef] : null;
          const v4Text = concept ? [
            concept.canonicalName,
            (concept.aliases || []).join(" "),
            (concept.tags || []).join(" "),
            ...Object.keys(concept.levels || {}).map(key => (concept.levels[key] && concept.levels[key].text) || ""),
            ...(concept.tradeoffs || []),
            ...(concept.misconceptions || [])
          ].join(" ") : "";
          idx.push({ kind: "知识卡", label: n.name, sub: n.brief || (n.plain || "").slice(0, 20),
            hash: "#/s/" + s.id + "/" + path.join("/"), color: s.color,
            text: (n.name + " " + (n.en || "") + " " + (n.brief || "") + " " + (n.plain || "") + " " + ((n.tags || []).join(" ")) + " " + v4Text) });
          if (n.children) walk(n.children, path);
        });
      })(s.nodes, []);
      if (s.advanced) s.advanced.nodes.forEach(n => {
        const concept = DATA.v4 && DATA.v4.concepts && n.contentRef ? DATA.v4.concepts[n.contentRef] : null;
        const conceptText = concept ? [concept.canonicalName, (concept.aliases || []).join(" "), (concept.tags || []).join(" "),
          ...Object.keys(concept.levels || {}).map(key => (concept.levels[key] && concept.levels[key].text) || "")].join(" ") : "";
        idx.push({ kind: "进阶", label: n.name, sub: n.brief || "", hash: "#/s/" + s.id + "/adv/" + n.id, color: s.color,
          text: n.name + " " + (n.brief || "") + " " + conceptText });
      });
    });
    (DATA.glossary || []).forEach(g => idx.push({ kind: "术语", label: g.term, sub: g.plain, hash: "#/" + g.path, color: "var(--cyan)", text: g.term + " " + g.plain + " " + g.analogy }));
    (DATA.scenarios || []).forEach(sc => idx.push({ kind: "场景", label: sc.title, sub: "客户场景 · 路线", hash: "#/scenarios", color: "var(--amber)", text: sc.title }));
    return idx;
  }
  function searchQuery(q) {
    if (!searchIndex) searchIndex = buildSearchIndex();
    q = q.trim().toLowerCase();
    if (!q) return [];
    return searchIndex
      .map(it => {
        const hay = (it.label + " " + (it.sub || "") + " " + (it.text || "")).toLowerCase();
        let score = -1;
        const li = it.label.toLowerCase();
        if (li === q) score = 100; else if (li.indexOf(q) === 0) score = 80;
        else if (li.indexOf(q) >= 0) score = 60; else if (hay.indexOf(q) >= 0) score = 30;
        return { it, score };
      })
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 24)
      .map(x => x.it);
  }

  const palette = document.getElementById("palette");
  let paletteUntrap = null, paletteReturn = null;
  function openPalette() {
    if (!palette.hidden) return;
    paletteReturn = document.activeElement;
    palette.innerHTML = "";
    const box = document.createElement("div");
    box.className = "palette";
    box.innerHTML =
      '<div class="palette-input-row">' +
        '<svg class="pi-icon" viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="4.5" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M10.5 10.5L14 14" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>' +
        '<input class="palette-input" id="paletteInput" type="text" placeholder="搜索站点、知识卡、术语、场景…" aria-label="全局搜索" autocomplete="off">' +
        '<kbd class="pi-esc">Esc</kbd>' +
      '</div>' +
      '<div class="palette-results" id="paletteResults" role="listbox"></div>';
    palette.appendChild(box);
    palette.hidden = false;
    const input = box.querySelector("#paletteInput");
    const results = box.querySelector("#paletteResults");
    let active = -1, items = [];

    function draw(list) {
      items = list; active = list.length ? 0 : -1;
      if (!list.length) {
        const q = input.value.trim();
        results.innerHTML = q
          ? '<div class="palette-empty">没有找到“' + esc(q) + '”相关内容</div>'
          : '<div class="palette-hint">试试输入 <b>KV</b>、<b>液冷</b>、<b>定价</b>、<b>掉卡</b>…</div>';
        announce(q ? "无结果" : "");
        return;
      }
      results.innerHTML = list.map((it, i) =>
        '<button class="palette-item' + (i === 0 ? " active" : "") + '" role="option" data-i="' + i + '" data-hash="' + it.hash + '">' +
          '<span class="pi-dot" style="background:' + it.color + '"></span>' +
          '<span class="pi-main"><span class="pi-label">' + esc(it.label) + '</span>' +
          '<span class="pi-sub">' + esc(it.sub || "") + '</span></span>' +
          '<span class="pi-kind">' + it.kind + '</span>' +
        '</button>').join("");
      announce(list.length + " 条结果");
      results.querySelectorAll(".palette-item").forEach(b => {
        b.addEventListener("click", () => { go(b.dataset.hash); closePalette(); });
        b.addEventListener("mousemove", () => setActive(+b.dataset.i));
      });
    }
    function setActive(i) {
      active = i;
      results.querySelectorAll(".palette-item").forEach((b, j) => b.classList.toggle("active", j === i));
      const el = results.querySelector('.palette-item[data-i="' + i + '"]');
      if (el) el.scrollIntoView({ block: "nearest" });
    }
    input.addEventListener("input", () => draw(searchQuery(input.value)));
    input.addEventListener("keydown", e => {
      if (e.key === "ArrowDown") { e.preventDefault(); if (items.length) setActive((active + 1) % items.length); }
      else if (e.key === "ArrowUp") { e.preventDefault(); if (items.length) setActive((active - 1 + items.length) % items.length); }
      else if (e.key === "Enter") { e.preventDefault(); if (active >= 0 && items[active]) { go(items[active].hash); closePalette(); } }
    });
    draw([]);
    paletteUntrap = trapFocus(box);
    palette.addEventListener("mousedown", scrimClose);
    setTimeout(() => input.focus(), 20);
  }
  function scrimClose(e) { if (e.target === palette) closePalette(); }
  function closePalette() {
    if (palette.hidden) return;
    palette.hidden = true; palette.innerHTML = "";
    if (paletteUntrap) { paletteUntrap(); paletteUntrap = null; }
    palette.removeEventListener("mousedown", scrimClose);
    if (paletteReturn && paletteReturn.focus) paletteReturn.focus();
  }
  App.openPalette = openPalette; App.closePalette = closePalette;
  document.getElementById("searchBtn").addEventListener("click", openPalette);

  /* ==================================================================
     设置面板
     ================================================================== */
  const settingsPanel = document.getElementById("settingsPanel");
  let settingsUntrap = null, settingsReturn = null;
  function seg(name, current, opts) {
    return '<div class="seg" role="radiogroup" data-set="' + name + '">' +
      opts.map(o => '<button class="seg-btn' + (o.v === current ? " on" : "") + '" role="radio" aria-checked="' + (o.v === current) + '" data-v="' + o.v + '">' + o.label + '</button>').join("") +
      '</div>';
  }
  function openSettings() {
    if (!settingsPanel.hidden) return;
    settingsReturn = document.activeElement;
    settingsPanel.innerHTML = "";
    const box = document.createElement("div");
    box.className = "settings-drawer";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-label", "设置");
    box.innerHTML =
      '<div class="settings-head"><h3>设置</h3><button class="drawer-close" id="settingsClose" aria-label="关闭设置"><svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg></button></div>' +
      '<div class="settings-body">' +
        setRow("主题", seg("theme", store.theme(), [{ v: "dark", label: "暗" }, { v: "light", label: "亮" }, { v: "system", label: "跟随系统" }])) +
        setRow("动效", seg("motion", store.motion(), [{ v: "full", label: "完整" }, { v: "reduce", label: "减少" }])) +
        setRow("画质", seg("quality", store.quality(), [{ v: "high", label: "高" }, { v: "low", label: "低" }])) +
        setRow("字号", seg("fontsize", store.fontsize(), [{ v: "normal", label: "标准" }, { v: "large", label: "大" }])) +
        setRow("讲解模式", seg("presenter", store.presenter() ? "on" : "off", [{ v: "off", label: "关" }, { v: "on", label: "开" }])) +
        setRow("角色", seg("role", store.role() || "none", [{ v: "sales", label: "销售" }, { v: "manage", label: "职能" }, { v: "tech", label: "技术" }])) +
        '<div class="settings-actions">' +
          '<button class="btn-secondary" id="retour">重看引导</button>' +
          '<button class="btn-secondary danger" id="resetLocal">清除本地进度</button>' +
        '</div>' +
        '<div class="settings-note">全部即时生效并保存在本机（localStorage），不上报。</div>' +
      '</div>';
    settingsPanel.appendChild(box);
    settingsPanel.hidden = false;
    requestAnimationFrame(() => box.classList.add("in"));

    box.querySelectorAll(".seg").forEach(group => {
      group.querySelectorAll(".seg-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const set = group.dataset.set, v = btn.dataset.v;
          group.querySelectorAll(".seg-btn").forEach(b => { b.classList.remove("on"); b.setAttribute("aria-checked", "false"); });
          btn.classList.add("on"); btn.setAttribute("aria-checked", "true");
          applySetting(set, v);
        });
      });
    });
    box.querySelector("#settingsClose").addEventListener("click", closeSettings);
    box.querySelector("#retour").addEventListener("click", () => { closeSettings(); store.set("tour:done", "0"); Components.startWelcome(true); });
    box.querySelector("#resetLocal").addEventListener("click", () => {
      if (confirm("确定清除本机的学习进度、徽章与设置吗？")) {
        ["presenter", "role", "resume", "tour:done"].forEach(store.del.bind(store));
        stations.forEach(s => { store.del("visited:" + s.id); store.del("badge:" + s.id); s.nodes.forEach(n => store.del("progress:" + s.id + "/" + n.id)); });
        ["theme", "motion", "quality", "fontsize"].forEach(k => store.del("settings:" + k));
        location.reload();
      }
    });
    settingsUntrap = trapFocus(box);
    settingsPanel.addEventListener("mousedown", settingsScrim);
    setTimeout(() => box.querySelector("#settingsClose").focus(), 20);
  }
  function setRow(label, control) { return '<div class="set-row"><div class="set-label">' + label + '</div>' + control + '</div>'; }
  function applySetting(set, v) {
    if (set === "theme") { store.setTheme(v); applyTheme(v); }
    else if (set === "motion") { store.setMotion(v); applyMotion(v); redrawCurrentStation(); }
    else if (set === "quality") { store.setQuality(v); applyQuality(v); redrawCurrentStation(); }
    else if (set === "fontsize") { store.setFontsize(v); applyFontsize(v); }
    else if (set === "presenter") { const on = v === "on"; store.setPresenter(on); applyPresenter(on); }
    else if (set === "role") { const rv = v === "none" ? "" : v; store.setRole(rv); applyRole(rv); if (App.state.route === "home") render(); }
  }
  function settingsScrim(e) { if (e.target === settingsPanel) closeSettings(); }
  function closeSettings() {
    if (settingsPanel.hidden) return;
    const box = settingsPanel.querySelector(".settings-drawer");
    if (box) box.classList.remove("in");
    settingsPanel.removeEventListener("mousedown", settingsScrim);
    if (settingsUntrap) { settingsUntrap(); settingsUntrap = null; }
    setTimeout(() => { settingsPanel.hidden = true; settingsPanel.innerHTML = ""; }, 180);
    if (settingsReturn && settingsReturn.focus) settingsReturn.focus();
  }
  App.openSettings = openSettings; App.closeSettings = closeSettings;
  document.getElementById("settingsBtn").addEventListener("click", openSettings);

  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }

  /* ------------------------------ 全局键盘 ------------------------------ */
  document.addEventListener("keydown", e => {
    if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) { e.preventDefault(); if (palette.hidden) openPalette(); else closePalette(); return; }
    if (e.key === "/" && palette.hidden && !/^(INPUT|TEXTAREA|SELECT)$/.test((e.target.tagName || "")) && !e.metaKey && !e.ctrlKey) { e.preventDefault(); openPalette(); return; }
    if (e.key === "Escape") {
      if (!palette.hidden) { closePalette(); return; }
      if (!settingsPanel.hidden) { closeSettings(); return; }
      if (!document.getElementById("overlay").hidden) { Components.closeOverlay(); return; }
      if (drawerEl.classList.contains("open")) { closeDrawer(); }
    }
  });

  /* ------------------------------ 初始化 ------------------------------ */
  function init() {
    applyTheme(store.theme());
    applyMotion(store.motion());
    applyQuality(store.quality());
    applyFontsize(store.fontsize());
    applyRole(store.role());
    buildMetro();
    applyPresenter(store.presenter());
    window.addEventListener("hashchange", render);
    render();
    if (!store.tourDone()) Components.startWelcome(false);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
