/* English translations. IDs, evidence paths and code samples retain the original structure. */
window.projectStoriesEn = [
  {
    "id": "silver-guardian",
    "title": "Silver Guardian · HarmonyOS: a family care platform across devices",
    "platform": "HarmonyOS",
    "category": "Hardware & Software",
    "tone": "sage",
    "featured": true,
    "tech": [
      "HarmonyOS / ArkTS",
      "Spring Boot",
      "FastAPI",
      "Vue 3",
      "PostgreSQL",
      "Agent Tools"
    ],
    "description": "Connects older adults, family members and an operations dashboard through reminders, family relationships, proactive care and controlled Agent tool calls.",
    "kicker": "CARE × AGENT",
    "status": "Enhanced MVP · Ongoing development",
    "intro": [
      "When building Silver Guardian, I cared about more than whether AI could answer a question. Could it reliably do one small, concrete thing in family care: remind someone to take medicine, pass on a message, or let a family member know when something needed attention?",
      "The project starts with a HarmonyOS phone app that distinguishes older adults from family members at sign-in, alongside a watch project and an operations dashboard. Core business services and the Agent run separately: business services manage identity, relationships and permissions, while the Agent handles conversation and tool orchestration within explicit limits."
    ],
    "architecture": [
      [
        "Phone / Watch",
        "HarmonyOS / ArkTS: role-based workspaces for reminders, messages and device interaction."
      ],
      [
        "Core services",
        "Spring Boot: authentication, family members, authorization, care data and device commands."
      ],
      [
        "Agent service",
        "FastAPI: conversation, memory, model adapters and controlled tool execution."
      ],
      [
        "Operations & storage",
        "Vue 3 dashboard; PostgreSQL migrations and an H2 configuration for local development."
      ]
    ],
    "flow": [
      "Older adult makes a request",
      "Validate identity and family permissions",
      "Agent selects a tool",
      "Request confirmation when needed",
      "Core service executes",
      "Return the result and audit"
    ],
    "flowNote": "This is the main path for controlled tool calls. Execution should stop if permission is insufficient, a capability is unavailable or the user has not confirmed. Ordinary conversation does not always call a tool.",
    "challenges": [
      [
        "From capability to permission",
        "A tool call needs user context, capability checks and confirmation as well as parameters. Authorization belongs in the execution path so that model output cannot directly become a business operation."
      ],
      [
        "Consistent identity across devices",
        "Family membership and account roles are modeled separately, so one user’s relationships with different families can be managed independently. Client screens provide the entry point; the server must still validate relationships and permissions."
      ],
      [
        "Local verification and real delivery",
        "Physical devices, real model services, signing and release each require their own acceptance checks. A working local flow does not establish readiness for production care."
      ]
    ],
    "entities": [
      [
        "identity.users",
        "Users",
        "id · PK",
        "Account identity"
      ],
      [
        "family.families",
        "Families",
        "id · PK",
        "owner_user_id · FK"
      ],
      [
        "family.family_members",
        "Family members",
        "id · PK",
        "family_id / user_id · FK"
      ]
    ],
    "relations": [
      [
        0,
        1,
        "1 : N · Owned families"
      ],
      [
        1,
        2,
        "1 : N · Membership records"
      ],
      [
        0,
        2,
        "1 : N · Joined families"
      ]
    ],
    "erNote": "An excerpt of the family relationship model. A unique constraint on (family_id, user_id) in family_members prevents duplicate membership. Each membership record references one user and one family.",
    "tests": [
      [
        "Tool authorization & confirmation",
        "Test code exists",
        "test_tools.py mocks the backend, audit and capability checks. The repository also includes tool integration and model recovery test files."
      ],
      [
        "API contracts",
        "Test code exists",
        "test_openapi_contract.py and the Agent OpenAPI gate."
      ],
      [
        "Physical devices & release",
        "External acceptance pending",
        "The project README explicitly lists unfinished checks for physical devices, real Providers, signing and production release."
      ]
    ],
    "reflection": "This project made me pay closer attention to what happens when an operation does not succeed. In care scenarios, carefully limited capabilities, clear failure messages and traceable actions are more valuable than an interface that appears able to do everything. I want to keep improving acknowledgments between real devices and the server, recovery from failures and the experience of actual use.",
    "evidence": [
      "README.md",
      "services/core-server/src/main/resources/db/migration-postgresql/V2__family_bindings.sql",
      "services/agent-server/tests/test_tools.py",
      "tests/contract/test_openapi_contract.py"
    ]
  },
  {
    "id": "meeting-agent",
    "title": "Meeting Notes Agent: turning recordings into traceable records",
    "category": "AI Agents",
    "tone": "blue",
    "featured": true,
    "tech": [
      "Python",
      "FastAPI",
      "Vue 3",
      "SQLAlchemy",
      "ASR",
      "Speaker diarization",
      "Alembic"
    ],
    "description": "Links audio uploads, transcription, speaker review, minutes revisions and export in a workflow that can be revisited and checked.",
    "kicker": "VOICE → KNOWLEDGE",
    "status": "Business project · Engineering review",
    "intro": [
      "A recording is not ready-to-use meeting minutes. The time-consuming work is checking who said what, deciding what to retain and making sure the summary can be checked against the original discussion.",
      "I see this as a processing chain that needs human participation. The system handles audio ingestion, transcription and structured organization. Users can review speakers and text, then revise and export the result. The aim is to reduce the work of organizing a meeting while preserving the evidence behind each judgment."
    ],
    "architecture": [
      [
        "User interface",
        "A shared Vue frontend supports meeting creation and audio and transcript review."
      ],
      [
        "Meeting API",
        "FastAPI + SQLAlchemy / Alembic manage meetings, audio, jobs and revision records."
      ],
      [
        "Speech processing",
        "Separate voiceprint and speaker diarization services; ASR connects through an adapter layer."
      ],
      [
        "Document delivery",
        "Minutes versions connect to export. Service dependencies include python-docx, FFmpeg and WebSocket."
      ]
    ],
    "flow": [
      "Create a meeting",
      "Upload audio / resume chunks",
      "Transcribe and identify speakers",
      "Review the text",
      "Generate and revise minutes",
      "Export a document"
    ],
    "flowNote": "Audio processing runs as an asynchronous job. Failures, cancellation and recovery need tracked job states. Text awaiting review must not be presented as a confirmed conclusion.",
    "challenges": [
      [
        "Distinguish speakers from participants",
        "The participant list supplies candidates for identity matching; it should not directly determine the number of speakers in the audio. Comments on MeetingParticipant in the model explicitly preserve this distinction."
      ],
      [
        "Keep versions and sources",
        "Transcription runs, segments, word-level records and revisions have separate models. This supports audio reprocessing and tracking human edits without new results silently replacing earlier judgments."
      ],
      [
        "Make long jobs recoverable",
        "The code includes tests for chunked uploads and job recovery. A waiting frontend cannot be the only source of job status; progress must remain queryable after a network interruption."
      ]
    ],
    "entities": [
      [
        "meetings",
        "Meetings",
        "id · PK",
        "owner_id / status"
      ],
      [
        "meeting_participants",
        "Candidate participants",
        "id · PK",
        "meeting_id · FK"
      ],
      [
        "audio_files",
        "Audio files",
        "id · PK",
        "meeting_id · FK"
      ]
    ],
    "relations": [
      [
        0,
        1,
        "1 : N · Candidate participants"
      ],
      [
        0,
        2,
        "1 : N · Meeting audio"
      ]
    ],
    "erNote": "A partial ER diagram of the meeting data model. The full model also includes transcription runs, text segments, word timestamps, speaker profiles and revisions. Candidate participants are not equated directly with detected speakers.",
    "tests": [
      [
        "Permission isolation",
        "Test assertions reviewed",
        "test_meeting_flow.py expects 403 when another user reads a private meeting."
      ],
      [
        "Resumable uploads",
        "Test assertions reviewed",
        "Checks the number of received chunks after upload and verifies the merged file size."
      ],
      [
        "Transcription to export",
        "Mock workflow test",
        "The same test file connects audio, transcription and revisions. It explicitly uses mocked audio results and does not establish real recognition accuracy."
      ],
      [
        "Speech & job boundaries",
        "Test files exist",
        "Dedicated tests cover the voiceprint lifecycle, long audio, competing job recovery and transcription source scope."
      ]
    ],
    "reflection": "After working through this flow, I became more convinced that AI’s value includes making results easier to check and edit, as well as generating them quickly. For meeting minutes, traceable sources and a clear revision process can turn an apparently complete document into a record worth relying on.",
    "evidence": [
      "services/meeting_service/pyproject.toml",
      "services/meeting_service/src/meeting_service/models.py",
      "tests/test_meeting_flow.py",
      "tests/test_meeting_recovery_lease_race.py"
    ]
  },
  {
    "id": "content-agent",
    "title": "Multimodal Content Agent: from a topic to deliverable assets",
    "category": "AI Agents",
    "tone": "apricot",
    "featured": true,
    "tech": [
      "FastAPI",
      "Vue 3",
      "SQLAlchemy",
      "RAG",
      "FFmpeg",
      "Image / speech generation"
    ],
    "description": "Organizes copy, images and video by task, stage and artifact, keeping generation, approval, revision and export in one workflow.",
    "kicker": "IDEA → CONTENT",
    "status": "Business project · Engineering review",
    "intro": [
      "Content creation rarely ends with a paragraph. The same topic becomes images, voiceovers and video. When these steps are disconnected, a change can mean moving material between several tools all over again.",
      "This project brings the creative process into a single task. Configuration, topic, copy, compliance checks, images, video and export each have a stage state. Assets are stored with links to their generation records. My priority is to make generated results available for selection, revision and continued use."
    ],
    "architecture": [
      [
        "Frontend workspace",
        "A shared Vue frontend displays stage progress, candidate assets and previews."
      ],
      [
        "Task backend",
        "FastAPI orchestrates generation tasks; SQLAlchemy records stages, runs and artifacts."
      ],
      [
        "Knowledge & resources",
        "Resource entries, versions, chunks and external references provide the data foundation for retrieval and asset reuse."
      ],
      [
        "Multimodal delivery",
        "Model services generate content, FFmpeg supports audio and video processing, and export completes delivery."
      ]
    ],
    "flow": [
      "Configure requirements",
      "Confirm the topic",
      "Generate copy",
      "Check compliance",
      "Generate images",
      "Generate video",
      "Export"
    ],
    "flowNote": "The diagram follows the seven visible stages in the full-mode test. Other modes show different steps. After upstream content changes, downstream approvals need to be checked for continued validity.",
    "challenges": [
      [
        "Generated content needs versions",
        "Tasks, generation runs and artifacts are stored separately. Artifact records the task, stage, candidate index and version, making it possible to explain where an asset came from."
      ],
      [
        "Keep stages consistent",
        "Submitting an unchanged configuration should not invalidate approved steps. Workflow tests check this case specifically and handle compatibility conversions for older stage names."
      ],
      [
        "Treat video as a composed result",
        "Images, voiceovers, subtitles and duration depend on one another. Dedicated tests for voice/subtitle consistency, video composition and minimum duration show that these relationships need checking before export."
      ]
    ],
    "entities": [
      [
        "content_tasks",
        "Content tasks",
        "id · PK",
        "current_stage / version"
      ],
      [
        "generation_runs",
        "Generation runs",
        "id · PK",
        "task_id · FK"
      ],
      [
        "artifacts",
        "Generated artifacts",
        "id · PK",
        "task_id / generation_run_id"
      ]
    ],
    "relations": [
      [
        0,
        1,
        "1 : N · Generation runs"
      ],
      [
        0,
        2,
        "1 : N · Task artifacts"
      ],
      [
        1,
        2,
        "1 : N · Optional source"
      ]
    ],
    "erNote": "An artifact must belong to a task. generation_run_id is nullable, so an artifact can exist without a generation run. N means that multiple children are possible; it does not require a parent to have any children yet.",
    "tests": [
      [
        "Seven-stage workflow",
        "Test assertions reviewed",
        "test_content_workflow_v2.py checks stage order and applicability from configuration to export."
      ],
      [
        "Idempotent updates",
        "Test cases exist",
        "Resubmitting the same task configuration should not invalidate an approved workflow."
      ],
      [
        "Audiovisual consistency",
        "Test files exist",
        "Dedicated tests cover speech/subtitle consistency, video generation, minimum duration and composition."
      ],
      [
        "Real generation quality",
        "Real assets need evaluation",
        "Workflow tests do not replace evaluation of real model output for visual quality, semantic accuracy and human content review."
      ]
    ],
    "reflection": "I increasingly distinguish a single generation from a finished piece of work. A useful creative tool should make the next step clear, recover an earlier version and show what a change will affect. Models keep evolving, but task structure, traceable artifacts and an easy revision process continue to shape the experience.",
    "evidence": [
      "services/content_service/pyproject.toml",
      "services/content_service/src/content_service/models.py",
      "tests/test_content_workflow_v2.py",
      "tests/test_content_voice_subtitle_consistency.py"
    ]
  },
  {
    "id": "erp-automation",
    "title": "ERP Product Listing: turning repetitive work into traceable tasks",
    "category": "Business Automation",
    "tone": "sage",
    "featured": false,
    "tech": [
      "Python",
      "FastAPI",
      "Playwright",
      "MySQL",
      "Feishu Bitable",
      "Excel / CSV"
    ],
    "description": "Connects product information, local images, ERP creation and store listings, retaining per-SKU results, retries and failure diagnostics.",
    "kicker": "DATA → LISTING",
    "status": "Local business tool · Engineering review",
    "intro": [
      "Repetition in product listing starts well before the final click. Details, images, variants, prices and target stores come from different places. A mismatch at any point affects what follows.",
      "The tool organizes and previews data before using a visible browser to perform ERP operations. It reads Feishu Bitable, with Excel / CSV as alternative sources, and images from local folders. Reviewed products enter import and listing jobs, and results return to a local database."
    ],
    "architecture": [
      [
        "Data sources",
        "Feishu Bitable, Excel / CSV and local product images."
      ],
      [
        "Local API",
        "FastAPI receives preview, import, store lookup and job requests."
      ],
      [
        "Execution",
        "Playwright drives visible Chrome / Edge and reuses isolated login sessions. It does not use the Jushuitan Open API."
      ],
      [
        "Persistence & delivery",
        "A dedicated MySQL database stores products, SKUs and jobs. Windows launch and offline installation scripts support delivery."
      ]
    ],
    "flow": [
      "Read product data and images",
      "Map fields and preview",
      "Review manually",
      "Create ERP products",
      "Select platform and store",
      "Execute and record SKU results",
      "Retry failed items"
    ],
    "flowNote": "The current README explicitly describes listing rules for Pinduoduo and Douyin. Although the archive name includes Xiaohongshu, that is not evidence that its workflow has passed acceptance. Users still need to handle login, CAPTCHAs and similar interactions.",
    "challenges": [
      [
        "Scope each SKU identity",
        "The database limits SKU code uniqueness to a product, preventing data from being mixed when different products reuse a code. Prices use the smallest currency unit to reduce ambiguity in monetary calculations."
      ],
      [
        "Keep the evidence needed for retries",
        "Jobs store each item’s status, with screenshots and diagnostics on failure. A retry must preserve the original job context so that prices in the same batch do not silently change."
      ],
      [
        "Upgrades must preserve business data",
        "The project distinguishes full migration packages from upgrade packages. Documentation covers backup, schema upgrades and failure recovery. Running the tool on another computer is also part of engineering delivery."
      ]
    ],
    "entities": [
      [
        "products",
        "Products",
        "id · PK",
        "internal_code · UNIQUE"
      ],
      [
        "product_skus",
        "Product variants",
        "id · PK",
        "product_id · FK"
      ],
      [
        "product_assets",
        "Product images",
        "id · PK",
        "product_id · FK"
      ]
    ],
    "relations": [
      [
        0,
        1,
        "1 : N · Product variants"
      ],
      [
        0,
        2,
        "1 : N · Product assets"
      ]
    ],
    "erNote": "An excerpt of the product domain in mysql_schema.sql. product_skus has a unique constraint on (product_id, sku_code). Other tables cover platforms, stores, import batches, publishing jobs and job items.",
    "tests": [
      [
        "Persistence & retries",
        "Test cases exist",
        "test_database.py covers jobs surviving restarts, retries for unprocessed items, SKU scope and migrations."
      ],
      [
        "Scheduling boundaries",
        "Test cases exist",
        "test_listing_schedule.py covers immediate / delayed step order, expired jobs and cancellation boundaries."
      ],
      [
        "Security configuration",
        "Test cases exist",
        "test_security.py checks ERP URL restrictions and storage of sensitive settings outside plain text."
      ],
      [
        "Real platform execution",
        "Not run in this review",
        "This was a read-only analysis. It did not log in to stores, create products, execute listings or generate a business release package."
      ]
    ],
    "reflection": "Automation is most useful when inputs, execution and results can be matched. When failures can be located, data can be checked and retries have a clear scope, a tool becomes an assistant people can depend on in daily work.",
    "evidence": [
      "README.md",
      "erp_tool/mysql_schema.sql",
      "erp_tool/models.py",
      "tests/test_database.py",
      "tests/test_listing_schedule.py",
      "tests/test_security.py"
    ]
  },
  {
    "id": "qianchuan",
    "title": "Qianchuan Ad Management: connecting accounts, assets and campaign status",
    "category": "Business Automation",
    "tone": "sky",
    "featured": false,
    "tech": [
      "Python",
      "Flask",
      "SQLite",
      "OceanEngine OpenAPI",
      "OAuth 2.0",
      "Requests"
    ],
    "description": "A local workspace for authorized accounts, asset uploads and ad campaigns, using persistent records to support long-running tasks.",
    "kicker": "MATERIAL → DELIVERY",
    "status": "Local business tool · Engineering review",
    "intro": [
      "An ad management workspace handles more than a single API request. Accounts change, authorizations expire, assets need matching products and existing campaigns need ongoing tracking.",
      "This project uses Flask for local endpoints, connects to Qianchuan’s open platform and stores account links, asset status, campaigns and logs in SQLite. I want to document it as an engineering exercise in turning scattered operations into a workflow with context and a history that can be revisited."
    ],
    "architecture": [
      [
        "Local workspace",
        "Flask routes and templates support authorization, assets and ad operations."
      ],
      [
        "Platform connection",
        "Requests calls the open APIs; OAuth handles authorization and token refresh."
      ],
      [
        "Business orchestration",
        "Asset scanning / uploading, product matching, campaign status and read throttling."
      ],
      [
        "Data storage",
        "SQLite in WAL mode, with separate storage for tokens, asset upload accounts, campaigns, logs and reports."
      ]
    ],
    "flow": [
      "Complete OAuth authorization",
      "Link ad accounts",
      "Organize and upload assets",
      "Match products and assets",
      "Submit an ad request",
      "Save campaigns and logs"
    ],
    "flowNote": "This is a conceptual main flow based on responsibilities in the source. Authorization failures and platform errors must be handled first. No real ad API calls were made and no ads were created in this review.",
    "challenges": [
      [
        "Keep authorization tied to accounts",
        "The code handles account selection, token metadata completion and refresh. One authorization can link to several ad accounts, so the current page selection cannot be the only basis for identity."
      ],
      [
        "Keep state beyond memory",
        "db.py persists assets, upload accounts, campaigns and logs separately so context can be restored. SQLite WAL is part of the current connection configuration; it does not establish that high-concurrency validation has passed."
      ],
      [
        "Retain context for repeated operations",
        "The code includes asset deduplication, read throttling and campaign status storage. These help reduce duplicate requests, but reliability under real failures still needs dedicated validation."
      ]
    ],
    "entities": [
      [
        "tokens",
        "Authorizations",
        "id · PK",
        "is_active"
      ],
      [
        "token_qc_accounts",
        "Authorized account links",
        "token_id · FK",
        "advertiser_id / account_type"
      ]
    ],
    "relations": [
      [
        0,
        1,
        "1 : N · Account links"
      ]
    ],
    "erNote": "This diagram shows only the foreign key explicitly declared in db.py: token_qc_accounts references tokens. Assets and campaigns have separate tables; similar-looking fields are not assumed to be database foreign keys.",
    "tests": [
      [
        "Data layer",
        "Read-only source review",
        "Reviewed SQLite schemas, WAL settings and the account-link foreign key without connecting to the business database."
      ],
      [
        "Automated tests",
        "No separate test suite found",
        "No separate test suite was located in the supplied archive during this review, so a passing test result cannot be claimed."
      ],
      [
        "Suggested next steps",
        "Suggested cases, not run",
        "Prioritize expired-token refresh, isolation between accounts, duplicate assets, platform rate limits and recovery after a process restart."
      ],
      [
        "Real ad delivery",
        "Not run in this review",
        "Performance, ROI and production stability require real platform data. This article provides no invented metrics."
      ]
    ],
    "reflection": "Progress in business tools often appears in small details: accounts stay separate, failures leave records and a restart does not lose the last known progress. My next priority is to add repeatable tests so these judgments move from plausible reading to evidence.",
    "evidence": [
      "app.py",
      "db.py",
      "gallery_uploader.py"
    ]
  },
  {
    "id": "elderly-android",
    "title": "Silver Guardian · Android: a voice-enabled mobile care assistant",
    "platform": "Android",
    "category": "Hardware & Software",
    "tone": "apricot",
    "featured": false,
    "tech": [
      "Android / Kotlin",
      "Jetpack Compose",
      "FastAPI",
      "SQLite",
      "iFLYTEK Speech",
      "DeepSeek",
      "WebSocket"
    ],
    "description": "An Android phone app for voice conversations, health records, daily reminders, family access and device anomaly reports, implemented independently of the HarmonyOS edition.",
    "kicker": "ANDROID × DAILY CARE",
    "status": "Independent Android project · Product practice",
    "architecture": [
      [
        "Android client",
        "Kotlin + Jetpack Compose / Material 3, with ViewModel managing screen state."
      ],
      [
        "Phone capabilities",
        "iFLYTEK speech integration, reminders and notifications, steps, location and sensor services."
      ],
      [
        "Backend & models",
        "FastAPI provides business endpoints; DeepSeek handles conversation and suggestions. WebSocket supports location requests."
      ],
      [
        "Data storage",
        "SharedPreferences stores local records on the phone; server-side SQLite stores synchronized records and product data."
      ]
    ],
    "flow": [
      "Older adult enters data / makes a request",
      "Phone processes locally",
      "API or WebSocket interaction",
      "Server stores data / model processes",
      "Older adult or family views the result"
    ],
    "flowNote": "The Android edition centers on phone capabilities and a Python backend. It does not use the HarmonyOS edition’s ArkTS, Spring Boot or family membership data model.",
    "evidence": [
      "android/app/build.gradle.kts",
      "android/app/src/main/java/com/example/elderlycare/data/repository/HealthLocalRepository.kt",
      "android/app/src/main/java/com/example/elderlycare/FallDetectionService.kt",
      "backend/main_api.py",
      "backend/product_db.py",
      "backend/elder_location_cache.py",
      "android/app/src/test/java/com/example/elderlycare/ExampleUnitTest.kt"
    ]
  }
];

window.fieldNotesEn = [
  {
    "id": "retry-with-context",
    "category": "Field Notes",
    "title": "Before retrying, decide what must stay unchanged",
    "kicker": "ENGINEERING NOTES / 01",
    "tone": "sage",
    "featured": false,
    "tech": [
      "Task design",
      "Idempotency",
      "Data consistency"
    ],
    "description": "Input snapshots, unknown outcomes and safe retries, explored through product listing and long-running jobs.",
    "related": "erp-automation",
    "sections": [
      [
        "Why “try again” is not simple",
        [
          "After a task fails, a retry button seems like the obvious interaction. But a network timeout only tells us that the client did not receive a result. It does not prove that the server never executed the request. Directly resubmitting can create duplicate products or assets, or leave two conflicting records for the same action.",
          "Retrying is first a question of business meaning, and only then a question of loops and exception handling. Is this still the original input? Can the previous result be queried? Which steps may run again, and which need checking first?"
        ]
      ],
      [
        "Start with a batch of products, before the retry button",
        [
          "Suppose an operator submits a batch to a store. The first product succeeds, the second times out while awaiting the platform’s response, and the third has not started. If the page says “Job failed,” users will naturally assume that none of the batch ran. Rerunning the batch can duplicate the first product. Rerunning only the second can still duplicate a product that already exists. The issue is a failure to separate batch status from item status.",
          "I would first identify the smallest business unit: which store, which product, which input version and which execution attempt. The batch summarizes progress; each item records its own outcome. One exception must not erase other items’ successes, and a failed attempt must not overwrite that item’s earlier attempts. The progress bar can be simple, but the underlying records must be detailed enough to give “continue with remaining items” a precise meaning.",
          "Another easily missed decision is whether changing a product’s price means retrying or submitting again. If the business input has changed, I prefer a new version with an explicit change record rather than reusing the old idempotency key. Otherwise, the system may return an earlier result while the operator believes the new price took effect. Whether failed jobs can be edited should be an explicit product rule."
        ]
      ],
      [
        "Give unknown outcomes a separate path",
        [
          "State transitions can follow these rules: pending becomes running; a confirmed target result becomes successful; an explicit parameter rejection becomes awaiting correction; a lost connection or response becomes awaiting verification. Awaiting verification must not return directly to pending. First query the target platform or ask an authorized person to confirm. If a matching result exists, record success; allow resubmission only after confirming that nothing was created.",
          "If the target platform has no reliable lookup, fully automatic recovery cannot be promised. Show the store, product identifier, submission time and input summary to support manual investigation, and record who confirmed what. This may look less elegant than an automatic button, but it keeps the uncertainty visible rather than disguising an unknown outcome as a successful retry.",
          "Automatic retries also need a budget. Temporary network problems can use a limited attempt count and increasing delays. Invalid fields or insufficient permission will not improve with time and should immediately require human action. Stop after the budget is exhausted instead of consuming quota indefinitely. The limits depend on the platform and business deadline; there is no universal number."
        ]
      ],
      [
        "How to verify the design",
        [
          "Start with a controllable target service that receives a request and creates a record but sends no response. The first call should enter awaiting verification, and a second click must not directly increase the target’s record count. Then simulate a lookup returning the existing record. The system should fill in its external identifier and finish the job. This exercises the reason for idempotency protection more directly than an ordinary successful request.",
          "Next, verify input isolation: create a job under rule A, then change the global configuration to B during execution. Continuing the original job should use its promised snapshot. If the product allows regeneration under B, the interface and history should show a new version. Finally, simulate two workers competing for one item and check the update conditions, instead of only asserting that the final log says success.",
          "Acceptance evidence should include internal states and external record counts, along with the failure reason and next action. This is a proposed validation path, not a claim that every external platform has been tested. The useful deliverable is the ability to answer which items are complete, which remain uncertain and how to proceed without making the situation worse."
        ]
      ],
      [
        "Separate job input from current configuration",
        [
          "A batch might be created with one pricing rule before an operator changes the price table. If a retry reads the latest prices, it may appear to handle the same failed item while actually sending a different request. A more reliable design retains the job’s input snapshot and the rule or resource versions it used.",
          "A snapshot need not copy every source file, but it must explain what the job was based on. Product codes, target stores, key fields and pricing rules can all affect the result. They are retry context, not optional extras."
        ]
      ],
      [
        "Distinguish three outcomes first",
        [
          "Confirmed failure means the target result definitely does not exist, so the operation may run again under the rules after the input is fixed. Confirmed success should not be created again just because someone clicks twice. An unknown outcome requires an external lookup or manual verification; it cannot simply be classified as failure.",
          "The interface should express the same distinction. A success/failure label is often insufficient. At minimum, explain the reason and suggested next step. For external platform actions, job identifiers and external response identifiers help investigation more than “please retry.”"
        ]
      ],
      [
        "Write tests around state transitions",
        [
          "Regression cases can simulate failure before submission, timeout after submission, a lost response after saving the result, and repeated clicks. Assertions should check duplicate business records, unchanged input and preserved state history, as well as the final return value.",
          "Long-running jobs also need to handle an old worker recovering and writing alongside a new worker. Leases, version checks and idempotency keys can constrain execution, but each should address a specific failure scenario rather than merely appear in an architecture diagram."
        ]
      ],
      [
        "How I would bring this into the product",
        [
          "Show the job scope and failure reason near the retry button. For an unknown outcome, offer a verification path first. When inputs need changing, explicitly create a new job attempt rather than silently editing the old one. Users can then understand the effect of a click without knowing the term idempotency.",
          "These are design methods drawn from project task models, not a claim that every project already implements every safeguard. For an existing tool, first connect inputs, targets and results, then improve automatic recovery incrementally. That makes the improvement easier to verify."
        ]
      ]
    ],
    "code": {
      "label": "Conceptual pseudocode · Retry decisions, not project source",
      "language": "Pseudocode",
      "text": "task = load_task(task_id)\nif task.result == \"confirmed_success\":\n    return task.saved_result\nif task.result == \"unknown\":\n    return reconcile_with_target(task.external_id)\nreturn execute(task.input_snapshot, task.idempotency_key)"
    },
    "takeaway": "Confirm the original input and external outcome before deciding to execute again."
  },
  {
    "id": "ai-quality-gates",
    "category": "Field Notes",
    "title": "An AI workflow runs. Why is acceptance still unfinished?",
    "kicker": "ENGINEERING NOTES / 02",
    "tone": "blue",
    "featured": false,
    "tech": [
      "AI Agent",
      "Test strategy",
      "Human review"
    ],
    "description": "Validate APIs, workflows and real model performance separately so that “tests passed” has a clear meaning.",
    "related": "meeting-agent",
    "sections": [
      [
        "What a passing test means",
        [
          "In an AI project, a 200 response, a completed job state and a successful file download are all worth checking. They do not answer whether a transcript is accurate or minutes are faithful to the discussion. A system can correctly store inaccurate text. Engineering behavior and content quality are different layers.",
          "When presenting a project, I separate the evidence: API and permission tests establish system boundaries, deterministic tests establish repeatability, and real-sample evaluation establishes the current model’s performance in its target setting. Passing one layer does not replace the others."
        ]
      ],
      [
        "Turn “looks good” into criteria the business can approve",
        [
          "For a project discussion recording, users need actionable minutes: what was discussed, what was decided, who is responsible and when work is due. If the recording says “confirm the owner next week” but the output supplies a name, fluent prose has still changed the facts. Acceptance must ask more than how the result looks.",
          "I would divide the output into facts, conclusions and actions. Facts need links to original segments. Conclusions must distinguish consensus from ongoing discussion. Owners and dates need evidence; missing information should remain awaiting confirmation. The business should first identify errors that affect work, then decide which fields must be reviewed before release. These criteria translate into screens and processes more readily than one overall score.",
          "Ordinary punctuation can be corrected during editing. Reversing a negative statement, inventing an owner or omitting a key risk should block release. Engineers should not decide severity on behalf of the business, and treating every mistake as a typo can average away the real risks while making scores appear stable."
        ]
      ],
      [
        "Build a small, reviewable evaluation set",
        [
          "Start with a reusable sample inventory rather than chasing a large sample count. Record collection conditions, permitted use, noise type, speaker count, key terms and reference conclusions. Separate samples repeatedly used for prompt development from final acceptance samples, so the evaluation does more than demonstrate familiarity with known problems.",
          "Fix each sample’s input version and record the provider, model identifier, prompt version and output. A later evaluation should at least reveal which variable changed. Changing the model, prompt and audio preprocessing together makes attribution difficult. Without traceable versions, “the new version is better” is often only an impression.",
          "Reference answers are open to challenge too. Keep reviewer comments on ambiguous conclusions or speaker identities and allow rechecking. Evaluation should support consistent judgment rather than force complex meeting content into exact string matching. For real recordings, authorization, de-identification and retention periods are delivery conditions; business data should not casually enter a public test repository."
        ]
      ],
      [
        "Bring engineering tests and content review together before release",
        [
          "Engineering checks upload permissions, cancellation, timeouts, reruns, versions and export. Content review checks factual support, omissions and actions. Record both tracks separately, then combine them into release criteria. A working flow with unreviewed content establishes only workflow verification. Good content with broken permission isolation is also unfit for real business use.",
          "The interface can make these boundaries clear. Completed generation enters a review state where users inspect sources, edit fields and explicitly publish. Regeneration creates a draft and must not silently replace an approved version. Open-ended model output belongs in drafting; authorized people approve formal deliverables. Human review is a set of usable product features.",
          "Keep error categories in the review, not only an overall score. Was the cause poor recording quality, missed terminology, lost context at a split, or unsupported additions during generation? Each calls for a different improvement. Locate the error concentration before changing models instead of lengthening the prompt whenever a problem appears. This is an evaluation design method, not a claim of any measured accuracy."
        ]
      ],
      [
        "Mocks provide stability, not evidence of realism",
        [
          "Mocks make development independent of provider quota and network variation. They support repeated checks of uploads, job transitions, cancellation, versioning and export, and reliably reproduce timeouts or rejections. This makes regression testing more controllable.",
          "The problem is using mocked results as proof of real model quality. Returning four preset transcript segments verifies that the interface handles four segments. It does not establish performance on dialects or overlapping speakers. Test reports need to state the input source and model mode."
        ]
      ],
      [
        "Evaluate quality in real working conditions",
        [
          "For meeting minutes, samples should cover recording conditions, speaker counts, terminology and accents. Text recognition, speaker attribution, key conclusions and action owners can each be checked separately. Record gaps when data is incomplete instead of hiding differences to produce one score.",
          "Failure examples matter alongside average performance. Misattributing a critical statement may matter more than several ordinary typos. Business users need to decide which errors can be corrected manually and which must block publication."
        ]
      ],
      [
        "Human confirmation is a product capability",
        [
          "Connecting original segments, generated content and revision records makes results easier to inspect. It provides a usable way of working when AI performance varies. Knowing which parts require confirmation is more helpful than receiving a complete article without sources.",
          "Versioning should also protect approved content. A new transcription does not justify overwriting old minutes; a new draft needs its own provenance. This makes changes explainable and prevents regeneration from damaging completed work."
        ]
      ],
      [
        "Make acceptance a repeatable checklist",
        [
          "I prefer scenario-based descriptions: normal input, missing input, model timeout and recovery, human edits, and storage of the formal version. Expected behavior and evidence for each scenario are easier for product and business teams to understand than a claim of a high test pass rate.",
          "Reusable experience keeps the boundaries attached to every quality conclusion: which environment, which input and which behavior was verified. Do not invent metrics for unmeasured data. Clear unknowns also give future improvements a direction."
        ]
      ]
    ],
    "code": {
      "label": "Example acceptance record · Organizing test evidence",
      "language": "JSON",
      "text": "{\n  \"layer\": \"workflow\",\n  \"provider\": \"mock\",\n  \"scenario\": \"cancel_running_job\",\n  \"expected\": \"no_new_published_result\",\n  \"model_quality_evaluated\": false\n}"
    },
    "takeaway": "A correct workflow, an effective model and business acceptance each need their own evidence."
  },
  {
    "id": "mobile-state-design",
    "category": "Field Notes",
    "title": "What must be true before a location is “latest”?",
    "kicker": "ENGINEERING NOTES / 03",
    "tone": "apricot",
    "featured": false,
    "tech": [
      "Android",
      "WebSocket",
      "State design"
    ],
    "description": "Understanding live requests, caches and interface feedback through data moving between a phone and a family member’s screen.",
    "related": "elderly-android",
    "sections": [
      [
        "A displayed value does not mean a fresh device report",
        [
          "Mobile data often travels through several places: local phone storage, a network request, a server cache and another device’s screen. After a family member requests a location, displaying coordinates proves only that data is available. It does not prove that the older adult’s phone just acquired a new location.",
          "That is why the most recent record and a new live reading should be described separately. A cache can help during unstable connections, but its time must remain visible. A fallback value must not disguise a failed request as live success."
        ]
      ],
      [
        "Follow the timeline of an apparently normal refresh",
        [
          "Suppose the family screen shows a record from a few minutes ago. Refresh sends a request from the server to the phone, but the phone has entered the background and does not return a new location in time. If the API returns cached coordinates as success, the screen may say “Refresh successful” even though the map received no new information. This confuses request completion with a data update.",
          "Alternatively, request A starts first but responds slowly, while B starts later and finishes first. A arrives after B has updated the map. Replacing values in arrival order moves the visible location back to older data. Collection time, request start time and response arrival time are separate concepts; a single field named time cannot represent all of them.",
          "A timeline is a useful starting point: who requests, who collects, where a timeout occurs and when existing display data may be replaced. Product managers need not understand connection pools, but they do need to define what “Refresh successful” promises. Engineering can then choose request identifiers, validity periods and update rules around that promise."
        ]
      ],
      [
        "Make the cache a helpful fallback",
        [
          "Keeping an old location has value if users know its age. An understandable state combination is: while waiting, show the last location; after timeout, keep it with its timestamp; when a valid new record arrives, replace it and update its source. With no history, show an explicit empty state instead of treating default coordinates as a real location.",
          "The interface should also avoid unnecessary anxiety. No response yet does not mean the person is in danger, and disabled permission does not mean the device is offline. Details can explain technical causes, while the main message offers a next step such as retrying later, checking permissions or making direct contact. In care scenarios, network state should not stand in for a health judgment.",
          "The age at which a record is stale depends on the business agreement. Display thresholds can be configurable, but a fixed threshold cannot justify a claim of perpetual real-time data. Device clocks can also be wrong. Recording server receipt time helps, but it is still not collection time. Wording and data structures should be designed together."
        ]
      ],
      [
        "Do not stop physical-device acceptance after one foreground success",
        [
          "Build a matrix covering the foreground, lock screen, background, battery saving, network changes, disabled permissions and system process termination. For each request, record receipt, collection, transmission and the family screen’s final display. If a system version cannot yet be covered, state that limitation rather than equating emulator success with success on every device.",
          "Recovery from disconnection must also check older requests. After reconnecting, can an obsolete request still return a response? If so, how does the receiver prevent it from replacing the current display? Can the app register again when a server restart loses its connection map? These cases reveal more about reliability than simply extending a timeout.",
          "Maintain separate acceptance records for Android and HarmonyOS. Similar screens do not justify reusing a passing result. A product introduction should state supported device conditions, verified states, known limits and failure behavior. Reliability means evidence for success, explanations for failure and a clear way to continue."
        ]
      ],
      [
        "Break the path into explainable states",
        [
          "Request initiation, device connectivity, permission, location acquisition, transmission and screen updates can each fail. Users do not need every technical detail, but they need to know whether a reading is being fetched, cannot currently be fetched or is a historical record.",
          "Engineering should separate request identifiers, data timestamps and display state. A timeout describes a request; cache age describes data. Neither should overwrite the other. Rapid repeated requests also need protection against slower old results replacing newer ones."
        ]
      ],
      [
        "WebSocket provides a connection, not complete reliability",
        [
          "WebSocket supports real-time messages between server and device, but does not automatically handle background sleep, disconnection, denied permission or process restarts. If connection mappings live only in one process’s memory, multiprocess deployment needs additional routing or shared coordination.",
          "Technology choices should include their limits. A persistent connection is a valid choice when deployment matches its assumptions and behavior after disconnection is verified on real devices. One successful message on a development computer is insufficient."
        ]
      ],
      [
        "Device features need physical-device tests",
        [
          "Speech, location, reminders and sensors depend on system versions, permissions and hardware. Emulators and API tests cover some logic. Lock screens, background operation, battery saving, restarts and revoked permissions should be checked on target devices.",
          "Android and HarmonyOS especially need distinct quality conclusions. They can share product goals but have different lifecycles, SDKs and permissions. Recording implementation and verification scope separately prevents confusion in cross-platform descriptions."
        ]
      ],
      [
        "Use status to help users choose the next step",
        [
          "For example, show “Trying to retrieve location,” then after timeout, “No new location received. Showing the last record,” alongside the record time and a retry button. The wording can be simple while staying accurate. Users should be able to decide whether to wait, retry or contact the person another way.",
          "I increasingly value this in mobile projects: reliable experience comes from clear communication during failure as well as success rates. An honest state and a definite next step often help more than a success style that hides the problem."
        ]
      ]
    ],
    "code": {
      "label": "Example interface state · Not a deployed API",
      "language": "JSON",
      "text": "{\n  \"request_state\": \"timed_out\",\n  \"display_source\": \"last_known\",\n  \"recorded_at\": \"sample_timestamp\",\n  \"can_retry\": true\n}"
    },
    "takeaway": "Separate request state from data freshness to represent “now” honestly."
  }
];

window.projectTechnicalEn = {
  "silver-guardian": {
    "topics": [
      [
        "Transaction boundaries & Outbox",
        "Core uses a modular monolith, grouping deterministic updates within a business transaction. Asynchronous collaboration across modules uses a Transactional Outbox, making the committed business update and pending event delivery traceable. The Outbox still needs delivery, deduplication and monitoring; it does not inherently guarantee exactly-once processing by every consumer."
      ],
      [
        "Agent execution context",
        "After a model selects a tool, the call must carry user identity and permission context, pass capability checks and any required confirmation, and execute through a gateway. The model cannot write directly to the core database. Validation needs to include unavailable auditing, user cancellation and model timeouts as well as successful paths."
      ],
      [
        "Constraints & revocation",
        "Family members use a unique constraint on (family_id, user_id), preventing unlimited duplicate links. After a relationship is revoked, subsequent requests should use current server state rather than keep trusting a cached client role."
      ]
    ],
    "code": {
      "language": "SQL",
      "label": "Simplified excerpt of reviewed constraints · Not a complete migration",
      "text": "UNIQUE (family_id, user_id)\nFOREIGN KEY (family_id) REFERENCES family.families(id)\nFOREIGN KEY (user_id) REFERENCES identity.users(id)"
    },
    "checks": [
      "Link the same family and user twice.",
      "Request a tool after the user revokes authorization.",
      "Save business data successfully while event delivery temporarily fails."
    ]
  },
  "meeting-agent": {
    "topics": [
      [
        "Long jobs: leases & result fencing",
        "The meeting pilot architecture tracks execution with durable jobs, leases and heartbeats. A timed-out job can recover while an old worker is still running, so result writes must also verify current execution ownership. Job messages reference entities and object keys; they do not put recording content in the queue."
      ],
      [
        "Immutable transcription runs",
        "Retranscription creates a new TranscriptionRun and retains earlier segments and human revisions. The meeting points to the currently active run. Minutes versions link to transcript segments through source records so that a new recognition result cannot silently change the basis of old minutes."
      ],
      [
        "Providers translate inputs and outputs",
        "ASR and meeting AI Providers accept typed inputs and return results. Transactions, confirmation and auditing remain in the application layer, so changing vendor integrations need not change minutes permissions or version rules. Mock workflows verify the protocol; speech quality still requires real samples."
      ]
    ],
    "code": {
      "language": "Pseudocode",
      "label": "Job recovery concept · Not original project code",
      "text": "job = claim_with_lease(job_id)\nresult = provider.process(job.input_reference)\nif still_owns_lease(job.id, job.lease_version):\n    persist_result_and_status(result)\nelse:\n    discard_stale_worker_result()"
    },
    "checks": [
      "An old worker and a recovery worker return at the same time.",
      "Old minutes remain traceable after retranscription.",
      "A user cancels while the model request is still pending."
    ]
  },
  "content-agent": {
    "topics": [
      [
        "Tasks, runs & artifacts",
        "content_tasks stores objectives and stages, generation_runs stores execution details for a generation, and artifacts stores candidates and versions. An Artifact’s generation_run_id can be null, so imported assets and other sources need not be misrepresented as model output."
      ],
      [
        "Change propagation & invalidation",
        "Upstream configuration changes may affect approved copy, voiceovers and subtitles. Saving an unchanged configuration should not invalidate the whole chain. Tests check workflow state after submissions with no actual change, showing that idempotent updates are part of the user experience."
      ],
      [
        "Video projects & external resources",
        "Video project revisions are saved with asset associations, while FFmpeg performs deterministic composition. Temporary files from a model need to be copied to persistent storage. An authenticated URL that opens in a browser may be unreadable to an external model; media transfer needs a separate controlled channel."
      ]
    ],
    "code": {
      "language": "Data relationships",
      "label": "Reading excerpt from actual model relationships",
      "text": "content_tasks.id → generation_runs.task_id\ncontent_tasks.id → artifacts.task_id\ngeneration_runs.id → artifacts.generation_run_id (nullable)\nvideo_projects.id → video_project_revisions.project_id"
    },
    "checks": [
      "Save the same configuration repeatedly.",
      "Check whether old subtitles are incorrectly reused after replacing the copy.",
      "The external asset URL expires while the locally stored copy remains readable."
    ]
  },
  "erp-automation": {
    "topics": [
      [
        "Separate internal and platform SKUs",
        "product_skus scopes sku_code to a product, while listing_skus maps internal variants to specific listings. The same internal product can therefore be published to several stores without mixing each store’s external identifiers and listing prices in one field."
      ],
      [
        "Prices & job snapshots",
        "Amounts use the smallest currency unit so floating-point approximation does not become the source of business prices. Batch rules and generated prices need to stay stable. A retry must not generate a different random markup. Changed inputs should explicitly start a new processing attempt."
      ],
      [
        "Recover at job-item granularity",
        "publish_job_items stores per-item input, status and response data. Unfinished items can be identified after a restart, with failure screenshots preserving browser context. Successful web operations need to match actual platform results; the absence of a script error is insufficient."
      ]
    ],
    "code": {
      "language": "SQL",
      "label": "Simplified excerpt of reviewed fields and constraints",
      "text": "base_price_minor BIGINT UNSIGNED NOT NULL\nUNIQUE (product_id, sku_code)\nUNIQUE (listing_id, product_sku_id)\nFOREIGN KEY (job_id) REFERENCES publish_jobs(id)"
    },
    "checks": [
      "Different products reuse the same SKU code.",
      "The price source changes before a retry.",
      "The browser submits successfully but the local response is lost."
    ]
  },
  "qianchuan": {
    "topics": [
      [
        "Authorization and accounts are separate entities",
        "tokens manages authorizations, while token_qc_accounts links ad accounts and types through a foreign key. One authorization can cover several accounts. Switching the working account must therefore update the product and asset scope rather than reuse the previous account’s page results."
      ],
      [
        "WAL & persistence boundaries",
        "SQLite connections enable WAL, and assets, campaigns, logs and reports are stored separately. WAL is part of the access mode, not evidence that high-concurrency or failure-recovery validation has passed. Unknown outcomes, duplicate submissions and multithreaded writes still need separate checks."
      ],
      [
        "Classify failures during batch execution",
        "The current code includes read throttling, asset deduplication and execution status records. A suggested improvement is to distinguish expired authorization, rate limits, business validation failures and unknown outcomes, then decide whether to stop, wait or verify. This is a proposal, not a claim of an existing complete mechanism."
      ]
    ],
    "code": {
      "language": "SQL",
      "label": "Authorization relationship excerpt from actual table definitions",
      "text": "PRIMARY KEY (token_id, advertiser_id, account_type)\nFOREIGN KEY (token_id) REFERENCES tokens(id)\n    ON DELETE CASCADE"
    },
    "checks": [
      "Continue selecting the original ad account after token refresh.",
      "Query whether the campaign was created after a platform timeout.",
      "Reload campaign and asset status after an interruption."
    ]
  },
  "elderly-android": {
    "topics": [
      [
        "Local records & synchronization keys",
        "HealthLocalRepository stores records by older-adult identifier in SharedPreferences. Server-side synced_health_records uses the composite primary key (elder_id, client_uid) to identify the same record on repeated synchronization. This does not mean every conflict policy is complete."
      ],
      [
        "Location requests & cached reads",
        "WebSocket connects to the older adult’s device. After a live request times out, SQLite’s location cache can be read. The cache carries an update time, and displays should distinguish current from historical data. The connection map currently depends on process memory; multiple workers or machines need additional routing and shared-state handling."
      ],
      [
        "Device behavior & algorithm limits",
        "Impact detection uses threshold rules, preferring linear acceleration and falling back to the accelerometer, with a cooldown period. It is a heuristic device-event detector rather than a trained fall classifier. Everyday motions, carrying positions and real phone models are needed to validate false positives and background behavior."
      ]
    ],
    "code": {
      "language": "SQL",
      "label": "Reviewed primary key excerpt · No physical foreign keys across databases",
      "text": "synced_health_records:\n    PRIMARY KEY (elder_id, client_uid)\nactivity_daily:\n    PRIMARY KEY (elder_id, date_key)\nelder_location_cache:\n    elder_id TEXT PRIMARY KEY"
    },
    "checks": [
      "Submit the same local health record twice.",
      "Display the cache update time after WebSocket disconnection.",
      "Check service behavior after screen lock, denied permission or restart."
    ]
  }
};
