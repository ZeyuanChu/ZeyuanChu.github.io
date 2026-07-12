# 算力之旅 V4 · 知识核验记录（Source Verification Log）

内容口径截至 2026-07-12 ｜ 版本 4.0.0 ｜ 每条会过时的数字均带来源、口径(asOf)与成熟度(maturity)。

## 一、结构化事实（claims）→ 来源

| Claim | 值 | 口径 asOf | 成熟度 | 来源（可点击）|
|---|---|---|---|---|
| `claim.gpu.roofline` | 算力上限 × 带宽上限 | 稳定原理 | 工程方法 | [NVIDIA：GPU Performance Background User's Guide](https://docs.nvidia.com/deeplearning/performance/dl-performance-gpu-background/index.html) |
| `claim.dgx-b200.memory` | 1,440 GB | 2026-07-12 | 产品规格快照 | [NVIDIA：Introduction to NVIDIA DGX B200 Systems](https://docs.nvidia.com/dgx/dgxb200-user-guide/introduction-to-dgxb200.html) |
| `claim.dgx-b200.bandwidth` | 64 TB/s | 2026-07-12 | 产品规格快照 | [NVIDIA：Introduction to NVIDIA DGX B200 Systems](https://docs.nvidia.com/dgx/dgxb200-user-guide/introduction-to-dgxb200.html) |
| `claim.dgx-b200.power` | 约 14.3 kW | 2026-07-12 | 产品规格快照 | [NVIDIA：Introduction to NVIDIA DGX B200 Systems](https://docs.nvidia.com/dgx/dgxb200-user-guide/introduction-to-dgxb200.html) |
| `claim.precision.layout` | BF16：8 位指数 / 7 位尾数 | 稳定定义 | 数据格式 | [NVIDIA：Transformer Engine — Low Precision Training](https://docs.nvidia.com/deeplearning/transformer-engine-releases/release-2.16/user-guide/features/low_precision_training/introduction/introduction.html) |
| `claim.nvl72.domain` | 72 GPU NVLink 域 | 2026-07-12 | 产品规格快照 | [NVIDIA：NVIDIA Multi-Node NVLink Systems](https://docs.nvidia.com/multi-node-nvlink-systems/index.html) |
| `claim.pcie6.x16` | 64 GT/s | PCIe 6.0 | 已发布规范 | [PCI-SIG：PCI Express 6.0 Specification](https://pcisig.com/pci-express-6.0-specification) |
| `claim.dgx-b200.psu` | 6 × 3.3 kW PSU | 2026-07-12 | 产品规格快照 | [NVIDIA：Introduction to NVIDIA DGX B200 Systems](https://docs.nvidia.com/dgx/dgxb200-user-guide/introduction-to-dgxb200.html) |
| `claim.dgx-b200.mass` | 142.4 kg / 10U | 2026-07-12 | 产品规格快照 | [NVIDIA：Introduction to NVIDIA DGX B200 Systems](https://docs.nvidia.com/dgx/dgxb200-user-guide/introduction-to-dgxb200.html) |
| `claim.pue.definition` | PUE = 总设施能耗 ÷ IT 能耗 | 稳定定义 | 能效指标 | [The Green Grid：Power Usage Effectiveness](https://www.thegreengrid.org/resources/glossary?combine=pue)<br>[U.S. Department of Energy：Best Practices Guide for Energy-Efficient Data Center Design](https://www.energy.gov/cmei/femp/articles/best-practices-guide-energy-efficient-data-center-design) |
| `claim.liquid.product-boundary` | 液冷是产品条件，不是行业通则 | 2026-07-12 | 趋势边界 | [NVIDIA：NVIDIA Multi-Node NVLink Systems](https://docs.nvidia.com/multi-node-nvlink-systems/index.html)<br>[Open Compute Project：Open Rack V3 Blind Mate Manifold Specification](https://www.opencompute.org/documents/open-rack-v3-blind-mate-manifold-specification-rev-1-0-review-april05-2024-pdf) |
| `claim.tier.outcomes` | Tier III：并发可维护 | 稳定定义 | 设施标准 | [Uptime Institute：Explaining the Tier Classification System](https://journal.uptimeinstitute.com/explaining-uptime-institutes-tier-classification-system/) |
| `claim.fire.boundary` | 消防方案需按规范与风险组合 | 2026-07-12 | 安全边界 | [NIST：Clean Agent Suppression of Energized Electrical Equipment Fires](https://www.nist.gov/publications/clean-agent-suppression-energized-electrical-equipment-fires-0) |
| `claim.allreduce.equivalence` | AllReduce ≡ ReduceScatter + AllGather | 稳定定义 | 集合通信语义 | [NVIDIA：NCCL User Guide — Collective Operations](https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/usage/collectives.html) |
| `claim.uec.spec1` | UEC 规范 1.0（2025-06） | 2025-06-11 | 已发布规范 | [Ultra Ethernet Consortium：Ultra Ethernet Consortium Launches Specification 1.0](https://ultraethernet.org/ultra-ethernet-consortium-uec-launches-specification-1-0-transforming-ethernet-for-ai-and-hpc-at-scale/) |
| `claim.rail.scalable-unit` | rail-optimized：每张 NIC 接不同 leaf | 2026-07-12 | 参考架构 | [NVIDIA：HGX AI Factory — Networking Physical Topologies](https://docs.nvidia.com/enterprise-reference-architectures/hgx-ai-factory/latest/networking-physical-topologies.html) |
| `claim.roce.lossless-pillars` | RoCEv2 无损常靠 PFC + ECN + DCQCN | 2026-07-12 | 工程方法 | [Ultra Ethernet Consortium：Ultra Ethernet Consortium Launches Specification 1.0](https://ultraethernet.org/ultra-ethernet-consortium-uec-launches-specification-1-0-transforming-ethernet-for-ai-and-hpc-at-scale/)<br>[NVIDIA：HGX AI Factory — Networking Physical Topologies](https://docs.nvidia.com/enterprise-reference-architectures/hgx-ai-factory/latest/networking-physical-topologies.html) |
| `claim.gds.direct-path` | GDS：存储↔GPU 显存 DMA 直连 | 2026-07-12 | 工程方法 | [NVIDIA：GPUDirect Storage Overview Guide](https://docs.nvidia.com/gpudirect-storage/overview-guide/index.html) |
| `claim.dcp.async-cost` | 异步 Checkpoint 以 CPU 内存换训练不停顿 | 2026-07-12 | 工程方法 | [PyTorch：torch.distributed.checkpoint (DCP)](https://docs.pytorch.org/docs/stable/distributed.checkpoint.html) |
| `claim.checkpoint.full-state` | 正确续训需保存完整分片状态 | 工程共识 | 工程方法 | [PyTorch：torch.distributed.checkpoint (DCP)](https://docs.pytorch.org/docs/stable/distributed.checkpoint.html) |
| `claim.rag.definition` | RAG = 参数化记忆 + 外部检索 | 2020-05-22 | 方法（2020） | [Lewis 等（NeurIPS 2020）：Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks](https://arxiv.org/abs/2005.11401) |
| `claim.gpu-operator.manages` | GPU Operator 自动管驱动/工具包/设备插件/DCGM | 2026-07-12 | 工程方法 | [NVIDIA：About the NVIDIA GPU Operator](https://docs.nvidia.com/datacenter/cloud-native/gpu-operator/latest/index.html) |
| `claim.dra.status` | K8s DRA 已随版本稳定并默认开启 | 2026-07-12 | 已发布特性 | [Kubernetes：Kubernetes — Dynamic Resource Allocation](https://kubernetes.io/docs/concepts/scheduling-eviction/dynamic-resource-allocation/) |
| `claim.kueue.gang` | Kueue 以“全有或全无”做 gang admission | 2026-07-12 | 工程方法 | [Kubernetes SIGs：Kueue — Kubernetes-native Job Queueing](https://kueue.sigs.k8s.io/docs/) |
| `claim.mig.vs.mps` | MIG 是硬件隔离切分，MPS 是并发共享 | 2026-07-12 | 工程方法 | [NVIDIA：NVIDIA Multi-Instance GPU (MIG) User Guide](https://docs.nvidia.com/datacenter/tesla/mig-user-guide/latest/)<br>[NVIDIA：CUDA Multi-Process Service (MPS)](https://docs.nvidia.com/deploy/mps/index.html) |
| `claim.specdec.speedup` | 投机解码约 2–3× 且输出分布不变 | 2023 | 方法（2023） | [Leviathan 等（ICML 2023）：Fast Inference from Transformers via Speculative Decoding](https://arxiv.org/abs/2211.17192) |
| `claim.paged-kv.blocks` | PagedAttention 分块管理 KV、消除碎片 | 2026-07-12 | 工程方法 | [vLLM：vLLM Documentation](https://docs.vllm.ai/en/latest/) |
| `claim.prefix-cache.gain` | 前缀复用可提升共享前缀吞吐 | 2026-07-12 | 工程方法 | [vLLM：vLLM Documentation](https://docs.vllm.ai/en/latest/) |
| `claim.fsdp2.dtensor` | FSDP2 用 DeviceMesh/DTensor 表达分片 | 2026-07-12 | 工程方法 | [PyTorch：Getting Started with Fully Sharded Data Parallel (FSDP2)](https://docs.pytorch.org/tutorials/intermediate/FSDP_tutorial.html)<br>[PyTorch：torch.distributed.tensor (DTensor / DeviceMesh)](https://docs.pytorch.org/docs/stable/distributed.tensor.html) |
| `claim.moe.sparse` | MoE 每 token 只激活部分专家 | 2021 | 架构（2021） | [Fedus 等（JMLR 2022）：Switch Transformers: Scaling to Trillion Parameter Models](https://arxiv.org/abs/2101.03961) |
| `claim.rlhf.instructgpt` | RLHF 用人类偏好对齐（InstructGPT） | 2022 | 方法（2022） | [Ouyang 等（NeurIPS 2022）：Training language models to follow instructions with human feedback](https://arxiv.org/abs/2203.02155) |
| `claim.cloud.models` | NIST：3 服务模型 + 4 部署模型 | 2011-09 | 标准定义 | [NIST：NIST SP 800-145 — The NIST Definition of Cloud Computing](https://csrc.nist.gov/pubs/sp/800/145/final) |
| `claim.error-budget` | Error Budget = 100% − SLO | 2026-07-12 | 工程方法 | [Google：Google SRE Workbook — Implementing SLOs](https://sre.google/workbook/implementing-slos/) |
| `claim.burn-rate.page` | 高 burn rate 触发分页告警（示例：1h 窗 >14.4） | 2026-07-12 | 工程方法（示例） | [Google：Google SRE Workbook — Alerting on SLOs](https://sre.google/workbook/alerting-on-slos/) |
| `claim.unit-econ.cost-success` | 要看每有效结果成本，而非只看每 Token 成本 | 2026-07-12 | 口径 | [FinOps Foundation：FinOps Framework — Unit Economics](https://www.finops.org/framework/capabilities/unit-economics/) |

## 二、全部一手来源（43 条）

| 来源 | 出版方 | 类型 | 发布日期 | URL |
|---|---|---|---|---|
| CUDA C++ Best Practices Guide | NVIDIA | 官方文档 | — | <https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/index.html> |
| GPU Performance Background User's Guide | NVIDIA | 官方文档 | — | <https://docs.nvidia.com/deeplearning/performance/dl-performance-gpu-background/index.html> |
| Transformer Engine — Low Precision Training | NVIDIA | 官方文档 | — | <https://docs.nvidia.com/deeplearning/transformer-engine-releases/release-2.16/user-guide/features/low_precision_training/introduction/introduction.html> |
| NVIDIA DCGM Feature Overview | NVIDIA | 官方文档 | — | <https://docs.nvidia.com/datacenter/dcgm/latest/user-guide/feature-overview.html> |
| Introduction to NVIDIA DGX B200 Systems | NVIDIA | 厂商规格 | — | <https://docs.nvidia.com/dgx/dgxb200-user-guide/introduction-to-dgxb200.html> |
| NVIDIA Multi-Node NVLink Systems | NVIDIA | 官方文档 | — | <https://docs.nvidia.com/multi-node-nvlink-systems/index.html> |
| GPUDirect RDMA Documentation | NVIDIA | 官方文档 | — | <https://docs.nvidia.com/cuda/gpudirect-rdma/> |
| NVIDIA System Management Interface | NVIDIA | 官方文档 | — | <https://docs.nvidia.com/deploy/nvidia-smi/index.html> |
| PCI Express 6.0 Specification | PCI-SIG | 标准 | 2022-01-11 | <https://pcisig.com/pci-express-6.0-specification> |
| Open Rack V3 Specifications and Designs | Open Compute Project | 标准 | — | <https://www.opencompute.org/wiki/Open_Rack/SpecsAndDesigns> |
| Open Rack V3 Blind Mate Manifold Specification | Open Compute Project | 标准 | 2024-04-05 | <https://www.opencompute.org/documents/open-rack-v3-blind-mate-manifold-specification-rev-1-0-review-april05-2024-pdf> |
| Best Practices Guide for Energy-Efficient Data Center Design | U.S. Department of Energy | 政府指南 | 2024-07-26 | <https://www.energy.gov/cmei/femp/articles/best-practices-guide-energy-efficient-data-center-design> |
| Power Usage Effectiveness | The Green Grid | 标准组织 | — | <https://www.thegreengrid.org/resources/glossary?combine=pue> |
| Explaining the Tier Classification System | Uptime Institute | 标准组织 | — | <https://journal.uptimeinstitute.com/explaining-uptime-institutes-tier-classification-system/> |
| NIST SP 800-171 Rev. 3 — Physical Protection | NIST | 政府标准 | 2024-05-14 | <https://nvlpubs.nist.gov/nistpubs/SpecialPublications/800-171r3/NIST.SP.800-171r3.html> |
| Clean Agent Suppression of Energized Electrical Equipment Fires | NIST | 政府研究 | 2009-01-01 | <https://www.nist.gov/publications/clean-agent-suppression-energized-electrical-equipment-fires-0> |
| MLPerf Inference Benchmark Suite | MLCommons | 行业基准 | — | <https://docs.mlcommons.org/inference/index_gh/> |
| NCCL User Guide — Collective Operations | NVIDIA | 官方文档 | — | <https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/usage/collectives.html> |
| NCCL User Guide — Overview | NVIDIA | 官方文档 | — | <https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/overview.html> |
| HGX AI Factory — Networking Physical Topologies | NVIDIA | 参考架构 | — | <https://docs.nvidia.com/enterprise-reference-architectures/hgx-ai-factory/latest/networking-physical-topologies.html> |
| Ultra Ethernet Consortium Launches Specification 1.0 | Ultra Ethernet Consortium | 标准组织 | 2025-06-11 | <https://ultraethernet.org/ultra-ethernet-consortium-uec-launches-specification-1-0-transforming-ethernet-for-ai-and-hpc-at-scale/> |
| GPUDirect Storage Overview Guide | NVIDIA | 官方文档 | — | <https://docs.nvidia.com/gpudirect-storage/overview-guide/index.html> |
| torch.distributed.checkpoint (DCP) | PyTorch | 官方文档 | — | <https://docs.pytorch.org/docs/stable/distributed.checkpoint.html> |
| A guide on good usage of non_blocking and pin_memory() | PyTorch | 官方文档 | — | <https://docs.pytorch.org/tutorials/intermediate/pinmem_nonblock.html> |
| Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks | Lewis 等（NeurIPS 2020） | 同行评审论文 | 2020-05-22 | <https://arxiv.org/abs/2005.11401> |
| About the NVIDIA GPU Operator | NVIDIA | 官方文档 | — | <https://docs.nvidia.com/datacenter/cloud-native/gpu-operator/latest/index.html> |
| Kubernetes — Dynamic Resource Allocation | Kubernetes | 官方文档 | — | <https://kubernetes.io/docs/concepts/scheduling-eviction/dynamic-resource-allocation/> |
| Kueue — Kubernetes-native Job Queueing | Kubernetes SIGs | 开源项目文档 | — | <https://kueue.sigs.k8s.io/docs/> |
| NVIDIA Multi-Instance GPU (MIG) User Guide | NVIDIA | 官方文档 | — | <https://docs.nvidia.com/datacenter/tesla/mig-user-guide/latest/> |
| CUDA Multi-Process Service (MPS) | NVIDIA | 官方文档 | — | <https://docs.nvidia.com/deploy/mps/index.html> |
| Slurm Workload Manager Documentation | SchedMD | 开源项目文档 | — | <https://slurm.schedmd.com/documentation.html> |
| OpenTelemetry Documentation | OpenTelemetry (CNCF) | 开源项目文档 | — | <https://opentelemetry.io/docs/> |
| vLLM Documentation | vLLM | 开源项目文档 | — | <https://docs.vllm.ai/en/latest/> |
| Getting Started with Fully Sharded Data Parallel (FSDP2) | PyTorch | 官方文档 | — | <https://docs.pytorch.org/tutorials/intermediate/FSDP_tutorial.html> |
| torch.distributed.tensor (DTensor / DeviceMesh) | PyTorch | 官方文档 | — | <https://docs.pytorch.org/docs/stable/distributed.tensor.html> |
| Fast Inference from Transformers via Speculative Decoding | Leviathan 等（ICML 2023） | 同行评审论文 | 2022-11-30 | <https://arxiv.org/abs/2211.17192> |
| Switch Transformers: Scaling to Trillion Parameter Models | Fedus 等（JMLR 2022） | 同行评审论文 | 2021-01-11 | <https://arxiv.org/abs/2101.03961> |
| Training language models to follow instructions with human feedback | Ouyang 等（NeurIPS 2022） | 同行评审论文 | 2022-03-04 | <https://arxiv.org/abs/2203.02155> |
| NIST SP 800-145 — The NIST Definition of Cloud Computing | NIST | 政府标准 | 2011-09-28 | <https://csrc.nist.gov/pubs/sp/800/145/final> |
| FinOps Framework | FinOps Foundation (Linux Foundation) | 标准组织 | — | <https://www.finops.org/framework/> |
| FinOps Framework — Unit Economics | FinOps Foundation | 标准组织 | — | <https://www.finops.org/framework/capabilities/unit-economics/> |
| Google SRE Workbook — Implementing SLOs | Google | 工程实践指南 | — | <https://sre.google/workbook/implementing-slos/> |
| Google SRE Workbook — Alerting on SLOs | Google | 工程实践指南 | — | <https://sre.google/workbook/alerting-on-slos/> |

## 三、本轮逐条回源直取核验（primary-source re-fetch）

以下 claim 的具体数字/等价关系/定义，已用 WebFetch 回到官方页面逐字确认：

- **AllReduce ≡ ReduceScatter+AllGather（也 = Reduce+Broadcast）** — NCCL 官方文档原文确认。
- **异步 Checkpoint CPU 内存 ≈ 每 rank 大小 × rank 数** — PyTorch DCP 文档原文「raise CPU memory by a factor of checkpoint_size_per_rank X number_of_ranks」逐字确认。
- **Error Budget = 100% − SLO；burn rate 14.4/1h、6/6h 触发分页（99.9% SLO 示例）** — Google SRE Workbook 确认（6h 窗为二级分页，非工单，已据此改正措辞）。
- **投机解码 T5-XXL 约 2–3× 且输出分布不变** — arXiv:2211.17192 摘要确认。
- **NIST 云：3 服务模型 + 4 部署模型** — NIST SP 800-145 摘要确认。
- **UEC 1.0 于 2025-06 发布**；**GPUDirect Storage 存储↔GPU DMA 直连绕过 CPU**；**rail-optimized 每 NIC 接不同 leaf**；**RoCEv2 无损=PFC+ECN+DCQCN**；**Kueue 全有或全无 gang**；**MIG 硬件隔离 vs MPS 并发共享**；**MoE 稀疏激活**；**RLHF/InstructGPT** — 均经 NVIDIA/Kubernetes/UEC/论文来源检索确认。

> 未找到可靠一手数字的项目一律不写成确定事实（如前缀缓存吞吐提升幅度：只说“需按负载实测”，不引用固定百分比）；Alpha/新规范（如 UEC 1.0、K8s DRA）明确标注成熟度、不当作已普遍稳定生产。
