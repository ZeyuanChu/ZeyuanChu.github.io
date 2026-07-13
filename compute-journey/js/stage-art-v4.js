/* ========================================================================
   算力之旅 · S1–S7 中央工作台 V4
   使用原生 HTML/CSS 构建设备与流程图，保留 data-node / 深链接交互。
   ======================================================================== */
window.StageArtV4 = (function () {
  "use strict";

  const VISUALS = {
    "gpu-closeup": 1,
    "server-explode": 1,
    "dc-room": 1,
    "network-topo": 1,
    "data-pipeline": 1,
    "software-stack": 1,
    "model-radial": 1
  };

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function findNode(station, id) {
    let found = null;
    function walk(nodes) {
      if (!nodes || found) return;
      nodes.forEach(function (node) {
        if (found) return;
        if (node.id === id) found = node;
        else walk(node.children);
      });
    }
    walk(station.nodes);
    if (!found && station.advanced) walk(station.advanced.nodes);
    return found;
  }

  function hot(station, id, cls, inner, path) {
    const node = findNode(station, id);
    const aria = node ? node.name + "：" + node.brief : id;
    return '<button type="button" class="cs-hot hot ' + (cls || "") + '"' +
      (path ? ' data-path="' + esc(path) + '"' : ' data-node="' + esc(id) + '"') +
      ' aria-label="' + esc(aria) + '">' + inner + '</button>';
  }

  function frame(station, cls, eyebrow, title, note, body, footer) {
    return '<section class="control-stage ' + cls + '" aria-label="' + esc(station.name) + '中央交互图">' +
      '<header class="cs-head">' +
        '<div><span class="cs-kicker">' + esc(eyebrow) + '</span><h3>' + esc(title) + '</h3></div>' +
        '<div class="cs-live"><i aria-hidden="true"></i><span>教学沙盘</span></div>' +
      '</header>' +
      '<p class="cs-note">' + esc(note) + '</p>' +
      '<div class="cs-canvas">' + body + '</div>' +
      '<footer class="cs-footer">' + footer + '</footer>' +
    '</section>';
  }

  function chips(items) {
    return items.map(function (item) {
      return '<span class="cs-chip"><i class="' + (item.tone || "") + '" aria-hidden="true"></i>' + esc(item.label) + '</span>';
    }).join("");
  }

  function wire(mount, station) {
    mount.querySelectorAll("[data-node], [data-path]").forEach(function (item) {
      if (item.dataset.stageWired) return;
      item.dataset.stageWired = "1";
      function highlight(on) {
        const parts = item.dataset.path ? item.dataset.path.split("/").filter(Boolean) : [item.dataset.node];
        const root = parts[0] === "adv" ? parts[1] : parts[0];
        if (root && App.setHighlight) App.setHighlight(root, on);
      }
      item.addEventListener("click", function () {
        const path = item.dataset.path ? item.dataset.path.split("/").filter(Boolean) : [item.dataset.node];
        App.openNode(station.id, path);
      });
      item.addEventListener("mouseenter", function () { highlight(true); });
      item.addEventListener("mouseleave", function () { highlight(false); });
      item.addEventListener("focus", function () { highlight(true); });
      item.addEventListener("blur", function () { highlight(false); });
    });
  }

  function normalisePath(path) {
    if (Array.isArray(path)) return path.filter(Boolean).map(String);
    return String(path || "").split("/").filter(Boolean);
  }

  function workbenchConfig(station) {
    return (window.StationWorkbenchConfig || {})[station.id] || { modes: [], scenarios: [] };
  }

  function createController(mount, station, options) {
    options = options || {};
    const root = mount.querySelector(".control-stage");
    const wrap = mount.parentElement;
    const config = workbenchConfig(station);
    const modeNodes = options.modeNodes || {};
    const scenarioNodes = options.scenarioNodes || {};
    const scenarioModes = options.scenarioModes || {};
    const modeById = {};
    const sceneById = {};
    (config.modes || []).forEach(function (item) { modeById[item.id] = item; });
    (config.scenarios || []).forEach(function (item) { sceneById[item.id] = item; });
    let active = true;
    const state = {
      stationId: station.id,
      modeId: "",
      scenarioId: null,
      phase: "ready",
      selectedPath: [],
      source: "init"
    };

    const banner = document.createElement("div");
    banner.className = "cs-scenario-banner";
    banner.hidden = true;
    banner.setAttribute("role", "status");
    banner.setAttribute("aria-live", "polite");
    root.appendChild(banner);

    function snapshot() {
      return {
        stationId: state.stationId,
        modeId: state.modeId,
        scenarioId: state.scenarioId,
        phase: state.phase,
        selectedPath: state.selectedPath.slice(),
        source: state.source
      };
    }

    function idsForMode(modeId, spec) {
      const configured = modeNodes[modeId];
      if (configured === "*") return [];
      if (Array.isArray(configured)) return configured.slice();
      if (spec && Array.isArray(spec.visibleNodes)) return spec.visibleNodes.slice();
      if (spec && spec.node) return [String(spec.node).split("/")[0]];
      return [];
    }

    function idsForScenario(sceneId, spec) {
      const configured = scenarioNodes[sceneId];
      if (Array.isArray(configured)) return configured.slice();
      if (spec && Array.isArray(spec.focusPaths)) {
        return spec.focusPaths.map(function (path) { return normalisePath(path)[0]; }).filter(Boolean);
      }
      if (spec && spec.node) return [String(spec.node).split("/")[0]];
      return [];
    }

    function markTargets(className, ids) {
      const set = new Set((ids || []).filter(Boolean));
      root.querySelectorAll("[data-node], [data-path]").forEach(function (item) {
        const itemPath = item.dataset.path ? normalisePath(item.dataset.path) : [item.dataset.node];
        const itemRoot = itemPath[0] === "adv" ? itemPath[1] : itemPath[0];
        item.classList.toggle(className, !!itemRoot && set.has(itemRoot));
      });
      return set.size > 0;
    }

    function modeForPath(path) {
      const parts = normalisePath(path);
      const rootId = parts[0] === "adv" ? parts[1] : parts[0];
      if (!rootId) return "";
      const ids = Object.keys(modeNodes);
      for (let index = 0; index < ids.length; index += 1) {
        const modeId = ids[index];
        if (modeId === options.defaultMode) continue;
        const nodes = modeNodes[modeId];
        if (Array.isArray(nodes) && nodes.indexOf(rootId) >= 0) return modeId;
      }
      const configMode = (config.modes || []).find(function (item) {
        return String(item.node || "").split("/")[0] === rootId;
      });
      if (configMode) return configMode.id;
      const defaultNodes = modeNodes[options.defaultMode];
      if (defaultNodes === "*" || (Array.isArray(defaultNodes) && defaultNodes.indexOf(rootId) >= 0)) return options.defaultMode || "";
      return "";
    }

    function updateLive(label) {
      const live = root.querySelector(".cs-live span");
      if (live) live.textContent = label || "教学沙盘";
    }

    function updateNote(spec) {
      const note = root.querySelector(".cs-note");
      if (!note) return;
      if (!note.dataset.baseNote) note.dataset.baseNote = note.textContent;
      note.textContent = spec && spec.description ? spec.description : note.dataset.baseNote;
    }

    function notifyState() {
      if (typeof options.onState === "function") options.onState(snapshot(), root);
    }

    function applyMode(modeId, spec, preserveScenario, source) {
      if (!active || !root) return snapshot();
      spec = spec || modeById[modeId] || {};
      state.modeId = modeId || state.modeId;
      state.source = source || "mode";
      if (!preserveScenario) clearScenario(true);
      root.dataset.mode = state.modeId;
      root.dataset.modeLabel = spec.label || state.modeId || "总览";
      if (wrap) wrap.dataset.mode = state.modeId;
      const hasTargets = markTargets("is-mode-target", idsForMode(state.modeId, spec));
      root.classList.toggle("has-mode-focus", hasTargets);
      updateNote(spec);
      updateLive(spec.label ? "视图 · " + spec.label : "教学沙盘");
      notifyState();
      return snapshot();
    }

    function setMode(modeId, spec) {
      return applyMode(modeId, spec, false, "mode");
    }

    function focusPath(path, source) {
      if (!active || !root) return snapshot();
      const parts = normalisePath(path);
      state.selectedPath = parts;
      state.source = source || "path";
      const route = parts.join("/");
      const rootId = parts[0] === "adv" ? parts[1] : parts[0];
      root.querySelectorAll("[data-node], [data-path]").forEach(function (item) {
        const exact = item.dataset.path ? item.dataset.path === route : item.dataset.node === rootId;
        item.classList.toggle("is-path-focus", !!route && exact);
      });
      root.classList.toggle("has-path-focus", parts.length > 0);
      notifyState();
      return snapshot();
    }

    function applyScenario(sceneId, spec) {
      if (!active || !root) return snapshot();
      spec = spec || sceneById[sceneId] || {};
      const targetMode = spec.modeId || scenarioModes[sceneId] || state.modeId;
      if (targetMode && targetMode !== state.modeId) applyMode(targetMode, modeById[targetMode], true, "scenario");
      state.scenarioId = sceneId;
      state.phase = "scenario";
      state.source = "scenario";
      root.dataset.scenario = sceneId;
      root.dataset.phase = "scenario";
      root.dataset.scenarioLabel = spec.label || sceneId;
      if (wrap) {
        wrap.dataset.scenario = sceneId;
        wrap.dataset.phase = "scenario";
      }
      const targets = idsForScenario(sceneId, spec);
      root.classList.toggle("has-scenario", markTargets("is-scenario-target", targets));
      const inspectorPath = spec.inspectorPath || spec.node || targets[0] || "";
      if (inspectorPath) focusPath(inspectorPath, "scenario");
      banner.hidden = false;
      banner.innerHTML = '<b>' + esc(spec.status || "场景已应用") + '</b><span>' +
        esc(spec.label || sceneId) + '</span>';
      updateLive("场景 · " + (spec.label || sceneId));
      notifyState();
      return snapshot();
    }

    function clearScenario(silent) {
      if (!active || !root) return snapshot();
      state.scenarioId = null;
      state.phase = "ready";
      root.dataset.scenario = "none";
      root.dataset.phase = "ready";
      root.dataset.scenarioLabel = "";
      root.classList.remove("has-scenario");
      root.querySelectorAll(".is-scenario-target").forEach(function (item) { item.classList.remove("is-scenario-target"); });
      if (wrap) {
        wrap.dataset.scenario = "none";
        wrap.dataset.phase = "ready";
      }
      banner.hidden = true;
      banner.textContent = "";
      if (!silent) {
        updateLive((modeById[state.modeId] || {}).label ? "视图 · " + modeById[state.modeId].label : "教学沙盘");
        notifyState();
      }
      return snapshot();
    }

    function syncDrawer(path) {
      if (!active) return snapshot();
      const parts = normalisePath(path);
      const routeRoot = parts[0] === "adv" ? parts[1] : parts[0];
      if (state.scenarioId && routeRoot) {
        const validTargets = idsForScenario(state.scenarioId, sceneById[state.scenarioId] || {});
        if (validTargets.length && validTargets.indexOf(routeRoot) < 0) clearScenario(true);
      }
      const derivedMode = modeForPath(parts);
      if (derivedMode && derivedMode !== state.modeId) applyMode(derivedMode, modeById[derivedMode], true, "route");
      return focusPath(parts, "route");
    }

    function cleanup() {
      active = false;
      if (root) {
        delete root.dataset.mode;
        delete root.dataset.modeLabel;
        delete root.dataset.scenario;
        delete root.dataset.scenarioLabel;
        delete root.dataset.phase;
        root.classList.remove("has-mode-focus", "has-scenario", "has-path-focus");
      }
      if (wrap) {
        wrap.classList.remove("stage-v4-mounted", "stage-static");
        delete wrap.dataset.mode;
        delete wrap.dataset.scenario;
        delete wrap.dataset.phase;
      }
      if (typeof options.cleanup === "function") options.cleanup();
    }

    root.dataset.phase = "ready";
    root.dataset.scenario = "none";
    if (wrap) { wrap.dataset.phase = "ready"; wrap.dataset.scenario = "none"; }
    const routePath = App.state && App.state.drawerPath ? App.state.drawerPath.slice() : [];
    const initialMode = modeForPath(routePath) || options.defaultMode || ((config.modes || [])[0] || {}).id || Object.keys(modeNodes)[0] || "overview";
    applyMode(initialMode, modeById[initialMode], true, "init");
    focusPath(routePath, "init");

    return {
      setMode: setMode,
      applyScenario: applyScenario,
      focusPath: focusPath,
      syncDrawer: syncDrawer,
      clearScenario: clearScenario,
      getState: snapshot,
      cleanup: cleanup
    };
  }

  function finish(mount, station, html, options) {
    mount.innerHTML = html;
    wire(mount, station);
    const wrap = mount.parentElement;
    if (wrap) {
      wrap.classList.remove("stage-3d");
      wrap.classList.add("stage-static", "stage-v4-mounted");
    }
    return createController(mount, station, options);
  }

  function gpu(station, mount) {
    const dieGrid = Array.from({ length: 16 }, function (_, i) {
      return '<span style="--i:' + i + '"></span>';
    }).join("");
    const memory = Array.from({ length: 4 }, function (_, i) {
      return '<span class="gpu-memory-bank"><b>HBM ' + (i + 1) + '</b><small>STACK</small></span>';
    }).join("");
    const core = hot(station, "core", "gpu-core", '<span class="gpu-die-grid">' + dieGrid + '</span><b>计算核心</b><small>并行矩阵运算</small>');
    const vram = hot(station, "vram", "gpu-memory", memory);
    const bandwidth = hot(station, "bandwidth", "gpu-fabric", '<span class="gpu-fabric-lines" aria-hidden="true"></span><b>显存带宽</b><small>核心 ↔ HBM</small>');
    const cooling = hot(station, "cooling", "gpu-side-card", '<span class="cs-card-icon fan-glyph" aria-hidden="true"></span><span><b>散热与功耗</b><small>热量能否被稳定带走</small></span>');
    const dataformat = hot(station, "dataformat", "gpu-side-card", '<span class="cs-card-icon bits-glyph" aria-hidden="true">8</span><span><b>数据格式</b><small>精度、速度与显存占用</small></span>');
    const types = hot(station, "types", "gpu-side-card", '<span class="cs-card-icon card-glyph" aria-hidden="true"></span><span><b>卡的分类</b><small>训练、推理与图形卡</small></span>');
    const body = '<div class="gpu-layout">' +
      '<div class="gpu-board" aria-hidden="true"><span class="gpu-board-trace t1"></span><span class="gpu-board-trace t2"></span><span class="gpu-board-trace t3"></span></div>' +
      '<div class="gpu-assembly">' + bandwidth + vram + core + '</div>' +
      '<aside class="gpu-side">' + cooling + dataformat + types + '</aside>' +
    '</div>';
    const footer = '<span>观察顺序</span>' + chips([
      { label: "核心算", tone: "green" },
      { label: "显存装", tone: "cyan" },
      { label: "带宽搬", tone: "blue" },
      { label: "散热稳", tone: "amber" }
    ]);
    return finish(mount, station, frame(station, "cs-gpu", "S1 · ACCELERATOR BOARD", "拆开一张显卡", "点一块器件，理解算力、容量、搬运速度和热设计如何互相制约。", body, footer), {
      defaultMode: "anatomy",
      modeNodes: {
        anatomy: "*",
        memory: ["vram"],
        bottleneck: ["bandwidth", "core"],
        precision: ["dataformat", "types"]
      },
      scenarioModes: { oom: "memory", feed: "bottleneck", thermal: "anatomy", fit: "precision" },
      scenarioNodes: {
        oom: ["vram"],
        feed: ["bandwidth", "core"],
        thermal: ["cooling"],
        fit: ["types", "dataformat"]
      }
    });
  }

  function server(station, mount) {
    const gpuCards = Array.from({ length: 8 }, function (_, i) {
      return '<span class="server-gpu"><i aria-hidden="true"></i><b>GPU ' + (i + 1) + '</b></span>';
    }).join("");
    const fans = Array.from({ length: 6 }, function () { return '<i aria-hidden="true"></i>'; }).join("");
    const mem = Array.from({ length: 8 }, function () { return '<i aria-hidden="true"></i>'; }).join("");
    const body = '<div class="server-layout">' +
      hot(station, "superpod", "server-superpod", '<span><b>机架级超节点</b><small>从“一台服务器”向“一整个机架”扩展</small></span><em>RACK SCALE</em>', "adv/superpod") +
      '<div class="server-chassis">' +
        hot(station, "cooling", "server-fans", '<span class="fan-row">' + fans + '</span><b>风扇墙</b>') +
        hot(station, "gpu8", "server-gpus", '<span class="server-gpu-grid">' + gpuCards + '</span><b class="server-section-label">GPU × 8</b>') +
        hot(station, "nvlink", "server-fabric", '<i aria-hidden="true"></i><b>NVSwitch Fabric</b><small>让 8 张卡高速交换数据</small>') +
        '<div class="server-io-row">' +
          hot(station, "cpu", "server-io", '<b>CPU × 2</b><span class="cpu-pair"><i></i><i></i></span>') +
          hot(station, "memstore", "server-io server-memory", '<b>内存 + NVMe</b><span class="memory-slots">' + mem + '</span>') +
          hot(station, "nic", "server-io server-nic", '<b>双网络</b><span><i></i><i></i><i></i><i></i></span>') +
          hot(station, "psu", "server-io server-psu", '<b>冗余电源</b><span><i></i><i></i></span>') +
        '</div>' +
      '</div>' +
    '</div>';
    const footer = '<span>装机检查</span>' + chips([
      { label: "卡间互联", tone: "cyan" },
      { label: "主机供数", tone: "blue" },
      { label: "双网分工", tone: "green" },
      { label: "供电散热", tone: "amber" }
    ]);
    return finish(mount, station, frame(station, "cs-server", "S2 · 8-GPU NODE", "组装一台 8 卡服务器", "从气流入口到冗余电源，逐层检查一台训练服务器的协作关系。", body, footer), {
      defaultMode: "physical",
      modeNodes: {
        physical: "*",
        scaleup: ["gpu8", "nvlink", "superpod"],
        data: ["cpu", "memstore"],
        scaleout: ["nic"]
      },
      scenarioModes: { affinity: "data", rdma: "scaleout", psu: "physical", cooling: "physical" },
      scenarioNodes: {
        affinity: ["cpu", "memstore", "nic"],
        rdma: ["gpu8", "nic"],
        psu: ["psu"],
        cooling: ["cooling", "gpu8"]
      }
    });
  }

  function dc(station, mount) {
    const racks = Array.from({ length: 8 }, function (_, i) {
      const units = Array.from({ length: 5 }, function (_, j) {
        return '<i class="' + ((i + j) % 5 === 0 ? "warn" : "") + '"></i>';
      }).join("");
      return '<span class="dc-rack">' + units + '<b>R' + String(i + 1).padStart(2, "0") + '</b></span>';
    }).join("");
    const body = '<div class="dc-layout">' +
      hot(station, "cabling", "dc-cable", '<span class="dc-cable-lines"><i></i><i></i><i></i></span><b>天花桥架 · 光纤与电缆</b>') +
      '<div class="dc-map">' +
        hot(station, "cooling", "dc-cooling", '<span class="cooling-loop l1"></span><span class="cooling-loop l2"></span><b>制冷环路</b><small>冷量送入冷通道</small>') +
        hot(station, "rack", "dc-racks", '<span class="dc-rack-grid">' + racks + '</span><span class="dc-aisle"><b>冷通道</b><small>气流方向 →</small></span>') +
        hot(station, "power", "dc-power", '<span class="power-chain"><i>上游</i><i>切换 / 储能</i><i>配电</i></span><b>供电链</b><small>容量与冗余路径按设施目标校核</small>') +
        hot(station, "fire", "dc-fire", '<span class="fire-bottles"><i></i><i></i><i></i></span><b>消防与安防</b>') +
      '</div>' +
      '<div class="dc-ops">' +
        hot(station, "liquiddefault", "dc-op-card", '<span><b>液冷准备度</b><small>高密机架的入场条件</small></span><em>进阶</em>', "adv/liquiddefault") +
        hot(station, "sustain", "dc-op-card", '<span><b>能源效率</b><small>PUE、绿电与碳排一起看</small></span><em>进阶</em>', "adv/sustain") +
      '</div>' +
    '</div>';
    const footer = '<span>值班视角</span>' + chips([
      { label: "供电稳定", tone: "green" },
      { label: "冷量可用", tone: "cyan" },
      { label: "通道清晰", tone: "blue" },
      { label: "消防就绪", tone: "red" }
    ]);
    return finish(mount, station, frame(station, "cs-dc", "S3 · DATA CENTER ROOM", "走进一间 AI 机房", "机柜只是主角之一；供电、制冷、承重布线和消防共同决定它能否持续运行。", body, footer), {
      defaultMode: "capacity",
      modeNodes: {
        capacity: ["rack", "cabling"],
        power: ["power"],
        thermal: ["cooling", "liquiddefault", "sustain"],
        safety: ["fire", "cabling"]
      },
      scenarioModes: { rack: "capacity", "a-b": "power", heat: "thermal", access: "safety" },
      scenarioNodes: {
        rack: ["rack"],
        "a-b": ["power"],
        heat: ["cooling"],
        access: ["cabling", "fire"]
      }
    });
  }

  function network(station, mount) {
    const spines = Array.from({ length: 2 }, function (_, i) { return '<span><b>SPINE ' + (i + 1) + '</b><i></i><i></i><i></i><i></i></span>'; }).join("");
    const leaves = Array.from({ length: 4 }, function (_, i) { return '<span><b>LEAF ' + (i + 1) + '</b><i></i><i></i><i></i></span>'; }).join("");
    const hosts = Array.from({ length: 8 }, function (_, i) { return '<span><i></i><b>GPU ' + (i + 1) + '</b></span>'; }).join("");
    const body = '<div class="network-layout">' +
      '<div class="network-toolbar" aria-label="网络平面显示开关">' +
        '<button type="button" class="net-toggle is-on" data-net-toggle="compute" aria-pressed="true"><i class="cyan"></i>计算网</button>' +
        '<button type="button" class="net-toggle is-on" data-net-toggle="storage" aria-pressed="true"><i class="pink"></i>存储网</button>' +
        '<button type="button" class="net-toggle is-on" data-net-toggle="mgmt" aria-pressed="true"><i class="muted"></i>管理网</button>' +
      '</div>' +
      '<div class="network-topology">' +
        hot(station, "spineleaf", "topology-nodes", '<span class="spine-row">' + spines + '</span><span class="fabric-mesh" aria-hidden="true"></span><span class="leaf-row">' + leaves + '</span><span class="host-row">' + hosts + '</span>') +
        '<div class="network-plane compute" data-net-plane="compute" aria-hidden="true"><i></i><i></i><i></i><i></i></div>' +
        '<div class="network-plane storage" data-net-plane="storage" aria-hidden="true"><i></i><i></i><i></i></div>' +
        '<div class="network-plane mgmt" data-net-plane="mgmt" aria-hidden="true"><i></i><i></i></div>' +
      '</div>' +
      '<div class="network-cards">' +
        hot(station, "computenet", "network-card compute-card", '<b>计算网</b><small>训练同步与集合通信</small><em>高带宽 · 低时延</em>') +
        hot(station, "storagenet", "network-card storage-card", '<b>存储网</b><small>样本、权重与存档搬运</small><em>稳定吞吐</em>') +
        hot(station, "mgmtnet", "network-card mgmt-card", '<b>管理网</b><small>登录、监控与带外维护</small><em>隔离控制</em>') +
      '</div>' +
      '<div class="network-advanced">' +
        hot(station, "collective", "network-adv", '<b>集合通信</b><small>AllReduce 如何对齐千卡结果</small>', "adv/collective") +
        hot(station, "optical", "network-adv", '<b>光模块与轨道优化</b><small>400G / 800G 路径如何铺开</small>', "adv/optical") +
      '</div>' +
    '</div>';
    const footer = '<span>判读口诀</span>' + chips([
      { label: "算力看同步", tone: "cyan" },
      { label: "数据看吞吐", tone: "pink" },
      { label: "运维看隔离", tone: "muted" }
    ]);
    const controller = finish(mount, station, frame(station, "cs-network", "S4 · CLUSTER FABRIC", "把服务器连成集群", "切换三张网，观察训练流量、数据流量和管理流量为什么要分工。", body, footer), {
      defaultMode: "topology",
      modeNodes: {
        topology: "*",
        compute: ["computenet", "collective", "optical"],
        storage: ["storagenet"],
        management: ["mgmtnet"]
      },
      scenarioModes: { fabrics: "topology", slow: "compute", interference: "storage", recovery: "management" },
      scenarioNodes: {
        fabrics: ["computenet", "storagenet", "mgmtnet"],
        slow: ["computenet"],
        interference: ["storagenet", "computenet"],
        recovery: ["mgmtnet"]
      }
    });
    mount.querySelectorAll("[data-net-toggle]").forEach(function (button) {
      button.addEventListener("click", function () {
        const key = button.dataset.netToggle;
        const plane = mount.querySelector('[data-net-plane="' + key + '"]');
        const on = button.getAttribute("aria-pressed") !== "false";
        button.setAttribute("aria-pressed", on ? "false" : "true");
        button.classList.toggle("is-on", !on);
        if (plane) plane.classList.toggle("is-muted", on);
      });
    });
    return controller;
  }

  function data(station, mount) {
    const body = '<div class="data-layout">' +
      '<div class="data-mainline" aria-hidden="true"><i></i><i></i><i></i><i></i></div>' +
      hot(station, "pipeline", "data-step data-source", '<span class="data-icon source-icon"><i></i><i></i><i></i></span><b>数据流水线</b><small>采集 · 清洗 · 切分</small><em>01</em>') +
      hot(station, "governance", "data-step data-govern", '<span class="data-icon shield-icon">✓</span><b>治理闸门</b><small>合规、血缘与权限</small><em>02</em>', "adv/governance") +
      hot(station, "datastore", "data-step data-store", '<span class="data-icon cylinder-icon"><i></i><i></i></span><b>数据集存储</b><small>原始、清洗、版本化</small><em>03</em>') +
      hot(station, "pfs", "data-step data-pfs", '<span class="data-icon pfs-icon"><i></i><i></i><i></i><i></i></span><b>并行文件系统</b><small>让多张卡同时读数据</small><em>04</em>') +
      '<div class="data-consumers">' +
        '<span class="consumer-card"><i class="gpu-consumer"></i><b>GPU 训练集群</b><small>持续取数</small></span>' +
        hot(station, "checkpoint", "data-side-card checkpoint-card", '<span><b>Checkpoint</b><small>训练状态定期回写</small></span><em>回流</em>') +
        hot(station, "vectordb", "data-side-card vector-card", '<span><b>向量数据库</b><small>为检索与 RAG 提供索引</small></span><em>分支</em>') +
      '</div>' +
    '</div>';
    const footer = '<span>数据旅程</span>' + chips([
      { label: "可用", tone: "green" },
      { label: "可管", tone: "blue" },
      { label: "可并发读取", tone: "pink" },
      { label: "可恢复", tone: "amber" }
    ]);
    return finish(mount, station, frame(station, "cs-data", "S5 · DATA SUPPLY CHAIN", "让数据持续喂饱算力", "沿着主线追踪数据从进入系统，到被并行读取，再到训练状态回写的全过程。", body, footer), {
      defaultMode: "lifecycle",
      modeNodes: {
        lifecycle: ["pipeline", "governance", "datastore"],
        feed: ["pfs"],
        checkpoint: ["checkpoint"],
        rag: ["vectordb", "governance"]
      },
      scenarioModes: { batch: "lifecycle", waiting: "feed", tier: "lifecycle", restore: "checkpoint" },
      scenarioNodes: {
        batch: ["pipeline", "datastore", "pfs"],
        waiting: ["pfs"],
        tier: ["datastore"],
        restore: ["checkpoint"]
      }
    });
  }

  function platform(station, mount) {
    const stack = [
      { id: "platform", num: "04", meta: "门户 · 工作流 · 配额", state: "服务入口" },
      { id: "scheduler", num: "03", meta: "排队 · 拓扑 · 故障重调度", state: "资源编排" },
      { id: "container", num: "02", meta: "镜像 · 环境 · 依赖隔离", state: "运行环境" },
      { id: "driver", num: "01", meta: "驱动 · 固件 · 算子库", state: "硬件能力" }
    ].map(function (layer) {
      const node = findNode(station, layer.id);
      return hot(station, layer.id, "platform-layer layer-" + layer.id,
        '<span class="platform-index">' + layer.num + '</span><span><b>' + esc(node.name) + '</b><small>' + esc(layer.meta) + '</small></span><em>' + esc(layer.state) + '</em>');
    }).join("");
    const body = '<div class="platform-layout">' +
      '<div class="platform-stack">' + stack + '<span class="bare-metal"><i></i><b>GPU / CPU / 网络 / 存储</b><small>裸机资源池</small></span></div>' +
      '<aside class="platform-control">' +
        hot(station, "registry", "platform-control-card", '<span class="control-icon registry-icon" aria-hidden="true"></span><span><b>镜像与制品</b><small>版本可追溯、可回滚</small></span>', "adv/registry") +
        hot(station, "mlops", "platform-control-card", '<span class="control-icon mlops-icon" aria-hidden="true"></span><span><b>模型 CI/CD</b><small>训练到上线自动流转</small></span>', "adv/mlops") +
        hot(station, "observability", "platform-control-card", '<span class="control-icon observability-icon" aria-hidden="true"><i></i><i></i><i></i></span><span><b>可观测性</b><small>指标、日志与链路追踪</small></span>', "adv/observability") +
      '</aside>' +
    '</div>';
    const footer = '<span>自下而上</span>' + chips([
      { label: "驱动看见卡", tone: "blue" },
      { label: "容器装环境", tone: "cyan" },
      { label: "调度分资源", tone: "amber" },
      { label: "平台交能力", tone: "green" }
    ]);
    return finish(mount, station, frame(station, "cs-platform", "S6 · AI PLATFORM STACK", "从裸机搭出一朵云", "自下而上点亮四层，再从控制面观察版本、发布与可观测能力。", body, footer), {
      defaultMode: "stack",
      modeNodes: {
        stack: "*",
        job: ["scheduler", "platform"],
        sharing: ["platform"],
        runtime: ["driver", "container"]
      },
      scenarioModes: { submit: "job", compat: "stack", tenant: "sharing", container: "runtime" },
      scenarioNodes: {
        submit: ["scheduler", "platform"],
        compat: ["driver", "container"],
        tenant: ["platform"],
        container: ["container", "driver"]
      }
    });
  }

  function model(station, mount) {
    const phaseMeta = {
      training: { index: "01", verb: "学", note: "海量数据反复纠错", mode: "training" },
      finetune: { index: "02", verb: "专", note: "用行业数据做岗前培训", mode: "finetune" },
      inference: { index: "03", verb: "用", note: "稳定、快速、经济地服务", mode: "serving" },
      eval: { index: "04", verb: "验", note: "评测、压测、灰度上线", mode: "release" }
    };
    const modeToNode = { training: "training", finetune: "finetune", release: "eval", serving: "inference" };
    const phaseButtons = station.nodes.map(function (node) {
      const meta = phaseMeta[node.id];
      return hot(station, node.id, "model-phase",
        '<span class="model-phase-index">' + meta.index + '</span><span class="model-phase-verb">' + meta.verb + '</span><span><b>' + esc(node.name) + '</b><small>' + esc(meta.note) + '</small></span>');
    }).join("");
    const panels = station.nodes.map(function (node) {
      const modeId = phaseMeta[node.id].mode;
      const children = (node.children || []).map(function (child, index) {
        return hot(station, child.id, "model-child", '<span>' + String(index + 1).padStart(2, "0") + '</span><b>' + esc(child.name) + '</b><small>' + esc(child.brief) + '</small>', node.id + "/" + child.id);
      }).join("") || '<div class="model-empty"><b>这一阶段先看主线</b><small>打开知识检查器阅读核心概念与案例。</small></div>';
      return '<section class="model-panel" data-model-panel="' + modeId + '">' +
        '<div class="model-children-head"><span>' + esc(node.name) + '内部</span><small>继续下钻</small></div>' +
        '<div class="model-child-grid">' + children + '</div></section>';
    }).join("");
    const initialNode = station.nodes[0];
    const body = '<div class="model-layout">' +
      '<div class="model-lifecycle">' + phaseButtons + '<span class="model-rail" aria-hidden="true"></span></div>' +
      '<div class="model-focus">' +
        '<div class="model-orbit" aria-hidden="true"><i></i><i></i><i></i></div>' +
        '<div class="model-core"><span>MODEL</span><b data-model-current>' + esc(initialNode.name) + '</b><small data-model-brief>' + esc(initialNode.brief) + '</small></div>' +
        '<div class="model-children">' + panels + '</div>' +
      '</div>' +
    '</div>';
    const footer = '<span>模型生命周期</span>' + chips([
      { label: "训练", tone: "blue" },
      { label: "微调", tone: "cyan" },
      { label: "推理", tone: "green" },
      { label: "评测上线", tone: "amber" }
    ]);
    return finish(mount, station, frame(station, "cs-model", "S7 · MODEL LIFECYCLE", "把模型从训练送到生产", "选择一个阶段，中央核心会原地展开对应阶段，不重建整幅舞台。", body, footer), {
      defaultMode: "training",
      modeNodes: {
        training: ["training"],
        finetune: ["finetune"],
        release: ["eval"],
        serving: ["inference"]
      },
      scenarioModes: { parallel: "training", adapt: "finetune", gate: "release", request: "serving" },
      scenarioNodes: {
        parallel: ["training"],
        adapt: ["finetune"],
        gate: ["eval"],
        request: ["inference"]
      },
      onState: function (state, root) {
        const nodeId = modeToNode[state.modeId] || "training";
        const selected = findNode(station, nodeId) || initialNode;
        const current = root.querySelector("[data-model-current]");
        const brief = root.querySelector("[data-model-brief]");
        if (current) current.textContent = selected.name;
        if (brief) brief.textContent = selected.brief;
        root.querySelectorAll(".model-phase[data-node]").forEach(function (item) {
          item.classList.toggle("is-active", item.dataset.node === nodeId);
        });
        root.querySelectorAll("[data-model-panel]").forEach(function (panel) {
          panel.hidden = panel.dataset.modelPanel !== state.modeId;
        });
      }
    });
  }

  const RENDERERS = {
    "gpu-closeup": gpu,
    "server-explode": server,
    "dc-room": dc,
    "network-topo": network,
    "data-pipeline": data,
    "software-stack": platform,
    "model-radial": model
  };

  function canRender(visual) { return !!VISUALS[visual]; }
  function render(station, mount) {
    const fn = RENDERERS[station.visual];
    return fn ? fn(station, mount) : null;
  }

  return { canRender: canRender, render: render };
})();
