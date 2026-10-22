/* 本案例依据用户概述和界面展示编写，不代表源码审计或运行验证。 */
(() => {
  'use strict';

  const project = {
    id: 'pi-native-crm',
    title: '客户协作台 CRM：客户管理与受控任务执行',
    category: 'AI 智能体',
    tone: 'crm',
    featured: true,
    tech: ['TypeScript / Node.js', 'Next.js 16 / React 19', 'Tailwind CSS 4 / Radix UI', 'TanStack Query', 'React Hook Form / Zod', 'React Flow / Recharts', 'PostgreSQL / pgvector', 'Supabase / RLS / Realtime', 'Redis', 'Pi Agent Core / Pi AI 0.86.1', 'ModelGateway / MCP', 'Mem0', 'WeKnora / LLM Wiki', 'Langfuse', 'pnpm / Docker Compose', 'Vitest / Testing Library / Playwright', 'ESLint'],
    description: 'TypeScript 全栈客户工作台，以数据库队列持久化任务，通过 Pi 运行时约束工具权限、审批与恢复。',
    kicker: 'CUSTOMER WORKSPACE',
    status: '全栈产品实践 · 外部服务适配持续完善',
    intro: [
      '客户协作台 CRM 是 TypeScript 全栈工作台，使用 Next.js / React 处理客户与商机，独立 Worker 执行数据库队列里的任务。Pi 运行时负责模型循环和工具编排。',
      '工程重点放在三处：数据库 RLS 与服务端授权共同约束访问，审批绑定具体动作，任务通过租约和持久状态恢复。记忆、知识与观测服务保留独立接入边界。'
    ],
    architecture: [
      ['交互工作台', 'Next.js 16 / React 19，浅色、非衬线与圆角界面；聊天、拖拽商机看板、React Flow 流程和 Recharts 图表协同。'],
      ['业务与执行', 'Node.js / Next.js server 与 API 承接业务，独立 Agent Worker 和定时任务执行后台工作。'],
      ['Agent 运行时', 'Pi Agent Core / Pi AI 0.86.1 管理模型循环与工具；ModelGateway 适配 OpenAI、Anthropic、Google，MCP 连接能力。'],
      ['数据与扩展', 'PostgreSQL 与 Supabase 承接业务和认证；Mem0、WeKnora、Langfuse 已有后端适配代码，联调与交付状态需另行确认。']
    ],
    flow: ['查看客户上下文', 'Agent 调查与检索', '提出候选动作', '检查权限与预算', '人工审批', '执行并记录结果'],
    flowNote: '典型演示流程；只读查询不必经过写入审批，拒绝或取消的动作不应执行。',
    evidence: ['用户提供的技术栈与实现状态说明', 'Pi Native CRM 界面展示图'],
    evidenceNote: '文章依据用户概述与界面图，未进行源码审计、服务联调或运行验证；图中客户和数字属于界面示例。',
    media: {
      src: 'assets/images/customer-workspace-overview.webp',
      alt: '客户协作台 CRM 的客户、对话、待确认任务与执行记录结构示意',
      caption: '根据技术说明重绘的界面结构示意，非线上运行截图；不代表原图中的客户数据、业务指标或验证结果。'
    }
  };

  const detail = {
    summary: 'TypeScript 全栈 CRM，使用 PostgreSQL 持久化任务、Pi 运行时组织工具执行，围绕授权、租约恢复、审批幂等与版本证据划分职责。',
    positioning: [
      '客户、商机、任务、审批和运行记录由 PostgreSQL 保存；Next.js server / API 处理请求，独立 Worker 和定时任务处理后台执行。浏览器页面不是任务状态的唯一来源。',
      '界面采用浅色、非衬线字体与圆角布局，将聊天、执行时间线和待确认动作并列。业务状态、运行事件和模型建议分别显示，避免将生成回复当成写入完成。'
    ],
    roles: [
      ['销售人员', '理解客户并推进商机', '把建议与已经执行的动作分清。'],
      ['销售主管', '确认策略、预算与重要动作', '审批时能看到对象、依据和影响。'],
      ['运营 / 维护人员', '维护知识与排查运行', '从真实记录定位失败和恢复范围。']
    ],
    modules: [
      ['聊天与 CRM 工作台', '在同一上下文中理解业务', '拖拽看板呈现商机，React Flow 编辑流程，Recharts 展示图表。TanStack Query 管理服务端数据，React Hook Form 与 Zod 组织表单和校验。'],
      ['受控 Agent 执行', '先调查，再提出动作', '父 Agent 负责协调，专业子 Agent 主要承担只读调查。MCP 与 CRM 工具支持查客户、检索知识、提出动作以及审批后执行；Harness 约束权限、预算、取消与幂等。'],
      ['租户与身份', '每次访问都回到组织范围', 'Supabase 提供登录认证、数据接口、文件存储与 Realtime。多租户隔离结合 PostgreSQL RLS 和服务端角色校验，不能只依赖页面隐藏入口。'],
      ['耐久任务', '离开页面后仍有明确状态', '核心任务依赖数据库队列、租约和状态恢复，独立 Worker 继续处理；Redis 用于缓存与辅助。租约续租失败或过期后的旧执行者不能继续提交；恢复还需判断业务动作是否已产生结果。'],
      ['记忆与知识', '区分事实、偏好和资料版本', '已有组织版本记忆和客户会话 checkpoint。Mem0 适配偏好、确认事实与跨会话记忆；WeKnora 适配产品文档、FAQ 和 LLM Wiki。原有 embedding + PostgreSQL / pgvector 检索保留来源片段与版本。'],
      ['观测与评测', '让结果有可检查的依据', 'SQL 保存真实 Run、工具事件、消息及子任务关系。内置确定性规则评测与显式触发的 LLM Judge 分开处理，Langfuse 适配观测及评测分数导出。适配代码不等于服务已完成联调或投产。']
    ],
    scenario: {
      title: '典型演示：从客户摘要走到一次经批准的动作',
      intro: '以下说明产品意图，不代表已执行的客户业务或验收记录。',
      steps: [
        ['聚合上下文', '销售打开客户，对话引用可访问记录与相关资料。'],
        ['调查与建议', 'Agent 检索依据，子 Agent 协助只读调查，提出候选动作。'],
        ['明确确认', '展示目标、参数、依据和预算，主管或有权限人员决定是否批准。'],
        ['执行与恢复', '批准后由任务执行；中断时按租约和持久状态恢复，不凭聊天文字判断完成。'],
        ['回看证据', '查看 CRM 变化和运行事件；拒绝、取消与失败分别保留状态。']
      ],
      result: '用户得到的不只是建议，还能理解动作由谁批准、是否执行，以及出现问题后从哪里继续。'
    },
    solution: [
      ['为什么把权限放进执行链路', '模型理解意图不代表获得修改权限。RLS 约束数据范围，服务端核对角色，Harness 再检查动作、预算与审批，避免把自然语言直接变成写入。'],
      ['租约恢复与幂等怎样配合', '租约用于判断当前执行权，幂等用于处理重复业务请求，两者不能互相替代。续租失败、审批撤回和执行结果未知，需要分别处理；这些边界仍需故障注入验证。'],
      ['为什么记忆和评测要分层', '组织版本与 checkpoint 保留上下文边界，知识检索保留来源。SQL 运行事实、规则评分和模型判断各有用途，LLM Judge 的评价不替代实际执行记录。']
    ],
    dataNotes: [
      '下图仅表达概念业务联系；英文对象名与标识用于阅读，不是已核对的表名、字段、主键或外键。',
      '客户与商机属于组织范围，动作连接审批和运行。记忆版本及来源信息帮助解释一次判断所依据的上下文。'
    ],
    logicalER: true,
    er: [
      ['Organization', 'organizationKey', 'Customer', 'organizationKey', '概念 1:N · 组织内客户'],
      ['Customer', 'customerKey', 'Opportunity', 'customerKey', '概念 1:N · 客户商机'],
      ['ProposedAction', 'actionKey', 'ApprovalDecision', 'actionKey', '概念关联 · 动作与审批'],
      ['ProposedAction', 'actionKey', 'AgentRun', 'actionKey', '概念关联 · 动作与执行'],
      ['Organization', 'organizationKey', 'MemoryVersion', 'organizationKey', '概念 1:N · 组织版本记忆']
    ],
    dataObjects: [
      ['Customer / Opportunity', '业务上下文', '客户、商机与任务状态。'],
      ['Approval / Run', '决策与执行', '确认结果、工具事件及子任务关系。'],
      ['Memory / Knowledge', '判断依据', '组织版本、会话 checkpoint 与资料来源。']
    ],
    acceptance: [
      ['多租户访问', '跨组织查询与写入均受约束。', '需验证 RLS 与服务端授权组合。'],
      ['审批与取消', '未批准、已拒绝或取消的动作不执行。', '需核对执行时的审批有效性。'],
      ['任务中断', '恢复不重复产生业务副作用。', '需覆盖租约失效和结果未知场景。'],
      ['知识与评测', '来源版本可追踪，规则结果与 Judge 判断可区分。', '需真实资料、模型与扩展服务联调。']
    ],
    delivery: [
      '工程工具包括 pnpm、Docker / Compose、数据库 migrations、Vitest、Testing Library、Playwright、TypeScript 与 ESLint。工具清单不代表测试或部署已经通过。',
      'Mem0、WeKnora、Langfuse 已有后端适配代码；认证、网络、数据边界及效果仍需独立验收。本文没有运行项目或修改业务数据。'
    ],
    value: [
      '后续验收应优先覆盖跨组织访问、租约竞争、审批撤回及重复执行，再核对记忆版本、知识来源和评测结果。收益或效率需要真实使用数据，本文不提供推算指标。'
    ]
  };

  const technical = {
    topics: [
      ['执行前再校验', '审批应绑定具体对象和参数，当前材料尚未证明该约束；恢复后也需重新确认权限与批准范围。聊天中出现“同意”本身不能替代服务端判定。'],
      ['运行事实与评分分开', 'SQL 记录发生了什么，规则检查确定条件，显式 LLM Judge 补充模型判断；Langfuse 导出不改变事实来源。'],
      ['适配与联调分开', 'Mem0、WeKnora、Langfuse 的后端适配代码提供接入基础；真实服务可用性与数据隔离仍需验证。']
    ],
    code: {
      label: 'TypeScript 概念示例，不是项目源码',
      text: 'type Decision = "approved" | "rejected" | "pending";\n\nasync function executeAfterApproval(\n  decision: Decision,\n  authorized: boolean,\n  perform: () => Promise<void>\n) {\n  if (!authorized || decision !== "approved") return "blocked";\n  // perform 代表调用方传入的动作；未描述项目实际 API。\n  await perform();\n  return "completed";\n}\n// 示例仅表达审批门槛；真实执行还需预算、取消与幂等检查。'
    },
    checks: ['跨组织请求是否同时被数据库与服务端拒绝。', '审批后参数变化、撤销或租约过期时是否停止。', '重启后运行事实、知识来源与评测结果是否仍能区分。']
  };

  window.projectStories.unshift(project);
  window.projectDetails['pi-native-crm'] = detail;
  window.projectTechnical['pi-native-crm'] = technical;
})();
