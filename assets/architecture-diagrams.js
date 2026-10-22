/* Project-specific architecture, based on the reviewed project notes.
 * CRM describes supplied implementation information, not an audited deployment.
 * Public API: window.YuecongArchitecture.render(projectId, english = false).
 */
(() => {
  'use strict';
  let sequence = 0;
  const esc = value => String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
  const pair = (zh, en) => [zh, en];
  const node = (id, x, y, title, lines, pending = false) => ({ id, x, y, title, lines, pending });
  const edge = (from, to, path, label, x, y, both = false, pending = false) => ({ from, to, path, label, x, y, both, pending });
  const columns = [26, 336, 646];
  const graphs = {
    'silver-guardian': {
      height: 456,
      title: pair('鸿蒙照护平台：设备、业务核心与工具网关', 'HarmonyOS care: devices, business core and tool gateway'),
      lanes: [pair('设备与管理入口', 'Devices and administration'), pair('应用服务边界', 'Application services'), pair('数据与模型', 'Data and models')],
      caption: pair('Core 负责身份、家庭权限和业务事务，Agent 经工具网关调用 Core；模型不直接写业务库。Outbox 与业务更新保存在事务边界内，后续投递仍需去重与监控。真机与真实模型服务需独立验收。', 'Core owns identity, family permissions and business transactions. The Agent calls Core through its tool gateway; models do not write the business database directly. Outbox records share the transaction boundary, while delivery still needs deduplication and monitoring. Devices and live model services need separate acceptance checks.'),
      nodes: [
        node('device', 26, 94, pair('手机 / 手表', 'Phone / watch'), [pair('HarmonyOS / ArkTS', 'HarmonyOS / ArkTS'), pair('老人端 · 家属端', 'Older adult / family roles')]),
        node('core', 336, 94, pair('业务核心', 'Business core'), [pair('Spring Boot', 'Spring Boot'), pair('身份 · 家庭授权 · 业务事务', 'Identity / family / transactions')]),
        node('database', 646, 94, pair('业务数据', 'Business data'), [pair('PostgreSQL', 'PostgreSQL'), pair('领域 Schema · Outbox', 'Domain schemas / Outbox')]),
        node('admin', 26, 306, pair('运营后台', 'Administration'), [pair('Vue 3', 'Vue 3'), pair('业务管理与配置', 'Business management / config')]),
        node('agent', 336, 306, pair('Agent / 工具网关', 'Agent / tool gateway'), [pair('FastAPI', 'FastAPI'), pair('能力检查 · 确认 · 审计', 'Capability / confirm / audit')]),
        node('model', 646, 306, pair('模型适配', 'Model adapters'), [pair('Provider 接入', 'Provider integration'), pair('对话与工具选择', 'Dialogue / tool selection')])
      ],
      edges: [
        edge('device', 'core', 'M254 146 H336', pair('业务请求', 'Requests'), 295, 132),
        edge('admin', 'core', 'M254 358 H290 V174 H336', pair('管理调用', 'Admin calls'), 290, 262),
        edge('core', 'database', 'M564 146 H646', pair('事务读写', 'Read / write'), 605, 132, true),
        edge('agent', 'core', 'M450 306 V198', pair('上下文 / 工具调用', 'Context / tools'), 450, 255, true),
        edge('agent', 'model', 'M564 358 H646', pair('模型请求', 'Inference'), 605, 344, true)
      ]
    },
    'elderly-android': {
      height: 642,
      title: pair('安卓照护助手：本机记录、同步与位置回读', 'Android care: local records, sync and location fallback'),
      lanes: [pair('手机侧', 'On-device'), pair('服务与连接', 'Services and connections'), pair('家属与服务端数据', 'Family and backend data')],
      caption: pair('本机健康记录先保存在 SharedPreferences，再按老人标识与客户端记录标识同步。WebSocket 联系老人设备，超时可读取带时间的位置缓存；连接映射目前在进程内。Android 权限、后台提醒及传感器行为仍需真机验证。', 'Health records are saved in SharedPreferences before synchronization by older-adult and client-record identifiers. WebSocket contacts the device, with timestamped location-cache fallback on timeout. Connection mappings are currently in process memory. Permissions, background reminders and sensors require device testing.'),
      nodes: [
        node('phone', 26, 94, pair('老人手机', 'Older adult phone'), [pair('Kotlin / Jetpack Compose', 'Kotlin / Jetpack Compose'), pair('语音 · 记录 · 设备服务', 'Voice / records / device services')]),
        node('api', 336, 94, pair('照护后端', 'Care backend'), [pair('FastAPI', 'FastAPI'), pair('同步 · 关联范围 · 查询', 'Sync / family scope / queries')]),
        node('family', 646, 94, pair('家属端', 'Family mode'), [pair('Android / Compose', 'Android / Compose'), pair('关联老人数据查看', 'Read linked older-adult data')]),
        node('local', 26, 306, pair('本机记录', 'Local records'), [pair('SharedPreferences', 'SharedPreferences'), pair('HealthLocalRepository', 'HealthLocalRepository')]),
        node('socket', 336, 306, pair('设备连接', 'Device connection'), [pair('WebSocket', 'WebSocket'), pair('位置请求 · 进程内映射', 'Location / in-process mapping')]),
        node('database', 646, 306, pair('同步与缓存', 'Synced data / cache'), [pair('SQLite', 'SQLite'), pair('健康 · 提醒镜像 · 位置', 'Health / reminders / location')]),
        node('model', 646, 492, pair('对话与建议', 'Dialogue / suggestions'), [pair('DeepSeek', 'DeepSeek'), pair('根据输入生成辅助建议', 'Generate supporting suggestions')])
      ],
      edges: [
        edge('phone', 'api', 'M254 146 H336', pair('同步 / 对话', 'Sync / chat'), 295, 132, true),
        edge('family', 'api', 'M646 146 H564', pair('授权读取', 'Read data'), 605, 132),
        edge('phone', 'local', 'M140 198 V306', pair('本机保存', 'Local save'), 140, 255, true),
        edge('api', 'socket', 'M450 198 V306', pair('请求设备', 'Contact device'), 450, 282),
        edge('socket', 'phone', 'M336 358 H290 V174 H254', pair('请求 / 回传', 'Request / reply'), 290, 282, true),
        edge('api', 'database', 'M564 174 H610 V334 H646', pair('保存 / 查询', 'Store / query'), 610, 278, true),
        edge('socket', 'database', 'M564 378 H646', pair('缓存回读', 'Cache read'), 605, 398),
        edge('api', 'model', 'M500 198 V230 H888 V544 H874', pair('模型调用', 'Model calls'), 757, 230, true)
      ]
    },
    'meeting-agent': {
      height: 642,
      title: pair('会议记录：音频引用、任务租约与版本数据', 'Meeting records: audio references, job leases and versioned data'),
      lanes: [pair('用户与审阅', 'User and review'), pair('应用与执行', 'Application and execution'), pair('音频处理与交付', 'Audio processing and delivery')],
      caption: pair('任务保存实体 ID 与文件对象键，Worker 通过租约和心跳取得执行资格，写结果前再次检查。ASR 与说话人处理由适配层接入，事务和版本留在应用层；参会候选名单不决定声学说话人数。图中未指定未经证实的队列产品。', 'Jobs hold entity IDs and file object keys. Workers use leases and heartbeats, then recheck ownership before publishing results. Adapters connect ASR and speaker processing; the application owns transactions and versions. Participant candidates do not determine acoustic speaker count. No unverified queue product is specified.'),
      nodes: [
        node('ui', 26, 94, pair('会议审阅台', 'Meeting review'), [pair('Vue 3', 'Vue 3'), pair('音频 · 转写 · 纪要修订', 'Audio / transcripts / revisions')]),
        node('api', 336, 94, pair('会议应用层', 'Meeting application'), [pair('FastAPI / SQLAlchemy', 'FastAPI / SQLAlchemy'), pair('权限 · 上传 · 版本管理', 'Access / uploads / versions')]),
        node('audio', 646, 94, pair('音频文件', 'Audio files'), [pair('分片上传 / 文件存储', 'Chunked upload / file storage'), pair('以对象键引用原始录音', 'Object-key audio references')]),
        node('worker', 336, 306, pair('任务 / Worker', 'Jobs / workers'), [pair('持久任务 · 租约 · 心跳', 'Durable jobs / lease / heartbeat'), pair('FFmpeg 媒体预处理', 'FFmpeg media preprocessing')]),
        node('speech', 646, 306, pair('语音适配层', 'Speech adapters'), [pair('ASR Provider', 'ASR Provider'), pair('独立声纹 / 说话人服务', 'Voiceprint / speaker service')]),
        node('database', 336, 492, pair('任务与版本数据', 'Jobs / versioned data'), [pair('SQLAlchemy / Alembic', 'SQLAlchemy / Alembic'), pair('转写运行 · 片段 · 纪要来源', 'Runs / segments / provenance')]),
        node('export', 646, 492, pair('文档导出', 'Document export'), [pair('python-docx', 'python-docx'), pair('选定纪要版本', 'Selected minutes version')])
      ],
      edges: [
        edge('ui', 'api', 'M254 146 H336', pair('审阅 / 修订', 'Review'), 295, 132, true),
        edge('api', 'audio', 'M564 146 H646', pair('上传分片', 'Upload'), 605, 132),
        edge('api', 'database', 'M336 174 H290 V544 H336', pair('持久化 / 查询', 'Persist / query'), 290, 447, true),
        edge('worker', 'audio', 'M500 306 V244 H760 V198', pair('读取音频引用', 'Read audio reference'), 652, 244),
        edge('worker', 'speech', 'M564 358 H646', pair('语音处理', 'Process'), 605, 344, true),
        edge('worker', 'database', 'M450 410 V492', pair('领取 / 发布结果', 'Claim / publish'), 450, 454, true),
        edge('database', 'export', 'M564 544 H646', pair('版本输入', 'Version'), 605, 530)
      ]
    },
    'content-agent': {
      height: 642,
      title: pair('内容工作台：阶段编排、产物转存与媒体合成', 'Content workbench: stages, stored artifacts and media composition'),
      lanes: [pair('工作台与知识', 'Workspace and knowledge'), pair('应用与版本状态', 'Application and versions'), pair('生成与交付', 'Generation and delivery')],
      caption: pair('应用层保存阶段、运行与候选版本，模型通过适配层调用；临时媒体由应用转存，FFmpeg 使用选定图片、声音和字幕合成。上游变更可能使下游确认失效，重复保存相同配置应保留状态。外部模型读取媒体的通道与真实生成质量需分别验证。', 'The application stores stages, runs and candidate versions, and calls models through adapters. It copies temporary media into managed files; FFmpeg combines selected images, audio and subtitles. Upstream changes can invalidate downstream confirmation, while unchanged saves preserve state. External-model media access and output quality need separate checks.'),
      nodes: [
        node('ui', 26, 94, pair('内容工作台', 'Content workspace'), [pair('Vue 3', 'Vue 3'), pair('阶段确认 · 候选预览', 'Stage confirmation / previews')]),
        node('api', 336, 94, pair('阶段编排', 'Stage orchestration'), [pair('FastAPI', 'FastAPI'), pair('配置 · 生成 · 修改传播', 'Config / generation / invalidation')]),
        node('model', 646, 94, pair('模型适配层', 'Model adapters'), [pair('文本 / 图像 / 语音 / 视频', 'Text / image / speech / video'), pair('生成输入与结果转换', 'Generation input / output ports')]),
        node('knowledge', 26, 306, pair('知识与资源', 'Knowledge / resources'), [pair('RAG', 'RAG'), pair('资源版本 · 分块 · 外部引用', 'Versions / chunks / references')]),
        node('database', 336, 306, pair('任务与版本', 'Tasks and versions'), [pair('SQLAlchemy', 'SQLAlchemy'), pair('任务 · 运行 · 产物引用', 'Tasks / runs / artifact references')]),
        node('files', 646, 306, pair('产物文件', 'Artifact files'), [pair('临时媒体转存', 'Managed media copies'), pair('图片 · 配音 · 字幕', 'Images / voice / subtitles')]),
        node('compose', 336, 492, pair('视频合成', 'Video composition'), [pair('FFmpeg', 'FFmpeg'), pair('视频工程与修订', 'Video projects and revisions')]),
        node('export', 646, 492, pair('预览与导出', 'Preview / export'), [pair('选定产物与视频', 'Selected artifacts and video'), pair('交付文件', 'Delivery files')])
      ],
      edges: [
        edge('ui', 'api', 'M254 146 H336', pair('配置 / 确认', 'Confirm'), 295, 132, true),
        edge('api', 'model', 'M564 146 H646', pair('生成请求', 'Generate'), 605, 132, true),
        edge('knowledge', 'api', 'M254 358 H290 V166 H336', pair('检索依据', 'Retrieval'), 290, 260),
        edge('api', 'database', 'M450 198 V306', pair('保存状态', 'Persist state'), 450, 255, true),
        edge('api', 'files', 'M564 174 H610 V334 H646', pair('转存媒体', 'Copy media'), 610, 272),
        edge('api', 'compose', 'M336 182 H314 V544 H336', pair('合成调用', 'Compose'), 314, 447),
        edge('files', 'compose', 'M760 410 V450 H500 V492', pair('选定媒体', 'Selected media'), 667, 450),
        edge('compose', 'export', 'M564 544 H646', pair('输出', 'Output'), 605, 530)
      ]
    },
    'erp-automation': {
      height: 456,
      title: pair('ERP 上架：输入快照、浏览器执行与逐项结果', 'ERP publishing: input snapshots, browser execution and item results'),
      lanes: [pair('数据与人工核对', 'Data and operator review'), pair('本地应用与执行', 'Local application and execution'), pair('持久状态与目标网页', 'Stored state and target website')],
      caption: pair('FastAPI 整理字段并供人工预览，MySQL 保存 SKU 映射、本轮价格快照与任务明细。Playwright 使用隔离的可见浏览器会话操作 ERP 网页，逐项回存结果和失败诊断；这条链路不是聚水潭开放 API。登录与验证码仍由用户处理。', 'FastAPI maps fields for review; MySQL stores SKU mappings, price snapshots and task items. Playwright operates the ERP website through an isolated, visible browser session and returns item results and failure diagnostics. This path uses browser automation rather than the ERP open API. The user handles login and verification challenges.'),
      nodes: [
        node('source', 26, 94, pair('商品资料', 'Product inputs'), [pair('飞书 / Excel / CSV', 'Feishu / Excel / CSV'), pair('本地图片目录', 'Local image directory')]),
        node('api', 336, 94, pair('本地接口', 'Local application'), [pair('Python / FastAPI', 'Python / FastAPI'), pair('字段映射 · 预览 · 任务', 'Field mapping / previews / jobs')]),
        node('database', 646, 94, pair('快照与任务', 'Snapshots and jobs'), [pair('MySQL', 'MySQL'), pair('SKU · 价格 · 逐项状态', 'SKUs / prices / item state')]),
        node('operator', 26, 306, pair('人工预览核对', 'Operator review'), [pair('规格 / 图片 / 价格', 'Variants / images / prices'), pair('选择平台与店铺', 'Select platform and store')]),
        node('browser', 336, 306, pair('浏览器执行层', 'Browser automation'), [pair('Playwright', 'Playwright'), pair('可见 Chrome / Edge', 'Visible Chrome / Edge')]),
        node('erp', 646, 306, pair('ERP 网页', 'ERP website'), [pair('商品创建 / 店铺上架', 'Products / store publishing'), pair('页面反馈与发布标识', 'Page results / publishing IDs')])
      ],
      edges: [
        edge('source', 'api', 'M254 146 H336', pair('读取资料', 'Read inputs'), 295, 132),
        edge('operator', 'api', 'M254 358 H290 V174 H336', pair('预览 / 确认', 'Review / confirm'), 290, 260, true),
        edge('api', 'database', 'M564 146 H646', pair('快照 / 结果', 'State'), 605, 132, true),
        edge('api', 'browser', 'M450 198 V306', pair('任务 / 回执', 'Jobs / receipts'), 450, 255, true),
        edge('browser', 'erp', 'M564 358 H646', pair('网页操作', 'UI actions'), 605, 344, true)
      ]
    },
    qianchuan: {
      height: 642,
      title: pair('千川工具：本地编排、OAuth 与开放平台', 'Qianchuan: local orchestration, OAuth and the open platform'),
      lanes: [pair('使用入口与素材', 'Interface and materials'), pair('本地业务处理', 'Local business processing'), pair('平台接入', 'Platform integration')],
      caption: pair('Flask 与批量处理模块共享持久状态，Requests 通过 OAuth 授权调用 OceanEngine OpenAPI。SQLite 分别保留授权账号、素材上传状态、计划、日志和报告。去重、节流与 WAL 配置不代表完整幂等或并发恢复已经验收；本次未执行真实投放。', 'Flask and batch processing use stored state; Requests calls OceanEngine OpenAPI under OAuth authorization. SQLite retains authorized accounts, material-upload state, plans, logs and reports. Deduplication, throttling and WAL configuration do not establish verified idempotency or concurrent recovery. No live advertising was performed.'),
      nodes: [
        node('ui', 26, 94, pair('本地工作台', 'Local workbench'), [pair('Flask 模板', 'Flask templates'), pair('账号 · 素材 · 计划', 'Accounts / materials / plans')]),
        node('app', 336, 94, pair('业务路由', 'Business routes'), [pair('Python / Flask', 'Python / Flask'), pair('授权范围 · 计划操作', 'Account scope / plan actions')]),
        node('client', 646, 94, pair('平台客户端', 'Platform client'), [pair('Requests / OAuth 2.0', 'Requests / OAuth 2.0'), pair('授权与 Token 刷新', 'Authorization / token refresh')]),
        node('files', 26, 306, pair('款式素材目录', 'Material directories'), [pair('本地图片 / 视频', 'Local images / video'), pair('按款式组织', 'Organized by product style')]),
        node('batch', 336, 306, pair('批量素材处理', 'Batch material handling'), [pair('gallery_uploader.py', 'gallery_uploader.py'), pair('扫描 · 去重 · 商品映射', 'Scan / deduplicate / map')]),
        node('platform', 646, 306, pair('千川开放平台', 'Qianchuan platform'), [pair('OceanEngine OpenAPI', 'OceanEngine OpenAPI'), pair('素材 / 账号 / 投放计划', 'Materials / accounts / plans')]),
        node('database', 336, 492, pair('授权与运行状态', 'Grants and run state'), [pair('SQLite / WAL', 'SQLite / WAL'), pair('素材 · 计划 · 日志 · 报告', 'Materials / plans / logs')])
      ],
      edges: [
        edge('ui', 'app', 'M254 146 H336', pair('本地请求', 'Requests'), 295, 132, true),
        edge('app', 'client', 'M564 146 H646', pair('平台请求', 'API requests'), 605, 132, true),
        edge('app', 'batch', 'M450 198 V306', pair('批量操作', 'Batch actions'), 450, 255),
        edge('files', 'batch', 'M254 358 H336', pair('扫描素材', 'Scan files'), 295, 344),
        edge('batch', 'client', 'M564 378 H610 V174 H646', pair('上传 / 查询', 'Upload / query'), 610, 270, true),
        edge('client', 'platform', 'M760 198 V306', pair('授权调用', 'Authorized calls'), 760, 255, true),
        edge('app', 'database', 'M336 174 H290 V544 H336', pair('授权 / 计划', 'Grants / plans'), 290, 450, true),
        edge('batch', 'database', 'M450 410 V492', pair('保存状态', 'Persist state'), 450, 454, true)
      ]
    },
    'pi-native-crm': {
      height: 642,
      title: pair('客户协作台：持久任务、受控执行与模型接入', 'Customer workspace: durable jobs, controlled execution and models'),
      lanes: [pair('交互与辅助', 'Interface and support'), pair('业务与任务执行', 'Business and job execution'), pair('身份数据与模型', 'Identity, data and models')],
      caption: pair('依用户实现说明绘制，未审计源码或运行项目。PostgreSQL 保存业务、队列、审批与运行事实；Worker 用租约领取任务，并经 Harness 和业务授权约束写入。Redis 用于缓存辅助。虚线表示已有适配、尚需联调的 Mem0、WeKnora、Langfuse 边界。', 'Drawn from the supplied implementation description; no source audit or project execution was performed. PostgreSQL holds business data, jobs, approvals and run facts. Workers claim jobs with leases, and Harness plus business authorization constrain writes. Redis supports caching. Dashed links mark Mem0, WeKnora and Langfuse adapters that still require integration checks.'),
      nodes: [
        node('ui', 26, 94, pair('客户工作台', 'Customer workspace'), [pair('Next.js 16 / React 19', 'Next.js 16 / React 19'), pair('客户 · 商机 · 审批', 'Customers / deals / approvals')]),
        node('api', 336, 94, pair('业务服务', 'Business server'), [pair('Node.js / Next.js', 'Node.js / Next.js'), pair('角色 · 参数 · 业务授权', 'Roles / arguments / authorization')]),
        node('database', 646, 94, pair('业务与身份', 'Business / identity'), [pair('PostgreSQL / Supabase', 'PostgreSQL / Supabase'), pair('RLS · 任务队列 · pgvector', 'RLS / job queue / pgvector')]),
        node('worker', 336, 306, pair('独立 Worker', 'Independent worker'), [pair('Node.js / Harness', 'Node.js / Harness'), pair('租约 · 审批 · CRM Tools', 'Leases / approval / CRM tools')]),
        node('runtime', 646, 306, pair('Agent 运行时', 'Agent runtime'), [pair('Pi Agent Core / Pi AI', 'Pi Agent Core / Pi AI'), pair('模型循环 · MCP', 'Model loop / MCP')]),
        node('redis', 26, 492, pair('缓存与辅助', 'Cache and support'), [pair('Redis', 'Redis'), pair('任务事实仍由数据库保存', 'Job facts remain in the database')]),
        node('adapters', 336, 492, pair('扩展适配', 'Extension adapters'), [pair('Mem0 / WeKnora', 'Mem0 / WeKnora'), pair('Langfuse · 联调待验收', 'Langfuse / integration pending')], true),
        node('models', 646, 492, pair('模型网关', 'Model gateway'), [pair('ModelGateway', 'ModelGateway'), pair('OpenAI / Anthropic / Google', 'OpenAI / Anthropic / Google')])
      ],
      edges: [
        edge('ui', 'api', 'M254 146 H336', pair('业务请求', 'Requests'), 295, 132, true),
        edge('api', 'database', 'M564 146 H646', pair('身份 / 数据', 'Auth / data'), 605, 132, true),
        edge('worker', 'api', 'M450 306 V198', pair('受控业务调用', 'Controlled actions'), 450, 255),
        edge('worker', 'database', 'M500 306 V230 H760 V198', pair('队列 / 租约 / 事件', 'Queue / lease / events'), 661, 230, true),
        edge('worker', 'runtime', 'M564 358 H646', pair('模型循环', 'Agent loop'), 605, 344, true),
        edge('worker', 'redis', 'M390 410 V450 H140 V492', pair('缓存辅助', 'Cache support'), 236, 450, true),
        edge('worker', 'adapters', 'M450 410 V492', pair('适配边界', 'Adapters'), 450, 454, true, true),
        edge('runtime', 'models', 'M760 410 V492', pair('模型请求', 'Inference'), 760, 454, true)
      ]
    }
  };

  function select(value, en) { return value[en ? 1 : 0]; }
  function labelWidth(text) {
    return [...text].reduce((width, character) => width + (character.charCodeAt(0) > 255 ? 14 : 7.4), 18);
  }
  function drawEdge(item, graph, marker, en) {
    const label = select(item.label, en);
    const width = labelWidth(label);
    const from = graph.nodes.find(value => value.id === item.from);
    const to = graph.nodes.find(value => value.id === item.to);
    const description = `${select(from.title, en)} → ${select(to.title, en)}: ${label}`;
    return `<g class="architecture-edge" data-source="${esc(item.from)}" data-target="${esc(item.to)}"><title>${esc(description)}</title><path d="${item.path}" fill="none" stroke="var(--blue-deep, #4e7192)" stroke-width="1.8" stroke-linejoin="round"${item.pending ? ' stroke-dasharray="6 5"' : ''} marker-end="url(#${marker})"${item.both ? ` marker-start="url(#${marker})"` : ''}/><rect x="${item.x - width / 2}" y="${item.y - 13}" width="${width}" height="23" rx="5" fill="var(--surface, #fffdf8)"/><text x="${item.x}" y="${item.y + 3}" text-anchor="middle" fill="var(--text, #263c3b)" style="font-size:14px;font-weight:500">${esc(label)}</text></g>`;
  }
  function drawNode(item, en) {
    const lines = item.lines.map((line, index) => `<text x="16" y="${54 + index * 23}" fill="var(--muted-strong, #626b65)" style="font-size:14px">${esc(select(line, en))}</text>`).join('');
    return `<g class="architecture-node" data-component="${esc(item.id)}" transform="translate(${item.x},${item.y})"><rect width="228" height="104" rx="12" fill="var(--surface, #fffdf8)" stroke="var(--line-strong, #b9c5b4)" stroke-width="1.5"${item.pending ? ' stroke-dasharray="6 4"' : ''}/><path d="M16 37 H212" stroke="var(--line, #dce1d4)"/><text x="16" y="25" fill="var(--text, #263c3b)" style="font-size:17px;font-weight:650">${esc(select(item.title, en))}</text>${lines}</g>`;
  }
  function render(projectId, english = false) {
    const graph = graphs[projectId];
    if (!graph) return '';
    const en = !!english;
    const id = `architecture-${String(projectId).replace(/[^a-z0-9-]/gi, '')}-${++sequence}`;
    const marker = `${id}-arrow`;
    const title = select(graph.title, en);
    const caption = select(graph.caption, en);
    const lanes = graph.lanes.map((lane, index) => `<rect x="${columns[index] - 12}" y="64" width="252" height="${graph.height - 91}" rx="14" fill="var(--surface-soft, #f4f6ee)" opacity="0.75"/><text x="${columns[index]}" y="39" fill="var(--muted-strong, #626b65)" style="font-size:14px;font-weight:600">${esc(select(lane, en))}</text>`).join('');
    const connections = graph.edges.map(item => {
      const from = graph.nodes.find(value => value.id === item.from);
      const to = graph.nodes.find(value => value.id === item.to);
      return `${select(from.title, en)} ${item.both ? '↔' : '→'} ${select(to.title, en)}: ${select(item.label, en)}`;
    }).join('; ');
    const scrollLabel = en ? `${title}. Scroll horizontally to inspect all components.` : `${title}；可横向滚动查看全部组件。`;
    return `<figure class="diagram-figure architecture-figure" data-diagram="architecture" data-project="${esc(projectId)}"><div class="diagram-label">${en ? 'TECHNICAL ARCHITECTURE' : '技术架构 / TECHNICAL ARCHITECTURE'}</div><div class="technical-svg-scroll" role="region" tabindex="0" aria-label="${esc(scrollLabel)}" style="max-width:100%;overflow-x:auto"><svg class="engineering-svg architecture-svg" xmlns="http://www.w3.org/2000/svg" width="900" height="${graph.height}" viewBox="0 0 900 ${graph.height}" role="img" aria-labelledby="${id}-title ${id}-desc" style="display:block;width:100%;min-width:900px;max-width:none;height:auto;font-family:'Segoe UI','Microsoft YaHei',sans-serif"><title id="${id}-title">${esc(title)}</title><desc id="${id}-desc">${esc(`${connections}. ${caption}`)}</desc><defs><marker id="${marker}" viewBox="0 0 10 10" markerWidth="7" markerHeight="7" refX="9" refY="5" orient="auto-start-reverse"><path d="M1 1 L9 5 L1 9" fill="none" stroke="var(--blue-deep, #4e7192)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></marker></defs>${lanes}${graph.edges.map(item => drawEdge(item, graph, marker, en)).join('')}${graph.nodes.map(item => drawNode(item, en)).join('')}</svg></div><figcaption>${esc(caption)}</figcaption></figure>`;
  }
  window.YuecongArchitecture = { render };
})();
