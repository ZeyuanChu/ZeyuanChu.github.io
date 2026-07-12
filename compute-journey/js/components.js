/* ========================================================================
   算力之旅 · UI 组件 V2：首页、站点页、知识卡、测验、术语表、徽章、结业卡、
   场景库、知识图谱、成本估算器、404、首运欢迎、进度环、图标库。
   ======================================================================== */
window.Components = (function () {
  "use strict";

  const DATA = window.DATA;

  const DOMAIN = {
    gpu: "硬件", server: "硬件", dc: "设施", network: "网络", data: "数据",
    platform: "平台", model: "模型", delivery: "商业", token: "商业", ops: "运维"
  };

  /* --------------------------- 图标库（内联 SVG，24×24，1.75px）--------------------------- */
  const Icons = {
    gpu: '<rect x="4" y="6" width="16" height="12" rx="2"/><rect x="9" y="10" width="6" height="4" rx="1"/><path d="M7 18v2M12 18v2M17 18v2"/>',
    server: '<rect x="4" y="4" width="16" height="7" rx="1.5"/><rect x="4" y="13" width="16" height="7" rx="1.5"/><circle cx="8" cy="7.5" r=".6"/><circle cx="8" cy="16.5" r=".6"/>',
    rack: '<rect x="6" y="3" width="12" height="18" rx="1.5"/><path d="M9 6h6M9 9h6M9 12h6M9 15h6"/>',
    network: '<circle cx="12" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><path d="M12 7v4M12 11l-6 6M12 11l6 6"/>',
    database: '<ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v12c0 1.6 3.1 3 7 3s7-1.4 7-3V6"/><path d="M5 12c0 1.6 3.1 3 7 3s7-1.4 7-3"/>',
    stack: '<path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M3 13l9 5 9-5M3 17l9 4 9-4"/>',
    model: '<circle cx="12" cy="12" r="3"/><circle cx="12" cy="4" r="1.5"/><circle cx="12" cy="20" r="1.5"/><circle cx="4" cy="12" r="1.5"/><circle cx="20" cy="12" r="1.5"/><path d="M12 9V5.5M12 15v3.5M9 12H5.5M15 12h3.5"/>',
    cloud: '<path d="M7 18a4 4 0 0 1-.5-8 5 5 0 0 1 9.5-1 3.5 3.5 0 0 1 .5 7z"/>',
    gauge: '<path d="M5 17a8 8 0 1 1 14 0"/><path d="M12 17l4-5"/><circle cx="12" cy="17" r="1"/>',
    token: '<circle cx="12" cy="12" r="8"/><path d="M9.5 9.5h5M12 9.5v6M9.5 14.5h5"/>',
    search: '<circle cx="10" cy="10" r="6"/><path d="M15 15l5 5"/>',
    graph: '<circle cx="6" cy="6" r="2"/><circle cx="18" cy="7" r="2"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="17" r="2"/><path d="M8 7l8 .5M7.5 8L7 16M8.5 17l7-1M16 9l-8 7"/>',
    scenario: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 9h8M8 13h8M8 17h5"/>',
    coin: '<ellipse cx="12" cy="7" rx="7" ry="3"/><path d="M5 7v6c0 1.6 3.1 3 7 3s7-1.4 7-3V7"/>',
    cost: '<path d="M4 20V6M4 20h16M8 16v-4M12 16V8M16 16v-6"/>',
    play: '<path d="M7 5l11 7-11 7z"/>'
  };
  function icon(id, cls) {
    return '<svg class="ic ' + (cls || "") + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (Icons[id] || Icons.model) + '</svg>';
  }
  function stationIcon(s, cls) { return icon(s.icon || "model", cls); }

  /* --------------------------- 小工具 --------------------------- */
  function el(tag, cls, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function firstSentence(text) { const m = text.match(/^[^。]*。/); return m ? m[0] : text; }
  function findNodePath(station, nodeId) {
    let result = null;
    (function walk(nodes, trail) {
      if (result || !nodes) return;
      for (const n of nodes) {
        const t = trail.concat(n.id);
        if (n.id === nodeId) { result = t; return; }
        if (n.children) walk(n.children, t);
      }
    })(station.nodes, []);
    return result;
  }
  function nodeByPath(station, ids) {
    let level = station.nodes, node = null;
    for (const id of ids) { if (!level) return null; node = level.find(n => n.id === id); if (!node) return null; level = node.children; }
    return node;
  }
  function v4Concept(node) {
    if (!DATA.v4 || !DATA.v4.concepts || !node || !node.contentRef) return null;
    return DATA.v4.concepts[node.contentRef] || null;
  }
  function v4Source(id) {
    return DATA.v4 && DATA.v4.sources ? DATA.v4.sources[id] : null;
  }
  function v4Claim(id) {
    return DATA.v4 && DATA.v4.claims ? DATA.v4.claims[id] : null;
  }

  /* --------------------------- 进度环 --------------------------- */
  function ringSVG(frac, size) {
    size = size || 34;
    const r = size / 2 - 3, c = 2 * Math.PI * r, off = c * (1 - (frac || 0));
    return '<svg class="progress-ring" viewBox="0 0 ' + size + ' ' + size + '" data-c="' + c + '" style="width:' + size + 'px;height:' + size + 'px">' +
      '<circle class="pr-track" cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" fill="none" stroke-width="3"/>' +
      '<circle class="pr-fill" cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" fill="none" stroke-width="3" ' +
      'stroke-dasharray="' + c + '" stroke-dashoffset="' + off + '" transform="rotate(-90 ' + size / 2 + ' ' + size / 2 + ')" stroke-linecap="round"/>' +
      '</svg>';
  }
  function updateRing(ringEl, frac) {
    const fill = ringEl.querySelector(".pr-fill");
    const c = parseFloat(ringEl.dataset.c || "0");
    if (fill) fill.setAttribute("stroke-dashoffset", c * (1 - (frac || 0)));
  }

  /* ============================ 首页 ============================ */
  function buildHome() {
    const wrap = el("div", "home");

    const hero = el("div", "hero");
    hero.innerHTML =
      '<h1>' + DATA.meta.title + '</h1>' +
      '<p class="tagline">' + DATA.meta.tagline + '</p>' +
      '<p class="hero-lead">从一张显卡，到一朵能对外卖 Token 的云——外行看懂主线，内行点出细节。' +
        '<span class="hero-note">为什么是现在：AI 需求爆发、GPU 自 2023 年持续紧缺，大厂排队动辄数周；一批“新云”买卡自建、按需把算力与 Token 卖出去，往往更快也更便宜——这就是当下。</span></p>' +
      '<div class="hero-cta">' +
        '<a class="btn-primary" href="#/s/gpu">开始旅程' +
          '<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M3 7h8M7 3l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
        '</a>' +
        '<button class="btn-secondary" id="tourBtn">带我走一遍</button>' +
      '</div>';
    wrap.appendChild(hero);
    hero.querySelector("#tourBtn").addEventListener("click", () => startTour());

    /* 快捷入口 */
    const resumeHash = App.store.resume();
    const quick = el("div", "quicknav");
    const items = [
      { hash: "#/atlas", ic: "graph", label: "图谱 Atlas" },
      { hash: "#/labs", ic: "cost", label: "实验室" },
      { hash: "#/scenarios", ic: "scenario", label: "场景库" },
      { hash: "#/glossary", ic: "search", label: "术语表" },
      { hash: "#/cost", ic: "cost", label: "成本估算" }
    ];
    if (resumeHash && resumeHash !== "#/") items.unshift({ hash: resumeHash, ic: "play", label: "继续上次", primary: true });
    quick.innerHTML = items.map(it =>
      '<a class="quick-chip' + (it.primary ? " primary" : "") + '" href="' + it.hash + '">' + icon(it.ic) + '<span>' + it.label + '</span></a>').join("");
    wrap.appendChild(quick);

    const pano = el("div", "panorama");
    pano.innerHTML = '<div class="panorama-title">主线全景 · 从一张显卡，到一朵云</div>' + panoramaSVG();
    wrap.appendChild(pano);
    wirePanorama(pano);

    const grid = el("div", "station-grid");
    DATA.stations.forEach(s => grid.appendChild(stationCard(s)));
    wrap.appendChild(grid);

    const footerText = DATA.v4
      ? "内容版本 " + DATA.v4.meta.version + " · 全站知识已接入来源、口径、成熟度与复核记录"
      : "内部学习资料 · 内容口径以工程团队评审为准 · 会过时的数字集中登记于「数字保鲜表」";
    wrap.appendChild(el("div", "home-footer", footerText));
    return wrap;
  }

  function stationCard(s) {
    const card = el("div", "station-card");
    card.style.setProperty("--sc-color", s.color);
    let statusCls = "", statusTxt = "未开始";
    if (App.store.badged(s.id)) { statusCls = "badged"; statusTxt = "已获徽章"; }
    else if (App.store.visited(s.id)) { statusCls = "progress"; statusTxt = "进行中"; }
    const prog = App.store.stationProgress(s);
    card.innerHTML =
      '<div class="sc-top"><div class="sc-num">' + String(s.num).padStart(2, "0") + '</div>' +
        '<div class="sc-ring">' + ringSVG(prog.frac, 34) + '</div></div>' +
      '<div class="sc-name">' + stationIcon(s, "sc-ic") + s.name + '</div>' +
      '<div class="sc-sub">' + s.sub + '</div>' +
      '<div class="sc-line">' + firstSentence(s.intro).replace(/【[^】]*】/g, "") + '</div>' +
      '<div class="sc-foot"><span class="sc-status ' + statusCls + '"><span class="dot"></span>' + statusTxt + '</span>' +
        (s.est ? '<span class="sc-est">约 ' + s.est + ' 分钟</span>' : '') + '</div>';
    card.setAttribute("role", "link");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-label", "第 " + s.num + " 站 " + s.name + "：" + s.sub);
    card.addEventListener("click", () => App.go("#/s/" + s.id));
    card.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); App.go("#/s/" + s.id); } });
    return card;
  }

  /* ---- 全景长卷 SVG ---- */
  function panoramaSVG() {
    const main = [
      { id: "gpu",      major: true, label: "第 1 站 · 一张显卡", inner: gpuIcon(24, 70) },
      { id: "server",   major: true, label: "第 2 站 · 8 卡服务器", inner: serverIcon(210, 70) },
      { id: "dc",       major: true, label: "第 3 站 · 进机房", inner: dcIcon(392, 62) },
      { id: "network",  major: true, label: "第 4 站 · 连成集群", inner: netIcon(574, 68) },
      { id: "delivery", major: true, label: "第 8 站 · 交付模式（一朵云）", inner: cloudIcon(760, 74) }
    ];
    const links = [
      { d: "M164 112 H210", x1: 164, x2: 210 },
      { d: "M350 112 H392", x1: 350, x2: 392 },
      { d: "M522 112 H574", x1: 522, x2: 574 },
      { d: "M714 112 H760", x1: 714, x2: 760 }
    ];

    const icons = [
      { id: "data",     x: 120, label: "第 5 站 · 存储与数据", inner: dbIcon(120, 224) },
      { id: "platform", x: 300, label: "第 6 站 · 软件栈", inner: stackIconP(300, 224) },
      { id: "model",    x: 480, label: "第 7 站 · 模型层", inner: modelIcon(480, 224) },
      { id: "token",    x: 660, label: "第 9 站 · 算力变现（卖 Token）", inner: coinIconP(660, 224) },
      { id: "ops",      x: 840, label: "第 10 站 · 运维监控", inner: gaugeIcon(840, 224) }
    ];

    let svg = '<svg viewBox="0 0 960 280" role="img" aria-label="算力建设主线全景">';
    svg += panoramaDefs();
    svg += '<rect x="24" y="48" width="912" height="116" rx="18" fill="url(#pano-grid)" stroke="rgba(112,151,214,.16)"/>';
    svg += '<path d="M42 112 H918" fill="none" stroke="url(#pano-line)" stroke-width="14" opacity=".07" stroke-linecap="round"/>';
    svg += panoramaLinks(links);
    main.forEach(h => { svg += hotGroup(h); });
    svg += '<text x="24" y="185" class="stage-caption">没有实体形象的环节，从这里进入：</text>';
    icons.forEach(h => { svg += hotGroup(h); });
    svg += '</svg>';
    return svg;
  }

  function panoramaDefs() {
    return '<defs>' +
      '<linearGradient id="pano-metal" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#64759B"/><stop offset=".45" stop-color="#344665"/><stop offset="1" stop-color="#18243A"/></linearGradient>' +
      '<linearGradient id="pano-metal-side" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#293A58"/><stop offset="1" stop-color="#10192B"/></linearGradient>' +
      '<linearGradient id="pano-panel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#243450"/><stop offset="1" stop-color="#101A2C"/></linearGradient>' +
      '<linearGradient id="pano-pcb" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#195340"/><stop offset="1" stop-color="#0A281F"/></linearGradient>' +
      '<radialGradient id="pano-die" cx="34%" cy="28%" r="92%"><stop offset="0" stop-color="#6E9AF0"/><stop offset=".52" stop-color="#29457B"/><stop offset="1" stop-color="#0B1730"/></radialGradient>' +
      '<linearGradient id="pano-gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF0A8"/><stop offset="1" stop-color="#A87520"/></linearGradient>' +
      '<linearGradient id="pano-glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".24"/><stop offset=".45" stop-color="#fff" stop-opacity=".04"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>' +
      '<linearGradient id="pano-cloud" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF4C2" stop-opacity=".92"/><stop offset=".5" stop-color="#D6BA64" stop-opacity=".38"/><stop offset="1" stop-color="#68551D" stop-opacity=".18"/></linearGradient>' +
      '<linearGradient id="pano-line" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4C8DFF"/><stop offset=".5" stop-color="#2FD4E6"/><stop offset="1" stop-color="#FBBF24"/></linearGradient>' +
      '<pattern id="pano-grid" width="18" height="18" patternUnits="userSpaceOnUse"><path d="M18 0H0V18" fill="none" stroke="#7CA0D8" stroke-opacity=".08" stroke-width=".8"/></pattern>' +
      '<filter id="pano-shadow" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="0" dy="5" stdDeviation="5" flood-color="#000" flood-opacity=".48"/></filter>' +
      '<filter id="pano-glow" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="2.4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>' +
      '</defs>' +
      '<style>' +
      '.pano-cloud-breathe{transform-box:fill-box;transform-origin:center;animation:panoCloudBreath 4.8s ease-in-out infinite}' +
      '.pano-ring-spin{transform-box:fill-box;transform-origin:center;animation:panoRingSpin 9s linear infinite}' +
      '.pano-led-breathe{animation:panoLedBreath 2.8s ease-in-out infinite}' +
      '.pano-flow-dot{animation:panoFlowDot 2.9s linear infinite;will-change:transform,opacity}' +
      '@keyframes panoCloudBreath{0%,100%{transform:scale(.985);opacity:.88}50%{transform:scale(1.025);opacity:1}}' +
      '@keyframes panoRingSpin{to{transform:rotate(360deg)}}' +
      '@keyframes panoLedBreath{0%,100%{opacity:.45}50%{opacity:1}}' +
      '@keyframes panoFlowDot{0%{transform:translateX(var(--pano-flow-from));opacity:0}12%,88%{opacity:1}100%{transform:translateX(var(--pano-flow-to));opacity:0}}' +
      '@media (prefers-reduced-motion:reduce){.pano-cloud-breathe,.pano-ring-spin,.pano-led-breathe,.pano-flow-dot{animation:none!important}}' +
      ':root[data-motion="reduce"] .pano-cloud-breathe,:root[data-motion="reduce"] .pano-ring-spin,:root[data-motion="reduce"] .pano-led-breathe,:root[data-motion="reduce"] .pano-flow-dot{animation:none!important}' +
      '</style>';
  }

  function panoramaLinks(links) {
    const dotsPerLink = 2;
    const duration = 2.9;
    let s = '<g aria-hidden="true">';
    links.forEach((link, i) => {
      const pathId = "pano-flow-path-" + i;
      s += '<path id="' + pathId + '" d="' + link.d + '" fill="none" stroke="var(--cyan)" stroke-width="8" opacity=".09" stroke-linecap="round"/>';
      s += '<path class="loop-anim pano-link" d="' + link.d + '" fill="none" stroke="#7DEAF4" stroke-width="1.5" stroke-dasharray="4 5" opacity=".72"/>';
      for (let n = 0; n < dotsPerLink; n++) {
        const t = (n + 1) / (dotsPerLink + 1), distance = link.x2 - link.x1;
        const px = link.x1 + distance * t, from = -distance * t, to = distance * (1 - t);
        const delay = -(t * duration + i * .17);
        s += '<g transform="translate(' + px.toFixed(1) + ' 112)"><g class="pano-flow-dot" style="--pano-flow-from:' + from.toFixed(1) + 'px;--pano-flow-to:' + to.toFixed(1) + 'px;animation-delay:' + delay.toFixed(2) + 's">' +
          '<circle r="4.5" fill="#2FD4E6" opacity=".16"/><circle r="1.8" fill="#D9FCFF"/></g></g>';
      }
    });
    return s + '</g>';
  }

  function hotGroup(h) {
    const color = colorOf(h.id);
    return '<g class="hot pano-hot" data-goto="' + h.id + '" role="button" tabindex="0" ' +
      'aria-label="' + h.label + '" style="--hot-color:' + color + '">' +
      '<g class="glow-target"' + (h.major ? ' filter="url(#pano-shadow)"' : "") + '>' + h.inner + '</g></g>';
  }
  function colorOf(id) { return (DATA.stations.find(s => s.id === id) || {}).color || "var(--blue)"; }

  function gpuIcon(x, y) {
    const fanX = x + 27, fanY = y + 38, coreX = x + 86, coreY = y + 37;
    let s = '<rect x="' + (x + 4) + '" y="' + (y + 7) + '" width="136" height="72" rx="9" fill="url(#pano-metal-side)" opacity=".78"/>';
    s += '<rect x="' + x + '" y="' + y + '" width="140" height="74" rx="9" fill="url(#pano-pcb)" stroke="#4E9F7A" stroke-opacity=".48"/>';
    s += '<path d="M' + (x + 8) + ' ' + (y + 12) + 'H' + (x + 56) + 'M' + (x + 110) + ' ' + (y + 12) + 'H' + (x + 130) + 'M' + (x + 8) + ' ' + (y + 62) + 'H' + (x + 48) + '" fill="none" stroke="#75C7A2" stroke-opacity=".25" stroke-width=".8"/>';
    s += '<circle cx="' + fanX + '" cy="' + fanY + '" r="20" fill="#111C2E" stroke="#6D7FA4" stroke-opacity=".7"/>';
    s += '<g transform="translate(' + fanX + ' ' + fanY + ')" opacity=".82">';
    for (let i = 0; i < 7; i++) s += '<path d="M0 -3 Q8 -15 15 -5 Q9 2 0 2Z" transform="rotate(' + (i * 360 / 7) + ')" fill="#465979"/>';
    s += '<circle r="5" fill="url(#pano-metal)" stroke="#8293B5" stroke-width=".8"/></g>';
    s += '<rect x="' + (coreX - 22) + '" y="' + (coreY - 20) + '" width="44" height="40" rx="6" fill="url(#pano-metal)" stroke="#8EA7D7" stroke-opacity=".55"/>';
    s += '<rect x="' + (coreX - 16) + '" y="' + (coreY - 14) + '" width="32" height="28" rx="4" fill="url(#pano-die)" stroke="#78A0F4" stroke-width=".8"/>';
    s += '<rect x="' + (coreX - 16) + '" y="' + (coreY - 14) + '" width="32" height="28" rx="4" fill="url(#pano-glass)"/>';
    for (let i = 0; i < 4; i++) {
      const a = i * Math.PI / 2, hx = coreX + Math.cos(a) * 34 - 6, hy = coreY + Math.sin(a) * 24 - 4;
      s += '<rect x="' + hx.toFixed(1) + '" y="' + hy.toFixed(1) + '" width="12" height="8" rx="2" fill="url(#pano-metal)" stroke="#6687C4" stroke-opacity=".6" stroke-width=".7"/>';
    }
    s += '<circle class="pano-ring-spin" cx="' + coreX + '" cy="' + coreY + '" r="25" fill="none" stroke="#5FA4FF" stroke-opacity=".65" stroke-width=".8" stroke-dasharray="3 5"/>';
    for (let i = 0; i < 7; i++) s += '<rect x="' + (x + 58 + i * 9) + '" y="' + (y + 70) + '" width="6" height="7" rx="1" fill="url(#pano-gold)"/>';
    s += '<circle class="pano-led-breathe" cx="' + (x + 129) + '" cy="' + (y + 12) + '" r="2.2" fill="#34D399"/>';
    return s;
  }
  function serverIcon(x, y) {
    let s = '<path d="M' + x + ' ' + (y + 10) + 'L' + (x + 12) + ' ' + y + 'H' + (x + 140) + 'L' + (x + 130) + ' ' + (y + 10) + 'Z" fill="url(#pano-metal)" stroke="#8DA0C3" stroke-opacity=".45"/>';
    s += '<path d="M' + (x + 130) + ' ' + (y + 10) + 'L' + (x + 140) + ' ' + y + 'V' + (y + 64) + 'L' + (x + 130) + ' ' + (y + 76) + 'Z" fill="url(#pano-metal-side)"/>';
    s += '<rect x="' + x + '" y="' + (y + 10) + '" width="130" height="66" rx="5" fill="url(#pano-panel)" stroke="#8198C4" stroke-opacity=".48"/>';
    s += '<rect x="' + (x + 4) + '" y="' + (y + 14) + '" width="122" height="18" rx="3" fill="url(#pano-glass)" opacity=".55"/>';
    for (let r = 0; r < 2; r++) for (let c = 0; c < 4; c++)
      s += '<rect x="' + (x + 9 + c * 29) + '" y="' + (y + 19 + r * 26) + '" width="23" height="20" rx="3" fill="url(#pano-die)" stroke="#6796E9" stroke-opacity=".7" stroke-width=".8"/>' +
        '<rect x="' + (x + 12 + c * 29) + '" y="' + (y + 22 + r * 26) + '" width="17" height="5" rx="1.5" fill="#fff" opacity=".1"/>';
    for (let i = 0; i < 5; i++) s += '<circle cx="' + (x + 12 + i * 9) + '" cy="' + (y + 70) + '" r="1.4" fill="' + (i === 0 ? '#34D399' : '#2FD4E6') + '" opacity=".85"/>';
    return s;
  }
  function dcIcon(x, y) {
    let s = '<path d="M' + (x + 2) + ' ' + (y + 81) + 'L' + (x + 70) + ' ' + (y + 54) + 'L' + (x + 128) + ' ' + (y + 78) + 'L' + (x + 61) + ' ' + (y + 103) + 'Z" fill="#2FD4E6" opacity=".12"/>';
    for (let c = 0; c < 2; c++) s += rackIcon(x + 18 + c * 58, y + c * 8, 44, 74, 6);
    s += '<path class="loop-anim pano-link" d="M' + (x + 16) + ' ' + (y + 92) + 'L' + (x + 118) + ' ' + (y + 92) + '" stroke="#2FD4E6" stroke-width="1" stroke-dasharray="3 5" opacity=".7"/>';
    return s;
  }
  function rackIcon(x, y, w, h, units) {
    let s = '<path d="M' + x + ' ' + (y + 7) + 'L' + (x + 9) + ' ' + y + 'H' + (x + w + 7) + 'L' + (x + w) + ' ' + (y + 7) + 'Z" fill="url(#pano-metal)" stroke="#8799BA" stroke-opacity=".45"/>';
    s += '<path d="M' + (x + w) + ' ' + (y + 7) + 'L' + (x + w + 7) + ' ' + y + 'V' + (y + h - 5) + 'L' + (x + w) + ' ' + (y + h) + 'Z" fill="url(#pano-metal-side)"/>';
    s += '<rect x="' + x + '" y="' + (y + 7) + '" width="' + w + '" height="' + (h - 7) + '" rx="3" fill="url(#pano-panel)" stroke="#7185AB" stroke-opacity=".55"/>';
    const gap = (h - 17) / units;
    for (let u = 0; u < units; u++) {
      const uy = y + 12 + u * gap;
      s += '<rect x="' + (x + 5) + '" y="' + uy.toFixed(1) + '" width="' + (w - 10) + '" height="' + Math.max(4, gap - 3).toFixed(1) + '" rx="1" fill="#18243A" stroke="#7083A7" stroke-opacity=".36" stroke-width=".6"/>';
      s += '<circle cx="' + (x + w - 8) + '" cy="' + (uy + Math.max(4, gap - 3) / 2).toFixed(1) + '" r="1" fill="#34D399"/>';
    }
    return s;
  }
  function netIcon(x, y) {
    let s = "";
    const spineY = y + 4, leafY = y + 49;
    for (let a = 0; a < 2; a++) for (let b = 0; b < 3; b++) {
      const sx = x + 37 + a * 66, lx = x + 24 + b * 46;
      s += '<path d="M' + sx + ' ' + (spineY + 15) + 'C' + sx + ' ' + (spineY + 31) + ' ' + lx + ' ' + (leafY - 15) + ' ' + lx + ' ' + leafY + '" fill="none" stroke="#2FD4E6" stroke-width="1.2" opacity=".62"/>';
    }
    for (let i = 0; i < 2; i++) s += switchIcon(x + 9 + i * 66, spineY, 56, 17, 5);
    for (let i = 0; i < 3; i++) s += switchIcon(x + 1 + i * 46, leafY, 46, 15, 4);
    s += '<path d="M' + (x + 14) + ' ' + (y + 80) + 'H' + (x + 126) + '" stroke="#2FD4E6" stroke-width="6" opacity=".08" stroke-linecap="round"/>';
    return s;
  }
  function switchIcon(x, y, w, h, ports) {
    let s = '<path d="M' + x + ' ' + (y + 4) + 'L' + (x + 6) + ' ' + y + 'H' + (x + w + 5) + 'L' + (x + w) + ' ' + (y + 4) + 'Z" fill="url(#pano-metal)"/>';
    s += '<rect x="' + x + '" y="' + (y + 4) + '" width="' + w + '" height="' + (h - 4) + '" rx="3" fill="url(#pano-panel)" stroke="#48D5E5" stroke-opacity=".66" stroke-width=".7"/>';
    const gap = (w - 14) / ports;
    for (let i = 0; i < ports; i++) s += '<rect x="' + (x + 7 + i * gap).toFixed(1) + '" y="' + (y + 8) + '" width="' + Math.max(3, gap - 3).toFixed(1) + '" height="3" rx=".8" fill="#2FD4E6" opacity="' + (i % 2 ? '.38' : '.78') + '"/>';
    return s;
  }
  function cloudIcon(x, y) {
    let s = '<g class="pano-cloud-breathe">';
    s += '<ellipse cx="' + (x + 69) + '" cy="' + (y + 66) + '" rx="57" ry="10" fill="#FBBF24" opacity=".1"/>';
    s += '<path d="M' + (x + 7) + ' ' + (y + 50) + 'a24 24 0 0 1 21-34 30 30 0 0 1 54-4 22 22 0 0 1 20 38Z" fill="url(#pano-cloud)" stroke="#F6D875" stroke-width="1.2" filter="url(#pano-glow)"/>';
    s += '<path d="M' + (x + 20) + ' ' + (y + 30) + 'C' + (x + 40) + ' ' + (y + 5) + ' ' + (x + 73) + ' ' + (y + 7) + ' ' + (x + 91) + ' ' + (y + 27) + '" fill="none" stroke="#fff" stroke-opacity=".28" stroke-width="2" stroke-linecap="round"/>';
    s += '<ellipse cx="' + (x + 55) + '" cy="' + (y + 54) + '" rx="38" ry="8" fill="url(#pano-metal)" stroke="#E8C760" stroke-opacity=".5"/>';
    for (let i = 0; i < 4; i++) s += '<rect x="' + (x + 27 + i * 16) + '" y="' + (y + 49) + '" width="11" height="7" rx="1.5" fill="url(#pano-die)" stroke="#F4D66E" stroke-opacity=".5" stroke-width=".5"/>';
    for (let i = 0; i < 3; i++) s += '<circle class="pano-led-breathe" cx="' + (x + 39 + i * 18) + '" cy="' + (y + 64) + '" r="2" fill="#FBBF24" style="animation-delay:-' + (i * .55).toFixed(2) + 's"/>';
    s += '<circle class="pano-ring-spin" cx="' + (x + 55) + '" cy="' + (y + 38) + '" r="42" fill="none" stroke="#FBBF24" stroke-opacity=".42" stroke-width=".8" stroke-dasharray="4 7"/>';
    return s + '</g>';
  }
  function dbIcon(cx, cy) {
    let inner = '<path d="M' + (cx - 19) + ' ' + (cy - 13) + 'V' + (cy + 10) + 'a19 6 0 0 0 38 0V' + (cy - 13) + '" fill="url(#pano-metal)" stroke="#F472B6" stroke-width="1"/>';
    inner += '<ellipse cx="' + cx + '" cy="' + (cy - 13) + '" rx="19" ry="6" fill="url(#pano-glass)" stroke="#F8A5D1" stroke-width="1"/>';
    for (let i = 0; i < 2; i++) inner += '<ellipse cx="' + cx + '" cy="' + (cy - 1 + i * 11) + '" rx="19" ry="6" fill="none" stroke="#F472B6" stroke-opacity=".46" stroke-width=".7"/>';
    return miniPlate(cx, cy, "#F472B6", inner);
  }
  function stackIconP(cx, cy) {
    let inner = "";
    for (let i = 0; i < 4; i++) {
      const yy = cy - 20 + i * 11;
      inner += '<rect x="' + (cx - 25) + '" y="' + yy + '" width="50" height="8" rx="2" fill="url(#pano-panel)" stroke="#818CF8" stroke-width=".8"/>';
      inner += '<rect x="' + (cx - 23) + '" y="' + (yy + 1) + '" width="46" height="3" rx="1.5" fill="url(#pano-glass)"/>';
    }
    return miniPlate(cx, cy, "#818CF8", inner);
  }
  function modelIcon(cx, cy) {
    let inner = "";
    const n = 6;
    for (let i = 0; i < n; i++) {
      const a = -Math.PI / 2 + i * Math.PI * 2 / n, px = cx + Math.cos(a) * 25, py = cy + Math.sin(a) * 20;
      inner += '<line x1="' + cx + '" y1="' + cy + '" x2="' + px.toFixed(1) + '" y2="' + py.toFixed(1) + '" stroke="#34D399" stroke-width="1" opacity=".55"/>';
      inner += '<circle cx="' + px.toFixed(1) + '" cy="' + py.toFixed(1) + '" r="3.5" fill="url(#pano-die)" stroke="#7CE6B9" stroke-width=".7"/>';
    }
    inner += '<circle cx="' + cx + '" cy="' + cy + '" r="10" fill="#34D399" opacity=".18"/>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="6.5" fill="url(#pano-die)" stroke="#85EDC2"/>' +
      '<circle class="pano-ring-spin" cx="' + cx + '" cy="' + cy + '" r="14" fill="none" stroke="#34D399" stroke-width=".7" stroke-dasharray="2 4"/>';
    return miniPlate(cx, cy, "#34D399", inner);
  }
  function coinIconP(cx, cy) {
    let inner = "";
    for (let i = 0; i < 3; i++) {
      const yy = cy + 11 - i * 10;
      inner += '<path d="M' + (cx - 20) + ' ' + (yy - 6) + 'V' + yy + 'a20 6 0 0 0 40 0v-6" fill="url(#pano-metal)" stroke="#A3E635" stroke-width=".8"/>';
      inner += '<ellipse cx="' + cx + '" cy="' + (yy - 6) + '" rx="20" ry="6" fill="url(#pano-gold)" stroke="#D4F56B" stroke-width=".7"/>';
    }
    inner += '<text x="' + cx + '" y="' + (cy - 14) + '" class="stage-label-sm" dominant-baseline="central" text-anchor="middle" style="fill:#24320A;font-weight:800">T</text>';
    return miniPlate(cx, cy, "#A3E635", inner);
  }
  function gaugeIcon(cx, cy) {
    let inner = '<path d="M' + (cx - 24) + ' ' + (cy + 12) + 'a24 24 0 0 1 48 0" fill="#101A2C" stroke="#F87171" stroke-width="2.5"/>';
    for (let i = 0; i <= 8; i++) {
      const a = Math.PI - i * Math.PI / 8, x1 = cx + Math.cos(a) * 19, y1 = cy + 12 - Math.sin(a) * 19, x2 = cx + Math.cos(a) * 23, y2 = cy + 12 - Math.sin(a) * 23;
      inner += '<line x1="' + x1.toFixed(1) + '" y1="' + y1.toFixed(1) + '" x2="' + x2.toFixed(1) + '" y2="' + y2.toFixed(1) + '" stroke="' + (i > 5 ? '#FBBF24' : '#8EA0C1') + '" stroke-width=".8"/>';
    }
    inner += '<line x1="' + cx + '" y1="' + (cy + 12) + '" x2="' + (cx + 14) + '" y2="' + (cy - 4) + '" stroke="#F87171" stroke-width="2" stroke-linecap="round"/>' +
      '<circle cx="' + cx + '" cy="' + (cy + 12) + '" r="3" fill="#F87171"/>';
    return miniPlate(cx, cy, "#F87171", inner);
  }

  function miniPlate(cx, cy, color, inner) {
    const x = cx - 50, y = cy - 30;
    return '<g style="--pano-accent:' + color + '">' +
      '<rect x="' + (x + 3) + '" y="' + (y + 5) + '" width="100" height="60" rx="11" fill="#080D18" opacity=".74"/>' +
      '<rect x="' + x + '" y="' + y + '" width="100" height="60" rx="11" fill="url(#pano-panel)" stroke="' + color + '" stroke-opacity=".48"/>' +
      '<rect x="' + (x + 1) + '" y="' + (y + 1) + '" width="98" height="22" rx="10" fill="url(#pano-glass)" opacity=".42"/>' +
      '<path d="M' + (x + 9) + ' ' + (y + 7) + 'h10M' + (x + 9) + ' ' + (y + 7) + 'v10M' + (x + 91) + ' ' + (y + 53) + 'h-10M' + (x + 91) + ' ' + (y + 53) + 'v-10" fill="none" stroke="' + color + '" stroke-opacity=".72" stroke-width="1"/>' +
      inner + '<circle class="pano-led-breathe" cx="' + (x + 88) + '" cy="' + (y + 10) + '" r="1.8" fill="' + color + '"/></g>';
  }

  function wirePanorama(container) {
    container.querySelectorAll("[data-goto]").forEach(g => {
      const id = g.dataset.goto;
      const s = DATA.stations.find(st => st.id === id);
      g.addEventListener("click", () => App.go("#/s/" + id));
      g.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); App.go("#/s/" + id); } });
      g.addEventListener("mouseenter", e => App.showTooltip(e.currentTarget, "第 " + s.num + " 站 · " + s.name, s.color));
      g.addEventListener("mouseleave", App.hideTooltip);
      g.addEventListener("focus", e => App.showTooltip(e.currentTarget, "第 " + s.num + " 站 · " + s.name, s.color));
      g.addEventListener("blur", App.hideTooltip);
    });
  }

  /* ============================ 站点页 ============================ */
  function buildStationPage(station) {
    const page = el("div", "station-page");
    page.style.setProperty("--accent", station.color);

    const prog = App.store.stationProgress(station);
    const left = el("div", "station-left");
    left.innerHTML =
      '<div class="station-head">' +
        '<div class="station-tag"><span class="tag-dot"></span>第 ' + station.num + ' 站 · ' + DOMAIN[station.id] + '</div>' +
        '<div class="station-ring" title="本站已读 ' + prog.done + '/' + prog.total + '">' + ringSVG(prog.frac, 40) + '</div>' +
      '</div>' +
      '<h2 class="station-name">' + stationIcon(station, "sn-ic") + station.name + '</h2>' +
      '<div class="station-sub">' + station.sub + '</div>';

    if (station.contentV4) left.appendChild(buildV4StationIntro(station));

    // 一分钟看懂
    const tldr = el("details", "tldr-block");
    tldr.innerHTML =
      '<summary><span class="chev">›</span>一分钟看懂' + (station.est ? '<span class="tldr-est">约 ' + station.est + ' 分钟</span>' : '') + '</summary>' +
      '<div class="tldr-body">' + (station.tldr || firstSentence(station.intro)) + '</div>';
    left.appendChild(tldr);

    left.appendChild(el("div", "station-intro", station.intro));
    left.appendChild(el("div", "parts-title", station.contentV4 ? "知识模块 · 点击部件" : "可点击部件"));

    const list = el("div", "parts-list");
    station.nodes.forEach(node => {
      const row = el("div", "part-row");
      row.dataset.node = node.id;
      if (App.store.read(station.id, node.id)) row.classList.add("read");
      row.setAttribute("role", "button");
      row.setAttribute("tabindex", "0");
      row.setAttribute("aria-label", node.name + "：" + node.brief);
      row.innerHTML =
        '<span class="part-marker"></span>' +
        '<span class="part-text"><span class="part-name">' + node.name + '</span>' +
        '<span class="part-brief">' + node.brief + '</span></span>' +
        '<span class="part-read" aria-hidden="true"><svg viewBox="0 0 14 14"><path d="M3 7.5l2.5 2.5L11 4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>' +
        '<span class="part-arrow">›</span>';
      row.addEventListener("click", () => App.openNode(station.id, [node.id]));
      row.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); App.openNode(station.id, [node.id]); } });
      list.appendChild(row);
    });
    left.appendChild(list);

    // 进阶层入口
    if (station.advanced) {
      const adv = el("button", "advanced-entry");
      adv.setAttribute("aria-label", station.advanced.title);
      adv.innerHTML = '<span class="ae-badge">进阶</span><span class="ae-text">' + station.advanced.title.replace(/^进阶：?/, "") + '</span><span class="ae-arrow">▸</span>';
      adv.addEventListener("click", () => App.openNode(station.id, ["adv"]));
      left.appendChild(adv);
    }

    const stageWrap = el("div", "station-stage-wrap");
    stageWrap.appendChild(el("div", "station-stage"));

    const footer = el("div", "station-footer");
    footer.appendChild(buildQuiz(station));
    footer.appendChild(buildStationNav(station));

    // 把左栏+舞台包进 .station-cols（网格），footer 作为其兄弟置于下方。
    // 这样 sticky 左栏的容器块只到"两栏区"底部，不会再浮到满宽的小测之上。
    const cols = el("div", "station-cols");
    cols.appendChild(left);
    cols.appendChild(stageWrap);
    page.appendChild(cols);
    page.appendChild(footer);
    return page;
  }

  function buildV4StationIntro(station) {
    const profile = station.contentV4;
    const box = el("section", "station-v4");
    const sourceCount = (profile.sourceIds || []).length;
    box.innerHTML =
      '<div class="station-v4-head"><span class="station-v4-badge">L0–L3</span>' +
        '<span class="station-v4-meta">分层知识 · ' + sourceCount + ' 个一手来源</span></div>' +
      '<div class="station-v4-title">' + esc(profile.focus || "分层知识") + '</div>';
    if (profile.learningObjectives && profile.learningObjectives.length) {
      const details = el("details", "station-v4-objectives");
      details.innerHTML = '<summary><span class="chev">›</span>本站学完能做什么</summary>' +
        '<ul>' + profile.learningObjectives.map(item => '<li>' + esc(item) + '</li>').join("") + '</ul>';
      box.appendChild(details);
    }
    return box;
  }

  function buildStationNav(station) {
    const nav = el("div", "station-nav");
    const idx = DATA.stations.indexOf(station);
    const prev = DATA.stations[idx - 1], next = DATA.stations[idx + 1];
    nav.innerHTML =
      (prev
        ? '<a href="#/s/' + prev.id + '"><svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M11 7H3M7 3L3 7l4 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>上一站 · ' + prev.name + '</a>'
        : '<a class="disabled" aria-disabled="true"><svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M11 7H3M7 3L3 7l4 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>已是第一站</a>') +
      (next
        ? '<a href="#/s/' + next.id + '">下一站 · ' + next.name + '<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M3 7h8M7 3l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></a>'
        : '<a href="#/glossary">看看术语表<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M3 7h8M7 3l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></a>');
    return nav;
  }

  function wireLinking(page) {
    page.querySelectorAll("[data-node]").forEach(elm => {
      const id = elm.dataset.node;
      elm.addEventListener("mouseenter", () => App.setHighlight(id, true));
      elm.addEventListener("mouseleave", () => App.setHighlight(id, false));
    });
  }

  /* ============================ 知识卡 ============================ */
  function buildCard(station, chain, opts) {
    opts = opts || {};
    const advanced = !!opts.advanced;
    const node = chain[chain.length - 1];
    const pathIds = advanced ? ["adv"].concat(chain.slice(1).map(n => n.id)) : chain.map(n => n.id);
    const content = el("div", "drawer-content");

    /* 顶部：面包屑 + 复制链接 + 关闭 */
    const top = el("div", "drawer-top");
    const bc = el("div", "breadcrumb");
    const stationCrumb = el("span", "crumb", station.name);
    stationCrumb.addEventListener("click", () => App.closeDrawer());
    bc.appendChild(stationCrumb);
    chain.forEach((n, i) => {
      bc.appendChild(el("span", "sep", "›"));
      const isCurrent = i === chain.length - 1;
      const c = el("span", "crumb" + (isCurrent ? " current" : ""), App.crumbLabel(station, n, i));
      if (!isCurrent) c.addEventListener("click", () => App.openNode(station.id, pathIds.slice(0, i + 1)));
      bc.appendChild(c);
    });
    top.appendChild(bc);

    const actions = el("div", "drawer-actions");
    const shareBtn = el("button", "drawer-icon-btn", '<svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true"><path d="M11 5V3.5A1.5 1.5 0 0 0 9.5 2H4.5A1.5 1.5 0 0 0 3 3.5v9A1.5 1.5 0 0 0 4.5 14h5a1.5 1.5 0 0 0 1.5-1.5V11" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M8 8h6M11.5 5.5L14 8l-2.5 2.5" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>');
    shareBtn.setAttribute("aria-label", "复制本卡链接");
    shareBtn.title = "复制本卡链接";
    shareBtn.addEventListener("click", () => copyLink("#/s/" + station.id + (pathIds.length ? "/" + pathIds.join("/") : "")));
    actions.appendChild(shareBtn);
    const closeBtn = el("button", "drawer-close", '<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>');
    closeBtn.setAttribute("aria-label", "关闭知识卡");
    closeBtn.addEventListener("click", () => App.closeDrawer());
    actions.appendChild(closeBtn);
    top.appendChild(actions);
    content.appendChild(top);

    if (chain.length >= 2) {
      const back = el("button", "card-back", '<svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M9 6H3M6 3L3 6l3 3" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>返回上一层');
      back.addEventListener("click", () => App.openNode(station.id, pathIds.slice(0, -1)));
      content.appendChild(back);
    }

    /* 标题区 */
    const titleRow = el("div", "card-title-row");
    titleRow.innerHTML = '<span class="card-title">' + node.name + '</span>' +
      (node.en ? '<span class="card-en">' + node.en + '</span>' : '') +
      (advanced ? '<span class="card-domain-chip adv-chip">进阶</span>' : '<span class="card-domain-chip">' + DOMAIN[station.id] + '</span>');
    content.appendChild(titleRow);
    if (node.brief) content.appendChild(el("div", "card-brief", node.brief));

    const concept = v4Concept(node);

    /* V4 分层知识；尚未迁移的节点继续走兼容内容 */
    if (concept) buildV4Knowledge(content, concept);
    else {
      content.appendChild(el("div", "card-section-label", "它负责什么"));
      content.appendChild(el("div", "card-plain first", node.plain));
    }

    /* analogy + analogyGap */
    if (node.analogy) {
      const an = el("div", "card-analogy", '<span class="prefix">打个比方：</span>' + node.analogy);
      content.appendChild(an);
      if (node.analogyGap) content.appendChild(el("div", "card-analogy-gap", '<span class="gap-prefix">这个比方没说到的是：</span>' + node.analogyGap));
    }

    /* why */
    if (!concept && node.why) {
      content.appendChild(el("div", "card-section-label", "没有它会怎样"));
      content.appendChild(el("div", "card-why", node.why));
    }

    /* 保鲜数字 */
    if (!concept && node.figureRefs && node.figureRefs.length && DATA.figures) {
      content.appendChild(el("div", "card-section-label", "关键数字"));
      const box = el("div", "card-figures");
      node.figureRefs.forEach(ref => {
        const f = DATA.figures[ref];
        if (!f) return;
        box.appendChild(el("div", "figure-item",
          '<span class="fig-val mono">' + f.value + (f.unit ? '<span class="fig-unit">' + f.unit + '</span>' : '') + '</span>' +
          '<span class="fig-note">' + f.note + '<span class="fig-asof">口径截至 ' + f.asOf + ' 年</span></span>'));
      });
      content.appendChild(box);
    }

    /* 成本估算器入口 */
    if (node.cost) {
      const costBtn = el("a", "card-cost-link", icon("cost") + '打开成本估算器（TCO 账链）→');
      costBtn.href = "#/cost";
      content.appendChild(costBtn);
    }

    /* children */
    if (node.children && node.children.length) {
      content.appendChild(el("div", "card-section-label", advanced ? "逐项展开" : "点开看看，里面还有什么"));
      const box = el("div", "card-children");
      node.children.forEach(ch => {
        const row = el("div", "card-child-row");
        row.setAttribute("role", "button");
        row.setAttribute("tabindex", "0");
        row.setAttribute("aria-label", ch.name + "：" + (ch.brief || ""));
        row.innerHTML = '<span class="cc-text"><span class="cc-name">' + ch.name + '</span>' +
          (ch.brief ? '<span class="cc-brief">' + ch.brief + '</span>' : '') + '</span><span class="cc-arrow">›</span>';
        const openIt = () => App.openNode(station.id, pathIds.concat(ch.id));
        row.addEventListener("click", openIt);
        row.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openIt(); } });
        box.appendChild(row);
      });
      content.appendChild(box);
    }

    /* detail */
    if (!concept && node.detail) {
      const det = el("details", "card-detail");
      det.innerHTML = '<summary><span class="chev">›</span>技术细节（想深入再点）</summary>' +
        '<div class="detail-body">' + node.detail + '</div>';
      content.appendChild(det);
    }

    /* faq */
    if (node.faq && node.faq.length) {
      const faq = el("div", "card-faq");
      node.faq.forEach(f => faq.appendChild(el("div", "faq-item", '<div class="faq-q">' + f.q + '</div><div class="faq-a">' + f.a + '</div>')));
      content.appendChild(faq);
    }

    /* related chips（跨站带站点色点）*/
    if (node.related && node.related.length) {
      content.appendChild(el("div", "card-section-label subtle", "相关"));
      const rel = el("div", "card-related");
      node.related.forEach(ref => {
        const target = resolveRelated(station, ref);
        if (!target) return;
        const chip = el("button", "related-chip", '<span class="rc-dot" style="background:' + target.color + '"></span>' + target.name);
        chip.addEventListener("click", () => App.openNode(target.stationId, target.pathIds));
        rel.appendChild(chip);
      });
      content.appendChild(rel);
    }

    return content;
  }

  function buildV4Knowledge(content, concept) {
    const review = concept.review || {};
    const status = review.status === "reviewed" ? "专业复核" : review.status === "source-checked" ? "来源已核对" : "待专业复核";
    const head = el("div", "v4-card-status");
    head.innerHTML = '<span class="v4-card-mark">L0–L3 分层知识</span>' +
      '<span class="v4-review ' + (review.status === "reviewed" || review.status === "source-checked" ? "ok" : "") + '">' + status +
      (review.lastReviewed ? ' · ' + esc(review.lastReviewed) : '') + '</span>';
    content.appendChild(head);

    const levels = concept.levels || {};
    const role = App.store.role();
    const savedDepth = App.store.depth && App.store.depth();
    const preferred = savedDepth || (role === "manage" ? "l0" : role === "tech" ? "l2" : "l1");
    const available = ["l0", "l1", "l2", "l3"].filter(key => levels[key]);
    const current = available.indexOf(preferred) >= 0 ? preferred : available[0];
    const labels = { l0: ["L0", "30 秒"], l1: ["L1", "原理"], l2: ["L2", "取舍"], l3: ["L3", "实践"] };

    const learning = el("section", "v4-learning");
    const tabs = el("div", "v4-level-tabs");
    tabs.setAttribute("role", "group");
    tabs.setAttribute("aria-label", "知识深度");
    const panel = el("div", "v4-level-panel");
    panel.setAttribute("aria-live", "polite");

    function selectLevel(key) {
      tabs.querySelectorAll("button").forEach(btn => btn.setAttribute("aria-pressed", btn.dataset.level === key ? "true" : "false"));
      const level = levels[key];
      panel.innerHTML = '<div class="v4-level-kicker">' + esc((labels[key] || [key, ""])[0]) + ' · ' + esc(level.title || "分层理解") + '</div>' +
        '<div class="v4-level-text">' + esc(level.text || "") + '</div>';
      if (level.prompt) panel.appendChild(el("div", "v4-level-prompt", '<span>想一想</span>' + esc(level.prompt)));
      if (App.store.setDepth) App.store.setDepth(key);
    }

    available.forEach(key => {
      const btn = el("button", "v4-level-btn");
      btn.type = "button";
      btn.dataset.level = key;
      btn.setAttribute("aria-pressed", key === current ? "true" : "false");
      btn.innerHTML = '<b>' + labels[key][0] + '</b><small>' + labels[key][1] + '</small>';
      btn.addEventListener("click", () => selectLevel(key));
      tabs.appendChild(btn);
    });
    learning.appendChild(tabs);
    learning.appendChild(panel);
    content.appendChild(learning);
    selectLevel(current);

    if (concept.claimIds && concept.claimIds.length) {
      content.appendChild(el("div", "card-section-label", "关键事实与口径"));
      const claims = el("div", "v4-claims");
      concept.claimIds.forEach(id => {
        const claim = v4Claim(id);
        if (!claim) return;
        const item = el("div", "v4-claim");
        item.innerHTML = '<div class="v4-claim-value">' + esc(claim.value) + '</div>' +
          '<div class="v4-claim-context">' + esc(claim.context || "") + '</div>' +
          '<div class="v4-claim-asof">口径：' + esc(claim.asOf || "稳定定义") +
          (claim.maturity ? ' · ' + esc(claim.maturity) : '') + '</div>';
        claims.appendChild(item);
      });
      content.appendChild(claims);
    }

    if (concept.tradeoffs && concept.tradeoffs.length) content.appendChild(buildV4Fold("工程取舍", concept.tradeoffs, "tradeoff"));
    if (concept.misconceptions && concept.misconceptions.length) content.appendChild(buildV4Fold("常见误区", concept.misconceptions, "warning"));

    const sourceIds = concept.sourceIds || [];
    if (sourceIds.length) {
      const details = el("details", "v4-sources");
      details.innerHTML = '<summary><span class="chev">›</span>来源与成熟度 <span class="v4-source-count">' + sourceIds.length + '</span></summary>';
      const list = el("div", "v4-source-list");
      sourceIds.forEach(id => {
        const source = v4Source(id);
        if (!source) return;
        const link = el("a", "v4-source-item");
        link.href = source.url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.innerHTML = '<span class="v4-source-type">' + esc(source.type || "来源") + '</span>' +
          '<span class="v4-source-title">' + esc(source.title) + '</span>' +
          '<span class="v4-source-date">' + esc(source.publisher || "") +
          (source.publishedAt ? ' · ' + esc(source.publishedAt) : '') + '</span>';
        list.appendChild(link);
      });
      details.appendChild(list);
      if (review.ownerRole || review.nextReview) {
        details.appendChild(el("div", "v4-review-note",
          '<span>维护角色：' + esc(review.ownerRole || "待指定") + '</span>' +
          (review.nextReview ? '<span>下次复核：' + esc(review.nextReview) + '</span>' : '')));
      }
      content.appendChild(details);
    }
  }

  function buildV4Fold(title, items, tone) {
    const details = el("details", "v4-fold " + (tone || ""));
    details.innerHTML = '<summary><span class="chev">›</span>' + esc(title) + '<span class="v4-fold-count">' + items.length + '</span></summary>' +
      '<ul>' + items.map(item => '<li>' + esc(item) + '</li>').join("") + '</ul>';
    return details;
  }

  function resolveRelated(station, ref) {
    if (ref.indexOf("/") >= 0) {
      const [stId, nodeId] = ref.split("/");
      const st = DATA.stations.find(s => s.id === stId);
      if (!st) return null;
      const path = findNodePath(st, nodeId);
      if (!path) return null;
      return { stationId: stId, pathIds: path, name: nodeByPath(st, path).name, color: st.color };
    } else {
      const path = findNodePath(station, ref);
      if (!path) return null;
      return { stationId: station.id, pathIds: path, name: nodeByPath(station, path).name, color: station.color };
    }
  }

  function copyLink(hash) {
    const url = location.origin + location.pathname + hash;
    const done = () => App.toast("链接已复制");
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(done).catch(() => fallbackCopy(url, done));
    else fallbackCopy(url, done);
  }
  function fallbackCopy(text, done) {
    const ta = document.createElement("textarea");
    ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); done(); } catch (e) {} finally { ta.remove(); }
  }

  /* ============================ 测验 ============================ */
  function buildQuiz(station) {
    const details = el("details", "quiz-block");
    const already = App.store.badged(station.id);
    const summary = el("summary", "quiz-summary");
    summary.innerHTML = '<span class="chev">›</span>本站小测 · ' + station.quiz.length + ' 题' +
      '<span class="quiz-badge-mini' + (already ? " done" : "") + '">' +
      (already
        ? '<svg width="13" height="13" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1l1.9 3.9 4.3.6-3.1 3 .7 4.3L8 10.8 4.2 12.8l.7-4.3-3.1-3 4.3-.6z" fill="currentColor"/></svg>已获徽章'
        : '全部答对得徽章') + '</span>';
    details.appendChild(summary);

    const body = el("div", "quiz-body");
    const correctFlags = station.quiz.map(() => false);

    station.quiz.forEach((q, qi) => {
      const qBlock = el("div", "quiz-q");
      qBlock.innerHTML = '<div class="q-text"><span class="q-idx">' + (qi + 1) + '.</span>' + q.q +
        (q.kind ? '<span class="q-kind">' + esc(q.kind) + '</span>' : '') + '</div>';
      const opts = el("div", "quiz-options");
      const fb = el("div", "quiz-feedback");
      q.options.forEach((opt, oi) => {
        const btn = el("button", "quiz-opt");
        btn.innerHTML = '<span class="opt-mark">' + String.fromCharCode(65 + oi) + '</span><span>' + opt + '</span>';
        btn.addEventListener("click", () => {
          if (correctFlags[qi]) return;
          opts.querySelectorAll(".quiz-opt").forEach(b => b.classList.remove("wrong"));
          if (oi === q.answer) {
            btn.classList.add("correct");
            btn.querySelector(".opt-mark").textContent = "✓";
            correctFlags[qi] = true;
            opts.querySelectorAll(".quiz-opt").forEach(b => { b.disabled = true; });
            fb.className = "quiz-feedback ok show";
            fb.innerHTML = '<span class="fb-title">答对了</span><span class="fb-explain">' + q.explain + '</span>';
            App.announce("答对了");
            if (correctFlags.every(Boolean)) {
              App.earnBadge(station.id);
              const mini = details.querySelector(".quiz-badge-mini");
              if (mini) { mini.classList.add("done"); mini.innerHTML = '<svg width="13" height="13" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1l1.9 3.9 4.3.6-3.1 3 .7 4.3L8 10.8 4.2 12.8l.7-4.3-3.1-3 4.3-.6z" fill="currentColor"/></svg>已获徽章'; }
            }
          } else {
            btn.classList.add("wrong");
            fb.className = "quiz-feedback no show";
            fb.innerHTML = '<span class="fb-title">再想想</span><span class="fb-explain">' + q.explain + '</span>';
            App.announce("答错了，再想想");
          }
        });
        opts.appendChild(btn);
      });
      qBlock.appendChild(opts);
      qBlock.appendChild(fb);
      body.appendChild(qBlock);
    });

    details.appendChild(body);
    return details;
  }

  /* ============================ 术语表 ============================ */
  // 术语表由 canonical concepts 自动生成（单一定义源，V4）；无 v4 时回退旧表
  function glossaryItems() {
    const v4 = DATA.v4;
    if (v4 && v4.concepts) {
      const routeMap = {}, stMap = {};
      Object.values(v4.legacyPlacements || {}).forEach(p => {
        if (p.kind === "concept" && p.conceptId && !routeMap[p.conceptId]) {
          routeMap[p.conceptId] = p.legacyRoute || ("#/s/" + p.stationId + "/" + (p.legacyPath || []).join("/"));
          stMap[p.conceptId] = p.stationId;
        }
      });
      const order = DATA.stations.map(s => s.id);
      return Object.values(v4.concepts).map(c => {
        const l0 = c.levels && c.levels.l0 && c.levels.l0.text || "";
        return {
          term: c.canonicalName, aliases: (c.aliases || []).slice(0, 4), plain: l0,
          station: stMap[c.id], hash: routeMap[c.id],
          hay: (c.canonicalName + " " + (c.aliases || []).join(" ") + " " + (c.tags || []).join(" ") + " " + l0).toLowerCase()
        };
      }).filter(x => x.hash).sort((a, b) => order.indexOf(a.station) - order.indexOf(b.station));
    }
    return (DATA.glossary || []).map(g => ({ term: g.term, plain: g.plain, analogy: g.analogy, hash: "#/" + g.path, hay: (g.term + " " + g.plain + " " + g.analogy).toLowerCase() }));
  }

  function buildGlossary() {
    const wrap = el("div", "glossary-page");
    const items = glossaryItems();
    const fromV4 = !!(DATA.v4 && DATA.v4.concepts);
    wrap.innerHTML = '<h2>术语表</h2><div class="gl-sub">' +
      (fromV4 ? '全部 <b>' + items.length + '</b> 个术语由规范概念库<b>自动生成</b>（单一定义源，不再维护第二份定义）。点词条打开完整 L0–L3 知识卡。' : '术语只作标签，解释一律人话＋类比。点击词条跳到对应知识卡。') + '</div>' +
      '<input class="gl-search" id="glSearch" type="search" placeholder="搜索术语 / 别名 / 解释…" aria-label="搜索术语">' +
      '<div class="gl-count" id="glCount"></div>';
    const grid = el("div", "gl-grid");
    wrap.appendChild(grid);

    function render(filter) {
      grid.innerHTML = "";
      const f = (filter || "").trim().toLowerCase();
      const list = items.filter(g => !f || g.hay.indexOf(f) >= 0);
      const cnt = wrap.querySelector("#glCount"); if (cnt) cnt.textContent = list.length + " / " + items.length + " 个术语";
      if (!list.length) { grid.appendChild(el("div", "gl-empty", "没有匹配的术语")); return; }
      list.forEach(g => {
        const st = g.station && DATA.stations.find(s => s.id === g.station);
        const card = el("div", "gl-card");
        card.innerHTML = '<div class="gl-term">' + esc(g.term) +
          (g.aliases && g.aliases.length ? '<span class="gl-alias">' + esc(g.aliases.join(" · ")) + '</span>' : '') + '</div>' +
          '<div class="gl-plain">' + esc(g.plain) + '</div>' +
          (st ? '<div class="gl-domain" style="--gc:' + st.color + '"><span class="gl-dot"></span>' + esc(st.name) + '</div>'
              : (g.analogy ? '<div class="gl-analogy">打个比方：' + esc(g.analogy) + '</div>' : ''));
        card.setAttribute("role", "link"); card.setAttribute("tabindex", "0");
        card.setAttribute("aria-label", g.term + "：" + g.plain);
        const goPath = () => App.go(g.hash);
        card.addEventListener("click", goPath);
        card.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); goPath(); } });
        grid.appendChild(card);
      });
    }
    render("");
    const inp = wrap.querySelector("#glSearch");
    if (inp) inp.addEventListener("input", e => render(e.target.value));
    return wrap;
  }

  /* ============================ 场景库 ============================ */
  function buildScenarios() {
    const wrap = el("div", "scenarios-page");
    wrap.innerHTML = '<h2>场景库</h2><div class="page-sub">把抽象知识落到客户场景：一条“路线”串起若干知识卡，点“播放路线”按顺序打开。文案为培训示意，正式对客口径以工程团队为准。</div>';
    const grid = el("div", "scenario-grid");
    (DATA.scenarios || []).forEach(sc => {
      const card = el("div", "scenario-card");
      const steps = sc.path.map(p => hashLabel(p)).filter(Boolean);
      card.innerHTML =
        '<div class="scn-title">' + icon(sc.icon && Icons[sc.icon] ? sc.icon : "scenario") + sc.title + '</div>' +
        '<div class="scn-need">' + sc.need + '</div>' +
        '<div class="scn-route">' + steps.map((s, i) => '<span class="scn-step"><span class="scn-idx">' + (i + 1) + '</span>' + s.label + '</span>').join('<span class="scn-arrow">→</span>') + '</div>' +
        '<div class="scn-take">关键结论：' + sc.takeaway + '</div>' +
        '<div class="scn-actions"><button class="btn-primary scn-play">' + icon("play") + '播放路线</button></div>';
      card.querySelector(".scn-play").addEventListener("click", () => playScenario(sc));
      grid.appendChild(card);
    });
    wrap.appendChild(grid);
    return wrap;
  }

  function hashLabel(p) {
    // p like "s/delivery/private" → resolve label
    const parts = p.split("/");
    if (parts[0] !== "s") return { hash: "#/" + p, label: p };
    const st = DATA.stations.find(s => s.id === parts[1]);
    if (!st) return null;
    let label = st.name;
    if (parts.length > 2) {
      const node = nodeByPath(st, parts.slice(2));
      if (node) label = node.name;
    }
    return { hash: "#/" + p, label: label };
  }

  let scnBar = null;
  function playScenario(sc) {
    if (scnBar) scnBar.remove();
    const steps = sc.path.slice();
    let i = 0;
    scnBar = el("div", "scenario-player");
    document.body.appendChild(scnBar);
    function draw() {
      const lbl = hashLabel(steps[i]);
      scnBar.innerHTML =
        '<span class="sp-title">' + sc.title + '</span>' +
        '<span class="sp-step">第 ' + (i + 1) + '/' + steps.length + ' 步 · ' + (lbl ? lbl.label : "") + '</span>' +
        '<div class="sp-ctrl">' +
          '<button class="btn-secondary sp-prev"' + (i === 0 ? " disabled" : "") + '>← 上一步</button>' +
          (i < steps.length - 1 ? '<button class="btn-primary sp-next">下一步 →</button>' : '<button class="btn-primary sp-done">完成</button>') +
          '<button class="sp-close" aria-label="退出路线">✕</button>' +
        '</div>';
      scnBar.querySelector(".sp-prev").addEventListener("click", () => { if (i > 0) { i--; App.go(hashLabel(steps[i]).hash); draw(); } });
      const nx = scnBar.querySelector(".sp-next");
      if (nx) nx.addEventListener("click", () => { if (i < steps.length - 1) { i++; App.go(hashLabel(steps[i]).hash); draw(); } });
      const dn = scnBar.querySelector(".sp-done");
      if (dn) dn.addEventListener("click", stop);
      scnBar.querySelector(".sp-close").addEventListener("click", stop);
    }
    function stop() { if (scnBar) { scnBar.remove(); scnBar = null; } }
    App.go(hashLabel(steps[0]).hash);
    draw();
  }

  /* ============================ 知识图谱 ============================ */
  function buildGraph() {
    const wrap = el("div", "graph-page");
    wrap.innerHTML = '<h2>知识图谱</h2><div class="page-sub">把跨站关系画成一张网：节点按站点色分簇，连线表示“相关”。点节点开对应知识卡。</div>';
    const holder = el("div", "graph-holder");
    wrap.appendChild(holder);

    // 收集重点节点（有 related 的、或每站前 2 个）+ 站点中心
    const W = 960, H = 620, cx = W / 2, cy = H / 2;
    const nodes = [], nodeMap = {};
    const sts = DATA.stations;
    const ringR = 250;
    sts.forEach((s, si) => {
      const ang = -Math.PI / 2 + si * (2 * Math.PI / sts.length);
      const sx = cx + ringR * Math.cos(ang), sy = cy + ringR * Math.sin(ang);
      const sc = { id: "s/" + s.id, label: s.name, color: s.color, x: sx, y: sy, r: 24, station: true, hash: "#/s/" + s.id };
      nodes.push(sc); nodeMap[sc.id] = sc;
      // 子节点绕站点小圈
      const kids = s.nodes.slice(0, 4);
      kids.forEach((n, ki) => {
        const a2 = ang + (ki - (kids.length - 1) / 2) * 0.42;
        const r2 = 78;
        const nn = { id: "s/" + s.id + "/" + n.id, label: n.name, color: s.color, x: sx + r2 * Math.cos(a2), y: sy + r2 * Math.sin(a2), r: 6, hash: "#/s/" + s.id + "/" + n.id, parent: sc.id };
        nodes.push(nn); nodeMap[nn.id] = nn;
      });
    });
    // 边：站点↔子节点 + related 跨站
    const edges = [];
    nodes.forEach(n => { if (n.parent) edges.push({ a: n.parent, b: n.id, kind: "own" }); });
    sts.forEach(s => {
      (function walk(list) {
        list.forEach(n => {
          (n.related || []).forEach(ref => {
            const t = resolveRelated(s, ref);
            if (!t) return;
            const from = "s/" + s.id + "/" + n.id;
            const to = "s/" + t.stationId + "/" + t.pathIds[0];
            if (nodeMap[from] && nodeMap[to]) edges.push({ a: from, b: to, kind: "rel" });
          });
          if (n.children) walk(n.children);
        });
      })(s.nodes);
    });

    let svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" class="graph-svg" role="img" aria-label="知识图谱">';
    edges.forEach(e => {
      const a = nodeMap[e.a], b = nodeMap[e.b];
      if (!a || !b) return;
      svg += '<line x1="' + a.x + '" y1="' + a.y + '" x2="' + b.x + '" y2="' + b.y + '" stroke="' + (e.kind === "rel" ? "var(--accent-line)" : "var(--line)") + '" stroke-width="' + (e.kind === "rel" ? 1.6 : 1) + '"' + (e.kind === "rel" ? ' stroke-dasharray="4 4"' : '') + '/>';
    });
    nodes.forEach(n => {
      svg += '<g class="gnode" data-hash="' + n.hash + '" role="button" tabindex="0" aria-label="' + esc(n.label) + '" style="--gc:' + n.color + '">' +
        '<circle cx="' + n.x + '" cy="' + n.y + '" r="' + n.r + '" fill="var(--panel)" stroke="' + n.color + '" stroke-width="' + (n.station ? 2 : 1.4) + '"/>' +
        '<text x="' + n.x + '" y="' + (n.station ? n.y + 4 : n.y - n.r - 4) + '" class="gnode-label' + (n.station ? " gnode-station" : "") + '" text-anchor="middle">' + esc(n.label) + '</text></g>';
    });
    svg += '</svg>';
    holder.innerHTML = svg;
    holder.querySelectorAll(".gnode").forEach(g => {
      const h = g.dataset.hash;
      g.addEventListener("click", () => App.go(h));
      g.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); App.go(h); } });
    });
    return wrap;
  }

  /* ============================ 成本估算器 ============================ */
  function buildCost() {
    const cm = DATA.costModel;
    const wrap = el("div", "cost-page");
    wrap.innerHTML = '<h2>成本估算器 · TCO 账链</h2>' +
      '<div class="page-sub">把「卡→电→利用率→每百万 Token 成本→定价」串成一条可视账链。这是骨架：滑块与联动可用，' +
      '结果为<b>示意值</b>（基于公开行业口径），仅供培训演示，正式对客口径以工程团队为准。</div>';

    const grid = el("div", "cost-grid");
    // 输入
    const inputs = el("div", "cost-inputs");
    inputs.innerHTML = '<div class="cost-card-title">输入条件</div>';
    cm.inputs.forEach(inp => {
      const row = el("div", "cost-input-row");
      if (inp.type === "select") {
        row.innerHTML = '<label>' + inp.label + '</label>' +
          '<div class="seg" data-in="' + inp.id + '">' + inp.options.map((o, i) =>
            '<button class="seg-btn' + (i === (inp.value || 0) ? " on" : "") + '" data-v="' + i + '">' + o + '</button>').join("") + '</div>';
      } else {
        row.innerHTML = '<label>' + inp.label + '<span class="slider-val mono" data-out="' + inp.id + '">' + inp.value + (inp.suffix || "") + '</span></label>' +
          '<input type="range" class="slider" data-in="' + inp.id + '" min="' + inp.min + '" max="' + inp.max + '" step="' + inp.step + '" value="' + inp.value + '">';
      }
      inputs.appendChild(row);
    });
    grid.appendChild(inputs);

    // 输出（账链）
    const outputs = el("div", "cost-outputs");
    outputs.innerHTML = '<div class="cost-card-title">估算账链</div>' +
      '<div class="tco-chain">' +
        ['卡成本', '电费 / PUE', '折旧', '利用率', '每百万 Token 成本', '定价与毛利'].map((s, i, arr) =>
          '<span class="tco-node">' + s + '</span>' + (i < arr.length - 1 ? '<span class="tco-link">→</span>' : '')).join("") +
      '</div>' +
      '<div class="cost-results">' + cm.outputs.map(o =>
        '<div class="cost-result"><span class="cr-label">' + o.label + '</span><span class="cr-val mono" data-res="' + o.id + '">—</span></div>').join("") + '</div>' +
      '<div class="cost-formula">估算口径：<code>' + cm.formula + '</code></div>' +
      '<div class="cost-disclaimer">' + cm.disclaimer + '</div>' +
      '<div class="cost-links">相关：<a href="#/s/token/pricing">成本 → 定价</a> · <a href="#/s/dc/cooling/pue">PUE</a> · <a href="#/s/ops/monitor/utilization">利用率</a></div>';
    grid.appendChild(outputs);
    wrap.appendChild(grid);

    // 交互：输出示意值（基于公开行业口径，仅供演示；正式口径以工程团队为准）
    function segVal(id) { const b = wrap.querySelector('.seg[data-in="' + id + '"] .seg-btn.on'); return b ? +b.dataset.v : 0; }
    function slVal(id) { const s = wrap.querySelector('.slider[data-in="' + id + '"]'); return s ? +s.value : 0; }
    function setRes(id, txt) { const r = wrap.querySelector('[data-res="' + id + '"]'); if (r) { r.textContent = txt; r.classList.remove("pending"); } }
    function recompute() {
      const s = segVal("scale"), train = segVal("mode") === 0, c = slVal("concurrency"), u = slVal("util") || 60;
      const cards = train ? [8, 128, 1024][s] : Math.max(1, Math.ceil(c / [500, 150, 40][s]));
      const kw = cards * 1.2; // ≈1.2 kW/卡（Blackwell 级，口径 2026）
      setRes("cards", "≈ " + cards + " 张");
      setRes("power", "≈ " + (kw >= 1000 ? (kw / 1000).toFixed(1) + " MW" : Math.round(kw) + " kW"));
      setRes("cycle", train ? ["数天", "数周", "数周–数月"][s] : ["分钟级", "小时级", "天级"][s]);
      const base = [0.3, 0.9, 2.5][s]; // 每百万 Token 参考价（60% 利用率，美元）
      setRes("tokencost", train ? "—（训练按卡时计）" : "≈ $" + (base * 60 / u).toFixed(2) + " /百万 Token");
    }
    wrap.querySelectorAll(".slider").forEach(sl => {
      sl.addEventListener("input", () => {
        const out = wrap.querySelector('[data-out="' + sl.dataset.in + '"]');
        const inp = cm.inputs.find(x => x.id === sl.dataset.in);
        if (out) out.textContent = sl.value + (inp && inp.suffix ? inp.suffix : "");
        recompute();
      });
    });
    wrap.querySelectorAll(".seg[data-in] .seg-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const g = btn.parentElement;
        g.querySelectorAll(".seg-btn").forEach(b => b.classList.remove("on"));
        btn.classList.add("on"); recompute();
      });
    });
    recompute();
    return wrap;
  }

  /* ============================ 404 ============================ */
  function buildNotFound() {
    const wrap = el("div", "empty-page");
    wrap.innerHTML =
      '<svg viewBox="0 0 120 120" class="empty-art" aria-hidden="true">' +
        '<circle cx="60" cy="60" r="46" fill="none" stroke="var(--line-2)" stroke-width="2"/>' +
        '<path d="M40 52 L52 64 M52 52 L40 64" stroke="var(--red)" stroke-width="2.5" stroke-linecap="round"/>' +
        '<path d="M80 52 L68 64 M68 52 L80 64" stroke="var(--red)" stroke-width="2.5" stroke-linecap="round"/>' +
        '<path d="M44 82 q16 -12 32 0" fill="none" stroke="var(--line-2)" stroke-width="2.5" stroke-linecap="round"/>' +
      '</svg>' +
      '<h2>这条路走岔了</h2>' +
      '<p>没有找到这个页面。回到主线，从一张显卡重新出发。</p>' +
      '<div class="empty-actions"><a class="btn-primary" href="#/">回到首页</a><button class="btn-secondary" id="np-search">打开搜索</button></div>';
    wrap.querySelector("#np-search").addEventListener("click", () => App.openPalette());
    return wrap;
  }

  /* ============================ 首运欢迎 / 导览 ============================ */
  function startWelcome(force) {
    if (!force && App.store.tourDone()) return;
    const overlay = document.getElementById("overlay");
    overlay.innerHTML = "";
    const modal = el("div", "welcome-modal");
    modal.innerHTML =
      '<div class="wel-badge">' + icon("model") + '</div>' +
      '<h2>欢迎来到「算力之旅」</h2>' +
      '<p>一张可以不断点开的算力建设全景地图——从一张显卡，到一朵能对外卖 Token 的云。先选一个身份，我们帮你把入口排好：</p>' +
      '<div class="role-cards">' +
        roleCard("sales", "销售 / 售前", "场景库 · 决策树 · 导览") +
        roleCard("manage", "职能 / 管理", "一分钟看懂 · 主线") +
        roleCard("tech", "技术新人", "知识图谱 · 深层卡片 · 测验") +
      '</div>' +
      '<div class="wel-actions"><button class="btn-secondary" id="welSkip">先随便逛逛</button><button class="btn-primary" id="welTour">带我走一遍</button></div>';
    overlay.appendChild(modal);
    overlay.hidden = false;
    modal.querySelectorAll(".role-card").forEach(rc => {
      rc.addEventListener("click", () => {
        const r = rc.dataset.role;
        App.store.setRole(r); App.applyRole(r);
        modal.querySelectorAll(".role-card").forEach(x => x.classList.remove("sel"));
        rc.classList.add("sel");
      });
    });
    modal.querySelector("#welSkip").addEventListener("click", () => { App.store.setTourDone(); closeOverlay(); if (App.state.route === "home") App.render(); });
    modal.querySelector("#welTour").addEventListener("click", () => { App.store.setTourDone(); closeOverlay(); startTour(); });
    overlay.addEventListener("click", e => { if (e.target === overlay) { App.store.setTourDone(); closeOverlay(); } });
  }
  function roleCard(id, title, sub) {
    return '<button class="role-card" data-role="' + id + '"><span class="rc-title">' + title + '</span><span class="rc-sub">' + sub + '</span></button>';
  }

  /* 轻量导览：按脚本依次跳转 + 顶部提示条 */
  const TOUR = [
    { hash: "#/", text: "这是主线全景：从一张显卡，到一朵能卖 Token 的云。每一段都能点。" },
    { hash: "#/s/gpu/vram", text: "看一张卡，第一个要看的数字是显存——它决定模型放不放得下。" },
    { hash: "#/s/server/gpu8/why8", text: "8 张卡是当前的“标准积木”（进阶里看它如何上移到机架级超节点）。" },
    { hash: "#/s/network/computenet", text: "上千台机器靠“计算网”像一台机器一样协同。" },
    { hash: "#/s/model/inference", text: "推理层别有洞天——一整套让服务又快又省的技术。" },
    { hash: "#/s/token/pricing", text: "我们这门生意的闭环：把成本摊到每百万 Token，定价卖出去。" },
    { hash: "#/s/delivery", text: "四种交付方式，用一棵决策树帮客户选。" }
  ];
  let tourBar = null, tourIdx = 0;
  function startTour() {
    stopTour();
    tourIdx = 0;
    tourBar = el("div", "tour-bar");
    document.body.appendChild(tourBar);
    drawTour();
  }
  function drawTour() {
    const step = TOUR[tourIdx];
    App.go(step.hash);
    tourBar.innerHTML =
      '<span class="tour-count">导览 ' + (tourIdx + 1) + '/' + TOUR.length + '</span>' +
      '<span class="tour-text">' + step.text + '</span>' +
      '<div class="tour-ctrl">' +
        '<button class="btn-secondary tour-prev"' + (tourIdx === 0 ? " disabled" : "") + '>上一步</button>' +
        (tourIdx < TOUR.length - 1 ? '<button class="btn-primary tour-next">下一步</button>' : '<button class="btn-primary tour-fin">完成</button>') +
        '<button class="tour-close" aria-label="退出导览">✕</button>' +
      '</div>';
    tourBar.querySelector(".tour-prev").addEventListener("click", () => { if (tourIdx > 0) { tourIdx--; drawTour(); } });
    const nx = tourBar.querySelector(".tour-next");
    if (nx) nx.addEventListener("click", () => { if (tourIdx < TOUR.length - 1) { tourIdx++; drawTour(); } });
    const fn = tourBar.querySelector(".tour-fin");
    if (fn) fn.addEventListener("click", stopTour);
    tourBar.querySelector(".tour-close").addEventListener("click", stopTour);
  }
  function stopTour() { if (tourBar) { tourBar.remove(); tourBar = null; } }

  /* ============================ 徽章动画 ============================ */
  function animateBadge(stationId) {
    const stop = document.querySelector('.metro-stop[data-station-id="' + App.cssEscape(stationId) + '"]');
    if (!stop) return;
    const dot = stop.querySelector(".metro-dot");
    if (App.reducedMotion() || !dot.animate) return;
    dot.animate(
      [{ transform: "scale(1)" }, { transform: "scale(1.15)", offset: 0.5 }, { transform: "scale(1)" }],
      { duration: 600, easing: "cubic-bezier(.34,1.56,.64,1)" }
    );
  }

  /* ============================ 结业卡 ============================ */
  function showCertificate() {
    const overlay = document.getElementById("overlay");
    overlay.innerHTML = "";
    const modal = el("div", "cert-modal");
    const W = 560, H = 330, scale = 2;
    const canvas = document.createElement("canvas");
    canvas.width = W * scale; canvas.height = H * scale;
    canvas.style.width = "100%"; canvas.style.height = "auto"; canvas.style.borderRadius = "16px";
    drawCertificate(canvas.getContext("2d"), W, H, scale);
    modal.appendChild(canvas);
    const actions = el("div", "cert-actions");
    const dl = el("button", "btn-primary", "下载 PNG");
    dl.addEventListener("click", () => { const a = document.createElement("a"); a.download = "算力之旅-结业证书.png"; a.href = canvas.toDataURL("image/png"); a.click(); });
    const close = el("button", "btn-secondary", "关闭");
    close.addEventListener("click", closeOverlay);
    actions.appendChild(dl); actions.appendChild(close);
    modal.appendChild(actions);
    overlay.appendChild(modal);
    overlay.hidden = false;
    overlay.addEventListener("click", e => { if (e.target === overlay) closeOverlay(); });
  }

  function drawCertificate(ctx, W, H, s) {
    ctx.scale(s, s);
    ctx.fillStyle = "#0E1626"; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = "#324364"; ctx.lineWidth = 1.5; ctx.strokeRect(16, 16, W - 32, H - 32);
    ctx.strokeStyle = "#26334E"; ctx.strokeRect(24, 24, W - 48, H - 48);
    ctx.textAlign = "center";
    ctx.fillStyle = "#E9F0FB"; ctx.font = "700 30px -apple-system, 'PingFang SC', sans-serif";
    ctx.fillText("算力之旅 · 结业", W / 2, 88);
    ctx.fillStyle = "#A7B7D2"; ctx.font = "15px -apple-system, 'PingFang SC', sans-serif";
    ctx.fillText("已走完从一张显卡到一朵云、直至卖出 Token 的全 " + DATA.stations.length + " 站", W / 2, 118);
    const colors = DATA.stations.map(st => st.color);
    const n = colors.length, gap = 46, startX = W / 2 - (n - 1) * gap / 2, y = 185;
    ctx.strokeStyle = "#324364"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(startX, y); ctx.lineTo(startX + (n - 1) * gap, y); ctx.stroke();
    colors.forEach((c, i) => {
      const x = startX + i * gap;
      ctx.beginPath(); ctx.arc(x, y, 9, 0, Math.PI * 2); ctx.fillStyle = c; ctx.fill();
      ctx.strokeStyle = c; ctx.globalAlpha = 0.35; ctx.lineWidth = 6;
      ctx.beginPath(); ctx.arc(x, y, 12, 0, Math.PI * 2); ctx.stroke(); ctx.globalAlpha = 1;
      ctx.fillStyle = "#6B7C99"; ctx.font = "11px 'SF Mono', monospace"; ctx.fillText(String(i + 1), x, y + 30);
    });
    const d = new Date();
    const date = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
    ctx.fillStyle = "#6B7C99"; ctx.font = "13px 'SF Mono', monospace"; ctx.fillText("完成日期  " + date, W / 2, 252);
    ctx.fillStyle = "#4C8DFF"; ctx.font = "700 14px -apple-system, 'PingFang SC', sans-serif"; ctx.fillText("算力之旅 · 内部学习", W / 2, 282);
  }

  function closeOverlay() {
    const overlay = document.getElementById("overlay");
    overlay.hidden = true; overlay.innerHTML = "";
  }

  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }

  return {
    buildHome, buildStationPage, buildCard, buildQuiz, buildGlossary,
    buildStationNav, wireLinking, animateBadge, showCertificate, closeOverlay,
    buildScenarios, buildGraph, buildCost, buildNotFound, updateRing, startWelcome, Icons, icon
  };
})();
