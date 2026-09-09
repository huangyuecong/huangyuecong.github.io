/* 按已核对的模型、架构文档和代码补充；示例均为解释性摘录或伪代码。 */
window.projectTechnical = {
 'silver-guardian': {
  topics:[['事务边界与 Outbox','Core 使用模块化单体，在同一业务事务内组织确定性更新；跨模块异步协作采用 Transactional Outbox。这样把“业务已写入”和“后续事件待投递”放在可追踪的状态里。Outbox 仍需要投递、去重和监控配套，不等于天然保证所有消费者只处理一次。'],['Agent 的执行上下文','模型选择工具之后，还要携带用户身份与权限上下文，完成能力检查和必要确认，再通过网关执行。核心数据库不开放给模型直接写入。需要验证的异常包括审计不可用、用户取消和模型超时，不能只覆盖成功路径。'],['约束与撤销','家庭成员以 (family_id, user_id) 做唯一约束，重复关联不能无限增加。关系撤销后，后续请求应重新依据服务端状态判断，而不是继续信任客户端缓存的角色。']],
  code:{language:'SQL',label:'已核对约束的简化摘录 · 不是完整迁移脚本',text:'UNIQUE (family_id, user_id)\nFOREIGN KEY (family_id) REFERENCES family.families(id)\nFOREIGN KEY (user_id) REFERENCES identity.users(id)'},
  checks:['重复关联同一家庭与用户。','用户撤销授权后再次请求工具。','业务保存成功但事件投递暂时失败。']
 },
 'meeting-agent': {
  topics:[['长任务：租约与结果围栏','会议试点架构用持久任务、租约和心跳跟踪执行。任务超时后允许恢复，但旧 Worker 可能仍在运行，因此写入结果时还需要确认当前执行资格。任务消息只引用实体与对象键，不把录音正文放进队列。'],['不可变转写运行','重新转写创建新的 TranscriptionRun，保留旧片段与人工修订，由会议指向当前生效运行。纪要版本通过来源记录关联转写片段，避免新识别结果悄悄改变旧纪要的依据。'],['Provider 只转换输入输出','ASR 与会议 AI Provider 接收强类型输入并返回结果，事务、确认与审计留在应用层。厂商接入变化因此不必改变纪要权限和版本规则。Mock 流程可以验证协议，但语音效果仍需真实样本。']],
  code:{language:'伪代码',label:'任务恢复思路 · 非项目原始代码',text:'job = claim_with_lease(job_id)\nresult = provider.process(job.input_reference)\nif still_owns_lease(job.id, job.lease_version):\n    persist_result_and_status(result)\nelse:\n    discard_stale_worker_result()'},
  checks:['旧 Worker 与恢复 Worker 同时返回。','重新转写后旧纪要仍可追溯。','人工取消时模型请求尚未返回。']
 },
 'content-agent': {
  topics:[['任务、运行与产物的分层','content_tasks 保存目标与阶段，generation_runs 保存一次生成的执行信息，artifacts 保存候选及版本。Artifact 的 generation_run_id 可空，因此导入或其他来源不必被伪装成模型生成。'],['修改传播与无效化','上游配置变化可能影响已确认的文案、配音和字幕。但重复保存相同配置不应触发整条链路失效。测试中已经针对无实际变化的提交检查工作流状态，说明幂等更新也是用户体验的一部分。'],['视频工程与外部资源','视频工程修订与素材关联保存，FFmpeg 负责确定性合成。模型返回临时文件时需要转存；浏览器可以打开的受保护地址，不代表外部模型也能读取，媒体传递需要独立的受控通道。']],
  code:{language:'数据关系',label:'实际模型关系的阅读摘录',text:'content_tasks.id → generation_runs.task_id\ncontent_tasks.id → artifacts.task_id\ngeneration_runs.id → artifacts.generation_run_id (nullable)\nvideo_projects.id → video_project_revisions.project_id'},
  checks:['相同配置重复保存。','替换文案后旧字幕是否仍被误用。','外部素材地址过期但本地转存仍可读取。']
 },
 'erp-automation': {
  topics:[['内部 SKU 与平台 SKU 分开','product_skus 以商品范围限制 sku_code，listing_skus 将内部规格映射到具体上架记录。这样同一内部商品可以发布到多个店铺，各店铺的外部标识和发布价格不会混在一个字段里。'],['价格与任务快照','金额用最小货币单位保存，避免让浮点近似成为业务金额的来源。批次中的规则和已生成价格需要保持稳定，失败重试不应重新生成不同随机加价。输入发生变化时应明确是一轮新处理。'],['恢复粒度到任务明细','publish_job_items 保存逐项输入、状态和返回数据。重启后可识别未完成部分，失败截图补充浏览器现场。网页操作成功不能只通过“脚本没有报错”判断，还需对应实际平台结果。']],
  code:{language:'SQL',label:'已核对字段与约束的简化摘录',text:'base_price_minor BIGINT UNSIGNED NOT NULL\nUNIQUE (product_id, sku_code)\nUNIQUE (listing_id, product_sku_id)\nFOREIGN KEY (job_id) REFERENCES publish_jobs(id)'},
  checks:['不同商品复用同一个 SKU 编码。','重试前价格源已发生变化。','浏览器提交成功但本地响应丢失。']
 },
 'qianchuan': {
  topics:[['授权与账号不是同一个实体','tokens 管理授权，token_qc_accounts 通过外键记录关联广告账号和类型。一个授权可对应多个账号，因此切换工作对象时需要同步更新商品与素材范围，不能继续沿用上一账号的页面结果。'],['WAL 与持久化边界','SQLite 连接启用 WAL，素材、计划、日志和报告分别保存。WAL 是访问模式的一部分，不是高并发或异常恢复已经通过的证明；结果未知、重复提交和多线程写入仍需单独验证。'],['批量执行的失败分类','当前代码包含读取节流、素材去重和运行状态记录。建议后续把授权失效、限流、业务校验失败与结果未知分开处理，针对不同错误决定停止、等待或核对。这属于改进建议，不冒充现有完整机制。']],
  code:{language:'SQL',label:'实际建表中的授权关系摘录',text:'PRIMARY KEY (token_id, advertiser_id, account_type)\nFOREIGN KEY (token_id) REFERENCES tokens(id)\n    ON DELETE CASCADE'},
  checks:['授权刷新后继续选择原广告账号。','平台超时后查询是否已创建。','中断后重新读取计划与素材状态。']
 },
 'elderly-android': {
  topics:[['本机记录与同步键','HealthLocalRepository 按老人标识在 SharedPreferences 中保存记录。服务端 synced_health_records 使用 (elder_id, client_uid) 组合主键，提供重复同步时识别同一记录的依据；这不等于所有冲突策略已经完备。'],['位置请求与缓存回读','WebSocket 连接到老人设备，实时请求超时后可回读 SQLite 位置缓存。缓存携带更新时间，展示应区分实时与历史。当前连接映射依赖进程内存，多 Worker 或多机需要进一步处理路由与共享状态。'],['设备行为与算法边界','冲击检测使用线性加速度优先、加速度计回退的阈值规则，并设有冷却时间。它是设备事件启发式检测，不是训练好的跌倒分类模型；必须用日常动作、携带方式和真实机型验证误报与后台行为。']],
  code:{language:'SQL',label:'已核对主键摘录 · 不存在跨库物理外键',text:'synced_health_records:\n    PRIMARY KEY (elder_id, client_uid)\nactivity_daily:\n    PRIMARY KEY (elder_id, date_key)\nelder_location_cache:\n    elder_id TEXT PRIMARY KEY'},
  checks:['重复提交同一条本机健康记录。','WebSocket 断线后显示缓存更新时间。','锁屏、拒绝权限或重启后的服务行为。']
 }
};
