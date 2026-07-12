/* 算力之旅 V4 · 内容治理层
 * 规范内容与页面位置分离：concept / claim / source / relation / review / legacyPlacement。
 * 全站 10 站已迁移；旧站点 ID、节点 ID 与 Hash 路由保持不变。
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
    ),
    "src.nvidia.nccl": source(
      "NCCL User Guide — Collective Operations",
      "NVIDIA",
      "官方文档",
      "https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/usage/collectives.html",
      "",
      "AllReduce/AllGather/ReduceScatter/Broadcast/All-to-All 语义与等价关系"
    ),
    "src.nvidia.nccl-overview": source(
      "NCCL User Guide — Overview",
      "NVIDIA",
      "官方文档",
      "https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/overview.html",
      "",
      "集合通信库在多卡多机训练中的角色与拓扑感知"
    ),
    "src.nvidia.net-topology": source(
      "HGX AI Factory — Networking Physical Topologies",
      "NVIDIA",
      "参考架构",
      "https://docs.nvidia.com/enterprise-reference-architectures/hgx-ai-factory/latest/networking-physical-topologies.html",
      "",
      "rail-optimized、fat-tree、Scalable Unit 与计算/存储/带外分网"
    ),
    "src.uec.spec": source(
      "Ultra Ethernet Consortium Launches Specification 1.0",
      "Ultra Ethernet Consortium",
      "标准组织",
      "https://ultraethernet.org/ultra-ethernet-consortium-uec-launches-specification-1-0-transforming-ethernet-for-ai-and-hpc-at-scale/",
      "2025-06-11",
      "面向 AI/HPC 的以太网 RDMA、拥塞控制与传输（UET）"
    ),
    "src.nvidia.gds": source(
      "GPUDirect Storage Overview Guide",
      "NVIDIA",
      "官方文档",
      "https://docs.nvidia.com/gpudirect-storage/overview-guide/index.html",
      "",
      "存储与 GPU 显存间 DMA 直连，绕过 CPU bounce buffer"
    ),
    "src.pytorch.dcp": source(
      "torch.distributed.checkpoint (DCP)",
      "PyTorch",
      "官方文档",
      "https://docs.pytorch.org/docs/stable/distributed.checkpoint.html",
      "",
      "分布式/异步 Checkpoint、完整分片状态的保存与加载"
    ),
    "src.pytorch.pinmem": source(
      "A guide on good usage of non_blocking and pin_memory()",
      "PyTorch",
      "官方文档",
      "https://docs.pytorch.org/tutorials/intermediate/pinmem_nonblock.html",
      "",
      "pinned memory、非阻塞 H2D 传输与数据加载重叠"
    ),
    "src.rag.paper": source(
      "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks",
      "Lewis 等（NeurIPS 2020）",
      "同行评审论文",
      "https://arxiv.org/abs/2005.11401",
      "2020-05-22",
      "参数化记忆 + 外部非参数化检索的生成范式"
    ),
    "src.nvidia.gpu-operator": source(
      "About the NVIDIA GPU Operator",
      "NVIDIA",
      "官方文档",
      "https://docs.nvidia.com/datacenter/cloud-native/gpu-operator/latest/index.html",
      "",
      "自动管理驱动、容器工具包、设备插件、DCGM 与节点生命周期"
    ),
    "src.k8s.dra": source(
      "Kubernetes — Dynamic Resource Allocation",
      "Kubernetes",
      "官方文档",
      "https://kubernetes.io/docs/concepts/scheduling-eviction/dynamic-resource-allocation/",
      "",
      "ResourceClaim/DeviceClass 结构化设备请求、MIG 分区与共享"
    ),
    "src.kueue": source(
      "Kueue — Kubernetes-native Job Queueing",
      "Kubernetes SIGs",
      "开源项目文档",
      "https://kueue.sigs.k8s.io/docs/",
      "",
      "作业排队、配额、公平共享、抢占与全有或全无 gang admission"
    ),
    "src.nvidia.mig": source(
      "NVIDIA Multi-Instance GPU (MIG) User Guide",
      "NVIDIA",
      "官方文档",
      "https://docs.nvidia.com/datacenter/tesla/mig-user-guide/latest/",
      "",
      "把 GPU 硬件切成有隔离的实例，各有独立算力与显存"
    ),
    "src.nvidia.mps": source(
      "CUDA Multi-Process Service (MPS)",
      "NVIDIA",
      "官方文档",
      "https://docs.nvidia.com/deploy/mps/index.html",
      "",
      "多进程并发共享同一 GPU；隔离弱于 MIG，可与 MIG 组合"
    ),
    "src.slurm": source(
      "Slurm Workload Manager Documentation",
      "SchedMD",
      "开源项目文档",
      "https://slurm.schedmd.com/documentation.html",
      "",
      "HPC 批调度：队列、配额、公平共享、抢占与 GRES/TRES"
    ),
    "src.otel": source(
      "OpenTelemetry Documentation",
      "OpenTelemetry (CNCF)",
      "开源项目文档",
      "https://opentelemetry.io/docs/",
      "",
      "厂商中立的 metrics/logs/traces 采集与语义约定"
    ),
    "src.vllm": source(
      "vLLM Documentation",
      "vLLM",
      "开源项目文档",
      "https://docs.vllm.ai/en/latest/",
      "",
      "PagedAttention、连续批处理、前缀缓存、Chunked Prefill 与服务"
    ),
    "src.pytorch.fsdp": source(
      "Getting Started with Fully Sharded Data Parallel (FSDP2)",
      "PyTorch",
      "官方文档",
      "https://docs.pytorch.org/tutorials/intermediate/FSDP_tutorial.html",
      "",
      "参数/梯度/优化器分片与多维并行组合"
    ),
    "src.pytorch.dtensor": source(
      "torch.distributed.tensor (DTensor / DeviceMesh)",
      "PyTorch",
      "官方文档",
      "https://docs.pytorch.org/docs/stable/distributed.tensor.html",
      "",
      "DeviceMesh 表达拓扑、DTensor 表达分片（SPMD）"
    ),
    "src.paper.specdec": source(
      "Fast Inference from Transformers via Speculative Decoding",
      "Leviathan 等（ICML 2023）",
      "同行评审论文",
      "https://arxiv.org/abs/2211.17192",
      "2022-11-30",
      "小模型草稿 + 大模型校验，输出分布不变的加速"
    ),
    "src.paper.moe": source(
      "Switch Transformers: Scaling to Trillion Parameter Models",
      "Fedus 等（JMLR 2022）",
      "同行评审论文",
      "https://arxiv.org/abs/2101.03961",
      "2021-01-11",
      "稀疏专家路由：每 token 只激活部分专家"
    ),
    "src.paper.instructgpt": source(
      "Training language models to follow instructions with human feedback",
      "Ouyang 等（NeurIPS 2022）",
      "同行评审论文",
      "https://arxiv.org/abs/2203.02155",
      "2022-03-04",
      "RLHF：用人类偏好对齐模型行为（InstructGPT）"
    ),
    "src.nist.cloud": source(
      "NIST SP 800-145 — The NIST Definition of Cloud Computing",
      "NIST",
      "政府标准",
      "https://csrc.nist.gov/pubs/sp/800/145/final",
      "2011-09-28",
      "IaaS/PaaS/SaaS 与公有/私有/社区/混合部署模型的标准定义"
    ),
    "src.finops.framework": source(
      "FinOps Framework",
      "FinOps Foundation (Linux Foundation)",
      "标准组织",
      "https://www.finops.org/framework/",
      "",
      "FinOps 能力、角色与 FOCUS 成本用量口径"
    ),
    "src.finops.unit-econ": source(
      "FinOps Framework — Unit Economics",
      "FinOps Foundation",
      "标准组织",
      "https://www.finops.org/framework/capabilities/unit-economics/",
      "",
      "把技术支出与业务价值关联的单位成本口径"
    ),
    "src.google.sre-slo": source(
      "Google SRE Workbook — Implementing SLOs",
      "Google",
      "工程实践指南",
      "https://sre.google/workbook/implementing-slos/",
      "",
      "SLI/SLO/SLA 与 Error Budget 的定义与实现"
    ),
    "src.google.sre-alert": source(
      "Google SRE Workbook — Alerting on SLOs",
      "Google",
      "工程实践指南",
      "https://sre.google/workbook/alerting-on-slos/",
      "",
      "多窗口多燃尽率（burn rate）告警策略"
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
    },
    "claim.allreduce.equivalence": {
      value: "AllReduce ≡ ReduceScatter + AllGather",
      context: "NCCL 文档给出的等价关系：Reduce+Broadcast 或 ReduceScatter+AllGather 都等价于 AllReduce，实现选择影响带宽与延迟。",
      asOf: "稳定定义",
      maturity: "集合通信语义",
      sourceIds: ["src.nvidia.nccl"]
    },
    "claim.uec.spec1": {
      value: "UEC 规范 1.0（2025-06）",
      context: "Ultra Ethernet 1.0 面向 AI/HPC，引入以太网原生 RDMA、拥塞控制与 UET 传输；属新发布规范，落地能力需按产品与实测验证，勿当成已普遍部署的稳定生产结论。",
      asOf: "2025-06-11",
      maturity: "已发布规范",
      sourceIds: ["src.uec.spec"]
    },
    "claim.rail.scalable-unit": {
      value: "rail-optimized：每张 NIC 接不同 leaf",
      context: "参考架构把一台 GPU 服务器的多张 NIC 分别接到同一 Scalable Unit 内不同 leaf 交换机，使 rail 对齐 NVLink 域、减少跨交换机跳数；错误布线会破坏 rail 局部性。",
      asOf: CONTENT_AS_OF,
      maturity: "参考架构",
      sourceIds: ["src.nvidia.net-topology"]
    },
    "claim.roce.lossless-pillars": {
      value: "RoCEv2 无损常靠 PFC + ECN + DCQCN",
      context: "以太网承载 RDMA 时常用 PFC（链路级暂停）+ ECN（标记）+ DCQCN（端到端限速）组合；PFC 配置不当会引发 pause 风暴与队头阻塞，需按厂商与实测调参。",
      asOf: CONTENT_AS_OF,
      maturity: "工程方法",
      sourceIds: ["src.uec.spec", "src.nvidia.net-topology"]
    },
    "claim.gds.direct-path": {
      value: "GDS：存储↔GPU 显存 DMA 直连",
      context: "GPUDirect Storage 在存储（NVMe/NVMe-oF）与 GPU 显存间建立 DMA 直接路径，绕过 CPU bounce buffer，降低 CPU 负载与延迟；能否用取决于文件系统、驱动与硬件支持。",
      asOf: CONTENT_AS_OF,
      maturity: "工程方法",
      sourceIds: ["src.nvidia.gds"]
    },
    "claim.dcp.async-cost": {
      value: "异步 Checkpoint 以 CPU 内存换训练不停顿",
      context: "PyTorch DCP 异步保存先把状态拷到 CPU 缓冲再后台落盘，CPU 内存占用约按 每 rank 存档大小 × rank 数 增长；用来避免训练关键路径被写盘阻塞。",
      asOf: CONTENT_AS_OF,
      maturity: "工程方法",
      sourceIds: ["src.pytorch.dcp"]
    },
    "claim.checkpoint.full-state": {
      value: "正确续训需保存完整分片状态",
      context: "训练存档不止权重：还包括优化器状态、（必要的）梯度、学习率与调度、RNG 种子和数据加载进度等；缺一项都可能无法精确续训。",
      asOf: "工程共识",
      maturity: "工程方法",
      sourceIds: ["src.pytorch.dcp"]
    },
    "claim.rag.definition": {
      value: "RAG = 参数化记忆 + 外部检索",
      context: "RAG（Lewis 等，2020）把模型权重里的参数化知识与外部可检索的非参数化知识结合，用于知识密集任务；效果取决于切块、检索、重排与评测，不是接个向量库就万事大吉。",
      asOf: "2020-05-22",
      maturity: "方法（2020）",
      sourceIds: ["src.rag.paper"]
    },
    "claim.gpu-operator.manages": {
      value: "GPU Operator 自动管驱动/工具包/设备插件/DCGM",
      context: "NVIDIA GPU Operator 用 operator 框架自动部署并管理驱动、容器工具包、K8s 设备插件、节点标注与 DCGM 监控，并负责节点生命周期（装好、验证、再允许调度）。",
      asOf: CONTENT_AS_OF,
      maturity: "工程方法",
      sourceIds: ["src.nvidia.gpu-operator"]
    },
    "claim.dra.status": {
      value: "K8s DRA 已随版本稳定并默认开启",
      context: "Dynamic Resource Allocation 用 ResourceClaim/DeviceClass 表达结构化设备需求，支持 MIG 分区与共享；其稳定性随 Kubernetes 版本推进，具体以目标集群版本为准。",
      asOf: CONTENT_AS_OF,
      maturity: "已发布特性",
      sourceIds: ["src.k8s.dra"]
    },
    "claim.kueue.gang": {
      value: "Kueue 以“全有或全无”做 gang admission",
      context: "Kueue 作为准入控制器在调度前管理队列与配额，对作业按 all-or-nothing 准入，避免分布式作业只占到部分卡而死锁；并支持公平共享、抢占与 ResourceFlavor。",
      asOf: CONTENT_AS_OF,
      maturity: "工程方法",
      sourceIds: ["src.kueue"]
    },
    "claim.mig.vs.mps": {
      value: "MIG 是硬件隔离切分，MPS 是并发共享",
      context: "MIG 把 GPU 切成有独立算力与显存的隔离实例；MPS 让多进程并发共享同一 GPU，隔离更弱但利用率更高；两者可组合，选择取决于隔离与利用率的权衡。",
      asOf: CONTENT_AS_OF,
      maturity: "工程方法",
      sourceIds: ["src.nvidia.mig", "src.nvidia.mps"]
    },
    "claim.specdec.speedup": {
      value: "投机解码约 2–3× 且输出分布不变",
      context: "Leviathan 等在 T5-XXL 上报告约 2×–3× 加速、且与直接解码输出分布一致；实际收益随草稿模型质量、接受率与负载变化。",
      asOf: "2023",
      maturity: "方法（2023）",
      sourceIds: ["src.paper.specdec"]
    },
    "claim.paged-kv.blocks": {
      value: "PagedAttention 分块管理 KV、消除碎片",
      context: "vLLM 把每个请求的 KV 切成定长块按需从全局池分配，像虚拟内存一样消除碎片、提升显存利用；块大小等参数按实现与负载调。",
      asOf: CONTENT_AS_OF,
      maturity: "工程方法",
      sourceIds: ["src.vllm"]
    },
    "claim.prefix-cache.gain": {
      value: "前缀复用可提升共享前缀吞吐",
      context: "vLLM 前缀缓存复用系统提示/少样本等共享前缀的 KV；共享前缀场景下吞吐可再明显提升，具体幅度取决于前缀占比与命中率，需按实际负载实测，不宜引用固定百分比。",
      asOf: CONTENT_AS_OF,
      maturity: "工程方法",
      sourceIds: ["src.vllm"]
    },
    "claim.fsdp2.dtensor": {
      value: "FSDP2 用 DeviceMesh/DTensor 表达分片",
      context: "PyTorch FSDP2 以 DTensor 表示分片参数、DeviceMesh 描述设备拓扑，按 SPMD 组合数据/张量等多维并行；global batch 要按 DP×梯度累积×micro-batch 正确计算。",
      asOf: CONTENT_AS_OF,
      maturity: "工程方法",
      sourceIds: ["src.pytorch.fsdp", "src.pytorch.dtensor"]
    },
    "claim.moe.sparse": {
      value: "MoE 每 token 只激活部分专家",
      context: "Switch Transformers 等用路由器为每 token 选少数专家（稀疏激活），总参数量大但单 token 激活参数少；工程上要处理负载均衡与专家并行通信。",
      asOf: "2021",
      maturity: "架构（2021）",
      sourceIds: ["src.paper.moe"]
    },
    "claim.rlhf.instructgpt": {
      value: "RLHF 用人类偏好对齐（InstructGPT）",
      context: "InstructGPT（Ouyang 等，2022）用人类偏好训练奖励模型再做强化学习，让模型更好地遵循指令；DPO 等方法可绕过显式奖励模型。",
      asOf: "2022",
      maturity: "方法（2022）",
      sourceIds: ["src.paper.instructgpt"]
    },
    "claim.cloud.models": {
      value: "NIST：3 服务模型 + 4 部署模型",
      context: "NIST SP 800-145 定义 IaaS/PaaS/SaaS 三种服务模型与公有/私有/社区/混合四种部署模型；专有云、自建、托管是行业对这些模型的落地叫法。",
      asOf: "2011-09",
      maturity: "标准定义",
      sourceIds: ["src.nist.cloud"]
    },
    "claim.error-budget": {
      value: "Error Budget = 100% − SLO",
      context: "SLO 是内部可靠性目标、SLA 是带罚则的对外承诺；错误预算是允许的不可靠额度，burn rate 是相对 SLO 消耗预算的速度。",
      asOf: CONTENT_AS_OF,
      maturity: "工程方法",
      sourceIds: ["src.google.sre-slo"]
    },
    "claim.burn-rate.page": {
      value: "高 burn rate 触发分页告警（示例：1h 窗 >14.4）",
      context: "Google SRE 推荐多窗口多燃尽率告警：对 99.9% SLO 的示例参数是 1 小时窗 burn rate>14.4（约 2% 预算）、6 小时窗>6（约 5% 预算）触发分页；具体阈值按 SLO 与流量调整。",
      asOf: CONTENT_AS_OF,
      maturity: "工程方法（示例）",
      sourceIds: ["src.google.sre-alert"]
    },
    "claim.unit-econ.cost-success": {
      value: "要看每有效结果成本，而非只看每 Token 成本",
      context: "FinOps 单位经济学把技术支出与业务价值关联；cost/token 变好不代表 cost/success 变好——重试、低质量输出会让“每个有效结果”更贵。",
      asOf: CONTENT_AS_OF,
      maturity: "口径",
      sourceIds: ["src.finops.unit-econ"]
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
    },

    network: {
      focus: "让上千台机器像一台机器：把通信瓶颈、拓扑与拥塞讲清楚",
      learningObjectives: [
        "区分 scale-up（机内 NVLink 域）与 scale-out（跨机 RDMA 网络）。",
        "把并行策略的通信量映射到 AllReduce/AllGather/ReduceScatter/All-to-All。",
        "识别慢节点、丢包和跨机架长路径造成的同步瓶颈。",
        "按 IB/RoCE/UEC、fat-tree/rail 与 PFC/ECN 做有据可查的网络取舍。"
      ],
      tldr: "一句话看懂：集群性能由跨机通信决定——计算网、拓扑与拥塞控制一起决定这堆卡是军团还是散兵。",
      intro: "大模型一台机器装不下、也训不动，要让成百上千台机器像一台机器协同。这一站把网络拆成三件事：走什么网（计算/存储/带外）、连成什么形状（fat-tree/rail），以及怎么不抖动（集合通信、拥塞控制与慢节点）。",
      concepts: [
        concept({
          id: "net.compute-fabric",
          title: "计算网 · 参数面与 RDMA",
          aliases: ["参数面", "compute fabric", "RDMA fabric", "GPUDirect RDMA"],
          tags: ["计算网", "RDMA", "GPUDirect", "scale-out"],
          l0: "训练时上千张卡每一步都要交换梯度和参数，专门的“计算网”用 RDMA 让数据绕过 CPU 直达对端 GPU；它一慢，全体一起等。",
          l1: "机内 NVLink 域（scale-up）和跨机网络（scale-out）是两层不同的通信；跨机走 RDMA，GPUDirect RDMA 让 NIC 直接读写 GPU 显存。真正决定性能的是有效带宽、时延和抖动，而不是标称线速。",
          decision: "先量清楚每步通信量和通信/计算重叠比例，再按规模、预算与生态选传输和拓扑；计算网必须和存储网、带外网分开，避免互相抢占。",
          tradeoffs: ["更高线速抬高上限，但抖动和拓扑不对齐会吃掉收益", "协议卸载省 CPU，却增加调优与排障复杂度", "更大消息提升带宽利用，却可能推高同步点延迟"],
          labTitle: "通信/计算重叠分析",
          lab: "用一段分布式训练测 all-reduce 的时间占比、总线时延分布，并确认 GPUDirect 是否生效，判断瓶颈在计算还是通信。",
          success: "能指出瓶颈来源，并给出可验证的重叠或拓扑优化。",
          misconceptions: [
            ["买了高线速网卡，通信就不会是瓶颈", "抖动、拓扑对齐、协议开销和重叠策略共同决定有效通信，标称线速只是上限。"],
            ["网络只是把机器连起来，和 GPU 利用率无关", "同步训练下网络一慢，成百上千张卡集体空转，直接压低利用率。"]
          ],
          sourceIds: ["src.nvidia.gpudirect", "src.nvidia.nccl-overview"],
          owner: "网络与系统工程",
          risk: "high",
          cadenceDays: 90
        }),
        concept({
          id: "net.collective-comms",
          title: "集合通信与 NCCL",
          aliases: ["AllReduce", "AllGather", "ReduceScatter", "All-to-All", "NCCL"],
          tags: ["集合通信", "AllReduce", "NCCL", "通信库"],
          l0: "多卡把各自结果“汇总再分发”靠集合通信原语；AllReduce 最常见，NCCL 这类库负责在具体拓扑上选算法。",
          l1: "常用原语：AllReduce（归约后人人拿到同一结果）、AllGather（各自数据拼给所有人）、ReduceScatter（归约后按 rank 分片）、All-to-All（各发各收，专家并行常用）。NCCL 文档指出 AllReduce 可由 ReduceScatter+AllGather 实现；ring 省带宽、tree/分层省延迟。",
          decision: "让通信库感知拓扑（rail 与 NVLink 域），按消息大小选 ring/tree/分层算法；小消息拼包、大消息与计算重叠，避免 All-to-All 在跨机上打爆带宽。",
          tradeoffs: ["ring 带宽最优，但延迟随规模上升", "tree/分层降延迟，却更依赖拓扑对齐", "通信与计算重叠提升吞吐，但增加实现复杂度"],
          labTitle: "集合通信基准",
          lab: "用 nccl-tests 扫不同消息大小下 AllReduce/AllGather/All-to-All 的 busbw 与延迟，对照 ring 与 tree 算法。",
          success: "能把某并行策略的通信量映射到具体原语，并解释算法选择。",
          misconceptions: [
            ["AllReduce 就是把数据发给一台机器求和再发回", "那是 Reduce+Broadcast；AllReduce 有 ring/tree 等实现，人人参与、无单点。"],
            ["加机器，通信就线性变快", "集合通信量随规模和算法变化，可能不降反升，必须实测。"]
          ],
          claimIds: ["claim.allreduce.equivalence"],
          sourceIds: ["src.nvidia.nccl", "src.nvidia.nccl-overview"],
          owner: "分布式训练工程",
          risk: "medium",
          cadenceDays: 180
        }),
        concept({
          id: "net.sync-straggler",
          title: "同步训练与木桶效应",
          aliases: ["木桶效应", "straggler", "慢节点", "bulk-synchronous"],
          tags: ["同步", "慢节点", "抖动", "尾延迟"],
          l0: "同步训练像团体跳绳，最慢的一个决定全队节奏；一台机器网络抖一下，成千张卡集体罚站。",
          l1: "每次集合通信都是一个同步点，整步时间约等于最慢参与者。慢节点可能来自掉速网卡、丢包重传、跨机架长路径、热降频或坏盘；诊断要看每步时间的尾部分布，而不是平均值。",
          decision: "建立“每步时间 + 慢节点定位”的可观测性；对抖动近乎零容忍——隔离坏节点、对齐拓扑、控制拥塞，必要时用备机顶替。",
          tradeoffs: ["异步或梯度压缩降低同步代价，却可能影响收敛与可复现", "更严格的健康门槛提高稳定性，但降低可用机数"],
          labTitle: "慢节点注入与定位",
          lab: "在一次同步训练里给单节点注入延迟或丢包，观察整步时间尾部变化，并用 per-rank 计时定位。",
          success: "能仅凭每步时间分布锁定慢节点并给出处置。",
          misconceptions: [
            ["平均延迟不高就没问题", "同步训练受尾延迟支配，p99 抖动比平均更关键。"],
            ["慢一定是网络的锅", "慢节点也可能来自热降频、坏盘或 CPU 供给，需要联合排查。"]
          ],
          sourceIds: ["src.nvidia.nccl-overview", "src.nvidia.net-topology"],
          owner: "训练可靠性工程",
          risk: "high",
          cadenceDays: 90
        }),
        concept({
          id: "net.transport-choice",
          title: "IB / RoCEv2 / 以太网（含 UEC）",
          aliases: ["InfiniBand", "RoCEv2", "Ethernet", "Ultra Ethernet", "UEC"],
          tags: ["InfiniBand", "RoCE", "以太网", "UEC", "传输选择"],
          l0: "跨机高速网有几条路线：InfiniBand（专建、性能与生态成熟）、RoCEv2（在以太网上跑 RDMA、开放但要调无损）、以及新发布的 Ultra Ethernet。",
          l1: "IB 端到端一体，拥塞和无损较省心但相对封闭；RoCEv2 复用以太网、开放且成本可控，但要靠 PFC/ECN/DCQCN 做“无损”，配错会 pause 风暴。UEC 1.0（2025-06）把以太网 RDMA、拥塞控制与新传输 UET 标准化，属新发布规范，落地能力需按产品与实测判断。",
          decision: "按团队能力、生态、成本和规模选路线；无论哪条，都要在目标规模上实测无损与拥塞行为，别把“标称支持”当“已验证生产”。",
          tradeoffs: ["IB 省调优但更贵、相对封闭", "RoCE 便宜开放，但调优与排障门槛高", "UEC 前景好，但成熟度需谨慎标注、不宜当稳定生产结论"],
          labTitle: "传输选型评分卡",
          lab: "对候选传输在相同规模测 busbw、尾延迟、丢包/重传与拥塞恢复，形成性能/成本/生态/成熟度评分。",
          success: "结论可追溯到实测与约束，而不是厂商标签或规范新旧。",
          misconceptions: [
            ["RoCE 只要买支持的网卡就等于无损", "无损依赖 PFC/ECN/DCQCN 的正确配置与全链路一致，需要系统级调优。"],
            ["UEC 1.0 发布，就代表可大规模稳定生产", "它是新发布规范，能力要按具体产品与实测验证。"]
          ],
          claimIds: ["claim.uec.spec1", "claim.roce.lossless-pillars"],
          sourceIds: ["src.uec.spec", "src.nvidia.net-topology", "src.nvidia.gpudirect"],
          owner: "网络架构",
          risk: "high",
          cadenceDays: 90
        }),
        concept({
          id: "net.storage-fabric",
          title: "存储网与流量隔离",
          aliases: ["存储网", "storage fabric", "流量隔离"],
          tags: ["存储网", "隔离", "带宽", "QoS"],
          l0: "把数据集喂给 GPU、把存档写回仓库的流量走“存储网”，和计算网分开修，别让运粮车挤占作战通道。",
          l1: "存储流量的模式（大吞吐顺序读 vs 小 IO 元数据 vs 突发 checkpoint 写）与训练同步流量不同；混在一张网上会互相抖动。用物理分网或 QoS/优先级隔离，保证 checkpoint 写入不拖慢 all-reduce。",
          decision: "评估峰值读（数据加载）与突发写（checkpoint）对带宽的冲击，决定物理分网还是逻辑隔离，并把存储网纳入同一套拓扑与拥塞治理。",
          tradeoffs: ["物理分网隔离彻底，但成本更高", "共网加 QoS 省钱，却调优复杂、故障域耦合"],
          labTitle: "混合流量干扰实验",
          lab: "在计算网繁忙时注入一次大 checkpoint 写，观察 all-reduce 尾延迟变化，验证隔离策略是否有效。",
          success: "能量化存储突发对训练同步的影响，并给出隔离方案。",
          misconceptions: [
            ["数据都是网，混在一起无所谓", "存储与同步流量特性不同，混跑会互相抖动、拉长尾延迟。"]
          ],
          sourceIds: ["src.nvidia.net-topology"],
          owner: "存储与网络工程",
          risk: "medium",
          cadenceDays: 180
        }),
        concept({
          id: "net.oob-mgmt",
          title: "带外管理网",
          aliases: ["带外", "out-of-band", "BMC", "管理网"],
          tags: ["带外管理", "BMC", "控制面", "可维护性"],
          l0: "一张独立的小网专供运维远程管理设备——哪怕机器死机、业务网瘫痪，也能远程开关机、查故障；平时存在感低，出事救命。",
          l1: "带外网连 BMC 与管理口，与业务/计算网物理隔离，独立供电与路径。它承载健康采集、远程控制、固件升级与故障隔离；它的可用性直接决定“坏了能不能远程救回来”。",
          decision: "把带外网当作生命线单独设计冗余与安全边界；严格隔离其访问权限，避免它成为横向渗透入口。",
          tradeoffs: ["更强隔离提升安全与可救性，但增加布线与管理成本", "与业务网共用省钱，却可能在大故障时同归于尽"],
          labTitle: "带外恢复演练",
          lab: "断开业务网后，仅凭带外网完成一次远程隔离故障机、重启并做健康确认。",
          success: "能在业务网不可用时完成关键恢复动作。",
          misconceptions: [
            ["管理网平时没流量，可以和业务网合并", "出大故障时业务网往往先瘫，带外网独立才救得回来。"]
          ],
          sourceIds: ["src.nvidia.net-topology", "src.nvidia.dcgm"],
          owner: "平台与运维工程",
          risk: "medium",
          cadenceDays: 180
        }),
        concept({
          id: "net.topology-rail",
          title: "Spine-Leaf / fat-tree / rail-optimized",
          aliases: ["leaf-spine", "fat-tree", "rail-optimized", "拓扑感知放置"],
          tags: ["拓扑", "fat-tree", "rail", "无阻塞", "放置"],
          l0: "交换机摆成 leaf-spine/fat-tree，让任意两台服务器“几跳等宽”直达；rail-optimized 再把每张 GPU 的网口对齐到 NVLink 域，减少跨交换机跳数。",
          l1: "fat-tree 提供近无阻塞的对分带宽；rail-optimized 把一台服务器的多张 NIC 接到同一 Scalable Unit 内不同 leaf，使 rail 与 NVLink 域对齐。拓扑感知放置把同一并行组尽量放近，减少长路径与拥塞。",
          decision: "采购即定 Scalable Unit 与 rail 布线规范并逐条校验（miswire 会破坏 rail 局部性）；调度做拓扑感知放置，把通信密集组放在同 rail、同 leaf。",
          tradeoffs: ["满配 fat-tree 对分带宽高，但成本高", "提高收敛比降本，却在满载时更易拥塞", "拓扑感知放置提升性能，但增加调度复杂度"],
          labTitle: "拓扑对齐校验",
          lab: "用 nvidia-smi 拓扑与交换机布线核对 rail 对齐，故意错插一处，量化跨交换机跳数增加与 busbw 下降。",
          success: "能发现 rail miswire 并解释它如何拉低集合通信带宽。",
          misconceptions: [
            ["只要交换机够多，带宽就够", "收敛比、rail 对齐与放置决定有效对分带宽，堆交换机不等于无阻塞。"],
            ["放置随便，反正网络等宽", "跨机架、跨 rail 的长路径会显著增加时延与拥塞。"]
          ],
          claimIds: ["claim.rail.scalable-unit"],
          sourceIds: ["src.nvidia.net-topology"],
          owner: "网络架构",
          risk: "high",
          cadenceDays: 90
        }),
        concept({
          id: "net.congestion-optics",
          title: "拥塞控制、光模块与规模",
          aliases: ["PFC", "ECN", "DCQCN", "800G", "光模块", "拥塞扩散"],
          tags: ["拥塞控制", "PFC", "ECN", "光模块", "抖动"],
          l0: "大集群对“抖动”近乎零容忍：拥塞一冒头，同步训练全体受累。以太网用 PFC/ECN/DCQCN 压拥塞，光模块（如 800G）决定物理带宽与功耗。",
          l1: "带宽、时延、抖动、拥塞是四件不同的事。RoCEv2 无损常靠 PFC（链路暂停）+ ECN（标记）+ DCQCN（端到端限速）组合；PFC 配错会 pause 风暴、队头阻塞、拥塞向上游扩散。光模块与线缆决定端口速率和误码，是规模化的物理底座。",
          decision: "把拥塞治理当系统工程：全链路一致的 PFC/ECN 门限、按实测调 DCQCN，监控 pause 与 CNP、重传；光层留足功率与误码余量。",
          tradeoffs: ["激进 PFC 保无损，但易 pause 风暴", "偏 ECN 更平滑，却需要精调门限", "更高速光模块提升带宽，却抬升功耗与成本"],
          labTitle: "拥塞与 pause 风暴观察",
          lab: "制造 incast 拥塞，观察 ECN 标记、CNP、PFC pause 与重传，验证门限调整对尾延迟的作用。",
          success: "能区分 PFC 与 ECN 的作用，并解释 pause 风暴的成因。",
          misconceptions: [
            ["带宽够大就不会拥塞", "incast 与突发让瞬时需求超过端口，拥塞与抖动照样发生。"],
            ["PFC 打开就万事大吉", "PFC 过度触发会 pause 风暴、队头阻塞并向上游扩散，需要 ECN/DCQCN 配合。"]
          ],
          claimIds: ["claim.roce.lossless-pillars"],
          sourceIds: ["src.uec.spec", "src.nvidia.net-topology"],
          owner: "网络架构",
          risk: "high",
          cadenceDays: 90
        })
      ],
      placements: {
        "computenet": "net.compute-fabric",
        "computenet/bucket": "net.sync-straggler",
        "computenet/ibroce": "net.transport-choice",
        "storagenet": "net.storage-fabric",
        "mgmtnet": "net.oob-mgmt",
        "spineleaf": "net.topology-rail",
        "adv/collective": "net.collective-comms",
        "adv/optical": "net.congestion-optics"
      }
    },

    data: {
      focus: "别让几千张卡等着开饭：把数据流水线、存储供给、存档恢复与检索讲清楚",
      learningObjectives: [
        "为对象存储、并行文件系统、本地 NVMe 与缓存分清角色，识别存储侧瓶颈。",
        "用 prefetch、pinned memory 与直连路径避免 GPU 因等数据而饿着。",
        "按 RPO/RTO 设计 Checkpoint 策略，并靠恢复演练验证。",
        "把数据流水线、版本血缘、RAG 检索与数据治理连成一条链。"
      ],
      tldr: "一句话看懂：存储系统就干一件事——别让几千张卡等着开饭；同一套数据能力还支撑存档恢复与 RAG 检索。",
      intro: "训练像做饭：模型是厨师，算力是火力，数据是食材。这一站把数据讲成一条链：从流水线加工、分层存储、并行供给，到定期存档与故障恢复，再到 RAG 检索与数据治理。",
      concepts: [
        concept({
          id: "data.storage-tiers",
          title: "存储分层：对象 / 并行FS / 本地NVMe / 缓存",
          aliases: ["对象存储", "并行文件系统", "本地 NVMe", "缓存"],
          tags: ["存储分层", "对象存储", "NVMe", "缓存"],
          l0: "数据分层放：对象存储便宜能装当“粮仓”，并行文件系统高吞吐当“食堂”，本地 NVMe 和缓存管“最后一公里”；每层角色不同，别用一层顶所有。",
          l1: "对象存储容量大、单价低、时延一般，适合原始数据长期安家；训练前把热数据搬到并行文件系统或本地 NVMe。要同时看吞吐、IOPS、时延和元数据压力，四者瓶颈不同。GPUDirect Storage 让 NVMe/NVMe-oF 与 GPU 显存 DMA 直连、绕过 CPU。",
          decision: "按访问模式（大顺序读 vs 小随机 IO vs 元数据密集）为每层定位；用直连路径减少 CPU 中转，别让存储成为 GPU 的隐形瓶颈。",
          tradeoffs: ["更快的层更贵、容量更小", "缓存提速但引入一致性与命中率问题", "直连路径省 CPU，却依赖文件系统与硬件支持"],
          labTitle: "存储路径瓶颈定位",
          lab: "对同一数据集分别从对象存储、并行 FS 和本地 NVMe 跑数据加载，记录吞吐、IOPS、时延与 CPU 占用。",
          success: "能为不同访问模式选对存储层，并解释瓶颈来源。",
          misconceptions: [
            ["存储只要容量够就行", "吞吐、IOPS、时延和元数据压力才决定能不能喂饱 GPU。"],
            ["把所有数据都放最快的存储最省心", "热/冷分层是成本与性能的平衡，全上高速层既贵又浪费。"]
          ],
          claimIds: ["claim.gds.direct-path"],
          sourceIds: ["src.nvidia.gds"],
          owner: "存储工程",
          risk: "medium",
          cadenceDays: 180
        }),
        concept({
          id: "data.parallel-fs",
          title: "并行文件系统与 GPU 供给",
          aliases: ["并行文件系统", "PFS", "prefetch", "pinned memory", "GPU starvation"],
          tags: ["并行文件系统", "供给", "prefetch", "pinned memory"],
          l0: "训练一开饭，几千张卡同时来取餐，普通存储瞬间被挤爆；并行文件系统把数据切碎分散到很多台存储上，大家各取各的不排队。",
          l1: "并行 FS 提供聚合高吞吐与并发；配合数据加载的多 worker、prefetch 和 pinned memory（页锁定内存）做非阻塞 H2D 传输，让“取数据”和“算”重叠，避免 GPU starvation（卡在等数据）。",
          decision: "用 pinned memory 加合适的 prefetch 与 worker 数，让数据供给跑在计算前面；监控 GPU 是否在等数据，别只盯算力。",
          tradeoffs: ["更多 worker/prefetch 提升吞吐，却占更多 CPU 与内存", "pinned memory 加速传输，但页锁定内存有限、过量会拖慢系统"],
          labTitle: "GPU 供给饥饿排查",
          lab: "在训练里开关 pin_memory 与不同 prefetch 设置，观察 GPU 利用率、数据等待时间与 H2D 重叠。",
          success: "能判断 GPU 是否在等数据，并给出供给侧优化。",
          misconceptions: [
            ["GPU 利用率低就是卡不够快", "很多时候是数据供给跟不上，GPU 在等“上菜”。"],
            ["pin_memory 开着总是更快", "页锁定内存有限，滥用会挤占系统内存、适得其反。"]
          ],
          sourceIds: ["src.pytorch.pinmem", "src.nvidia.gds"],
          owner: "训练系统工程",
          risk: "high",
          cadenceDays: 180
        }),
        concept({
          id: "data.checkpoint-state",
          title: "Checkpoint：完整训练状态",
          aliases: ["Checkpoint", "Distributed Checkpoint", "DCP", "存档"],
          tags: ["Checkpoint", "分布式存档", "续训", "状态"],
          l0: "训练一跑几周，中途必须定期“存档”，故障后从最近存档继续；但要能精确续训，存的不只是权重。",
          l1: "完整状态包含权重、优化器状态、（必要时）梯度、学习率与调度、RNG 种子和数据加载进度。大模型分片用 Distributed Checkpoint（DCP）把各 rank 的分片一致地保存/加载，规模再大也能续。",
          decision: "先明确“保存哪些状态才能精确续训”，再用 DCP 做分片存档，并把存档纳入训练关键路径的性能预算。",
          tradeoffs: ["存更完整更稳，但更大更慢", "只存权重省空间，却可能无法精确续训"],
          labTitle: "续训状态拼图",
          lab: "故意只存权重后续训，观察优化器动量、学习率与数据顺序丢失带来的偏差，再补齐状态验证可续。",
          success: "能列出精确续训所需的完整状态并验证。",
          misconceptions: [
            ["Checkpoint 就是保存模型权重", "精确续训还需要优化器状态、RNG 和数据进度等。"],
            ["多卡存档随便存都能恢复", "分片状态要一致保存与加载，否则恢复会错位。"]
          ],
          claimIds: ["claim.checkpoint.full-state"],
          sourceIds: ["src.pytorch.dcp"],
          owner: "训练平台工程",
          risk: "high",
          cadenceDays: 90
        }),
        concept({
          id: "data.checkpoint-economics",
          title: "存档间隔、RPO/RTO 与恢复演练",
          aliases: ["RPO", "RTO", "存档间隔", "恢复演练", "异步 Checkpoint"],
          tags: ["RPO", "RTO", "存档策略", "恢复"],
          l0: "存档那一刻卡要停下等；存太勤浪费算力，存太疏一旦故障损失惨重——间隔是一门精打细算的平衡。",
          l1: "用 RPO（可容忍丢多少进度）和 RTO（可容忍多久恢复）反推存档间隔与介质。异步 Checkpoint 先拷到 CPU 再后台落盘，避免训练停顿，但按“每 rank 存档大小 × rank 数”抬高 CPU 内存。恢复能力要靠演练验证，不能只写在文档里。",
          decision: "由 RPO/RTO 定间隔，用异步存档降停顿；定期做“从存档恢复”演练，量化真实 RTO。",
          tradeoffs: ["更短间隔降 RPO，但更费算力与带宽", "异步降停顿，却吃 CPU 内存", "更快介质降 RTO，但更贵"],
          labTitle: "存档策略与恢复演练",
          lab: "设定目标 RPO/RTO，测同步与异步存档对训练吞吐的影响，并实测一次从存档恢复的耗时。",
          success: "能用 RPO/RTO 反推可行的存档策略并验证 RTO。",
          misconceptions: [
            ["存档越勤越安全", "过勤会显著浪费算力，要按 RPO/RTO 平衡。"],
            ["有 Checkpoint 就等于能恢复", "不演练的恢复能力，常在真出事时才发现不可用。"]
          ],
          claimIds: ["claim.dcp.async-cost"],
          sourceIds: ["src.pytorch.dcp"],
          owner: "训练可靠性工程",
          risk: "high",
          cadenceDays: 90
        }),
        concept({
          id: "data.pipeline-lineage",
          title: "数据流水线、版本与血缘",
          aliases: ["数据流水线", "去重", "Tokenize", "数据版本", "数据血缘"],
          tags: ["数据流水线", "清洗", "版本", "血缘"],
          l0: "原始数据不能直接喂模型：要采集、去重、清洗掉垃圾和敏感信息、Tokenize、分片，还要记版本和血缘——垃圾进，垃圾出。",
          l1: "流水线把原始数据变成可训练格式；数据版本让实验可复现，数据血缘让“这条数据从哪来、经过哪些处理”可追溯。数据质量常是模型质量的上限，问题往往出在数据而非模型。",
          decision: "把数据当代码管：版本化、可复现、可回滚；对清洗与去重设质量门槛，保留血缘以便审计与排错。",
          tradeoffs: ["更严的清洗提升质量，却增加成本与误删风险", "完整血缘利于追溯，但增加存储与工程负担"],
          labTitle: "数据质量与血缘核查",
          lab: "对一个数据集做去重与敏感信息清洗，记录前后分布变化，并生成一条可追溯的处理血缘。",
          success: "能把模型问题回溯到具体数据处理步骤。",
          misconceptions: [
            ["数据准备是杂活，模型才重要", "数据质量常是模型质量的上限，垃圾进垃圾出。"],
            ["清洗一次就永久有效", "数据会更新，版本与血缘才能保证可复现与可追溯。"]
          ],
          sourceIds: ["src.nist.physical"],
          owner: "数据工程",
          risk: "medium",
          cadenceDays: 180
        }),
        concept({
          id: "data.vector-rag",
          title: "向量数据库与 RAG 检索",
          aliases: ["向量数据库", "Embedding", "RAG", "检索", "重排"],
          tags: ["向量数据库", "RAG", "Embedding", "检索"],
          l0: "把知识切块、算成向量存进向量库，回答时先检索相关片段再让模型作答并给出引用——这就是 RAG。",
          l1: "RAG（Lewis 等，2020）把模型的参数化知识与外部可检索的非参数化知识结合。链路是：切块→Embedding→检索→重排→带引用生成→评测。每一环都影响效果，接个向量库不等于 RAG 做好了。",
          decision: "用检索质量（召回/精度）、答案带引用率和端到端评测来验收 RAG，而不是只看“有没有检索到”；切块与重排要按语料实测调。",
          tradeoffs: ["更大 top-k 提升召回，但抬高时延与噪声", "更强重排提升精度，却增加成本", "纯参数化省检索，却难更新知识与溯源"],
          labTitle: "RAG 检索质量评测",
          lab: "对同一问题集比较不同切块与 top-k 的召回、精度、答案引用率和时延。",
          success: "能用检索与端到端指标定位 RAG 短板并优化。",
          misconceptions: [
            ["接个向量库就等于有了 RAG", "切块、检索、重排、引用与评测每一环都决定效果。"],
            ["RAG 一定比微调好或更差", "二者解决不同问题，常需结合，要按任务实测。"]
          ],
          claimIds: ["claim.rag.definition"],
          sourceIds: ["src.rag.paper"],
          owner: "应用与检索工程",
          risk: "medium",
          cadenceDays: 180
        }),
        concept({
          id: "data.governance-privacy",
          title: "数据治理、敏感数据与生命周期",
          aliases: ["数据治理", "敏感数据", "数据生命周期", "合规"],
          tags: ["数据治理", "隐私", "合规", "生命周期"],
          l0: "数据要有规矩：谁能用、脱没脱敏、保存多久、能不能删——尤其敏感数据，治理不到位既有合规风险也有安全风险。",
          l1: "治理覆盖分类分级、访问控制、脱敏、保存与删除的生命周期，以及可审计的血缘。敏感数据（个人信息、受控信息等）要按适用法规与标准处理，边界随地域和行业不同。",
          decision: "先做数据分类分级，再按级别定访问、脱敏与留存策略；把治理内建到流水线而不是事后补，并保留审计证据。",
          tradeoffs: ["更强治理降合规与安全风险，但增加流程摩擦", "宽松策略更灵活，却可能踩线"],
          labTitle: "敏感数据处理核查",
          lab: "对一个含敏感字段的数据集做分级、脱敏与访问控制，并验证留存/删除策略可执行。",
          success: "能给出可审计的敏感数据处理与生命周期方案。",
          misconceptions: [
            ["脱敏一次就永久合规", "法规与数据都在变，治理是持续过程，不是一次性动作。"],
            ["治理是法务的事，和工程无关", "治理要内建进数据流水线与权限系统，工程是执行主体。"]
          ],
          sourceIds: ["src.nist.physical"],
          owner: "数据治理与安全",
          risk: "high",
          cadenceDays: 90
        })
      ],
      placements: {
        "datastore": "data.storage-tiers",
        "pfs": "data.parallel-fs",
        "checkpoint": "data.checkpoint-state",
        "checkpoint/ckptcost": "data.checkpoint-economics",
        "pipeline": "data.pipeline-lineage",
        "vectordb": "data.vector-rag",
        "adv/governance": "data.governance-privacy"
      }
    },

    platform: {
      focus: "把一堆铁疙瘩变成多团队能共用的一朵云：驱动、容器、调度、隔离与可观测",
      learningObjectives: [
        "理清固件/驱动/CUDA/容器/框架的兼容矩阵与 GPU Operator。",
        "区分 Slurm/K8s/Kueue/Ray 的角色，掌握 gang、拓扑感知、配额与抢占。",
        "用 MIG/MPS 与多租户隔离在共享集群里安全计量。",
        "把注册表、灰度回滚与统一可观测性接成 MLOps 闭环。"
      ],
      tldr: "一句话看懂：软件栈让一堆机器变成多团队能自助共用的一朵云——装得上、调得动、隔得开、看得见。",
      intro: "硬件就位只是毛坯房。这一站把裸机装修成平台：驱动与容器让卡能用，调度与隔离让几百人共用几千张卡，可观测与 MLOps 让它好用、可靠、可运营。",
      concepts: [
        concept({
          id: "platform.driver-firmware",
          title: "驱动、固件、CUDA 与 GPU Operator",
          aliases: ["驱动", "固件", "CUDA", "GPU Operator", "容器运行时"],
          tags: ["驱动", "CUDA", "GPU Operator", "节点生命周期"],
          l0: "操作系统出厂不认识 GPU；装好固件、驱动和 CUDA 运行时后它才“是一张卡”。在 K8s 上，GPU Operator 自动把这套装好、配好、管好。",
          l1: "驱动/固件/CUDA/容器运行时要版本匹配才能跑。GPU Operator 用 operator 框架自动管理驱动、容器工具包、设备插件、节点标注与 DCGM 监控，并负责节点生命周期（先装好并验证，再允许调度作业）。",
          decision: "用 GPU Operator 统一管理驱动与工具链版本，避免逐机手工装机产生漂移；升级前在兼容矩阵内验证。",
          tradeoffs: ["自动化省人工、降漂移，但多一层抽象与排障面", "固定版本更稳，却可能落后新特性"],
          labTitle: "驱动栈一致性核查",
          lab: "对比两台节点的驱动、CUDA、容器工具包版本，用 GPU Operator 收敛到同一基线并验证。",
          success: "能定位版本漂移并用 Operator 收敛。",
          misconceptions: [
            ["装个驱动 GPU 就能用了", "还需要容器工具包、设备插件与匹配的 CUDA，K8s 上更要节点生命周期管理。"]
          ],
          claimIds: ["claim.gpu-operator.manages"],
          sourceIds: ["src.nvidia.gpu-operator"],
          owner: "平台工程",
          risk: "medium",
          cadenceDays: 180
        }),
        concept({
          id: "platform.kernel-libs",
          title: "算子库与框架兼容矩阵",
          aliases: ["算子", "kernel", "cuDNN", "cuBLAS", "兼容矩阵"],
          tags: ["算子库", "兼容矩阵", "框架"],
          l0: "模型跑得快，靠底层算子库的高度优化实现；而框架、CUDA、驱动、算子库之间有一张“兼容矩阵”，版本错配就跑不起来。",
          l1: "算子（kernel）是具体计算的实现，算子库提供优化实现；框架 × CUDA × 驱动 × 算子库必须落在兼容矩阵内。融合算子减少访存，但增加实现与可移植成本。",
          decision: "把经过验证的兼容组合固化为基线镜像；升级任一层都要回归验证，别逐机随手升级。",
          tradeoffs: ["更新算子库可能提速，却可能破坏兼容", "融合算子提性能，但增加维护与移植成本"],
          labTitle: "兼容矩阵回归",
          lab: "在基线镜像上升级一个组件，跑回归用例，记录性能与兼容变化。",
          success: "能判断某次升级是否安全并可回滚。",
          misconceptions: [
            ["版本越新越好", "错配的新版本可能根本跑不起来，要落在兼容矩阵内。"]
          ],
          sourceIds: ["src.nvidia.gpu-operator", "src.nvidia.cuda"],
          owner: "平台工程",
          risk: "medium",
          cadenceDays: 180
        }),
        concept({
          id: "platform.container",
          title: "容器与运行时",
          aliases: ["容器", "镜像", "容器运行时", "NVIDIA Container Toolkit"],
          tags: ["容器", "运行时", "环境打包"],
          l0: "模型运行需要一大堆配套软件，版本差一点都跑不起来；容器把整套环境打包成标准“集装箱”，换机器原样能跑。",
          l1: "容器镜像固化用户态环境（框架、库、依赖）；容器运行时加 NVIDIA 容器工具包把 GPU 暴露进容器。内核态驱动仍在宿主机，需与镜像内 CUDA 兼容。",
          decision: "镜像固化可复现环境，宿主机只留驱动；用工具包挂 GPU，避免“在我机器上能跑”。",
          tradeoffs: ["镜像大而全更省事，却更臃肿", "精简镜像更轻，但依赖管理更费心"],
          labTitle: "跨节点可复现验证",
          lab: "同一镜像在不同节点运行同一作业，核对结果与依赖一致性。",
          success: "能保证环境跨机器可复现。",
          misconceptions: [
            ["容器里带了驱动就与宿主机无关", "内核态驱动在宿主机，镜像内 CUDA 要与之兼容。"]
          ],
          sourceIds: ["src.nvidia.gpu-operator"],
          owner: "平台工程",
          risk: "low",
          cadenceDays: 365
        }),
        concept({
          id: "platform.scheduler",
          title: "调度：Slurm / K8s / Kueue / Ray 角色边界",
          aliases: ["Slurm", "Kubernetes", "Kueue", "Ray", "调度"],
          tags: ["调度", "Slurm", "Kubernetes", "Kueue", "Ray"],
          l0: "几百人共用几千张卡，谁用哪张、用多久靠调度平台自动派单。Slurm、Kubernetes、Kueue、Ray 各管一段，边界不同。",
          l1: "Slurm 是 HPC 批调度器；Kubernetes 是容器编排；Kueue 在 K8s 上做作业排队/配额/gang admission（不替换核心组件）；Ray 是分布式应用框架。它们常组合使用，别指望一个全包。",
          decision: "按团队技术栈与作业类型选调度层组合；把“排队/配额/抢占”职责放在合适的层，避免各写一套。",
          tradeoffs: ["Slurm 对 HPC 批作业成熟，但容器生态弱", "K8s 生态强，却要 Kueue 等补齐批作业排队"],
          labTitle: "调度栈职责划分",
          lab: "为一个训练作业画出排队、配额、gang、放置分别由哪层负责。",
          success: "能说清各调度组件的边界与协作。",
          misconceptions: [
            ["Kueue 取代了 Kubernetes 调度器", "Kueue 是准入/排队层，配合核心调度器工作，不替换它。"]
          ],
          sourceIds: ["src.slurm", "src.kueue"],
          owner: "调度平台工程",
          risk: "medium",
          cadenceDays: 180
        }),
        concept({
          id: "platform.scheduling-primitives",
          title: "Gang / 拓扑感知 / 配额抢占 / DRA",
          aliases: ["Gang Scheduling", "Topology-Aware", "配额", "抢占", "DRA", "ResourceClaim"],
          tags: ["gang", "拓扑感知", "配额", "抢占", "DRA"],
          l0: "没有调度器就“抢卡靠吼”。好的调度提供：整组一起上的 gang scheduling、拓扑感知放置、队列配额公平共享与抢占重排，以及 DRA/ResourceClaim 这样的结构化资源请求。",
          l1: "Gang scheduling 全有或全无，避免分布式作业只占到部分卡而死锁；拓扑感知把同组放近减少跨交换机通信；配额/公平共享/抢占/重排管多队列争用；K8s DRA 用 ResourceClaim/DeviceClass 表达设备需求，支持 MIG 分区与共享。",
          decision: "分布式训练必须 gang + 拓扑感知；用配额与公平共享隔离多团队，抢占策略要明确、可预期。",
          tradeoffs: ["gang 保证不半占，却可能增加排队等待", "抢占提升利用率，但打断低优作业", "拓扑感知提性能，却增加放置复杂度"],
          labTitle: "Gang 与浪费演示",
          lab: "对比有无 gang scheduling 时分布式作业的部分占用死锁与资源浪费。",
          success: "能解释为何分布式训练需要 gang 与拓扑感知。",
          misconceptions: [
            ["配额高就等于一定能马上跑", "还要有足够可用资源并通过 gang 准入，配额只是上限。"],
            ["随便放置反正调度器会均衡", "跨拓扑放置会显著增加通信与拥塞。"]
          ],
          claimIds: ["claim.dra.status", "claim.kueue.gang"],
          sourceIds: ["src.kueue", "src.k8s.dra"],
          owner: "调度平台工程",
          risk: "high",
          cadenceDays: 90
        }),
        concept({
          id: "platform.user-platform",
          title: "平台层：自助、配额与计量",
          aliases: ["平台层", "自助", "配额", "计量"],
          tags: ["平台", "自助", "配额", "计量"],
          l0: "团队成员实际打交道的界面：申请算力、看排队、查用量账单；管理员分额度、设优先级——让“用算力”像用水电一样自助。",
          l1: "平台层在调度之上提供自助申请、配额视图、用量计量与账单、优先级管理。它把底层调度与隔离能力产品化，是多团队共用的统一入口。",
          decision: "把底层能力产品化为自助入口，暴露配额与计量，减少人肉审批与“群里喊”。",
          tradeoffs: ["更强自助降沟通成本，但要更严的配额与计量", "统一入口好治理，却增加平台建设成本"],
          labTitle: "自助配额流程",
          lab: "走一遍从申请、排队到计费的自助流程，找出人工卡点。",
          success: "能给出减少人工审批的自助化改进。",
          misconceptions: [
            ["有了平台界面就等于有了治理", "配额、计量与优先级规则才是治理内核。"]
          ],
          sourceIds: ["src.kueue"],
          owner: "平台产品工程",
          risk: "low",
          cadenceDays: 365
        }),
        concept({
          id: "platform.multitenancy",
          title: "多租户隔离、MIG/MPS 与计量",
          aliases: ["多租户", "MIG", "MPS", "GPU sharing", "隔离"],
          tags: ["多租户", "MIG", "MPS", "隔离", "计量"],
          l0: "一个集群多个团队共用，要划清边界：看不见彼此数据、有额度上限、能按规则插队；一张卡还能用 MIG/MPS 切给多个租户。",
          l1: "多租户隔离含命名空间/网络/存储/配额隔离与用量计量。GPU 共享两条路：MIG 把 GPU 硬件切成有隔离的实例（各有独立算力与显存），MPS 是并发共享（隔离更弱、利用率更高），两者可组合。",
          decision: "强隔离场景用 MIG，弹性提利用率用 MPS 或时间片；无论哪种都要有可信计量与配额。",
          tradeoffs: ["MIG 隔离强，但切分粒度固定、可能浪费", "MPS 利用率高，隔离弱、故障域耦合"],
          labTitle: "共享策略对比",
          lab: "对同一批小推理任务分别用 MIG 与 MPS，比较隔离、利用率与尾延迟。",
          success: "能按隔离与利用率需求选择共享方案。",
          misconceptions: [
            ["MIG 和 MPS 是一回事", "MIG 是硬件隔离切分，MPS 是并发共享，隔离强度不同。"],
            ["多租户只要配额就安全", "还需网络/存储/命名空间隔离与可信计量。"]
          ],
          claimIds: ["claim.mig.vs.mps"],
          sourceIds: ["src.nvidia.mig", "src.nvidia.mps"],
          owner: "平台与安全工程",
          risk: "high",
          cadenceDays: 90
        }),
        concept({
          id: "platform.observability",
          title: "统一可观测性",
          aliases: ["可观测性", "Observability", "OpenTelemetry", "DCGM", "监控"],
          tags: ["可观测性", "metrics", "logs", "traces"],
          l0: "GPU、作业、网络、存储和服务要放在一张“可观测性”的网里看：指标、日志、追踪打通，才能快速定位问题。",
          l1: "统一可观测性覆盖 metrics/logs/traces。OpenTelemetry 提供厂商中立的采集与语义约定；GPU 侧用 DCGM 采功率/温度/利用率/XID。关键是把请求/作业的追踪与 GPU 时间轴关联起来。",
          decision: "用 OpenTelemetry 统一采集与语义，避免各系统各一套；GPU 指标接 DCGM，并与作业/请求 trace 关联。",
          tradeoffs: ["更全采集利于定位，却抬高存储与高基数成本", "统一语义好治理，但接入改造有成本"],
          labTitle: "请求—GPU 关联排障",
          lab: "把一次慢请求的 trace 与对应 GPU 的 DCGM 指标对齐，定位瓶颈。",
          success: "能跨层关联定位一次真实故障。",
          misconceptions: [
            ["有监控大屏就等于可观测", "可观测强调 metrics/logs/traces 打通与可关联，而非只看几个数。"]
          ],
          sourceIds: ["src.otel", "src.nvidia.dcgm"],
          owner: "可观测性工程",
          risk: "medium",
          cadenceDays: 180
        }),
        concept({
          id: "platform.registry",
          title: "模型注册表、镜像与制品",
          aliases: ["模型注册表", "镜像仓库", "制品", "artifact"],
          tags: ["注册表", "镜像", "制品", "版本"],
          l0: "模型、镜像和制品要有“仓库”：版本化、可追溯、能灰度和回滚，而不是把文件随手拷来拷去。",
          l1: "模型注册表管模型版本与元数据；镜像/制品仓库管环境与依赖。配合签名与出处（provenance），支撑可复现与合规审计。",
          decision: "所有上线制品进注册表并版本化、签名；部署只引用注册表版本，杜绝“手拷文件上线”。",
          tradeoffs: ["严格版本化利于回滚审计，却增加流程", "保留多版本便于回退，但占存储"],
          labTitle: "制品可追溯核查",
          lab: "对一次上线追溯其模型版本、镜像与来源，验证可回滚。",
          success: "能从线上版本一路追溯到构建来源。",
          misconceptions: [
            ["把模型文件放共享盘就够了", "缺版本、签名与出处会让回滚与审计无从下手。"]
          ],
          sourceIds: ["src.nvidia.gpu-operator"],
          owner: "平台工程",
          risk: "medium",
          cadenceDays: 180
        }),
        concept({
          id: "platform.mlops",
          title: "MLOps：灰度、回滚与 CI/CD",
          aliases: ["MLOps", "CI/CD", "灰度", "canary", "回滚"],
          tags: ["MLOps", "CI/CD", "灰度", "回滚"],
          l0: "模型也要“上线流水线”：自动化构建、评测、灰度发布、监控和一键回滚，而不是手工换文件。",
          l1: "MLOps 把数据/训练/评测/部署/监控串成可重复的 CI/CD。灰度（canary）先放小流量验证，指标异常自动回滚；与注册表、可观测性联动形成闭环。",
          decision: "上线走灰度 + 自动回滚 + 可观测门禁，别一次性全量替换；发布与回滚都要可追溯。",
          tradeoffs: ["灰度更稳，但拉长发布周期", "自动门禁降风险，却需要可靠指标与阈值"],
          labTitle: "灰度与自动回滚演练",
          lab: "配置一次带指标门禁的灰度发布，注入劣化指标验证自动回滚。",
          success: "能在指标异常时自动、可追溯地回滚。",
          misconceptions: [
            ["模型上线就是把新权重替换上去", "没有评测、灰度与回滚，异常版本会直接打到全量用户。"]
          ],
          sourceIds: ["src.otel"],
          owner: "MLOps 工程",
          risk: "high",
          cadenceDays: 90
        })
      ],
      placements: {
        "driver": "platform.driver-firmware",
        "driver/operator": "platform.kernel-libs",
        "container": "platform.container",
        "scheduler": "platform.scheduler",
        "scheduler/noscheduler": "platform.scheduling-primitives",
        "platform": "platform.user-platform",
        "platform/tenant": "platform.multitenancy",
        "adv/observability": "platform.observability",
        "adv/registry": "platform.registry",
        "adv/mlops": "platform.mlops"
      }
    },

    model: {
      focus: "模型如何被训练出来、部署上线、并且跑得又快又省——训练生产（7A）与推理服务（7B）",
      learningObjectives: [
        "拆解 5D 并行（DP/TP/PP/CP/EP）与 FSDP2/DTensor，正确算 global batch。",
        "区分 SFT / RLHF / DPO / 蒸馏 / LoRA 的适用与成本。",
        "读懂 Prefill/Decode、KV Cache（Paged/Prefix/Chunked）与连续批处理。",
        "在吞吐、TTFT、显存、质量与成本之间做 Pareto 取舍。"
      ],
      tldr: "一句话看懂：这一站分两半——7A 把模型训练/后训练出来，7B 让它上线后又快又稳又省地服务。",
      intro: "硬件与平台就绪，现在回答最终的问题：模型如何被训练与对齐（7A 生产），以及如何被部署成又快又省的服务（7B 推理）。点开每一层，别有洞天。",
      concepts: [
        concept({
          id: "model.training-overview",
          title: "训练：预训练与后训练",
          aliases: ["预训练", "后训练", "基础模型"],
          tags: ["训练", "预训练", "后训练"],
          l0: "先用海量数据把基础模型“喂”出来（预训练），再用更小数据教它按需求做事（后训练）；这是最烧算力的环节，千卡一跑就是几周。",
          l1: "预训练在大规模语料上自监督学习通用能力；后训练（SFT、偏好优化等）把它对齐到任务与人类偏好。规模、数据质量与并行策略共同决定成本与效果。",
          decision: "先明确目标能力与数据，再选规模与并行；用可复现配方与评测控制“烧钱”风险。",
          tradeoffs: ["更大规模通常更强，但成本与风险陡增", "更多后训练更贴合任务，却可能损伤通用能力"],
          labTitle: "训练成本拆解",
          lab: "对一个训练配置估算 GPU 卡数、时长与 global batch，并与实际吞吐校准。",
          success: "能把训练目标翻译成可核算的资源与时间。",
          misconceptions: [["预训练和微调是一回事", "预训练学通用能力、成本巨大；后训练在其上做对齐，成本低得多。"]],
          sourceIds: ["src.pytorch.fsdp"],
          owner: "训练工程", risk: "high", cadenceDays: 90
        }),
        concept({
          id: "model.parallelism-5d",
          title: "分布式并行与 FSDP2 / DTensor",
          aliases: ["DP", "TP", "PP", "CP", "EP", "FSDP2", "DeviceMesh", "DTensor", "pipeline bubble", "global batch"],
          tags: ["并行", "FSDP2", "DTensor", "global batch"],
          l0: "一张卡装不下也训不动大模型，就把活儿按数据、张量、流水线、上下文、专家五个维度切开（5D 并行），让千卡像一支军队。",
          l1: "数据并行(DP)复制模型分数据；张量并行(TP)切算子内矩阵；流水线并行(PP)切层但要控 pipeline bubble；上下文并行(CP)切长序列；专家并行(EP)切 MoE 专家。FSDP2 用 DeviceMesh/DTensor 按 SPMD 表达分片；global batch 要按 DP×梯度累积×micro-batch 正确计算。",
          decision: "按显存、通信与拓扑组合并行维度；用 DeviceMesh 描述拓扑、减小 bubble 与通信，别只堆 DP。",
          tradeoffs: ["TP 降单卡显存但增通信", "PP 提规模却引入 bubble", "更大 global batch 提吞吐，可能影响收敛与延迟"],
          labTitle: "并行配置与显存/通信",
          lab: "对固定模型试几组 DP/TP/PP 组合，记录每卡显存、通信量与吞吐。",
          success: "能为给定模型与集群选出合理并行组合并解释取舍。",
          misconceptions: [["并行就是多加卡做数据并行", "大模型常需张量/流水线/专家并行组合，DP 解决不了放不下的问题。"], ["global batch 就是每卡 batch 相加", "要计入梯度累积与 micro-batch，算错会影响学习率与收敛。"]],
          claimIds: ["claim.fsdp2.dtensor"],
          sourceIds: ["src.pytorch.fsdp", "src.pytorch.dtensor"],
          owner: "分布式训练工程", risk: "high", cadenceDays: 90
        }),
        concept({
          id: "model.finetune",
          title: "微调 / 后训练：SFT / RLHF / DPO / 蒸馏",
          aliases: ["SFT", "RLHF", "DPO", "蒸馏", "后训练"],
          tags: ["微调", "SFT", "RLHF", "DPO", "蒸馏"],
          l0: "基础模型什么都懂一点但不懂你的行业；后训练用行业数据再教一轮——SFT 教格式与任务，偏好优化（RLHF/DPO）对齐好恶，蒸馏把大模型能力压给小模型。",
          l1: "SFT 用示范数据监督微调；RLHF（InstructGPT）用人类偏好训奖励模型再强化学习；DPO 直接用偏好对优化、省去显式奖励模型；蒸馏用教师模型指导学生。成本远低于从头训练。",
          decision: "先 SFT 打基础，再按需要用偏好优化对齐；能用小模型蒸馏满足就别硬训大模型。",
          tradeoffs: ["RLHF 对齐强，但流程复杂、易过拟合偏好", "蒸馏省成本，却可能损失部分能力"],
          labTitle: "后训练方法选型",
          lab: "对同一任务比较 SFT 与 SFT+偏好优化的质量、成本与安全表现。",
          success: "能按任务与预算选择合适的后训练组合。",
          misconceptions: [["微调必须动全部参数", "多数场景 LoRA 等参数高效方法就够，且便宜得多。"]],
          claimIds: ["claim.rlhf.instructgpt"],
          sourceIds: ["src.paper.instructgpt"],
          owner: "模型训练工程", risk: "medium", cadenceDays: 180
        }),
        concept({
          id: "model.lora",
          title: "全参微调 vs LoRA / PEFT",
          aliases: ["LoRA", "PEFT", "参数高效微调", "全参微调"],
          tags: ["LoRA", "PEFT", "微调"],
          l0: "全参微调把模型整个重教一遍，效果彻底但贵；LoRA 只在旁边加一小块“补丁”学新知识，一张卡也能做，多数场景够用。",
          l1: "LoRA 是参数高效微调(PEFT)的一种：冻结主干、只训练低秩增量，显存与成本大降，可插拔多个适配器；全参微调改动全部权重，适合能力需要大改的场景。",
          decision: "默认先试 LoRA，验证不足再上全参；用相同评测口径比较收益与成本。",
          tradeoffs: ["LoRA 省显存与成本，但对某些大改任务能力上限较低", "全参效果彻底，却贵且更易遗忘通用能力"],
          labTitle: "LoRA vs 全参对比",
          lab: "对同一任务分别做 LoRA 与全参微调，比较质量、显存与耗时。",
          success: "能用数据说明何时该从 LoRA 升级到全参。",
          misconceptions: [["LoRA 一定不如全参", "多数企业场景 LoRA 质量够用且成本低得多。"]],
          sourceIds: ["src.pytorch.fsdp"],
          owner: "模型训练工程", risk: "medium", cadenceDays: 180
        }),
        concept({
          id: "model.inference-overview",
          title: "推理：Prefill / Decode / 流式",
          aliases: ["推理", "Prefill", "Decode", "流式输出"],
          tags: ["推理", "Prefill", "Decode"],
          l0: "训练是“学”，推理是“用”；每次对话背后是一次推理：先读题(Prefill)一口气读完上下文，再逐字写答案(Decode)流式吐回。",
          l1: "请求经排队、Tokenize、Prefill（计算密集）、Decode（带宽/显存密集）、流式输出。推理直接面客，要求又快又稳又省，催生出一整套值得单独一层的服务技术。",
          decision: "按 Prefill/Decode 不同资源特征分别优化；用服务指标（下节）而非只看单卡算力来定容量。",
          tradeoffs: ["更大批提吞吐，却抬升 TTFT 与显存", "更长上下文更强，但 KV 膨胀、更慢更贵"],
          labTitle: "推理阶段画像",
          lab: "对一条请求分别测 Prefill 与 Decode 的算力/带宽/显存占用与耗时。",
          success: "能解释同一请求两阶段的不同瓶颈。",
          misconceptions: [["推理就是跑一次前向", "服务化推理还包括排队、批处理、KV 管理与流式，工程复杂度高。"]],
          sourceIds: ["src.vllm"],
          owner: "推理服务工程", risk: "high", cadenceDays: 90
        }),
        concept({
          id: "model.serving-framework",
          title: "推理框架（vLLM / TensorRT-LLM）",
          aliases: ["推理框架", "vLLM", "TensorRT-LLM", "SGLang"],
          tags: ["推理框架", "vLLM", "服务"],
          l0: "模型文件自己不会“接客”，要装进推理框架才能对外服务：接收请求、排队、调卡计算、流式返回。框架选得好，同样的卡多服务几倍用户。",
          l1: "推理框架实现批处理、KV 管理、调度与并行。vLLM 以 PagedAttention 管理 KV、连续批处理提升吞吐；不同框架在吞吐、延迟、特性与生态上各有侧重。",
          decision: "按目标模型、并发与 SLA 实测选框架，别只看基准数字；关注 KV 管理、批处理与量化支持。",
          tradeoffs: ["高吞吐框架特性多，却更复杂", "极致优化的引擎更快，但灵活性与可移植性可能更低"],
          labTitle: "框架吞吐对比",
          lab: "对同一模型与 SLA 比较两个框架的 aggregate tokens/s、TTFT 与显存。",
          success: "结论可追溯到实测而非厂商基准。",
          misconceptions: [["换个框架就能无损翻倍", "收益取决于负载、KV 管理与并行，需实测验证。"]],
          sourceIds: ["src.vllm"],
          owner: "推理服务工程", risk: "medium", cadenceDays: 90
        }),
        concept({
          id: "model.pd-separation",
          title: "PD 分离（Prefill/Decode 解耦）",
          aliases: ["PD 分离", "Prefill/Decode 分离", "disaggregation", "KV-aware routing"],
          tags: ["PD 分离", "Prefill", "Decode", "路由"],
          l0: "读题(Prefill)吃算力、写答案(Decode)吃显存带宽——两种活脾气不同，拆到不同机器各用所长，整体又快又省。",
          l1: "PD 分离把 Prefill 与 Decode 解耦部署，避免一份长文档的 Prefill 阻塞所有人的 Decode；代价是要在两侧间传输 KV 并做 KV-aware routing。",
          decision: "当长上下文/混合负载导致互相拖累时上 PD 分离；先量化 KV 传输成本再决定拆分粒度。",
          tradeoffs: ["分离降互相干扰，却引入 KV 传输与路由复杂度", "更细拆分更灵活，但运维更重"],
          labTitle: "PD 干扰实验",
          lab: "在混合负载下对比合并部署与 PD 分离时长文档对其他请求 TTFT 的影响。",
          success: "能量化 PD 分离对尾延迟的收益与其 KV 传输代价。",
          misconceptions: [["PD 分离总是更快", "它解决的是互相拖累；无干扰时反而增加传输开销。"]],
          sourceIds: ["src.vllm"],
          owner: "推理服务工程", risk: "medium", cadenceDays: 90
        }),
        concept({
          id: "model.kv-cache",
          title: "KV Cache（Paged / Prefix / Chunked）",
          aliases: ["KV Cache", "PagedAttention", "Prefix Caching", "Chunked Prefill"],
          tags: ["KV Cache", "PagedAttention", "前缀复用"],
          l0: "模型答题要不断回看前文；KV Cache 把“已读内容”记成小抄，每写一个新字直接翻小抄不用重读——推理提速主要靠它，但小抄很占显存。",
          l1: "PagedAttention 把 KV 切成定长块按需分配、消除碎片；Prefix Caching 复用共享前缀（系统提示/少样本）的 KV；Chunked Prefill 把长 Prefill 切块，避免阻塞其他请求的 Decode、降尾延迟。",
          decision: "用分页 KV 提升显存利用；对共享前缀开前缀缓存；长 Prefill 用 Chunked Prefill 保尾延迟。",
          tradeoffs: ["前缀缓存提吞吐，但要管理命中与失效", "Chunked Prefill 降尾延迟，却略降 Prefill 吞吐"],
          labTitle: "KV 管理收益实验",
          lab: "在共享系统提示场景下开关前缀缓存与分页，记录吞吐、显存与尾延迟。",
          success: "能解释三种机制各自解决的问题与代价。",
          misconceptions: [["KV Cache 只是加速，不占资源", "小抄随上下文膨胀、显存被逐渐占满，是长上下文的主要成本。"]],
          claimIds: ["claim.paged-kv.blocks", "claim.prefix-cache.gain"],
          sourceIds: ["src.vllm"],
          owner: "推理服务工程", risk: "high", cadenceDays: 90
        }),
        concept({
          id: "model.continuous-batching",
          title: "连续批处理（in-flight batching）",
          aliases: ["连续批处理", "in-flight batching", "请求拼车"],
          tags: ["批处理", "吞吐", "调度"],
          l0: "一次只服务一个请求，卡大部分时间空转；连续批处理让请求随到随拼、动态成批，一张卡同时服务几十路对话，吞吐翻几倍。",
          l1: "连续（in-flight）批处理在迭代级而非批级调度：完成的请求即时腾位、新请求即时加入，消除空槽。与 PagedAttention 配合是高吞吐服务的基础。",
          decision: "开连续批处理提利用率，同时用 SLA 约束批大小以守住 TTFT。",
          tradeoffs: ["更大动态批提吞吐，却可能抬升尾延迟", "更严延迟约束更稳，但吞吐下降"],
          labTitle: "批处理吞吐—延迟曲线",
          lab: "扫不同并发下的 aggregate tokens/s 与 p95 TTFT，找到满足 SLA 的工作点。",
          success: "能在吞吐与延迟间找到符合 SLA 的批策略。",
          misconceptions: [["批越大越好", "批过大提吞吐却牺牲首字延迟，要按 SLA 取舍。"]],
          sourceIds: ["src.vllm"],
          owner: "推理服务工程", risk: "medium", cadenceDays: 180
        }),
        concept({
          id: "model.inference-parallel",
          title: "推理并行与多节点服务",
          aliases: ["张量并行推理", "流水线并行推理", "多节点服务"],
          tags: ["推理并行", "多节点", "放置"],
          l0: "模型大到一张卡放不下，就切开分到多张卡甚至多机一起服务：按块切(张量并行)、按层切(流水线)、按专家切；切法影响时延与吞吐。",
          l1: "推理并行与训练并行目标不同——更看重时延与显存放置。张量并行降单卡显存但增通信；多节点服务要考虑 KV 传输、放置与故障域。",
          decision: "先用最小并行满足显存与 SLA，再按需扩展；跨机务必核算通信与 KV 传输。",
          tradeoffs: ["更高并行放得下更大模型，却增通信与运维", "多节点提容量，但故障域更大"],
          labTitle: "并行度与时延",
          lab: "对一个大模型比较不同张量并行度的显存、TTFT 与吞吐。",
          success: "能为大模型选出满足 SLA 的最小并行度。",
          misconceptions: [["推理并行和训练并行一样", "推理更看时延与放置，训练更看收敛与总吞吐。"]],
          sourceIds: ["src.vllm"],
          owner: "推理服务工程", risk: "medium", cadenceDays: 180
        }),
        concept({
          id: "model.speculative",
          title: "投机解码（Speculative Decoding）",
          aliases: ["投机解码", "speculative decoding", "草稿模型"],
          tags: ["投机解码", "加速", "草稿"],
          l0: "让一个小模型飞快打草稿，大模型只负责批改——批改比逐字写快得多，答案质量仍由大模型把关。",
          l1: "投机解码用小“草稿”模型并行提议若干 token，大模型一次性校验接受/拒绝；输出分布与直接解码一致。原论文在 T5-XXL 上报告约 2–3× 加速。",
          decision: "在 Decode 受限、接受率高的场景上投机解码；用真实流量验证净收益（含草稿开销）。",
          tradeoffs: ["接受率高时明显加速，低时反而增加开销", "草稿模型越准越快，却更贵"],
          labTitle: "投机解码收益边界",
          lab: "在不同任务上测接受率与端到端加速，找出投机解码的收益边界。",
          success: "能判断某场景投机解码是否划算。",
          misconceptions: [["投机解码会降低答案质量", "校验保证输出分布不变；它只加速，不改结果分布。"]],
          claimIds: ["claim.specdec.speedup"],
          sourceIds: ["src.paper.specdec"],
          owner: "推理服务工程", risk: "medium", cadenceDays: 180
        }),
        concept({
          id: "model.serving-metrics",
          title: "服务指标：TTFT / ITL / E2E / 吞吐 / Pareto",
          aliases: ["TTFT", "ITL", "TPOT", "E2E", "吞吐", "Pareto"],
          tags: ["服务指标", "TTFT", "吞吐", "Pareto"],
          l0: "衡量推理服务好坏的几个表：首字延迟 TTFT、逐字间隔 ITL/TPOT、端到端 E2E、单请求 tokens/s 与整机 aggregate tokens/s、并发上限。",
          l1: "单请求速度与整机吞吐是两回事；吞吐、延迟、显存、质量、成本之间是 Pareto 取舍——提吞吐常抬尾延迟，降精度省显存可能损质量。给客户承诺 SLA 就围绕这几个数。",
          decision: "先定 SLA（TTFT/ITL/并发），再在 Pareto 前沿上选配置，别只优化单一指标。",
          tradeoffs: ["优化吞吐常牺牲尾延迟", "优化 TTFT 可能降整机吞吐"],
          labTitle: "服务 Pareto 前沿",
          lab: "扫批大小/并行/量化，画出吞吐—TTFT—显存—质量的 Pareto 前沿。",
          success: "能在 Pareto 前沿上为给定 SLA 选点。",
          misconceptions: [["单请求 tokens/s 高就代表整机强", "整机 aggregate 吞吐取决于并发与批处理，二者不同。"]],
          sourceIds: ["src.mlcommons.inference", "src.vllm"],
          owner: "推理服务工程", risk: "high", cadenceDays: 90
        }),
        concept({
          id: "model.eval-release",
          title: "评测与上线",
          aliases: ["评测", "上线", "基准", "压力", "灰度"],
          tags: ["评测", "上线", "质量", "安全"],
          l0: "模型上线前要过三关：基准测试看能力、压力测试看扛不扛高峰、灰度发布先给一小部分用户试用；三关都过才敢全量。",
          l1: "评测覆盖能力质量、安全与可复现性；上线走基准→压力→灰度→全量，指标异常可回滚。质量与安全要分开评，能力强不等于安全。",
          decision: "把基准、压力、灰度做成上线门禁，任一不过不放量。",
          tradeoffs: ["更严门禁更稳，却拉长上线周期", "更快放量更敏捷，但风险更高"],
          labTitle: "上线门禁编排",
          lab: "为一次发布串起基准、压力与灰度门禁，并定义回滚触发条件。",
          success: "能给出可执行、可回滚的上线门禁。",
          misconceptions: [["跑分高就能上线", "还要过压力与安全评测，并用灰度控制风险。"]],
          sourceIds: ["src.mlcommons.inference"],
          owner: "模型评测工程", risk: "medium", cadenceDays: 180
        }),
        concept({
          id: "model.benchmark",
          title: "基准测试",
          aliases: ["基准", "benchmark", "MLPerf"],
          tags: ["基准", "评测", "可比性"],
          l0: "用标准数据集与质量门槛比较模型/配置的能力，让不同方案可比——但小心“为跑分而跑分”。",
          l1: "基准要固定质量门槛与口径（如 MLPerf Inference），并区分标准测试、厂商自测与独立测试；警惕过拟合基准、与真实业务分布脱节。",
          decision: "用带质量门槛的可比基准，同时保留一套贴近业务的私有评测。",
          tradeoffs: ["公共基准可比，却可能不代表你的负载", "私有评测贴合业务，但不可对外比较"],
          labTitle: "基准 vs 业务分布",
          lab: "比较模型在公共基准与私有业务集上的表现差异并解释。",
          success: "能说明基准分数与业务价值的差距。",
          misconceptions: [["基准第一就一定最适合你", "基准分数不等于在你的数据与 SLA 上的表现。"]],
          sourceIds: ["src.mlcommons.inference"],
          owner: "模型评测工程", risk: "medium", cadenceDays: 180
        }),
        concept({
          id: "model.stress-test",
          title: "压力测试",
          aliases: ["压力测试", "stress test", "容量"],
          tags: ["压力", "容量", "尾延迟"],
          l0: "压力测试看系统在高峰并发下扛不扛得住：吞吐会不会崩、尾延迟会不会飙、会不会 OOM。",
          l1: "用代表性流量与峰值并发压系统，观察吞吐饱和点、p95/p99 尾延迟、KV OOM 与降级行为，据此定容量与限流阈值。",
          decision: "上线前压到饱和点，定好限流与降级阈值，避免高峰雪崩。",
          tradeoffs: ["压得更狠更安全，但耗资源与时间", "留更多余量更稳，却降低利用率"],
          labTitle: "峰值并发压测",
          lab: "逐步加压直到 SLA 破线，记录饱和点、尾延迟与失败模式。",
          success: "能给出容量上限与限流/降级阈值。",
          misconceptions: [["平均延迟达标就没问题", "高峰下 p99 与 KV OOM 才是真实风险。"]],
          sourceIds: ["src.vllm"],
          owner: "推理服务工程", risk: "medium", cadenceDays: 180
        }),
        concept({
          id: "model.moe",
          title: "MoE 专家混合",
          aliases: ["MoE", "Mixture of Experts", "专家并行", "稀疏激活"],
          tags: ["MoE", "稀疏激活", "专家并行"],
          l0: "MoE 把网络分成很多“专家”，每个 token 只激活其中几个——用更大的总参数量换更低的单 token 计算。",
          l1: "MoE 用路由器为每 token 选少数专家（稀疏激活），总参数大但激活参数少；工程上要处理负载均衡与专家并行(EP)的 All-to-All 通信。",
          decision: "在追求“更大能力但控计算”的场景用 MoE；重点解决路由均衡与 EP 通信。",
          tradeoffs: ["稀疏激活省算力，却增显存与通信复杂度", "更多专家更强，但路由不均会浪费"],
          labTitle: "MoE 路由均衡观察",
          lab: "观察一次前向中各专家的负载分布，评估路由均衡与通信开销。",
          success: "能解释 MoE 的省算与其通信/均衡代价。",
          misconceptions: [["MoE 参数大就一定更慢更贵", "每 token 只激活部分专家，计算不随总参数线性增长。"]],
          claimIds: ["claim.moe.sparse"],
          sourceIds: ["src.paper.moe"],
          owner: "模型架构工程", risk: "medium", cadenceDays: 180
        }),
        concept({
          id: "model.long-context",
          title: "长上下文",
          aliases: ["长上下文", "long context", "上下文窗口"],
          tags: ["长上下文", "KV", "显存"],
          l0: "长上下文让模型一次能读很多（长文档、长对话），但 KV Cache 随长度线性膨胀，显存与时延都会涨。",
          l1: "支撑长上下文要在注意力、位置编码与 KV 管理上下功夫；代价是显存与算力随序列增长，需配合分页 KV、Chunked Prefill 与并行来控成本。",
          decision: "按真实需要选上下文长度，用分页 KV 与前缀复用控成本，别为“超长”付无谓代价。",
          tradeoffs: ["更长上下文更强，却更慢更贵", "截断/检索省成本，但可能丢信息"],
          labTitle: "上下文长度的成本曲线",
          lab: "测不同上下文长度下的 KV 显存、TTFT 与吞吐，画出成本曲线。",
          success: "能量化长上下文的边际成本并给出取舍。",
          misconceptions: [["上下文越长越好", "KV 随长度膨胀，长上下文显著抬升显存与时延成本。"]],
          sourceIds: ["src.vllm"],
          owner: "模型架构工程", risk: "medium", cadenceDays: 180
        }),
        concept({
          id: "model.agent",
          title: "Agent 智能体",
          aliases: ["Agent", "智能体", "工具调用", "多步"],
          tags: ["Agent", "工具", "多步"],
          l0: "Agent 让模型会自己调用工具、多步规划完成任务，而不只是一问一答；可靠性、成本与安全边界是关键。",
          l1: "Agent 把模型与工具、记忆、规划循环编排起来；多步意味着错误会累积，要有工具校验、预算与护栏。评测更看任务完成率与成本，而非单轮质量。",
          decision: "用工具校验、步数/成本预算与护栏约束 Agent；按任务完成率与端到端成本评测。",
          tradeoffs: ["更多自主步骤能力更强，却更易累积错误与超支", "更强护栏更安全，但可能限制能力"],
          labTitle: "Agent 任务完成率评测",
          lab: "在一组任务上评测 Agent 的完成率、步数、成本与失败模式。",
          success: "能用完成率与成本而非单轮质量评价 Agent。",
          misconceptions: [["Agent 就是多问几次模型", "它涉及工具、记忆与规划编排，可靠性与成本是核心工程问题。"]],
          sourceIds: ["src.vllm"],
          owner: "应用与 Agent 工程", risk: "medium", cadenceDays: 180
        }),
        concept({
          id: "model.alignment",
          title: "对齐与安全评测",
          aliases: ["对齐", "alignment", "安全评测", "RLHF"],
          tags: ["对齐", "安全", "评测"],
          l0: "对齐让模型好用、可控、安全：既听懂意图，又不越界；上线前要做安全评测，不能只看能力分。",
          l1: "对齐常用 RLHF/DPO 等偏好优化（InstructGPT）；安全评测覆盖有害内容、越狱、隐私与偏见等维度。能力强不等于安全，二者要分开评估。",
          decision: "把安全评测作为独立门禁与能力评测并列；对高风险场景加护栏与人审。",
          tradeoffs: ["更强对齐更安全，却可能牺牲部分能力或帮助度", "更宽松更好用，但风险更高"],
          labTitle: "安全评测门禁",
          lab: "对一个模型跑有害内容/越狱/隐私评测集，形成上线安全门禁。",
          success: "能给出与能力分并列的安全评测结论。",
          misconceptions: [["能力强的模型自然更安全", "能力与安全是两条轴，必须分开评估。"]],
          claimIds: ["claim.rlhf.instructgpt"],
          sourceIds: ["src.paper.instructgpt"],
          owner: "对齐与安全工程", risk: "high", cadenceDays: 90
        })
      ],
      placements: {
        "training": "model.training-overview",
        "training/distributed": "model.parallelism-5d",
        "training/precision": "numeric.precision.formats",
        "training/ckptrecover": "data.checkpoint-economics",
        "finetune": "model.finetune",
        "finetune/lora": "model.lora",
        "inference": "model.inference-overview",
        "inference/framework": "model.serving-framework",
        "inference/pd": "model.pd-separation",
        "inference/kvcache": "model.kv-cache",
        "inference/quant": "numeric.precision.formats",
        "inference/batching": "model.continuous-batching",
        "inference/parallel": "model.inference-parallel",
        "inference/speculative": "model.speculative",
        "inference/metrics": "model.serving-metrics",
        "eval": "model.eval-release",
        "eval/benchmark": "model.benchmark",
        "eval/stresstest": "model.stress-test",
        "eval/canary": "platform.mlops",
        "adv/moe": "model.moe",
        "adv/longctx": "model.long-context",
        "adv/rag": "data.vector-rag",
        "adv/agent": "model.agent",
        "adv/alignment": "model.alignment"
      }
    },

    delivery: {
      focus: "同样的算力怎样交付到客户手里：四种模式 + 数据驻留、迁移与退出路径",
      learningObjectives: [
        "用数据驻留、SLO、预算与团队能力选交付模式。",
        "区分公有云按量/包期、专有云、自建 IDC 与混合。",
        "识别数据/环境/算子/框架/API 的锁定风险与退出路径。",
        "评估多云、多地域容灾与国产算力迁移成本。"
      ],
      tldr: "一句话看懂：同样的算力有四种交付方式，取决于数据能不能出门、用量稳不稳、有没有运维团队。",
      intro: "同样的算力，可以用四种方式交付到使用者手里。哪种最合适，取决于三个问题：数据能不能出门？用量稳不稳定？有没有自己的运维团队？这一页也是商务同事最常被问到的一页。",
      concepts: [
        concept({
          id: "delivery.ondemand", title: "公有云 · 按量", aliases: ["按量", "on-demand", "打车"], tags: ["公有云", "按量", "弹性"],
          l0: "在云厂商那里随开随用、按小时计费；想试一个新模型今天开明天关，一分钱不浪费。代价是单价最贵、高峰可能“叫不到车”。",
          l1: "按量是最灵活的 IaaS 交付：无前期投入、分钟级起量，但单价高、容量无保障。适合试验、波动负载与短期项目。",
          decision: "用量说不准或短期试验时用按量；长期稳定负载再转包期以降单价。",
          tradeoffs: ["弹性最好，但单价最高", "无前期投入，却在高峰可能抢不到容量"],
          labTitle: "按量 vs 包期成本临界点", lab: "对一段真实用量曲线比较按量与包期的总成本，找到转包期的临界利用率。",
          success: "能用利用率判断该按量还是包期。",
          misconceptions: [["按量总是最省", "长期稳定负载下包期或自建单位成本更低。"]],
          claimIds: ["claim.cloud.models"], sourceIds: ["src.nist.cloud"], owner: "商务与解决方案", risk: "low", cadenceDays: 365
        }),
        concept({
          id: "delivery.reserved", title: "公有云 · 包期 / 预留", aliases: ["包期", "预留", "长租车"], tags: ["公有云", "包期", "预留"],
          l0: "和云厂商签约包年包月或预留吞吐：单价比按量便宜得多、资源有保障，适合用量稳定的长期业务。代价是用不满也照付。",
          l1: "包期/预留用承诺换折扣与容量保障，是稳定负载的性价比之选；预留吞吐类 SKU 还能锁定并发能力。",
          decision: "对可预测的基线负载用包期，对峰值用按量兜底，形成基线+弹性组合。",
          tradeoffs: ["单价更低、有保障，但用不满仍要付费", "锁定期越长越便宜，灵活性越低"],
          labTitle: "基线+弹性配比", lab: "把一条用量曲线拆成包期基线与按量峰值，最小化总成本。",
          success: "能给出基线包期 + 峰值按量的配比。",
          misconceptions: [["包期一定更划算", "利用率不足时包期反而更贵。"]],
          sourceIds: ["src.nist.cloud"], owner: "商务与解决方案", risk: "low", cadenceDays: 365
        }),
        concept({
          id: "delivery.private", title: "专有云", aliases: ["专有云", "private cloud", "数据不出门", "数据驻留"], tags: ["专有云", "数据驻留", "政企"],
          l0: "云部署在客户自己的机房或专属区域：数据不出门，管理与体验还是云的样子。政企、金融等数据敏感行业的主流选择。",
          l1: "专有云满足数据驻留与安全边界要求：数据留在客户侧/专属区，运维双方共担，建设周期周到月级。它把云的自助体验与数据主权结合。",
          decision: "当数据绝不能出域时首选专有云或自建；再按运维能力与规模在二者间取舍。",
          tradeoffs: ["数据主权强，但建设周期与成本高于公有云", "双方共担省心，却需要清晰的责任边界"],
          labTitle: "数据驻留决策", lab: "对一个含敏感数据的场景，列出专有云需满足的驻留、隔离与审计要求。",
          success: "能把数据驻留要求转成部署约束。",
          misconceptions: [["专有云就是把公有云搬进机房那么简单", "还要满足数据驻留、安全边界、审计与双方运维分工。"]],
          claimIds: ["claim.cloud.models"], sourceIds: ["src.nist.cloud", "src.nist.physical"], owner: "解决方案架构", risk: "high", cadenceDays: 90
        }),
        concept({
          id: "delivery.idc", title: "自建 IDC", aliases: ["自建", "IDC", "自购车队"], tags: ["自建", "IDC", "规模"],
          l0: "自己建机房、买设备、养团队：前期投入最大、周期半年起步，但长期大规模使用时单位成本最低，一切完全自主。",
          l1: "自建适合超大规模且有强技术团队的玩家：完全的数据主权与成本控制，代价是重资产、长周期与全部自担运维。",
          decision: "只有规模足够大、团队足够强、且长期确定时才自建；否则先用专有云过渡。",
          tradeoffs: ["长期单位成本最低，但前期投入与周期最大", "完全自主，却全部自担风险与运维"],
          labTitle: "自建 vs 专有云盈亏", lab: "对给定规模与年限估算自建与专有云的总拥有成本，找到自建更省的规模门槛。",
          success: "能用规模与年限判断是否该自建。",
          misconceptions: [["自建一定最省", "只有足够规模与利用率下自建才摊薄前期投入。"]],
          sourceIds: ["src.nist.cloud"], owner: "解决方案架构", risk: "high", cadenceDays: 180
        }),
        concept({
          id: "delivery.hybrid", title: "混合模式", aliases: ["混合", "hybrid", "自有+打车"], tags: ["混合", "弹性"],
          l0: "平时业务跑在专有云或自建集群上，高峰期弹性借用公有云顶一阵；兼顾成本、可控与弹性，是越来越常见的组合拳。",
          l1: "混合把基线放自有、峰值放公有云，需要统一的调度、数据与安全边界打通；关键是把握“何时溢出到公有云”。",
          decision: "用自有承基线、公有云接溢出；提前定义数据可否出域与溢出触发线。",
          tradeoffs: ["兼顾成本与弹性，但架构与安全边界更复杂", "溢出降峰值成本，却要处理数据与一致性"],
          labTitle: "溢出策略设计", lab: "定义一个把峰值溢出到公有云的触发规则，并校验数据与安全约束。",
          success: "能给出可执行的混合溢出策略。",
          misconceptions: [["混合就是随便两边都放", "要明确边界、溢出规则与数据可否出域，否则更乱更贵。"]],
          sourceIds: ["src.nist.cloud"], owner: "解决方案架构", risk: "medium", cadenceDays: 180
        }),
        concept({
          id: "delivery.multicloud", title: "多云、多地域与容灾", aliases: ["多云", "多地域", "容灾", "切流"], tags: ["多云", "容灾", "多地域"],
          l0: "把服务放到多云或多地域，可以避免单一供应商/单一机房的单点，做异地容灾与流量切换——但也更复杂更贵。",
          l1: "多云/多地域用于容灾、就近服务与议价；要处理数据同步、一致性、切流与不同云的能力差异。容灾要有 RPO/RTO 与切流演练。",
          decision: "按可用性目标与合规决定多云/多地域，别为多云而多云；容灾要定期演练切流。",
          tradeoffs: ["降单点与议价强，但复杂度与成本上升", "多地域就近更快，却带来一致性与同步成本"],
          labTitle: "切流演练", lab: "为一个多地域服务定义 RPO/RTO 并演练一次故障切流。",
          success: "能给出可演练的容灾切流方案。",
          misconceptions: [["多云自动更可靠", "没有一致性与切流演练，多云反而增加故障面。"]],
          sourceIds: ["src.nist.cloud"], owner: "解决方案架构", risk: "medium", cadenceDays: 180
        }),
        concept({
          id: "delivery.migration", title: "迁移与锁定风险", aliases: ["迁移", "锁定", "lock-in", "退出路径", "国产迁移"], tags: ["迁移", "锁定", "退出路径"],
          l0: "换供应商或换芯片不是拷贝文件那么简单：数据、环境、算子、框架、API 都可能被锁定；上线前就要想好退出路径。",
          l1: "锁定发生在数据、环境、算子、框架、调度与 API 多个层面。国产算力迁移还涉及芯片、互联、算子、框架、调度与模型适配的成本。迁移清单与退出路径要在选型时就评估。",
          decision: "选型即评估锁定与退出成本，保留可迁移的抽象与数据导出能力；把迁移清单写进合同。",
          tradeoffs: ["深度用厂商特性更高效，却更难迁走", "坚持可移植抽象更自由，但可能牺牲性能"],
          labTitle: "锁定风险矩阵", lab: "对一套方案在数据/环境/算子/框架/API 五维打分，列出退出路径。",
          success: "能产出可解释的锁定风险矩阵与退出方案。",
          misconceptions: [["迁移就是把模型和数据拷过去", "算子、框架、调度与 API 适配往往才是迁移的大头。"]],
          sourceIds: ["src.nist.cloud"], owner: "解决方案架构", risk: "high", cadenceDays: 90
        })
      ],
      placements: {
        "ondemand": "delivery.ondemand", "reserved": "delivery.reserved", "private": "delivery.private",
        "idc": "delivery.idc", "hybrid": "delivery.hybrid",
        "adv/multicloud": "delivery.multicloud", "adv/migration": "delivery.migration"
      }
    },

    token: {
      focus: "把算力变成 Token 卖出去：计量、SLA、多租户、成本→定价与单位经济学",
      learningObjectives: [
        "区分 GPU-hour / Token / 请求 / 业务结果 的计量。",
        "把完全成本摊到每百万 Token，并区分 cost/token 与 cost/success。",
        "用 SLA（TTFT/生成速度/并发）与多租户限流承诺服务。",
        "算 API 与自建的盈亏平衡，配置套餐与 SKU。"
      ],
      tldr: "一句话看懂：我们不是卖卡，是卖“字”（Token）；这一站讲怎么计量、怎么定价、怎么赚钱。",
      intro: "前 9 站把一堆卡变成了一朵能干活的云；这一站讲这朵云怎么对外服务、怎么计费、怎么赚钱。这是新云“买卡→建集群→卖 Token”生意的闭环。",
      concepts: [
        concept({
          id: "token.billing", title: "按 Token 计费", aliases: ["Token 计费", "input token", "output token", "cached token"], tags: ["计费", "Token", "计量"],
          l0: "卖的是“字”不是“卡时”：客户按 Token 付费。而且 input、output、cached、reasoning 等不同 Token 的成本与计算路径不同。",
          l1: "计量可按 GPU-hour、Token、请求或业务结果，粒度越贴近业务价值越好。Token 计费要区分输入/输出/缓存 Token 的不同成本，并用真实分词器计量。",
          decision: "用贴近业务价值的计量单位；对不同 Token 类型分别计价，避免一口价掩盖成本差异。",
          tradeoffs: ["按 Token 贴近成本，但客户更难预估账单", "按请求简单，却可能与真实成本脱节"],
          labTitle: "Token 账单拆解", lab: "对一批真实请求按 input/output/cached 拆解 Token 与成本。",
          success: "能解释同样字数为何账单不同。",
          misconceptions: [["所有 Token 成本一样", "输入/输出/缓存 Token 的计算路径与成本不同。"]],
          sourceIds: ["src.finops.framework"], owner: "商业化与计费", risk: "medium", cadenceDays: 180
        }),
        concept({
          id: "token.sla", title: "服务等级 SLA", aliases: ["SLA", "服务承诺", "TTFT 承诺"], tags: ["SLA", "承诺", "赔付"],
          l0: "对客户承诺服务质量：首字延迟、生成速度、并发上限、可用性，达不到有赔付。SLA 是对外契约，SLO 是内部目标。",
          l1: "SLA 把推理服务指标（TTFT/生成速度/并发/可用性）写成带罚则的承诺；要留足余量并用内部更严的 SLO 保护 SLA。",
          decision: "SLA 承诺留足于内部 SLO 的余量；用容量与限流守住承诺，别把峰值能力当常态承诺。",
          tradeoffs: ["更高 SLA 更好卖，但赔付与成本风险更大", "更保守 SLA 更稳，却竞争力下降"],
          labTitle: "SLA 与 SLO 余量", lab: "为一个 TTFT SLA 反推内部 SLO 与所需容量余量。",
          success: "能用 SLO 余量支撑一个可兑现的 SLA。",
          misconceptions: [["SLA 和 SLO 是一回事", "SLA 对外带罚则，SLO 是更严的内部目标。"]],
          sourceIds: ["src.google.sre-slo"], owner: "商业化与 SRE", risk: "high", cadenceDays: 90
        }),
        concept({
          id: "token.rate-limiting", title: "多租户与限流", aliases: ["多租户", "限流", "配额", "容量保证"], tags: ["多租户", "限流", "配额"],
          l0: "一套集群同时服务很多客户，要用配额与限流划清边界：谁能用多少、峰值怎么排队，保证付费高的有保障。",
          l1: "API 侧多租户靠配额、限流（QPS/并发/Token 速率）与优先级隔离，配合容量保证型 SKU；它与集群侧的 MIG/MPS 隔离是两层。",
          decision: "按套餐设配额与限流，给容量保证客户预留资源；用优先级与排队守护公平与 SLA。",
          tradeoffs: ["强隔离与预留更稳，却降低整体利用率", "超卖提利用率，但高峰可能违约"],
          labTitle: "限流与超卖", lab: "模拟多客户峰值，验证限流与预留能否守住高优客户 SLA。",
          success: "能设计守住 SLA 的多租户限流。",
          misconceptions: [["多租户只要有配额就够", "还需限流、优先级与容量预留，否则高峰互相拖垮。"]],
          sourceIds: ["src.finops.framework"], owner: "平台与商业化", risk: "medium", cadenceDays: 180
        }),
        concept({
          id: "token.pricing", title: "成本 → 定价", aliases: ["定价", "cost/token", "cost/success", "毛利"], tags: ["定价", "成本", "毛利"],
          l0: "一张卡的钱怎么摊到每百万 Token？要算成本/请求、成本/百万 Token，尤其是成本/有效结果——cost/token 变好不等于 cost/success 变好。",
          l1: "定价从完全成本出发，除以利用率与吞吐得到每百万 Token 成本，再叠加毛利与 SLA 赔付风险。要盯 cost/success：重试与低质量输出会让“每个有效结果”更贵。",
          decision: "用完全成本 ÷ 有效吞吐做定价底线；以 cost/success 而非 cost/token 衡量真实经济性。",
          tradeoffs: ["低价抢量但可能亏损", "高价保毛利却影响竞争力"],
          labTitle: "cost/success 反例", lab: "构造一个 cost/token 下降但 cost/success 上升（重试增多）的例子。",
          success: "能解释为何要看每有效结果成本。",
          misconceptions: [["cost/token 降了就是赚了", "重试与低质量会让每个有效结果更贵。"]],
          claimIds: ["claim.unit-econ.cost-success"], sourceIds: ["src.finops.unit-econ"], owner: "FinOps 与商业化", risk: "high", cadenceDays: 90
        }),
        concept({
          id: "token.tcochain", title: "TCO 账链 / 完全成本", aliases: ["TCO", "完全成本", "fully loaded cost", "单位经济学"], tags: ["TCO", "完全成本", "FinOps"],
          l0: "每百万 Token 成本背后是一条账链：卡与折旧、电力、制冷、存储、网络、软件、人力、空闲与冗余，一项都不能漏。",
          l1: "完全成本（fully loaded）把所有摊销加总，再除以利用率与有效吞吐得到单位成本。FinOps 单位经济学把这些支出与业务价值关联，空闲与冗余是常被低估的大头。",
          decision: "用完全成本瀑布核算每百万 Token；把利用率作为最敏感杠杆，先提利用率再谈降价。",
          tradeoffs: ["更细的成本归集更准，却更费数据工程", "更高冗余更稳，但抬高单位成本"],
          labTitle: "完全成本瀑布", lab: "搭一个从卡价到每百万 Token 的完全成本瀑布，做利用率敏感性分析。",
          success: "能定位单位成本的最大杠杆项。",
          misconceptions: [["成本就是卡的折旧", "电力、制冷、网络、人力、空闲与冗余都在账链里。"]],
          claimIds: ["claim.unit-econ.cost-success"], sourceIds: ["src.finops.unit-econ", "src.finops.framework"], owner: "FinOps", risk: "high", cadenceDays: 90
        }),
        concept({
          id: "token.gateway", title: "API 网关与计量", aliases: ["API 网关", "计量", "metering", "闸口"], tags: ["网关", "计量", "限流"],
          l0: "请求进出的收费闸口：网关做鉴权、限流、路由与按 Token 计量，是把服务变成生意的关键一环。",
          l1: "API 网关统一鉴权、配额、限流、路由与计量；计量数据是计费与单位经济学的源头，要准确、可对账、可审计。",
          decision: "把计量做准、可对账；网关承担鉴权/限流/路由，避免每个服务各写一套。",
          tradeoffs: ["网关集中治理省事，却是单点，要做高可用", "更细计量更准，但增加开销"],
          labTitle: "计量对账", lab: "核对网关计量与实际 Token 消耗，找出计量误差来源。",
          success: "能保证计量可对账、可审计。",
          misconceptions: [["计量随便估就行", "计量是计费与单位经济学的源头，必须准确可对账。"]],
          sourceIds: ["src.finops.framework"], owner: "平台与商业化", risk: "medium", cadenceDays: 180
        }),
        concept({
          id: "token.catalog", title: "模型货架", aliases: ["模型货架", "catalog", "模型 SKU"], tags: ["模型", "货架", "SKU"],
          l0: "客户能买到哪些模型与能力，摆在“货架”上：不同模型、上下文长度、模态与价位，像菜单一样清楚。",
          l1: "模型货架把可售能力产品化为 SKU：模型/版本/上下文/模态/价位/SLA，方便客户选择与自助接入，也便于按 SKU 计量与定价。",
          decision: "用清晰 SKU 表达能力与价位，隐藏底层复杂度；上新与下线要有版本与迁移策略。",
          tradeoffs: ["SKU 越多越灵活，却更难维护与解释", "精简货架好懂，但覆盖场景少"],
          labTitle: "货架 SKU 设计", lab: "为一组模型设计 SKU（模型/上下文/价位/SLA）并解释取舍。",
          success: "能设计一份客户看得懂的模型货架。",
          misconceptions: [["把所有模型都上架最好", "过多 SKU 会让客户难选、运维难维护。"]],
          sourceIds: ["src.finops.framework"], owner: "产品与商业化", risk: "low", cadenceDays: 365
        }),
        concept({
          id: "token.pricing-detail", title: "计费的门道（SKU / 缓存折扣）", aliases: ["SKU", "Serverless", "预留吞吐", "缓存命中折扣"], tags: ["计费", "SKU", "折扣"],
          l0: "计费有门道：实时/批量/Serverless/预留吞吐/独占实例各是一种 SKU，input/output/cached Token 差价、缓存命中折扣、峰值与并发保证都影响账单。",
          l1: "不同 SKU 对应不同的容量保证与价格：批量便宜但慢、预留吞吐锁并发、独占实例给隔离；缓存命中（前缀复用）可给折扣。设计要与成本结构对齐。",
          decision: "让 SKU 与真实成本结构对齐（批量便宜、实时贵、缓存给折扣），避免定价与成本倒挂。",
          tradeoffs: ["丰富 SKU 满足更多需求，却更复杂", "缓存折扣吸引客户，但要防滥用"],
          labTitle: "SKU 与成本对齐", lab: "为实时/批量/预留三种 SKU 分别核算成本并定价，检查是否倒挂。",
          success: "能设计与成本对齐、不倒挂的 SKU 价目。",
          misconceptions: [["所有请求一个价最简单最好", "不区分 SKU 会让批量补贴实时、缓存红利被浪费。"]],
          sourceIds: ["src.finops.unit-econ"], owner: "FinOps 与产品", risk: "medium", cadenceDays: 180
        }),
        concept({
          id: "token.spectrum", title: "商业模式光谱", aliases: ["自用", "转售算力", "卖 Token", "卖应用"], tags: ["商业模式", "MaaS"],
          l0: "从自用、转售算力(IaaS)、卖 Token(MaaS)到卖应用，是一条价值与风险递增的光谱；卖 Token 夹在卖算力与卖应用之间。",
          l1: "越往上（卖应用）附加值与毛利越高，但对产品与运营能力要求也越高；卖 Token 用工程能力换毛利，是新云的典型定位。",
          decision: "按自身工程与产品能力在光谱上选位，别一步跨到不擅长的层。",
          tradeoffs: ["越上层毛利越高，能力要求也越高", "越下层越简单，却更同质化、更卷价格"],
          labTitle: "定位与毛利", lab: "为一家新云在光谱上选定位，并解释毛利与能力匹配。",
          success: "能把商业定位与自身能力对齐。",
          misconceptions: [["卖应用一定比卖 Token 好", "上层毛利高，但对产品与获客能力要求也高。"]],
          sourceIds: ["src.finops.framework"], owner: "战略与商业化", risk: "low", cadenceDays: 365
        }),
        concept({
          id: "token.ecosystem", title: "与大厂生态绑定", aliases: ["生态绑定", "借船出海", "受制于人"], tags: ["生态", "绑定", "取舍"],
          l0: "和大厂生态（芯片/框架/云）绑定能“借船出海”快速起量，但也可能“受制于人”——供应、价格与路线都被别人牵着。",
          l1: "生态绑定的取舍是速度与自主的平衡：深度绑定起量快、生态好，但供应链、议价与技术路线风险集中。要保留可迁移抽象与退出路径。",
          decision: "初期可借生态起量，但同步建可迁移抽象与备选供应，避免单点依赖。",
          tradeoffs: ["深绑起量快、生态强，却议价弱、迁移难", "自主可控更稳，但前期更慢更贵"],
          labTitle: "绑定风险评估", lab: "评估一条深度绑定路线的供应、议价与迁移风险，给出对冲。",
          success: "能给出借力与自主的平衡策略。",
          misconceptions: [["绑定大厂就高枕无忧", "供应、价格与路线风险会集中，需要退出路径对冲。"]],
          sourceIds: ["src.nist.cloud"], owner: "战略与商业化", risk: "medium", cadenceDays: 180
        })
      ],
      placements: {
        "billing": "token.billing", "sla": "token.sla", "multitenant": "token.rate-limiting",
        "pricing": "token.pricing", "pricing/tcochain": "token.tcochain", "gateway": "token.gateway",
        "catalog": "token.catalog", "pricingdetail": "token.pricing-detail",
        "adv/spectrum": "token.spectrum", "adv/ecosystem": "token.ecosystem"
      }
    },

    ops: {
      focus: "让几千张卡一直健康跑：盯指标、守 SLO、处理故障、规划容量",
      learningObjectives: [
        "用 SLI/SLO/SLA 与 Error Budget、burn rate 管可靠性。",
        "盯 GPU SM/显存/功率/温度/XID 与利用率核心 KPI。",
        "按 RPO/RTO 做故障响应、恢复与复盘。",
        "用故障域、冗余与容量缓冲做容量规划。"
      ],
      tldr: "一句话看懂：集群建成只是开始——盯仪表盘、守 SLO、处理告警、规划容量，才是每天的真实工作。",
      intro: "集群建成只是开始——让几千张卡日夜健康跑，才是每天的真实工作。运维的日常就三件事：盯着仪表盘、处理告警、规划容量与保养；这一站也把可靠性讲成可预期的工程。",
      concepts: [
        concept({
          id: "ops.monitoring", title: "监控大屏：该看什么", aliases: ["监控", "DCGM", "XID", "追踪"], tags: ["监控", "指标", "追踪"],
          l0: "大屏上盯几类数：GPU 利用率与温度/功率/XID、任务队列、故障告警，以及请求从 queue→prefill→decode→工具的追踪。",
          l1: "GPU 侧用 DCGM 采 SM/显存/功率/温度/XID/PCIe/NVLink；服务侧用统一可观测把请求 trace 与 GPU 时间轴关联。关键是能从一个慢请求下钻到具体 GPU。",
          decision: "把 GPU 指标（DCGM）与请求 trace 打通，别只看孤立大屏数字。",
          tradeoffs: ["采集越全越好定位，但高基数与存储成本上升", "统一可观测好关联，接入有改造成本"],
          labTitle: "请求—GPU 下钻", lab: "从一次慢请求的 trace 下钻到对应 GPU 的 DCGM 指标定位瓶颈。",
          success: "能跨层关联定位一次真实慢请求。",
          misconceptions: [["有大屏就等于会运维", "关键是能从现象下钻到根因，而非只看几个数。"]],
          sourceIds: ["src.nvidia.dcgm", "src.otel"], owner: "运维与可观测性", risk: "medium", cadenceDays: 180
        }),
        concept({
          id: "ops.utilization", title: "GPU 利用率为何是核心 KPI", aliases: ["利用率", "有效训练时间", "空转"], tags: ["利用率", "KPI", "有效时间"],
          l0: "一张训练卡一年成本几十万级别，利用率 50% 就等于一半钱打水漂；让卡时刻有活干是算力运营第一要务。",
          l1: "利用率要看“有效”利用：训练还要看 queue wait、启动率、完成率与有效训练时间；单纯 GPU 忙不等于在产出价值。",
          decision: "以有效利用率而非瞬时忙闲为 KPI；把排队、调度与拼任务作为提利用率的抓手。",
          tradeoffs: ["追高利用率省钱，但过满会抬尾延迟与故障风险", "留缓冲更稳，却降低利用率"],
          labTitle: "有效利用率核算", lab: "把一段训练的墙钟时间拆成排队/启动/有效/故障，算有效训练时间占比。",
          success: "能区分“卡在忙”与“在产出价值”。",
          misconceptions: [["GPU 忙就是高利用率", "忙不等于有效，要看有效训练/服务时间。"]],
          sourceIds: ["src.nvidia.dcgm", "src.finops.unit-econ"], owner: "算力运营", risk: "high", cadenceDays: 90
        }),
        concept({
          id: "ops.slo", title: "SLI / SLO / SLA 与 Error Budget", aliases: ["SLI", "SLO", "SLA", "Error Budget", "burn rate", "p99"], tags: ["SLO", "错误预算", "burn rate"],
          l0: "用 SLI（用户真实体验的指标）定 SLO（内部目标），SLA 是带罚则的对外承诺；错误预算=100%−SLO，burn rate 是消耗预算的速度。",
          l1: "可靠性指标含可用性、成功率、TTFT/TPOT/E2E 与质量，看 p50/95/99 而非平均。错误预算把“允许多不可靠”量化；多窗口多 burn-rate 告警在预算快烧完时才 page，减少噪声。",
          decision: "为关键服务定 SLI/SLO 与错误预算，用多 burn-rate 告警；预算用尽就停止高风险变更。",
          tradeoffs: ["更高 SLO 更可靠，但成本与迭代速度下降", "更灵敏告警早发现，却更多噪声"],
          labTitle: "错误预算与 burn rate", lab: "为一个 99.9% SLO 算错误预算，并设计多窗口 burn-rate 告警阈值。",
          success: "能用错误预算与 burn rate 管理发布与告警。",
          misconceptions: [["SLA 就是 SLO", "SLA 对外带罚则，SLO 是更严的内部目标，别混用。"], ["看平均延迟就够", "尾延迟 p95/p99 才反映真实体验。"]],
          claimIds: ["claim.error-budget", "claim.burn-rate.page"], sourceIds: ["src.google.sre-slo", "src.google.sre-alert"], owner: "SRE", risk: "high", cadenceDays: 90
        }),
        concept({
          id: "ops.incident", title: "故障响应与恢复（掉卡之夜）", aliases: ["掉卡", "故障响应", "RPO", "RTO", "复盘"], tags: ["故障", "恢复", "复盘"],
          l0: "半夜掉一张卡：自动告警→隔离故障机→备机顶上→从最近 Checkpoint 恢复→训练继续；全程主要靠自动化，人只做关键确认。",
          l1: "故障覆盖 GPU/节点/网络/存储/CDU/供电等；恢复用备机、切流、限流降级与回滚，训练靠 RPO/RTO 与 Checkpoint 恢复。事后要做无责复盘，把一次事故变成系统改进。",
          decision: "把常见故障做成自动检测—隔离—恢复的剧本；每次事故都产出可执行的复盘改进。",
          tradeoffs: ["更多自动化恢复更快，却要防误动作", "更快切流保可用，可能牺牲一致性"],
          labTitle: "掉卡恢复演练", lab: "演练一次掉卡：从告警到隔离、备机、Checkpoint 恢复，量化真实 RTO。",
          success: "能跑通一次可量化 RTO 的恢复演练。",
          misconceptions: [["有告警就等于能恢复", "恢复要靠自动化剧本与演练，否则真出事仍手忙脚乱。"]],
          sourceIds: ["src.google.sre-slo"], owner: "SRE 与运维", risk: "high", cadenceDays: 90
        }),
        concept({
          id: "ops.maintenance", title: "巡检、演练与限流降级", aliases: ["巡检", "保养", "演练", "限流降级"], tags: ["巡检", "演练", "降级"],
          l0: "定期升级固件、清灰换件、更换早期故障征兆的部件、演练断电与切流；保养做得勤，半夜的告警就少。",
          l1: "预防性维护 + 定期演练把“救火”变“可预期”。限流、降级、扩容、回滚、切流是高峰与故障时的标准手段，要事先定义触发条件与顺序。",
          decision: "把巡检与演练排进日历；预先定义限流/降级/切流的触发线与顺序，别临场决定。",
          tradeoffs: ["更勤保养更稳，但占用维护窗口", "更激进降级保可用，却牺牲体验"],
          labTitle: "降级预案演练", lab: "为一次容量不足定义限流→降级→扩容的顺序并演练。",
          success: "能给出可执行的降级/扩容预案。",
          misconceptions: [["没坏就不用维护", "预防性维护与演练能显著减少半夜告警。"]],
          sourceIds: ["src.google.sre-slo"], owner: "运维工程", risk: "medium", cadenceDays: 180
        }),
        concept({
          id: "ops.capacity", title: "容量规划与故障域", aliases: ["容量规划", "故障域", "冗余", "备机", "容量缓冲"], tags: ["容量", "故障域", "冗余"],
          l0: "够不够用、稳不稳：用故障域、冗余、备机和容量缓冲把可靠性做成可预期的工程，而不是等出事再加机器。",
          l1: "容量规划按需求预测与水位设扩容触发线，留容量缓冲吸收峰值与故障；故障域划分让单点故障不扩散，备机与冗余保证可维护性。错误预算也能反过来指导容量投入。",
          decision: "按水位与错误预算定扩容触发线与缓冲；用故障域隔离，避免单点拖垮全局。",
          tradeoffs: ["更大缓冲更稳，但降低利用率、抬成本", "更细故障域更稳，却增加架构复杂度"],
          labTitle: "水位与扩容线", lab: "根据用量预测设定容量水位与扩容触发线，并校验故障域隔离。",
          success: "能给出带缓冲与故障域的容量方案。",
          misconceptions: [["容量不够再加机器就行", "无预测与缓冲会在高峰/故障时来不及，需提前规划。"]],
          sourceIds: ["src.google.sre-slo"], owner: "容量与 SRE", risk: "high", cadenceDays: 90
        })
      ],
      placements: {
        "monitor": "ops.monitoring", "monitor/utilization": "ops.utilization",
        "alerts": "ops.slo", "alerts/dropnight": "ops.incident",
        "maintenance": "ops.maintenance", "capacity": "ops.capacity",
        "adv/reliability": "ops.slo"
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
      status: "released"
    },
    "placement.dc.adv": {
      id: "placement.dc.adv",
      kind: "collection",
      stationId: "dc",
      legacyPath: ["adv"],
      legacyRoute: "#/s/dc/adv",
      status: "released"
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
        status: "released"
      };
    });
    const sourceIds = Array.from(new Set(draft.concepts.flatMap(item => item.sourceIds || [])));
    stationProfiles[stationId] = {
      version: "V4",
      status: "released",
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
    "rel.rack-contains-system": { fromConceptId: "facility.rack.capacity-envelope", type: "constrains", toConceptId: "hw.system.rack-scale-domain" },
    "rel.fabric-enables-collectives": { fromConceptId: "net.compute-fabric", type: "enables", toConceptId: "net.collective-comms" },
    "rel.topology-enables-collectives": { fromConceptId: "net.topology-rail", type: "enables", toConceptId: "net.collective-comms" },
    "rel.straggler-constrains-fabric": { fromConceptId: "net.sync-straggler", type: "constrains", toConceptId: "net.compute-fabric" },
    "rel.congestion-mitigates-straggler": { fromConceptId: "net.congestion-optics", type: "mitigates", toConceptId: "net.sync-straggler" },
    "rel.scaleout-contrasts-scaleup": { fromConceptId: "net.compute-fabric", type: "contrasts_with", toConceptId: "hw.interconnect.nvlink-nvswitch" },
    "rel.storagenet-contrasts-computenet": { fromConceptId: "net.storage-fabric", type: "contrasts_with", toConceptId: "net.compute-fabric" },
    "rel.transport-implements-fabric": { fromConceptId: "net.transport-choice", type: "implemented_by", toConceptId: "net.compute-fabric" },
    "rel.pipeline-feeds-storage": { fromConceptId: "data.pipeline-lineage", type: "enables", toConceptId: "data.storage-tiers" },
    "rel.tiers-enable-pfs": { fromConceptId: "data.storage-tiers", type: "enables", toConceptId: "data.parallel-fs" },
    "rel.pfs-feeds-gpu": { fromConceptId: "data.parallel-fs", type: "enables", toConceptId: "hw.gpu.execution-model" },
    "rel.economics-partof-checkpoint": { fromConceptId: "data.checkpoint-economics", type: "part_of", toConceptId: "data.checkpoint-state" },
    "rel.checkpoint-mitigates-straggler": { fromConceptId: "data.checkpoint-state", type: "mitigates", toConceptId: "net.sync-straggler" },
    "rel.governance-constrains-pipeline": { fromConceptId: "data.governance-privacy", type: "constrains", toConceptId: "data.pipeline-lineage" },
    "rel.tiers-prereq-rag": { fromConceptId: "data.storage-tiers", type: "prerequisite_for", toConceptId: "data.vector-rag" },
    "rel.driver-enables-gpu": { fromConceptId: "platform.driver-firmware", type: "enables", toConceptId: "hw.gpu.execution-model" },
    "rel.driver-prereq-container": { fromConceptId: "platform.driver-firmware", type: "prerequisite_for", toConceptId: "platform.container" },
    "rel.primitives-partof-scheduler": { fromConceptId: "platform.scheduling-primitives", type: "part_of", toConceptId: "platform.scheduler" },
    "rel.scheduler-enables-platform": { fromConceptId: "platform.scheduler", type: "enables", toConceptId: "platform.user-platform" },
    "rel.primitives-enable-multitenancy": { fromConceptId: "platform.scheduling-primitives", type: "enables", toConceptId: "platform.multitenancy" },
    "rel.platform-measured-by-observability": { fromConceptId: "platform.user-platform", type: "measured_by", toConceptId: "platform.observability" },
    "rel.mlops-impl-registry": { fromConceptId: "platform.mlops", type: "implemented_by", toConceptId: "platform.registry" },
    "rel.rail-enables-topology-aware": { fromConceptId: "net.topology-rail", type: "enables", toConceptId: "platform.scheduling-primitives" },
    "rel.parallelism-partof-training": { fromConceptId: "model.parallelism-5d", type: "part_of", toConceptId: "model.training-overview" },
    "rel.lora-partof-finetune": { fromConceptId: "model.lora", type: "part_of", toConceptId: "model.finetune" },
    "rel.collectives-enable-parallelism": { fromConceptId: "net.collective-comms", type: "enables", toConceptId: "model.parallelism-5d" },
    "rel.kv-enables-inference": { fromConceptId: "model.kv-cache", type: "enables", toConceptId: "model.inference-overview" },
    "rel.batching-enables-framework": { fromConceptId: "model.continuous-batching", type: "enables", toConceptId: "model.serving-framework" },
    "rel.inference-measured-by-metrics": { fromConceptId: "model.inference-overview", type: "measured_by", toConceptId: "model.serving-metrics" },
    "rel.moe-impl-parallelism": { fromConceptId: "model.moe", type: "implemented_by", toConceptId: "model.parallelism-5d" },
    "rel.kv-constrains-longctx": { fromConceptId: "model.kv-cache", type: "constrains", toConceptId: "model.long-context" },
    "rel.speculative-impl-framework": { fromConceptId: "model.speculative", type: "implemented_by", toConceptId: "model.serving-framework" },
    "rel.private-mitigates-governance": { fromConceptId: "delivery.private", type: "mitigates", toConceptId: "data.governance-privacy" },
    "rel.multicloud-mitigates-migration": { fromConceptId: "delivery.multicloud", type: "mitigates", toConceptId: "delivery.migration" },
    "rel.tco-prereq-pricing": { fromConceptId: "token.tcochain", type: "prerequisite_for", toConceptId: "token.pricing" },
    "rel.sla-measured-by-metrics": { fromConceptId: "token.sla", type: "measured_by", toConceptId: "model.serving-metrics" },
    "rel.ratelimit-contrasts-multitenancy": { fromConceptId: "token.rate-limiting", type: "contrasts_with", toConceptId: "platform.multitenancy" },
    "rel.billing-measured-by-gateway": { fromConceptId: "token.billing", type: "measured_by", toConceptId: "token.gateway" },
    "rel.monitoring-partof-observability": { fromConceptId: "ops.monitoring", type: "part_of", toConceptId: "platform.observability" },
    "rel.utilization-partof-monitoring": { fromConceptId: "ops.utilization", type: "part_of", toConceptId: "ops.monitoring" },
    "rel.checkpoint-mitigates-incident": { fromConceptId: "data.checkpoint-economics", type: "mitigates", toConceptId: "ops.incident" },
    "rel.slo-underpins-sla": { fromConceptId: "ops.slo", type: "prerequisite_for", toConceptId: "token.sla" },
    "rel.slo-prereq-capacity": { fromConceptId: "ops.slo", type: "prerequisite_for", toConceptId: "ops.capacity" }
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
      },
      {
        kind: "决策题",
        question: "一个 130GB（BF16 权重）的模型放不进单张 80GB 卡做推理，最直接的办法是？",
        options: ["把 batch 调大", "张量/流水并行拆到多卡，或量化降位宽", "把风扇转速调高"],
        answer: 1,
        explanation: "单卡放不下就分片（TP/PP）或量化降显存；batch 和散热都不解决容量问题。"
      },
      {
        kind: "口径题",
        question: "“峰值 FLOPS 更高”能直接等于“模型跑得更快”吗？",
        options: ["不能，还要看精度、并行与数据供给能否喂满这些算力", "能，越高一定越快", "只有训练时成立"],
        answer: 0,
        explanation: "峰值只是上限；Roofline 上还要看是否被显存带宽或数据供给卡住。"
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
      },
      {
        kind: "拓扑题",
        question: "让 8 张卡“像一张大卡”在机内协同，主要靠什么？",
        options: ["NVLink/NVSwitch 的机内高速互联", "更大的系统内存", "更多的普通网口"],
        answer: 0,
        explanation: "机内 scale-up 靠 NVLink 域；跨机 scale-out 才用 InfiniBand/以太网。"
      },
      {
        kind: "可靠性题",
        question: "看到整机装了 6 个电源模块，就能断定它“断电不停机”吗？",
        options: ["能，模块多就一定冗余", "不能，要看冗余方式（如 5+1）、当前负载与上游接线", "只看总功率即可"],
        answer: 1,
        explanation: "模块数量不等于容错结果，必须结合冗余配置、实际负载与供电路径。"
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
      },
      {
        kind: "计算题",
        question: "IT 负载 8 MW、PUE = 1.25，设施总功率约为？",
        options: ["6.4 MW", "8 MW", "10 MW"],
        answer: 2,
        explanation: "总设施功率 = PUE × IT = 1.25 × 8 = 10 MW。"
      },
      {
        kind: "边界题",
        question: "“凡是 AI 服务器都必须上液冷”这句话对吗？",
        options: ["对，全部都要", "不对，液冷是特定高密度产品/机架的条件，不是行业通则", "只有推理机要"],
        answer: 1,
        explanation: "是否液冷取决于功率热密度与具体产品，不能一概外推。"
      }
    ],
    network: [
      {
        kind: "决策题",
        question: "同步训练里，一步的整体耗时最接近哪一项？",
        options: ["所有节点的平均耗时", "最慢参与者的耗时", "最快参与者的耗时"],
        answer: 1,
        explanation: "每次集合通信都是同步点，整步时间由最慢参与者决定，所以尾延迟和慢节点最关键。"
      },
      {
        kind: "判断题",
        question: "关于以太网跑 RDMA（RoCEv2），哪项最准确？",
        options: ["用 InfiniBand 就一定比以太网便宜", "无损依赖 PFC/ECN/DCQCN 的正确配置与全链路一致", "UEC 1.0 一发布就代表大规模稳定生产"],
        answer: 1,
        explanation: "RoCEv2 的“无损”是系统工程，靠拥塞机制配套；成本高低与规范新旧都要按实测判断。"
      },
      {
        kind: "概念题",
        question: "按 NCCL 文档，AllReduce 可以由哪组操作等价实现？",
        options: ["ReduceScatter + AllGather", "Broadcast + Broadcast", "All-to-All + Reduce"],
        answer: 0,
        explanation: "AllReduce 等价于 ReduceScatter 后接 AllGather（也等价于 Reduce+Broadcast），实现选择影响带宽与延迟。"
      },
      {
        kind: "拓扑题",
        question: "rail-optimized 集群里有一处网线错插，最直接的后果是？",
        options: ["机房 PUE 上升", "多卡显存自动合并", "破坏 rail 局部性，增加跨交换机跳数与拥塞"],
        answer: 2,
        explanation: "rail 对齐依赖精确布线，miswire 会让流量多绕交换机，拉低集合通信有效带宽。"
      },
      {
        kind: "概念题",
        question: "MoE 的专家并行（EP）最典型的跨卡集合通信是？",
        options: ["AllReduce", "All-to-All", "Broadcast"],
        answer: 1,
        explanation: "EP 的 token 路由靠 All-to-All，跨机时最容易打爆带宽。"
      },
      {
        kind: "诊断题",
        question: "RoCE 集群频繁 PFC pause 且吞吐塌陷，最该先查什么？",
        options: ["机房温度", "显示器分辨率", "PFC/ECN 门限与全链路一致性（pause 风暴）"],
        answer: 2,
        explanation: "PFC 过度触发会 pause 风暴、队头阻塞，需要 ECN/DCQCN 配合整定。"
      }
    ],
    data: [
      {
        kind: "诊断题",
        question: "训练时 GPU 利用率偏低、但算子本身很快，最先怀疑什么？",
        options: ["机房消防", "数据供给（加载/存储）跟不上，GPU 在等数据", "Token 价格"],
        answer: 1,
        explanation: "利用率低常是数据供给瓶颈，应检查并行 FS 吞吐、prefetch、pin_memory 与 H2D 重叠。"
      },
      {
        kind: "口径题",
        question: "关于 RPO 与 RTO，哪项最准确？",
        options: ["RPO 是可容忍的数据/进度丢失，RTO 是可容忍的恢复时长", "两者都指存档文件大小", "RPO 是网络延迟，RTO 是温度阈值"],
        answer: 0,
        explanation: "用 RPO/RTO 反推存档间隔与介质，并靠恢复演练验证真实 RTO。"
      },
      {
        kind: "判断题",
        question: "要能“精确续训”，Checkpoint 至少还必须包含权重之外的什么？",
        options: ["机柜温度日志", "优化器状态、RNG 与数据加载进度等完整状态", "网卡端口灯颜色"],
        answer: 1,
        explanation: "只存权重通常无法精确续训；分布式场景还要一致地保存/加载各 rank 分片。"
      },
      {
        kind: "概念题",
        question: "把向量库接上就等于把 RAG 做好了吗？",
        options: ["是，检索到就行", "不是，切块/检索/重排/引用/评测每一环都决定效果", "RAG 一定优于微调"],
        answer: 1,
        explanation: "RAG 是一条链，效果要用召回、精度、引用率与端到端评测验收。"
      },
      {
        kind: "决策题",
        question: "训练的 Checkpoint 存档间隔应该怎么定？",
        options: ["越短越好", "越长越好，能省算力", "按 RPO/RTO 平衡存档开销与故障损失"],
        answer: 2,
        explanation: "用 RPO/RTO 反推间隔，异步存档降停顿，并靠恢复演练验证真实 RTO。"
      },
      {
        kind: "架构题",
        question: "对象存储与并行文件系统在训练里的分工是？",
        options: ["对象存储直接扛训练时的高并发直读", "对象存储当便宜大粮仓，训练时热数据搬到并行 FS/本地 NVMe 高并发直读", "两者完全等价"],
        answer: 1,
        explanation: "分层：对象存储长期便宜存放，并行 FS 提供训练开饭时的聚合高吞吐。"
      }
    ],
    platform: [
      {
        kind: "角色题",
        question: "Kueue 在 Kubernetes 上主要负责什么？",
        options: ["替换核心调度器", "作业排队、配额与全有或全无的 gang 准入", "给 GPU 降温"],
        answer: 1,
        explanation: "Kueue 是准入/排队层，配合核心调度器做配额、公平共享与 gang admission，不替换它。"
      },
      {
        kind: "判断题",
        question: "关于 MIG 与 MPS，哪项最准确？",
        options: ["两者完全一样", "MIG 只用于推理，MPS 只用于训练", "MIG 是硬件隔离切分，MPS 是并发共享、隔离更弱"],
        answer: 2,
        explanation: "选 MIG 还是 MPS 取决于隔离强度与利用率的权衡，二者也可组合。"
      },
      {
        kind: "概念题",
        question: "分布式训练为什么需要 gang scheduling？",
        options: ["避免只占到部分卡而死锁、互相空等", "让 GPU 温度更低", "自动合并显存"],
        answer: 0,
        explanation: "gang 的全有或全无避免作业半占资源导致的死锁与浪费。"
      },
      {
        kind: "边界题",
        question: "NVIDIA GPU Operator 主要自动管理哪些东西？",
        options: ["Token 定价", "驱动、容器工具包、设备插件、DCGM 与节点生命周期", "机房消防"],
        answer: 1,
        explanation: "它用 operator 框架把 GPU 软件栈装好、验证并纳入节点生命周期管理。"
      },
      {
        kind: "架构题",
        question: "把一堆机器变成“一朵云”、让任务自动排队/分配/回收，靠哪一层？",
        options: ["驱动与固件层", "调度层（Slurm/Kubernetes/Kueue 等）", "容器层"],
        answer: 1,
        explanation: "调度平台负责队列、配额、抢占与回收，是从裸机到云的关键一步。"
      },
      {
        kind: "概念题",
        question: "MIG 和 MPS 的核心区别是？",
        options: ["MIG 是硬件隔离切分实例，MPS 是并发共享同一张卡", "两者都是显存压缩", "MIG 只能用于推理"],
        answer: 0,
        explanation: "MIG 硬件隔离、性能可预期；MPS 并发共享、隔离较弱，按隔离与利用率取舍。"
      }
    ],
    model: [
      {
        kind: "并行题",
        question: "把大模型切到多卡训练时，global batch 应怎么算？",
        options: ["只看单卡 batch", "按 DP × 梯度累积 × micro-batch 综合计算", "等于 GPU 数量"],
        answer: 1,
        explanation: "算错 global batch 会影响学习率与收敛；FSDP2 用 DeviceMesh/DTensor 表达分片。"
      },
      {
        kind: "推理题",
        question: "推理里 KV Cache 的主要代价是什么？",
        options: ["占显存，且随上下文长度膨胀", "让 GPU 降温", "减少模型参数量"],
        answer: 0,
        explanation: "KV 随对话变长而膨胀，是长上下文的主要成本，需分页/前缀复用/及时清理。"
      },
      {
        kind: "判断题",
        question: "投机解码会改变模型输出分布吗？",
        options: ["会，质量会下降", "不会，校验保证输出分布一致", "只对短文本有效"],
        answer: 1,
        explanation: "大模型校验草稿的接受/拒绝，输出分布与直接解码一致；它只加速。"
      },
      {
        kind: "架构题",
        question: "MoE 在单个 token 上的计算特点是？",
        options: ["不需要任何通信", "激活全部专家，计算随总参数线性增长", "只激活部分专家，计算不随总参数线性增长"],
        answer: 2,
        explanation: "稀疏激活让总参数大但单 token 激活参数少；代价是路由均衡与专家并行通信。"
      },
      {
        kind: "概念题",
        question: "推理里“读题(Prefill)”与“写答(Decode)”脾气不同，PD 分离图的是什么？",
        options: ["省电", "提高模型精度", "让吃算力的 Prefill 与吃带宽的 Decode 各用所长、互不拖累"],
        answer: 2,
        explanation: "分离后长文档读题不拖累其他人写答，首字延迟更稳、整体又快又省。"
      },
      {
        kind: "口径题",
        question: "投机解码能加速生成，它会改变模型的输出分布吗？",
        options: ["会，质量会下降", "不会，小模型起草、大模型校验，输出分布保持一致（约 2–3×）", "只对小模型有效"],
        answer: 1,
        explanation: "大模型负责校验，最终分布与原模型一致，速度却明显提升。"
      }
    ],
    delivery: [
      {
        kind: "决策题",
        question: "客户说“数据绝对不能出我们的机房”，最先考虑哪类？",
        options: ["专有云或自建", "公有云按量", "公有云包期"],
        answer: 0,
        explanation: "数据不出门是专有云与自建的核心卖点，再按投入与团队二选一。"
      },
      {
        kind: "判断题",
        question: "关于按量与包期，哪项最准确？",
        options: ["长期稳定负载下包期通常单位成本更低", "按量永远最省", "包期永远最省"],
        answer: 0,
        explanation: "按利用率决定：波动/短期用按量，稳定长期用包期。"
      },
      {
        kind: "概念题",
        question: "换供应商/换芯片时最容易被低估的迁移成本是？",
        options: ["改机房灯光", "算子、框架、调度与 API 的适配", "把模型文件拷过去"],
        answer: 1,
        explanation: "国产算力迁移尤其涉及芯片/互联/算子/框架/调度/模型适配，是迁移大头。"
      },
      {
        kind: "容灾题",
        question: "多云/多地域最主要的收益与代价是？",
        options: ["零成本、自动更可靠", "降单点，但增加一致性与运维复杂度", "自动更便宜"],
        answer: 1,
        explanation: "多云降单点与议价，但要处理数据同步、一致性与切流演练。"
      },
      {
        kind: "决策题",
        question: "客户说“数据绝对不能出我们机房”，最先考虑哪类交付？",
        options: ["公有云按量", "专有云 / 自建（数据不出门）", "公有云包期"],
        answer: 1,
        explanation: "数据驻留是硬约束，先锁专有云/自建，再按团队能力与规模二选一。"
      },
      {
        kind: "风险题",
        question: "做交付选型时，最该先想清楚的“退路”是什么？",
        options: ["机箱颜色", "数据/环境/算子/框架/API 的锁定与退出路径", "机房地板承重"],
        answer: 1,
        explanation: "选型即想退路：数据能否带走、环境是否标准、依赖是否可替换、如何回退。"
      }
    ],
    token: [
      {
        kind: "口径题",
        question: "我们这门生意卖给客户的到底是什么？",
        options: ["Token（模型生成的“字”）", "裸的 GPU 卡", "机柜"],
        answer: 0,
        explanation: "卖的是 Token（MaaS），夹在卖算力与卖应用之间。"
      },
      {
        kind: "成本题",
        question: "cost/token 下降但 cost/success 反而上升，通常因为？",
        options: ["机房变冷了", "重试增多或输出质量下降", "Token 单价变便宜"],
        answer: 1,
        explanation: "要看每有效结果成本；低质量与重试会让 cost/success 变差。"
      },
      {
        kind: "计费题",
        question: "完全成本（TCO）账链里最常被低估的是？",
        options: ["卡的折旧", "空闲与冗余等摊销", "显示器"],
        answer: 1,
        explanation: "电力、制冷、网络、人力、空闲与冗余都在账链里，利用率是最敏感杠杆。"
      },
      {
        kind: "承诺题",
        question: "SLA 与 SLO 的关系，哪项准确？",
        options: ["SLA 是对外带罚则的承诺，SLO 是更严的内部目标", "两者完全相同", "SLO 对外，SLA 对内"],
        answer: 0,
        explanation: "用更严的内部 SLO 留足余量来兑现对外 SLA。"
      },
      {
        kind: "成本题",
        question: "“每百万 Token 成本”主要被什么拉动？",
        options: ["机房面积", "卡成本/电费的摊销与利用率", "显示器数量"],
        answer: 1,
        explanation: "利用率越低，单位 Token 成本越高；沿 TCO 账链倒推定价。"
      },
      {
        kind: "口径题",
        question: "只要把 cost/token 压低，就一定更划算吗？",
        options: ["是，越低越好", "不一定，若有效结果率低，cost/success 反而可能更高", "只看吞吐即可"],
        answer: 1,
        explanation: "要看每“办成的事”的成本；Token 便宜不等于结果便宜。"
      }
    ],
    ops: [
      {
        kind: "口径题",
        question: "Error Budget（错误预算）怎么算？",
        options: ["100% − SLO", "SLO 的两倍", "等于 SLA"],
        answer: 0,
        explanation: "错误预算是允许的不可靠额度；burn rate 是相对 SLO 消耗它的速度。"
      },
      {
        kind: "指标题",
        question: "衡量用户真实体验，最该重点看哪类延迟？",
        options: ["平均延迟", "p95/p99 尾延迟", "CPU 温度"],
        answer: 1,
        explanation: "尾延迟比平均更能反映真实体验，所以要看 p95/p99。"
      },
      {
        kind: "KPI 题",
        question: "为什么 GPU 利用率是算力运营的核心 KPI？",
        options: ["空转的每一小时都在烧钱", "利用率高机房更凉", "和成本无关"],
        answer: 0,
        explanation: "卡成本高，空转即浪费；还要看有效训练/服务时间而非瞬时忙闲。"
      },
      {
        kind: "恢复题",
        question: "半夜掉一张卡还能较快恢复，主要靠什么？",
        options: ["从最近 Checkpoint 恢复 + 自动化剧本", "从头重新训练", "换一个模型"],
        answer: 0,
        explanation: "存档（第 5 站）加自动化隔离/备机/恢复剧本，把损失控制在很小。"
      },
      {
        kind: "计算题",
        question: "SLO = 99.9% 时，错误预算（Error Budget）约为多少？",
        options: ["0.1%", "1%", "10%"],
        answer: 0,
        explanation: "Error Budget = 100% − SLO = 0.1% 的允许失败额度。"
      },
      {
        kind: "诊断题",
        question: "多窗口燃尽率告警里，1 小时窗 burn rate > 14.4 通常意味着？",
        options: ["可以忽略", "错误预算正被快速烧掉，应立即分页响应", "服务非常健康"],
        answer: 1,
        explanation: "高 burn rate 表示预算快速消耗，Google SRE 示例阈值即触发分页。"
      }
    ]
  };

  window.CONTENT_V4 = {
    meta: {
      schemaVersion: "4.0.0",
      version: "4.0.0",
      datasetVersion: "2026.07.12.2",
      locale: "zh-CN",
      contentAsOf: CONTENT_AS_OF,
      migratedStations: ["gpu", "server", "dc", "network", "data", "platform", "model", "delivery", "token", "ops"],
      status: "released"
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
