/* ========================================================================
   算力之旅 · S8-S10 中央工作台 V5
   原生 HTML/CSS；场景状态与知识路由分离；不包含生产遥测或报价。
   ======================================================================== */
window.StageArtLateV5 = (function () {
  "use strict";

  const RENDERERS = {};
  const PLAN_IDS = ["ondemand", "reserved", "private", "idc", "hybrid"];

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function asPath(path) {
    if (Array.isArray(path)) return path.filter(Boolean).map(String);
    return String(path || "").split("/").filter(Boolean);
  }

  function pathKey(path) {
    return asPath(path).join("/");
  }

  function pathMatches(a, b) {
    if (!a || !b) return false;
    return a === b || a.indexOf(b + "/") === 0 || b.indexOf(a + "/") === 0;
  }

  function snapshot(state) {
    return {
      mode: state.mode,
      scenario: state.scenario,
      phase: state.phase,
      step: state.step,
      focusPath: (state.focusPath || []).slice(),
      flags: Object.assign({}, state.flags || {}, {
        answers: state.flags && state.flags.answers
          ? Object.assign({}, state.flags.answers)
          : undefined
      })
    };
  }

  function nodeButton(id, cls, title, copy, path) {
    const attr = path
      ? ' data-path="' + esc(path) + '"'
      : ' data-node="' + esc(id) + '"';
    return '<button type="button" class="lv5-node ' + esc(cls || "") + '"' + attr +
      '><strong>' + esc(title) + '</strong>' +
      (copy ? '<small>' + esc(copy) + '</small>' : "") + '</button>';
  }

  function emitState(mount, state, detail) {
    const payload = Object.assign({
      mode: state.mode,
      scenario: state.scenario,
      phase: state.phase,
      step: state.step,
      focusPath: (state.focusPath || []).slice()
    }, detail || {});
    if (typeof window.CustomEvent === "function") {
      mount.dispatchEvent(new CustomEvent("stage:statechange", {
        bubbles: true,
        detail: payload
      }));
    }
  }

  function createController(options) {
    const station = options.station;
    const mount = options.mount;
    const root = options.root;
    const transition = options.transition;
    const renderState = options.renderState;
    let state = snapshot(options.initialState);
    let disposed = false;

    function update(action) {
      if (disposed) return;
      const next = transition(snapshot(state), action || { type: "render" });
      if (next) state = snapshot(next);
      root.dataset.mode = state.mode || "overview";
      root.dataset.scenario = state.scenario || "none";
      root.dataset.phase = state.phase || "idle";
      root.dataset.step = String(state.step || 0);
      const detail = renderState(root, state) || {};
      syncFocus();
      emitState(mount, state, detail);
    }

    function syncFocus() {
      const focus = pathKey(state.focusPath);
      root.querySelectorAll("[data-node], [data-path]").forEach(function (item) {
        const itemPath = item.dataset.path || item.dataset.node || "";
        const active = pathMatches(focus, itemPath);
        item.classList.toggle("is-focus", active);
        if (active) item.setAttribute("aria-current", "true");
        else item.removeAttribute("aria-current");
      });
    }

    function onClick(event) {
      const modeButton = event.target.closest("[data-stage-mode]");
      if (modeButton && root.contains(modeButton)) {
        update({ type: "mode", id: modeButton.dataset.stageMode });
        return;
      }

      const scenarioButton = event.target.closest("[data-stage-scenario]");
      if (scenarioButton && root.contains(scenarioButton)) {
        update({ type: "scenario", id: scenarioButton.dataset.stageScenario });
        return;
      }

      const actionButton = event.target.closest("[data-stage-action]");
      if (actionButton && root.contains(actionButton)) {
        update({
          type: "action",
          id: actionButton.dataset.stageAction,
          group: actionButton.dataset.answerGroup,
          value: actionButton.dataset.answerValue
        });
        return;
      }

      const clearButton = event.target.closest("[data-stage-clear]");
      if (clearButton && root.contains(clearButton)) {
        update({ type: "clear" });
        return;
      }

      const node = event.target.closest("[data-node], [data-path]");
      if (node && root.contains(node)) {
        const path = asPath(node.dataset.path || node.dataset.node);
        state.focusPath = path;
        update({ type: "focus", path: path, source: "stage" });
        if (window.App && typeof App.openNode === "function") App.openNode(station.id, path);
      }
    }

    function onFocusChange(event, on) {
      const node = event.target.closest && event.target.closest("[data-node], [data-path]");
      if (!node || !root.contains(node) || !window.App || !App.setHighlight) return;
      const path = asPath(node.dataset.path || node.dataset.node);
      const rootId = path[0] === "adv" ? path[1] : path[0];
      if (rootId) App.setHighlight(rootId, on);
    }

    root.addEventListener("click", onClick);
    root.addEventListener("focusin", function (event) { onFocusChange(event, true); });
    root.addEventListener("focusout", function (event) { onFocusChange(event, false); });
    update({ type: "render" });

    return {
      setMode: function (modeId, payload) {
        update({ type: "mode", id: modeId, payload: payload || null });
      },
      applyScenario: function (scenarioId, payload) {
        update({ type: "scenario", id: scenarioId, payload: payload || null });
      },
      focusPath: function (path, meta) {
        update({ type: "focus", path: asPath(path), source: meta && meta.source });
      },
      syncDrawer: function (path) {
        update({ type: "focus", path: asPath(path), source: "drawer" });
      },
      clearScenario: function () {
        update({ type: "clear" });
      },
      getState: function () {
        return snapshot(state);
      },
      cleanup: function () {
        if (disposed) return;
        disposed = true;
        root.removeEventListener("click", onClick);
      }
    };
  }

  function mountFrame(station, mount, cls, eyebrow, title, body, footer) {
    mount.innerHTML = '<section class="late-v5 ' + cls + '" aria-label="' + esc(station.name) + '中央工作台">' +
      '<header class="lv5-head"><div><span class="lv5-kicker">' + esc(eyebrow) +
      '</span><h3>' + esc(title) + '</h3></div><span class="lv5-sandbox"><i></i>教学沙盘</span></header>' +
      '<div class="lv5-body">' + body + '</div>' +
      '<footer class="lv5-footer">' + footer + '</footer>' +
    '</section>';
    const wrap = mount.parentElement;
    if (wrap) {
      wrap.classList.remove("stage-3d");
      wrap.classList.add("stage-static", "stage-late-v5-mounted");
    }
    return mount.firstElementChild;
  }

  /* ============================ S8 · 交付模式 ============================ */
  const DELIVERY_PLANS = {
    ondemand: {
      label: "公有云 · 按量",
      short: "弹性优先",
      reasons: {
        cloud: "数据边界允许上云",
        burst: "波动用量需要随需调整",
        limited: "减少自建运维负担"
      }
    },
    reserved: {
      label: "公有云 · 包期",
      short: "稳定承诺",
      reasons: {
        cloud: "数据边界允许上云",
        stable: "长期稳定用量适合核验承诺方案",
        limited: "主要运维由云侧承担"
      }
    },
    private: {
      label: "专有云",
      short: "边界优先",
      reasons: {
        local: "数据需要留在客户侧或专属边界",
        stable: "适合规划长期能力",
        limited: "可核验双方共担运维"
      }
    },
    idc: {
      label: "自建 IDC",
      short: "自主优先",
      reasons: {
        local: "数据和基础设施保持自主",
        stable: "长期稳定用量才值得进一步核算",
        strong: "需要成熟的自有工程团队"
      }
    },
    hybrid: {
      label: "混合模式",
      short: "组合弹性",
      reasons: {
        local: "核心数据或稳定负载保留在自有侧",
        burst: "高峰使用弹性资源补位",
        strong: "需要统一治理多个环境"
      }
    }
  };

  function deliveryScores(answers, preferred) {
    const scores = {};
    PLAN_IDS.forEach(function (id) { scores[id] = 0; });
    if (answers.data === "local") {
      scores.private += 4; scores.idc += 4; scores.hybrid += 3;
      scores.ondemand -= 3; scores.reserved -= 3;
    } else if (answers.data === "cloud") {
      scores.ondemand += 2; scores.reserved += 2; scores.hybrid += 1;
    }
    if (answers.load === "burst") {
      scores.ondemand += 4; scores.hybrid += 3; scores.reserved -= 1;
    } else if (answers.load === "stable") {
      scores.reserved += 3; scores.private += 2; scores.idc += 2;
    }
    if (answers.ops === "strong") {
      scores.idc += 4; scores.hybrid += 2; scores.private += 1;
    } else if (answers.ops === "limited") {
      scores.ondemand += 3; scores.reserved += 3; scores.private += 1; scores.idc -= 3;
    }
    if (preferred && scores[preferred] != null) scores[preferred] += 1;
    return PLAN_IDS.slice().sort(function (a, b) {
      return scores[b] - scores[a] || PLAN_IDS.indexOf(a) - PLAN_IDS.indexOf(b);
    });
  }

  function deliveryReason(planId, answers) {
    const plan = DELIVERY_PLANS[planId];
    const parts = [];
    [answers.data, answers.load, answers.ops].forEach(function (key) {
      if (key && key !== "unknown" && plan.reasons[key]) parts.push(plan.reasons[key]);
    });
    return parts.length ? parts.slice(0, 2).join("；") : "约束尚未完整，请继续回答后再核验。";
  }

  function deliveryTransition(state, action) {
    const presets = {
      residency: { data: "local", load: "unanswered", ops: "unanswered", focus: "private" },
      trial: { data: "cloud", load: "burst", ops: "limited", focus: "ondemand" },
      stable: { data: "cloud", load: "stable", ops: "limited", focus: "reserved" },
      peak: { data: "local", load: "burst", ops: "strong", focus: "hybrid" }
    };
    if (!state.flags.answers) state.flags.answers = { data: "unanswered", load: "unanswered", ops: "unanswered" };

    if (action.type === "mode") {
      if (PLAN_IDS.indexOf(action.id) >= 0) {
        state.mode = "ranking";
        state.flags.preferred = action.id;
        state.focusPath = [action.id];
      } else if (action.id) state.mode = action.id;
      state.scenario = null;
      state.phase = state.mode === "ranking" ? "running" : "idle";
    }

    if (action.type === "scenario" && presets[action.id]) {
      const preset = presets[action.id];
      state.flags.answers = { data: preset.data, load: preset.load, ops: preset.ops };
      state.flags.preferred = preset.focus;
      state.mode = "ranking";
      state.scenario = action.id;
      const answered = [preset.data, preset.load, preset.ops].filter(function (value) {
        return value !== "unanswered";
      }).length;
      state.phase = answered === 3 ? "complete" : "running";
      state.step = answered;
      state.focusPath = [preset.focus];
    }

    if (action.type === "action" && action.id === "answer" && action.group) {
      state.flags.answers[action.group] = action.value || "unknown";
      const answered = Object.keys(state.flags.answers).filter(function (key) {
        return state.flags.answers[key] !== "unanswered";
      }).length;
      state.step = answered;
      state.scenario = "manual";
      state.phase = answered === 3 ? "complete" : "running";
      state.mode = answered === 3 ? "ranking" : "constraints";
      if (answered === 3) state.focusPath = [deliveryScores(state.flags.answers)[0]];
    }

    if (action.type === "focus") state.focusPath = asPath(action.path);

    if (action.type === "clear") {
      state.mode = "constraints";
      state.scenario = null;
      state.phase = "idle";
      state.step = 0;
      state.focusPath = [];
      state.flags = { answers: { data: "unanswered", load: "unanswered", ops: "unanswered" } };
    }
    return state;
  }

  function renderDeliveryState(root, state) {
    const answers = state.flags.answers || { data: "unanswered", load: "unanswered", ops: "unanswered" };
    root.querySelectorAll("[data-answer-group]").forEach(function (button) {
      const active = answers[button.dataset.answerGroup] === button.dataset.answerValue;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });
    const count = Object.keys(answers).filter(function (key) { return answers[key] !== "unanswered"; }).length;
    const progress = root.querySelector("[data-delivery-progress]");
    if (progress) progress.textContent = "已确认 " + count + " / 3 项约束";

    const ranking = deliveryScores(answers, state.flags.preferred);
    root.querySelectorAll("[data-rank-slot]").forEach(function (slot, index) {
      const id = ranking[index];
      const plan = DELIVERY_PLANS[id];
      slot.dataset.node = id;
      slot.querySelector("b").textContent = String(index + 1).padStart(2, "0");
      slot.querySelector("strong").textContent = plan.label;
      slot.querySelector("em").textContent = plan.short;
      slot.querySelector("small").textContent = deliveryReason(id, answers);
    });
    const resultCopy = root.querySelector("[data-delivery-result-copy]");
    if (resultCopy) resultCopy.textContent = count === 3
      ? "排序只表示优先核验顺序；仍需结合安全、合规、成本与迁移退路确认。"
      : "回答三个约束后生成优先核验顺序。";
    return {
      context: count === 3 ? "已根据三项约束更新方案排序。" : "继续确认数据、用量和运维约束。",
      status: state.phase === "complete" ? "约束问答完成" : "约束确认中",
      metrics: [
        { label: "已确认约束", value: count + " / 3" },
        { label: "首要核验", value: count ? DELIVERY_PLANS[ranking[0]].label : "待回答" }
      ]
    };
  }

  function deliveryRenderer(station, mount) {
    const question = function (group, title, options) {
      return '<fieldset class="delivery-question"><legend>' + esc(title) + '</legend><div>' +
        options.map(function (option) {
          return '<button type="button" data-stage-action="answer" data-answer-group="' + esc(group) +
            '" data-answer-value="' + esc(option[0]) + '" aria-pressed="false">' + esc(option[1]) + '</button>';
        }).join("") + '</div></fieldset>';
    };
    const body = '<div class="delivery-workbench">' +
      '<section class="delivery-constraints"><div class="lv5-section-head"><span>01 · 确认硬约束</span><small data-delivery-progress>已确认 0 / 3 项约束</small></div>' +
        question("data", "数据边界", [["cloud", "允许上云"], ["local", "必须留在客户侧"], ["unknown", "尚未确认"]]) +
        question("load", "用量形态", [["burst", "波动 / 试验"], ["stable", "稳定 / 长期"], ["unknown", "尚未确认"]]) +
        question("ops", "运维能力", [["limited", "团队有限"], ["strong", "团队成熟"], ["unknown", "尚未确认"]]) +
        '<button type="button" class="lv5-reset" data-stage-clear>重新回答</button>' +
      '</section>' +
      '<section class="delivery-ranking"><div class="lv5-section-head"><span>02 · 方案优先核验</span><small>不是自动报价或最终推荐</small></div>' +
        '<p data-delivery-result-copy>回答三个约束后生成优先核验顺序。</p>' +
        '<div class="delivery-ranked-list">' + [0, 1, 2].map(function (index) {
          return '<button type="button" class="lv5-node delivery-rank" data-rank-slot="' + index + '" data-node="ondemand">' +
            '<b>0' + (index + 1) + '</b><span><strong>待生成</strong><small>继续回答约束</small></span><em>待核验</em></button>';
        }).join("") + '</div>' +
        '<details class="delivery-details"><summary>按需展开完整对比表 <span>›</span></summary>' +
          '<div class="delivery-table-wrap"><table><thead><tr><th>方式</th><th>数据边界</th><th>弹性</th><th>运维责任</th><th>投入方式</th></tr></thead><tbody>' +
            '<tr><th>公有云 · 按量</th><td>云侧</td><td>按需调整</td><td>云厂商为主</td><td>随使用发生</td></tr>' +
            '<tr><th>公有云 · 包期</th><td>云侧</td><td>承诺期内规划</td><td>云厂商为主</td><td>固定承诺</td></tr>' +
            '<tr><th>专有云</th><td>客户侧 / 专属边界</td><td>规划扩容</td><td>双方共担</td><td>项目化核验</td></tr>' +
            '<tr><th>自建 IDC</th><td>客户侧</td><td>工程扩容</td><td>客户自担</td><td>建设与运营投入</td></tr>' +
            '<tr><th>混合模式</th><td>按工作负载分区</td><td>组合弹性</td><td>共同治理</td><td>分环境核算</td></tr>' +
          '</tbody></table></div>' +
          '<button type="button" class="lv5-node delivery-migration" data-path="adv/migration"><strong>迁移与退出风险</strong><small>数据、环境、算子与接口能否带走</small></button>' +
        '</details>' +
      '</section>' +
    '</div>';
    const footer = '<span><b>决策顺序</b> 先确认硬约束，再比较可行方案，最后核验成本与退出风险。</span>';
    const root = mountFrame(station, mount, "lv5-delivery", "S8 · DELIVERY DECISION", "约束问答 → 方案排序", body, footer);
    return createController({
      station: station,
      mount: mount,
      root: root,
      initialState: {
        mode: "constraints", scenario: null, phase: "idle", step: 0, focusPath: [],
        flags: { answers: { data: "unanswered", load: "unanswered", ops: "unanswered" } }
      },
      transition: deliveryTransition,
      renderState: renderDeliveryState
    });
  }

  /* ============================ S9 · 算力变现 ============================ */
  function tokenTransition(state, action) {
    const modeMap = {
      gateway: { service: "metering", focus: "gateway" },
      catalog: { service: "catalog", focus: "catalog" },
      sla: { service: "latency", focus: "sla" },
      multi: { service: "multitenant", focus: "multitenant" },
      pricing: { service: "cost", focus: "pricing" }
    };
    const scenarioMap = {
      meter: { service: "metering", focus: "billing" },
      service: { service: "latency", focus: "sla" },
      sharing: { service: "multitenant", focus: "multitenant" },
      cost: { service: "cost", focus: "pricing" },
      "low-latency": { service: "latency", focus: "sla" },
      "high-throughput": { service: "throughput", focus: "multitenant" },
      "multi-tenant": { service: "multitenant", focus: "multitenant" }
    };
    if (!state.flags.service) state.flags.service = "balanced";
    if (action.type === "mode" && modeMap[action.id]) {
      state.mode = action.id;
      state.scenario = null;
      state.phase = "idle";
      state.flags.service = modeMap[action.id].service;
      state.focusPath = [modeMap[action.id].focus];
    }
    if (action.type === "scenario" && scenarioMap[action.id]) {
      state.mode = "service";
      state.scenario = action.id;
      state.phase = "running";
      state.flags.service = scenarioMap[action.id].service;
      state.focusPath = [scenarioMap[action.id].focus];
    }
    if (action.type === "action" && action.id && action.id.indexOf("service:") === 0) {
      const service = action.id.split(":")[1];
      state.mode = "service";
      state.scenario = service;
      state.phase = "running";
      state.flags.service = service;
      state.focusPath = [service === "latency" ? "sla" : "multitenant"];
    }
    if (action.type === "focus") state.focusPath = asPath(action.path);
    if (action.type === "clear") {
      state.mode = "gateway";
      state.scenario = null;
      state.phase = "idle";
      state.step = 0;
      state.focusPath = ["gateway"];
      state.flags = { service: "balanced" };
    }
    return state;
  }

  function renderTokenState(root, state) {
    const service = state.flags.service || "balanced";
    root.dataset.serviceState = service;
    const copy = {
      balanced: ["均衡观察", "先看请求、服务、计量和定价如何闭环。"],
      metering: ["计量链", "请求从网关进入，使用记录进入计费与账链。"],
      catalog: ["模型货架", "模型能力、版本与计费口径要可解释。"],
      latency: ["低延迟优先", "减少排队并守住首字体验；吞吐取舍仍需实测。"],
      throughput: ["高吞吐优先", "提高批处理与资源利用；尾延迟必须同时观察。"],
      multitenant: ["多租户隔离", "配额、限流和优先级防止租户互相影响。"],
      cost: ["成本与定价", "先核对完全成本、可计费用量和时间窗，再讨论价格。"]
    }[service];
    const title = root.querySelector("[data-token-state-title]");
    const note = root.querySelector("[data-token-state-copy]");
    if (title) title.textContent = copy[0];
    if (note) note.textContent = copy[1];
    root.querySelectorAll("[data-service-choice]").forEach(function (button) {
      const active = button.dataset.serviceChoice === service;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });
    root.querySelectorAll("[data-token-role]").forEach(function (node) {
      const roles = String(node.dataset.tokenRole || "").split(" ");
      node.classList.toggle("is-state-active", roles.indexOf(service) >= 0 || service === "balanced");
    });
    return {
      context: copy[1],
      status: copy[0],
      metrics: [
        { label: "服务策略", value: copy[0] },
        { label: "性能结果", value: "待用真实负载验证" }
      ]
    };
  }

  function tokenRenderer(station, mount) {
    const packets = Array.from({ length: 6 }, function (_, index) {
      return '<i style="--packet-index:' + index + '"></i>';
    }).join("");
    const body = '<div class="token-workbench">' +
      '<div class="token-statebar"><div><span>当前服务策略</span><strong data-token-state-title>均衡观察</strong><small data-token-state-copy>先看请求、服务、计量和定价如何闭环。</small></div>' +
        '<div class="token-priorities" role="group" aria-label="服务策略">' +
          '<button type="button" data-stage-action="service:latency" data-service-choice="latency" aria-pressed="false">低延迟优先</button>' +
          '<button type="button" data-stage-action="service:throughput" data-service-choice="throughput" aria-pressed="false">高吞吐优先</button>' +
          '<button type="button" data-stage-action="service:multitenant" data-service-choice="multitenant" aria-pressed="false">多租户隔离</button>' +
        '</div></div>' +
      '<div class="token-service-chain">' +
        '<div class="token-flowline" aria-hidden="true">' + packets + '</div>' +
        '<div class="token-request-source"><span aria-hidden="true"><i></i><i></i><i></i></span><b>用户请求</b><small>输入与输出均需明确计量边界</small></div>' +
        nodeButton("gateway", "token-chain-node", "API 网关", "鉴权 · 限流 · 用量记录") +
        nodeButton("catalog", "token-chain-node", "模型货架", "能力 · 版本 · 计费口径") +
        '<div class="token-serving-engine" data-token-role="latency throughput multitenant balanced">' +
          '<div class="serving-engine-head"><span><b>推理服务</b><small>队列 · 调度 · 生成</small></span>' +
            nodeButton("sla", "service-badge", "SLA", "体验与并发承诺") + '</div>' +
          '<div class="tenant-lanes">' +
            '<span><b>租户 A</b><i></i><i></i><i></i><em>配额</em></span>' +
            '<span><b>租户 B</b><i></i><i></i><em>限流</em></span>' +
            '<span><b>租户 C</b><i></i><i></i><i></i><i></i><em>优先级</em></span>' +
          '</div>' + nodeButton("multitenant", "tenant-inspect", "多租户边界", "隔离 · 配额 · 优先级") +
        '</div>' +
        nodeButton("billing", "token-chain-node", "计费引擎", "把技术用量转换为账单") +
        nodeButton("pricing", "token-chain-node", "成本 → 定价", "完全成本 · 利用率 · 毛利口径") +
      '</div>' +
      '<div class="token-economics">' +
        nodeButton("pricingdetail", "token-policy-card", "计费策略", "输入 / 输出 / 缓存 / 阶梯与配额") +
        nodeButton("tcochain", "token-policy-card", "TCO 账链", "卡、电、设施、网络、人力与可计费用量", "pricing/tcochain") +
        '<a class="lv5-lab-cta" href="#/lab/token"><span>进入实验室</span><strong>Token 经济性与盈亏平衡</strong><em>打开 ›</em></a>' +
      '</div>' +
    '</div>';
    const footer = '<span><b>口径提醒</b> 不预填吞吐、延迟、价格或毛利；使用目标负载和业务数据验证。</span>';
    const root = mountFrame(station, mount, "lv5-token", "S9 · TOKEN SERVICE", "服务链与经营闭环", body, footer);
    return createController({
      station: station,
      mount: mount,
      root: root,
      initialState: {
        mode: "gateway", scenario: null, phase: "idle", step: 0,
        focusPath: ["gateway"], flags: { service: "balanced" }
      },
      transition: tokenTransition,
      renderState: renderTokenState
    });
  }

  /* ============================ S10 · 运维与监控 ============================ */
  function opsTransition(state, action) {
    const modes = {
      monitor: { view: "overview", incident: "none", focus: "monitor" },
      alerts: { view: "incident", incident: "drop", focus: "alerts" },
      maintenance: { view: "review", incident: "none", focus: "maintenance" },
      capacity: { view: "overview", incident: "headroom", focus: "capacity" }
    };
    const scenarios = {
      drop: { view: "incident", incident: "drop", focus: "alerts/dropnight", phase: "warning" },
      usage: { view: "overview", incident: "usage", focus: "monitor/utilization", phase: "running" },
      jitter: { view: "incident", incident: "jitter", focus: "alerts", phase: "warning" },
      headroom: { view: "overview", incident: "headroom", focus: "capacity", phase: "running" },
      review: { view: "review", incident: state.flags.incident || "none", focus: "maintenance", phase: "recovering" }
    };
    if (!state.flags.view) state.flags.view = "overview";
    if (!state.flags.incident) state.flags.incident = "none";

    if (action.type === "mode" && modes[action.id]) {
      state.mode = action.id;
      state.scenario = null;
      state.phase = "idle";
      state.step = 0;
      state.flags.view = modes[action.id].view;
      state.flags.incident = modes[action.id].incident;
      state.focusPath = asPath(modes[action.id].focus);
    }
    if (action.type === "scenario" && scenarios[action.id]) {
      const next = scenarios[action.id];
      state.mode = next.view;
      state.scenario = action.id;
      state.phase = next.phase;
      state.step = next.view === "incident" ? 1 : 0;
      state.flags.view = next.view;
      state.flags.incident = next.incident;
      state.focusPath = asPath(next.focus);
    }
    if (action.type === "action" && action.id === "next-step") {
      state.flags.view = "incident";
      state.step = Math.min(5, (state.step || 0) + 1);
      state.phase = state.step >= 5 ? "complete" : (state.step >= 3 ? "recovering" : "warning");
    }
    if (action.type === "action" && action.id === "open-review") {
      state.flags.view = "review";
      state.mode = "review";
      state.phase = "complete";
      state.step = 5;
      state.focusPath = ["maintenance"];
    }
    if (action.type === "focus") state.focusPath = asPath(action.path);
    if (action.type === "clear") {
      state.mode = "monitor";
      state.scenario = null;
      state.phase = "idle";
      state.step = 0;
      state.focusPath = ["monitor"];
      state.flags = { view: "overview", incident: "none" };
    }
    return state;
  }

  function renderOpsState(root, state) {
    const view = state.flags.view || "overview";
    const incident = state.flags.incident || "none";
    root.dataset.opsView = view;
    root.dataset.incidentType = incident;
    root.querySelectorAll("[data-ops-view-button]").forEach(function (button) {
      let active;
      if (button.dataset.stageScenario) active = button.dataset.stageScenario === state.scenario;
      else active = button.dataset.opsViewButton === view;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });
    root.querySelectorAll("[data-ops-step]").forEach(function (item) {
      const index = Number(item.dataset.opsStep);
      item.classList.toggle("is-done", index < state.step);
      item.classList.toggle("is-current", index === state.step);
    });

    const messages = {
      drop: ["掉卡事故", "一张 GPU 失联：隔离设备、补位并从可验证存档恢复。"],
      jitter: ["网络抖动", "节点仍在线，但同步链路不稳定：从尾部等待和慢节点证据定位。"],
      usage: ["利用率调查", "检查空转、排队和数据供给，不把单一利用率当完整结论。"],
      headroom: ["容量余量", "把高峰、故障余量、SLO 与利用率放在一起核验。"],
      none: ["系统总览", "正常、调查、故障与恢复必须清晰区分。"]
    };
    const message = messages[incident] || messages.none;
    root.querySelectorAll("[data-incident-title]").forEach(function (item) { item.textContent = message[0]; });
    root.querySelectorAll("[data-incident-copy]").forEach(function (item) { item.textContent = message[1]; });
    const next = root.querySelector("[data-stage-action='next-step']");
    if (next) {
      next.disabled = incident !== "drop" && incident !== "jitter";
      next.textContent = state.step >= 5 ? "恢复已验证" : "推进响应步骤";
    }
    return {
      context: message[1],
      status: state.phase === "complete" ? "恢复已验证" : message[0],
      metrics: [
        { label: "系统状态", value: state.phase === "idle" ? "教学总览" : state.phase },
        { label: "事故类型", value: incident === "none" ? "未注入" : message[0] }
      ]
    };
  }

  function opsRenderer(station, mount) {
    const gpuNodes = Array.from({ length: 8 }, function (_, index) {
      return '<span class="ops-gpu-node ' + (index === 4 ? "is-target" : "") + '"><i></i><b>GPU ' + (index + 1) + '</b></span>';
    }).join("");
    const steps = ["发现", "确认影响", "隔离", "补位 / 恢复", "验证", "复盘"];
    const body = '<div class="ops-workbench">' +
      '<div class="ops-viewbar" role="group" aria-label="运维视图">' +
        '<button type="button" data-stage-mode="monitor" data-ops-view-button="overview" aria-pressed="true">系统总览</button>' +
        '<button type="button" data-stage-action="open-review" data-ops-view-button="review" aria-pressed="false">恢复复盘</button>' +
      '</div>' +

      '<section class="ops-panel ops-overview-panel" data-ops-panel="overview">' +
        '<div class="ops-system-grid">' +
          nodeButton("monitor", "ops-system-card", "GPU 与作业", "利用率 · 队列 · 设备健康") +
          nodeButton("alerts", "ops-system-card", "网络与同步", "抖动 · 慢节点 · 告警") +
          nodeButton("capacity", "ops-system-card", "容量与 SLO", "高峰 · 余量 · 错误预算") +
          nodeButton("maintenance", "ops-system-card", "维护与变更", "巡检 · 升级 · 演练") +
        '</div>' +
        '<div class="ops-cluster-map"><div class="ops-cluster-head"><span><b>训练作业组</b><small>所有状态均为教学演示</small></span><em>同步域</em></div>' +
          '<div class="ops-network-bus" aria-hidden="true"><i></i><i></i><i></i></div><div class="ops-gpu-grid">' + gpuNodes + '</div>' +
          '<div class="ops-capacity-note"><b data-incident-title>系统总览</b><span data-incident-copy>正常、调查、故障与恢复必须清晰区分。</span></div>' +
        '</div>' +
      '</section>' +

      '<section class="ops-panel ops-incident-panel" data-ops-panel="incident">' +
        '<div class="ops-incident-layout"><div class="ops-incident-visual">' +
          '<div class="ops-incident-banner"><span class="incident-symbol" aria-hidden="true"></span><span><b data-incident-title>掉卡事故</b><small data-incident-copy>一张 GPU 失联：隔离设备、补位并从可验证存档恢复。</small></span></div>' +
          '<div class="ops-network-path" aria-hidden="true"><i></i><i></i><i></i><i></i></div>' +
          '<div class="ops-gpu-grid incident-grid">' + gpuNodes + '</div>' +
          nodeButton("dropnight", "ops-incident-knowledge", "事故机制", "掉卡恢复线与关键确认", "alerts/dropnight") +
        '</div>' +
        '<div class="ops-response"><div class="lv5-section-head"><span>响应步骤</span><small>恢复后仍需验证</small></div><ol>' +
          steps.map(function (step, index) { return '<li data-ops-step="' + index + '"><i></i><span><b>' + String(index + 1).padStart(2, "0") + '</b>' + esc(step) + '</span></li>'; }).join("") +
        '</ol><button type="button" class="ops-next" data-stage-action="next-step">推进响应步骤</button></div></div>' +
      '</section>' +

      '<section class="ops-panel ops-review-panel" data-ops-panel="review">' +
        '<div class="ops-review-grid">' +
          '<article><span>01</span><b>发生了什么</b><p>区分设备失联、网络抖动和慢节点，不用同一张故障图代替。</p></article>' +
          '<article><span>02</span><b>影响为什么扩大</b><p>检查同步域、故障域、容量余量和自动化边界。</p></article>' +
          '<article><span>03</span><b>恢复是否验证</b><p>恢复业务后继续核对训练状态、服务指标和数据一致性。</p></article>' +
          '<article><span>04</span><b>怎样避免重演</b><p>将证据转成监控、门槛、演练与容量行动项。</p></article>' +
        '</div>' +
        '<div class="ops-review-actions">' +
          nodeButton("maintenance", "ops-review-node", "巡检与保养", "把行动项纳入日常运营") +
          nodeButton("reliability", "ops-review-node", "可靠性工程", "SLO · 故障域 · 容量规划", "adv/reliability") +
        '</div>' +
      '</section>' +

      '<a class="lv5-lab-cta ops-lab-cta" href="#/lab/slo"><span>进入实验室</span><strong>SLO 控制室与故障注入</strong><em>打开 ›</em></a>' +
    '</div>';
    const footer = '<span><b>闭环原则</b> 发现异常 → 控制影响 → 恢复服务 → 验证结果 → 复盘改进。</span>';
    const root = mountFrame(station, mount, "lv5-ops", "S10 · RELIABILITY CONTROL", "系统总览、事故响应与恢复复盘", body, footer);
    return createController({
      station: station,
      mount: mount,
      root: root,
      initialState: {
        mode: "monitor", scenario: null, phase: "idle", step: 0,
        focusPath: ["monitor"], flags: { view: "overview", incident: "none" }
      },
      transition: opsTransition,
      renderState: renderOpsState
    });
  }

  RENDERERS.delivery = deliveryRenderer;
  RENDERERS["token-flow"] = tokenRenderer;
  RENDERERS["ops-timeline"] = opsRenderer;

  function canRender(visual) {
    return typeof RENDERERS[visual] === "function";
  }

  function render(station, mount) {
    const renderer = station && RENDERERS[station.visual];
    return renderer ? renderer(station, mount) : null;
  }

  return { canRender: canRender, render: render };
})();
