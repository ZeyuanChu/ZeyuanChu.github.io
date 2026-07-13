/* ========================================================================
   算力之旅 · 舞台渲染器 V3.1（深空全息控制台）
   —— 写实材质 + 全息标注 + 程序化重复件 + 适中动效。信息架构/热区/路由不变。
   插画风格指南（全站遵守）：
     · 光源永远左上 45°：高光在左上缘、AO/阴影落右下。
     · 材质只用 defs() 那一套（金属/PCB/硅/金/玻璃/LED/面板）。
     · 描边降为 0.75–1.5px 的"边缘光"，不再是主视觉；发光只给焦点件。
   每站一个函数，渲染进 mountEl；热区元素带 data-node，点击开知识卡。
   viewBox 统一 0 0 960 600，四周留 24px 安全边。
   ======================================================================== */
window.Stages = (function () {
  "use strict";

  function reduced() {
    if (window.App && App.reducedMotion) return App.reducedMotion();
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }
  function lowQuality() {
    return !!(window.App && App.lowQuality && App.lowQuality());
  }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

  /* ==================================================================
     2.1 材质与光照系统 —— 全站复用的 <defs>（每个 svg 注入一次）
     ================================================================== */
  function ledGrad(id, hot, mid, deep) {
    return '<radialGradient id="' + id + '" cx=".5" cy=".4" r=".6">' +
      '<stop offset="0" stop-color="' + hot + '"/><stop offset=".4" stop-color="' + mid + '"/><stop offset="1" stop-color="' + deep + '"/></radialGradient>';
  }
  const DEFS = '<defs>' +
    /* 面板：跟随主题 */
    '<linearGradient id="mat-panel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--panel-2)"/><stop offset="1" stop-color="var(--panel)"/></linearGradient>' +
    '<linearGradient id="mat-panel2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--surface-3)"/><stop offset="1" stop-color="var(--surface-2)"/></linearGradient>' +
    /* 金属/铝 */
    '<linearGradient id="mat-metal" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5A6B90"/><stop offset=".5" stop-color="#3A4A6C"/><stop offset="1" stop-color="#222D47"/></linearGradient>' +
    '<linearGradient id="mat-metalh" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#41537A"/><stop offset=".5" stop-color="#2A3854"/><stop offset="1" stop-color="#1B2640"/></linearGradient>' +
    /* PCB 深墨绿 */
    '<linearGradient id="mat-pcb" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#164636"/><stop offset="1" stop-color="#0B271F"/></linearGradient>' +
    /* 硅/芯片 die */
    '<radialGradient id="mat-die" cx="34%" cy="28%" r="95%"><stop offset="0" stop-color="#4F7BCF"/><stop offset=".6" stop-color="#20335E"/><stop offset="1" stop-color="#0C1730"/></radialGradient>' +
    /* 金手指/铜 */
    '<linearGradient id="mat-gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F7DD88"/><stop offset="1" stop-color="#A97E28"/></linearGradient>' +
    '<linearGradient id="mat-copper" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E69A6B"/><stop offset="1" stop-color="#8A4F2E"/></linearGradient>' +
    /* 玻璃薄片高光（左上→右下） */
    '<linearGradient id="mat-glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity=".18"/><stop offset=".5" stop-color="#ffffff" stop-opacity=".04"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient>' +
    /* 等距顶盖高光 */
    '<linearGradient id="mat-top" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#54658C"/><stop offset="1" stop-color="#3A4A6C"/></linearGradient>' +
    '<linearGradient id="mat-side" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#243350"/><stop offset="1" stop-color="#141E33"/></linearGradient>' +
    /* 面板通用光影（顶部高光 + 底部 AO 合一） */
    '<linearGradient id="sheen" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity=".16"/><stop offset=".16" stop-color="#ffffff" stop-opacity=".02"/><stop offset=".68" stop-color="#000000" stop-opacity="0"/><stop offset="1" stop-color="#000000" stop-opacity=".26"/></linearGradient>' +
    /* 球体光影：左上高光 + 右下压深 */
    '<radialGradient id="orb-shade" cx=".38" cy=".32" r=".82"><stop offset="0" stop-color="#ffffff" stop-opacity=".5"/><stop offset=".3" stop-color="#ffffff" stop-opacity="0"/><stop offset=".76" stop-color="#000000" stop-opacity="0"/><stop offset="1" stop-color="#000000" stop-opacity=".5"/></radialGradient>' +
    /* 焦点软辉光（径向） */
    '<radialGradient id="glow-accent-r" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="var(--accent)" stop-opacity=".55"/><stop offset="1" stop-color="var(--accent)" stop-opacity="0"/></radialGradient>' +
    /* LED */
    ledGrad("led-green", "#D9FBE8", "#34D399", "#0F7A54") +
    ledGrad("led-amber", "#FFF4D8", "#FBBF24", "#8A5A00") +
    ledGrad("led-red", "#FFE2E2", "#F87171", "#7A1F1F") +
    ledGrad("led-cyan", "#DEFBFF", "#2FD4E6", "#0B6577") +
    '<radialGradient id="led-accent" cx=".5" cy=".4" r=".6"><stop offset="0" stop-color="#ffffff"/><stop offset=".4" stop-color="var(--accent)"/><stop offset="1" stop-color="#0C2A22"/></radialGradient>' +
    /* 滤镜：软投影（只给关键件）+ 焦点 bloom */
    '<filter id="fx-shadow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="#000" flood-opacity=".5"/></filter>' +
    '<filter id="fx-shadow-sm" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#000" flood-opacity=".42"/></filter>' +
    '<filter id="fx-glow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>' +
    '<filter id="fx-noise"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .5 0"/></filter>' +
    '<linearGradient id="fx-scan" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2FD4E6" stop-opacity="0"/><stop offset=".5" stop-color="#B8F8FF" stop-opacity=".7"/><stop offset="1" stop-color="#2FD4E6" stop-opacity="0"/></linearGradient>' +
    '<linearGradient id="fx-volume" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A9F6FF" stop-opacity=".16"/><stop offset="1" stop-color="#2FD4E6" stop-opacity="0"/></linearGradient>' +
    '</defs>';

  /* ==================================================================
     V3.1 程序化生成器 —— 重复件只从公式生成，不手摆
     ================================================================== */
  function fan(cx, cy, r, N, o) {
    N = N || 9; o = o || {};
    const blade = "M0 0 Q " + (r * .5) + " " + (-r * .16) + " " + (r * .9) + " " + (-r * .05) +
      " Q " + (r * .55) + " " + (r * .14) + " 0 0 Z";
    let blades = "";
    for (let i = 0; i < N; i++) blades += '<path d="' + blade + '" transform="rotate(' + (i * 360 / N) + ')" fill="' + (o.blade || "#33425F") + '"/>';
    return '<g class="fan-assembly" transform="translate(' + cx + ',' + cy + ')">' +
      '<circle class="shape" r="' + r + '" fill="#141D30" stroke="#52658D" stroke-width="1"/>' +
      '<circle r="' + (r * .84) + '" fill="none" stroke="#0B1220" stroke-width="3" opacity=".9"/>' +
      '<g class="fan-blades">' + blades + '</g>' +
      '<circle r="' + (r * .22) + '" fill="url(#mat-metal)" stroke="#63749A" stroke-width=".8"/>' +
      '<circle cx="' + (-r * .07) + '" cy="' + (-r * .08) + '" r="' + (r * .055) + '" fill="#fff" opacity=".22"/>' +
      '</g>';
  }

  function fins(x, y, w, h, N) {
    N = Math.max(1, Math.min(N || 10, 14));
    let s = ""; const gap = w / N;
    for (let i = 0; i < N; i++) {
      const fx = x + i * gap;
      s += '<rect class="shape" x="' + fx + '" y="' + y + '" width="' + (gap * .66) + '" height="' + h + '" rx="1" fill="url(#mat-top)"/>' +
        '<rect x="' + fx + '" y="' + y + '" width="1.5" height="' + h + '" fill="#fff" opacity=".16"/>';
    }
    return s;
  }

  function goldFingers(x, y, n, cw, gap) {
    cw = cw || 8; gap = gap || 12;
    let s = '<g class="gold-fingers">';
    for (let i = 0; i < n; i++) s += '<rect x="' + (x + i * gap) + '" y="' + y + '" width="' + cw + '" height="16" rx="1" fill="url(#mat-gold)"/>';
    s += '<rect class="gold-sweep" x="' + x + '" y="' + y + '" width="42" height="16" fill="url(#mat-glass)" opacity=".32"/></g>';
    return s;
  }

  function hbm(x, y, w, h, text) {
    w = w || 54; h = h || 48; text = text || "显存";
    let s = mrect(x, y, w, h, 5, "url(#mat-metal)", { stroke: "rgba(120,160,255,.46)", sw: .9, cls: "shape hbm-unit" });
    s += '<rect x="' + (x + 7) + '" y="' + (y + 7) + '" width="' + (w - 14) + '" height="' + (h - 14) + '" rx="3" fill="url(#mat-die)" opacity=".78"/>';
    s += label(x + w / 2, y + h / 2, text, { size: 8.5, weight: "700", fill: "#DCE7FF", cls: "mono" });
    return s;
  }

  function rackUnit(x, y, w, h, index) {
    const on = index % 4 !== 3;
    return '<rect class="rack-unit" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="1.2" fill="#15213A" stroke="rgba(170,195,235,.18)" stroke-width=".6"/>' +
      '<rect x="' + (x + 3) + '" y="' + (y + 2) + '" width="' + (w - 10) + '" height="1" fill="#fff" opacity=".12"/>' +
      '<circle class="led-breathe" cx="' + (x + w - 4) + '" cy="' + (y + h / 2) + '" r="1.3" fill="' + (on ? "#34D399" : "#FBBF24") + '"/>';
  }

  function particles(pathId, n, color, dur) {
    n = Math.max(1, Math.min(n || 4, 20)); color = color || "#2FD4E6"; dur = dur || 4.8;
    if (reduced()) return "";
    let s = '<g class="path-particles optional-glow" filter="url(#fx-glow)">';
    for (let i = 0; i < n; i++) {
      s += '<circle r="' + (i % 3 === 0 ? 3 : 2) + '" fill="' + color + '">';
      s += '<animateMotion dur="' + dur + 's" begin="-' + ((i * dur / n).toFixed(2)) + 's" repeatCount="indefinite"><mpath href="#' + pathId + '"/></animateMotion>';
      s += '</circle>';
    }
    return s + '</g>';
  }

  /* —— 材质圆角矩形：材质填充 + 一层 sheen（顶高光+底 AO）—— */
  function mrect(x, y, w, h, rx, mat, o) {
    o = o || {};
    const stroke = o.stroke || "rgba(150,180,230,.16)";
    const sw = o.sw != null ? o.sw : 1;
    const filt = o.shadow ? ' filter="url(#fx-shadow' + (o.shadow === "sm" ? "-sm" : "") + ')"' : "";
    const cls = o.cls != null ? o.cls : "shape";
    let g = '<rect' + (cls ? ' class="' + cls + '"' : "") + ' x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + rx + '" fill="' + (mat || "url(#mat-panel)") + '" stroke="' + stroke + '" stroke-width="' + sw + '"' + filt + "/>";
    if (o.sheen !== false) g += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + rx + '" fill="url(#sheen)" pointer-events="none"/>';
    return g;
  }

  /* —— 立体板（带挤出厚度，用于爆炸/堆叠层）—— */
  function slab(x, y, w, h, rx, mat, o) {
    o = o || {};
    const t = o.thick != null ? o.thick : 7;
    let g = '<rect x="' + x + '" y="' + (y + t) + '" width="' + w + '" height="' + h + '" rx="' + rx + '" fill="#0A1120" opacity=".92"' + (o.shadow ? ' filter="url(#fx-shadow)"' : "") + "/>";
    g += mrect(x, y, w, h, rx, mat, { stroke: o.stroke, sw: o.sw, cls: o.cls });
    return g;
  }

  /* —— 球体（径向节点/珠子）—— */
  function orb(cx, cy, r, o) {
    o = o || {};
    const base = o.fill || "var(--accent)";
    const cls = o.cls != null ? o.cls : "shape";
    let g = '<circle' + (cls ? ' class="' + cls + '"' : "") + ' cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + base + '" stroke="rgba(255,255,255,.22)" stroke-width="1"' + (o.shadow ? ' filter="url(#fx-shadow' + (o.shadow === "sm" ? "-sm" : "") + ')"' : "") + "/>";
    g += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="url(#orb-shade)" pointer-events="none"/>';
    return g;
  }

  /* —— LED 状态灯（亮心 + 外晕）—— */
  function led(cx, cy, r, grad) {
    return '<circle cx="' + cx + '" cy="' + cy + '" r="' + (r * 2.4) + '" fill="url(#' + grad + ')" opacity=".45" pointer-events="none"/>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="url(#' + grad + ')"/>';
  }

  /* ==================================================================
     3. 文字与容器规则 —— 统一 label helper（自动底衬/居中/安全边）
     ================================================================== */
  function textW(t, size) {
    let w = 0;
    for (const ch of String(t)) w += /[　-鿿＀-￯]/.test(ch) ? size : (/[A-Za-z0-9]/.test(ch) ? size * 0.56 : size * 0.4);
    return w;
  }
  // label(x, y, text, {anchor, size, fill, weight, plate, cls, style, maxWidth}) —— y 为垂直中心
  function label(x, y, text, o) {
    o = o || {};
    const size = o.size || 12, anchor = o.anchor || "middle";
    const fill = o.fill || "var(--text-2)", weight = o.weight || "400";
    const original = String(text);
    let shown = original;
    if (o.maxWidth && textW(shown, size) > o.maxWidth) {
      while (shown.length > 1 && textW(shown + "…", size) > o.maxWidth) shown = shown.slice(0, -1);
      shown += "…";
    }
    const tw = textW(shown, size), edge = 24, right = 960 - edge, pad = o.plate ? 12 : 0;
    let drawX = x;
    if (anchor === "middle") drawX = Math.max(edge + pad + tw / 2, Math.min(right - pad - tw / 2, x));
    else if (anchor === "end") drawX = Math.max(edge + pad + tw, Math.min(right - pad, x));
    else drawX = Math.max(edge + pad, Math.min(right - pad - tw, x));
    let g = "";
    if (o.plate) {
      const pw = textW(shown, size) + 24, ph = size + 10;
      const px = anchor === "middle" ? drawX - pw / 2 : anchor === "end" ? drawX - pw : drawX;
      g += '<rect x="' + px + '" y="' + (y - ph / 2) + '" width="' + pw + '" height="' + ph + '" rx="' + (ph / 2) + '" fill="rgba(9,14,26,.72)" pointer-events="none"/>';
    }
    g += '<text x="' + drawX + '" y="' + y + '" text-anchor="' + anchor + '" dominant-baseline="central" fill="' + fill + '" font-weight="' + weight + '" font-size="' + size + '" class="stage-text' + (o.cls ? " " + o.cls : "") + '"' + (o.style ? ' style="' + o.style + '"' : "") + ">";
    if (shown !== original) g += '<title>' + esc(original) + '</title>';
    g += esc(shown) + "</text>";
    return g;
  }

  function annot(fromXY, toXY, text, o) {
    o = o || {};
    const fx = fromXY[0], fy = fromXY[1], tx = toXY[0], ty = toXY[1];
    const anchor = o.anchor || (tx < fx ? "end" : "start");
    const lx = tx + (anchor === "end" ? -10 : 10);
    const elbowX = tx + (anchor === "end" ? -5 : 5);
    return '<g class="holo-annot deco" pointer-events="none">' +
      '<path d="M' + fx + ' ' + fy + ' L' + tx + ' ' + ty + ' L' + elbowX + ' ' + ty + '" fill="none" stroke="#2FD4E6" stroke-width=".8" opacity=".78"/>' +
      '<circle cx="' + fx + '" cy="' + fy + '" r="2.4" fill="#2FD4E6" filter="url(#fx-glow)"/>' +
      label(lx, ty, text, { anchor: anchor, size: o.size || 9.5, fill: "#9BEAF3", plate: true, cls: "mono", maxWidth: o.maxWidth || 110 }) +
      '</g>';
  }

  function energyRing(cx, cy, r, o) {
    o = o || {};
    return '<circle class="energy-ring optional-glow' + (o.slow ? ' slow' : '') + '" cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="' + (o.color || "#2FD4E6") + '" stroke-width="' + (o.sw || 1) + '" stroke-dasharray="' + (o.dash || "7 8") + '" opacity="' + (o.opacity || .72) + '" filter="url(#fx-glow)"/>';
  }

  function scanLine(x, y, w, h, dir) {
    if (dir === "h") {
      return '<line class="scan-line scan-line-h optional-glow" x1="' + x + '" y1="' + y + '" x2="' + (x + w) + '" y2="' + y + '" stroke="url(#fx-scan)" stroke-width="2" style="--scan-distance:' + h + 'px"/>';
    }
    return '<line class="scan-line scan-line-v optional-glow" x1="' + x + '" y1="' + y + '" x2="' + x + '" y2="' + (y + h) + '" stroke="#7CECF7" stroke-width="1.4" opacity=".42" style="--scan-distance:' + w + 'px"/>';
  }

  /* 生成一个热区 <g>（字符串），data-node 用于联动 + 点击 */
  function hot(station, nodeId, inner, opts) {
    opts = opts || {};
    const node = station.nodes.find(n => n.id === nodeId);
    const label2 = node ? node.name + "：" + node.brief : nodeId;
    let ring = "";
    if (opts.ring) {
      const r = opts.ring;
      ring = '<rect class="focus-ring" x="' + r.x + '" y="' + r.y + '" width="' + r.w + '" height="' + r.h + '" rx="' + (r.rx || 8) + '"/>';
    }
    return '<g class="hot" data-node="' + nodeId + '" role="button" tabindex="0" aria-label="' + esc(label2) + '">' +
      inner + ring + "</g>";
  }

  function wireHotspots(mount, station) {
    mount.querySelectorAll(".hot[data-node]").forEach(g => {
      const id = g.dataset.node;
      if (g.dataset.wired) return;
      g.dataset.wired = "1";
      g.addEventListener("click", () => App.openNode(station.id, [id]));
      g.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); App.openNode(station.id, [id]); } });
    });
  }

  function svgWrap(inner, extra) {
    return '<svg class="stage-svg" viewBox="0 0 960 600" preserveAspectRatio="xMidYMid meet" ' +
      (extra || "") + ">" + DEFS + inner + "</svg>";
  }

  /* 舞台保持稳定：教学图需要可读的空间关系，不使用随指针倾斜的 2.5D 视差。 */
  function wire3D(mount) {
    const wrap = mount.parentElement;
    if (!wrap) return;
    wrap.classList.remove("stage-3d");
    wrap.classList.add("stage-static");
    mount.style.removeProperty("--rx");
    mount.style.removeProperty("--ry");
  }

  /* ==================================================================
     S1  gpu-closeup —— 显卡俯视特写（PCB/硅/金属/金手指）
     ================================================================== */
  function gpuCloseup(station, mount) {
    const cx = 480, cy = 305;
    let s = "";
    // PCB：底材质 + 左上高光 + 底部 AO + 程序噪点。
    s += mrect(150, 104, 660, 402, 18, "url(#mat-pcb)", { stroke: "rgba(95,225,174,.34)", sw: 1, shadow: true });
    s += '<rect class="noise-layer" x="156" y="110" width="648" height="390" rx="14" filter="url(#fx-noise)" opacity=".045" pointer-events="none"/>';
    s += '<rect x="170" y="124" width="620" height="362" rx="13" fill="none" stroke="rgba(130,232,190,.15)" stroke-width=".8"/>';

    // 公式生成的走线、过孔与四角螺丝。
    s += '<g class="deco" fill="none" stroke="rgba(124,226,184,.18)" stroke-width=".8">';
    for (let i = 0; i < 6; i++) {
      const ty = 144 + i * 61;
      s += '<path d="M178 ' + ty + ' H' + (285 + i * 14) + ' V' + (ty + 18) + ' H355"/>';
      s += '<path d="M782 ' + (ty + 21) + ' H' + (682 - i * 10) + ' V' + (ty + 38) + ' H610"/>';
    }
    s += '</g><g class="deco">';
    for (let i = 0; i < 24; i++) {
      const vx = 180 + (i % 12) * 52, vy = i < 12 ? 134 : 474;
      s += '<circle cx="' + vx + '" cy="' + vy + '" r="2.2" fill="#0A1B17" stroke="rgba(111,233,183,.38)" stroke-width=".7"/>';
    }
    for (let i = 0; i < 4; i++) {
      const sx = i % 2 ? 790 : 170, sy = i > 1 ? 486 : 124;
      s += '<circle cx="' + sx + '" cy="' + sy + '" r="7" fill="url(#mat-metal)" stroke="#6A7DA4" stroke-width=".8"/><path d="M' + (sx - 3) + ' ' + sy + ' h6 M' + sx + ' ' + (sy - 3) + ' v6" stroke="#B7C2D8" stroke-width=".8"/>';
    }
    s += '</g>';

    // 金手指：统一 helper 等距生成。
    s += goldFingers(270, 490, 30, 8, 14);

    // 散热与供电热区：鳍片、铜热管、均匀风扇、VRM、8pin、状态灯。
    let cool = mrect(182, 150, 142, 138, 7, "url(#mat-metal)", { stroke: "rgba(167,190,232,.26)", sw: .9 });
    cool += fins(194, 160, 118, 116, 11);
    cool += '<path d="M196 206 C248 176 296 196 338 230 S388 266 418 238" fill="none" stroke="url(#mat-copper)" stroke-width="10" stroke-linecap="round"/>' +
      '<path d="M197 203 C250 174 298 194 340 228" fill="none" stroke="#FFD0AE" stroke-width="2" opacity=".35" stroke-linecap="round"/>';
    cool += fan(246, 362, 48, 9);

    // 8pin 连接器的 2×4 针脚全部按公式生成。
    for (let c = 0; c < 2; c++) {
      const px = 632 + c * 86;
      cool += mrect(px, 126, 70, 42, 5, "url(#mat-metal)", { stroke: "rgba(166,191,232,.34)", sw: .8 });
      for (let i = 0; i < 8; i++) {
        const ix = px + 8 + (i % 4) * 15, iy = 134 + Math.floor(i / 4) * 14;
        cool += '<rect x="' + ix + '" y="' + iy + '" width="10" height="9" rx="2" fill="#0B1322" stroke="#647596" stroke-width=".6"/>';
      }
    }

    // VRM：电感、电容、MOSFET 均按行列公式铺设。
    for (let i = 0; i < 5; i++) {
      const vy = 222 + i * 43;
      cool += mrect(672, vy, 42, 29, 4, "url(#mat-metalh)", { stroke: "rgba(166,191,232,.28)", sw: .7, shadow: i === 0 ? "sm" : false });
      cool += '<ellipse cx="742" cy="' + (vy + 5) + '" rx="10" ry="4" fill="#6B7890" stroke="#A7B1C5" stroke-width=".6"/>' +
        '<rect x="732" y="' + (vy + 5) + '" width="20" height="24" fill="url(#mat-metal)"/>' +
        '<ellipse cx="742" cy="' + (vy + 29) + '" rx="10" ry="4" fill="#26334E"/>';
      for (let m = 0; m < 2; m++) cool += '<rect x="' + (620 + m * 22) + '" y="' + (vy + 5) + '" width="15" height="19" rx="2" fill="#141D30" stroke="#53668A" stroke-width=".6"/>';
    }
    cool += '<g class="led-breathe">' + led(774, 462, 3.2, "led-green") + '</g>';
    s += hot(station, "cooling", cool);

    // HBM ×4：围绕 GPU 公式化放置，避免手摆间距漂移。
    let vram = "";
    for (let i = 0; i < 4; i++) {
      const vertical = i < 2;
      const hx = vertical ? cx - 29 : (i === 2 ? cx - 158 : cx + 102);
      const hy = vertical ? (i === 0 ? cy - 166 : cy + 116) : cy - 25;
      vram += hbm(hx, hy, 56, 50, "显存" + (i + 1));
    }
    s += hot(station, "vram", vram);

    // GPU ↔ HBM 数据束。
    let bw = '<rect class="shape" x="360" y="190" width="240" height="230" fill="none" pointer-events="none"/>';
    const targets = [[480, 189], [480, 421], [350, 305], [610, 305]];
    for (let i = 0; i < targets.length; i++) {
      const t = targets[i];
      const ex = cx + (t[0] - cx) * .72, ey = cy + (t[1] - cy) * .72;
      bw += '<line x1="' + cx + '" y1="' + cy + '" x2="' + ex + '" y2="' + ey + '" stroke="transparent" stroke-width="12"/>' +
        '<line x1="' + cx + '" y1="' + cy + '" x2="' + ex + '" y2="' + ey + '" stroke="#2FD4E6" stroke-width="6" opacity=".08" stroke-linecap="round"/>' +
        '<line class="shape flow-anim" x1="' + cx + '" y1="' + cy + '" x2="' + ex + '" y2="' + ey + '" stroke="#2FD4E6" stroke-width="1.4"/>';
    }
    s += hot(station, "bandwidth", bw);

    // 核心：金属封装、硅 die、高光、AO、刻字、能量环与扫描线。
    let core = energyRing(cx, cy, 106, { dash: "9 8" });
    core += mrect(cx - 94, cy - 94, 188, 188, 13, "url(#mat-metal)", { stroke: "rgba(170,197,242,.4)", sw: 1, shadow: true });
    core += '<rect class="shape" x="' + (cx - 75) + '" y="' + (cy - 75) + '" width="150" height="150" rx="8" fill="url(#mat-die)" stroke="#7295DF" stroke-width=".9"/>' +
      '<rect x="' + (cx - 75) + '" y="' + (cy - 75) + '" width="150" height="150" rx="8" fill="url(#mat-glass)" pointer-events="none"/>' +
      '<rect x="' + (cx - 69) + '" y="' + (cy + 58) + '" width="138" height="11" rx="3" fill="#050B16" opacity=".18"/>';
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++)
      core += '<rect x="' + (cx - 63 + c * 38) + '" y="' + (cy - 63 + r * 38) + '" width="27" height="27" rx="3" fill="none" stroke="rgba(154,188,255,.2)" stroke-width=".7"/>';
    core += scanLine(cx - 70, cy - 70, 140, 140, "v");
    core += label(cx, cy - 6, "计算核心", { size: 13, weight: "700", fill: "#E5EEFF" });
    core += label(cx, cy + 16, "4 nm · HBM FABRIC", { size: 8.5, fill: "#9DB6E7", cls: "mono" });
    s += hot(station, "core", core, { ring: { x: cx - 101, y: cy - 101, w: 202, h: 202, rx: 16 } });

    // 克制的全息引线层。
    s += annot([cx, cy - 94], [474, 78], "计算芯片");
    s += annot([cx - 130, cy], [326, 92], "显存 × 4", { anchor: "end" });
    s += annot([704, 248], [816, 214], "供电模块");
    s += annot([246, 362], [128, 396], "9-BLADE FAN", { anchor: "end" });
    s += label(150, 542, "点击任意部位，看看它负责什么", { size: 11, fill: "var(--text-3)", anchor: "start" });

    mount.innerHTML = svgWrap(s);
    wireHotspots(mount, station);
    wire3D(mount);
    return null;
  }

  /* ==================================================================
     S2  server-explode —— 8 卡服务器 2.5D 爆炸图（招牌）
     ================================================================== */
  function serverExplode(station, mount) {
    const layers = [];
    const X = 210, W = 480, H = 56;
    const ys = [80, 154, 228, 302, 376, 450];

    // 层 0：GPU × 8 托盘（金属托盘 + 8 die）
    layers.push({ y: ys[0], build: y => {
      let g = slab(X, y, W, H, 7, "url(#mat-metal)", { stroke: "rgba(150,180,230,.24)", shadow: true });
      for (let r = 0; r < 2; r++) for (let c = 0; c < 4; c++) {
        const bx = X + 18 + c * 116, by = y + 8 + r * 22;
        g += '<rect class="shape" x="' + bx + '" y="' + by + '" width="100" height="18" rx="3" fill="url(#mat-die)" stroke="rgba(90,140,255,.5)" stroke-width="1"/>';
        g += '<rect x="' + bx + '" y="' + by + '" width="100" height="7" rx="3" fill="#fff" opacity=".08" pointer-events="none"/>';
      }
      g += label(X - 14, y + H / 2, "GPU × 8", { anchor: "end", fill: "var(--text-2)", weight: "600" });
      return { id: "gpu8", svg: g };
    }});
    // 层 1：NVSwitch 板（PCB + 4 芯片 + 走线）
    layers.push({ y: ys[1], build: y => {
      let g = slab(X, y, W, H, 7, "url(#mat-pcb)", { stroke: "rgba(90,200,150,.3)" });
      for (let c = 0; c < 4; c++) {
        const bx = X + 60 + c * 100;
        g += '<rect class="shape" x="' + bx + '" y="' + (y + 14) + '" width="60" height="28" rx="4" fill="url(#mat-die)" stroke="rgba(120,160,255,.5)" stroke-width="1"/>';
        g += '<rect x="' + bx + '" y="' + (y + 14) + '" width="60" height="11" rx="4" fill="url(#mat-glass)" pointer-events="none"/>';
      }
      g += '<g class="deco" stroke="rgba(120,220,170,.2)" stroke-width="1" fill="none"><path d="M' + (X + 30) + ' ' + (y + 28) + ' h30 M' + (X + 220) + ' ' + (y + 28) + ' h20 M' + (X + 420) + ' ' + (y + 28) + ' h30"/></g>';
      g += label(X - 14, y + H / 2, "NVSwitch", { anchor: "end", fill: "var(--text-2)", weight: "600" });
      return { id: "nvlink", svg: g };
    }});
    // 层 2：主板（PCB + 双 CPU 金属顶盖 + 内存条 + NVMe）
    layers.push({ y: ys[2], build: y => {
      let base = slab(X, y, W, H, 7, "url(#mat-pcb)", { stroke: "rgba(90,200,150,.22)", cls: "deco", shadow: true });
      let cpu = "";
      [X + 40, X + 120].forEach(bx => {
        cpu += '<rect class="shape" x="' + bx + '" y="' + (y + 10) + '" width="60" height="36" rx="5" fill="url(#mat-metal)" stroke="rgba(150,180,230,.4)" stroke-width="1"/>';
        cpu += '<rect x="' + bx + '" y="' + (y + 10) + '" width="60" height="14" rx="5" fill="url(#mat-glass)" pointer-events="none"/>';
      });
      cpu += label(X + 70, y + 28, "CPU", { size: 10, fill: "#CBD6EA" }) + label(X + 150, y + 28, "CPU", { size: 10, fill: "#CBD6EA" });
      let mem = "";
      for (let i = 0; i < 8; i++) mem += '<rect class="shape" x="' + (X + 206 + i * 14) + '" y="' + (y + 8) + '" width="7" height="40" rx="2" fill="url(#mat-metalh)"/>';
      mem += mrect(X + 340, y + 10, 120, 16, 3, "url(#mat-metal)", { stroke: "rgba(80,220,150,.4)", sw: 1 });
      mem += mrect(X + 340, y + 30, 120, 16, 3, "url(#mat-metal)", { stroke: "rgba(80,220,150,.4)", sw: 1 });
      mem += label(X + 400, y - 6, "NVMe", { size: 10, fill: "var(--text-3)" });
      return { base: base,
        parts: [{ id: "cpu", svg: cpu, ring: { x: X + 34, y: y + 4, w: 152, h: 48 } },
                { id: "memstore", svg: mem, ring: { x: X + 200, y: y + 2, w: 268, h: 52 } }] };
    }});
    // 层 3：网卡（PCB + 金属挡板 + 端口）
    layers.push({ y: ys[3], build: y => {
      let g = slab(X, y, W, H, 7, "url(#mat-pcb)", { stroke: "rgba(90,200,150,.24)" });
      [X + 20, X + 80].forEach(bx => g += mrect(bx, y + 18, 50, 22, 3, "url(#mat-metal)", { sw: 1 }));
      for (let c = 0; c < 4; c++) {
        const bx = X + 150 + c * 82;
        g += mrect(bx, y + 14, 70, 28, 3, "url(#mat-metal)", { stroke: "rgba(60,220,240,.45)", sw: 1 });
        g += led(bx + 60, y + 20, 2.4, "led-cyan");
      }
      g += label(X - 14, y + H / 2, "网卡", { anchor: "end", fill: "var(--text-2)", weight: "600" });
      return { id: "nic", svg: g };
    }});
    // 层 4：风扇墙（金属框 + 6 个程序化均匀叶轮）
    layers.push({ y: ys[4], build: y => {
      let g = slab(X, y, W, H, 7, "url(#mat-metal)", { stroke: "rgba(150,180,230,.24)" });
      for (let c = 0; c < 6; c++) {
        const fx = X + 55 + c * 75, fy = y + H / 2;
        g += fan(fx, fy, 22, 7, { blade: "#405174" });
      }
      g += label(X - 14, y + H / 2, "风扇墙", { anchor: "end", fill: "var(--text-2)", weight: "600" });
      return { id: "cooling", svg: g };
    }});
    // 层 5：电源（金属模块 + 把手 + 状态灯）
    layers.push({ y: ys[5], build: y => {
      let g = slab(X, y, W, H, 7, "url(#mat-metal)", { stroke: "rgba(150,180,230,.24)" });
      for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++) {
        const bx = X + 40 + c * 150, by = y + 6 + r * 23;
        g += mrect(bx, by, 130, 19, 3, "url(#mat-metalh)", { stroke: "rgba(251,191,36,.35)", sw: 1 });
        g += '<rect x="' + (bx + 6) + '" y="' + (by + 6) + '" width="14" height="7" rx="2" fill="none" stroke="rgba(255,255,255,.25)" stroke-width="1"/>';
        g += led(bx + 120, by + 9.5, 2.2, "led-green");
      }
      g += label(X - 14, y + H / 2, "电源 × 6", { anchor: "end", fill: "var(--text-2)", weight: "600" });
      return { id: "psu", svg: g };
    }});

    let s = '<path id="server-energy" d="M450 64 V526" fill="none" stroke="#2FD4E6" stroke-width="10" opacity=".055" stroke-linecap="round"/>' +
      '<path d="M450 64 V526" fill="none" stroke="#8BEFF8" stroke-width="1" opacity=".52" stroke-dasharray="4 8"/>' +
      particles("server-energy", 5, "#86F4FF", 5.6);
    layers.forEach((L, i) => {
      const built = L.build(L.y);
      if (built.parts) {
        let inner = built.base;
        built.parts.forEach(p => { inner += hot(station, p.id, p.svg, { ring: p.ring }); });
        s += '<g class="explode-layer piece" data-layer="' + i + '" style="--layer-z:' + ((5 - i) * 7) + 'px">' + inner + "</g>";
      } else {
        s += '<g class="explode-layer piece" data-layer="' + i + '" style="--layer-z:' + ((5 - i) * 7) + 'px">' +
          hot(station, built.id, built.svg, { ring: { x: X - 6, y: L.y - 6, w: W + 12, h: H + 12, rx: 10 } }) + "</g>";
      }
    });

    s += powerMeter(770, 96);
    s += energyRing(770, 96, 84, { color: "#FBBF24", dash: "5 10", slow: true, opacity: .38 });
    s += annot([690, 108], [716, 206], "整机功耗");
    s += annot([450, 154], [760, 286], "卡间互联");

    mount.innerHTML = svgWrap(s);
    wireHotspots(mount, station);
    wire3D(mount);

    if (!reduced()) {
      const centerY = 293;
      mount.querySelectorAll(".explode-layer").forEach((g, i) => {
        const y = ys[i];
        const off = (centerY - (y + H / 2)) * 0.85;
        g.animate(
          [{ transform: "translateY(" + off + "px)", opacity: 0.15 }, { transform: "translateY(0)", opacity: 1 }],
          { duration: 480, delay: i * 120, easing: "cubic-bezier(.22,1,.36,1)", fill: "backwards" }
        );
      });
    }
    // hover 某层：前移 + 让位
    mount.querySelectorAll(".explode-layer").forEach(g => {
      g.querySelectorAll(".hot").forEach(h => {
        h.addEventListener("mouseenter", () => { if (!reduced()) { g.style.transform = "translate3d(0,-7px,var(--layer-z)) scale(1.012)"; g.style.transition = "transform .18s var(--ease-out), filter .18s var(--ease-out)"; g.style.filter = "drop-shadow(0 7px 10px rgba(47,212,230,.16))"; } });
        h.addEventListener("mouseleave", () => { g.style.transform = ""; g.style.filter = ""; });
      });
    });
    return null;
  }

  function powerMeter(cx, cy) {
    let g = '<g class="deco">';
    // 玻璃表盘 + 金属边框
    g += '<circle cx="' + cx + '" cy="' + cy + '" r="76" fill="url(#mat-panel)" stroke="rgba(150,180,230,.2)" stroke-width="1" filter="url(#fx-shadow-sm)"/>';
    g += '<path d="M' + (cx - 70) + ' ' + cy + ' A70 70 0 0 1 ' + (cx + 70) + ' ' + cy + '" fill="none" stroke="rgba(150,180,230,.35)" stroke-width="2"/>';
    for (let i = 0; i <= 10; i++) {
      const ang = Math.PI - i * Math.PI / 10;
      const x1 = cx + 62 * Math.cos(ang), y1 = cy - 62 * Math.sin(ang);
      const x2 = cx + 70 * Math.cos(ang), y2 = cy - 70 * Math.sin(ang);
      g += '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + (i >= 8 ? "var(--amber)" : "var(--text-3)") + '" stroke-width="' + (i >= 8 ? 2 : 1.4) + '"/>';
    }
    const pAng = Math.PI - 8.5 * Math.PI / 10;
    g += '<line x1="' + cx + '" y1="' + cy + '" x2="' + (cx + 56 * Math.cos(pAng)) + '" y2="' + (cy - 56 * Math.sin(pAng)) + '" stroke="var(--amber)" stroke-width="3" stroke-linecap="round" filter="url(#fx-glow)"/>';
    g += '<circle cx="' + cx + '" cy="' + cy + '" r="5" fill="var(--amber)"/>';
    g += '<rect x="' + (cx - 40) + '" y="' + (cy + 6) + '" width="80" height="1" fill="url(#mat-glass)" opacity="0"/>'; // spacer
    g += '</g>';
    // 玻璃高光弧
    g += '<path d="M' + (cx - 58) + ' ' + (cy - 30) + ' A64 64 0 0 1 ' + (cx + 8) + ' ' + (cy - 62) + '" fill="none" stroke="#fff" stroke-opacity=".18" stroke-width="3" stroke-linecap="round"/>';
    g += label(cx, cy + 20, "≈ 10 kW", { size: 13, weight: "700", fill: "var(--amber)" });
    g += label(cx, cy + 40, "≈ 同时开 5 台空调", { size: 11, fill: "var(--text-3)" });
    return g;
  }

  /* ==================================================================
     S3  dc-room —— 机房 30° 等距（立体高柜 + 体积光气流）
     ================================================================== */
  function isoBox(x, y, w, d, h, faces) {
    // x,y = 顶面前角；w=宽(向右上) d=深(向左上) h=高(向下)  —— 简化 2.5D 盒体
    faces = faces || {};
    const top = faces.top || "url(#mat-top)", front = faces.front || "url(#mat-metal)", side = faces.side || "url(#mat-side)";
    const sx = w * 0.5, sy = w * 0.28, dx = d * 0.5, dy = d * 0.28;
    // 顶面四点
    const p0 = [x, y], p1 = [x + sx, y + sy], p2 = [x + sx - dx, y + sy + dy], p3 = [x - dx, y + dy];
    let g = '<polygon class="shape" points="' + p0 + ' ' + p1 + ' ' + p2 + ' ' + p3 + '" fill="' + top + '" stroke="rgba(160,190,240,.3)" stroke-width="1"/>';
    // 正面（前右面）
    g += '<polygon points="' + p1 + ' ' + p2 + ' ' + [p2[0], p2[1] + h] + ' ' + [p1[0], p1[1] + h] + '" fill="' + front + '"/>';
    // 侧面（前左面）
    g += '<polygon points="' + p0 + ' ' + p3 + ' ' + [p3[0], p3[1] + h] + ' ' + [p0[0], p0[1] + h] + '" fill="' + side + '"/>';
    // 正面 AO/高光
    g += '<polygon points="' + p1 + ' ' + p2 + ' ' + [p2[0], p2[1] + h] + ' ' + [p1[0], p1[1] + h] + '" fill="url(#sheen)" pointer-events="none"/>';
    return { g: g, front: [p1, p2, [p2[0], p2[1] + h], [p1[0], p1[1] + h]], frontTop: p1, h: h };
  }

  function dcRoom(station, mount) {
    let s = "", labels = "";
    const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

    // 顶部体积光（克制；统一左上光向）
    s += '<path d="M320 70 H690 L636 296 H374 Z" fill="url(#fx-volume)" opacity=".2" pointer-events="none"/>';
    // 地板（等距菱形）
    const fl = [[150, 250], [560, 130], [850, 300], [430, 470]];
    s += '<polygon points="' + fl.map(p => p.join(",")).join(" ") + '" fill="url(#mat-panel)" stroke="rgba(120,150,210,.18)" stroke-width="1"/>';
    // 冷通道发光带（两排机柜之间）
    s += '<polygon points="410,304 548,265 584,291 446,330" fill="var(--cyan)" opacity=".13"/>';

    // ---- 机柜：两排各 4，均匀等距；后排先画（画家算法）；U 位槽随斜面 ----
    const W = 44, D = 34, H = 64, Cstep = [46, -13], back = [416, 250], front = [450, 308];
    function rackAt(bx, by, seed) {
      const box = isoBox(bx, by, W, D, H, {});
      let g = box.g;
      const f = box.front; // [右上, 左上, 左下, 右下]
      for (let u = 0; u < 4; u++) {
        const t0 = 0.16 + u * 0.19, t1 = t0 + 0.11;
        const tl = lerp(f[1], f[2], t0), tr = lerp(f[0], f[3], t0), br = lerp(f[0], f[3], t1), bl = lerp(f[1], f[2], t1);
        g += '<polygon points="' + tl + ' ' + tr + ' ' + br + ' ' + bl + '" fill="rgba(9,15,28,.5)" stroke="rgba(140,170,225,.22)" stroke-width=".7"/>';
      }
      g += led(box.frontTop[0] - 6, box.frontTop[1] + 5, 1.8, seed % 3 === 0 ? "led-amber" : "led-green");
      return g;
    }
    let rack = "";
    for (let c = 3; c >= 0; c--) rack += rackAt(back[0] + c * Cstep[0], back[1] + c * Cstep[1], c);
    for (let c = 3; c >= 0; c--) rack += rackAt(front[0] + c * Cstep[0], front[1] + c * Cstep[1], c + 2);
    s += hot(station, "rack", rack, { ring: { x: 394, y: 176, w: 348, h: 252, rx: 10 } });

    // ---- 空调（cooling）：左侧两台，气流吹向冷通道 ----
    let cool = "";
    [[214, 250], [186, 338]].forEach(p => {
      const b = isoBox(p[0], p[1], 40, 52, 88, { front: "url(#mat-metalh)" });
      cool += b.g;
      for (let i = 0; i < 3; i++) cool += '<line x1="' + (b.frontTop[0] - 12) + '" y1="' + (b.frontTop[1] + 22 + i * 16) + '" x2="' + (b.frontTop[0] + 4) + '" y2="' + (b.frontTop[1] + 16 + i * 16) + '" stroke="rgba(180,210,255,.25)" stroke-width="2"/>';
    });
    cool += '<path class="shape flow-anim" d="M256 302 C 336 298 366 290 432 302" fill="none" stroke="var(--cyan)" stroke-width="9" opacity=".06" stroke-linecap="round"/>';
    cool += '<path class="shape flow-anim" d="M256 302 C 336 298 366 290 432 302" fill="none" stroke="var(--cyan)" stroke-width="3" opacity=".38"/>';
    s += hot(station, "cooling", cool, { ring: { x: 162, y: 236, w: 108, h: 214, rx: 10 } });

    // ---- 供电（power）：配电 + UPS（右侧），柴发（右后） ----
    let power = "";
    [[640, 306, "配电"], [682, 328, "UPS"]].forEach(d => {
      const b = isoBox(d[0], d[1], 38, 32, 46, { front: "url(#mat-metal)" });
      power += b.g + led(b.frontTop[0] - 5, b.frontTop[1] + 7, 1.8, "led-amber");
      labels += label(d[0] - 2, d[1] + 64, d[2], { size: 9, fill: "#CBD6EA", anchor: "middle" });
    });
    const gen = isoBox(692, 172, 62, 42, 50, { front: "url(#mat-metal)" });
    power += gen.g;
    labels += label(714, 238, "柴油发电", { size: 9, fill: "#CBD6EA", anchor: "middle" });
    s += hot(station, "power", power, { ring: { x: 622, y: 156, w: 152, h: 208, rx: 10 } });

    // ---- 承重与布线（cabling）：天花走线（后方一束，克制） ----
    let cab = '<rect class="shape" x="470" y="122" width="168" height="16" fill="transparent"/>';
    for (let i = 0; i < 4; i++) cab += '<path class="shape" d="M512 134 q40 ' + (8 + i * 3) + ' ' + (80 + i * 16) + ' ' + (22 + i * 5) + '" fill="none" stroke="rgba(150,180,230,.28)" stroke-width="1.3" stroke-dasharray="3 4"/>';
    labels += label(556, 116, "天花走线", { size: 10, fill: "var(--text-3)", plate: true });
    s += hot(station, "cabling", cab, { ring: { x: 500, y: 108, w: 190, h: 42, rx: 8 } });

    // ---- 消防钢瓶（fire）：左前地面 ----
    let fire = "";
    for (let i = 0; i < 3; i++) {
      const fx = 300 + i * 26, fy = 396 + i * 10;
      fire += '<rect class="shape" x="' + fx + '" y="' + fy + '" width="20" height="46" rx="10" fill="url(#mat-metal)" stroke="rgba(248,113,113,.5)" stroke-width="1"/>';
      fire += '<rect x="' + fx + '" y="' + fy + '" width="20" height="15" rx="10" fill="url(#mat-glass)" pointer-events="none"/>';
      fire += '<circle cx="' + (fx + 10) + '" cy="' + (fy - 4) + '" r="3" fill="var(--red)"/>';
    }
    labels += label(326, 476, "气体消防", { size: 10, fill: "var(--text-3)", plate: true });
    s += hot(station, "fire", fire, { ring: { x: 292, y: 388, w: 104, h: 90, rx: 10 } });

    // ---- 标注最后画（最上层，避免被机柜遮挡/截断） ----
    labels += label(497, 288, "冷通道", { size: 11, fill: "var(--cyan)", plate: true });
    s += labels;
    s += label(150, 540, "机房俯视 · 点击任意设备了解它的职责", { size: 11, fill: "var(--text-3)", anchor: "start" });

    mount.innerHTML = svgWrap(s);
    wireHotspots(mount, station);
    wire3D(mount);
    return null;
  }

  /* ==================================================================
     S4  network-topo —— 三层组网（高度差路网 + 发光光纤）
     ================================================================== */
  function networkTopo(station, mount) {
    const spine = [[380, 120], [580, 120]];
    const leaf = [[280, 280], [440, 280], [600, 280], [720, 280]];
    const servers = [];
    for (let i = 0; i < 8; i++) servers.push([230 + i * 70, 460]);

    let s = "";
    // 计算网（青色发光光纤 + 流动光点）
    let comp = "";
    let fiberIndex = 0;
    spine.forEach(p => leaf.forEach(l => {
      const d = "M" + p[0] + " " + (p[1] + 18) + " C " + p[0] + " " + (p[1] + 90) + " " + l[0] + " " + (l[1] - 80) + " " + l[0] + " " + l[1];
      const pathId = "fiber-compute-" + fiberIndex;
      comp += '<path d="' + d + '" fill="none" stroke="var(--cyan)" stroke-width="5" opacity=".08" stroke-linecap="round"/>';
      comp += '<path id="' + pathId + '" class="shape flow-anim" d="' + d + '" fill="none" stroke="var(--cyan)" stroke-width="1.8"/>';
      if (fiberIndex % 4 === 0) comp += particles(pathId, 2, "#8AF4FF", 4.8 + fiberIndex * .2);
      fiberIndex += 1;
    }));
    s += '<g class="net-group" data-net="compute">' + hot(station, "computenet", comp, { ring: { x: 250, y: 130, w: 460, h: 160, rx: 8 } }) + "</g>";

    // 存储网（粉色曲线）
    let stor = "";
    leaf.forEach(l => servers.forEach(sv => {
      if (Math.abs(l[0] - sv[0]) < 120)
        stor += '<path class="shape" d="M' + l[0] + " " + (l[1] + 16) + " C " + l[0] + " " + (l[1] + 90) + " " + sv[0] + " " + (sv[1] - 70) + " " + sv[0] + " " + sv[1] + '" fill="none" stroke="var(--pink)" stroke-width="1.4" stroke-dasharray="5 5" opacity=".8"/>';
    }));
    s += '<g class="net-group" data-net="storage">' + hot(station, "storagenet", stor, { ring: { x: 220, y: 290, w: 560, h: 180, rx: 8 } }) + "</g>";

    // 管理网（灰细线）
    let mgmt = "";
    servers.forEach(sv => mgmt += '<line class="shape" x1="822" y1="300" x2="' + sv[0] + '" y2="' + (sv[1] - 6) + '" stroke="var(--text-3)" stroke-width="1" stroke-dasharray="2 4"/>');
    mgmt += mrect(806, 286, 30, 28, 5, "url(#mat-metal)", { stroke: "rgba(150,180,230,.3)", sw: 1 });
    mgmt += label(821, 274, "带外管理", { size: 10, fill: "var(--text-3)", plate: true });
    s += '<g class="net-group" data-net="mgmt">' + hot(station, "mgmtnet", mgmt, { ring: { x: 800, y: 280, w: 42, h: 200, rx: 8 } }) + "</g>";

    // 交换机（3D 盒体 + 端口灯）
    let sl = "";
    spine.forEach(p => {
      sl += slab(p[0] - 44, p[1] - 4, 88, 24, 5, "url(#mat-metal)", { stroke: "rgba(60,220,240,.5)", sw: 1.2, shadow: "sm", thick: 5 });
      for (let k = 0; k < 6; k++) sl += led(p[0] - 30 + k * 12, p[1] + 14, 1.6, "led-cyan");
      sl += label(p[0], p[1] - 14, "Spine", { size: 10, fill: "var(--text-2)", plate: true });
    });
    leaf.forEach(l => {
      sl += slab(l[0] - 34, l[1] - 2, 68, 20, 5, "url(#mat-metal)", { stroke: "rgba(60,220,240,.45)", sw: 1, shadow: "sm", thick: 4 });
      for (let k = 0; k < 5; k++) sl += led(l[0] - 22 + k * 11, l[1] + 12, 1.4, "led-cyan");
      sl += label(l[0], l[1] + 32, "Leaf", { size: 10, fill: "var(--text-2)", plate: true });
    });
    s += hot(station, "spineleaf", sl);

    // 服务器（立体小机箱）
    let srv = '<g class="deco">';
    servers.forEach(sv => {
      srv += mrect(sv[0] - 22, sv[1], 44, 30, 4, "url(#mat-metalh)", { stroke: "rgba(150,180,230,.25)", sw: 1, cls: "" });
      srv += led(sv[0] + 14, sv[1] + 8, 1.6, "led-green");
    });
    srv += "</g>";
    srv += label(480, 526, "8 台服务器", { size: 11, fill: "var(--text-3)" });
    s += srv;

    mount.innerHTML = svgWrap(s);

    const legend = document.createElement("div");
    legend.className = "stage-legend";
    legend.innerHTML =
      '<button class="leg-chip" data-net="compute"><span class="leg-swatch" style="background:var(--cyan)"></span>计算网</button>' +
      '<button class="leg-chip" data-net="storage"><span class="leg-swatch" style="background:var(--pink)"></span>存储网</button>' +
      '<button class="leg-chip" data-net="mgmt"><span class="leg-swatch" style="background:var(--text-3)"></span>管理网</button>';
    mount.parentElement.appendChild(legend);
    legend.querySelectorAll(".leg-chip").forEach(chip => {
      chip.addEventListener("click", () => {
        const grp = mount.querySelector('.net-group[data-net="' + chip.dataset.net + '"]');
        chip.classList.toggle("off", grp.classList.toggle("net-hidden"));
      });
    });

    wireHotspots(mount, station);
    wire3D(mount);
    return { cleanup: () => legend.remove() };
  }

  /* ==================================================================
     S5  data-pipeline —— 数据流水线（金属圆柱 + 发光传送带）
     ================================================================== */
  function cylinder(cx, topY, rx, ry, h, mat, o) {
    o = o || {};
    let g = '<path class="shape" d="M' + (cx - rx) + " " + topY + " V" + (topY + h) + " a" + rx + " " + ry + " 0 0 0 " + (2 * rx) + ' 0 V' + topY + '" fill="' + mat + '" stroke="' + (o.stroke || "rgba(244,114,182,.5)") + '" stroke-width="1"/>';
    g += '<path d="M' + (cx - rx) + " " + topY + " V" + (topY + h) + " a" + rx + " " + ry + " 0 0 0 " + (2 * rx) + ' 0 V' + topY + '" fill="url(#sheen)" pointer-events="none"/>';
    g += '<ellipse class="shape" cx="' + cx + '" cy="' + topY + '" rx="' + rx + '" ry="' + ry + '" fill="url(#mat-top)" stroke="' + (o.stroke || "rgba(244,114,182,.6)") + '" stroke-width="1"/>';
    return g;
  }

  function dataPipeline(station, mount) {
    let s = "";
    // 主线（发光传送带）
    let pipe = '<rect class="shape" x="120" y="248" width="720" height="24" fill="transparent"/>';
    pipe += '<path d="M130 260 H840" fill="none" stroke="var(--pink)" stroke-width="8" opacity=".08" stroke-linecap="round"/>';
    pipe += '<path id="data-mainline" class="shape flow-anim" d="M130 260 H840" fill="none" stroke="var(--pink)" stroke-width="2.5"/>';
    pipe += particles("data-mainline", 7, "#FF89C8", 5.2);
    s += hot(station, "pipeline", pipe, { ring: { x: 120, y: 244, w: 720, h: 32, rx: 8 } });

    // 数据源（发光节点簇）
    let src = '<g class="deco">';
    for (let i = 0; i < 5; i++) {
      const col = Math.floor(i / 3), px = 130 + col * 35, py = 200 + (i % 3) * 60 + col * 30;
      src += '<circle class="led-breathe" cx="' + px + '" cy="' + py + '" r="14" fill="var(--pink)" opacity=".08"/>' +
        '<circle cx="' + px + '" cy="' + py + '" r="9" fill="var(--pink)" opacity=".85"/><circle cx="' + px + '" cy="' + py + '" r="9" fill="url(#orb-shade)"/>';
    }
    src += label(150, 360, "数据源", { size: 10, fill: "var(--text-3)" }) + "</g>";
    s += src;

    // 清洗
    s += '<g class="deco">' + mrect(220, 235, 70, 50, 8, "url(#mat-panel)", { sw: 1 }) + label(255, 260, "清洗", { size: 10, fill: "var(--text-2)" }) + "</g>";

    // 数据集仓库（金属圆柱）
    let ds = cylinder(380, 216, 42, 14, 74, "url(#mat-panel2)", { stroke: "rgba(244,114,182,.5)" });
    ds += '<ellipse class="shape" cx="380" cy="248" rx="42" ry="14" fill="none" stroke="rgba(244,114,182,.35)" stroke-width="1"/>';
    for (let i = 0; i < 5; i++) ds += '<line x1="407" y1="' + (230 + i * 12) + '" x2="416" y2="' + (230 + i * 12) + '" stroke="#F9A8D4" stroke-width=".8" opacity=".55"/>';
    ds += label(380, 322, "数据集仓库", { size: 10, fill: "var(--text-3)", plate: true });
    s += hot(station, "datastore", ds, { ring: { x: 332, y: 198, w: 96, h: 108, rx: 10 } });

    // 并行文件系统（发光格栅）
    let pfs = mrect(500, 210, 130, 100, 8, "url(#mat-panel)", { stroke: "rgba(244,114,182,.5)", sw: 1.2, shadow: "sm" });
    for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) {
      const on = (r + c) % 3 !== 0;
      pfs += '<rect class="shape" x="' + (510 + c * 30) + '" y="' + (220 + r * 30) + '" width="22" height="22" rx="3" fill="' + (on ? "var(--pink)" : "#1B2742") + '" opacity="' + (on ? ".5" : "1") + '" stroke="rgba(244,114,182,.4)" stroke-width="1"/>';
    }
    pfs += label(565, 330, "并行文件系统", { size: 10, fill: "var(--text-3)", plate: true });
    s += hot(station, "pfs", pfs, { ring: { x: 494, y: 204, w: 142, h: 112, rx: 10 } });

    // GPU 集群（2.5D 机箱）
    let gpu = '<g class="deco">' + mrect(710, 215, 110, 90, 8, "url(#mat-metal)", { stroke: "rgba(120,160,255,.3)", sw: 1, shadow: "sm", cls: "" });
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++)
      gpu += '<rect x="' + (722 + c * 32) + '" y="' + (225 + r * 26) + '" width="24" height="18" rx="2" fill="url(#mat-die)" stroke="rgba(120,160,255,.4)" stroke-width="1"/>';
    gpu += label(765, 326, "GPU 集群", { size: 10, fill: "var(--text-3)" }) + "</g>";
    s += gpu;

    // 回流存档（checkpoint 热区）
    let ck = '<path class="shape" d="M765 305 V380 H470" fill="none" stroke="var(--pink)" stroke-width="1.6" stroke-dasharray="6 5"/>';
    ck += mrect(380, 360, 90, 70, 6, "url(#mat-metal)", { stroke: "rgba(244,114,182,.45)", sw: 1, shadow: "sm" });
    for (let i = 0; i < 3; i++) {
      ck += '<rect class="shape" x="390" y="' + (370 + i * 19) + '" width="70" height="13" rx="2" fill="url(#mat-metalh)"/>';
      ck += '<rect x="452" y="' + (373 + i * 19) + '" width="6" height="7" rx="1" fill="none" stroke="rgba(255,255,255,.3)" stroke-width="1"/>';
    }
    ck += label(425, 446, "存档柜", { size: 10, fill: "var(--text-3)" });
    ck += label(600, 372, "每隔一段时间存档", { size: 10, fill: "var(--text-3)", plate: true });
    s += hot(station, "checkpoint", ck, { ring: { x: 374, y: 354, w: 102, h: 82, rx: 8 } });

    // 箭头
    s += '<g class="deco" stroke="rgba(150,180,230,.35)" stroke-width="1.5" fill="none"><path d="M292 260 h34"/><path d="M424 250 h68"/><path d="M636 258 h66"/></g>';

    mount.innerHTML = svgWrap(s);
    wireHotspots(mount, station);
    wire3D(mount);
    return null;
  }

  /* ==================================================================
     S6  software-stack —— 半透明玻璃板堆叠（2.5D）
     ================================================================== */
  function softwareStack(station, mount) {
    const order = ["driver", "container", "scheduler", "platform"];
    const H = 84, gap = 20, X = 220, W = 520;
    const bottomY = 456;
    let s = '<path id="stack-uplink" d="M480 514 V112" fill="none" stroke="#818CF8" stroke-width="10" opacity=".05"/>' +
      particles("stack-uplink", 4, "#A5B4FC", 4.6);
    order.forEach((id, i) => {
      const node = station.nodes.find(n => n.id === id);
      const y = bottomY - i * (H + gap);
      let g = slab(X, y, W, H, 12, "rgba(38,51,78,.74)", { stroke: "rgba(129,140,248,.42)", sw: 1, shadow: i > 0, thick: 8 });
      // 玻璃厚度侧高光
      g += '<rect x="' + (X + 2) + '" y="' + (y + 2) + '" width="' + (W - 4) + '" height="' + (H - 4) + '" rx="10" fill="url(#mat-glass)" pointer-events="none"/>';
      g += '<g class="led-breathe optional-glow" filter="url(#fx-glow)">' + led(X + 30, y + H / 2, 6, "led-green") + '</g>';
      g += label(X + 54, y + H / 2, node.name, { size: 15, weight: "700", fill: "var(--text)", anchor: "start" });
      g += label(X + W - 20, y + H / 2, node.brief, { size: 12, fill: "var(--text-2)", anchor: "end" });
      s += '<g class="stack-layer piece" data-layer="' + i + '" style="--layer-z:' + (i * 10) + 'px">' + hot(station, id, g, { ring: { x: X - 6, y: y - 6, w: W + 12, h: H + 12, rx: 14 } }) + "</g>";
    });
    s += label(480, 74, "一堆铁疙瘩，装完四层才变成“一朵云”", { size: 12, fill: "var(--text-2)" });
    s += label(150, bottomY - 40, "自下而上点亮", { size: 11, fill: "var(--text-3)", style: "writing-mode:vertical-rl" });

    mount.innerHTML = svgWrap(s);
    wireHotspots(mount, station);
    wire3D(mount);

    if (!reduced()) {
      mount.querySelectorAll(".stack-layer").forEach((g, i) => {
        g.style.opacity = "0.28";
        g.animate([{ opacity: 0.28, transform: "translateY(10px)" }, { opacity: 1, transform: "none" }], { duration: 420, delay: i * 170, easing: "cubic-bezier(.22,1,.36,1)", fill: "forwards" });
      });
    }
    return null;
  }

  /* ==================================================================
     S7  model-radial —— 模型层径向下钻（发光球体，招牌）
     ================================================================== */
  function modelRadial(station, mount) {
    const CX = 480, CY = 300, R1 = 175, R2 = 205;
    const topNodes = station.nodes;
    const positions = Array.from({ length: 4 }, (_, i) => {
      const ang = -Math.PI / 2 + i * Math.PI / 2;
      return [CX + R1 * Math.cos(ang), CY + R1 * Math.sin(ang)];
    });
    let current = null;

    function render(state, animate) {
      current = state;
      let s = "";
      const centerLabel = state ? topNodes.find(n => n.id === state).name + "层" : "模型层";
      const centerSub = state ? "点开子节点，或返回上层" : "点击四个方向，别有洞天";

      if (!state) {
        positions.forEach(p => s += beam(CX, CY, p[0], p[1]));
        topNodes.forEach((n, i) => { const p = positions[i]; s += radialNode(n.id, p[0], p[1], 50, n.name, "top"); });
      } else {
        const kids = (topNodes.find(n => n.id === state).children) || [];
        const n = kids.length;
        kids.forEach((k, i) => {
          const ang = -Math.PI / 2 + i * (2 * Math.PI / n);
          const x = CX + R2 * Math.cos(ang), y = CY + R2 * Math.sin(ang);
          s += beam(CX, CY, x, y);
          s += radialNode(k.id, x, y, 40, k.name, "child", state);
        });
      }
      // 中心能量球
      s += '<circle cx="' + CX + '" cy="' + CY + '" r="96" fill="url(#glow-accent-r)" pointer-events="none"/>';
      s += energyRing(CX, CY, 80, { dash: "10 9" });
      s += '<g class="' + (state ? "" : "hot-center ") + 'radial-center">' + orb(CX, CY, 70, { fill: "url(#mat-die)", shadow: true }) + '<circle cx="458" cy="276" r="9" fill="#fff" opacity=".22"/></g>';
      s += scanLine(CX - 62, CY - 62, 124, 124, "v");
      s += label(CX, CY - 6, centerLabel, { size: 18, weight: "700", fill: "#EDF5FF", style: "" });
      s += label(CX, CY + 18, centerSub, { size: 10, fill: "#AFC6E8" });
      if (!state) s += annot([CX + 62, CY - 30], [708, 90], "模型层");

      mount.innerHTML = svgWrap(s);
      wireRadial(state);

      const oldBtn = mount.parentElement.querySelector(".stage-float-btn");
      if (oldBtn) oldBtn.remove();
      if (state) {
        const btn = document.createElement("button");
        btn.className = "stage-float-btn";
        btn.innerHTML = '<svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M9 6H3M6 3L3 6l3 3" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>返回模型层';
        btn.addEventListener("click", () => App.openNode(station.id, []));
        mount.parentElement.appendChild(btn);
      }

      if (animate && !reduced() && state) {
        mount.querySelectorAll('.radial-node[data-kind="child"]').forEach((g, i) => {
          const tx = g.dataset.cx, ty = g.dataset.cy;
          g.animate(
            [{ transform: "translate(" + (CX - tx) + "px," + (CY - ty) + "px) scale(0.15)", opacity: 0 },
             { transform: "translate(0,0) scale(1)", opacity: 1 }],
            { duration: 280, delay: i * 34, easing: "cubic-bezier(.34,1.56,.64,1)", fill: "backwards" }
          );
        });
      }
    }

    function beam(x1, y1, x2, y2) {
      return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="#2FD4E6" stroke-width="7" opacity=".06" stroke-linecap="round"/>' +
        '<line class="deco flow-anim" x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="#65E8F4" stroke-width="1.4" opacity=".62"/>';
    }

    function radialNode(id, x, y, r, labelTxt, kind, layer) {
      const depth = .9 + Math.max(0, Math.min(1, y / 600)) * .2;
      const rr = r * depth;
      const inner = energyRing(x, y, rr + 8, { dash: kind === "top" ? "7 7" : "5 8", slow: kind !== "top", opacity: .58 }) +
        orb(x, y, rr, { fill: "url(#mat-die)", cls: "shape" }) +
        '<circle cx="' + (x - rr * .28) + '" cy="' + (y - rr * .3) + '" r="' + (rr * .12) + '" fill="#fff" opacity=".2"/>' +
        label(x, y, labelTxt, { size: r > 45 ? 14 : 12, weight: "700", fill: "#EDF5FF", maxWidth: rr * 1.55 }) +
        '<rect class="focus-ring" x="' + (x - rr - 4) + '" y="' + (y - rr - 4) + '" width="' + (2 * rr + 8) + '" height="' + (2 * rr + 8) + '" rx="' + (rr + 4) + '"/>';
      return '<g class="hot radial-node piece" data-kind="' + kind + '" data-radial="' + id + '"' +
        (layer ? ' data-layer="' + layer + '"' : "") +
        ' data-cx="' + x + '" data-cy="' + y + '" role="button" tabindex="0" aria-label="' + esc(labelTxt) + '">' + inner + "</g>";
    }

    function wireRadial(state) {
      mount.querySelectorAll(".radial-node").forEach(g => {
        const id = g.dataset.radial, kind = g.dataset.kind;
        const act = () => { if (kind === "top") App.openNode(station.id, [id]); else App.openNode(station.id, [state, id]); };
        g.addEventListener("click", act);
        g.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); act(); } });
        if (kind === "top") {
          g.dataset.node = id;
          g.addEventListener("mouseenter", () => App.setHighlight(id, true));
          g.addEventListener("mouseleave", () => App.setHighlight(id, false));
        }
      });
    }

    const initFirst = App.state.drawerPath[0];
    const initState = (initFirst === "training" || initFirst === "inference") ? initFirst : null;
    render(initState, false);
    wire3D(mount);

    return {
      syncDrawer: function (path) {
        const first = path[0];
        const want = (first === "training" || first === "inference") ? first : null;
        if (want !== current) { render(want, true); wire3D(mount); }
      }
    };
  }

  /* ==================================================================
     S8  delivery —— 交付模式（HTML 舞台，3D 卡在 CSS 里）
     ================================================================== */
  function delivery(station, mount) {
    const wrap = document.createElement("div");
    wrap.className = "delivery-stage";
    const BIG = { ondemand: "打车", reserved: "长租车", private: "专车队", idc: "自建车队" };
    const cmp = station.compare;
    const colOf = { ondemand: 0, reserved: 1, private: 2, idc: 3 };
    const attrRows = ["前期投入", "数据位置", "建设周期"];

    let cards = '<div class="delivery-cards">';
    ["ondemand", "reserved", "private", "idc"].forEach(id => {
      const node = station.nodes.find(n => n.id === id);
      const col = colOf[id];
      let attrs = "";
      attrRows.forEach(dim => { const row = cmp.rows.find(r => r.dim === dim); attrs += '<div class="dc-attr"><span>' + dim + "</span><b>" + row.cells[col] + "</b></div>"; });
      cards += '<div class="dcard" data-detail="' + id + '" data-col="' + col + '">' +
        '<div class="dc-glow"></div><div class="dc-analogy">' + BIG[id] + "</div>" +
        '<div class="dc-name">' + node.name + "</div>" +
        '<div class="dc-attrs">' + attrs + "</div>" +
        '<button class="dc-detail-btn" data-detail="' + id + '">查看详情 ›</button></div>';
    });
    cards += "</div>";

    let lower = '<div class="delivery-lower"><div class="decision-box" id="decisionBox"></div>';
    let table = '<div class="compare-box"><table class="compare-table"><thead><tr><th>维度</th>';
    cmp.cols.forEach((c, i) => table += '<th data-col="' + i + '">' + c + "</th>");
    table += "</tr></thead><tbody>";
    cmp.rows.forEach(r => { table += "<tr><td>" + r.dim + "</td>"; r.cells.forEach((c, i) => table += '<td data-col="' + i + '">' + c + "</td>"); table += "</tr>"; });
    table += "</tbody></table></div>";
    lower += table;
    lower += '<div class="hybrid-bar" data-detail="hybrid" role="button" tabindex="0">' +
      '<span class="hb-tag">混合模式</span><span>平时业务跑自有集群，高峰期弹性借用公有云顶一阵。</span>' +
      '<span class="hb-arrow">查看详情 ›</span></div></div>';

    wrap.innerHTML = cards + lower;
    mount.innerHTML = "";
    mount.appendChild(wrap);

    // 卡片 3D 倾斜（reduced 时关闭）
    if (!reduced()) wrap.querySelectorAll(".dcard").forEach(card => {
      card.addEventListener("pointermove", e => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = "perspective(700px) rotateX(" + (-py * 6) + "deg) rotateY(" + (px * 7) + "deg) translateY(-3px)";
      });
      card.addEventListener("pointerleave", () => { card.style.transform = ""; });
    });

    buildDecisionTree(station, wrap.querySelector("#decisionBox"), wrap);

    wrap.querySelectorAll("[data-detail]").forEach(elm => {
      const id = elm.dataset.detail;
      const act = () => App.openNode(station.id, [id]);
      elm.addEventListener("click", e => { e.stopPropagation(); act(); });
      elm.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); act(); } });
    });
    return null;
  }

  function buildDecisionTree(station, box, wrap) {
    const RESULT = {
      private: { mode: "专有云", analogy: "专车队：数据不出门", reason: "数据不出门是硬要求；又没有自己的运维团队，专有云由双方共担最省心。", id: "private", col: 2 },
      idc: { mode: "自建 IDC", analogy: "自建车队：完全自主", reason: "数据完全自有，且有强运维团队，长期大规模自建单位成本最低；也可先用专有云过渡。", id: "idc", col: 3 },
      ondemand: { mode: "公有云 · 按量", analogy: "打车：随用随付", reason: "用量说不准，随开随关、按量付费最划算，试完就退。", id: "ondemand", col: 0 },
      reserved: { mode: "公有云 · 包期", analogy: "长租车：稳定优惠", reason: "用量长期稳定，包年包月单价更低、资源有保障。", id: "reserved", col: 1 }
    };
    function highlightCol(col) {
      if (!wrap) return;
      wrap.querySelectorAll('[data-col]').forEach(el => el.classList.toggle("col-hl", String(el.dataset.col) === String(col)));
    }
    function clearCol() { if (wrap) wrap.querySelectorAll(".col-hl").forEach(el => el.classList.remove("col-hl")); }
    function progress(step) { let d = '<div class="dt-progress" aria-label="决策进度">'; for (let i = 0; i < 3; i++) d += '<span class="dot' + (i < step ? " done" : "") + '"></span>'; return d + "</div>"; }
    function renderQ1() {
      clearCol();
      box.innerHTML = '<h4><span class="dt-icon">◈</span> 决策树 · 三个问题帮你选</h4>' + progress(0) +
        '<div class="dt-step"><div class="dt-question"><span class="dt-num">①</span>数据能出门吗？</div>' +
        '<div class="dt-answers"><button class="dt-btn" data-a="out-yes">能出门</button><button class="dt-btn" data-a="out-no">不能出门</button></div></div>';
      box.querySelector('[data-a="out-yes"]').onclick = renderQ2;
      box.querySelector('[data-a="out-no"]').onclick = renderQ3;
    }
    function renderQ2() {
      box.innerHTML = '<h4><span class="dt-icon">◈</span> 决策树 · 三个问题帮你选</h4>' + progress(2) +
        '<div class="dt-step"><div class="dt-question"><span class="dt-num">②</span>用量长期稳定吗？</div>' +
        '<div class="dt-answers"><button class="dt-btn" data-a="s-yes">长期稳定</button><button class="dt-btn" data-a="s-no">说不准/波动</button></div></div>';
      box.querySelector('[data-a="s-yes"]').onclick = () => showResult(RESULT.reserved);
      box.querySelector('[data-a="s-no"]').onclick = () => showResult(RESULT.ondemand);
    }
    function renderQ3() {
      box.innerHTML = '<h4><span class="dt-icon">◈</span> 决策树 · 三个问题帮你选</h4>' + progress(1) +
        '<div class="dt-step"><div class="dt-question"><span class="dt-num">③</span>有自己的运维团队吗？</div>' +
        '<div class="dt-answers"><button class="dt-btn" data-a="o-yes">有强运维</button><button class="dt-btn" data-a="o-no">没有</button></div></div>';
      box.querySelector('[data-a="o-yes"]').onclick = () => showResult(RESULT.idc);
      box.querySelector('[data-a="o-no"]').onclick = () => showResult(RESULT.private);
    }
    function showResult(r) {
      box.innerHTML = '<h4><span class="dt-icon">◈</span> 推荐方案</h4><div class="dt-result">' +
        '<div class="dt-badge">根据你的回答</div><div class="dt-mode">' + r.mode + "</div>" +
        '<div class="dt-analogy">' + r.analogy + "</div><div class=\"dt-reason\">" + r.reason + "</div>" +
        '<div class="dt-actions"><button class="btn-primary" data-open="' + r.id + '">查看详情</button>' +
        '<button class="btn-secondary dt-restart">重新回答</button></div></div>';
      highlightCol(r.col);
      box.querySelector("[data-open]").onclick = () => App.openNode(station.id, [r.id]);
      box.querySelector(".dt-restart").onclick = renderQ1;
    }
    renderQ1();
  }

  /* ==================================================================
     S10 ops-timeline —— 运维监控（玻璃表盘 + 立体珠子时间线）
     ================================================================== */
  function opsTimeline(station, mount) {
    let s = "";
    // 监控条
    let mon = mrect(150, 70, 660, 92, 12, "url(#mat-panel)", { stroke: "rgba(150,180,230,.2)", sw: 1, shadow: "sm" });
    const gauges = [["GPU 利用率", "92%", 0.92, "led-green"], ["温度", "68°C", 0.68, "led-amber"], ["告警数", "0", 0.05, "led-cyan"]];
    gauges.forEach((gv, i) => {
      const gx = 216 + i * 118, gy = 116;
      mon += '<circle cx="' + gx + '" cy="' + gy + '" r="34" fill="url(#mat-metal)" stroke="#62749A" stroke-width=".8"/>';
      mon += '<circle cx="' + gx + '" cy="' + gy + '" r="27" fill="#0E1626" stroke="rgba(150,180,230,.18)" stroke-width="5"/>';
      const dash = 2 * Math.PI * 27;
      const col = i === 0 ? "var(--green)" : (i === 1 ? "var(--amber)" : "var(--cyan)");
      mon += '<circle cx="' + gx + '" cy="' + gy + '" r="27" fill="none" stroke="' + col + '" stroke-width="5" stroke-dasharray="' + (dash * gv[2]) + " " + dash + '" transform="rotate(-90 ' + gx + " " + gy + ')" stroke-linecap="round" filter="url(#fx-glow)"/>';
      mon += label(gx, gy, gv[1], { size: 13, weight: "700", fill: "var(--text)", cls: "mono digit-roll" });
      mon += label(gx, gy + 40, gv[0], { size: 11, fill: "var(--text-3)" });
    });
    // sparkline
    let spk = "M560 116 ";
    for (let i = 1; i <= 14; i++) spk += "L" + (560 + i * 16) + " " + (116 + Math.sin(i * 1.2) * 12 - (i > 11 ? 22 : 0)) + " ";
    mon += '<path class="optional-glow" d="' + spk + '" fill="none" stroke="var(--cyan)" stroke-width="2" opacity=".85" filter="url(#fx-glow)"/>';
    mon += label(670, 82, "GPU 利用率 · 演示趋势", { size: 9.5, fill: "var(--text-3)", cls: "mono" });
    mon += scanLine(548, 86, 246, 56, "v");
    s += hot(station, "monitor", mon, { ring: { x: 144, y: 64, w: 672, h: 104, rx: 14 } });

    // 掉卡之夜时间线（立体珠子）
    const tl = station.timeline;
    const startY = 214, stepY = 50, tx = 306;
    let alerts = '<rect class="shape" x="180" y="196" width="600" height="' + (tl.length * stepY + 6) + '" fill="transparent"/>';
    alerts += '<line x1="' + tx + '" y1="' + startY + '" x2="' + tx + '" y2="' + (startY + (tl.length - 1) * stepY) + '" stroke="rgba(150,180,230,.3)" stroke-width="3"/>';
    tl.forEach((it, i) => {
      const y = startY + i * stepY, t = i / (tl.length - 1);
      const col = i === 0 ? "var(--green)" : (i === 1 ? "var(--red)" : (i < tl.length - 1 ? "var(--amber)" : "var(--green)"));
      const isAlert = i === 1;
      if (isAlert) alerts += '<circle class="' + (reduced() ? "" : "pulse-ring") + '" cx="' + tx + '" cy="' + y + '" r="11" fill="none" stroke="var(--red)" stroke-width="2"/>';
      alerts += orb(tx, y, 9, { fill: col, cls: "shape" });
      alerts += label(tx - 24, y, it.t, { size: 12, anchor: "end", fill: "var(--text-2)", cls: "mono" });
      alerts += label(tx + 26, y, it.label, { size: 12.5, anchor: "start", fill: "var(--text)" });
    });
    s += hot(station, "alerts", alerts, { ring: { x: 180, y: 196, w: 600, h: (tl.length * stepY + 6), rx: 10 } });

    // 巡检保养
    let mnt = mrect(600, 476, 190, 74, 12, "url(#mat-panel)", { stroke: "rgba(150,180,230,.2)", sw: 1, shadow: "sm" });
    mnt += '<path class="shape" d="M630 498 a12 12 0 1 0 14 14 l18 18 8 -8 -18 -18 a12 12 0 0 0 -22 -6z" fill="url(#mat-metal)" stroke="rgba(248,113,113,.55)" stroke-width="1.4"/>';
    mnt += mrect(692, 492, 34, 44, 3, "url(#mat-metalh)", { stroke: "rgba(248,113,113,.5)", sw: 1 });
    for (let i = 0; i < 3; i++) mnt += '<line x1="698" y1="' + (502 + i * 10) + '" x2="720" y2="' + (502 + i * 10) + '" stroke="rgba(255,255,255,.35)" stroke-width="1.5"/>';
    mnt += label(752, 514, "巡检保养", { size: 10, fill: "var(--text-3)" });
    s += hot(station, "maintenance", mnt, { ring: { x: 594, y: 470, w: 202, h: 86, rx: 14 } });

    s += label(180, 186, "“掉卡之夜” · 点击时间线看恢复全过程", { size: 12, weight: "700", fill: "var(--red)", anchor: "start" });

    mount.innerHTML = svgWrap(s);
    wireHotspots(mount, station);
    wire3D(mount);
    return null;
  }

  /* ==================================================================
     S9  token-flow —— 算力变现（发光管道 + Token 光点 + 立体账本）
     ================================================================== */
  function tokenFlow(station, mount) {
    let s = "";
    // 主管道（发光 + Token 光点）
    s += '<rect class="shape" x="120" y="212" width="740" height="30" fill="transparent"/>';
    s += '<path d="M150 227 H900" fill="none" stroke="#A3E635" stroke-width="9" opacity=".08" stroke-linecap="round"/>';
    s += '<path id="token-mainline" class="shape flow-anim" d="M150 227 H900" fill="none" stroke="#A3E635" stroke-width="2.5"/>';
    s += particles("token-mainline", 8, "#C8FF65", 5.4);

    // 用户请求
    let users = '<g class="deco">';
    for (let i = 0; i < 5; i++) {
      const col = Math.floor(i / 3), px = 108 + col * 30, py = 196 + (i % 3) * 34 + col * 17;
      users += '<circle cx="' + px + '" cy="' + py + '" r="8" fill="#A3E635" opacity=".85"/><circle cx="' + px + '" cy="' + py + '" r="8" fill="url(#orb-shade)"/>';
    }
    users += label(122, 300, "用户请求", { size: 10, fill: "var(--text-3)" }) + "</g>";
    s += users;

    // API 网关
    let gw = mrect(206, 193, 98, 68, 10, "url(#mat-panel)", { stroke: "var(--accent-line)", sw: 1.4, shadow: "sm" });
    gw += led(226, 210, 3, "led-accent");
    gw += label(255, 220, "API 网关", { size: 12, weight: "700", fill: "var(--text)" });
    gw += label(255, 240, "计量闸口", { size: 10, fill: "var(--text-3)" });
    gw += '<text class="stage-text mono token-counter" data-token-counter="true" x="255" y="178" text-anchor="middle" dominant-baseline="central" fill="#C8FF65" font-size="11" font-weight="700">12,840 TOK</text>';
    s += hot(station, "gateway", gw, { ring: { x: 200, y: 187, w: 110, h: 80, rx: 12 } });

    // 模型货架
    let cat = mrect(358, 84, 244, 56, 10, "url(#mat-panel)", { stroke: "var(--accent-line)", sw: 1.2 });
    for (let c = 0; c < 3; c++) cat += mrect(376 + c * 76, 98, 60, 28, 6, "url(#mat-panel2)", { stroke: "var(--accent-line)", sw: 1 });
    cat += label(480, 74, "模型货架", { size: 10, fill: "var(--text-3)" });
    s += hot(station, "catalog", cat, { ring: { x: 352, y: 78, w: 256, h: 68, rx: 12 } });

    // 推理集群 · 多租户
    let mt = mrect(358, 168, 244, 118, 12, "url(#mat-panel)", { stroke: "var(--accent-line)", sw: 1.4, shadow: "sm" });
    const laneColors = ["var(--cyan)", "var(--pink)", "var(--indigo)"];
    for (let r = 0; r < 3; r++) {
      mt += '<rect class="shape" x="372" y="' + (180 + r * 33) + '" width="216" height="26" rx="5" fill="#141E33" stroke="' + laneColors[r] + '" stroke-width="1" opacity=".9"/>';
      for (let c = 0; c < 6; c++) mt += '<rect x="' + (380 + c * 34) + '" y="' + (185 + r * 33) + '" width="24" height="16" rx="2" fill="' + laneColors[r] + '" opacity=".22"/>';
    }
    mt += label(480, 302, "推理集群 · 多租户", { size: 10, fill: "var(--text-3)", plate: true });
    s += hot(station, "multitenant", mt, { ring: { x: 352, y: 162, w: 256, h: 130, rx: 12 } });

    // SLA 承诺
    let sla = mrect(358, 330, 244, 52, 10, "url(#mat-panel)", { stroke: "var(--accent-line)", sw: 1.2 });
    sla += label(480, 348, "SLA 承诺", { size: 12, weight: "700", fill: "var(--text)" });
    sla += label(480, 368, "TTFT · 生成速度 · 并发上限", { size: 10, fill: "var(--text-3)" });
    s += hot(station, "sla", sla, { ring: { x: 352, y: 324, w: 256, h: 64, rx: 12 } });

    // 计费引擎
    let bl = mrect(648, 193, 98, 68, 10, "url(#mat-panel)", { stroke: "var(--accent-line)", sw: 1.4, shadow: "sm" });
    bl += led(668, 210, 3, "led-accent");
    bl += label(697, 220, "计费引擎", { size: 12, weight: "700", fill: "var(--text)" });
    bl += label(697, 240, "按 Token 结算", { size: 10, fill: "var(--text-3)" });
    s += hot(station, "billing", bl, { ring: { x: 642, y: 187, w: 110, h: 80, rx: 12 } });

    // 账单/定价立体账本
    let pr = mrect(788, 150, 146, 176, 12, "url(#mat-panel)", { stroke: "var(--accent-line)", sw: 1.4, shadow: true });
    const ledger = [["卡·电·折旧", "成本"], ["÷ 利用率", "摊销"], ["每百万 Token", "单价"], ["+ 毛利", "定价"]];
    ledger.forEach((row, i) => {
      const y = 178 + i * 34;
      pr += '<line x1="800" y1="' + (y + 11) + '" x2="926" y2="' + (y + 11) + '" stroke="rgba(150,180,230,.16)" stroke-width="1"/>';
      pr += label(802, y, row[0], { size: 10, anchor: "start", fill: "var(--text-2)" });
      pr += label(924, y, row[1], { size: 10, anchor: "end", fill: "var(--accent-text)", weight: "600" });
    });
    pr += label(863, 140, "账单 / 定价", { size: 10, fill: "var(--text-3)" });
    s += hot(station, "pricing", pr, { ring: { x: 782, y: 136, w: 154, h: 196, rx: 14 } });

    s += label(120, 410, "把算力变成 Token 卖出去 · 点击任意环节了解它负责什么", { size: 11, fill: "var(--text-3)", anchor: "start" });

    mount.innerHTML = svgWrap(s);
    wireHotspots(mount, station);
    wire3D(mount);
    const counter = mount.querySelector("[data-token-counter]");
    const simControl = document.createElement("div");
    simControl.className = "stage-sim-control";
    simControl.innerHTML = '<span>模拟流量 · 最近 60 秒</span><button type="button" data-token-toggle aria-pressed="false">暂停</button>';
    mount.parentElement.appendChild(simControl);
    const toggle = simControl.querySelector("[data-token-toggle]");
    let active = true, paused = reduced() || window.innerWidth < 600, timer = null, value = 12840;
    function tick() {
      if (!active || paused || !counter || !counter.isConnected) return;
      value += 160 + (value % 7) * 13;
      counter.textContent = value.toLocaleString("en-US") + " TOK";
      if (counter.animate) counter.animate(
        [{ transform: "translateY(3px)", opacity: .25 }, { transform: "translateY(0)", opacity: 1 }],
        { duration: 260, easing: "cubic-bezier(.22,1,.36,1)" }
      );
      timer = setTimeout(tick, 720);
    }
    function updateToggle() {
      if (!toggle) return;
      toggle.textContent = paused ? "播放" : "暂停";
      toggle.setAttribute("aria-pressed", paused ? "true" : "false");
      if (paused && timer) { clearTimeout(timer); timer = null; }
      if (!paused && !timer) timer = setTimeout(tick, 720);
    }
    if (toggle) toggle.addEventListener("click", () => { paused = !paused; updateToggle(); });
    if (!reduced()) timer = setTimeout(tick, 720);
    else updateToggle();
    return { cleanup: function () { active = false; if (timer) clearTimeout(timer); simControl.remove(); } };
  }

  /* ==================================================================
     调度
     ================================================================== */
  const RENDERERS = {
    "token-flow": tokenFlow,
    "gpu-closeup": gpuCloseup,
    "server-explode": serverExplode,
    "dc-room": dcRoom,
    "network-topo": networkTopo,
    "data-pipeline": dataPipeline,
    "software-stack": softwareStack,
    "model-radial": modelRadial,
    "delivery": delivery,
    "ops-timeline": opsTimeline
  };

  function renderStage(station, mount) {
    if (window.StageArtLateV5 && window.StageArtLateV5.canRender(station.visual)) {
      return window.StageArtLateV5.render(station, mount);
    }
    if (window.StageArtV4 && window.StageArtV4.canRender(station.visual)) {
      return window.StageArtV4.render(station, mount);
    }
    const fn = RENDERERS[station.visual];
    if (!fn) { mount.innerHTML = svgWrap('<text x="480" y="300" class="stage-label" text-anchor="middle" fill="var(--text-2)">舞台开发中</text>'); return null; }
    return fn(station, mount);
  }

  return { renderStage: renderStage };
})();
