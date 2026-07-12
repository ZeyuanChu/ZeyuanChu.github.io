/* ========================================================================
   算力之旅 V4 · Atlas 图谱 + 四个核心实验室
   —— 全部读取 DATA.v4（canonical concepts / typed relations），
      不复制定义；点节点打开同一套规范知识卡（deep-link 复用旧路由）。
   实验室均为可操作的教学工具：显式声明假设、口径与局限，
   结果为“教学示意”，不构成正式报价或容量承诺。
   ======================================================================== */
window.LabsUI = (function () {
  "use strict";

  function el(tag, cls, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function V4() { return (window.DATA && window.DATA.v4) || null; }
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
  function fmtGB(gb) { return gb >= 1024 ? (gb / 1024).toFixed(2) + " TB" : gb.toFixed(gb < 10 ? 2 : 1) + " GB"; }
  function fmtMoney(n) { return n >= 1e8 ? (n / 1e8).toFixed(2) + " 亿" : n >= 1e4 ? (n / 1e4).toFixed(1) + " 万" : Math.round(n).toLocaleString(); }

  /* concept.id -> 深链接（来自 legacyPlacements），点节点开规范知识卡 */
  function conceptRouteMap() {
    const v4 = V4(); const map = {};
    if (!v4) return map;
    Object.values(v4.legacyPlacements || {}).forEach(p => {
      if (p.kind === "concept" && p.conceptId && !map[p.conceptId]) {
        map[p.conceptId] = p.legacyRoute || ("#/s/" + p.stationId + "/" + (p.legacyPath || []).join("/"));
      }
    });
    return map;
  }
  function conceptStation() {
    const v4 = V4(); const map = {};
    if (!v4) return map;
    Object.values(v4.legacyPlacements || {}).forEach(p => { if (p.kind === "concept" && p.conceptId && !map[p.conceptId]) map[p.conceptId] = p.stationId; });
    return map;
  }

  /* ==================================================================
     ATLAS —— 按四层组织所有规范概念，画 typed relations
     ================================================================== */
  const LAYERS = [
    { id: "physical", name: "物理基础", sub: "加速器 · 服务器 · 机房 · 网络", stations: ["gpu", "server", "dc", "network"] },
    { id: "platform", name: "平台工程", sub: "数据 · 软件栈 · 运维", stations: ["data", "platform", "ops"] },
    { id: "ai", name: "AI 服务", sub: "训练 · 微调 · 推理 · 评测", stations: ["model"] },
    { id: "business", name: "商业决策", sub: "交付 · 变现 · 成本", stations: ["delivery", "token"] }
  ];
  const REL_STYLE = {
    part_of: { label: "组成", color: "#8F9EBD", dash: "" },
    prerequisite_for: { label: "前置", color: "#A78BFA", dash: "" },
    enables: { label: "使能", color: "#34D399", dash: "" },
    constrains: { label: "约束", color: "#FBBF24", dash: "" },
    measured_by: { label: "度量", color: "#2FD4E6", dash: "5 3" },
    implemented_by: { label: "实现", color: "#4C8DFF", dash: "" },
    mitigates: { label: "缓解", color: "#F472B6", dash: "5 3" },
    contrasts_with: { label: "对比", color: "#6B7C99", dash: "3 4" }
  };
  const STATION_COLOR = { gpu: "#4C8DFF", server: "#5EA0FF", dc: "#A78BFA", network: "#2FD4E6", data: "#F472B6", platform: "#818CF8", model: "#34D399", delivery: "#FBBF24", token: "#A3E635", ops: "#F87171" };

  function buildAtlas() {
    const v4 = V4();
    const wrap = el("div", "atlas-page");
    if (!v4) { wrap.innerHTML = '<h2>知识图谱 Atlas</h2><div class="page-sub">V4 内容未加载。</div>'; return wrap; }

    const routeMap = conceptRouteMap();
    const cStation = conceptStation();
    const concepts = v4.concepts;
    const relations = Object.values(v4.relations || {});

    // 布局：4 列，每列一层；列内按站点分组竖排
    const COLW = 300, COLGAP = 24, PADX = 20, TOP = 96, ROWH = 30, GROUPGAP = 20, NODEW = 250, NODEH = 22;
    const pos = {}; // conceptId -> {x,y,cx,cy,layer,station}
    const colHeights = [];
    LAYERS.forEach((layer, li) => {
      const colX = PADX + li * (COLW + COLGAP);
      let y = TOP;
      layer.stations.forEach(stationId => {
        const inLayer = Object.values(concepts).filter(c => cStation[c.id] === stationId);
        if (!inLayer.length) return;
        // 站点小标题
        y += 4;
        const groupY = y;
        y += 22;
        inLayer.forEach(c => {
          const x = colX + (COLW - NODEW) / 2;
          pos[c.id] = { x: x, y: y, cx: x + NODEW / 2, cy: y + NODEH / 2, layer: layer.id, station: stationId, groupY: groupY };
          y += ROWH;
        });
        y += GROUPGAP;
      });
      colHeights.push(y);
    });
    const H = Math.max.apply(null, colHeights) + 30;
    const W = PADX * 2 + LAYERS.length * COLW + (LAYERS.length - 1) * COLGAP;

    // 图例（关系类型过滤）
    let legend = '<div class="atlas-legend"><span class="al-title">关系类型（点击只看一种）：</span>';
    Object.keys(REL_STYLE).forEach(t => {
      const s = REL_STYLE[t];
      legend += '<button class="al-chip" data-rel="' + t + '"><span class="al-swatch" style="background:' + s.color + '"></span>' + s.label + '</button>';
    });
    legend += '<button class="al-chip al-reset" data-rel="all">全部</button></div>';

    wrap.innerHTML = '<h2>知识图谱 Atlas</h2>' +
      '<div class="page-sub">全站 ' + Object.keys(concepts).length + ' 个规范概念按<b>物理基础 · 平台工程 · AI 服务 · 商业决策</b>四层组织；连线是<b>有类型的关系</b>（组成/前置/使能/约束/度量/实现/缓解/对比）。点任意概念打开同一套规范知识卡。</div>' +
      legend +
      '<div class="atlas-holder"><svg viewBox="0 0 ' + W + ' ' + H + '" class="atlas-svg" role="img" aria-label="知识图谱">' + atlasDefs() + '</svg></div>';

    const svg = wrap.querySelector(".atlas-svg");

    // 层背景带 + 层标题
    let bg = "";
    LAYERS.forEach((layer, li) => {
      const colX = PADX + li * (COLW + COLGAP);
      bg += '<rect x="' + (colX - 8) + '" y="70" width="' + (COLW + 16) + '" height="' + (H - 80) + '" rx="14" fill="var(--surface-1)" stroke="var(--hairline)" opacity=".55"/>';
      bg += '<text x="' + (colX + COLW / 2) + '" y="40" text-anchor="middle" class="atlas-layer-name">' + esc(layer.name) + '</text>';
      bg += '<text x="' + (colX + COLW / 2) + '" y="58" text-anchor="middle" class="atlas-layer-sub">' + esc(layer.sub) + '</text>';
    });
    // 站点小标题
    let heads = "";
    const seen = {};
    Object.keys(pos).forEach(cid => {
      const p = pos[cid];
      const key = p.layer + "/" + p.station;
      if (seen[key]) return; seen[key] = 1;
      const st = (window.DATA.stations.find(s => s.id === p.station) || {});
      heads += '<text x="' + (p.x) + '" y="' + (p.groupY + 14) + '" class="atlas-station-head" style="fill:' + (STATION_COLOR[p.station] || "#8F9EBD") + '">' + esc(st.name || p.station) + '</text>';
    });

    // 边（typed relations），带箭头
    let edges = "";
    relations.forEach((r, i) => {
      const a = pos[r.fromConceptId], b = pos[r.toConceptId];
      if (!a || !b) return;
      const st = REL_STYLE[r.type] || { color: "#6B7C99", dash: "" };
      // 从右缘或左缘出发，画二次贝塞尔
      const x1 = a.cx, y1 = a.cy, x2 = b.cx, y2 = b.cy;
      const mx = (x1 + x2) / 2;
      const d = "M" + x1 + " " + y1 + " C " + (mx) + " " + y1 + " " + (mx) + " " + y2 + " " + x2 + " " + y2;
      edges += '<path class="atlas-edge" data-rel="' + r.type + '" data-from="' + esc(r.fromConceptId) + '" data-to="' + esc(r.toConceptId) + '" d="' + d + '" fill="none" stroke="' + st.color + '" stroke-width="1.4"' + (st.dash ? ' stroke-dasharray="' + st.dash + '"' : "") + ' opacity=".55" marker-end="url(#atlas-arrow)"/>';
    });

    // 节点
    let nodesSvg = "";
    Object.keys(pos).forEach(cid => {
      const c = concepts[cid]; if (!c) return;
      const p = pos[cid];
      const col = STATION_COLOR[p.station] || "#8F9EBD";
      const nm = c.canonicalName.length > 15 ? c.canonicalName.slice(0, 14) + "…" : c.canonicalName;
      nodesSvg += '<g class="atlas-node" data-id="' + esc(cid) + '" role="button" tabindex="0" aria-label="' + esc(c.canonicalName) + '" transform="translate(' + p.x + ',' + p.y + ')">' +
        '<rect width="' + NODEW + '" height="' + NODEH + '" rx="6" fill="var(--surface-2)" stroke="' + col + '" stroke-width="1.2"/>' +
        '<rect width="4" height="' + NODEH + '" rx="2" fill="' + col + '"/>' +
        '<text x="12" y="' + (NODEH / 2 + 1) + '" dominant-baseline="central" class="atlas-node-label">' + esc(nm) + '</text>' +
        '<title>' + esc(c.canonicalName) + (c.aliases && c.aliases.length ? "（" + esc(c.aliases.slice(0, 3).join(" / ")) + "）" : "") + '</title>' +
        '</g>';
    });

    svg.insertAdjacentHTML("beforeend", bg + heads + edges + nodesSvg);

    // 交互：点节点开卡；hover 高亮相邻；图例过滤
    svg.querySelectorAll(".atlas-node").forEach(g => {
      const id = g.dataset.id;
      const open = () => { if (routeMap[id]) App.go(routeMap[id]); };
      g.addEventListener("click", open);
      g.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
      g.addEventListener("mouseenter", () => highlight(id));
      g.addEventListener("mouseleave", () => highlight(null));
    });
    function highlight(id) {
      svg.querySelectorAll(".atlas-edge").forEach(p => {
        const on = !id || p.dataset.from === id || p.dataset.to === id;
        p.style.opacity = on ? (id ? "0.95" : "0.55") : "0.08";
        p.style.strokeWidth = (id && (p.dataset.from === id || p.dataset.to === id)) ? "2.4" : "1.4";
      });
      svg.querySelectorAll(".atlas-node").forEach(n => {
        if (!id) { n.style.opacity = "1"; return; }
        const linked = [...svg.querySelectorAll('.atlas-edge[data-from="' + cssEsc(id) + '"],.atlas-edge[data-to="' + cssEsc(id) + '"]')]
          .flatMap(p => [p.dataset.from, p.dataset.to]);
        n.style.opacity = (n.dataset.id === id || linked.indexOf(n.dataset.id) >= 0) ? "1" : "0.35";
      });
    }
    function cssEsc(s) { return String(s).replace(/["\\]/g, "\\$&"); }

    let activeRel = "all";
    wrap.querySelectorAll(".al-chip").forEach(chip => {
      chip.addEventListener("click", () => {
        const rel = chip.dataset.rel;
        activeRel = (activeRel === rel || rel === "all") ? "all" : rel;
        wrap.querySelectorAll(".al-chip").forEach(c => c.classList.toggle("on", activeRel !== "all" && c.dataset.rel === activeRel));
        svg.querySelectorAll(".atlas-edge").forEach(p => {
          p.style.display = (activeRel === "all" || p.dataset.rel === activeRel) ? "" : "none";
        });
      });
    });
    return wrap;
  }
  function atlasDefs() {
    return '<defs><marker id="atlas-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0 L8 4 L0 8 z" fill="context-stroke" opacity=".8"/></marker></defs>';
  }

  /* ==================================================================
     实验室 · 调度
     ================================================================== */
  function labHeader(title, sub) {
    return '<div class="lab-head"><a class="lab-back" href="#/labs">‹ 实验室</a>' +
      '<h2>' + esc(title) + '</h2><div class="page-sub">' + sub + '</div></div>';
  }
  function labDisclaimer(txt) {
    return '<div class="lab-disclaimer"><b>假设与口径：</b>' + txt + ' 结果为<b>教学示意</b>，不构成正式报价或容量承诺；正式对客口径以工程团队评审为准。</div>';
  }

  function buildLabsIndex() {
    const wrap = el("div", "labs-index");
    wrap.innerHTML = '<h2>实验室 Lab</h2><div class="page-sub">四个可操作的核心实验：把“会算、会选、会判断”练出来。每个实验都显式标注假设、口径与局限。</div>';
    const grid = el("div", "labs-grid");
    const labs = [
      { id: "parallel", name: "5D 并行配置实验室", desc: "调 DP/TP/PP/CP/EP，看每卡显存构成与通信模式，判断能不能装下、会不会 OOM。", tag: "训练 · 显存 · 通信", color: "#34D399" },
      { id: "kvcache", name: "KV Cache 可视化", desc: "分块分配、前缀复用、驱逐与碎片：看 Paged KV 如何省显存、提吞吐。", tag: "推理 · 显存", color: "#4C8DFF" },
      { id: "token", name: "Token 经济性 · API/自建 break-even", desc: "完全成本瀑布 + 每百万 Token 成本 + 盈亏平衡，含 cost/token 变好但 cost/success 变差的反例。", tag: "成本 · FinOps", color: "#A3E635" },
      { id: "slo", name: "SLO 控制室 · 故障注入", desc: "SLO / Error Budget / burn rate；注入掉卡、KV OOM、存储变慢、网络抖动、突发流量，看告警与恢复。", tag: "运维 · 可靠性", color: "#F87171" }
    ];
    labs.forEach(l => {
      const card = el("div", "lab-card");
      card.style.setProperty("--lc", l.color);
      card.innerHTML = '<div class="lc-tag">' + l.tag + '</div><div class="lc-name">' + l.name + '</div><div class="lc-desc">' + l.desc + '</div><div class="lc-go">打开实验 →</div>';
      card.setAttribute("role", "link"); card.setAttribute("tabindex", "0");
      const go = () => App.go("#/lab/" + l.id);
      card.addEventListener("click", go);
      card.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } });
      grid.appendChild(card);
    });
    wrap.appendChild(grid);
    return wrap;
  }

  function buildLab(id) {
    let r;
    if (id === "parallel") r = parallelLab();
    else if (id === "kvcache") r = kvCacheLab();
    else if (id === "token") r = tokenLab();
    else if (id === "slo") r = sloLab();
    else r = buildLabsIndex();
    return (r && r.el) ? r.el : r; // SLO lab 返回 {el,cleanup}，定时器随 DOM 脱离自停
  }

  /* ------------------------------------------------------------------
     Lab 1 · 5D 并行配置
     ------------------------------------------------------------------ */
  function parallelLab() {
    const wrap = el("div", "lab-page lab-parallel");
    wrap.innerHTML = labHeader("5D 并行配置实验室",
      "调整并行度，估算<b>每卡显存构成</b>与<b>通信模式</b>。显存模型采用公开的混合精度 Adam 口径（约 16 字节/参数：权重2+梯度2+优化器12），激活为粗略量级估计。");
    const grid = el("div", "lab-grid2");
    const ctl = el("div", "lab-controls");
    ctl.innerHTML =
      seg("mode", "用途", [["train", "训练"], ["infer", "推理"]], "train") +
      slider("params", "参数量 P（B）", 1, 1000, 1, 70, "B") +
      seg("prec", "权重精度", [["2", "BF16"], ["1", "FP8/INT8"], ["0.5", "INT4"]], "2") +
      slider("gpus", "GPU 数 N", 1, 1024, 1, 64, "") +
      slider("mem", "每卡显存", 24, 288, 8, 141, "GB") +
      '<div class="lab-sub-title">并行度（乘积需 = N）</div>' +
      slider("dp", "数据并行 DP", 1, 256, 1, 8, "") +
      slider("tp", "张量并行 TP", 1, 16, 1, 8, "") +
      slider("pp", "流水并行 PP", 1, 32, 1, 1, "") +
      slider("cp", "上下文并行 CP", 1, 16, 1, 1, "") +
      slider("ep", "专家并行 EP", 1, 32, 1, 1, "") +
      '<label class="lab-check"><input type="checkbox" id="zero" checked> ZeRO/FSDP：把模型状态沿 DP 再分片</label>' +
      '<label class="lab-check"><input type="checkbox" id="recompute"> 激活重算（省激活显存、增算力）</label>' +
      slider("mb", "micro-batch 数 m（算流水气泡）", 1, 64, 1, 8, "");
    const out = el("div", "lab-output");
    out.innerHTML =
      '<div class="lab-valid" id="valid"></div>' +
      '<div class="lab-card-title">每卡显存构成（估算）</div>' +
      '<div class="mem-bar" id="membar"></div><div class="mem-legend" id="memlegend"></div>' +
      '<div class="mem-total" id="memtotal"></div>' +
      '<div class="lab-card-title">通信模式</div><div class="comm-table" id="comm"></div>' +
      '<div class="lab-links">相关：<a href="#/s/model/training/distributed">分布式并行</a> · <a href="#/s/gpu/vram">显存预算</a> · <a href="#/s/network/adv/collective">集合通信</a></div>';
    grid.appendChild(ctl); grid.appendChild(out);
    wrap.appendChild(grid);
    wrap.appendChild(el("div", "", labDisclaimer("显存=权重+梯度+优化器+激活+KV 的教学近似（16 字节/参数为混合精度 Adam 公开口径）；激活与 KV 为量级估计，真实占用随实现、算子、重算与碎片变化，须以实测为准。")));

    function val(id) { const s = wrap.querySelector('#lab-' + id); return s ? +s.value : 0; }
    function segv(id) { const b = wrap.querySelector('.seg[data-k="' + id + '"] .seg-btn.on'); return b ? b.dataset.v : ""; }
    function recompute() {
      const mode = segv("mode"), train = mode === "train";
      const P = val("params") * 1e9, wbytes = parseFloat(segv("prec")), N = val("gpus"), memB = val("mem") * 1e9;
      const dp = val("dp"), tp = val("tp"), pp = val("pp"), cp = val("cp"), ep = val("ep"), m = val("mb");
      const zero = wrap.querySelector("#zero").checked, recomp = wrap.querySelector("#recompute").checked;
      const world = dp * tp * pp * cp * ep;
      const modelShard = tp * pp * (zero ? dp : 1);      // 模型状态分片
      const actShard = tp * pp * cp;                     // 激活分片
      // 显存构成（bytes/卡）
      let comp = {};
      if (train) {
        comp["权重"] = 2 * P / modelShard;
        comp["梯度"] = 2 * P / modelShard;
        comp["优化器"] = 12 * P / modelShard;
        // 激活：真实占用主要随 batch×seq×hidden 变化，本工具未取这些输入，
        // 这里只给一个“占位量级”提示激活也吃显存；重算约省 4×。切勿当精确值。
        let act = 2 * P / actShard;
        if (recomp) act *= 0.25;
        comp["激活(占位)"] = act;
      } else {
        comp["权重"] = wbytes * P / (tp * pp);
        comp["KV Cache"] = 2 * P / (tp * pp) * 0.15; // 量级估计
        comp["工作区"] = 0.1 * (wbytes * P / (tp * pp));
      }
      const total = Object.values(comp).reduce((a, b) => a + b, 0);
      // 有效性
      const ok = world === N;
      const oom = total > memB;
      const validEl = wrap.querySelector("#valid");
      validEl.className = "lab-valid " + (ok ? (oom ? "warn" : "ok") : "bad");
      validEl.innerHTML = (ok
        ? '<span class="v-dot"></span>并行度乘积 = ' + world + ' = N ✓'
        : '<span class="v-dot"></span>DP×TP×PP×CP×EP = ' + world + ' ≠ N = ' + N + '（无效配置：world size 必须等于 GPU 数）')
        + (ok && oom ? ' · <b>预计 OOM</b>：每卡约需 ' + fmtGB(total / 1e9) + ' > ' + fmtGB(memB / 1e9) : "");
      // 显存条
      const colors = { "权重": "#4C8DFF", "梯度": "#F472B6", "优化器": "#A78BFA", "激活(占位)": "#34D399", "KV Cache": "#2FD4E6", "工作区": "#6B7C99" };
      const cap = memB;
      let bar = "", leg = "";
      Object.keys(comp).forEach(k => {
        const w = clamp(comp[k] / cap * 100, 0, 100);
        bar += '<span class="mb-seg" style="width:' + w + '%;background:' + colors[k] + '" title="' + k + ' ' + fmtGB(comp[k] / 1e9) + '"></span>';
        leg += '<span class="ml-item"><span class="ml-dot" style="background:' + colors[k] + '"></span>' + k + ' ' + fmtGB(comp[k] / 1e9) + '</span>';
      });
      wrap.querySelector("#membar").innerHTML = bar + (total < cap ? '<span class="mb-free" style="width:' + clamp((1 - total / cap) * 100, 0, 100) + '%"></span>' : "");
      wrap.querySelector("#memlegend").innerHTML = leg;
      wrap.querySelector("#memtotal").innerHTML = '每卡合计 <b class="mono">' + fmtGB(total / 1e9) + '</b> / ' + fmtGB(memB / 1e9) + '（' + (oom ? '<span style="color:var(--red)">超出</span>' : Math.round(total / cap * 100) + '% 占用') + '）';
      // 通信模式
      const rows = [];
      if (dp > 1) rows.push([train ? "数据并行 DP" : "—", "梯度同步：AllReduce（或 ReduceScatter+AllGather）", "每步一次全归约"]);
      if (tp > 1) rows.push(["张量并行 TP", "层内 AllReduce/AllGather", "每层多次、带宽敏感，宜放同 NVLink 域"]);
      if (pp > 1) rows.push(["流水并行 PP", "阶段间 P2P（点对点）", "气泡 ≈ (PP−1)/(m+PP−1) = " + ((pp - 1) / (m + pp - 1) * 100).toFixed(0) + "%"]);
      if (cp > 1) rows.push(["上下文并行 CP", "序列维 Ring/AllGather", "长上下文用，注意 KV 分布"]);
      if (ep > 1) rows.push(["专家并行 EP", "路由 All-to-All", "MoE 用，跨机 All-to-All 易打爆带宽"]);
      if (!rows.length) rows.push(["单卡/纯复制", "无跨卡集合通信", "—"]);
      wrap.querySelector("#comm").innerHTML =
        '<table><thead><tr><th>并行</th><th>集合通信</th><th>特点</th></tr></thead><tbody>' +
        rows.map(r => '<tr><td>' + r[0] + '</td><td>' + r[1] + '</td><td>' + r[2] + '</td></tr>').join("") + '</tbody></table>';
    }
    wireControls(wrap, recompute);
    recompute();
    return wrap;
  }

  /* ------------------------------------------------------------------
     Lab 2 · KV Cache 可视化（Paged / Prefix / 驱逐 / 碎片）
     ------------------------------------------------------------------ */
  function kvCacheLab() {
    const wrap = el("div", "lab-page lab-kv");
    wrap.innerHTML = labHeader("KV Cache 可视化",
      "模拟 <b>PagedAttention</b> 的分块 KV：请求按块分配显存，<b>前缀复用</b>共享系统提示的块，满了触发<b>驱逐</b>，回收留下<b>碎片</b>。");
    const TOTAL = 64, BLK = 16; // 64 块，每块 16 token（vLLM 默认量级）
    let blocks = new Array(TOTAL).fill(null); // 每块: {req, kind}
    let reqs = []; let nextId = 1; let prefixBlocks = null;

    const ctl = el("div", "lab-controls kv-controls");
    ctl.innerHTML =
      '<div class="lab-card-title">操作</div>' +
      '<button class="btn-secondary kv-btn" data-a="add">+ 新请求（随机长度）</button>' +
      '<button class="btn-secondary kv-btn" data-a="addshared">+ 共享系统前缀的请求</button>' +
      '<button class="btn-secondary kv-btn" data-a="decode">推进解码（各 +1 块）</button>' +
      '<button class="btn-secondary kv-btn" data-a="finish">完成最早的请求</button>' +
      '<button class="btn-secondary kv-btn" data-a="reset">重置</button>' +
      '<label class="lab-check"><input type="checkbox" id="prefix" checked> 开启前缀复用（Prefix Cache）</label>' +
      '<div class="kv-stats" id="kvstats"></div>';
    const out = el("div", "lab-output");
    out.innerHTML = '<div class="lab-card-title">KV 显存池（' + TOTAL + ' 块 × ' + BLK + ' token）</div>' +
      '<div class="kv-pool" id="kvpool"></div>' +
      '<div class="kv-reqs" id="kvreqs"></div>' +
      '<div class="lab-links">相关：<a href="#/s/model/inference/kvcache">KV Cache</a> · <a href="#/s/model/inference/pd">PD 分离</a> · <a href="#/s/model/inference/batching">连续批处理</a></div>';
    const grid = el("div", "lab-grid2"); grid.appendChild(ctl); grid.appendChild(out);
    wrap.appendChild(grid);
    wrap.appendChild(el("div", "", labDisclaimer("块数/块大小为教学设定（PagedAttention 用固定块管理 KV、按需分配、支持前缀共享）；真实块大小、驱逐策略与命中率随框架与负载不同。")));

    function freeCount() { return blocks.filter(b => b === null).length; }
    function alloc(n, req, kind) {
      const got = [];
      for (let i = 0; i < TOTAL && got.length < n; i++) if (blocks[i] === null) { blocks[i] = { req: req, kind: kind }; got.push(i); }
      return got.length === n ? got : (got.forEach(i => blocks[i] = null), null);
    }
    function evictOldestFinished() {
      const done = reqs.find(r => r.finished);
      if (!done) return false;
      blocks.forEach((b, i) => { if (b && b.req === done.id && b.kind !== "prefix") blocks[i] = null; });
      reqs = reqs.filter(r => r !== done);
      return true;
    }
    function ensurePrefix() {
      if (!wrap.querySelector("#prefix").checked) { prefixBlocks = null; return null; }
      if (prefixBlocks && prefixBlocks.every(i => blocks[i] && blocks[i].kind === "prefix")) return prefixBlocks;
      const got = alloc(2, 0, "prefix"); // 系统前缀占 2 块
      prefixBlocks = got; return got;
    }
    function addReq(shared) {
      const promptBlocks = shared ? 1 : 1 + Math.floor(Math.random() * 3);
      let need = promptBlocks;
      let usedPrefix = false;
      if (shared) { const pb = ensurePrefix(); if (pb) usedPrefix = true; }
      while (freeCount() < need) { if (!evictOldestFinished()) break; }
      if (freeCount() < need) { flash("显存池已满且无可驱逐请求：新请求需排队（背压）"); return; }
      const id = nextId++;
      alloc(need, id, "prompt");
      reqs.push({ id: id, blocks: need + (usedPrefix ? 2 : 0), gen: 0, finished: false, prefix: usedPrefix });
      render();
    }
    function decode() {
      let blocked = 0;
      reqs.filter(r => !r.finished).forEach(r => {
        if (r.gen % BLK === 0) { // 每满一块申请新块
          while (freeCount() < 1) { if (!evictOldestFinished()) { blocked++; return; } }
          if (freeCount() >= 1) { alloc(1, r.id, "decode"); r.blocks++; }
        }
        r.gen++;
      });
      if (blocked) flash(blocked + " 个请求因显存不足暂停解码");
      render();
    }
    function render() {
      const pool = wrap.querySelector("#kvpool");
      const colorFor = (b) => {
        if (!b) return "";
        if (b.kind === "prefix") return "background:repeating-linear-gradient(45deg,#A3E635,#A3E635 4px,#7bb52a 4px,#7bb52a 8px)";
        const hue = (b.req * 47) % 360; return "background:hsl(" + hue + ",55%,55%)";
      };
      pool.innerHTML = blocks.map((b, i) => '<span class="kv-block' + (b ? " used" : "") + '" style="' + colorFor(b) + '" title="块 ' + i + (b ? "：请求 " + (b.kind === "prefix" ? "共享前缀" : "#" + b.req) : "：空") + '"></span>').join("");
      const used = TOTAL - freeCount();
      const active = reqs.filter(r => !r.finished).length;
      // 碎片：空闲块中被占用块打断的“空洞”数
      let holes = 0, prev = null;
      blocks.forEach(b => { if (b === null && prev !== null) holes++; prev = b; });
      wrap.querySelector("#kvstats").innerHTML =
        '<div class="kv-stat"><span>已用块</span><b class="mono">' + used + " / " + TOTAL + '</b></div>' +
        '<div class="kv-stat"><span>活跃请求</span><b class="mono">' + active + '</b></div>' +
        '<div class="kv-stat"><span>占用率</span><b class="mono">' + Math.round(used / TOTAL * 100) + '%</b></div>' +
        '<div class="kv-stat"><span>碎片空洞</span><b class="mono">' + holes + '</b></div>' +
        '<div class="kv-stat"><span>前缀复用</span><b class="mono">' + (prefixBlocks ? "开（省 " + (reqs.filter(r => r.prefix).length) + " 请求×2 块）" : "关") + '</b></div>';
      wrap.querySelector("#kvreqs").innerHTML = reqs.map(r =>
        '<span class="kv-req' + (r.finished ? " fin" : "") + '">#' + r.id + '·' + r.blocks + '块' + (r.prefix ? '·共享前缀' : '') + (r.finished ? '·完成' : '') + '</span>').join("") || '<span class="muted">还没有请求，点上面的按钮加一个。</span>';
    }
    let flashT;
    function flash(msg) { const s = wrap.querySelector("#kvstats"); const d = el("div", "kv-flash", msg); s.appendChild(d); clearTimeout(flashT); flashT = setTimeout(() => d.remove(), 2600); }
    wrap.querySelectorAll(".kv-btn").forEach(b => b.addEventListener("click", () => {
      const a = b.dataset.a;
      if (a === "add") addReq(false); else if (a === "addshared") addReq(true);
      else if (a === "decode") decode(); else if (a === "finish") { const r = reqs.find(x => !x.finished); if (r) { r.finished = true; render(); } }
      else if (a === "reset") { blocks = new Array(TOTAL).fill(null); reqs = []; nextId = 1; prefixBlocks = null; render(); }
    }));
    render();
    return wrap;
  }

  /* ------------------------------------------------------------------
     Lab 3 · Token 经济性 + API/自建 break-even
     ------------------------------------------------------------------ */
  function tokenLab() {
    const wrap = el("div", "lab-page lab-token");
    wrap.innerHTML = labHeader("Token 经济性 · API / 自建 break-even",
      "把<b>完全成本（fully-loaded）</b>摊到每百万 Token，和 API 单价比出<b>盈亏平衡</b>；并演示 <b>cost/token 变好但 cost/success 变差</b>的反例。");
    const grid = el("div", "lab-grid2");
    const ctl = el("div", "lab-controls");
    ctl.innerHTML =
      slider("gpus", "GPU 数", 1, 2048, 1, 64, "") +
      slider("price", "每卡采购价", 5, 50, 1, 25, "万元") +
      slider("life", "折旧年限", 1, 6, 1, 3, "年") +
      slider("kw", "每卡功率", 0.3, 1.5, 0.05, 1.0, "kW") +
      slider("pue", "PUE", 1.05, 2.0, 0.05, 1.3, "") +
      slider("elec", "电价", 0.3, 1.5, 0.05, 0.6, "元/kWh") +
      slider("util", "利用率", 5, 95, 5, 45, "%") +
      slider("tps", "每卡有效吞吐", 200, 8000, 100, 2000, "tok/s") +
      slider("oh", "其他成本加成（存储/网络/人力/软件）", 0, 120, 5, 45, "%") +
      slider("api", "对标 API 单价", 1, 40, 1, 8, "元/百万tok") +
      slider("succ", "有效结果率（成功/合格）", 30, 100, 5, 80, "%");
    const out = el("div", "lab-output");
    out.innerHTML =
      '<div class="lab-card-title">完全成本瀑布（每年）</div><div class="cost-waterfall" id="wf"></div>' +
      '<div class="cost-kpis" id="kpis"></div>' +
      '<div class="breakeven" id="be"></div>' +
      '<div class="lab-links">相关：<a href="#/s/token/pricing">成本→定价</a> · <a href="#/s/token/pricing/tcochain">TCO 账链</a> · <a href="#/s/dc/cooling/pue">PUE</a> · <a href="#/s/ops/monitor/utilization">利用率</a></div>';
    grid.appendChild(ctl); grid.appendChild(out);
    wrap.appendChild(grid);
    wrap.appendChild(el("div", "", labDisclaimer("采用公开行业口径的简化模型（折旧直线法、电费=功率×PUE×小时×利用率×电价、其他成本按加成），未含税费/带宽外购/闲置冗余细项；吞吐/单价为示意输入。")));

    function val(id) { const s = wrap.querySelector('#lab-' + id); return s ? +s.value : 0; }
    function recompute() {
      const gpus = val("gpus"), price = val("price") * 1e4, life = val("life"), kw = val("kw"), pue = val("pue"),
        elec = val("elec"), util = val("util") / 100, tps = val("tps"), oh = val("oh") / 100, api = val("api"), succ = val("succ") / 100;
      const capexYr = gpus * price / life;
      const elecYr = gpus * kw * pue * 8760 * util * elec;
      const otherYr = (capexYr + elecYr) * oh;
      const totalYr = capexYr + elecYr + otherYr;
      const tokensYr = gpus * tps * util * 31536000; // tokens/年
      const costPerM = totalYr / (tokensYr / 1e6); // 元/百万token
      const costPerSuccess = costPerM / Math.max(succ, 0.01);
      // 瀑布
      const parts = [["折旧/资本", capexYr, "#4C8DFF"], ["电费(含PUE)", elecYr, "#FBBF24"], ["其他加成", otherYr, "#A78BFA"]];
      const max = totalYr;
      wrap.querySelector("#wf").innerHTML = parts.map(p =>
        '<div class="wf-row"><span class="wf-label">' + p[0] + '</span><span class="wf-bar"><span style="width:' + (p[1] / max * 100).toFixed(1) + '%;background:' + p[2] + '"></span></span><span class="wf-val mono">' + fmtMoney(p[1]) + '</span></div>').join("") +
        '<div class="wf-row wf-total"><span class="wf-label">合计/年</span><span class="wf-bar"></span><span class="wf-val mono">' + fmtMoney(totalYr) + '</span></div>';
      // KPI
      wrap.querySelector("#kpis").innerHTML =
        kpi("每百万 Token 成本", "¥" + costPerM.toFixed(2), costPerM <= api ? "ok" : "warn") +
        kpi("每有效结果成本", "¥" + costPerSuccess.toFixed(2), "") +
        kpi("年产出", (tokensYr / 1e12).toFixed(1) + " 万亿 tok", "") +
        kpi("对标 API", "¥" + api.toFixed(0) + "/百万", "");
      // break-even
      const cheaper = costPerM <= api;
      // 求盈亏平衡利用率：costPerM(util) = api  →  totalYr(util)/(tokensYr(util)) 。近似：电费随util、capex/其他固定部分不随util
      // 解析较繁，用扫描找 break-even util
      let beUtil = null;
      for (let u = 5; u <= 100; u++) {
        const uu = u / 100;
        const e2 = gpus * kw * pue * 8760 * uu * elec;
        const o2 = (capexYr + e2) * oh;
        const t2 = capexYr + e2 + o2;
        const tok2 = gpus * tps * uu * 31536000;
        const c2 = t2 / (tok2 / 1e6);
        if (c2 <= api) { beUtil = u; break; }
      }
      wrap.querySelector("#be").innerHTML =
        '<div class="be-box ' + (cheaper ? "ok" : "warn") + '">' +
        '<div class="be-title">' + (cheaper ? "当前配置：自建更便宜" : "当前配置：API 更便宜") + '</div>' +
        '<div class="be-detail">自建 ¥' + costPerM.toFixed(2) + ' vs API ¥' + api.toFixed(0) + ' /百万 Token。' +
        (beUtil ? '盈亏平衡利用率约 <b>' + beUtil + '%</b>：低于它 API 更划算，高于它自建更划算。' : '在给定吞吐/单价下，任何利用率都难低于 API 单价——先提吞吐或降卡价。') + '</div>' +
        '<div class="be-warn">⚠ 反例：把利用率或吞吐堆上去能压低 <b>每 Token 成本</b>，但如果<b>有效结果率</b>只有 ' + Math.round(succ * 100) + '%，<b>每有效结果成本</b>是它的 ' + (1 / succ).toFixed(2) + ' 倍（¥' + costPerSuccess.toFixed(2) + '）——省了 Token 却未必省了“办成的事”。</div>' +
        '</div>';
    }
    function kpi(label, v, tone) { return '<div class="lab-kpi ' + tone + '"><span class="k-label">' + label + '</span><span class="k-val mono">' + v + '</span></div>'; }
    wireControls(wrap, recompute);
    recompute();
    return wrap;
  }

  /* ------------------------------------------------------------------
     Lab 4 · SLO 控制室 + 故障注入
     ------------------------------------------------------------------ */
  function sloLab() {
    const wrap = el("div", "lab-page lab-slo");
    wrap.innerHTML = labHeader("SLO 控制室 · 故障注入",
      "设定 SLO 与 Error Budget，注入常见故障看指标劣化与<b>燃尽率(burn rate)</b>告警；用降级/扩容/回滚/切流恢复。<b>Error Budget = 100% − SLO</b>；示例阈值 burn>14.4(1h) 触发分页（Google SRE）。");
    // 状态
    const S = {
      slo: 99.9, budgetLeft: 100, // 剩余预算 %
      metrics: { success: 100, ttft: 0.4, tpot: 20, util: 70 }, // 成功率%、TTFT s、TPOT ms、利用率%
      faults: {}, running: true, t: 0
    };
    const FAULTS = {
      xid: { name: "GPU XID / 掉卡", eff: "success-8,util-15,ttft+0.3", tip: "一张卡失联，副本减少" },
      node: { name: "节点故障", eff: "success-15,util-25,ttft+0.6", tip: "整机下线，容量骤降" },
      kvoom: { name: "KV OOM", eff: "success-20,ttft+0.8,tpot+15", tip: "显存不足，请求被拒/排队" },
      storage: { name: "存储变慢", eff: "ttft+1.2,tpot+8,success-4", tip: "数据/权重加载变慢" },
      jitter: { name: "网络抖动", eff: "tpot+12,success-3", tip: "同步与流式受累" },
      spike: { name: "突发流量", eff: "ttft+0.9,tpot+10,success-10,util+25", tip: "并发超容量" }
    };
    const RECOVER = { degrade: "降级（限流/降配）", scale: "扩容（加副本）", rollback: "回滚", failover: "切流到备用" };

    const ctl = el("div", "lab-controls");
    ctl.innerHTML =
      slider("slo", "SLO 目标（成功率）", 99, 99.99, 0.01, 99.9, "%") +
      '<div class="lab-sub-title">注入故障（可叠加）</div>' +
      Object.keys(FAULTS).map(k => '<button class="btn-secondary fault-btn" data-f="' + k + '" title="' + FAULTS[k].tip + '">+ ' + FAULTS[k].name + '</button>').join("") +
      '<div class="lab-sub-title">恢复动作</div>' +
      Object.keys(RECOVER).map(k => '<button class="btn-secondary rec-btn" data-r="' + k + '">' + RECOVER[k] + '</button>').join("") +
      '<button class="btn-secondary" data-r="reset" style="margin-top:8px">全部恢复 / 重置</button>';
    const out = el("div", "lab-output");
    out.innerHTML =
      '<div class="slo-alert" id="sloalert"></div>' +
      '<div class="slo-gauges" id="gauges"></div>' +
      '<div class="lab-card-title">Error Budget 燃尽</div>' +
      '<div class="budget-bar"><span id="budgetfill"></span></div><div class="budget-meta" id="budgetmeta"></div>' +
      '<div class="lab-card-title">活跃故障 / 追踪</div><div class="slo-trace" id="trace"></div>' +
      '<div class="lab-links">相关：<a href="#/s/ops/capacity">SLO 与容量</a> · <a href="#/s/ops/alerts">告警与故障</a> · <a href="#/s/ops/alerts/dropnight">掉卡之夜</a></div>';
    const grid = el("div", "lab-grid2"); grid.appendChild(ctl); grid.appendChild(out);
    wrap.appendChild(grid);
    wrap.appendChild(el("div", "", labDisclaimer("指标劣化幅度与燃尽率为教学模型（相对示意，非真实系统读数）；burn rate 与告警阈值示意自 Google SRE 多窗口多燃尽率方法，实际阈值按 SLO 与流量整定。")));

    function applyFaults() {
      const base = { success: 100, ttft: 0.4, tpot: 20, util: 70 };
      Object.keys(S.faults).forEach(k => {
        if (!S.faults[k]) return;
        FAULTS[k].eff.split(",").forEach(term => {
          const m = term.match(/(success|ttft|tpot|util)([+-][\d.]+)/);
          if (m) base[m[1]] += parseFloat(m[2]);
        });
      });
      base.success = clamp(base.success, 60, 100);
      base.ttft = Math.max(0.1, base.ttft); base.tpot = Math.max(5, base.tpot); base.util = clamp(base.util, 0, 100);
      S.metrics = base;
    }
    function tick() {
      applyFaults();
      const slo = S.slo;
      // 失败率（%）vs 允许失败率 → burn rate = 实际错误率 / 允许错误率
      const errRate = 100 - S.metrics.success;         // 当前错误率 %
      const allowed = 100 - slo;                        // 允许错误率 %（=错误预算率）
      const burn = allowed > 0 ? errRate / allowed : 0; // 燃尽率（>1 即在超速消耗预算）
      // 每 tick 消耗预算：burn × (tick 占窗口比例)。教学：每 tick 视作烧 burn×0.6% 预算
      if (burn > 0) S.budgetLeft = clamp(S.budgetLeft - burn * 0.6, 0, 100);
      else S.budgetLeft = clamp(S.budgetLeft + 0.4, 0, 100); // 健康时缓慢回补（新周期）
      render(burn);
    }
    function render(burn) {
      burn = burn || 0;
      const m = S.metrics;
      // 告警
      const alert = wrap.querySelector("#sloalert");
      let level = "ok", txt = "健康：预算充足，无分页告警。";
      if (S.budgetLeft <= 0) { level = "page"; txt = "🚨 Error Budget 已耗尽：冻结变更、优先恢复可靠性。"; }
      else if (burn >= 14.4) { level = "page"; txt = "🚨 PAGE：burn rate " + burn.toFixed(1) + " ≥ 14.4（1h 窗示例）——立即响应。"; }
      else if (burn >= 6) { level = "warn"; txt = "⚠ 二级告警：burn rate " + burn.toFixed(1) + "（≥6，6h 窗示例）——尽快处理。"; }
      else if (burn > 1) { level = "warn"; txt = "在超速消耗预算（burn " + burn.toFixed(2) + "），关注。"; }
      alert.className = "slo-alert " + level; alert.textContent = txt;
      // 仪表
      const g = [
        ["成功率", m.success.toFixed(1) + "%", m.success >= S.slo ? "ok" : "bad", m.success],
        ["TTFT", m.ttft.toFixed(2) + "s", m.ttft <= 0.8 ? "ok" : "warn", clamp(100 - m.ttft * 40, 0, 100)],
        ["TPOT", m.tpot.toFixed(0) + "ms", m.tpot <= 35 ? "ok" : "warn", clamp(100 - m.tpot, 0, 100)],
        ["利用率", m.util.toFixed(0) + "%", m.util >= 100 ? "warn" : "ok", m.util]
      ];
      wrap.querySelector("#gauges").innerHTML = g.map(x =>
        '<div class="slo-gauge ' + x[2] + '"><div class="sg-val mono">' + x[1] + '</div><div class="sg-label">' + x[0] + '</div><div class="sg-bar"><span style="width:' + clamp(x[3], 0, 100) + '%"></span></div></div>').join("");
      // 预算
      wrap.querySelector("#budgetfill").style.width = S.budgetLeft + "%";
      wrap.querySelector("#budgetfill").className = S.budgetLeft > 30 ? "ok" : S.budgetLeft > 0 ? "warn" : "bad";
      const exhaustTicks = burn > 1 ? (S.budgetLeft / (burn * 0.6)) : Infinity;
      wrap.querySelector("#budgetmeta").innerHTML = '剩余预算 <b class="mono">' + S.budgetLeft.toFixed(1) + '%</b> · 当前 burn rate <b class="mono">' + burn.toFixed(2) + '×</b> · ' +
        (burn > 1 ? '按此速率约 <b class="mono">' + Math.round(exhaustTicks) + '</b> 步耗尽（SLO ' + S.slo + '% → 允许错误率 ' + (100 - S.slo).toFixed(2) + '%）' : '预算未在消耗');
      // 追踪/故障
      const active = Object.keys(S.faults).filter(k => S.faults[k]);
      wrap.querySelector("#trace").innerHTML = active.length
        ? active.map(k => '<span class="fault-tag">' + FAULTS[k].name + '</span>').join("")
        : '<span class="muted">无活跃故障。注入一个看指标与 burn rate 变化。</span>';
      wrap.querySelectorAll(".fault-btn").forEach(b => b.classList.toggle("on", !!S.faults[b.dataset.f]));
    }
    wrap.querySelectorAll(".fault-btn").forEach(b => b.addEventListener("click", () => { S.faults[b.dataset.f] = !S.faults[b.dataset.f]; tick(); }));
    wrap.querySelectorAll(".rec-btn,[data-r]").forEach(b => b.addEventListener("click", () => {
      const r = b.dataset.r;
      if (r === "reset") { S.faults = {}; S.budgetLeft = 100; }
      else if (r === "scale" || r === "failover") { S.faults.node = false; S.faults.spike = false; }
      else if (r === "degrade") { S.faults.kvoom = false; S.faults.spike = false; }
      else if (r === "rollback") { S.faults.xid = false; S.faults.storage = false; S.faults.jitter = false; }
      tick();
    }));
    const sloSlider = wrap.querySelector("#lab-slo");
    if (sloSlider) sloSlider.addEventListener("input", () => { S.slo = +sloSlider.value; const o = wrap.querySelector('[data-out="slo"]'); if (o) o.textContent = S.slo + "%"; tick(); });

    // 自动推进（reduced-motion 下改为手动步进按钮）
    const reduce = window.App && App.reducedMotion && App.reducedMotion();
    let timer = null;
    if (reduce) {
      const stepBtn = el("button", "btn-primary", "手动推进一步（已减少动效）");
      stepBtn.addEventListener("click", tick); ctl.appendChild(stepBtn);
    } else {
      timer = setInterval(() => { if (!document.body.contains(wrap)) { clearInterval(timer); return; } tick(); }, 1500);
    }
    tick();
    return { el: wrap, cleanup: () => { if (timer) clearInterval(timer); } };
  }

  /* ------------------------------ 控件 helper ------------------------------ */
  function slider(id, label, min, max, step, value, suffix) {
    return '<div class="lab-input"><label>' + esc(label) + '<span class="slider-val mono" data-out="' + id + '">' + value + (suffix || "") + '</span></label>' +
      '<input type="range" id="lab-' + id + '" data-suffix="' + (suffix || "") + '" min="' + min + '" max="' + max + '" step="' + step + '" value="' + value + '"></div>';
  }
  function seg(id, label, opts, cur) {
    return '<div class="lab-input"><label>' + esc(label) + '</label><div class="seg" data-k="' + id + '">' +
      opts.map(o => '<button class="seg-btn' + (o[0] === cur ? " on" : "") + '" data-v="' + o[0] + '">' + o[1] + '</button>').join("") + '</div></div>';
  }
  function wireControls(wrap, recompute) {
    wrap.querySelectorAll('input[type="range"]').forEach(sl => sl.addEventListener("input", () => {
      const o = wrap.querySelector('[data-out="' + sl.id.replace("lab-", "") + '"]');
      if (o) o.textContent = sl.value + (sl.dataset.suffix || "");
      recompute();
    }));
    wrap.querySelectorAll(".seg .seg-btn").forEach(b => b.addEventListener("click", () => {
      b.parentElement.querySelectorAll(".seg-btn").forEach(x => x.classList.remove("on"));
      b.classList.add("on"); recompute();
    }));
    wrap.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.addEventListener("change", recompute));
  }

  return { buildAtlas: buildAtlas, buildLab: buildLab, buildLabsIndex: buildLabsIndex };
})();
