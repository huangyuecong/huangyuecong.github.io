/* Based on the user's description and interface image, without a source audit or runtime verification. */
(() => {
  'use strict';

  const project = {
    id: 'pi-native-crm',
    title: 'Customer Workspace CRM: customer records and controlled execution',
    category: 'AI Agents',
    tone: 'crm',
    featured: true,
    tech: ['TypeScript / Node.js', 'Next.js 16 / React 19', 'Tailwind CSS 4 / Radix UI', 'TanStack Query', 'React Hook Form / Zod', 'React Flow / Recharts', 'PostgreSQL / pgvector', 'Supabase / RLS / Realtime', 'Redis', 'Pi Agent Core / Pi AI 0.86.1', 'ModelGateway / MCP', 'Mem0', 'WeKnora / LLM Wiki', 'Langfuse', 'pnpm / Docker Compose', 'Vitest / Testing Library / Playwright', 'ESLint'],
    description: 'A full-stack TypeScript customer workspace with a durable database job queue and a Pi runtime that constrains tool permissions, approval and recovery.',
    kicker: 'CUSTOMER WORKSPACE',
    status: 'Full-stack product practice · External service integration in progress',
    intro: [
      'Customer Workspace CRM is a full-stack TypeScript application. Next.js / React handles customers and opportunities, while a separate worker executes jobs from a database queue. The Pi runtime manages the model loop and tool orchestration.',
      'The engineering focus is on three areas: combining database RLS with server-side authorization, binding approval to a specific action, and recovering jobs through leases and durable state. Memory, knowledge and observability services retain separate integration boundaries.'
    ],
    architecture: [
      ['Interactive workspace', 'Next.js 16 / React 19, with a light palette, sans-serif typography and rounded layouts. Chat, a drag-and-drop opportunity board, React Flow workflows and Recharts charts work together.'],
      ['Business logic & execution', 'Node.js / Next.js server and API handle business requests; a separate Agent Worker and scheduled jobs perform background work.'],
      ['Agent runtime', 'Pi Agent Core / Pi AI 0.86.1 manages the model loop and tools. ModelGateway adapts OpenAI, Anthropic and Google; MCP connects capabilities.'],
      ['Data & extensions', 'PostgreSQL and Supabase support business data and authentication. Backend adapters exist for Mem0, WeKnora and Langfuse; integration and delivery status require separate confirmation.']
    ],
    flow: ['Review customer context', 'Agent investigates and retrieves', 'Propose candidate actions', 'Check permissions and budget', 'Human approval', 'Execute and record the result'],
    flowNote: 'A typical demonstration flow. Read-only queries do not require write approval; rejected or canceled actions must not execute.',
    evidence: ['Technical stack and implementation status supplied by the user', 'Pi Native CRM interface image'],
    evidenceNote: 'Based on the user’s description and interface image. No source audit, service integration test or runtime verification was performed. Customers and figures shown are interface examples.',
    media: {
      src: 'assets/images/customer-workspace-overview.en.webp',
      alt: 'Structural illustration of Customer Workspace CRM showing customers, conversations, pending actions and execution records',
      caption: 'An interface structure redrawn from the technical description, rather than a live application screenshot. It does not establish customer data, business metrics or validation results from the original image.'
    }
  };

  const detail = {
    summary: 'A full-stack TypeScript CRM with PostgreSQL-backed jobs and Pi tool orchestration, separating authorization, lease recovery, approval idempotency and versioned evidence.',
    positioning: [
      'PostgreSQL stores customers, opportunities, jobs, approvals and execution records. Next.js server / API handles requests; a separate worker and scheduled jobs handle background execution. A browser page is not the sole source of job state.',
      'A light interface with sans-serif typography and rounded layouts places chat, execution timelines and pending actions side by side. Business state, runtime events and model suggestions are shown separately so a generated reply is not mistaken for a completed write.'
    ],
    roles: [
      ['Sales representative', 'Understand customers and advance opportunities', 'Distinguish suggestions from actions already executed.'],
      ['Sales manager', 'Approve strategy, budgets and significant actions', 'See the target, supporting evidence and impact before approving.'],
      ['Operations / maintenance', 'Maintain knowledge and investigate runs', 'Use actual records to identify failures and the scope of recovery.']
    ],
    modules: [
      ['Chat & CRM workspace', 'Understand the business in one context', 'A drag-and-drop board presents opportunities, React Flow edits workflows and Recharts displays charts. TanStack Query manages server data; React Hook Form and Zod handle forms and validation.'],
      ['Controlled Agent execution', 'Investigate before proposing an action', 'A parent Agent coordinates, while specialist sub-agents primarily conduct read-only investigation. MCP and CRM tools support customer lookups, knowledge retrieval, action proposals and execution after approval. The Harness constrains permissions, budgets, cancellation and idempotency.'],
      ['Tenancy & identity', 'Keep every access within the organization scope', 'Supabase provides authentication, data APIs, file storage and Realtime. Tenant isolation combines PostgreSQL RLS with server-side role checks; hiding interface controls is insufficient.'],
      ['Durable jobs', 'Keep a clear state after the page closes', 'Core jobs use a database queue, leases and state recovery, with a separate worker continuing execution. Redis supports caching and auxiliary work. An old worker must stop committing results after its lease expires or renewal fails. Recovery must also establish whether a business action already produced a result.'],
      ['Memory & knowledge', 'Separate facts, preferences and document versions', 'Organization-versioned memory and customer conversation checkpoints already exist. Mem0 adapters support preferences, confirmed facts and memory across sessions; WeKnora adapters support product documents, FAQs and LLM Wiki. Existing embedding + PostgreSQL / pgvector retrieval retains source excerpts and versions.'],
      ['Observability & evaluation', 'Give results an inspectable basis', 'SQL stores actual runs, tool events, messages and subtask relationships. Built-in deterministic rule evaluation is separate from an explicitly triggered LLM Judge. Langfuse adapters support observability and evaluation score export. Adapter code does not establish completed integration or production deployment.']
    ],
    scenario: {
      title: 'Typical demonstration: from a customer summary to an approved action',
      intro: 'This describes product intent, not executed customer work or an acceptance record.',
      steps: [
        ['Gather context', 'A sales representative opens a customer record; the conversation references accessible records and relevant material.'],
        ['Investigate & suggest', 'The Agent retrieves evidence, sub-agents assist with read-only investigation, and candidate actions are proposed.'],
        ['Obtain explicit approval', 'The target, parameters, evidence and budget are shown. A manager or authorized person decides whether to approve.'],
        ['Execute & recover', 'An approved job executes. After interruption, recovery follows leases and durable state rather than inferring completion from chat text.'],
        ['Review evidence', 'Inspect CRM changes and runtime events. Rejection, cancellation and failure retain distinct states.']
      ],
      result: 'Users receive more than a suggestion: they can see who approved an action, whether it ran and where to continue after a problem.'
    },
    solution: [
      ['Why authorization belongs in the execution path', 'Understanding intent does not grant a model permission to modify data. RLS constrains data scope, the server checks roles, and the Harness checks actions, budgets and approvals. Natural language cannot directly become a write.'],
      ['How lease recovery and idempotency work together', 'Leases establish current execution ownership; idempotency handles repeated business requests. Neither replaces the other. Renewal failure, withdrawn approval and unknown outcomes need distinct handling. These boundaries still require fault-injection testing.'],
      ['Why memory and evaluation have separate layers', 'Organization versions and checkpoints retain context boundaries, while knowledge retrieval retains sources. SQL execution facts, rule scores and model judgments each serve a purpose. An LLM Judge assessment cannot replace actual execution records.']
    ],
    dataNotes: [
      'The diagram expresses conceptual business relationships only. English object names and identifiers are reading aids, not verified table names, fields, primary keys or foreign keys.',
      'Customers and opportunities belong to an organization; actions connect approvals and runs. Memory versions and source information help explain the context behind a judgment.'
    ],
    logicalER: true,
    er: [
      ['Organization', 'organizationKey', 'Customer', 'organizationKey', 'Conceptual 1:N · Customers within an organization'],
      ['Customer', 'customerKey', 'Opportunity', 'customerKey', 'Conceptual 1:N · Customer opportunities'],
      ['ProposedAction', 'actionKey', 'ApprovalDecision', 'actionKey', 'Conceptual link · Action and approval'],
      ['ProposedAction', 'actionKey', 'AgentRun', 'actionKey', 'Conceptual link · Action and execution'],
      ['Organization', 'organizationKey', 'MemoryVersion', 'organizationKey', 'Conceptual 1:N · Organization-versioned memory']
    ],
    dataObjects: [
      ['Customer / Opportunity', 'Business context', 'Customers, opportunities and job status.'],
      ['Approval / Run', 'Decision & execution', 'Approval outcomes, tool events and subtask relationships.'],
      ['Memory / Knowledge', 'Basis for judgments', 'Organization versions, conversation checkpoints and source material.']
    ],
    acceptance: [
      ['Tenant access', 'Cross-organization queries and writes are both constrained.', 'Requires validation of RLS combined with server-side authorization.'],
      ['Approval & cancellation', 'Unapproved, rejected or canceled actions do not execute.', 'Approval validity needs to be checked at execution time.'],
      ['Job interruption', 'Recovery does not duplicate business side effects.', 'Requires coverage of expired leases and unknown outcomes.'],
      ['Knowledge & evaluation', 'Source versions remain traceable; rule results are distinguishable from Judge assessments.', 'Requires integration testing with real material, models and extension services.']
    ],
    delivery: [
      'Engineering tools include pnpm, Docker / Compose, database migrations, Vitest, Testing Library, Playwright, TypeScript and ESLint. A tool list does not establish that tests or deployment have passed.',
      'Backend adapters exist for Mem0, WeKnora and Langfuse. Authentication, connectivity, data boundaries and quality still need separate acceptance. This article did not involve running the project or modifying business data.'
    ],
    value: [
      'Acceptance should first cover cross-organization access, lease contention, approval withdrawal and duplicate execution, then check memory versions, knowledge sources and evaluation results. Benefits and efficiency require real usage data; this article supplies no estimated metrics.'
    ]
  };

  const technical = {
    topics: [
      ['Revalidate before execution', 'Approval should be bound to the specific target and parameters; the supplied material does not yet verify that constraint. After recovery, permissions and approval scope should be checked again. An “agree” message in chat cannot replace a server-side decision.'],
      ['Separate execution facts from scores', 'SQL records what happened, rules check deterministic conditions, and an explicit LLM Judge adds a model assessment. Langfuse export does not change the source of facts.'],
      ['Separate adapters from integration', 'Backend adapter code for Mem0, WeKnora and Langfuse provides an integration foundation. Real service availability and data isolation still need validation.']
    ],
    code: {
      label: 'Conceptual TypeScript example, not project source',
      text: 'type Decision = "approved" | "rejected" | "pending";\n\nasync function executeAfterApproval(\n  decision: Decision,\n  authorized: boolean,\n  perform: () => Promise<void>\n) {\n  if (!authorized || decision !== "approved") return "blocked";\n  // perform is supplied by the caller; this does not describe the project API.\n  await perform();\n  return "completed";\n}\n// Illustrates the approval gate only; real execution also needs budget, cancellation and idempotency checks.'
    },
    checks: ['Are cross-organization requests rejected by both the database and the server?', 'Does execution stop when parameters change after approval, approval is revoked or a lease expires?', 'After restart, can execution facts, knowledge sources and evaluation results still be distinguished?']
  };

  window.projectStoriesEn.unshift(project);
  window.projectDetailsEn['pi-native-crm'] = detail;
  window.projectTechnicalEn['pi-native-crm'] = technical;
})();
