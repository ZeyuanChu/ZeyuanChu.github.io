/* 算力之旅 · 站点工作台配置
 * 站点特有的任务、模式、场景和教学指标集中维护；不复制知识正文。
 * 所有数值与状态均用于学习引导，不代表真实生产遥测或报价。
 */
window.StationWorkbenchConfig = {
  gpu: {
    question: "这张卡为什么会慢？",
    task: "依次判断是算不动、放不下、喂不饱，还是功耗与散热限制了持续表现。",
    modes: [
      { id: "anatomy", label: "芯片剖面", description: "从计算核心与封装边界读懂一张加速卡的基本结构。", node: "core" },
      { id: "memory", label: "显存预算", description: "从容量与运行时余量判断模型能否放下。", node: "vram" },
      { id: "bottleneck", label: "瓶颈诊断", description: "沿核心与显存的数据路径判断计算或带宽受限。", node: "bandwidth" },
      { id: "precision", label: "精度配置", description: "比较数据格式对容量、吞吐、质量与软件支持的影响。", node: "dataformat" }
    ],
    scenarios: [
      { id: "oom", label: "显存不足", description: "检查静态占用、动态占用与运行时余量。", node: "vram", status: "演示场景" },
      { id: "feed", label: "核心在等数据", description: "用有效带宽、访问方式与数据复用定位供给瓶颈。", node: "bandwidth", status: "演示场景" },
      { id: "thermal", label: "功率或温度受限", description: "观察功率、温度与降频信号，再验证持续表现。", node: "cooling", status: "演示场景" },
      { id: "fit", label: "工作负载选卡", description: "按训练或推理目标、互联、生态和服务要求审查卡型。", node: "types", status: "设计检查" }
    ],
    metrics: [
      { label: "计算判断", value: "算不动？", meta: "峰值算力不等于实测吞吐", tone: "accent" },
      { label: "容量判断", value: "放不下？", meta: "静态与动态显存分别预算", tone: "info" },
      { label: "数据判断", value: "喂不饱？", meta: "看有效带宽、复用与等待", tone: "info" },
      { label: "设施判断", value: "供不起？", meta: "看功耗、温度与降频", tone: "warning" }
    ],
    defaultNode: "core",
    legend: "计算、显存、数据路径与热边界需要一起看，单一规格不足以解释体验。",
    mobileSummary: "先用四个判断卡确认瓶颈，再进入对应的局部机制与知识解释。"
  },
  server: {
    question: "八张卡怎样才真正成为一个系统？",
    task: "沿 GPU、机内互联、CPU/内存、NIC、供电与散热路径，检查拓扑、数据供给和故障边界。",
    modes: [
      { id: "physical", label: "物理剖面", description: "查看 GPU、主机、网络、电源与散热如何组成一个节点。", node: "gpu8" },
      { id: "scaleup", label: "机内互联", description: "区分 GPU 间高速互联与通用 I/O 路径。", node: "nvlink" },
      { id: "data", label: "数据供给", description: "沿 NVMe、主机内存与 GPU 的路径寻找等待。", node: "memstore" },
      { id: "scaleout", label: "对外路径", description: "查看 NIC 与 RDMA 如何把节点接入集群。", node: "nic" }
    ],
    scenarios: [
      { id: "affinity", label: "NUMA 亲和检查", description: "比较本地与跨 NUMA 的 CPU、内存、GPU 和 NIC 路径。", node: "cpu", status: "拓扑检查" },
      { id: "rdma", label: "GPU—NIC 路径", description: "检查 GPU、NIC 与 PCIe root 的亲和和数据路径。", node: "nic", status: "演示场景" },
      { id: "psu", label: "单路供电丢失", description: "依据机型、当前负载和上游接线验证剩余能力。", node: "psu", status: "故障演练" },
      { id: "cooling", label: "散热余量不足", description: "观察温度、频率、风量或流量与告警的关系。", node: "cooling", status: "故障演练" }
    ],
    metrics: [
      { label: "节点形态", value: "8 GPU 示例", meta: "卡数不是永久或通用边界", tone: "accent" },
      { label: "机内互联", value: "Scale-up", meta: "看拓扑与有效通信", tone: "info" },
      { label: "跨机互联", value: "Scale-out", meta: "NIC 与 RDMA 接入集群", tone: "info" },
      { label: "系统验证", value: "端到端", meta: "主机、I/O、电热共同验收", tone: "warning" }
    ],
    defaultNode: "gpu8",
    legend: "一个节点的边界由计算、主机、网络和电热可靠性共同决定。",
    mobileSummary: "用可展开的部件栈查看物理剖面、逻辑拓扑和故障边界。"
  },
  dc: {
    question: "这座机房到底能承载多少 AI？",
    task: "对 U 位、供电、散热、重量、端口和检修空间逐项校核，以最先触顶的约束决定容量。",
    modes: [
      { id: "capacity", label: "容量包络", description: "同时校核空间、电、热、重量、连接和维护条件。", node: "rack" },
      { id: "power", label: "供电链", description: "从上游电源到机架输入检查容量、冗余路径和维护性。", node: "power" },
      { id: "thermal", label: "完整热链", description: "追踪热量从设备经冷却系统稳定排出的全过程。", node: "cooling" },
      { id: "safety", label: "安全运营", description: "连接结构、布线、消防与人员安全边界。", node: "fire" }
    ],
    scenarios: [
      { id: "rack", label: "机架装机校核", description: "按真实设备清单检查约束，并指出第一个触顶项。", node: "rack", status: "容量演练" },
      { id: "a-b", label: "A/B 路供电", description: "查看电源冗余如何穿过机柜与上游路径。", node: "power", status: "供电演练" },
      { id: "heat", label: "制冷异常", description: "沿热路径定位风量、液路或换热环节的风险。", node: "cooling", status: "故障演练" },
      { id: "access", label: "维护与安全", description: "检查重量、布线、检修空间、消防与门禁。", node: "cabling", status: "设计检查" }
    ],
    metrics: [
      { label: "容量结论", value: "最先触顶", meta: "不只看 U 位", tone: "accent" },
      { label: "供电路径", value: "待校核", meta: "容量、冗余与维护性", tone: "info" },
      { label: "冷却路径", value: "待校核", meta: "热从设备到室外的完整链路", tone: "info" },
      { label: "安全边界", value: "不可省略", meta: "结构、消防与运营共同决定", tone: "warning" }
    ],
    defaultNode: "rack",
    legend: "容量不是一个数字，而是由多个设施约束中最先触顶的那个决定。",
    mobileSummary: "在手机上依次检查空间、电、热、结构和安全五个约束，而不是缩小整张机房图。"
  },
  network: {
    question: "上千张卡同步时，数据走哪张网，怎样避免最慢节点拖住全队？",
    task: "选择通信与拓扑场景，观察真实路径；再注入慢节点或拥塞，用路径与等待证据完成定位。",
    modes: [
      { id: "topology", label: "拓扑总览", description: "区分计算网、存储网、管理网和 Spine-Leaf 的组织方式。", node: "spineleaf" },
      { id: "compute", label: "计算通信", description: "沿计算网理解多卡同步为什么依赖稳定路径。", node: "computenet" },
      { id: "storage", label: "存储路径", description: "识别数据读取和存档流量的独立职责。", node: "storagenet" },
      { id: "management", label: "带外管理", description: "查看设备管理与故障恢复为什么不应混入计算流量。", node: "mgmtnet" }
    ],
    scenarios: [
      { id: "fabrics", label: "三张网分工", description: "逐一查看计算、存储与带外管理流量的职责和隔离边界。", node: "computenet", status: "拓扑查看" },
      { id: "slow", label: "慢节点拖队", description: "观察同步训练中最慢参与者为何会放大全队等待。", node: "computenet", status: "故障演练" },
      { id: "interference", label: "存储流量干扰", description: "检查数据读取和存档流量是否挤占了关键路径。", node: "storagenet", status: "拥塞检查" },
      { id: "recovery", label: "管理网恢复", description: "从带外管理路径理解设备定位、隔离和恢复。", node: "mgmtnet", status: "恢复演练" }
    ],
    metrics: [
      { label: "当前视图", value: "三张网", meta: "计算 / 存储 / 带外管理", tone: "accent" },
      { label: "同步风险", value: "尾延迟", meta: "最慢参与者可能拖住全队", tone: "warning" },
      { label: "通信路径", value: "待选择", meta: "选择对象后在图中高亮", tone: "info" },
      { label: "故障状态", value: "未注入", meta: "所有状态均为教学演示", tone: "success" }
    ],
    defaultNode: "spineleaf",
    legend: "默认只看结构；选择对象或场景后再追踪真正相关的路径与故障域。",
    mobileSummary: "一次只查看一条通信路径，再打开底部知识解释，不依赖缩小整张拓扑图。"
  },
  data: {
    question: "数据怎样持续喂饱 GPU，并在故障后以可控代价恢复？",
    task: "播放一批数据从源头到 GPU 的路径，识别等待点；再切换到存档或检索场景。",
    modes: [
      { id: "lifecycle", label: "数据生命周期", description: "从采集、清洗到版本化，理解训练前的加工链。", node: "pipeline" },
      { id: "feed", label: "训练供给", description: "比较数据集仓库与并行文件系统在供给中的职责。", node: "pfs" },
      { id: "checkpoint", label: "存档恢复", description: "查看 Checkpoint 的写回路径与恢复取舍。", node: "checkpoint" },
      { id: "rag", label: "RAG 与治理", description: "连接向量检索、私有知识与数据边界。", node: "vectordb" }
    ],
    scenarios: [
      { id: "batch", label: "一批数据的旅程", description: "跟随训练数据从加工、仓库到 GPU 的路径。", node: "pipeline", status: "播放路径" },
      { id: "waiting", label: "GPU 等数据", description: "从并行读取路径检查供给不足可能出现在哪里。", node: "pfs", status: "瓶颈检查" },
      { id: "tier", label: "冷热分层", description: "按容量、取用速度和成本理解数据集仓库定位。", node: "datastore", status: "设计检查" },
      { id: "restore", label: "存档与恢复", description: "比较存得太勤与太疏的代价，以及恢复依赖的状态。", node: "checkpoint", status: "恢复演练" }
    ],
    metrics: [
      { label: "供给路径", value: "待播放", meta: "从数据源到 GPU 集群", tone: "accent" },
      { label: "当前瓶颈", value: "待识别", meta: "随教学场景与输入变化", tone: "warning" },
      { label: "存储层", value: "待选择", meta: "仓库 / 并行文件系统 / 存档", tone: "info" },
      { label: "恢复目标", value: "待设定", meta: "使用 RPO / RTO 口径", tone: "neutral" }
    ],
    defaultNode: "pipeline",
    legend: "从数据资产、存储层、传输队列到 GPU 消费，任何一段等待都会影响整体供给。",
    mobileSummary: "按纵向步骤查看数据的输入、输出和等待状态，再进入对应知识解释。"
  },
  platform: {
    question: "一个多卡作业从申请到运行，要经过哪些平台层，为什么会等待或失败？",
    task: "提交一个教学作业，跟随它经过准入、排队、放置和运行；再检查兼容与共享策略。",
    modes: [
      { id: "stack", label: "软件栈", description: "理解驱动、容器、调度与平台之间的依赖关系。", node: "driver" },
      { id: "job", label: "作业生命周期", description: "跟随作业从排队、派单到资源释放的全过程。", node: "scheduler" },
      { id: "sharing", label: "共享策略", description: "查看多团队共享下的资源边界与管理入口。", node: "platform" },
      { id: "runtime", label: "容器运行时", description: "检查容器如何把依赖和运行环境封装起来。", node: "container" }
    ],
    scenarios: [
      { id: "submit", label: "提交多卡作业", description: "观察任务如何进入队列并由调度层派单。", node: "scheduler", status: "作业演练" },
      { id: "compat", label: "版本兼容检查", description: "沿驱动、算子与容器依赖检查错配可能发生的层。", node: "driver", status: "风险检查" },
      { id: "tenant", label: "多团队共用", description: "查看平台如何把资源、使用者与治理规则连在一起。", node: "platform", status: "共享策略" },
      { id: "container", label: "环境复现", description: "从容器层理解为什么同一任务可以更稳定地迁移和运行。", node: "container", status: "运行检查" }
    ],
    metrics: [
      { label: "作业状态", value: "待提交", meta: "队列、调度与运行时共同决定", tone: "accent" },
      { label: "放置依据", value: "待选择", meta: "资源、拓扑与规则必须匹配", tone: "info" },
      { label: "共享边界", value: "待确认", meta: "团队、配额与治理不可省略", tone: "warning" },
      { label: "运行环境", value: "分层管理", meta: "驱动、容器与平台相互依赖", tone: "neutral" }
    ],
    defaultNode: "scheduler",
    legend: "平台不是一层大面板，而是把作业、资源、规则和运行环境串成可运营流程。",
    mobileSummary: "用纵向作业步骤展示提交、排队、放置、运行和释放，不缩放整张软件栈图。"
  },
  model: {
    question: "模型如何从训练制品，变成可稳定交付的推理服务？",
    task: "在模型生产、评测上线与在线推理三段之间切换，分别理解吞吐、质量与成本的取舍。",
    modes: [
      { id: "training", label: "模型生产", description: "从训练开始理解模型能力如何形成。", node: "training" },
      { id: "finetune", label: "适配微调", description: "查看通用模型如何适配特定任务与数据。", node: "finetune" },
      { id: "release", label: "评测上线", description: "把评测、版本和上线门禁连接成发布环节。", node: "eval" },
      { id: "serving", label: "在线推理", description: "沿请求、排队、生成和返回理解推理服务。", node: "inference" }
    ],
    scenarios: [
      { id: "parallel", label: "训练并行", description: "理解大模型为什么需要把工作拆到多张卡或多台机器上。", node: "training", status: "训练视角" },
      { id: "adapt", label: "场景微调", description: "检查特定领域数据如何影响模型适配与验证。", node: "finetune", status: "适配视角" },
      { id: "gate", label: "发布门禁", description: "在上线前关注质量、安全、兼容与回滚准备。", node: "eval", status: "发布检查" },
      { id: "request", label: "一次推理请求", description: "跟随一次请求从进入服务到返回结果的过程。", node: "inference", status: "服务视角" }
    ],
    metrics: [
      { label: "当前阶段", value: "待选择", meta: "生产 / 适配 / 发布 / 服务", tone: "accent" },
      { label: "主要取舍", value: "质量与成本", meta: "必须结合场景判断", tone: "warning" },
      { label: "交付对象", value: "模型制品", meta: "需要版本、评测和发布管理", tone: "info" },
      { label: "服务目标", value: "体验与稳定", meta: "推理不是训练的缩小版", tone: "neutral" }
    ],
    defaultNode: "training",
    legend: "模型生产、发布门禁和推理服务是相连但不同的系统，不能用同一组指标替代。",
    mobileSummary: "用生产、门禁、服务三段式导航切换内容，每次只展开一条关键流程。"
  },
  delivery: {
    question: "数据边界、用量与团队能力，如何共同决定交付方式？",
    task: "设置客户约束，比较主要交付模式，并检查混合部署与迁移退路。",
    modes: [
      { id: "ondemand", label: "公有云 · 按量", description: "随开随用、按量付费，适合短期试验和波动负载。", node: "ondemand" },
      { id: "reserved", label: "公有云 · 包期", description: "以固定承诺换取更低单价和资源保障。", node: "reserved" },
      { id: "private", label: "专有云", description: "强调数据驻留与双方共担运维。", node: "private" },
      { id: "idc", label: "自建 IDC", description: "投入与建设周期最高，自主性也最强。", node: "idc" },
      { id: "hybrid", label: "混合模式", description: "平时使用自有资源，高峰期借用公有云补充弹性。", node: "hybrid" }
    ],
    scenarios: [
      { id: "residency", label: "数据不能出门", description: "先比较专有云与自建，再评估投入和运维能力。", node: "private", status: "硬约束" },
      { id: "trial", label: "短期试模型", description: "用量说不准，需要随开随关并控制前期投入。", node: "ondemand", status: "推荐方向" },
      { id: "stable", label: "稳定长期负载", description: "重点比较包期承诺与长期单位成本。", node: "reserved", status: "比较方向" },
      { id: "peak", label: "自有资源 + 高峰弹性", description: "日常留在自有环境，高峰流量使用公有云补位。", node: "hybrid", status: "组合方向" }
    ],
    metrics: [
      { label: "前期投入", value: "按模式比较", meta: "从低到高", tone: "neutral" },
      { label: "数据位置", value: "云侧 / 客户侧", meta: "先确认数据驻留硬约束", tone: "accent" },
      { label: "建设周期", value: "因模式而异", meta: "从快速开通到工程建设", tone: "warning" },
      { label: "运维责任", value: "厂商 / 共担 / 自担", meta: "与团队能力一起判断", tone: "info" }
    ],
    defaultNode: "ondemand",
    legend: "先识别硬约束，再比较可行方案、主要代价和迁移退出风险。",
    mobileSummary: "先回答数据、用量和运维三个问题，再比较首选、备选与退出风险。"
  },
  token: {
    question: "怎样把算力成本摊到 Token，并把服务能力变成可销售的产品？",
    task: "沿计量、服务等级、多租户与定价链路，理解 Token 生意如何闭环。",
    modes: [
      { id: "gateway", label: "请求与计量", description: "从 API 网关完成鉴权、限流、用量记录和账单入口。", node: "gateway" },
      { id: "catalog", label: "模型货架", description: "组织可售模型、能力与对应价格信息。", node: "catalog" },
      { id: "sla", label: "服务等级", description: "把体验、并发和可用性转成服务承诺。", node: "sla" },
      { id: "multi", label: "多租户", description: "用配额、限流、优先级和隔离服务多个客户。", node: "multitenant" },
      { id: "pricing", label: "成本与定价", description: "将卡、电、机房、网络和人力等成本摊到单位用量。", node: "pricing" }
    ],
    scenarios: [
      { id: "meter", label: "按 Token 结算", description: "追踪请求使用量，并把技术用量转换为财务账单。", node: "billing", status: "计量演示" },
      { id: "service", label: "设计 SLA", description: "在首字延迟、生成速度、并发和可用性之间明确承诺。", node: "sla", status: "产品设计" },
      { id: "sharing", label: "共享集群服务多客户", description: "通过配额、限流、优先级和隔离避免租户互相影响。", node: "multitenant", status: "运营设计" },
      { id: "cost", label: "成本与定价链", description: "沿成本、利用率、计量与定价建立可解释账链。", node: "pricing", status: "经营分析" }
    ],
    metrics: [
      { label: "计费单位", value: "Token", meta: "输入与输出通常分别计价", tone: "accent" },
      { label: "核心成本口径", value: "每百万 Token", meta: "基于完全成本与可计费用量", tone: "info" },
      { label: "经营旋钮", value: "利用率", meta: "影响固定成本能否被摊薄", tone: "warning" },
      { label: "服务承诺", value: "体验与并发", meta: "按产品与客户场景定义", tone: "neutral" }
    ],
    defaultNode: "gateway",
    legend: "所有数字均为教学模拟；先看口径、时间窗与假设，再讨论成本、价格和毛利。",
    mobileSummary: "从请求计量开始，依次检查 SLA、多租户、成本账链与对客定价。"
  },
  ops: {
    question: "如何尽早发现异常、控制影响，并把训练或服务恢复到可验证状态？",
    task: "沿监控、告警、隔离、补位、存档恢复和验证，完成一次事故响应闭环。",
    modes: [
      { id: "monitor", label: "监控", description: "观察利用率、温度功耗、任务队列和故障告警。", node: "monitor" },
      { id: "alerts", label: "告警与恢复", description: "识别掉卡、网络抖动和慢节点，并尽快隔离与恢复。", node: "alerts" },
      { id: "maintenance", label: "巡检保养", description: "通过升级、清洁、更换部件和演练减少突发故障。", node: "maintenance" },
      { id: "capacity", label: "容量与 SLO", description: "在故障余量、服务目标与资源利用率之间建立平衡。", node: "capacity" }
    ],
    scenarios: [
      { id: "drop", label: "掉卡之夜", description: "从自动告警到隔离、备机补位和恢复验证。", node: "alerts", status: "事故演练" },
      { id: "usage", label: "GPU 利用率检查", description: "判断资源是否有效工作，并定位空转与排队问题。", node: "monitor", status: "观测演练" },
      { id: "jitter", label: "网络抖动或慢节点", description: "检查同步变慢是否正在拖累整组任务。", node: "alerts", status: "故障演练" },
      { id: "headroom", label: "容量余量审查", description: "把可用容量、服务目标与恢复策略放到一起判断。", node: "capacity", status: "SLO 检查" }
    ],
    metrics: [
      { label: "系统级别", value: "教学状态", meta: "正常、降级和事故需要明确区分", tone: "accent" },
      { label: "SLO", value: "待设定", meta: "按服务与时间窗定义", tone: "info" },
      { label: "错误预算", value: "待观察", meta: "用于衡量可承受的风险", tone: "warning" },
      { label: "恢复闭环", value: "验证后关闭", meta: "恢复不等于已经验证", tone: "success" }
    ],
    defaultNode: "monitor",
    legend: "正常、调查、故障和已验证恢复必须使用清晰的文字、图标与语义色共同表达。",
    mobileSummary: "先看服务状态，再逐步选择事故时间线、证据和恢复动作；知识说明从底部展开。"
  }
};

/* V5：观察任务只描述“任务如何驱动视图”和“下一步检查什么”。
 * 知识正文仍由 data.js / content-v4.js 单一维护。
 */
(function enrichObservationTasks(config) {
  const details = {
    gpu: {
      oom: ["memory", "区分权重、激活值、KV Cache 与运行余量。"],
      feed: ["bottleneck", "检查有效带宽、数据复用与等待位置。"],
      thermal: ["bottleneck", "核对功率、温度、频率与散热路径是否同时异常。"],
      fit: ["precision", "回到训练或推理目标，比较容量、互联、精度和生态。"]
    },
    server: {
      affinity: ["physical", "比较本地路径与跨 NUMA 路径，再决定放置策略。"],
      rdma: ["scaleout", "确认 GPU、NIC 与 PCIe root 的亲和关系。"],
      psu: ["physical", "验证剩余供电能力与上游接线，不直接假设仍可满载。"],
      cooling: ["physical", "定位气流或液路异常影响到的部件与负载。"]
    },
    dc: {
      rack: ["capacity", "逐项核对空间、电、热、重量、端口和检修条件。"],
      "a-b": ["power", "沿 A/B 两路确认冗余是否真正贯穿到设备。"],
      heat: ["thermal", "沿完整热链定位异常环节与受影响机架。"],
      access: ["safety", "检查检修净空、桥架、消防通道与门禁边界。"]
    },
    network: {
      fabrics: ["topology", "分别确认计算、存储和管理流量的职责边界。"],
      slow: ["compute", "找到最慢参与者和同步等待点，再判断隔离或恢复动作。"],
      interference: ["storage", "检查共用链路、队列累积与关键路径是否互相干扰。"],
      recovery: ["management", "确认业务面异常时带外管理路径仍然可达。"]
    },
    data: {
      batch: ["lifecycle", "按步骤追踪加工、治理、存储、并行读取与消费。"],
      waiting: ["feed", "从队列、PFS 和消费端判断等待发生在哪里。"],
      tier: ["lifecycle", "结合取用频率、容量和恢复要求选择数据层。"],
      restore: ["checkpoint", "核对恢复所需的权重、优化器、随机状态与数据游标。"]
    },
    platform: {
      submit: ["job", "跟随作业经过准入、排队、放置、启动与运行。"],
      compat: ["stack", "找出不兼容层，并确认它阻断了哪些下游步骤。"],
      tenant: ["sharing", "检查团队、配额、优先级与隔离边界。"],
      container: ["runtime", "区分镜像内环境与宿主驱动依赖。"]
    },
    model: {
      parallel: ["training", "继续查看数据、张量或流水线并行如何拆分工作。"],
      adapt: ["finetune", "连接领域数据、适配方法与独立验证。"],
      gate: ["release", "依次检查基准、压力、灰度与回滚准备。"],
      request: ["serving", "沿队列、Prefill、KV、Decode 与流式输出追踪请求。"]
    },
    delivery: {
      residency: ["private", "先比较专有云与自建，再判断投入和运维能力。"],
      trial: ["ondemand", "验证试验周期、退出方式与预算上限。"],
      stable: ["reserved", "比较承诺周期、资源保障与长期单位成本。"],
      peak: ["hybrid", "确认数据边界、跨环境调度与退出退路。"]
    },
    token: {
      meter: ["gateway", "核对鉴权、用量记录、时间窗与账单口径。"],
      service: ["sla", "进入 SLO 指标定义，明确体验与并发承诺。"],
      sharing: ["multi", "检查配额、限流、优先级和租户隔离。"],
      cost: ["pricing", "进入 Token 经济性实验室验证完全成本与盈亏边界。"]
    },
    ops: {
      drop: ["alerts", "沿告警、隔离、补位、恢复和验证完成闭环。"],
      usage: ["monitor", "区分有效工作、等待、空转与排队。"],
      jitter: ["alerts", "定位慢节点、同步等待和受影响任务范围。"],
      headroom: ["capacity", "结合服务目标、错误预算和恢复能力审查余量。"]
    }
  };
  Object.keys(details).forEach(stationId => {
    const station = config[stationId];
    if (!station) return;
    station.scenarios.forEach(scene => {
      const item = details[stationId][scene.id];
      if (!item) return;
      scene.modeId = item[0];
      scene.next = item[1];
    });
  });
})(window.StationWorkbenchConfig);
