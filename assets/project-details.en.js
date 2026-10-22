/* Project articles for product and business readers. Scenarios explain the product; they are not customer trial records. */
window.projectDetailsEn = {
  'silver-guardian': {
    summary: 'A HarmonyOS family care platform: ArkTS phone and watch apps, a Spring Boot core service, and a separate Agent coordinate across devices. It is implemented separately from the Kotlin Android edition.',
    positioning: [
      'The difficulty in family care is often disconnected information rather than a missing feature. Older adults need to remember reminders, find contacts, and explain their needs. Family members want to stay informed but cannot always be present. Once a reminder is sent, people also need clear feedback about whether it was received and handled. Silver Guardian organizes these everyday needs into one system for companionship, reminders, family contact, and attention to unusual events.',
      'Designed for older adults and family caregivers, the product uses a HarmonyOS phone app as its main entry point, with separate workspaces for older adults and family members, plus a watch project and an operations console. The older adult experience emphasizes direct expression and everyday actions; the family experience focuses on relationships, authorization, and collaboration; the console handles configuration and management. Working across devices means assigning each role its part of a process, rather than simply resizing one screen.',
      'AI handles natural language interaction, memory, and tool orchestration, while the core service remains responsible for business facts. It can help interpret a request such as “set a reminder for me,” but cannot bypass account permissions to access location or change care data. The product supports companionship and care coordination. It is not a medical diagnosis system, and automated reminders do not constitute a guarantee of real-world emergency assistance.'
    ],
    roles: [
      ['Older adult', 'Express needs, check reminders, and contact family', 'Reduce the effort of finding actions across multiple pages; make results easy to understand.'],
      ['Family member / caregiver', 'Establish family relationships and participate in authorized care', 'Clarify what can be viewed or handled, and distinguish initiated, confirmed, and pending items.'],
      ['Operations administrator', 'Maintain configuration and review platform and business status', 'Provide manageable access to accounts, service capabilities, and exception handling instead of ad hoc configuration edits.']
    ],
    modules: [
      ['Identity and family relationships', 'Establish who is caring for whom', 'Account identity, family entities, and family memberships are stored separately. After signing in, users enter the workspace for their role. Family relationships define the scope of collaboration, and specific grants further constrain capabilities. Being a family member should not automatically grant access to all data; a visible interface action does not imply server authorization. When family relationships change, permission checks can still refer to explicit business records.'],
      ['Reminders and follow-up', 'Turn a reminder into an item with a clear status', 'Reminders record the older adult concerned, creator, scheduled time, time zone, and handling status. The project covers both one-time and recurring reminders. The interface needs to communicate more than “created successfully”: it should show whether the item has been acknowledged or still needs attention. Family members should also be able to distinguish their own action from the older adult’s actual response, without treating a system delivery as proof that the user has seen it.'],
      ['Family contact and notifications', 'Keep everyday communication in the care context', 'Family messages, emergency contacts, and the notification center serve the same relationship network. This module focuses on linking messages to accounts, families, and handling states, beyond providing a separate chat entry. The existing project includes text and voice family messaging capabilities, but some voice interfaces for older adults and device acknowledgments still need work. Product descriptions and the scope that can actually be accepted therefore need to be stated separately.'],
      ['Health, location, and unusual events', 'Make information understandable and actionable', 'The project covers health records, location, geofencing, SOS, and alert handling. Product design should help answer what happened, who is affected, and who should act next, instead of merely placing data on a dashboard. Location and care data require authorization and encryption. Screens, server records, and device reports must form a complete flow; local simulations alone cannot verify real device capabilities.'],
      ['AI companionship and controlled tools', 'Connect natural language to defined business actions', 'The Agent handles conversation, long-term memory, proactive care, and tool selection; the core service executes business operations. The tool chain includes capability checks, user context, required confirmation, and auditing. When a request lacks information or a capability is unavailable, the system should explain why rather than imply completion. This also preserves a stable business boundary for future model changes.'],
      ['Devices and administration console', 'Extend features into a maintainable operating system', 'Phones, watches, and the console serve different environments, with corresponding modules for device synchronization, commands, and administration settings. The console uses Vue 3; the phone and watch use the HarmonyOS stack. Unified management does not mean every client is equally complete. Real devices, signing, production models, and release rehearsals are still needed to verify complete delivery.']
    ],
    scenario: {
      title: 'Typical scenario: an older adult requests an everyday reminder in conversation',
      intro: 'An everyday reminder illustrates how the product layers work together. This is a business demonstration scenario, not a measurement of real care outcomes.',
      steps: [
        ['Understand the request', 'The older adult asks for a reminder through the interaction interface. The Agent structures the request for business processing. Missing information must be supplied or confirmed rather than decided arbitrarily on the user’s behalf.'],
        ['Check execution conditions', 'The system checks the current account, target user, and tool capability. Access involving another person’s data or an action requiring confirmation must resolve permission and confirmation before execution.'],
        ['Create a business record', 'The core service saves the reminder content, time, time zone, and creation source. A conversational request becomes a business entity that can be queried, tracked, and managed.'],
        ['Present results and feedback', 'The client displays the business state. The interface must distinguish “reminder created” from “reminder handled,” without combining both into the same success message.'],
        ['Handle exceptions and tracing', 'Service unavailability, insufficient permission, or an incomplete device flow should leave an explainable status. Investigation can then refer to tool execution and business records, rather than chat text alone.']
      ],
      result: 'This scenario connects interaction, authorization, persistence, and feedback. Its intended value is to turn a spoken need into a manageable item, with a clear path even when execution fails.'
    },
    solution: [
      ['Why the core service is a modular monolith', 'The first version needs identity, families, reminders, health, location, and alerts together. Splitting them into microservices too early would consume substantial effort on permissions, transactions, and deployment across services. The architecture therefore uses a Spring Boot modular monolith, separating responsibilities through domain modules and database schemas. This keeps transaction boundaries clear while preserving interfaces and event contracts for future independent scaling.'],
      ['Why the Agent runs separately', 'Model responses are uncertain, and their costs, timeouts, and provider configuration differ from the core business. The FastAPI Agent service accesses business capabilities through controlled APIs and a tool gateway, rather than manipulating the core database directly. Model changes are isolated, and separate layers handle what the model understood and what the business permits.'],
      ['How data and events stay consistent', 'PostgreSQL holds business facts, with schema and application interfaces maintaining domain boundaries. A Transactional Outbox organizes asynchronous collaboration between modules, reducing the inconsistency window in which a database change has been saved but its event has not been sent. Caches and queues can improve performance, but should not hold the only copy of a business record.']
    ],
    dataNotes: [
      'Family membership is an association between a user and a family, rather than a fixed field on the user table. Association records store role, status, and other information; a composite uniqueness constraint on family and user prevents duplicate membership. This better represents collaboration and separates account identity from permissions within a family.',
      'Each reminder explicitly records both the older adult concerned and its creator, who may be the same person or different people. The alert model references reminders so the item requiring attention can be traced. The diagram selects verified family, reminder, and alert relationships; it does not represent every table in the platform.'
    ],
    er: [
      ['identity.users', 'id', 'family.families', 'owner_user_id', 'User owns a family'],
      ['family.families', 'id', 'family.family_members', 'family_id', 'Family contains membership records'],
      ['identity.users', 'id', 'family.family_members', 'user_id', 'User has family memberships'],
      ['identity.users', 'id', 'reminder.reminders', 'elder_user_id', 'Older adult has care reminders'],
      ['reminder.reminders', 'id', 'alert.alerts', 'reminder_id', 'Reminder links to alert records']
    ],
    acceptance: [
      ['Access across families', 'Accounts without the relevant relationship and authorization cannot read or change another person’s care data.', 'Permission and tool tests exist; acceptance must also cover the identity flow in the actual deployment.'],
      ['Tool confirmation', 'Actions do not execute without the required confirmation, and cancellation produces no corresponding business change.', 'Test code exists for tool confirmation, capability checks, and auditing.'],
      ['Reminders and time', 'Verify creator, recipient, time zone, and feedback status, rather than checking only for a success message.', 'Recommended as a priority in end-to-end acceptance.'],
      ['Model and device failures', 'A model failure must not corrupt core data, and an unacknowledged device action must not appear complete.', 'Model recovery tests exist; the real phone and watch flow still requires acceptance.'],
      ['Release and operation', 'Production signing, HTTPS, backup restoration, and actual providers must work in the target environment.', 'Project documentation explicitly lists these as subsequent production validation work.']
    ],
    delivery: [
      'The project should currently be understood as an enhanced MVP and engineering prototype. The presence of a module name does not imply production delivery. The repository includes Core, Agent, phone, watch, and console projects, along with automated tests and migration materials. Client details, complete device acknowledgments, real services, and production release still have unfinished work.',
      'The next delivery stage should use a small number of frequent care scenarios for integration on real devices. Verify that accounts, networks, devices, server states, and user feedback agree before moving on to backup restoration, monitoring, and release rehearsals. Commitments to caregivers need evidence from the complete flow.'
    ],
    value: [
      'Silver Guardian organizes separate capabilities into family collaboration. Each step from a request through permission confirmation and service execution to user feedback has an explicit place. Older adults need not understand the underlying technology, and family members need not infer progress from scattered messages.',
      'For me, the most valuable learning was turning “what AI can do” into “how a product should responsibly offer that capability.” Next priorities are simpler key interactions for older adults, complete device feedback, and real scenarios to assess whether proactive care helps. This article does not rely on invented care outcomes or efficiency percentages.'
    ]
  },
  'meeting-agent': {
    summary: 'An AI assistant for meeting organization and records: it connects recording, transcription, identity review, minutes editing, and archiving so every conclusion can be traced to the original speech.',
    positioning: [
      'When a meeting ends, the documentation work is often just beginning. The minute-taker must listen again, distinguish speakers, organize discussion into topics, and verify decisions and action items. Giving an entire recording to a model may save the first round of typing, but does not necessarily solve accuracy, ownership, or subsequent revision. Long meetings, multiple speakers, and specialist terminology require both efficient preparation and trustworthy records.',
      'The Meeting Minutes Agent is a meeting preparation workspace with human review. It keeps source material, transcripts, manual changes, and minutes versions together for each meeting, allowing the minute-taker to establish facts before producing a document. The goal is to give mechanical organization to the system while preserving important human decisions at clear confirmation points.',
      'The project uses an independent meeting service with its own database, file storage, tasks, and model interfaces. Although it shares a frontend entry point and some base packages with the content agent, meeting material does not automatically enter the content service. The current pilot does not imply integration with an enterprise office automation or formal records system; external delivery requires separate configuration and acceptance.'
    ],
    roles: [
      ['Meeting organizer', 'Create meetings and define agendas and access scope', 'Assign material to the correct meeting and specify who may access it and its data processing classification.'],
      ['Minute-taker', 'Upload audio, review transcripts, and prepare and revise minutes', 'Reduce repeated listening while retaining speech times, speakers, and source segments.'],
      ['Reviewer', 'Verify decisions, owners, action items, and the official version', 'Review traceable records rather than merely well-formatted generated text.']
    ],
    modules: [
      ['Meetings and agendas', 'Establish the scope of documentation first', 'A meeting includes a title, time, participation details, agenda, and access scope. Agenda parsing first produces candidates, which enter the meeting information only after confirmation, preventing model parsing from overwriting established facts. The participant list also provides candidates for later identity matching, rather than predetermining how many speakers must occur in the recording.'],
      ['Audio intake and long recordings', 'Keep large files and network interruptions from derailing preparation', 'The system supports audio upload and resumable chunked uploads, with asynchronous transcription tasks. Long recording processing preserves original time offsets, chunk boundaries, and deduplication in overlap regions so merged segments retain order without repeated text. Original recordings and temporary processing chunks are managed separately for review and cleanup.'],
      ['Transcription and speaker review', 'Turn model output into reviewable material', 'Transcripts retain timing and supporting material for review; voiceprint and speaker diarization participate as separate services. Anonymous speakers, candidate participants, and final human mappings are distinct concepts. The system allows partial confirmation or skipping voiceprint processing, rather than forcing a name onto every segment when identity matching is incomplete.'],
      ['Minutes with source references', 'Give conclusions a source', 'Minutes generation uses selected segments, confirmed meeting information, and a chosen template. Titles, sections, decisions, and action items can link to source segments so the minute-taker can return to the original wording. Missing owners, deadlines, and similar details remain pending confirmation instead of being invented by the model for completeness.'],
      ['Human revision and versioning', 'Make edits reversible and comparable', 'Manual editing and AI conversational revision work on the same minutes, while drafts and official versions remain distinct. Retranscription creates a new run and preserves old text and manual revisions. New responses cannot directly overwrite official versions; further work requires a derived draft. This makes differences between document versions explainable.'],
      ['Export, archiving, and access boundaries', 'Deliver records into real work', 'The project includes document export and archive-related models. Formal delivery requires version, source, and integrity information. Closing a meeting is a separate business action, not an automatic consequence of generation or download. Data processing classifications also constrain external model calls, while voiceprint processing stays local.']
    ],
    scenario: {
      title: 'Typical scenario: turn a project discussion with several speakers into reviewable minutes',
      intro: 'When a minute-taker receives a recording, the product expands “one-click summary” into a process that can be checked.',
      steps: [
        ['Create the meeting and add material', 'The minute-taker confirms meeting details, participants, and material access, then uploads audio. Large files use chunks, and upload progress remains queryable.'],
        ['Start transcription', 'The system creates a persistent task and shows progress. Audio processing is separate from web requests, so the entire process does not depend on keeping the same page open.'],
        ['Review the facts', 'The minute-taker checks transcripts, speakers, and flagged segments, correcting terminology and identity mappings. Original results and changes remain available to explain revisions.'],
        ['Prepare a minutes draft', 'Select source segments and a template to produce a structured draft. Unresolved owners, deadlines, and conclusions remain pending confirmation; guesses are not presented as meeting decisions.'],
        ['Revise and deliver', 'The reviewer checks the draft, supplies required fields, and exports the corresponding version. Formal archiving is performed separately when needed, retaining the link between the document and its sources.']
      ],
      result: 'The deliverable includes meeting context, source material that can be revisited, revised records, and explicit versions, as well as a summary. Later questions and changes therefore have an evidence base.'
    },
    solution: [
      ['Why model interfaces and business flows are separate', 'ASR, minutes generation, and speaker recognition each use dedicated interfaces. Model adapters receive and return structured results without directly rewriting business databases. The application layer manages routing, transactions, confirmation, and auditing. Changing a model provider therefore does not require rebuilding minutes versioning, permissions, and human operations.'],
      ['How long tasks and process interruptions are handled', 'The pilot architecture organizes long processing through database tasks, leases, heartbeats, and recovery. Queue or task references contain entity IDs and object keys rather than entire audio files or document bodies. Recovery uses tasks and inputs for idempotency checks, preventing old and new workers from writing conflicting results concurrently.'],
      ['Why transcription and minutes versions are separate', 'A recording may be transcribed again, but earlier minutes must retain their evidence. Transcription runs, segments, revisions, minutes documents, and minutes versions are modeled separately, making a changed recognition result and republication of an official record independently controllable. This supports traceability better than storing only the latest text.']
    ],
    dataNotes: [
      'Meetings are the business entry point. Audio files and candidate participants belong to a meeting; minutes tasks represent preparation work, while documents and versions store the results. Source tables link minutes back to transcript segments, creating a path from a conclusion to the original speech.',
      'Currently effective database records must be distinguished from history. Reprocessing audio or generating new minutes does not mean deleting old sources. The diagram shows the main minutes delivery relationships; specialized tables for voiceprint samples, diarization runs, auditing, and other areas are omitted.'
    ],
    er: [
      ['meetings', 'id', 'audio_files', 'meeting_id', 'Meeting retains original audio'],
      ['meetings', 'id', 'minutes_tasks', 'meeting_id', 'Meeting contains minutes tasks'],
      ['minutes_tasks', 'id', 'minutes_documents', 'task_id (nullable)', 'Task corresponds to a minutes document'],
      ['minutes_documents', 'id', 'minutes_versions', 'minutes_id', 'Document retains version history'],
      ['minutes_versions', 'id', 'minutes_sources', 'version_id (nullable)', 'Version links to source records'],
      ['transcript_segments', 'id', 'minutes_sources', 'segment_id', 'Source points to a speech segment']
    ],
    acceptance: [
      ['Material access', 'Unauthorized users cannot read another person’s private meetings or audio.', 'Existing tests assert 403 responses for private meeting access.'],
      ['Interrupted uploads', 'Chunks can be queried and resumed, and the merged file size matches the input.', 'Tests cover chunked uploads, received chunk counts, and file sizes.'],
      ['Traceable transcription', 'Manual changes retain the original text, and minutes content can be traced to selected sources.', 'Test files cover revisions, source scope, and the core flow.'],
      ['Task recovery and cancellation', 'Cancellation must prevent further result publication, and recovery must not allow executions to overwrite each other.', 'Dedicated tests cover persistent tasks and competing leases.'],
      ['Speech recognition quality', 'Use target business recordings to assess word errors, speakers, and topic matching, recording difficult cases separately.', 'Acceptance requires real samples; passing a mock flow cannot prove model accuracy.']
    ],
    delivery: [
      'The local workspace provides startup orchestration for the shared frontend, meeting service, and independent voiceprint / speaker service. A shared frontend does not mean meeting and content services share a business database; fault diagnosis must inspect the relevant services separately. Deployment also needs to verify actual providers, data directories, and identity integration, beyond confirming that a page opens.',
      'For client delivery, engineering acceptance and quality acceptance should be separate. Engineering checks permissions, uploads, recovery, versions, and export; quality uses actual Mandarin, dialect, specialist terminology, and multi-speaker recordings. Formal enterprise templates, records systems, and identity interfaces require integration in the target environment; this article does not claim that all are already deployed.'
    ],
    value: [
      'The product aims to reduce repetitive material handling and first-draft preparation so minute-takers can focus on checking decisions. Beyond generating a summary, valuable delivery capabilities include visible sources, recorded edits, clear versions, and the ability to continue after a long task fails.',
      'This project taught me that enterprise AI products must demonstrate more than model output. Input scope, human confirmation, and formal publication also determine usability. Priorities for continued improvement are locating important segments, recovery for long recordings, and speech quality in target scenarios, rather than simply adding more generation buttons.'
    ]
  }
};

Object.assign(window.projectDetailsEn, {
  'content-agent': {
    summary: 'A multimodal workspace for enterprise content production: requirements, knowledge, copy, images, voiceovers, and video become an editable creative process with explicit stages and versions.',
    positioning: [
      'Enterprise content production rarely ends with a piece of copy. Turning a campaign theme into different formats involves product information, messaging, visual assets, voiceover, subtitles, and a final video. Separate generation tools require repeated information transfer. A sentence changed upstream may leave the voiceover and subtitles outdated, causing rework when the discrepancy is discovered later.',
      'The Multimodal Content Agent defines each creative assignment as a task. Users confirm the theme, copy, and assets around one set of requirements, then proceed to video and export. The system retains stages, candidates, and generation sources so creation becomes a connected process. Its goal is to reduce repeated information organization and make the impact of changes clearer.',
      'The product does not replace all professional editing and human review. Output quality depends on source material and actual model capabilities, and the final message still needs business judgment. The system concentrates on organization between requirements and delivery: what is confirmed, which asset is current, which steps need repeating, and whether the export matches the current selection.'
    ],
    roles: [
      ['Content planner / operator', 'Define the theme, audience, style, and communication format', 'Keep generation grounded in specific requirements without repeatedly describing the same background in separate dialogs.'],
      ['Content producer', 'Select copy, images, and voiceover, then assemble video', 'Reuse assets, replace individual results, and understand which part of the work a change affects.'],
      ['Business reviewer', 'Check facts, wording, brand messaging, and delivered results', 'Use clear confirmation stages and version evidence to prevent unapproved drafts from being published directly.']
    ],
    modules: [
      ['Creative requirements and modes', 'Establish what needs to be delivered', 'Tasks record theme, product, audience, style, length, and additional requirements, supporting different creation modes. Full mode has seven visible stages; other modes choose the steps appropriate to their purpose. This preserves the overall process without forcing users who need one component through the entire flow.'],
      ['Knowledge and resources', 'Give content a factual basis', 'Resource entries, versions, chunks, and citations provide the knowledge and asset foundation, with retrieval through a separate interface. Enterprise information and external models are configured separately; enabling generation does not imply that all material may be sent to a provider. This reduces repeated background input, while accuracy and updates still require maintenance.'],
      ['Themes, copy, and compliance review', 'Confirm the creative direction first', 'Themes and copy have separate stages and artifacts, and compliance checks are a distinct workflow step. Users can review the message before producing images and video, reducing downstream rework on unconfirmed content. These checks assist review rather than automatically resolving every business and legal judgment.'],
      ['Image, voice, and music generation', 'Connect each model capability through a defined interface', 'Text, images, voiceover, music, and video use separate adapters. The project includes a compatible-protocol text service, Volcengine model and speech integration, and independent music generation. Results must be saved as task-managed assets rather than retaining only temporary URLs that may expire. Failures must return explicit errors instead of silently substituting demonstration output.'],
      ['Video projects and timelines', 'Turn assets into work that remains editable', 'Video projects retain revisions and asset references. FFmpeg combines shots, transitions, subtitles, voiceover, and background music. The timeline manages offsets, trims, volume, and aspect ratio rather than merely concatenating files. Word-level timestamps can align subtitles; when precise timing is unavailable, estimated timing must be identified rather than presented as exact alignment.'],
      ['Preview, confirmation, and export', 'Deliver the current selection consistently', 'Generated candidates, the current project, and exported files serve different purposes. Users preview and confirm a result, later edits create corresponding versions, and export should reflect the effective content. Task-level source and status records locate problems in a specific generation or asset, enabling further adjustment without rebuilding everything.']
    ],
    scenario: {
      title: 'Typical scenario: produce an introduction video around a product theme',
      intro: 'This example focuses on how requirements become a finished work. Visual and messaging quality still depend on actual material, selected models, and human review.',
      steps: [
        ['Define requirements and sources', 'An operator creates a task with audience, theme, style, and delivery format, then selects available product information. Source versions need clear provenance so the model does not mix outdated material.'],
        ['Confirm theme and copy', 'Resolve the information structure and messaging before asset production. Business staff check facts and sensitive wording; confirmed copy reduces substantial downstream rework.'],
        ['Produce multimodal assets', 'Generate or select images, voiceover, and music based on the copy. The system saves results in the task and distinguishes candidates from selections, removing the need to maintain manual mappings across tools.'],
        ['Assemble and preview', 'Arrange visuals, audio, and subtitles in the video project, checking pacing, duration, and aspect ratio. If copy changes, reassess whether the existing voiceover and subtitles remain valid.'],
        ['Confirm the version and export', 'Review the final preview and export the file corresponding to the current project. For an unsatisfactory component, follow task and artifact relationships back to the relevant step instead of restarting requirements configuration.']
      ],
      result: 'Delivery includes an editable task context and asset relationships as well as a video. These preserve the ability to iterate on the same theme, replace individual components, and investigate problems.'
    },
    solution: [
      ['Why the workflow needs stage states', 'Configuration, theme, copy, compliance, images, video, and export depend on one another. A flat result list makes it difficult to see what is confirmed or needs to be repeated. The stage model makes dependencies explicit, while requiring repeated saves of identical configuration to preserve existing confirmations. An action with no substantive change should not invalidate the whole workflow.'],
      ['Why tasks, runs, and artifacts are stored separately', 'A task may invoke a model repeatedly, and one invocation can produce several candidates. The task describes the objective, the generation run records an execution, and the artifact records its output. Their separation preserves accurate context for regeneration, candidate selection, diagnosis, and references between stages, rather than retaining only the last overwritten file.'],
      ['How model generation and deterministic production are balanced', 'Models generate text and visuals; FFmpeg performs explicitly defined composition and rendering. These are separate responsibilities. Models may change, but timelines, asset ownership, and export must be repeatable. Providers connect through ports so text, image, speech, and video capabilities can be configured independently without binding the whole product to one fixed interface.'],
      ['Why media transfer needs to be managed', 'An external video model may be unable to read asset URLs protected by login. The project provides a controlled media relay: once permission and authorization requirements are met, specified assets are made available for that request, rather than exposing the entire asset directory. User preview access and model access must be treated as different relationships.']
    ],
    dataNotes: [
      'Content tasks form the backbone, with stages, generation runs, and artifacts organized around them. Video projects also retain revisions and project assets. This separates business state from specific media files: replacing an asset does not require rebuilding the task, and project edits can retain the preceding revision.',
      'Artifacts belong to tasks and may also reference a generation run. Because that foreign key is nullable, manually imported or externally sourced assets must not be falsely described as model output. Knowledge resources have their own versions and chunks. The diagram concentrates on creative delivery relationships and omits the full network of authorization, auditing, and resource library tables.'
    ],
    er: [
      ['content_tasks', 'id', 'task_stages', 'task_id', 'Task contains creative stages'],
      ['content_tasks', 'id', 'generation_runs', 'task_id', 'Task retains generation runs'],
      ['content_tasks', 'id', 'artifacts', 'task_id', 'Task groups content artifacts'],
      ['generation_runs', 'id', 'artifacts', 'generation_run_id (nullable)', 'Artifact has an optional generation source'],
      ['video_projects', 'id', 'video_project_revisions', 'project_id', 'Video project retains revisions'],
      ['video_projects', 'id', 'project_assets', 'project_id', 'Project manages its assets']
    ],
    acceptance: [
      ['Stages and modes', 'Full mode presents the correct stage order; other modes show only applicable steps.', 'Tests cover the seven-stage order and compatibility with earlier stages.'],
      ['Repeated saves', 'Saving identical configuration again must not invalidate confirmed content without reason.', 'An idempotent workflow update test exists.'],
      ['Assets and versions', 'References point to the correct artifacts after replacement, regeneration, and project revisions.', 'Test files cover candidate replacement, video projects, and revisions.'],
      ['Audiovisual consistency', 'Voiceover, subtitles, visuals, and duration match the current project without mixing old versions.', 'Tests cover speech and subtitle consistency, video composition, and minimum duration.'],
      ['Real models and export', 'Verify actual generation availability, persistent media storage, and final output quality.', 'Acceptance still requires target models, networks, and business samples; mock tests cannot replace it.']
    ],
    delivery: [
      'The content and meeting services deploy independently, each with its own database, object directory, migrations, and model configuration. Enterprise sources and real providers connect through adapters. Offline tests use deterministic implementations; failed production calls should show explicit errors. Deployment requires checking available capabilities, material sources, external transfer scope, and media reachability, beyond entering a text model URL.',
      'Acceptance should follow one complete work from source confirmation to export download, then add a partial edit and a failed-call retry. Check particularly whether changes to copy leave voiceover, subtitles, and video consistent, and whether temporary provider files have been persisted. This verifies continuous use rather than isolated screenshots of successful generation endpoints.'
    ],
    value: [
      'The product shifts human effort from moving assets between tools to confirming content and refining expression. Unified tasks, manageable artifacts, and explicit stages make it easier for collaborators to discuss the current work and retain evidence for reuse and revision.',
      'My experience is that the difficulty of multimodal products extends beyond models into how generated results are used. Further investment should focus on dependency notices, partial editing, export consistency, and asset reuse. Value should be assessed through actual rework and delivery, rather than unmeasured efficiency figures.'
    ]
  },
  'erp-automation': {
    summary: 'A local automation tool for ecommerce product operations: align information, images, and SKUs first, then manage ERP creation and store listings as tasks that can be checked and retried.',
    positioning: [
      'Product listing may look like filling forms and clicking buttons, but involves several dependencies: complete information, matching styles and SKUs, images assigned to the correct variants, platform attributes, and prices for different stores. In batch processing, verification and rework often take more effort than the final publish action.',
      'The ERP Product Listing tool serves operators handling repetitive product work. It combines source reading, image scanning, preview, ERP creation, store publication, and result review in a local web interface. Product information can come from Feishu Bitable, with Excel / CSV as fallback sources; local directories supply product images. Operators review first, the system executes, and results are retained by product and SKU.',
      'The current approach uses Playwright to control visible Chrome / Edge windows through the ERP website, rather than the Jushuitan Open Platform API. Visible execution supports human handling of login, verification codes, and page exceptions, but site changes can also affect automation. Verified documentation describes Pinduoduo and Douyin listing flows. Other platforms require separate confirmation and cannot be inferred from an archive filename.'
    ],
    roles: [
      ['Product information maintainer', 'Prepare codes, variants, prices, and images', 'Keep information mappable and traceable, avoiding field-by-field guesswork during execution.'],
      ['Listing operator', 'Review previews, select platforms and stores, and execute tasks', 'Know each task’s target, input, progress, and failures so retries can be focused.'],
      ['Tool maintainer', 'Handle page changes, upgrades, and diagnosis', 'Locate problems using logs, screenshots, and database records while protecting existing business data.']
    ],
    modules: [
      ['Product data intake', 'Bring scattered information into one preview', 'The tool reads Feishu Bitable and retains local spreadsheet sources. Codes, names, variants, prices, stock, and categories enter a standardized product structure with source and warning information. The interface distinguishes receiving a file from having data ready for listing, giving operators a chance to find incomplete information before execution.'],
      ['Image scanning and variant matching', 'Reduce mismatches between images and products', 'Local images are classified by directories and rules into main images, detail images, white-background images, and variant assets. Import methods control whether variants share an image set. Preview confirms image-to-product relationships, particularly preventing misuse of a main image when assets are shared across variants. Image rules are part of the business input and must be reviewed with product information.'],
      ['ERP product creation', 'Execute automation on human-confirmed input', 'The system reuses login state in an isolated browser session and handles category, supplier, variants, pricing, stock, and images on ERP pages. Login and verification codes remain human actions; closing a window does not indicate success. Creation results must return to the local task before deciding which products can proceed to listing.'],
      ['Platform and store listings', 'Retain differences between destinations within one batch', 'Once operators select a platform and target stores, the system organizes listing according to platform rules. Existing documentation covers differences including Pinduoduo attribute forms and combined pricing, plus Douyin manufacturer information and inventory deduction methods. One product can have records for several stores, so a single “listed” flag on the product is insufficient.'],
      ['Scheduling and failure retries', 'Give batch operations an explicit recovery scope', 'Import, publishing, and scheduling each retain status and details. Execution shows counts and item-level results. Retries should target failed or unprocessed items while preserving key inputs from the original task, avoiding recalculated prices or other changes. Failure screenshots and diagnostics help distinguish data, page, and session issues.'],
      ['Local database and offline delivery', 'Support continued use and migration', 'MySQL stores products, SKUs, assets, batches, tasks, and listing records. The project distinguishes full migration from upgrades. Upgrades address schema changes, backups, and recovery, avoiding direct replacement of the user’s data with development data. Installability, upgradability, and recoverability are also part of the tool’s value.']
    ],
    scenario: {
      title: 'Typical scenario: publish a batch of products with multiple variants to target stores',
      intro: 'This flow explains how operators move from preparation to result confirmation. No actual listing was performed during this analysis.',
      steps: [
        ['Prepare information and assets', 'Maintain product codes, variants, and price sources, and select the image root directory and rules. Consistent identification reduces later reliance on approximate name matching.'],
        ['Scan and review the preview', 'Check each product’s SKUs, images, categories, and warnings. Complete missing information first. This is a key checkpoint for preventing batch errors from reaching the target platform.'],
        ['Create ERP products', 'Confirm the login session, run the import, and monitor item-level results. Only successful products proceed to the relevant next step; failed items retain reasons and diagnostic context.'],
        ['Configure platforms and stores', 'Select the target platform, stores, and batch attribute rules, then confirm pricing and stock strategies. Multi-store tasks retain a result for every destination, rather than just one total.'],
        ['Execute, verify, and retry', 'After listing, review successful, failed, and unprocessed items. Diagnose exceptions before retrying within the task scope. Finally review store listing records and external product identifiers.']
      ],
      result: 'Operators receive task records with input snapshots, target stores, and item-level states, explaining what completed, what needs more information, and what should be executed again.'
    },
    solution: [
      ['Why preview comes before execution', 'Faster automation can also spread input errors faster. Organizing Feishu / spreadsheet information and images into a reviewable structure before browser execution moves data problems earlier. FastAPI endpoints, standardized product models, and preview screens form this boundary, so operators can identify omissions before platform submission fails.'],
      ['Why products and listing records are separate', 'A product is internal information, while a listing is its external representation in a particular store. Products can be reused across destinations, but store titles, external IDs, publication prices, and states may differ. Separate products, product_skus, listings, and listing_skus models establish clear mappings between internal and platform variants.'],
      ['How retries preserve business meaning', 'Task details retain inputs, results, and states, and price rules must stay consistent within a batch. Recalculating a random markup or switching to changed source data during a retry would actually submit different product data. Tests for task persistence, SKU scope, and interrupted unprocessed items protect this continuity.'],
      ['How browser automation uncertainty is handled', 'Webpages may show popups, expire sessions, or change layout, so execution must save failure context for maintainers. A success state in the database should correspond to an actual result, not simply the absence of a script exception. Long-term maintenance also needs updated selectors and flow verification when target platform pages change.']
    ],
    dataNotes: [
      'Internal products and SKUs form the information domain; platforms and stores form the destination domain; publishing tasks and details form the execution domain; listing records connect internal products with store products. These separately answer what the source information is, where it should go, how far execution has progressed, and what record the platform created.',
      'SKU code uniqueness is scoped to each product, preventing interference when codes are reused by different products. Money uses the smallest currency unit. External store product identifiers have their own uniqueness constraints. The diagram includes only declared foreign keys; product-code snapshots in task details are not shown as nonexistent foreign keys.'
    ],
    er: [
      ['products', 'id', 'product_skus', 'product_id', 'Product contains internal variants'],
      ['platforms', 'id', 'stores', 'platform_id', 'Platform contains stores'],
      ['stores', 'id', 'listings', 'store_id', 'Store retains listing records'],
      ['products', 'id', 'listings', 'product_id', 'Product can be listed at multiple destinations'],
      ['listings', 'id', 'listing_skus', 'listing_id', 'Listing contains platform variants'],
      ['product_skus', 'id', 'listing_skus', 'product_sku_id', 'Platform variant maps to an internal variant'],
      ['publish_jobs', 'id', 'publish_job_items', 'job_id', 'Publishing task retains item-level results']
    ],
    acceptance: [
      ['Input and preview', 'Codes, variants, images, and prices can be checked item by item, with clear notices for missing information.', 'Test files cover data sources, assets, and interfaces.'],
      ['SKU isolation', 'Identical SKU codes under different products do not overwrite each other.', 'Tests cover product-scoped uniqueness and migration.'],
      ['Task interruption', 'Restarting preserves history and unfinished items, and retries retain key inputs.', 'Tests cover persistence, restart, and retry scope.'],
      ['Scheduling and cancellation', 'Immediate and delayed steps have a defined order, with explainable expiration and cancellation.', 'Tests cover scheduling order, expired tasks, and cancellation boundaries.'],
      ['Real listings and upgrades', 'Verify target store results, retain business data after upgrades, and support recovery from failure.', 'Requires acceptance in an authorized business environment; no listing or database upgrade was performed during this analysis.']
    ],
    delivery: [
      'The tool is delivered for a local Windows business environment, including a web service, browser execution, and a separate database. Moving to another computer requires fresh login, authorization, and asset directory setup; copying source code alone does not make environment settings valid. Full migration packages and routine upgrade packages have different purposes, and delivery staff must clarify which data each contains.',
      'Before deployment, start with a few representative products covering single and multiple variants, combined pricing, missing images, and failure retries, then increase batch size gradually. Acceptance should compare local records with target platform pages, rather than relying only on a success total. Each platform needs its own capability checklist and validation examples.'
    ],
    value: [
      'The project turns repetitive operations into manageable batches and gives operators and maintainers a shared record. Operators know which information to supply; maintainers know where failure occurred; the database retains relationships between products and platform results. Its value extends beyond reducing mouse clicks to making batch work inspectable.',
      'Next priorities are clearer preview errors, richer failure classifications, and continued maintenance of platform rules and regression examples. Actual time savings require measurement on real business batches. This article first explains the process and data relationships that can support reliable work.'
    ]
  },
  'qianchuan': {
    summary: 'A local workspace for ecommerce advertising operations: organize authorized accounts, product assets, and advertising plans in one context, retaining records of results and exceptions.',
    positioning: [
      'In advertising work involving several accounts and products, preparation is often more complex than creating a single plan. Operators need to check valid authorization, relationships between stores and advertising accounts, uploaded assets, product-to-asset mappings, and progress from the previous run. When these states are scattered across spreadsheets, browsers, and script output, repeated work and omissions are hard to trace.',
      'The Qianchuan Advertising Manager organizes these activities in a local workspace. Flask interfaces connect to the open platform, bringing authorization, asset preparation, mapping, plan execution, and logs into one context. It focuses on frequently repeated business paths, helping operators see which account is active, which inputs are ready, and which results were obtained, rather than reimplementing every feature of the advertising platform.',
      'Creating a plan and earning advertising returns are different outcomes. Budget, target ROI, and actual performance depend on business strategy, asset quality, products, and platform mechanisms. The project provides configuration and calling capabilities, but should not be described as an automatic profit system. This article includes no unverified return or production stability figures.'
    ],
    roles: [
      ['Advertising operator', 'Select accounts, prepare advertising inputs, and review execution results', 'Reduce mistakes caused by switching account and asset contexts.'],
      ['Asset maintainer', 'Organize style assets, upload them, and maintain mappings', 'Know what is available, what failed, and the status of the same asset in each account.'],
      ['Business / engineering maintainer', 'Handle authorization, platform errors, and task recovery', 'Diagnose using saved plans, logs, and reports instead of rerunning everything to guess the cause.']
    ],
    modules: [
      ['Authorization and advertising accounts', 'Send requests to the correct business target', 'The tool includes OAuth authorization, account selection, labels, information refresh, and token updates. Authorization records and advertising account associations are stored separately, allowing one authorization to cover multiple accounts. The selected account in the interface, account in the business request, and backend authorization must agree because they determine subsequent product reads and plan operations.'],
      ['Store and product information', 'Establish context for assets and plans', 'The code provides access to stores, advertising accounts, eligible products, and related authorization information. These identify products available to the current account instead of asking users to infer platform IDs from local names. Account changes must refresh the available scope; results from the previous account must not continue into submissions.'],
      ['Asset scanning and upload workspace', 'Turn local files into manageable advertising assets', 'The asset module covers scanning, target accounts, upload, stop, state repair, completion, and logs. An asset includes its style assignment and per-account upload state as well as a local path. Partial failures in a batch must be individually visible so mostly successful uploads do not hide an asset gap in one account.'],
      ['Product and asset mapping', 'Reduce invalid combinations before creation', 'The project includes style-to-product mapping and asset queue logic to combine information, product IDs, and usable assets as advertising inputs. Mapping accuracy determines whether a request is meaningful. Operators must review insufficient input or ambiguous relationships rather than making arbitrary matches to meet a count.'],
      ['Plan execution and incremental processing', 'Organize repeated advertising actions into stateful runs', 'The code includes running, incremental start, stopping, and creation / update payload construction. Budgets, ROI targets, and assets form request parameters; plan status and logs are saved locally. Product descriptions should distinguish request submission, platform acceptance, and actual advertising performance instead of combining them in one completion message.'],
      ['Status, logs, and reports', 'Make problems reviewable', 'SQLite separately stores asset status, upload accounts, advertising plans, logs, and reports. Read throttling reduces frequent duplicate requests. After an exception, maintainers can review the run’s inputs and results rather than relying only on the last terminal line. These records support recovery and diagnosis, but dedicated tests are still needed to verify consistency under failures.']
    ],
    scenario: {
      title: 'Typical scenario: prepare assets for a product batch and start advertising processing',
      intro: 'This usage flow is based on code responsibilities. Authorized business operators should confirm actual budgets and advertising actions. No business account was accessed and no advertising was initiated during this analysis.',
      steps: [
        ['Confirm authorization and account', 'Select the target, read valid account information, and resolve expired authorization. Confirm the scope before reading products and assets to avoid mixing accounts.'],
        ['Prepare and upload assets', 'Scan style assets, select upload destinations, and inspect each account’s status. Diagnose failures before uploading missing items or adjusting inputs, while retaining successful asset records.'],
        ['Review mappings and parameters', 'Map products, styles, and assets, then check budgets and targets. Resolve ambiguous product information before batch execution.'],
        ['Execute and track results', 'Build platform requests from the current configuration and record created or updated plan IDs and run results. Stops and platform errors must appear in statuses and logs.'],
        ['Review and prepare the next run', 'Use plans, assets, and reports to decide the scope of subsequent work. Before an incremental run, confirm that old records still match the current account.']
      ],
      result: 'The flow aims to help operators answer three questions: which target was acted on, which inputs were used, and which results were recorded. Those answers provide a reliable starting point for maintenance.'
    },
    solution: [
      ['Why the workspace uses local Flask', 'Python organizes platform calls and business rules, Flask exposes them through a local web interface, and Requests handles external calls. For a tool built around fixed operations, this structure presents accounts, assets, and running states together. It remains a specific business tool and should not be equated with a large-scale multi-user SaaS architecture.'],
      ['Why account associations are stored separately', 'Authorization credentials and advertising accounts do not have a fixed one-to-one relationship. tokens stores authorizations, while token_qc_accounts stores associated accounts and types through an explicit foreign key. This supports multiple accounts per authorization and separates credential lifecycle from business account selection. Authorization refresh failures and account switching particularly need independent validation.'],
      ['Why SQLite persistence is needed', 'If asset progress and plans existed only in memory, it would be difficult to know what completed after program exit. The data layer uses SQLite with WAL and separately saves plans, assets, and logs. This improves traceability, but a database schema alone cannot demonstrate fully reliable concurrency or failure recovery.'],
      ['Why automatic execution is only part of the story', 'Batch capabilities must also explain failure, stop, and retry behavior. The code has foundations for read throttling, deduplication, and status storage, but still needs tests for duplicate creation after platform timeouts, writes after stopping, and authorization changes affecting old tasks. Clear, tested boundaries matter more than increasing the size of a run.']
    ],
    dataNotes: [
      'The data layer mainly covers authorization relationships, asset states, advertising plans, logs, and reports. tokens and token_qc_accounts have an explicit foreign key. Other tables rely more on business identifiers and JSON state. Similar field names must not be mistaken for declared database foreign keys.',
      'The article therefore separates the relationship diagram from data object descriptions. The diagram shows the explicit authorization relationship; the table below explains independent business tables. This explains what the system stores without presenting conceptual relationships as enforced constraints.'
    ],
    er: [['tokens', 'id', 'token_qc_accounts', 'token_id', 'One authorization links to multiple advertising accounts']],
    dataObjects: [
      ['gallery_models', 'Style and asset states', 'Stores asset models, style identifiers, and state information.'],
      ['gallery_upload_accounts', 'Asset upload records by account', 'Distinguishes processing states for the same style across advertising accounts.'],
      ['auto_delivery_plans', 'Advertising plan states', 'Stores advertising accounts, products, ad identifiers, and run context.'],
      ['gallery_logs / auto_delivery_logs', 'Processing logs', 'Records asset and advertising processes separately to support investigation.'],
      ['auto_delivery_reports', 'Run reports', 'Stores report type, creation time, and result data.']
    ],
    acceptance: [
      ['Authorization refresh and account switching', 'Expired authorization has clear feedback, and switching accounts does not reuse old products or assets.', 'Automated cases are recommended; relevant interfaces and storage structures have been checked.'],
      ['Duplicate assets and partial failures', 'Repeated scans recognize existing states, and partial upload failures can be located by account and asset.', 'Regression cases for deduplication, missing uploads, and stopping are recommended.'],
      ['Platform rate limits and timeouts', 'Errors are identifiable and retries bounded, avoiding blind duplicate creation when the result is unknown.', 'Requires simulated platform failures and verification in an authorized environment.'],
      ['Process restart and recovery', 'Existing plans and logs remain readable, and subsequent work does not incorrectly overwrite history.', 'Persistence has been confirmed; recovery behavior still needs dedicated tests.'],
      ['Actual business performance', 'Distinguish API execution results from advertising performance, and assess performance using business definitions.', 'No live advertising trial was performed; no revenue or ROI improvement is reported.']
    ],
    delivery: [
      'The supplied archive includes business interfaces, asset handling, and persistence code, but no separate automated test suite was located. It is therefore better described as a local tool with specific business capabilities than a comprehensively tested production platform. The delivery plan should explicitly address this gap.',
      'First build simulated interface tests that do not trigger real advertising, covering authorization, error responses, state storage, and stopping. Business staff can then verify the complete flow with a small dataset in an authorized environment. Confirm accounts, budgets, and targets before real actions, and include backups and recovery in the handover.'
    ],
    value: [
      'The tool brings together context across accounts, products, assets, and plans so operators rely less on memory and maintainers can locate problems in records. It provides organization for repetitive operations rather than promising advertising returns.',
      'For me, the most valuable next steps are completing tests, refining run states, and defining recovery scope after failure. Handling authorization changes, repeated execution, and partial failure clearly is what can turn batch execution into a dependable everyday product beyond a script that ran successfully once.'
    ]
  }
});

window.projectDetailsEn['elderly-android'] = {
  summary: 'An Android care assistant built with Kotlin and Jetpack Compose, connecting everyday voice interaction, reminders, health records, and family access. Its client and backend are separate from the HarmonyOS edition.',
  positioning: [
    'The Android edition of Silver Guardian starts with a direct question: older adults already use phones, so can that device make expressing needs, recording information, and contacting family easier? When capabilities are hidden across different apps, users must remember navigation paths and repeatedly explain their circumstances. This project brings conversation, health, reminders, and family access into one Android app, with a Python service handling cross-device data and AI processing.',
    'The app uses Kotlin, Jetpack Compose, and Material 3, with chat, reminders, profiles, family mode, and family health screens. The phone integrates speech, step counting, location, and sensors; the backend uses FastAPI, SQLite, and WebSocket. It focuses on Android device capabilities and mobile interaction. The HarmonyOS edition’s ArkTS client, Spring Boot core service, and PostgreSQL family model do not apply to this implementation.',
    'The project is currently best described as a mobile care product implementation. Features and interfaces in source code do not demonstrate completed validation across every device, background restriction, or real care scenario. Health advice is supporting information, while fall-related capabilities are sensor anomaly notices. Phone impact thresholds must not be presented as medically validated or certified against real fall samples.'
  ],
  roles: [
    ['Older adult user', 'Communicate by text / voice, record health information, and manage reminders', 'Complete frequent actions from a unified entry point and understand whether an operation actually took effect.'],
    ['Family user', 'View health, reminder, location, and other information for an associated older adult', 'Distinguish current data from cached history and understand the latest update time and access scope.'],
    ['Developer / maintainer', 'Configure speech, models, and backend services, and handle device differences', 'Investigate device permissions, networks, background lifecycle, and server states together.']
  ],
  modules: [
    ['Voice and chat', 'Make requests fit familiar phone interactions', 'The chat screen accepts text and voice. The project includes integration classes for iFlytek dictation, offline dictation, and wake-word handling, while the backend Agent uses a model for conversation. Wake-word detection, recognition, and the final business action are consecutive but distinct: hearing a wake word does not mean understanding the request, and recognizing text does not mean completing the operation. Prompts must accurately describe the current stage.'],
    ['Health records and trends', 'Keep records locally while making them available to family', 'The app provides health data and chart components. A local repository stores records by older adult identifier and sends them to the server through synchronization interfaces. Client-unique identifiers and timing information help avoid duplicate synchronization and distinguish records from different dates. Vital-sign charts and activity suggestions assist understanding and do not replace professional judgment.'],
    ['Daily reminders and notifications', 'Connect reminders to actual phone execution', 'Reminder screens, alarm scheduling, and receivers handle local reminders; the backend retains a reminder mirror for cross-device access. Local reminders and remote mirrors must be distinguished: a saved mirror does not mean Android has the required permissions or can notify on time in every background state. Delivery requires verification on devices.'],
    ['Family mode and location', 'Make the source of displayed data clear', 'Family interfaces resolve the older adult scope through association tokens. Location queries combine WebSocket requests with SQLite caching. If a live request does not return promptly, cached data may be read instead. Screens must distinguish new and historical positions and show their update times. A visible coordinate does not mean the older adult’s phone has just obtained a fresh location.'],
    ['Activity information and AI advice', 'Organize separate data into understandable information', 'Step counts and activity summaries join profiles and health records as inputs for suggestions. The backend includes DeepSeek calls returning structured advice. Missing inputs, denied permissions, and model failures require distinct feedback. Estimates must not be described as device measurements, and generated suggestions must not be presented as care actions already performed.'],
    ['Impact detection and anomaly reports', 'Explore phone sensors for care notifications', 'An Android foreground service prefers the linear acceleration sensor, falls back to the accelerometer, and uses a threshold and cooldown period to detect strong impacts. The triggered flow includes notifications, SMS to emergency contacts, and reporting logic. This demonstrates an anomaly detection flow, but setting down or dropping a phone may also trigger it. False positives, missed events, and how the device is carried still need validation.']
  ],
  scenario: {
    title: 'Typical scenario: an older adult records health information and a family member views it remotely',
    intro: 'Health record synchronization illustrates the responsibilities of local storage and the backend, without assuming that two phones automatically share state.',
    steps: [
      ['Enter a health record', 'Save a record under the appropriate identity, including type, value, and time. The app first persists it locally by older adult identifier so navigation does not discard it.'],
      ['Prepare synchronization data', 'The client sends the record with its unique identifier, date, and timestamp. The server uses these to save or update the corresponding data, recognizing repeated submissions as the same record.'],
      ['Organize backend data by subject', 'Records belong to an older adult through elder_id. Activity summaries and reminder mirrors have their own structures. Different objects need consistent ownership, without forcing them into one kind of list.'],
      ['Family access and interpretation', 'Family members view data within their associated scope. Screens should explain record time and current status so an older entry is not mistaken for a real-time measurement.'],
      ['Handle failure and view again', 'Unavailable networks or expired associations should produce explainable feedback, with synchronization or reading repeated after recovery. This needs real-device validation; a successful server response alone does not establish completion.']
    ],
    result: 'The flow separates entry, storage, synchronization, and viewing, showing why mobile care products must address offline states, identifier consistency, and data freshness together.'
  },
  solution: [
    ['Why Compose and ViewModel are used', 'Compose declares screens, ViewModel holds application state, and repositories handle local storage. Navigation connects chat, reminders, and family screens, establishing a basic division between UI, state, and data. This is a native Android technology choice separate from the HarmonyOS edition; device services and permission lifecycles must follow Android rules.'],
    ['Why data is kept locally and on the server', 'Health records are first saved in SharedPreferences on the phone, while server-side SQLite stores synchronized records and other product states. Local persistence supports continuity in everyday use; the backend supports family access. The two are not automatically consistent, making client identifiers, timing, and repeated synchronization explicit design and testing concerns.'],
    ['Why location uses WebSocket and caching', 'A fresh location request must reach the older adult’s device; reading the database alone cannot guarantee a new position. The project communicates through WebSocket and can fall back to persistent cache after a timeout. This increases the chance of returning useful information but requires visible cache timestamps. Connection state currently depends on process memory, so arbitrary multi-process or multi-machine scaling cannot be assumed.'],
    ['Why device services need separate acceptance', 'Wake-word detection, reminders, location, and impact detection depend on permissions, background restrictions, SDK resources, and hardware differences. Service classes are only a starting point. Behavior must also be checked under lock screen, restart, network changes, and permission denial. Android and HarmonyOS validation cannot substitute for one another.']
  ],
  dataNotes: [
    'Android business relationships center on elder_id. Synchronized health records use (elder_id, client_uid) as a primary key, while activity summaries use (elder_id, date_key). Reminder mirrors and location caches represent a current state per older adult. Historical records and state snapshots serve different purposes and should not use the same overwrite policy.',
    'The diagram shows logical relationships. The verified SQLite table definitions do not declare physical foreign keys between these objects, and some data resides in separate database files. Lines indicate relationships organized in code through the older adult identifier; they do not imply enforced referential integrity or reuse of the HarmonyOS family entity structure.'
  ],
  logicalER: true,
  er: [
    ['elder_profile', 'elder_id', 'synced_health_records', 'elder_id', 'Logical 1:N · Health records'],
    ['elder_profile', 'elder_id', 'activity_daily', 'elder_id', 'Logical 1:N · Daily activity'],
    ['elder_profile', 'elder_id', 'health_alerts', 'elder_id', 'Logical 1:N · Anomaly records'],
    ['elder_profile', 'elder_id', 'reminders_mirror', 'elder_id', 'Logical 1:1 · Reminder snapshot'],
    ['elder_profile', 'elder_id', 'elder_location_cache', 'elder_id', 'Logical 1:1 · Latest location']
  ],
  acceptance: [
    ['Voice interaction', 'Wake-word detection, dictation, and chat each provide clear feedback, with an explanation when an SDK is unavailable.', 'Integration exists; validation requires target devices, authorization, and speech resources.'],
    ['Records and synchronization', 'Repeated synchronization creates no duplicate business entries, and different older adults’ data stays separate.', 'Composite keys and synchronization code exist; business regression tests are still needed.'],
    ['Location freshness', 'Distinguish live results, request failure, and cached fallback, showing update times for historical positions.', 'WebSocket and caching exist; offline, disconnection, and timeout tests are needed.'],
    ['Background reminders and services', 'Check lock screen, restart, and denied-permission behavior without depending on an open foreground screen.', 'Requires tests across real Android devices and OS versions.'],
    ['Impact detection and anomaly reports', 'Verify ordinary movement, phone drops, cooldown, and notifications without equating a threshold trigger with an actual fall.', 'The current implementation uses thresholds; no evidence of real fall recognition quality was provided.'],
    ['Automated coverage', 'Core flows need dedicated business tests rather than template tests.', 'The located ExampleUnitTest is an arithmetic template and does not demonstrate completed product validation.']
  ],
  delivery: [
    'The Android edition consists of an Android project and Python backend. Speech also depends on the relevant SDK, authorization, and resources. Delivery must verify application builds, permissions, service connections, and actual speech resources separately. This article did not run a build, connect to an existing business database, or trigger SMS, location, or anomaly reporting.',
    'Compared with the HarmonyOS edition, the Android version currently centers more directly on local phone capabilities and a lightweight backend. Both share a care theme, but their feature boundaries, data structures, and test evidence are independent. Next priorities are a device test checklist, synchronization and family access cases, then background reliability and release configuration.'
  ],
  value: [
    'The project connects native mobile development, voice interaction, device services, and backend data in a care scenario. It made clear to me that a simple “view” or “remind” action on a screen may cross permissions, networks, local records, and background services.',
    'Further improvements should express every state accurately: older locations need timestamps, failed synchronization needs retry, and strong-impact notices need to distinguish accidental triggers. Making existing flows clear and verifiable is more useful for real use than adding further entry points.'
  ]
};
