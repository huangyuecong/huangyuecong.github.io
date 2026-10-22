/* Engineering summaries derived from the existing project notes and reviewed evidence. */
window.projectEngineering = {
  'pi-native-crm': {
    headline: 'RLS、审批与租约如何约束一次 CRM 写入',
    stack: [
      ['工作台', 'TypeScript · Next.js 16 / React 19 · TanStack Query · React Hook Form / Zod'],
      ['后台执行', 'Node.js · 独立 Worker · PostgreSQL 队列与租约 · Redis 辅助'],
      ['Agent 运行时', 'Pi Agent Core / Pi AI 0.86.1 · ModelGateway · MCP'],
      ['数据与扩展', 'Supabase / RLS / Realtime · pgvector · Mem0 / WeKnora / Langfuse 适配']
    ],
    challenges: [
      ['模型提出动作时，仍要限制租户、角色与参数范围', '按用户提供的实现说明，PostgreSQL RLS 约束组织数据，服务端核对角色，Harness 检查动作、预算和审批。验收时还需核对审批是否绑定具体对象与参数。', '只读调查与业务写入分开；恢复后应重查权限和批准范围，聊天中的同意文本不能代替服务端判定。'],
      ['Worker 租约失效与业务结果未知是两种故障', '数据库队列持久化任务，独立 Worker 以租约取得执行权；持久状态支撑恢复，幂等约束重复业务请求。', '续租失败或过期执行者不能继续提交；租约不能替代副作用幂等，结果未知与审批撤回仍需故障注入验证。'],
      ['记忆、知识来源与评测不能混成一次模型回复', '组织版本记忆和会话 checkpoint 保存上下文；知识检索保留来源片段及版本，SQL 记录 Run 和工具事件，规则与显式 LLM Judge 分开。', 'Mem0、WeKnora、Langfuse 有后端适配代码；资料未证明真实服务联调、隔离和评测结果已通过。']
    ],
    pipeline: [
      { title: '解析业务范围', detail: '登录后在组织与角色范围内读取客户和商机上下文。' },
      { title: '调查与检索', detail: '父 Agent 协调只读子任务，从记忆与知识来源收集依据。' },
      { title: '提出具体动作', detail: '展示操作对象、参数、依据和预算，形成可确认的候选动作。' },
      { title: '权限与审批', detail: 'RLS、服务端角色与 Harness 分层检查；写入动作等待有效审批。' },
      { title: '租约执行', detail: '独立 Worker 领取持久任务，检查执行权、取消和幂等范围。' },
      { title: '记录与评测', detail: 'SQL 保留运行与工具事件；确定性规则、显式 Judge 和观测导出分别处理。' }
    ],
    decisions: [
      ['任务状态保存在数据库', '页面离开不结束任务；独立 Worker 和定时任务读取持久队列，Redis 作为缓存与辅助。'],
      ['CRM 图仅表达概念联系', '当前材料来自用户说明与界面图，组织、客户、动作和审批的对象名不是已审计表名或物理外键。']
    ],
    validation: '依据用户提供的技术栈、实现状态说明与界面展示，未审计源码或运行项目。Vitest / Playwright 等工具清单不代表测试通过；租户隔离、审批撤回、租约竞争与外部服务联调仍需验收。'
  },
  'silver-guardian': {
    headline: '家庭权限、工具确认与业务事务如何跨服务衔接',
    stack: [
      ['设备端', 'HarmonyOS / ArkTS · 手机与手表工程'],
      ['业务服务', 'Spring Boot · 模块化单体 · PostgreSQL'],
      ['工具编排', 'FastAPI · 模型适配 · 工具网关'],
      ['管理与开发', 'Vue 3 · 数据迁移 · H2 本地配置']
    ],
    challenges: [
      ['模型选中的工具不能直接写业务库', '执行链携带用户与家庭上下文，检查能力和权限，必要时等待确认，再由网关调用 Core；审计随执行链处理。', '用户取消、授权撤销或能力不可用时必须停止；模型选工具不代表服务端已经授权。'],
      ['业务提交后，跨模块事件可能尚未发出', 'Core 在业务事务中组织确定性更新，以 Transactional Outbox 保存待投递事件，供后续异步协作。', 'Outbox 仍依赖投递、去重与监控；不能据此声称所有消费者恰好执行一次。'],
      ['客户端缓存的家庭角色可能过期', '家庭成员以 (family_id, user_id) 唯一约束限制重复关联；后续请求依据服务端关系和权限重新判断。', '解除关联后不能继续信任旧页面角色；真机回执、真实 Provider、签名和发布仍需分别验收。']
    ],
    pipeline: [
      { title: '请求进入', detail: 'ArkTS 手机按老人 / 家属角色提交需求，携带当前账号上下文。' },
      { title: '关系校验', detail: 'Core 校验身份、家庭关联与可访问范围。' },
      { title: '模型选工具', detail: 'Agent 完成模型适配与工具选择，准备参数和执行上下文。' },
      { title: '能力与确认', detail: '检查能力及权限；需要确认的动作等待用户决定。' },
      { title: 'Core 执行', detail: '网关调用业务服务，在事务边界内保存业务更新。' },
      { title: '事件与回传', detail: 'Outbox 承接异步事件，执行结果回传并保留审计依据。' }
    ],
    decisions: [
      ['Core 与 Agent 分开', '身份、关系和数据库写入归业务服务；模型接入与工具编排归 Agent，权限判断不下放给模型。'],
      ['关系表设置组合唯一约束', '一个用户在同一家庭中只能有一条成员关联，重复请求不应持续增加成员记录。']
    ],
    validation: '已有工具授权、确认、审计和 OpenAPI 契约测试代码；本次未运行原工程。真机、真实模型服务、签名与生产发布仍在待验收范围。'
  },
  'meeting-agent': {
    headline: '分片音频上传、任务租约与转写版本的恢复边界',
    stack: [
      ['审阅界面', 'Vue 3 · 音频、转写与纪要编辑'],
      ['任务与数据', 'FastAPI · SQLAlchemy · Alembic'],
      ['语音处理', 'ASR 适配层 · 声纹 / 说话人分离服务'],
      ['媒体与导出', 'FFmpeg · WebSocket · python-docx']
    ],
    challenges: [
      ['长音频上传被网络中断', '上传链路支持分片与续传；已有测试检查已接收分片数量和合并文件大小，处理状态由服务端任务承接。', '上传完成只确认音频接入；转写效果、说话人归属和纪要内容仍需要独立复核。'],
      ['超时任务恢复后，旧 Worker 仍可能返回', '试点架构以持久任务、租约和心跳跟踪执行；发布结果前再次确认执行资格，避免过期执行覆盖恢复结果。', '租约到期不等于旧进程已经停止；取消、恢复竞争与结果写入必须一起验证。'],
      ['重新转写可能改变旧纪要的依据', '每次重新转写创建新的 TranscriptionRun，保留片段和人工修订；纪要版本通过来源记录关联转写片段。', '参会候选名单与识别出的说话人分别建模；候选人数不能直接决定声学说话人数。']
    ],
    pipeline: [
      { title: '会议与归属', detail: '创建会议并确定所有者；参会人保存为身份匹配候选。' },
      { title: '分片上传', detail: '接收音频分片、跟踪已接收部分，合并为会议音频。' },
      { title: '任务领取', detail: '持久任务引用实体与对象键，租约和心跳记录执行资格。' },
      { title: '语音处理', detail: '通过 Provider 执行 ASR 与说话人处理；旧执行发布前需核对资格。' },
      { title: '转写运行', detail: '保存本轮转写、片段和词级时间；重跑保留旧运行。' },
      { title: '人工修订', detail: '核对文本与说话人，保存纪要版本及其来源记录。' },
      { title: '文档导出', detail: '从已选版本导出文档，保留修订与来源的对应关系。' }
    ],
    decisions: [
      ['任务消息保存引用', '队列 / 任务引用实体 ID 与对象键，录音正文不作为任务消息传递。'],
      ['Provider 仅转换输入输出', '事务、确认和审计留在应用层，替换 ASR 或模型供应商时不改写纪要权限与版本规则。']
    ],
    validation: '已读流程测试中的跨用户 403、分片数量和合并大小断言；存在长音频及租约恢复竞争专项测试。转写到导出流程使用 Mock，不能证明真实录音准确率；本次未运行原测试。'
  },
  'content-agent': {
    headline: '上游修改如何影响阶段确认、产物版本与视频合成',
    stack: [
      ['工作台', 'Vue 3 · 阶段进度 · 候选素材预览'],
      ['生成编排', 'FastAPI · SQLAlchemy · 模型服务'],
      ['知识与素材', 'RAG · 资源版本 · 分块与外部引用'],
      ['视频交付', 'FFmpeg · 视频工程修订 · 导出']
    ],
    challenges: [
      ['一次任务可能产生多轮运行和多份候选', 'content_tasks 保存目标与阶段，generation_runs 保存执行，artifacts 保存候选和版本，并关联任务及可选生成来源。', 'generation_run_id 可空；导入素材不能为了补齐关系被标记成模型生成。'],
      ['保存配置会不会让下游确认失效', '区分实际修改与相同配置重复提交；已有测试检查无变化保存不会重置已确认阶段，并兼容旧阶段名称。', '修改上游后仍需核对下游文案、配音和字幕是否有效，不能把旧确认状态直接沿用到新输入。'],
      ['模型素材地址与视频工程的生命周期不同', '临时模型文件需要转存，视频工程保存修订与素材关联；FFmpeg 负责图片、声音和字幕的确定性组合。', '浏览器能打开的受保护地址不代表外部模型能访问；媒体传递和真实生成质量要单独验证。']
    ],
    pipeline: [
      { title: '需求配置', detail: '保存任务目标与配置；重复保存相同输入不应破坏已确认阶段。' },
      { title: '主题确认', detail: '以当前配置确定主题，作为后续生成输入。' },
      { title: '文案生成', detail: '记录生成运行与候选版本，供选择和修订。' },
      { title: '内容检查', detail: '完整模式包含合规检查阶段，结果仍需人工核对。' },
      { title: '图片产物', detail: '保存任务、阶段、候选序号和素材来源，必要时转存文件。' },
      { title: '视频组合', detail: '组织图片、配音、字幕和时长，保存视频工程修订。' },
      { title: '导出', detail: '按选定产物交付；检查声音字幕一致性及组合结果。' }
    ],
    decisions: [
      ['任务、运行、产物分层保存', '任务状态与一次生成结果分别演进，重试、导入和候选选择不必覆盖同一个对象。'],
      ['合成过程交给 FFmpeg', '模型生成和媒体组合分开处理，视频工程可以记录修订及所用素材，而不只保留最后一个视频文件。']
    ],
    validation: '已有七阶段顺序和相同配置幂等更新测试；另有语音字幕一致性、视频组合与最小时长专项测试文件。本次未运行原测试，真实模型画质、语义和内容审核不由流程测试替代。'
  },
  'erp-automation': {
    headline: '商品范围内的 SKU、价格快照与逐项重试',
    stack: [
      ['输入', '飞书多维表格 · Excel / CSV · 本地商品图片'],
      ['接口', 'Python · FastAPI · 字段映射与预览'],
      ['网页执行', 'Playwright · 可见 Chrome / Edge · 隔离登录会话'],
      ['状态与交付', 'MySQL · Windows 启动与离线安装脚本']
    ],
    challenges: [
      ['不同商品复用 SKU 编码，店铺又有独立规格标识', 'product_skus 以 (product_id, sku_code) 限定唯一性；listing_skus 关联内部规格与具体上架记录。', '内部 SKU 与外部发布标识、店铺价格分开保存，不能用一个全局 SKU 字符串代替全部关联。'],
      ['重试时源价格或加价规则可能已经变化', '金额按最小货币单位保存；批次规则和已生成价格作为本轮输入保留，失败项重试沿用相同价格。', '输入改变时应识别为新一轮处理；浏览器提交成功但响应丢失时，不能仅凭脚本异常盲目重复上架。'],
      ['一批商品部分成功，进程随后退出', 'publish_job_items 保存逐项输入、状态与返回数据，重启后定位未完成部分；失败截图补充网页现场。', '真实平台结果仍要核对；登录和验证码由用户完成，已有上架说明不扩展为未验收平台能力。']
    ],
    pipeline: [
      { title: '读取输入', detail: '从飞书或 Excel / CSV 读取商品字段，关联本地图片。' },
      { title: '映射预览', detail: '预览规格、价格与图片，由操作者核对资料。' },
      { title: 'ERP 创建', detail: 'Playwright 在可见浏览器中执行商品创建。' },
      { title: '选择目标', detail: '确定平台、店铺和内部规格到发布规格的对应。' },
      { title: '生成任务项', detail: '保存本轮参数、已生成价格与逐项处理范围。' },
      { title: '发布与记录', detail: '执行网页操作，保存 SKU 结果；失败时保留截图与诊断。' },
      { title: '恢复或重试', detail: '读取持久任务，对未完成部分继续处理并核对平台状态。' }
    ],
    decisions: [
      ['采用浏览器执行层', '当前工程复用隔离的可见 Chrome / Edge 会话执行 ERP 页面操作，资料不将其描述为聚水潭开放 API 接入。'],
      ['完整迁移与升级分包', '数据库备份、结构升级和失败恢复分别安排，更新程序时保留业务数据。']
    ],
    validation: '已有数据库重启保留任务、SKU 范围、重试和迁移用例，以及调度 / 取消和配置安全测试文件。本次未运行原测试，未登录店铺、创建商品或执行上架。'
  },
  'qianchuan': {
    headline: 'OAuth 授权、多广告账号与素材任务的持久状态',
    stack: [
      ['本地界面', 'Python · Flask · 模板与路由'],
      ['平台接入', 'OceanEngine OpenAPI · OAuth 2.0 · Requests'],
      ['批量处理', '素材扫描 / 上传 · 商品映射 · 读取节流'],
      ['数据', 'SQLite · WAL · 计划、日志与报告']
    ],
    challenges: [
      ['一次授权可以关联多个广告账号', 'tokens 保存授权，token_qc_accounts 用外键关联账号及类型；切换账号时同步核对商品与素材的可用范围。', '授权刷新失败与账号切换要分别处理，不能把上一个账号的页面结果继续提交到当前账号。'],
      ['同一款素材在不同账号上的上传状态不同', '素材状态与上传账号分别保存，扫描、去重、上传、停止和补全逻辑围绕目标账号组织。', '已有去重和节流代码不代表结果未知时具备完整幂等机制；平台超时后是否已创建需要进一步核对。'],
      ['进程退出后仍要知道计划处理到哪里', 'SQLite 保存计划、素材状态、日志和报告，连接启用 WAL，为重读运行上下文提供数据。', 'WAL 不证明多线程写入或异常恢复已经通过；授权失效、限流与重复提交缺少独立测试套件验证。']
    ],
    pipeline: [
      { title: 'OAuth 授权', detail: '取得授权并处理 Token 元信息与刷新。' },
      { title: '选择账号', detail: '读取关联广告账号，明确本轮操作范围。' },
      { title: '扫描与上传', detail: '按目标账号组织本地款式素材，记录各账号上传状态。' },
      { title: '商品映射', detail: '将平台商品标识与款式、可用素材对应，核对请求输入。' },
      { title: '计划请求', detail: '组织预算、目标与素材载荷，调用创建 / 更新能力。' },
      { title: '保存状态', detail: '保存计划、日志和报告，供下一轮及中断后回看。' }
    ],
    decisions: [
      ['授权与广告账号独立建模', '复用授权生命周期，同时明确每个广告账号的业务范围；两者不是固定的一对一关系。'],
      ['关系图仅画已声明外键', 'token_qc_accounts 明确引用 tokens；素材、计划的业务标识不据此扩画成物理外键。']
    ],
    validation: '当前依据 app.py、db.py、gallery_uploader.py 的只读核对，未定位到独立测试套件。账号隔离、刷新、限流、重复请求和重启恢复仍需补测；本次没有调用真实投放接口。'
  },
  'elderly-android': {
    headline: '本机健康记录同步、位置缓存与 Android 后台生命周期',
    stack: [
      ['界面与状态', 'Kotlin · Jetpack Compose · Material 3 · ViewModel'],
      ['设备能力', '讯飞语音 · 提醒 / 通知 · 计步 / 位置 / 传感器'],
      ['服务端', 'FastAPI · WebSocket · DeepSeek'],
      ['持久化', 'SharedPreferences · SQLite · 记录与状态快照']
    ],
    challenges: [
      ['离线记录在重复同步时需要保持身份', 'HealthLocalRepository 按老人标识本地保存；服务端以 (elder_id, client_uid) 组合主键识别同一条健康记录。', '组合主键提供去重依据，不能替代完整冲突策略；跨老人范围与重复提交仍需业务回归。'],
      ['家属查到坐标时，老人设备可能没有在线', 'WebSocket 请求老人设备位置，超时可回读 SQLite 缓存；缓存携带更新时间以区分历史结果。', '当前连接映射在进程内存中，多 Worker / 多机路由未据此解决；缓存坐标不能作为刚获取的定位展示。'],
      ['提醒与传感器服务不能依赖页面持续打开', '本地提醒由调度与接收器执行；冲击检测前台服务优先线性加速度，回退加速度计，使用阈值与冷却时间。', '权限拒绝、锁屏、重启和机型限制要真机测试；强冲击阈值不是经过样本认证的跌倒分类模型。']
    ],
    pipeline: [
      { title: '本机录入', detail: '在当前老人身份下记录健康类型、数值与时间。' },
      { title: '本地保存', detail: 'SharedPreferences 按老人标识保存记录，界面切换不丢失输入。' },
      { title: '提交同步', detail: '将 client_uid、日期和时间戳随记录发送给服务端。' },
      { title: '按键归集', detail: 'SQLite 按 (elder_id, client_uid) 保存健康记录，活动按日期归集。' },
      { title: '关联访问', detail: '家属通过关联令牌解析老人范围，读取健康、提醒或位置。' },
      { title: '理解时效', detail: '区分记录时间、提醒镜像和位置缓存；网络 / 关联失败后再次读取。' }
    ],
    decisions: [
      ['本机与服务端分别保存', '本机支持离线操作的连续性，服务端承接家属读取；同步标识和时间用于连接两端记录。'],
      ['Android ER 使用逻辑关联', '对象通过 elder_id 关联，部分位于不同数据库文件；已核对建表未声明跨对象物理外键。']
    ],
    validation: '已核对同步键、WebSocket 缓存和设备服务实现；找到的 ExampleUnitTest 是算术模板。未运行构建或真机验证，语音资源、后台行为、同步冲突与异常检测仍需专项测试。'
  }
};

window.projectEngineeringEn = {
  'pi-native-crm': {
    headline: 'How RLS, approval, and leases constrain a CRM write',
    stack: [
      ['Workspace', 'TypeScript · Next.js 16 / React 19 · TanStack Query · React Hook Form / Zod'],
      ['Background execution', 'Node.js · Independent workers · PostgreSQL queue and leases · Redis support'],
      ['Agent runtime', 'Pi Agent Core / Pi AI 0.86.1 · ModelGateway · MCP'],
      ['Data and extensions', 'Supabase / RLS / Realtime · pgvector · Mem0 / WeKnora / Langfuse adapters']
    ],
    challenges: [
      ['Model-proposed actions still need tenant, role, and argument boundaries', 'The supplied implementation description places organization data under PostgreSQL RLS, roles under server checks, and action, budget, and approval checks in the Harness. Acceptance still needs to verify whether approval is bound to the specific object and parameters.', 'Read-only investigation and business writes have separate scopes. Recovery must recheck permissions and approval; agreement in a chat message is not a server-side decision.'],
      ['Losing a worker lease and not knowing a business outcome are different failures', 'A database queue persists tasks, independent workers obtain execution through leases, and stored state supports recovery. Idempotency constrains repeated business requests.', 'Expired workers or failed renewals must stop publication. Leases do not replace side-effect idempotency; unknown outcomes and withdrawn approvals still require fault-injection tests.'],
      ['Memory, knowledge sources, and evaluations must not collapse into one model reply', 'Organization memory versions and session checkpoints retain context. Retrieval preserves source fragments and versions, SQL stores runs and tool events, and deterministic rules remain separate from an explicit LLM Judge.', 'Mem0, WeKnora, and Langfuse have backend adapters. The supplied material does not establish completed service integration, isolation tests, or evaluated results.']
    ],
    pipeline: [
      { title: 'Resolve business scope', detail: 'After authentication, read customer and opportunity context within the organization and role scope.' },
      { title: 'Investigate and retrieve', detail: 'A parent Agent coordinates read-only subtasks and collects evidence from memory and knowledge sources.' },
      { title: 'Propose a specific action', detail: 'Show the target, arguments, supporting sources, and budget as a reviewable proposal.' },
      { title: 'Authorize and approve', detail: 'RLS, server roles, and the Harness apply layered checks. Writes wait for valid approval.' },
      { title: 'Execute under a lease', detail: 'An independent worker claims a durable task and checks ownership, cancellation, and idempotency scope.' },
      { title: 'Record and evaluate', detail: 'SQL retains run and tool events. Deterministic rules, an explicit Judge, and observability exports remain separate.' }
    ],
    decisions: [
      ['Persist task state in the database', 'Leaving the page does not end a task. Independent workers and scheduled tasks consume the durable queue, while Redis provides caching and supporting functions.'],
      ['Keep the CRM diagram conceptual', 'Current evidence consists of the supplied description and interface. Organization, customer, action, and approval names do not establish audited tables or physical foreign keys.']
    ],
    validation: 'Based on the supplied technology stack, implementation status, and interface. No source audit or project execution was performed. A Vitest / Playwright tool list does not mean tests passed. Tenant isolation, withdrawn approval, competing leases, and external-service integration still require acceptance checks.'
  },
  'silver-guardian': {
    headline: 'Connecting family permissions, tool confirmation, and business transactions',
    stack: [
      ['Devices', 'HarmonyOS / ArkTS · Phone and watch projects'],
      ['Business service', 'Spring Boot · Modular monolith · PostgreSQL'],
      ['Tool orchestration', 'FastAPI · Model adapters · Tool gateway'],
      ['Administration and development', 'Vue 3 · Database migrations · Local H2 configuration']
    ],
    challenges: [
      ['A model-selected tool must not write directly to the business database', 'Execution carries user and family context, checks capabilities and permissions, waits for confirmation when required, and calls Core through a gateway. Auditing accompanies execution.', 'Cancellation, revoked access, or an unavailable capability must stop execution. Selecting a tool does not establish server-side authorization.'],
      ['A committed update may still have an undelivered event', 'Core groups deterministic changes inside a business transaction and records pending events in a Transactional Outbox for asynchronous collaboration.', 'Delivery, deduplication, and monitoring are still required. An Outbox does not establish exactly-once execution by every consumer.'],
      ['A cached family role may be stale', 'A unique (family_id, user_id) constraint prevents duplicate membership. Later requests check current server-side relationships and permissions.', 'Removing a relationship must invalidate reliance on the old role. Device acknowledgments, real Providers, signing, and release require separate acceptance checks.']
    ],
    pipeline: [
      { title: 'Receive request', detail: 'The ArkTS phone client submits a request with the current account context and role.' },
      { title: 'Check relationships', detail: 'Core validates identity, family association, and accessible scope.' },
      { title: 'Select tool', detail: 'The Agent adapts the model response and prepares tool arguments and execution context.' },
      { title: 'Check and confirm', detail: 'Capabilities and permissions are checked; actions requiring confirmation wait for the user.' },
      { title: 'Execute in Core', detail: 'The gateway calls the business service, which saves updates within its transaction boundary.' },
      { title: 'Deliver and return', detail: 'The Outbox holds asynchronous events; results return with an audit trail.' }
    ],
    decisions: [
      ['Separate Core from the Agent', 'Identity, relationships, and database writes belong to the business service. Model adapters and tool orchestration belong to the Agent; authorization remains outside the model.'],
      ['Enforce composite membership uniqueness', 'A user can have one membership record in a given family. Repeated requests must not keep adding the same association.']
    ],
    validation: 'Tool authorization, confirmation, audit, and OpenAPI contract test code exists. The original project was not executed in this review. Physical devices, real model services, signing, and production release remain outside completed acceptance.'
  },
  'meeting-agent': {
    headline: 'Recovery boundaries for chunked audio uploads, task leases, and transcript versions',
    stack: [
      ['Review interface', 'Vue 3 · Audio, transcript, and minutes editing'],
      ['Tasks and data', 'FastAPI · SQLAlchemy · Alembic'],
      ['Speech processing', 'ASR adapters · Voiceprint / speaker diarization services'],
      ['Media and export', 'FFmpeg · WebSocket · python-docx']
    ],
    challenges: [
      ['A long audio upload can lose its network connection', 'Uploads support chunks and resumption. Existing tests check received chunk counts and merged file size, while server-side tasks hold processing state.', 'A completed upload establishes audio ingestion only. Recognition, speaker attribution, and minutes content require separate review.'],
      ['An old worker may return after a timed-out task has recovered', 'The pilot architecture tracks execution through durable tasks, leases, and heartbeats. Result publication rechecks execution ownership so stale workers cannot overwrite recovery results.', 'An expired lease does not mean the old process has stopped. Cancellation, recovery races, and result writes must be tested together.'],
      ['Retranscription can change the evidence behind earlier minutes', 'Each retranscription creates a new TranscriptionRun, retaining segments and human revisions. Minutes versions link to transcript segments through source records.', 'Candidate participants and detected speakers are separate models. Candidate headcount must not determine the acoustic speaker count.']
    ],
    pipeline: [
      { title: 'Create and assign', detail: 'Create an owned meeting; store participants as candidates for identity matching.' },
      { title: 'Upload chunks', detail: 'Receive audio chunks, track received parts, and merge the meeting audio.' },
      { title: 'Claim task', detail: 'Durable tasks reference entities and object keys; leases and heartbeats track ownership.' },
      { title: 'Process speech', detail: 'Providers perform ASR and speaker processing; stale executions must recheck ownership before publishing.' },
      { title: 'Store transcript run', detail: 'Save the run, segments, and word timings. Reruns retain earlier results.' },
      { title: 'Review and revise', detail: 'Check text and speakers, then save minutes versions and their source records.' },
      { title: 'Export document', detail: 'Export the selected version while retaining its relationship to revisions and sources.' }
    ],
    decisions: [
      ['Pass references in task messages', 'Queue and task payloads reference entity IDs and object keys instead of carrying recording content.'],
      ['Keep Providers limited to input/output adaptation', 'Transactions, confirmation, and auditing stay in the application layer, so changing ASR or model vendors does not rewrite permission and version rules.']
    ],
    validation: 'Reviewed workflow assertions cover cross-user 403 responses, received chunk counts, and merged size. Dedicated long-audio and competing-lease recovery tests exist. The transcription-to-export flow uses mocks and does not establish real recording accuracy. Original tests were not run in this review.'
  },
  'content-agent': {
    headline: 'How upstream changes affect stage confirmation, artifact versions, and video composition',
    stack: [
      ['Workspace', 'Vue 3 · Stage progress · Candidate asset previews'],
      ['Generation orchestration', 'FastAPI · SQLAlchemy · Model services'],
      ['Knowledge and assets', 'RAG · Resource versions · Chunks and external references'],
      ['Video delivery', 'FFmpeg · Video project revisions · Export']
    ],
    challenges: [
      ['One task can produce multiple runs and candidate assets', 'content_tasks holds objectives and stages, generation_runs holds executions, and artifacts holds candidates and versions with a task and optional generation source.', 'generation_run_id is nullable. Imported assets must not be labeled as model output merely to fill a relationship.'],
      ['Saving configuration may invalidate downstream confirmations', 'The workflow distinguishes actual changes from identical repeated submissions. Existing tests check that unchanged saves preserve confirmed stages and support legacy stage names.', 'After an upstream edit, downstream copy, voice, and subtitles must be checked. Earlier confirmation cannot be assumed valid for changed input.'],
      ['Model asset URLs and video projects have different lifetimes', 'Temporary model files need durable transfer. Video projects store revisions and asset relationships, while FFmpeg performs deterministic image, audio, and subtitle composition.', 'A protected URL accessible to a browser may be inaccessible to an external model. Media delivery and real generation quality need independent validation.']
    ],
    pipeline: [
      { title: 'Configure task', detail: 'Save objectives and configuration. Repeating the same input should preserve confirmed stages.' },
      { title: 'Confirm topic', detail: 'Select a topic under the current configuration as the input to later generation.' },
      { title: 'Generate copy', detail: 'Record generation runs and candidate versions for selection and revision.' },
      { title: 'Check content', detail: 'The full workflow includes a compliance stage; its output still requires human review.' },
      { title: 'Store images', detail: 'Save task, stage, candidate index, and asset source; transfer files when required.' },
      { title: 'Compose video', detail: 'Arrange images, voice, subtitles, and timing, then save video project revisions.' },
      { title: 'Export', detail: 'Deliver selected artifacts and check voice/subtitle consistency and composition results.' }
    ],
    decisions: [
      ['Separate tasks, runs, and artifacts', 'Task state and individual generation results can evolve independently. Retries, imports, and candidate selection need not overwrite one shared object.'],
      ['Use FFmpeg for composition', 'Model generation and media assembly are separate, allowing video projects to retain revisions and source assets alongside the final video.' ]
    ],
    validation: 'Tests exist for seven-stage ordering and idempotent saves of identical configuration. Separate files cover voice/subtitle consistency, video composition, and minimum duration. Original tests were not run here. Workflow tests do not substitute for real image quality, semantic review, or content approval.'
  },
  'erp-automation': {
    headline: 'Product-scoped SKUs, price snapshots, and per-item retries',
    stack: [
      ['Inputs', 'Feishu Bitable · Excel / CSV · Local product images'],
      ['Interface', 'Python · FastAPI · Field mapping and preview'],
      ['Browser execution', 'Playwright · Visible Chrome / Edge · Isolated login sessions'],
      ['State and delivery', 'MySQL · Windows launch and offline installation scripts']
    ],
    challenges: [
      ['Products can reuse SKU codes while stores have their own variant identifiers', 'product_skus enforces uniqueness on (product_id, sku_code). listing_skus connects internal variants with a specific listing.', 'Internal SKUs, external publication identifiers, and store prices remain separate. One global SKU string cannot represent every relationship.'],
      ['Source prices or markup rules may change before a retry', 'Amounts use minor currency units. Batch rules and already generated prices remain part of the current input, so failed-item retries retain the same prices.', 'Changed input should identify a new processing round. A browser error after submission does not justify blindly repeating a listing whose platform result is unknown.'],
      ['A process can exit after only part of a batch succeeds', 'publish_job_items stores item inputs, status, and response data. Restarted processing can find unfinished items; failure screenshots retain browser context.', 'Platform results still need checking. Users handle login and verification codes, and documented platform support is not expanded to unaccepted integrations.']
    ],
    pipeline: [
      { title: 'Read inputs', detail: 'Read product fields from Feishu or Excel / CSV and associate local images.' },
      { title: 'Map and preview', detail: 'Preview variants, prices, and images for operator review.' },
      { title: 'Create ERP product', detail: 'Playwright performs product creation in a visible browser.' },
      { title: 'Choose destination', detail: 'Select platform and store, then map internal variants to listing variants.' },
      { title: 'Create job items', detail: 'Save current parameters, generated prices, and the item processing scope.' },
      { title: 'Publish and record', detail: 'Execute browser actions and save SKU results; retain screenshots and diagnostics on failure.' },
      { title: 'Recover or retry', detail: 'Read durable job state, continue unfinished items, and check platform status.' }
    ],
    decisions: [
      ['Use browser execution', 'The current implementation reuses isolated visible Chrome / Edge sessions for ERP page operations. The notes do not describe it as a Jushuitan OpenAPI integration.'],
      ['Separate full migration and upgrade packages', 'Database backup, schema upgrades, and failure recovery are planned separately so program updates retain business data.']
    ],
    validation: 'Database cases cover job persistence across restarts, SKU scope, retries, and migration. Scheduling/cancellation and configuration security test files also exist. Original tests were not run in this review; no store login, product creation, or listing was performed.'
  },
  'qianchuan': {
    headline: 'Durable state across OAuth grants, advertiser accounts, and asset tasks',
    stack: [
      ['Local interface', 'Python · Flask · Templates and routes'],
      ['Platform integration', 'OceanEngine OpenAPI · OAuth 2.0 · Requests'],
      ['Batch processing', 'Asset scanning / upload · Product mapping · Read throttling'],
      ['Data', 'SQLite · WAL · Plans, logs, and reports']
    ],
    challenges: [
      ['One authorization grant can cover multiple advertiser accounts', 'tokens holds grants, and token_qc_accounts relates accounts and types through a foreign key. Account changes require checking the available products and assets for the new scope.', 'Token refresh failures and account selection are separate concerns. Results from the previous account must not be submitted under the current account.'],
      ['The same asset has different upload states across accounts', 'Asset state and upload accounts are stored separately. Scanning, deduplication, upload, stop, and completion logic operate around the target account.', 'Existing deduplication and throttling code does not establish complete idempotency for unknown results. Platform timeouts require checking whether creation already occurred.'],
      ['A restart must preserve progress on plans', 'SQLite stores plans, asset state, logs, and reports. Connections enable WAL, providing stored context for later reads.', 'WAL does not establish tested concurrent writes or recovery. Expired grants, rate limits, and repeated submissions lack verification from an independent test suite.']
    ],
    pipeline: [
      { title: 'Authorize with OAuth', detail: 'Obtain a grant and handle token metadata and refresh.' },
      { title: 'Select account', detail: 'Read associated advertiser accounts and establish the processing scope.' },
      { title: 'Scan and upload', detail: 'Organize local style assets for target accounts and record each account upload state.' },
      { title: 'Map products', detail: 'Match platform product identifiers, styles, and available assets, then review request inputs.' },
      { title: 'Request plans', detail: 'Build budget, target, and asset payloads for create / update operations.' },
      { title: 'Persist state', detail: 'Save plans, logs, and reports for the next round and post-interruption inspection.' }
    ],
    decisions: [
      ['Model grants separately from advertiser accounts', 'Authorization lifecycle can be reused while each account retains an explicit business scope. The relationship is not fixed at one to one.'],
      ['Draw only declared foreign keys', 'token_qc_accounts explicitly references tokens. Business identifiers in asset and plan records are not expanded into invented physical foreign keys.']
    ],
    validation: 'Current evidence is a read-only review of app.py, db.py, and gallery_uploader.py. No independent test suite was located. Account isolation, refresh, rate limits, repeated requests, and restart recovery still need tests. No real advertising API was called in this review.'
  },
  'elderly-android': {
    headline: 'Local health synchronization, location caches, and Android background lifecycle',
    stack: [
      ['UI and state', 'Kotlin · Jetpack Compose · Material 3 · ViewModel'],
      ['Device features', 'iFlytek speech · Reminders / notifications · Steps / location / sensors'],
      ['Backend', 'FastAPI · WebSocket · DeepSeek'],
      ['Persistence', 'SharedPreferences · SQLite · Records and state snapshots']
    ],
    challenges: [
      ['Offline records need stable identities when synchronized again', 'HealthLocalRepository stores local records by older-adult identifier. The server identifies a health record through the composite key (elder_id, client_uid).', 'The key supports deduplication but does not establish a complete conflict policy. Cross-person scope and repeated submissions still need business regression tests.'],
      ['The device may be offline when a family member requests a location', 'WebSocket requests a location from the older adult device. A timeout can fall back to a SQLite cache whose update time distinguishes historical results.', 'Connection mappings currently live in process memory. Multi-worker or multi-host routing is not resolved by this cache, and cached coordinates must not appear newly measured.'],
      ['Reminders and sensor services cannot depend on an open screen', 'Local scheduling and receivers execute reminders. A foreground impact service prefers linear acceleration, falls back to an accelerometer, and uses thresholds and a cooldown.', 'Permission denial, lock screen, restart, and device restrictions require physical-device tests. An impact threshold is not a fall classifier validated on representative samples.']
    ],
    pipeline: [
      { title: 'Enter locally', detail: 'Record health type, value, and time under the current older-adult identity.' },
      { title: 'Save on device', detail: 'SharedPreferences stores records by person so screen changes retain the input.' },
      { title: 'Submit sync', detail: 'Send the record with client_uid, date, and timestamp to the backend.' },
      { title: 'Group by keys', detail: 'SQLite stores health records by (elder_id, client_uid) and daily activity by date.' },
      { title: 'Resolve family scope', detail: 'Association tokens resolve the person whose health, reminder, or location data can be read.' },
      { title: 'Show freshness', detail: 'Distinguish record time, reminder mirrors, and location caches; retry reads after network or association failures.' }
    ],
    decisions: [
      ['Keep device and server persistence separate', 'Device storage supports offline continuity. Server storage supports family access, with synchronization identifiers and times connecting the records.'],
      ['Use a logical Android data diagram', 'Objects relate through elder_id, sometimes across different database files. Reviewed table definitions do not declare physical foreign keys between these objects.']
    ],
    validation: 'Synchronization keys, WebSocket caching, and device services were reviewed. The located ExampleUnitTest is an arithmetic template. No build or physical-device validation ran; speech resources, background behavior, sync conflicts, and impact detection still need dedicated tests.'
  }
};
/* Project naming and card summaries keep the implementation in the foreground. */
(() => {
 const edits = {
  'silver-guardian': ['银龄守护 · 鸿蒙版：家庭授权与工具执行','Silver Guardian · HarmonyOS: family permissions and tool execution','ArkTS 设备端、Spring Boot 业务核心与 FastAPI 工具网关，重点处理家庭权限、确认和事务事件。','ArkTS clients, a Spring Boot core and a FastAPI tool gateway; family permissions, confirmations and transactional events.',['家庭授权','工具网关','Outbox'],['Family scope','Tool gateway','Outbox']],
  'meeting-agent': ['会议记录系统：长音频任务恢复与版本溯源','Meeting records: durable audio processing and version provenance','FastAPI / Vue 会议工作台，围绕分片上传、Worker 租约、不可变转写运行与纪要来源建模。','A FastAPI / Vue workbench with chunked uploads, Worker leases, immutable transcription runs and minutes provenance.',['任务租约','转写运行','来源版本'],['Job lease','Transcript run','Version source']],
  'content-agent': ['内容制作工作台：阶段确认与产物版本','Content workbench: stage confirmation and artifact versions','FastAPI 编排多阶段生成，区分任务、运行和产物；用版本与失效规则管理视频交付。','FastAPI orchestrates generation stages, separates tasks, runs and artifacts, and tracks revisions and invalidation for video delivery.',['阶段确认','产物版本','FFmpeg'],['Stage state','Artifact version','FFmpeg']],
  'erp-automation': ['ERP 上架工具：SKU 映射与失败项重试','ERP publishing: SKU mapping and item-level retries','Python / Playwright 驱动 ERP 网页，MySQL 保存 SKU 映射、价格快照和逐项发布结果。','Python / Playwright drives the ERP browser; MySQL stores SKU mappings, price snapshots and per-item outcomes.',['SKU 映射','价格快照','逐项重试'],['SKU mapping','Price snapshot','Item retry']],
  'qianchuan': ['千川投放工具：多账号授权与批量状态','Qianchuan tooling: multi-account authorization and batch state','Flask / SQLite 本地工具，通过 OAuth 管理广告账号，记录素材上传、投放计划与批量任务状态。','A Flask / SQLite tool for OAuth account access, material uploads, advertising plans and batch execution state.',['OAuth','账号范围','任务状态'],['OAuth','Account scope','Task state']],
  'elderly-android': ['银龄守护 · 安卓版：本地同步与位置回读','Silver Guardian · Android: local sync and location fallback','Kotlin / Compose 客户端与 FastAPI 后端，重点处理同步组合键、WebSocket 位置缓存及设备生命周期。','A Kotlin / Compose client and FastAPI backend focused on sync keys, WebSocket location fallback and device lifecycle.',['本地记录','组合键同步','位置回读'],['Local record','Sync key','Location cache']],
  'pi-native-crm': ['客户协作台 CRM：客户管理与受控任务执行','Customer Workspace CRM: customer records and controlled execution','TypeScript 全栈 CRM，以 RLS、服务端授权、审批和数据库租约约束客户任务执行。','A TypeScript CRM with RLS, server authorization, approvals and database leases governing customer task execution.',['租户授权','动作审批','租约执行'],['Tenant scope','Approval','Worker lease']]
 };
 for(const [id,e] of Object.entries(edits)){
  const zh=window.projectStories.find(p=>p.id===id), en=window.projectStoriesEn.find(p=>p.id===id);
  if(zh){zh.title=e[0];zh.description=e[2];zh.cardFlow=e[4];}
  if(en){en.title=e[1];en.description=e[3];en.cardFlow=e[5];}
 }
})();
/* Concise article decks and delivery notes; no measured outcomes are inferred. */
(() => {
 const scope={
 'silver-guardian': [
  ['包含 ArkTS 手机 / 手表、Spring Boot Core、FastAPI Agent 与 Vue 后台工程，配有迁移和测试代码；当前按 MVP / 工程原型展示。','真机回执、真实模型服务、应用签名及发布尚需联调；下一步验证授权撤销、取消与事件投递失败后的状态一致性。'],
  ['The prototype includes ArkTS phone/watch clients, Spring Boot Core, a FastAPI Agent and a Vue admin app, with migrations and test code.','Device receipts, live model providers, signing and release still need integration. Next checks cover revoked access, cancellation and event delivery failures.']],
 'meeting-agent': [
  ['Vue 前端、会议服务和说话人服务分别启动；Provider、音频目录与身份配置依部署环境确定。','下一步用真实录音验证 ASR 与说话人效果，并单独验收租约竞争、转写重跑后来源不变和版本导出。'],
  ['The Vue frontend, meeting service and speaker service run separately. Provider, audio storage and identity settings depend on the deployment.','Next checks use real recordings for ASR and speaker quality, with separate cases for lease races, source preservation after retranscription and versioned exports.']],
 'content-agent': [
  ['内容服务独立保存数据库、对象目录、迁移与模型配置；离线测试使用确定性实现，真实生成依赖外部供应商。','下一步走完一条作品的生成与导出，再修改文案、重试失败阶段，核对配音、字幕、视频版本及临时文件转存。'],
  ['The content service has its own database, object directory, migrations and model settings. Offline tests use deterministic implementations; live generation uses external providers.','Next validation follows one work through generation and export, then changes copy and retries a failed stage to check audio, subtitles, video revisions and persistent media.']],
 'erp-automation': [
  ['按 Windows 本地环境交付：FastAPI 网页服务、浏览器自动化和独立 MySQL；换机后重新配置登录会话和素材目录。','下一步核对单 / 多规格、缺图、价格快照与失败项重试，并以目标平台记录确认发布结果。本文未执行真实上架。'],
  ['Delivery targets Windows with a FastAPI web service, browser automation and a separate MySQL database. A new machine needs fresh sessions and media path configuration.','Next cases cover single/multiple variants, missing images, price snapshots and item retries, with target-platform records confirming the result. No live publishing was performed for this article.']],
 'qianchuan': [
  ['已整理 Flask 接口、素材处理和 SQLite 持久化；未定位到独立自动化测试套件，当前按本地业务工具展示。','优先补 OAuth 刷新、账号范围、限流和结果未知的模拟测试；再在授权账号核对小批量流程。恢复、并发和投放收益尚无验证结论。'],
  ['The reviewed material contains Flask endpoints, material handling and SQLite persistence. No standalone automated suite was found; this is presented as a local business tool.','Priorities are simulated OAuth refresh, account scope, rate-limit and unknown-result cases, followed by a small authorized batch. Recovery, concurrency and advertising returns remain unverified.']],
 'elderly-android': [
  ['Android 客户端、FastAPI 后端与讯飞语音资源分别配置；本地记录与服务端同步数据各有存储边界。','下一步覆盖重复同步、WebSocket 断线、权限拒绝、锁屏与重启，并用真实机型测试阈值检测误报；本次未构建应用或触发设备操作。'],
  ['The Android client, FastAPI backend and Xunfei speech resources are configured separately. Local records and server sync data have distinct storage boundaries.','Next checks cover duplicate sync, WebSocket disconnections, denied permissions, screen lock and reboot, plus threshold false positives on real devices. No app build or device action was performed for this article.']]
 };
 for(const [id,content] of Object.entries(scope)){
  const zh=window.projectStories.find(p=>p.id===id),en=window.projectStoriesEn.find(p=>p.id===id);
  window.projectDetails[id].summary=zh.description;
  window.projectDetailsEn[id].summary=en.description;
  window.projectDetails[id].delivery=content[0];window.projectDetailsEn[id].delivery=content[1];
 }
})();
(() => {
 const context={
  'pi-native-crm':['客户、商机、审批和运行记录保存在 PostgreSQL，Next.js 负责业务请求，独立 Worker 执行持久任务。这里重点说明一次客户写入如何经过授权、审批和租约执行。','PostgreSQL stores customers, opportunities, approvals and runs. Next.js handles business requests while a separate Worker executes durable jobs. This case follows a CRM write through authorization, approval and lease-based execution.'],
  'silver-guardian':['手机和手表提交照护请求，Core 保存身份、家庭关系和业务数据，Agent 通过工具网关调用业务能力。难点在于把家庭授权、用户确认和异步事件放在同一条可核对的执行链里。','Phone and watch clients submit care requests. Core owns identity, family relationships and business data; the Agent calls business capabilities through a tool gateway. The main problem is keeping authorization, user confirmation and asynchronous events consistent.'],
  'meeting-agent':['系统接收长音频，经过转写与人工核对形成纪要。上传、处理任务、转写运行和文档版本分别建模，避免一次重跑覆盖历史依据。','The system receives long recordings, transcribes them and supports human review before producing minutes. Uploads, jobs, transcription runs and document versions are separate so reruns preserve earlier evidence.'],
  'content-agent':['一次内容任务会跨越文案、配音、字幕和视频。实现中分别记录阶段、运行和产物，重点处理上游修改后的失效传播，以及临时媒体与持久版本的边界。','A content job spans copy, audio, subtitles and video. Stages, runs and artifacts are recorded separately, with attention to invalidation after upstream edits and the boundary between temporary media and persistent versions.'],
  'erp-automation':['输入来自飞书表格、Excel / CSV 和本地图片，经字段映射与人工核对后由浏览器写入 ERP。任务记录需要保存本轮输入和价格，才能只重试失败项。','Input comes from Feishu tables, Excel / CSV and local images. After field mapping and review, browser automation writes to the ERP. Job records preserve the current input and prices so retries can target failed items.'],
  'qianchuan':['本地工具管理平台授权、广告账号、商品与素材，调用开放接口执行批量操作。核心问题是账号切换后的数据范围，以及请求失败或中断时保留多少可恢复状态。','The local tool manages platform authorization, advertising accounts, products and materials, then calls public APIs for batch operations. Key questions are account scope after switching and the state available after failure or interruption.'],
  'elderly-android':['Android 端提供语音、提醒、健康记录和位置能力，FastAPI 与 SQLite 保存跨设备数据。文章聚焦重复同步的记录身份、位置请求超时后的缓存回读和后台服务生命周期。','The Android app handles speech, reminders, health records and location, with FastAPI and SQLite storing cross-device data. This case focuses on record identity during repeated sync, cached location after timeout and background lifecycle behavior.']
 };
 for(const [id,copy] of Object.entries(context)){window.projectEngineering[id].context=copy[0];window.projectEngineeringEn[id].context=copy[1];}
})();
