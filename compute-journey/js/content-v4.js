/* 算力之旅 V4 · 内容治理样板
 * 规范内容与页面位置分离：concept / claim / source / relation / review / legacyPlacement。
 * 当前只迁移前三站，旧站点 ID、节点 ID 与 Hash 路由保持不变。
 */
(function () {
  "use strict";

  const CONTENT_AS_OF = "2026-07-12";

  function source(title, publisher, type, url, publishedAt, scope) {
    return { title, publisher, type, url, publishedAt: publishedAt || "", accessedAt: CONTENT_AS_OF, scope };
  }

  const sources = {
    "src.nvidia.cuda": source(
      "CUDA C++ Best Practices Guide",
      "NVIDIA",
      "官方文档",
      "https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/index.html",
      "",
      "并行执行、内存带宽、数据搬运与有效带宽"
    ),
    "src.nvidia.performance": source(
      "GPU Performance Background User's Guide",
      "NVIDIA",
      "官方文档",
      "https://docs.nvidia.com/deeplearning/performance/dl-performance-gpu-background/index.html",
      "",
      "Roofline、算术强度、计算受限与带宽受限"
    ),
    "src.nvidia.transformer-engine": source(
      "Transformer Engine — Low Precision Training",
      "NVIDIA",
      "官方文档",
      "https://docs.nvidia.com/deeplearning/transformer-engine-releases/release-2.16/user-guide/features/low_precision_training/introduction/introduction.html",
      "",
      "BF16、FP16、FP8 与混合精度边界"
    ),
    "src.nvidia.dcgm": source(
      "NVIDIA DCGM Feature Overview",
      "NVIDIA",
      "官方文档",
      "https://docs.nvidia.com/datacenter/dcgm/latest/user-guide/feature-overview.html",
      "",
      "GPU 功率、温度、利用率、健康与诊断指标"
    ),
    "src.nvidia.dgx-b200": source(
      "Introduction to NVIDIA DGX B200 Systems",
      "NVIDIA",
      "厂商规格",
      "https://docs.nvidia.com/dgx/dgxb200-user-guide/introduction-to-dgxb200.html",
      "",
      "8 GPU 系统、PSU、网络、重量与功率规格"
    ),
    "src.nvidia.mnnvl": source(
      "NVIDIA Multi-Node NVLink Systems",
      "NVIDIA",
      "官方文档",
      "https://docs.nvidia.com/multi-node-nvlink-systems/index.html",
      "",
      "GB200 NVL72、多节点 NVLink 域与运维边界"
    ),
    "src.nvidia.gpudirect": source(
      "GPUDirect RDMA Documentation",
      "NVIDIA",
      "官方文档",
      "https://docs.nvidia.com/cuda/gpudirect-rdma/",
      "",
      "NIC 与 GPU 显存间直接数据路径及拓扑限制"
    ),
    "src.nvidia.smi": source(
      "NVIDIA System Management Interface",
      "NVIDIA",
      "官方文档",
      "https://docs.nvidia.com/deploy/nvidia-smi/index.html",
      "",
      "GPU、NIC、CPU、NUMA 与 PCIe 拓扑检查"
    ),
    "src.pcisig.pcie6": source(
      "PCI Express 6.0 Specification",
      "PCI-SIG",
      "标准",
      "https://pcisig.com/pci-express-6.0-specification",
      "2022-01-11",
      "64 GT/s、PAM4、FEC/CRC 与 x16 带宽口径"
    ),
    "src.ocp.openrack": source(
      "Open Rack V3 Specifications and Designs",
      "Open Compute Project",
      "标准",
      "https://www.opencompute.org/wiki/Open_Rack/SpecsAndDesigns",
      "",
      "机架、供电、液冷盲插与开放接口"
    ),
    "src.ocp.liquid": source(
      "Open Rack V3 Blind Mate Manifold Specification",
      "Open Compute Project",
      "标准",
      "https://www.opencompute.org/documents/open-rack-v3-blind-mate-manifold-specification-rev-1-0-review-april05-2024-pdf",
      "2024-04-05",
      "机架歧管、流量、压降与液冷接口"
    ),
    "src.energy.datacenter": source(
      "Best Practices Guide for Energy-Efficient Data Center Design",
      "U.S. Department of Energy",
      "政府指南",
      "https://www.energy.gov/cmei/femp/articles/best-practices-guide-energy-efficient-data-center-design",
      "2024-07-26",
      "IT、空气组织、制冷、电气、余热与能效指标"
    ),
    "src.greengrid.pue": source(
      "Power Usage Effectiveness",
      "The Green Grid",
      "标准组织",
      "https://www.thegreengrid.org/resources/glossary?combine=pue",
      "",
      "PUE 定义与测量边界"
    ),
    "src.uptime.tiers": source(
      "Explaining the Tier Classification System",
      "Uptime Institute",
      "标准组织",
      "https://journal.uptimeinstitute.com/explaining-uptime-institutes-tier-classification-system/",
      "",
      "冗余容量、并发可维护与容错结果"
    ),
    "src.nist.physical": source(
      "NIST SP 800-171 Rev. 3 — Physical Protection",
      "NIST",
      "政府标准",
      "https://nvlpubs.nist.gov/nistpubs/SpecialPublications/800-171r3/NIST.SP.800-171r3.html",
      "2024-05-14",
      "物理访问授权、监控、日志与访客控制"
    ),
    "src.nist.fire": source(
      "Clean Agent Suppression of Energized Electrical Equipment Fires",
      "NIST",
      "政府研究",
      "https://www.nist.gov/publications/clean-agent-suppression-energized-electrical-equipment-fires-0",
      "2009-01-01",
      "带电设备火灾、洁净气体与适用边界"
    ),
    "src.mlcommons.inference": source(
      "MLPerf Inference Benchmark Suite",
      "MLCommons",
      "行业基准",
      "https://docs.mlcommons.org/inference/index_gh/",
      "",
      "模型、质量门槛、吞吐与延迟的可比测试"
    )
  };

  const claims = {
    "claim.gpu.roofline": {
      value: "算力上限 × 带宽上限",
      context: "Roofline 用算术强度判断工作负载更可能受计算还是内存带宽限制。",
      asOf: "稳定原理",
      maturity: "工程方法",
      sourceIds: ["src.nvidia.performance"]
    },
    "claim.dgx-b200.memory": {
      value: "1,440 GB",
      context: "DGX B200 的 8 GPU 聚合显存示例；容量相加不等于自动形成统一地址空间。",
      asOf: CONTENT_AS_OF,
      maturity: "产品规格快照",
      sourceIds: ["src.nvidia.dgx-b200"]
    },
    "claim.dgx-b200.bandwidth": {
      value: "64 TB/s",
      context: "DGX B200 的 8 GPU HBM3e 聚合理论带宽，不等于单任务有效带宽。",
      asOf: CONTENT_AS_OF,
      maturity: "产品规格快照",
      sourceIds: ["src.nvidia.dgx-b200"]
    },
    "claim.dgx-b200.power": {
      value: "约 14.3 kW",
      context: "DGX B200 指定交流配置的系统最大功率，不是平均业务功耗。",
      asOf: CONTENT_AS_OF,
      maturity: "产品规格快照",
      sourceIds: ["src.nvidia.dgx-b200"]
    },
    "claim.precision.layout": {
      value: "BF16：8 位指数 / 7 位尾数",
      context: "FP16 为 5 位指数 / 10 位尾数；范围和精度取舍不同，均不含符号位。",
      asOf: "稳定定义",
      maturity: "数据格式",
      sourceIds: ["src.nvidia.transformer-engine"]
    },
    "claim.nvl72.domain": {
      value: "72 GPU NVLink 域",
      context: "GB200 NVL72 连接 36 个 Grace CPU 与 72 个 Blackwell GPU，并采用机架级液冷设计。",
      asOf: CONTENT_AS_OF,
      maturity: "产品规格快照",
      sourceIds: ["src.nvidia.mnnvl"]
    },
    "claim.pcie6.x16": {
      value: "64 GT/s",
      context: "PCIe 6.0 原始速率；x16 官方口径最高 256 GB/s 双向聚合，实际有效载荷更低。",
      asOf: "PCIe 6.0",
      maturity: "已发布规范",
      sourceIds: ["src.pcisig.pcie6"]
    },
    "claim.dgx-b200.psu": {
      value: "6 × 3.3 kW PSU",
      context: "DGX B200 官方 5+1 冗余示例；冗余能力不可外推到其他机型或上游接线。",
      asOf: CONTENT_AS_OF,
      maturity: "产品规格快照",
      sourceIds: ["src.nvidia.dgx-b200"]
    },
    "claim.dgx-b200.mass": {
      value: "142.4 kg / 10U",
      context: "单台 DGX B200 最大重量示例；整柜重量必须按完整 BOM 与设施配套重算。",
      asOf: CONTENT_AS_OF,
      maturity: "产品规格快照",
      sourceIds: ["src.nvidia.dgx-b200"]
    },
    "claim.pue.definition": {
      value: "PUE = 总设施能耗 ÷ IT 能耗",
      context: "必须同时说明计量边界和时间周期；PUE 不衡量模型质量、GPU 利用率、碳或用水。",
      asOf: "稳定定义",
      maturity: "能效指标",
      sourceIds: ["src.greengrid.pue", "src.energy.datacenter"]
    },
    "claim.liquid.product-boundary": {
      value: "液冷是产品条件，不是行业通则",
      context: "GB200 NVL72 是明确的机架级液冷产品；不能外推为所有 AI 服务器都必须液冷。",
      asOf: CONTENT_AS_OF,
      maturity: "趋势边界",
      sourceIds: ["src.nvidia.mnnvl", "src.ocp.liquid"]
    },
    "claim.tier.outcomes": {
      value: "Tier III：并发可维护",
      context: "Tier IV 增加容错结果；Tier 不是一张固定设备清单，也不是简单 uptime 百分比。",
      asOf: "稳定定义",
      maturity: "设施标准",
      sourceIds: ["src.uptime.tiers"]
    },
    "claim.fire.boundary": {
      value: "消防方案需按规范与风险组合",
      context: "ITE 空间可能采用喷淋、预作用、水雾或洁净气体等组合；最终服从当地规范与主管机关。",
      asOf: CONTENT_AS_OF,
      maturity: "安全边界",
      sourceIds: ["src.nist.fire"]
    }
  };

  function review(ownerRole, risk, cadenceDays) {
    const nextReview = cadenceDays === 90 ? "2026-10-10" : cadenceDays === 180 ? "2027-01-08" : "2027-07-12";
    return {
      status: "source-checked",
      ownerRole,
      risk: risk || "medium",
      lastReviewed: CONTENT_AS_OF,
      nextReview,
      cadenceDays
    };
  }

  function concept(config) {
    return {
      id: config.id,
      canonicalName: config.title,
      kind: config.kind || "concept",
      aliases: config.aliases || [],
      tags: config.tags || [],
      levels: {
        l0: { title: "30 秒摘要", text: config.l0 },
        l1: { title: "核心机制", text: config.l1 },
        l2: { title: "工程取舍", text: config.decision, prompt: (config.tradeoffs || [])[0] || "" },
        l3: { title: config.labTitle || "工程实践", text: config.lab, prompt: config.success || "" }
      },
      tradeoffs: config.tradeoffs || [],
      misconceptions: (config.misconceptions || []).map(item => "常见说法：“" + item[0] + "” 更准确的理解：" + item[1]),
      claimIds: config.claimIds || [],
      sourceIds: config.sourceIds || [],
      review: review(config.owner || "内容编辑与领域专家", config.risk || "medium", config.cadenceDays || 180)
    };
  }

  const stationDrafts = {
    gpu: {
      focus: "学会判断：算不动、放不下、喂不饱，还是供不起",
      learningObjectives: [
        "区分峰值算力、实测吞吐和业务性能。",
        "拆解权重、激活、KV Cache 与训练状态的显存占用。",
        "识别计算受限、带宽受限和数据供给受限。",
        "把精度、功耗、生态与 SLO 放进选卡决策。"
      ],
      tldr: "一句话看懂：GPU 依靠大规模并行执行 AI 运算；真实表现同时受计算、显存容量、显存带宽、精度和功耗约束。",
      intro: "旅程从一张加速卡开始，但不能只看“有多少核心”。这一站把一张卡拆成四个问题：算不算得动、模型放不放得下、数据喂不喂得饱，以及设施供不供得起。",
      concepts: [
        concept({
          id: "hw.gpu.execution-model",
          title: "计算核心与并行执行",
          aliases: ["GPU Cores", "SM", "Tensor Cores", "峰值算力"],
          tags: ["FLOPS", "Roofline", "算术强度", "计算瓶颈"],
          l0: "GPU 擅长把相同类型的运算铺到大量并行单元上；AI 矩阵运算适合这种模式，但峰值 FLOPS 不等于模型实际速度。",
          l1: "线程按 warp 在 SM 上执行，Tensor Core 加速特定格式的矩阵运算。端到端性能还受数据布局、批量、算子实现与内存系统影响，可用 Roofline 判断“算不够”还是“喂不饱”。",
          decision: "先按模型算子和精度筛选硬件，再用目标批量、序列长度与真实流量实测；采购表同时记录峰值、实测吞吐和功耗。",
          tradeoffs: ["低精度提高吞吐，但必须通过数值稳定性和任务质量验证", "更大批量常提高吞吐，却可能增加延迟和显存占用", "融合算子减少访存，但增加实现与可移植成本"],
          labTitle: "Roofline 瓶颈定位",
          lab: "分别测矩阵乘、归一化和逐元素算子的算术强度、SM/Tensor 活跃度与 DRAM 活跃度，并把它们放到 Roofline 上解释。",
          success: "能为三个算子指出不同瓶颈，并提出可验证的优化。",
          misconceptions: [
            ["核心越多或 FLOPS 越高，任何模型都更快", "只有工作负载、精度、并行度和数据供给都能利用这些单元时，峰值才可能转化为吞吐。"],
            ["GPU 只是很多个更弱的 CPU", "二者的执行、缓存与调度目标不同，这个比喻只适合入门。"]
          ],
          claimIds: ["claim.gpu.roofline"],
          sourceIds: ["src.nvidia.performance", "src.nvidia.dcgm"],
          owner: "GPU 性能工程",
          risk: "medium"
        }),
        concept({
          id: "ai.token.unit",
          title: "Token：模型处理与计量单位",
          aliases: ["词块", "input token", "output token"],
          tags: ["Token", "Tokenizer", "计量", "吞吐"],
          l0: "模型把文本切成 Token 后处理；Token 不是固定的字或单词，同一句话在不同分词器中数量可能不同。",
          l1: "分词器把文本映射为整数序列。上下文长度、KV Cache、吞吐和计费通常以 Token 计量，但输入、输出、缓存 Token 的成本与计算路径可以不同。",
          decision: "容量和报价都必须使用目标模型的真实分词器与输入/输出长度分布，不能用固定“一个 Token 等于几个汉字”代替测量。",
          tradeoffs: ["更细的切分可能增加序列长度，却改善罕见词表示", "只看平均 Token 数会掩盖长尾请求和容量峰值"],
          labTitle: "分词器差异实验",
          lab: "用中英文、代码、数字和表格样本比较两个模型的 Token 数，并计算上下文占用和请求成本。",
          success: "能解释同一文本为何在不同模型中容量与成本不同。",
          misconceptions: [
            ["一个 Token 固定等于一个汉字或半个英文单词", "Token 数由具体分词器和文本决定，必须实际计算。"]
          ],
          sourceIds: ["src.mlcommons.inference"],
          owner: "模型系统工程",
          risk: "medium"
        }),
        concept({
          id: "hw.gpu.memory-capacity",
          title: "显存容量与模型内存预算",
          aliases: ["VRAM", "HBM", "模型显存"],
          tags: ["显存", "权重", "激活", "KV Cache", "OOM"],
          l0: "显存是 GPU 的高速工作区；容量决定一次能容纳多少权重、激活和缓存，但模型能否运行还取决于精度、并行、批量与卸载。",
          l1: "推理显存通常包含权重、KV Cache 和临时工作区；训练还要保存激活、梯度、主权重和优化器状态。多卡不会自动形成一块统一显存，框架要明确分片和通信。",
          decision: "分别计算静态占用与随 batch、序列长度增长的动态占用，预留运行时工作区和碎片，再决定量化、并行或卸载。",
          tradeoffs: ["量化降低权重占用，但可能影响质量或算子支持", "CPU/NVMe 卸载扩大可运行规模，却引入搬运延迟", "保留余量降低 OOM 风险，但降低装载密度"],
          labTitle: "模型显存预算器",
          lab: "输入参数量、精度、训练/推理、批量、上下文和并行度，分别计算权重、训练状态、激活、KV Cache 与余量。",
          success: "估算结果能用真实运行峰值校准，并说明误差来源。",
          misconceptions: [
            ["模型运行时一定完整住在一张卡里", "模型可以分片、卸载或跨卡执行，关键是数据能按计算时序到位。"],
            ["多张卡的显存容量天然就是一块大显存", "容量可聚合统计，但地址空间和通信语义由互联与软件策略决定。"]
          ],
          claimIds: ["claim.dgx-b200.memory"],
          sourceIds: ["src.nvidia.dgx-b200", "src.nvidia.cuda"],
          owner: "模型系统工程",
          risk: "high",
          cadenceDays: 90
        }),
        concept({
          id: "hw.gpu.memory-bandwidth",
          title: "显存带宽与数据局部性",
          aliases: ["HBM Bandwidth", "有效带宽"],
          tags: ["带宽", "HBM", "访存", "Decode"],
          l0: "显存带宽表示核心和 HBM 之间搬数据的能力；数据复用低时，GPU 可能“算力很强却一直等材料”。",
          l1: "有效带宽取决于访问是否连续、缓存命中、数据复用和算子融合。Decode 常呈现低算术强度，但是否带宽受限必须结合模型、批量、量化和实现测量。",
          decision: "用有效带宽和 DRAM 活跃度判断瓶颈；先减少不必要搬运、改善访问与复用，再考虑更换高带宽硬件。",
          tradeoffs: ["缓存和融合减少 HBM 流量，却可能增加显存或编译复杂度", "大 batch 提高权重复用，却抬高排队和单请求延迟"],
          labTitle: "合并访存实验",
          lab: "比较连续、错位与跨步访问，记录有效带宽、DRAM 活跃度和 kernel 时间。",
          success: "能把差异归因到真实内存事务，而不是笼统归因于“卡不够快”。",
          misconceptions: [
            ["标称 HBM 带宽就是应用能达到的速度", "标称是理论上限，访问模式、缓存和并发决定有效带宽。"]
          ],
          claimIds: ["claim.dgx-b200.bandwidth"],
          sourceIds: ["src.nvidia.cuda", "src.nvidia.dcgm", "src.nvidia.dgx-b200"],
          owner: "GPU 性能工程",
          risk: "medium"
        }),
        concept({
          id: "hw.gpu.power-thermal",
          title: "GPU 功耗、温度与降频",
          aliases: ["TDP", "Power Cap", "Thermal Throttling"],
          tags: ["功耗", "温度", "降频", "能效"],
          l0: "GPU 把电能转化为计算和热；触及功率或温度限制时，频率与吞吐可能下降，所以要看“每瓦完成多少工作”。",
          l1: "实际板卡功率随工作负载、时钟和 power cap 变化；冷却能力决定器件能否保持目标频率。应同时观察功率、温度、能耗和 slowdown 原因。",
          decision: "以业务吞吐/瓦和 SLO 做 power-cap sweep，而不是默认满功率；同时验证最差环境和长期稳定性。",
          tradeoffs: ["更高功率上限可能只带来边际吞吐，却抬升设施成本", "更低功率提高每瓦效率，但可能增加完成时间"],
          labTitle: "功率上限效率曲线",
          lab: "在多个 power cap 下运行固定负载，记录吞吐、p95 延迟、能耗、温度和降频原因。",
          success: "找到满足 SLO 的最低能耗点，并说明适用环境。",
          misconceptions: [
            ["TDP 或最大功率就是日常功耗", "它是设计或上限口径；真实功率要在代表性负载与环境中测量。"],
            ["没到关机温度就不会影响性能", "系统可能在关机前因温度、功率或可靠性策略降频。"]
          ],
          claimIds: ["claim.dgx-b200.power"],
          sourceIds: ["src.nvidia.dcgm", "src.nvidia.dgx-b200"],
          owner: "硬件可靠性工程",
          risk: "high",
          cadenceDays: 90
        }),
        concept({
          id: "hw.gpu.workload-fit",
          title: "加速器分类与工作负载匹配",
          aliases: ["训练卡", "推理卡", "GPU", "NPU", "ASIC"],
          tags: ["选型", "训练", "推理", "生态"],
          l0: "“训练卡/推理卡”是方便理解的标签，不是严格物种；真正要匹配的是容量、精度、互联、延迟、功耗、软件和服务。",
          l1: "训练重视大容量、稳定低精度和通信；在线推理还关心首 Token、每 Token 延迟、并发与能效；边缘任务可能更看重形态和功耗。",
          decision: "用代表性模型、输入输出长度与并发做短名单实测，同时审查驱动、框架、算子、供应、支持和迁移成本。",
          tradeoffs: ["通用性提高可迁移性，却可能牺牲单一负载效率", "专用加速器能效高，但算子覆盖和供应风险更集中"],
          labTitle: "工作负载—加速器评分卡",
          lab: "对候选设备执行相同模型和 SLO，形成性能、质量、能耗、生态与供应五维评分。",
          success: "结论可追溯到实测与约束，而不是厂商标签。",
          misconceptions: [
            ["训练卡只能训练，推理卡只能推理", "标签只表示设计侧重，能否胜任取决于模型、软件与 SLO。"],
            ["选卡只看单价和显存", "互联、精度、算子、功耗和支持往往决定实际交付成本。"]
          ],
          sourceIds: ["src.nvidia.dcgm", "src.mlcommons.inference"],
          owner: "解决方案架构",
          risk: "high",
          cadenceDays: 90
        }),
        concept({
          id: "numeric.precision.formats",
          title: "精度、混合精度与量化",
          aliases: ["FP32", "BF16", "FP16", "FP8", "INT8", "INT4"],
          tags: ["精度", "量化", "混合精度", "数值稳定"],
          l0: "更少的位通常意味着更小内存和更高吞吐，但不同格式的范围、精度与硬件支持不同；降低位宽必须通过质量验证。",
          l1: "BF16 保留 FP32 的指数位宽但尾数较短；FP16 指数范围更小。混合精度让适合的算子低精度执行，关键累加或状态仍可能保留高精度。",
          decision: "训练从成熟 BF16/混合精度配方起步再评估 FP8；推理按模型与硬件验证 FP8、INT8、INT4，以质量、延迟和成本共同验收。",
          tradeoffs: ["位宽下降减少内存与带宽，却可能引入溢出或量化误差", "保留高精度路径提高稳健性，会降低理论加速上限"],
          labTitle: "精度阶梯验证",
          lab: "同一模型逐级测试 BF16、FP8、INT8/INT4，记录质量、吞吐、显存和能耗。",
          success: "选择满足质量门槛的最低成本格式，并保存可复现配方。",
          misconceptions: [
            ["FP16 一定比 BF16 更准", "FP16 尾数更多但指数范围更小，稳定性要结合模型与配方。"],
            ["INT4 会固定快 4 倍", "端到端收益受算子、解量化、瓶颈和批量影响。"]
          ],
          claimIds: ["claim.precision.layout"],
          sourceIds: ["src.nvidia.transformer-engine"],
          owner: "数值与模型工程",
          risk: "high"
        })
      ],
      placements: {
        "core": "hw.gpu.execution-model",
        "core/token": "ai.token.unit",
        "vram": "hw.gpu.memory-capacity",
        "vram/whybig": "hw.gpu.memory-capacity",
        "bandwidth": "hw.gpu.memory-bandwidth",
        "cooling": "hw.gpu.power-thermal",
        "types": "hw.gpu.workload-fit",
        "dataformat": "numeric.precision.formats"
      }
    },

    server: {
      focus: "读懂数据路径：GPU、CPU、互联、NIC、NVMe、电源与散热如何成为一个系统",
      learningObjectives: [
        "读懂 GPU—NVSwitch—CPU—NIC—NVMe—NUMA 拓扑。",
        "区分 scale-up 与 scale-out，并理解 8 卡不是永久边界。",
        "识别 CPU、主存、存储或网络造成的 GPU 等待。",
        "用最大功率、冗余、冷却和可维护性评估节点。"
      ],
      tldr: "一句话看懂：8 GPU 是常见高端节点形态，但价值不只在“卡数”，而在互联、主机、网络、供电、散热与软件共同通过验证。",
      intro: "把多张 GPU 装进一个机箱只是开始。真正的多卡系统要让 GPU 找到最近的 CPU、NIC 与数据路径，并在满载、故障和维护状态下仍满足性能与可靠性目标。",
      concepts: [
        concept({
          id: "hw.system.rack-scale-domain",
          title: "从 8 卡节点到机架级 NVLink 域",
          aliases: ["机架级超节点", "NVL72", "Scale-up Domain"],
          tags: ["NVL72", "scale-up", "scale-out", "故障域"],
          l0: "算力积木正从单台 8 卡机扩展到机架级高速互联域；它扩大低时延协作范围，也把供电、液冷、固件和故障管理提升到整柜层面。",
          l1: "GB200 NVL72 把多个 CPU、GPU 与 NVLink Switch 组成一个 72-GPU NVLink 域，属于 scale-up；跨机架仍需要 InfiniBand 或以太网等 scale-out 网络。",
          decision: "通信密集、模型状态大且软件能利用大域时评估机架级 scale-up，同时比较成熟度、故障爆炸半径、设施改造和供应风险。",
          tradeoffs: ["大域减少通信边界，但维护可能影响更大单元", "机架一体化简化拓扑，却提高场地与供应链耦合", "scale-up 延伸不能替代跨机架 scale-out"],
          labTitle: "Scale-up / Scale-out 边界选择",
          lab: "输入模型通信量、并行策略、目标扩展效率、维护窗口与机架能力，对比 8 GPU、72 GPU 域和多机架方案。",
          success: "方案同时解释性能收益与设施、可靠性代价。",
          misconceptions: [
            ["NVL72 是一张物理 GPU", "它是由多个 CPU、GPU、交换芯片和系统节点组成的机架级系统。"],
            ["用了 NVLink 就不需要集群网络", "NVLink 服务域内 scale-up，跨域训练、存储和管理仍需要网络。"]
          ],
          claimIds: ["claim.nvl72.domain"],
          sourceIds: ["src.nvidia.mnnvl", "src.ocp.openrack"],
          owner: "多 GPU 系统架构",
          risk: "high",
          cadenceDays: 90
        }),
        concept({
          id: "hw.system.multi-gpu-node",
          title: "多 GPU 节点与“8 卡”基线",
          aliases: ["8 卡服务器", "HGX", "DGX"],
          tags: ["8 GPU", "节点", "扩展效率", "验收"],
          l0: "8 GPU 是常见高端节点形态，不是自然定律；节点价值在于把计算、互联、主机、网络、存储和管理做成经过验证的整体。",
          l1: "同一节点内 GPU 由 NVLink/NVSwitch 或 PCIe 连接，CPU/内存负责控制与数据准备，NIC 接入集群，NVMe 提供本地暂存。多卡不会自动线性加速。",
          decision: "从并行策略与故障域决定每节点 GPU 数；采购要比较整机拓扑、固件矩阵、维护性和验收基线，而不只比较 GPU 型号。",
          tradeoffs: ["单节点 GPU 更多可减少跨节点通信，但节点故障损失更大", "标准整机支持完整，却可能更贵或更锁定", "定制 BOM 灵活，但增加集成验证"],
          labTitle: "多 GPU 节点验收",
          lab: "执行单卡健康、显存、P2P、集合通信、NIC/NVMe 与满载功耗测试，形成节点基线指纹。",
          success: "能识别低于同批基线的卡、链路或设备，并保存可复测版本。",
          misconceptions: [
            ["行业永远以 8 卡为最小积木", "4 卡、8 卡和机架级域会按工作负载与产品代际长期共存。"],
            ["装进同一机箱就会线性加速", "扩展效率取决于互联、并行、负载均衡与实现。"]
          ],
          sourceIds: ["src.nvidia.dgx-b200", "src.nvidia.dcgm"],
          owner: "服务器平台工程",
          risk: "high",
          cadenceDays: 90
        }),
        concept({
          id: "hw.interconnect.nvlink-nvswitch",
          title: "NVLink、NVSwitch 与 PCIe",
          aliases: ["卡间互联", "Scale-up Fabric"],
          tags: ["NVLink", "NVSwitch", "PCIe", "P2P"],
          l0: "NVLink/NVSwitch 为 GPU 间高带宽、低时延通信服务；PCIe 仍负责设备枚举与通用 I/O。两者是互补路径。",
          l1: "NVSwitch 提供交换式 GPU fabric，使 GPU P2P 不必都经 CPU；PCIe 连接 GPU、NIC、NVMe 与 CPU root complex。软件仍要启用 P2P 并选择可用路径。",
          decision: "用拓扑矩阵和 P2P/collective 实测每对 GPU 路径；把高通信张量尽量放在更近的互联域。",
          tradeoffs: ["强 scale-up fabric 降低通信时间，但提高系统成本", "拓扑感知放置提高效率，却增加调度复杂度"],
          labTitle: "拓扑矩阵与 P2P 验证",
          lab: "读取 GPU/NIC/NUMA 拓扑，逐对测试 P2P 带宽、时延与 AllReduce。",
          success: "能发现意外经过 PCIe 或跨 NUMA 的路径，并给出映射修正。",
          misconceptions: [
            ["NVLink 让所有 GPU 自动共享一块显存", "互联提供高效路径，内存和并行语义仍由平台与软件实现。"],
            ["链路带宽就是 AllReduce 带宽", "方向、聚合口径、拓扑、协议和算法都会造成差异。"]
          ],
          claimIds: ["claim.pcie6.x16"],
          sourceIds: ["src.nvidia.smi", "src.pcisig.pcie6", "src.nvidia.dgx-b200"],
          owner: "互联性能工程",
          risk: "high",
          cadenceDays: 90
        }),
        concept({
          id: "hw.system.cpu-numa",
          title: "CPU、NUMA 与主机控制面",
          aliases: ["Host CPU", "NUMA Affinity"],
          tags: ["CPU", "NUMA", "绑核", "数据准备"],
          l0: "GPU 做主要张量计算，但 CPU 负责进程、数据准备、网络、存储和控制；CPU 或 NUMA 放置不当会让 GPU 等待。",
          l1: "双路服务器存在多个 NUMA 节点和 PCIe root complex。GPU、NIC、NVMe 与 CPU 内存有远近关系；跨 socket 访问会增加跳数和争用。",
          decision: "按拓扑绑定 CPU 核、内存、GPU 与 NIC；分别监控数据加载、Host→Device 拷贝和 GPU idle gap，再决定加资源或改流水线。",
          tradeoffs: ["严格绑核提高可预测性，却降低调度弹性", "更多预处理 worker 可喂满 GPU，也会争抢 CPU 与内存带宽"],
          labTitle: "NUMA 亲和性 A/B 测试",
          lab: "同一任务分别采用本地与跨 NUMA 的 CPU、内存和 NIC 绑定，记录 GPU idle、H2D 带宽和 step time。",
          success: "能用拓扑解释差异并生成推荐绑定模板。",
          misconceptions: [
            ["AI 服务器里的 CPU 完全不计算，所以型号无关", "CPU 承担控制、预处理和 I/O，不同任务的核数与内存需求不同。"]
          ],
          sourceIds: ["src.nvidia.smi", "src.nvidia.cuda", "src.nvidia.dgx-b200"],
          owner: "服务器性能工程"
        }),
        concept({
          id: "hw.system.memory-storage",
          title: "主机内存、NVMe 与数据暂存",
          aliases: ["RAM", "Local NVMe", "数据快取"],
          tags: ["NVMe", "主存", "缓存", "预取"],
          l0: "主机内存和本地 NVMe 是 GPU 上游暂存层；目标不是越大越好，而是让数据按计算节奏稳定到达。",
          l1: "数据可能从远端存储进入本地 NVMe，再进入主机内存与显存。页锁定内存和异步拷贝可重叠搬运与计算；直接路径仍受软件与拓扑约束。",
          decision: "按工作集、复用率和恢复策略规划本地盘；先画数据路径并测每层吞吐，再决定缓存、预取、分片或直接路径。",
          tradeoffs: ["大本地缓存减少远端 I/O，却增加一致性和重建成本", "页锁定内存提高传输效率，但过量会挤压系统内存"],
          labTitle: "输入流水线压测",
          lab: "对远端→NVMe→RAM→GPU 各段测吞吐，并比较同步/异步与普通/页锁定内存。",
          success: "识别首个饱和层，并验证优化后 GPU 等待下降。",
          misconceptions: [
            ["NVMe 越快，训练一定越快", "只有数据管线确实受本地盘限制且下游能接住时，提升才有效。"]
          ],
          sourceIds: ["src.nvidia.cuda", "src.nvidia.gpudirect", "src.nvidia.dgx-b200"],
          owner: "数据与存储工程"
        }),
        concept({
          id: "hw.system.network-interfaces",
          title: "NIC、RDMA 与外部数据路径",
          aliases: ["普通网卡", "RDMA 网卡", "SuperNIC", "DPU"],
          tags: ["NIC", "RDMA", "GPUDirect", "网络隔离"],
          l0: "AI 节点通常连接计算、存储、带内管理与带外管理网络；高速 NIC 的价值不只是带宽，而是把 GPU 通信接入 scale-out fabric。",
          l1: "GPUDirect RDMA 允许支持的 NIC 沿 PCIe 访问 GPU 显存，减少主机中转；效果依赖 GPU—NIC—root complex 拓扑。BMC 则提供独立带外管理。",
          decision: "依据通信、存储流量和隔离目标规划端口；每个 GPU rail 都要验证 NIC 亲和、RDMA、固件与故障切换。",
          tradeoffs: ["物理隔离降低互相干扰，却增加端口和交换成本", "DPU 卸载释放 CPU，也增加固件和可观测层"],
          labTitle: "GPU—NIC 亲和性验证",
          lab: "对本地与跨 root complex 的 GPU/NIC 组合测试 RDMA 带宽、时延和 CPU 占用。",
          success: "生成可供调度器使用的 GPU—NIC 亲和映射。",
          misconceptions: [
            ["RDMA 完全不经过 CPU", "数据面可减少主机中转，但连接、注册、控制和异常仍需要软件与 CPU。"]
          ],
          sourceIds: ["src.nvidia.gpudirect", "src.nvidia.smi", "src.nvidia.dgx-b200"],
          owner: "高性能网络工程",
          risk: "high",
          cadenceDays: 90
        }),
        concept({
          id: "hw.system.power-redundancy",
          title: "节点供电、PSU 冗余与功率封顶",
          aliases: ["冗余电源", "PSU", "Power Capping"],
          tags: ["PSU", "冗余", "PDU", "功率封顶"],
          l0: "高密度 GPU 节点需要数据中心级电源；最大功率、插头、相位、PDU 容量和掉电行为都必须纳入部署。",
          l1: "多 PSU 可分担负载并在部分故障时维持运行或降功率；结果取决于机型、负载、接线与上游 PDU，而不是只看模块数量。",
          decision: "按最大并发与故障状态做回路预算，把 PSU 分散到独立上游路径，并实测单路丢失与 power cap 行为。",
          tradeoffs: ["为峰值和故障预留容量提高可靠性，却降低利用率", "功率封顶控制机架峰值，但可能延长任务"],
          labTitle: "PSU / 上游路径故障演练",
          lab: "在厂商允许条件下模拟单个上游路径丢失，记录告警、可用功率、吞吐变化与恢复步骤。",
          success: "验证接线真正实现预期冗余，并把禁止操作写入运行手册。",
          misconceptions: [
            ["有多个 PSU 就能任意坏两个不停机", "容错数量与性能取决于机型、当前负载和上游接线，必须按官方故障表验证。"]
          ],
          claimIds: ["claim.dgx-b200.psu"],
          sourceIds: ["src.nvidia.dgx-b200", "src.nvidia.dcgm"],
          owner: "服务器硬件与设施工程",
          risk: "high",
          cadenceDays: 90
        }),
        concept({
          id: "hw.system.node-cooling",
          title: "节点散热：风冷与冷板",
          aliases: ["风墙", "Direct-to-Chip", "Cold Plate"],
          tags: ["风冷", "液冷", "冷板", "热设计"],
          l0: "节点消耗的电最终主要变成热；风冷还是液冷由热流密度、机型认证与设施条件共同决定。",
          l1: "风冷靠散热器和风扇把热送到空气；冷板把芯片热量交给技术冷却液，再经 CDU 和设施回路排走。液冷系统中的其他部件仍可能需要空气冷却。",
          decision: "按设备热设计与设施供回液条件选方案；液冷评估要包含材料、快接、泄漏检测、流量、压降与维护。",
          tradeoffs: ["液冷支持更高密度，却引入水路与运维技能", "提高风量简单直接，但增加风机能耗与压差"],
          labTitle: "满载热稳态测试",
          lab: "逐步提升 GPU/CPU 负载，观察温度余量、频率、风扇/流量、供回温差和告警。",
          success: "在最差设计条件下持续满足性能且无热降频。",
          misconceptions: [
            ["上液冷后就不需要风扇和机房冷却", "液冷常只带走主要芯片热量，其余部件与房间热湿负荷仍需处理。"]
          ],
          sourceIds: ["src.ocp.liquid", "src.energy.datacenter", "src.nvidia.dcgm"],
          owner: "热设计工程",
          risk: "high"
        })
      ],
      placements: {
        "gpu8": "hw.system.multi-gpu-node",
        "gpu8/why8": "hw.system.multi-gpu-node",
        "nvlink": "hw.interconnect.nvlink-nvswitch",
        "cpu": "hw.system.cpu-numa",
        "memstore": "hw.system.memory-storage",
        "nic": "hw.system.network-interfaces",
        "psu": "hw.system.power-redundancy",
        "psu/whynot": "hw.system.power-redundancy",
        "cooling": "hw.system.node-cooling",
        "adv/superpod": "hw.system.rack-scale-domain"
      }
    },

    dc: {
      focus: "用功率、冷量、结构与安全边界判断一座机房能否承载 AI",
      learningObjectives: [
        "用机架功率、冷却、结构和维护空间计算容量包络。",
        "区分冗余部件、冗余路径、并发可维护与容错。",
        "画出芯片到室外的风冷或液冷完整热路径。",
        "正确使用 PUE，并识别消防与物理安全的适用边界。"
      ],
      tldr: "一句话看懂：数据中心不是“放服务器的房间”，而是把供电、散热、结构、安全和运维组合成可持续服务的设施系统。",
      intro: "AI 设备的功率和热密度让机房从背景设施变成核心系统。装得下不等于跑得稳：每个机架都必须同时满足电、热、重量、连接、维护和安全边界。",
      concepts: [
        concept({
          id: "facility.liquid.transition",
          title: "高密度机架的液冷转型",
          aliases: ["液冷成为默认", "Direct Liquid Cooling", "DLC"],
          tags: ["液冷", "CDU", "歧管", "热捕获率"],
          l0: "对部分高密度 AI 系统，液冷已成为产品前提；但“所有 AI 机房都必须液冷”仍是错误结论。",
          l1: "冷板、机架歧管、CDU、设施水和散热端构成热传递链。供回液、压降、材料、洁净度、泄漏控制和未被液体带走的余热共同决定可靠性。",
          decision: "先按设备允许条件与每柜热负载筛选风冷、液冷或混合方案，再决定 CDU 位置和冗余。",
          tradeoffs: ["液冷提高密度和热移除效率，却增加改造与泄漏治理", "柜级 CDU 边界清晰，但占空间且数量多"],
          labTitle: "液冷回路数字样机",
          lab: "根据机架热量、热捕获率、液体比热与目标 ΔT 计算流量，再模拟泵或 CDU 故障。",
          success: "结果与设备、设施设计点一致，并明确剩余空气热负荷。",
          misconceptions: [
            ["Blackwell 之后所有服务器都必须液冷", "液冷要求取决于具体产品、密度和设施，NVL72 只是明确实例。"],
            ["液冷就是让自来水流过 GPU", "常见冷板方案使用受控技术冷却液、换热器、泵和独立设施回路。"]
          ],
          claimIds: ["claim.liquid.product-boundary"],
          sourceIds: ["src.nvidia.mnnvl", "src.ocp.liquid", "src.energy.datacenter"],
          owner: "数据中心冷却架构",
          risk: "high",
          cadenceDays: 90
        }),
        concept({
          id: "facility.sustainability.metrics",
          title: "PUE、能效与可持续边界",
          aliases: ["PUE", "WUE", "CUE", "绿电"],
          tags: ["PUE", "WUE", "碳", "能效"],
          l0: "PUE 衡量设施总能耗相对 IT 能耗的比例；它不衡量 GPU 是否忙、模型是否高效，也不直接等于碳排或用水。",
          l1: "PUE 的分子包含供配电损耗、冷却、照明等。测量边界、周期、季节、负载率与气候都会影响结果；业务效率还要看单位有效结果能耗。",
          decision: "同时展示 PUE、IT 利用/效率和单位业务能耗，并按项目加入水与碳指标；跨站比较前统一边界和周期。",
          tradeoffs: ["更低 PUE 不能消除低利用率 GPU 的浪费", "节水方案可能增加能耗，反之亦然", "年度平均会掩盖高温天与峰值风险"],
          labTitle: "PUE 边界与负载曲线",
          lab: "用全年 IT、冷却和配电时序计算月度/年度 PUE，并与单位有效结果能耗对照。",
          success: "能解释同一 PUE 下为何业务能效仍可能不同。",
          misconceptions: [
            ["PUE 1.1 就代表模型很省电", "PUE 只描述设施开销，GPU 利用率与模型效率仍属于 IT 侧。"],
            ["PUE 不说明周期也能直接横向比较", "边界、气候、季节和负载率不同会破坏可比性。"]
          ],
          claimIds: ["claim.pue.definition"],
          sourceIds: ["src.greengrid.pue", "src.energy.datacenter"],
          owner: "能源与可持续",
          risk: "medium"
        }),
        concept({
          id: "facility.rack.capacity-envelope",
          title: "机架容量包络",
          aliases: ["Rack Density", "每柜 kW", "机柜"],
          tags: ["机架", "kW/rack", "重量", "容量"],
          l0: "一柜能放几台服务器不是按 U 位做除法，而由功率、散热、重量、布线、检修空间和上游能力共同取最小值。",
          l1: "设备 U 位只是几何约束；供电、PDU 插位、液冷接口、风量、楼板荷载、机柜深度、线缆弯曲和维护动作一起形成容量包络。",
          decision: "为每种机型建立 rack elevation，逐项计算 U、kW、热、重、端口与维护约束，按最先触顶项定装机数。",
          tradeoffs: ["填满 U 位提高空间利用率，却可能超出电热与维护能力", "高密度减少占地，却增加单柜故障影响"],
          labTitle: "机架装机校核器",
          lab: "拖入服务器、交换机、PDU/CDU 后实时检查六类容量，并显示首个瓶颈。",
          success: "输出可供设施、网络与运维共同评审的单柜配置。",
          misconceptions: [
            ["42U 就能放 42 台 1U 设备", "空间只是约束之一，供电、热、重量和连接常先触顶。"],
            ["普通机房固定只能放 1–2 台 8 卡机", "机型和设施差异很大，必须按具体容量包络计算。"]
          ],
          claimIds: ["claim.dgx-b200.mass"],
          sourceIds: ["src.nvidia.dgx-b200", "src.ocp.openrack", "src.ocp.liquid"],
          owner: "机房规划工程",
          risk: "high",
          cadenceDays: 90
        }),
        concept({
          id: "facility.power.resilience",
          title: "供电链、冗余与可维护性",
          aliases: ["市电", "UPS", "发电机", "A/B 路"],
          tags: ["供电链", "UPS", "冗余", "故障域"],
          l0: "供电不是固定的“三道保险”，而是一条从电源到机架、按业务目标设计的容量与故障隔离链。",
          l1: "典型链路可能包含公用电源、开关、UPS/储能、发电、变压器、母线/PDU 与双路机架输入。冗余部件不等于冗余路径。",
          decision: "从业务 RTO/RPO 和停机影响选择容量、冗余、并发维护或容错目标，再用单线图和故障演练验证。",
          tradeoffs: ["更高拓扑目标提高可用性，却增加资本、损耗和测试复杂度", "UPS 提供过渡与电能质量，也带来电池与旁路风险"],
          labTitle: "供电故障树",
          lab: "在单线图上模拟 UPS 旁路、发电未启动和单路 PDU 丢失，观察受影响机架与剩余容量。",
          success: "所有约定维护与单故障都达到业务目标，且无隐藏过载。",
          misconceptions: [
            ["双路市电、UPS、柴油机是所有机房固定架构", "具体来源、储能、发电和配电设计随站点与目标变化。"],
            ["部件 N+1 就代表整条链没有单点", "部件可能仍共享开关、母线、控制或下游路径。"]
          ],
          claimIds: ["claim.tier.outcomes"],
          sourceIds: ["src.uptime.tiers", "src.energy.datacenter"],
          owner: "关键供配电工程",
          risk: "high"
        }),
        concept({
          id: "facility.cooling.heat-chain",
          title: "从芯片到室外的完整散热链",
          aliases: ["制冷", "冷热通道", "CDU", "风冷 vs 液冷"],
          tags: ["制冷", "风冷", "液冷", "ΔT", "露点"],
          l0: "服务器用掉的电最终主要变成热；冷却系统要把热从芯片或空气，稳定地送到室外。",
          l1: "风冷依赖风扇、冷热通道与空气处理；液冷依赖冷板或浸没侧、技术冷却液、CDU、设施回路和散热端。流量与 ΔT 决定携热能力，露点决定冷凝风险。",
          decision: "依据设备允许环境、气候、水资源、负载变化与冗余目标选择架构，同时优化器件温度、泵/风机能耗和容量余量。",
          tradeoffs: ["降低供风/供液温度增加热余量，却增加能耗和冷凝风险", "更大 ΔT 降低流量需求，但可能扩大器件温差"],
          labTitle: "热链瓶颈定位",
          lab: "输入每段容量、温度、流量/风量与冗余，模拟炎热天气和单泵/风机故障。",
          success: "识别最小容量段，并提出不会把瓶颈转移到下一段的改造。",
          misconceptions: [
            ["服务器每用 1 度电，制冷固定再用 1 度", "配套能耗随架构、环境与负载变化，应由分项计量观察。"],
            ["液冷天然不会冷凝", "供液温度低于环境露点仍有风险。"]
          ],
          claimIds: ["claim.pue.definition"],
          sourceIds: ["src.energy.datacenter", "src.ocp.liquid", "src.greengrid.pue"],
          owner: "暖通与液冷工程",
          risk: "high"
        }),
        concept({
          id: "facility.structure.cabling",
          title: "结构荷载、布线与可维护性",
          aliases: ["承重", "走线", "Cable Management"],
          tags: ["承重", "布线", "维护", "机柜"],
          l0: "高密度机架既重又线缆密集；结构、搬运路径、线缆半径、液管和检修空间必须作为一个系统设计。",
          l1: "校核包括设备/机柜静载、运输安装路径、楼板/底座、抗震，以及电力、光纤、铜缆和液管的分区与支撑。过密布线会妨碍气流、维修和消防。",
          decision: "以实际 BOM 和结构报告为准，完成 rack elevation、路由和更换动作演练，不用“通常上吨”替代校核。",
          tradeoffs: ["最短线缆降低损耗，却可能妨碍抽拉与维护", "高密度减少柜数，却增加单点重量和连接复杂度"],
          labTitle: "数字机架维护演练",
          lab: "模拟更换 GPU tray、PSU、交换机、光模块和冷板快接，检查是否需断开无关路径。",
          success: "关键部件能按维护目标更换，且无越界承重、弯曲或遮挡。",
          misconceptions: [
            ["满配 GPU 柜一定超过一吨，所有地面都必须加固", "重量随设备、机柜与配套变化，必须用真实 BOM 与结构校核。"]
          ],
          claimIds: ["claim.dgx-b200.mass"],
          sourceIds: ["src.nvidia.dgx-b200", "src.ocp.openrack"],
          owner: "结构与机房工程",
          risk: "high"
        }),
        concept({
          id: "facility.safety.physical",
          title: "消防、环境风险与物理安全",
          aliases: ["Fire Suppression", "门禁", "安防"],
          tags: ["消防", "洁净气体", "门禁", "审计"],
          l0: "机房保护不是“不能喷水、只能放气”；应由风险评估和当地规范组合早期探测、自动灭火、人员安全、门禁、监控与审计。",
          l1: "ITE 空间可能使用喷淋、预作用、水雾、洁净气体等一种或多种系统。洁净气体不是简单“抽走氧气”；物理安全还包括授权、访客和访问日志。",
          decision: "由消防工程师和主管机关确认方案；运维把告警联动、停机、撤离、复位与数据恢复纳入演练。",
          tradeoffs: ["预作用降低误放水概率，却增加阀组与探测复杂度", "洁净气体减少残留，但有密闭、人员和环保约束"],
          labTitle: "烟感—灭火—恢复演练",
          lab: "从单点烟感开始，推演确认、联动停机、人员撤离、灭火、复位与任务恢复。",
          success: "所有动作有责任人和证据，且人员安全优先于设备保全。",
          misconceptions: [
            ["机房着火绝对不能用水，只能用气体", "系统组合必须服从当地规范、风险评估与主管机关。"],
            ["气体灭火就是把房间氧气抽走", "不同洁净气体的机理、设计浓度和人员要求不同。"]
          ],
          claimIds: ["claim.fire.boundary"],
          sourceIds: ["src.nist.fire", "src.nist.physical"],
          owner: "消防与物理安全",
          risk: "high"
        })
      ],
      placements: {
        "rack": "facility.rack.capacity-envelope",
        "rack/rackfull": "facility.rack.capacity-envelope",
        "power": "facility.power.resilience",
        "cooling": "facility.cooling.heat-chain",
        "cooling/pue": "facility.sustainability.metrics",
        "cooling/aircool": "facility.cooling.heat-chain",
        "cabling": "facility.structure.cabling",
        "fire": "facility.safety.physical",
        "adv/liquiddefault": "facility.liquid.transition",
        "adv/sustain": "facility.sustainability.metrics"
      }
    }
  };

  const concepts = {};
  const legacyPlacements = {
    "placement.server.adv": {
      id: "placement.server.adv",
      kind: "collection",
      stationId: "server",
      legacyPath: ["adv"],
      legacyRoute: "#/s/server/adv",
      status: "pilot"
    },
    "placement.dc.adv": {
      id: "placement.dc.adv",
      kind: "collection",
      stationId: "dc",
      legacyPath: ["adv"],
      legacyRoute: "#/s/dc/adv",
      status: "pilot"
    }
  };
  const stationProfiles = {};
  const reviews = {};

  Object.keys(stationDrafts).forEach(stationId => {
    const draft = stationDrafts[stationId];
    draft.concepts.forEach(item => {
      concepts[item.id] = item;
      reviews["review." + item.id + "." + CONTENT_AS_OF] = {
        id: "review." + item.id + "." + CONTENT_AS_OF,
        targetType: "concept",
        targetId: item.id,
        decision: "source-checked",
        reviewerRole: item.review.ownerRole,
        reviewedAt: item.review.lastReviewed,
        nextReviewAt: item.review.nextReview,
        notes: "官方来源已核对；上线前仍需相应领域专家完成专业复核。"
      };
    });
    Object.keys(draft.placements).forEach(pathText => {
      const path = pathText.split("/");
      const id = "placement." + stationId + "." + path.join(".");
      legacyPlacements[id] = {
        id,
        kind: "concept",
        stationId,
        legacyPath: path,
        legacyRoute: "#/s/" + stationId + "/" + path.join("/"),
        conceptId: draft.placements[pathText],
        status: "pilot"
      };
    });
    const sourceIds = Array.from(new Set(draft.concepts.flatMap(item => item.sourceIds || [])));
    stationProfiles[stationId] = {
      version: "V4",
      status: "sample",
      focus: draft.focus,
      learningObjectives: draft.learningObjectives,
      sourceIds,
      tldr: draft.tldr,
      intro: draft.intro,
      lastReviewed: CONTENT_AS_OF,
      nextReview: "2026-10-10"
    };
  });

  const relations = {
    "rel.memory.constrains-model": { fromConceptId: "hw.gpu.memory-capacity", type: "constrains", toConceptId: "hw.system.multi-gpu-node" },
    "rel.bandwidth.constrains-throughput": { fromConceptId: "hw.gpu.memory-bandwidth", type: "constrains", toConceptId: "hw.gpu.execution-model" },
    "rel.nvlink.connects-node": { fromConceptId: "hw.interconnect.nvlink-nvswitch", type: "enables", toConceptId: "hw.system.multi-gpu-node" },
    "rel.cpu.feeds-gpu": { fromConceptId: "hw.system.cpu-numa", type: "enables", toConceptId: "hw.gpu.execution-model" },
    "rel.storage.feeds-gpu": { fromConceptId: "hw.system.memory-storage", type: "enables", toConceptId: "hw.gpu.execution-model" },
    "rel.node-cooled-by-facility": { fromConceptId: "hw.system.node-cooling", type: "part_of", toConceptId: "facility.cooling.heat-chain" },
    "rel.node-powered-by-facility": { fromConceptId: "hw.system.power-redundancy", type: "part_of", toConceptId: "facility.power.resilience" },
    "rel.pue-measures-facility": { fromConceptId: "facility.sustainability.metrics", type: "measured_by", toConceptId: "facility.cooling.heat-chain" },
    "rel.liquid-extends-node-cooling": { fromConceptId: "facility.liquid.transition", type: "implemented_by", toConceptId: "hw.system.node-cooling" },
    "rel.rack-contains-system": { fromConceptId: "facility.rack.capacity-envelope", type: "constrains", toConceptId: "hw.system.rack-scale-domain" }
  };

  const assessments = {
    gpu: [
      {
        kind: "诊断题",
        question: "某推理任务 Tensor Core 活跃度不高、DRAM 活跃度持续很高，优先怀疑什么？",
        options: ["显存带宽或访存模式", "消防系统", "机柜承重"],
        answer: 0,
        explanation: "这组信号更像内存侧瓶颈，应继续检查有效带宽、缓存命中和访问模式。"
      },
      {
        kind: "决策题",
        question: "评估 70B 模型能否部署在单卡时，除了权重还必须优先计入什么？",
        options: ["机房 PUE", "KV Cache 与运行时工作区", "网卡端口颜色"],
        answer: 1,
        explanation: "推理显存不仅放权重，还包括 KV Cache、临时工作区和运行时余量。"
      },
      {
        kind: "判断题",
        question: "关于低精度格式，哪项最准确？",
        options: ["INT4 一定比 FP8 快 2 倍", "位宽越低质量一定不变", "必须同时验证质量、算子支持与端到端性能"],
        answer: 2,
        explanation: "位宽只是一个变量，真实收益还受硬件、kernel、校准、模型和瓶颈影响。"
      },
      {
        kind: "口径题",
        question: "同一段中文在不同模型中 Token 数可能不同，主要因为？",
        options: ["分词器不同", "GPU 风扇不同", "机房温度不同"],
        answer: 0,
        explanation: "Token 是具体分词器产生的序列单位，不能固定换算成中文字数。"
      }
    ],
    server: [
      {
        kind: "拓扑题",
        question: "GPU 与 NIC 分属不同 CPU root complex 时，最可能带来什么？",
        options: ["机柜自动降温", "数据路径跳数和延迟增加", "显存自动合并"],
        answer: 1,
        explanation: "跨 root complex 或跨 NUMA 会增加数据路径复杂度，需用拓扑和实测验证。"
      },
      {
        kind: "判断题",
        question: "NVLink/NVSwitch 与 PCIe 的关系，哪项更准确？",
        options: ["NVLink 已完全取代 PCIe", "PCIe 只负责供电", "二者承担不同路径并相互补充"],
        answer: 2,
        explanation: "NVLink 服务 GPU scale-up 通信，PCIe 仍承担枚举和通用 I/O。"
      },
      {
        kind: "可靠性题",
        question: "看到服务器有多个 PSU，下一步最重要的验证是什么？",
        options: ["故障状态、当前负载和上游接线", "机箱颜色", "Token 价格"],
        answer: 0,
        explanation: "模块数量不能直接推出容错结果，必须结合机型、负载与实际供电路径。"
      },
      {
        kind: "架构题",
        question: "机架级 NVLink 域可以替代跨机架网络吗？",
        options: ["总是可以", "不可以；scale-up 与 scale-out 边界不同", "只要显存足够就可以"],
        answer: 1,
        explanation: "域内 NVLink 与跨域 InfiniBand/以太网承担不同层次的通信。"
      }
    ],
    dc: [
      {
        kind: "计算题",
        question: "PUE 为 1.2、IT 负载为 10 MW 时，设施总功率约为？",
        options: ["8 MW", "10 MW", "12 MW"],
        answer: 2,
        explanation: "PUE＝总设施能耗÷IT 能耗，因此总功率约为 1.2×10＝12 MW。"
      },
      {
        kind: "边界题",
        question: "哪项最能决定一柜能放多少台服务器？",
        options: ["只看 U 位", "功率、热、重量、连接和维护约束的最小值", "只看地板颜色"],
        answer: 1,
        explanation: "容量包络由多项约束共同决定，先触顶的一项限制装机数。"
      },
      {
        kind: "安全题",
        question: "关于机房消防，哪项最准确？",
        options: ["全球都禁止喷水", "只要装洁净气体就不需要其他系统", "按当地规范、风险和主管机关要求组合设计"],
        answer: 2,
        explanation: "消防是高风险工程问题，不能用单一全球规则替代项目设计。"
      },
      {
        kind: "决策题",
        question: "液冷方案评估还必须保留哪项检查？",
        options: ["未被液体带走的余热、露点、流量与故障余量", "只看 GPU 型号", "只看年度 PUE"],
        answer: 0,
        explanation: "液冷是一整条热传递链，剩余空气热负荷与回路可靠性都必须校核。"
      }
    ]
  };

  window.CONTENT_V4 = {
    meta: {
      schemaVersion: "4.0.0",
      version: "4.0.0-pilot.1",
      datasetVersion: "2026.07.12.1",
      locale: "zh-CN",
      contentAsOf: CONTENT_AS_OF,
      migratedStations: ["gpu", "server", "dc"],
      status: "pilot"
    },
    policies: {
      defaultDepth: "l1",
      allowedRelationTypes: ["part_of", "prerequisite_for", "enables", "constrains", "measured_by", "implemented_by", "mitigates", "contrasts_with"],
      volatilityReviewDays: { stable: 730, slow: 365, fast: 90 }
    },
    concepts,
    claims,
    sources,
    relations,
    reviews,
    legacyPlacements,
    stationProfiles,
    assessments
  };
}());
