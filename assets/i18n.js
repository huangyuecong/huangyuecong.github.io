/* Explicit, reversible UI translations; article translations are local data files. */
(() => {
  const zh = {projects: window.projectStories, details: window.projectDetails, notes: window.fieldNotes, technical: window.projectTechnical};
  const strings = {
    '首页':'Home','关于我':'About','项目':'Projects','经验分享':'Field notes','联系':'Contact',
    '记录生活，也记录成长':'Notes on life and learning','用心生活，用心创造':'Live thoughtfully. Make with care.',
    'yuecong · 用心生活，用心创造':'yuecong · Live thoughtfully. Make with care.',
    'yuecong · 个人主页':'yuecong · Home','关于我 · yuecong':'About · yuecong','项目 · yuecong':'Projects · yuecong','项目笔记 · yuecong':'Project notes · yuecong','经验分享 · yuecong':'Field notes · yuecong','联系 · yuecong':'Contact · yuecong','未找到项目 · yuecong':'Project not found · yuecong',
    '深色模式':'Dark mode','浅色模式':'Light mode','切换深色模式':'Switch color theme','切换英文':'Switch to English','切换中文':'Switch to Chinese',
    '主导航':'Main navigation','阅读导航':'Reading navigation','返回首页':'Back to home','个人信息':'Profile','社交链接':'Social links','打开菜单':'Open menu','返回顶部':'Back to top','跳到正文':'Skip to content',
    '你好，我是':'Hello, I’m ','一个持续学习、创造和分享的人。':'Always learning, making, and sharing.',
    '看看我的项目':'Explore my work','了解更多':'Get to know me','完整介绍':'More about me','保持好奇，慢慢把想法做成现实。':'Stay curious. Bring ideas to life, one step at a time.',
    '我喜欢把零散的灵感整理成清晰的作品，也喜欢在代码、设计和日常生活之间找到平衡。':'I turn scattered ideas into thoughtful work, finding a balance between code, design, and everyday life.',
    '真实项目介绍':'Project case studies','持续学习的热情':'Curiosity to keep learning','我的项目':'My projects','查看全部':'View all','我的经历':'My journey',
    '第一个 Hello World':'My first Hello World','从第一次运行代码开始，打开了探索开发的窗口。':'Running my first lines of code opened a window into software development.',
    '第一次实习':'My first internship','开始参与真实业务项目，把学习变成实际交付。':'Working on real business projects, turning learning into delivery.',
    '持续学习与分享':'Keep learning and sharing','写作与分享成为习惯。':'Making writing and sharing a habit.',
    '认识一个人，从他在意的事情开始。':'Get to know someone through what they care about.',
    '我相信，好的作品应该让人感到轻松。':'I believe good work should put people at ease.',
    '你好，我是 yuecong。这里是我的个人博客，用来记录正在学习的东西、认真做过的项目。':'Hello, I’m yuecong. This is where I document what I’m learning and the projects I’ve worked on with care.',
    '我享受从一个模糊的想法开始，把它拆解、设计、实现，再交到真实的人手里。比起追逐热闹的技术，我更关注作品是否清晰、友好、耐看。':'I enjoy taking a vague idea apart, designing it, building it, and putting it into real hands. I care about work that feels clear, welcoming, and lasting.',
    '我也相信，成长不是一次完成的作品，而是愿意把每一次尝试都做得比上一次更清楚一点。哪怕从一个 Hello World 开始，持续积累，终会把微小的进步连接成自己的方向。这个网站也会随着我的学习和实践不断更新。':'Growth is an ongoing practice: making each attempt a little clearer than the last. Even a Hello World can be a beginning. Small improvements add up to a direction of your own. This site will keep evolving as I learn and build.',
    'Python 后端 / AI 应用开发':'Python backend / AI applications','所在地':'Based in','中国':'China','关注领域':'Interests','智能体开发 · 软硬件开发 · 大模型训练':'AI agents · Software and hardware · Model training','状态':'Currently','持续创造中':'Making things',
    '我在意什么':'What I care about','清晰':'Clarity','让复杂的事情变得容易理解，让每一个细节都有理由。':'Make complex things easier to understand, with a reason behind every detail.',
    '好用':'Usability','把真实的使用感受放在功能列表之前。':'Put the actual experience before the feature list.',
    '长期':'Longevity','选择能沉淀、能复用、能持续变好的方向。':'Choose work that builds on itself, can be reused, and improves over time.',
    '技能与工具':'Skills and tools','离线部署':'Offline deployment','AI Agent 工作流':'AI agent workflows','来源追溯':'Source traceability','声纹与说话人分离':'Voiceprints and speaker diarization','产品思维':'Product thinking',
    '一路走来':'Along the way','写下并运行了第一个 Hello World。':'Wrote and ran my first Hello World.','开始第一次实习，参与真实业务项目。':'Started my first internship and worked on real business projects.','继续创造，也继续记录。':'Keep building. Keep documenting.',
    '把想法做出来，再把过程分享出来。':'Build the idea. Share the process.','搜索项目、技术或关键词':'Search projects, technologies, or keywords','搜索项目':'Search projects','项目分类':'Project categories','全部':'All','软硬件开发':'Software & hardware','AI 智能体':'AI agents','业务自动化':'Business automation','工程手记':'Engineering notes',
    '项目笔记 / yuecong':'Project notes / yuecong','项目笔记':'Project notes','阅读全文':'Read more','阅读分享 →':'Read the note →','还没有找到项目':'No projects found','试试“FastAPI”“智能体”或“自动化”。':'Try “FastAPI”, “agent”, or “automation”.',
    '记录作品，也记录过程。':'Document the work and the process.',
    '七个项目的工程记录：技术选择、实现难点、架构、执行流程、数据关系与验证状态。':'Seven engineering case studies: technology choices, implementation problems, architecture, execution flows, data relationships and validation status.',
    '收藏':'Save','＋ 收藏':'+ Save','✓ 已收藏':'✓ Saved','收藏仅保存在当前浏览器':'Saved only in this browser','已收藏到当前浏览器':'Saved in this browser','已取消收藏':'Removed from saved items','浏览器未允许保存，本次临时收藏':'Browser storage is unavailable; saved for this session.',
    '做过，也想明白。':'Build it. Think it through.','关于工程判断、产品细节，以及把系统做可靠的方法。':'Notes on engineering judgment, product details, and building reliable systems.','工程手记 / 03 篇':'Engineering notes / 03 essays','任务设计 · AI 验收 · 移动交互':'Task design · AI evaluation · Mobile interaction',
    '搜索经验、标题或技术':'Search notes, titles, or technologies','搜索经验分享':'Search field notes','暂时没有匹配内容，试试其他关键词。':'No matching notes. Try another keyword.',
    '← 所有经验分享':'← All field notes','本篇目录':'In this essay','经验文章目录':'Essay contents','放进实现里的一个小例子':'A small implementation example','复制示例':'Copy example','复制代码':'Copy code','已复制':'Copied','阅读相关项目 →':'Read the related project →','没有找到这篇分享':'This essay could not be found','返回经验分享':'Back to field notes',
    '← 所有项目':'← All projects','返回项目目录':'Back to projects','这篇项目介绍还没有收录':'This project is not available yet','可以从项目目录选择一篇继续阅读。':'Choose a case study from the project collection.','未找到项目':'Project not found',
    '业务背景与产品定位':'Context and positioning','谁会使用这个产品':'Who uses the product','核心功能与产品设计':'Features and product design','一个完整的使用场景':'An end-to-end scenario','系统架构与技术方案':'Architecture and technical approach','关键工程取舍':'Engineering decisions','实现细节与技术核对':'Implementation and verification','数据模型与关联关系':'Data model and relationships','测试策略与验收标准':'Testing and acceptance','交付范围与实施边界':'Delivery scope and limits','产品价值与后续方向':'Value and next steps',
    '使用角色':'Role','主要任务':'Main tasks','产品需要解决的问题':'Needs to address','角色与任务分工':'Roles and responsibilities',
    '业务标识':'Business ID','逻辑关联':'Logical link','逻辑数据关联图':'Logical data relationships','业务主干 ER 关系图':'Core entity relationships','业务处理主流程':'Main business flow','系统职责分层图':'System responsibility layers',
    '连线按业务标识关联，不代表数据库外键约束；具体一对一或一对多关系见每行说明。':'Links represent business identifiers, not database foreign-key constraints. See each row for relationship cardinality.',
    '按已核对外键逐条展开关系，重复实体用于避免连线交叉。PK 为父表主键，FK 为子表外键；1:N 表示父记录可以对应多条子记录，可空关系已标注。':'Relationships follow the verified foreign keys. Repeated entities prevent crossed lines. PK is the parent primary key; FK is the child foreign key. 1:N indicates one parent may have several children. Nullable relationships are marked.',
    '按职责展示系统的主要组成与衔接，箭头表达阅读顺序，不表示每项功能都必须依次调用全部模块。':'Major components are grouped by responsibility. Arrows indicate reading order; a feature does not necessarily call every module in sequence.',
    '数据对象':'Data object','业务用途':'Business purpose','说明':'Notes','独立业务数据对象':'Independent business data objects','验收场景':'Acceptance scenario','预期产品行为':'Expected behavior','当前证据与后续验证':'Current evidence and further checks','业务验收与验证状态':'Acceptance and verification status',
    '验收应围绕用户能否完成任务，以及异常发生后系统是否仍然可解释。下表把预期行为与当前证据分开列出；建议用例不视为已完成验证，模型效果与工程流程也分别评估。':'Acceptance should check whether people can finish their tasks and understand failures. Expected behavior and current evidence are listed separately. Suggested cases are not completed tests, and model quality is assessed separately from workflow correctness.',
    '作者 yuecong':'By yuecong','功能、技术栈与验证范围分别说明':'Features, technology, and verification are documented separately','查看 Android 版 →':'View the Android edition →','查看 HarmonyOS 版 →':'View the HarmonyOS edition →',
    '实现依据与阅读说明':'Implementation references and reading notes',
    '依据项目文档、接口、数据模型和已有测试整理。业务示例用于解释产品，不是客户实测记录；本次文章改写未执行原项目、操作业务数据或重新运行原工程测试。':'Based on project documentation, APIs, data models, and existing tests. Examples explain the product and are not customer field results. Preparing this article did not involve running the original project, changing business data, or rerunning its tests.',
    '文章目录':'Article contents','阅读目录':'Contents','打印 / 保存 PDF':'Print / Save PDF','更多文章':'More articles','请启用 JavaScript 阅读项目文章与图表。':'Enable JavaScript to read the project articles and diagrams.',
    'A+ 大字阅读':'A+ Larger text','A− 标准字号':'A− Standard text','专注阅读':'Focus mode','退出专注':'Exit focus mode','复制文章链接':'Copy article link','文章链接已复制':'Article link copied','请从地址栏复制链接':'Copy the link from the address bar.',
    '⤢ 放大查看':'⤢ Enlarge','放大数据关系图':'Enlarge data diagram','数据关系图':'Data relationships','关闭图表':'Close diagram','缩放':'Zoom','图表缩放':'Diagram zoom','放大的数据关系图':'Enlarged data diagram','无法自动复制，请选中代码后复制':'Select the code and copy it manually.',
    '联系我':'Contact me','有项目想法、合作机会，或者只是想打个招呼？欢迎写信。':'Have a project idea, a collaboration in mind, or just want to say hello? Write to me.',
    '保持联系，保持交流。':'Let’s stay in touch.','如果你正在做一些有意思的事情，或者想聊聊设计、开发和生活，欢迎通过下面的方式找到我。':'Working on something interesting, or want to talk about design, development, and life? You can find me here.',
    '邮箱':'Email','本站链接':'This website','复制':'Copy','给我留言':'Send a note','你的称呼':'Your name','怎么称呼你？':'What should I call you?','你的邮箱':'Your email','想说的话':'Your message','写下你的想法……':'What’s on your mind?','打开邮件客户端':'Open email app','正在打开邮件客户端……':'Opening your email app…','网站链接已复制':'Website link copied','请手动复制网站地址':'Copy the website address manually.',
    '常见问题':'Common questions','可以合作吗？':'Open to collaboration?','可以，欢迎先通过邮件简单介绍你的项目、时间安排和希望我参与的部分。':'Yes. Email me a brief introduction to your project, schedule, and the part you would like me to take on.',
    '项目会持续更新吗？':'Will the projects keep growing?','会的。项目页支持链接到 GitHub、在线演示或设计稿，完成新项目后就会在这里补充。':'Yes. Project pages can link to GitHub, live demos, or designs. I’ll add new work as it is completed.',
    '这个网站用什么搭建？':'How is this website built?','纯 HTML、CSS 和 JavaScript，可以直接部署在 GitHub Pages 上，不需要服务器。':'Plain HTML, CSS, and JavaScript, hosted directly on GitHub Pages with no application server.',
    '音乐':'Listening room','音乐播放器':'Music player','空灵氛围 · 适合阅读':'Ambient selections · For reading','点击播放，进入安静的阅读时光':'Press play, settle into a quiet read','播放':'Play','暂停':'Pause','上一首':'Previous track','下一首':'Next track','静音':'Mute','取消静音':'Unmute','音量':'Volume','播放进度':'Playback position','切换播放模式':'Change playback mode','展开播放列表':'Show playlist','收起播放列表':'Hide playlist','顺序播放':'Play in order','随机播放':'Shuffle','单曲循环':'Repeat one','正在加载音乐…':'Loading music…','正在播放':'Now playing','已暂停':'Paused','音乐暂时无法播放，请重试':'Audio could not be played. Try again.','重试播放':'Retry playback','音乐鸣谢':'Music credits','本机试听':'Local audio','选择本机音乐':'Choose a local audio file','仅在本机试听，不会上传':'Listen locally; files are not uploaded','选歌':'Choose audio','已切换曲目，点击播放':'Track selected. Press play.','请先选择音频文件':'Please select an audio file.',
    '正在重新打开页面…':'Opening this page directly…'
  };
  let lang='zh'; try {lang=localStorage.getItem('yuecong-language')==='en'?'en':'zh';} catch {}
  const sourceNodes=new WeakMap(), sourceAttrs=new WeakMap();
  const t=(text)=>{
    if(lang!=='en')return text;
    const trim=text.trim();let result=strings[trim];
    if(!result){
      result=trim.replace(/^约 (\d+) 分钟阅读$/,'$1 min read').replace(/^约 (\d+) 分钟 · 方法复盘$/,'$1 min · Lessons learned').replace(/^约 (\d+) 分钟 · 含场景推演与验收方法$/,'$1 min · Scenarios and acceptance methods').replace(/^下一篇：(.+) →$/,'Next: $1 →').replace(/^(.+) 独立版本$/,'$1 · Independent edition');
    }
    return text.replace(trim,result||trim);
  };
  function syncDescription(){
    const english=lang==='en',params=new URLSearchParams(location.search);
    const descriptions={
      home:['yuecong 的个人博客与项目作品集','yuecong’s personal blog and project portfolio.'],
      about:['关于 yuecong：个人简介、技能与经历','About yuecong: profile, skills and experience.'],
      projects:['yuecong 的项目作品集','Project case studies by yuecong.'],
      notes:['yuecong 的工程经验分享：任务设计、AI 验收与移动交互。','Engineering field notes by yuecong: task design, AI evaluation and mobile interaction.'],
      contact:['联系 yuecong','Contact yuecong.']
    };
    let description;
    if(document.getElementById('storyRoot')){
      description=window.projectDetails?.[params.get('id')]?.summary;
      if(!description)description=english?'Project notes by yuecong: architecture, workflows, data models, testing and reflection.':'yuecong 的真实项目笔记：架构、业务流程、数据模型、测试与复盘。';
    }else if(document.getElementById('notesRoot')&&params.has('article')){
      description=window.fieldNotes?.find(note=>note.id===params.get('article'))?.description;
    }
    if(!description)description=(descriptions[document.body.dataset.page]||descriptions.home)[english?1:0];
    const meta=document.querySelector('meta[name="description"]');
    if(meta&&meta.content!==description)meta.content=description;
  }
  function apply(root=document.body){
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:n=>n.parentElement?.closest('script,style,code,pre,[data-no-translate]')?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT});
    while(walker.nextNode()){
      const node=walker.currentNode;let record=sourceNodes.get(node);
      if(!record||node.nodeValue!==record.rendered)record={source:node.nodeValue};
      record.rendered=t(record.source);if(node.nodeValue!==record.rendered)node.nodeValue=record.rendered;sourceNodes.set(node,record);
    }
    const els=[...(root.nodeType===1?[root]:[]),...root.querySelectorAll('[aria-label],[placeholder],[title],input[type="submit"]')];
    for(const el of els){let records=sourceAttrs.get(el)||{};for(const attr of ['aria-label','placeholder','title']){if(!el.hasAttribute(attr))continue;let record=records[attr];const value=el.getAttribute(attr);if(!record||value!==record.rendered)record={source:value};record.rendered=t(record.source);if(value!==record.rendered)el.setAttribute(attr,record.rendered);records[attr]=record;}sourceAttrs.set(el,records);}
    document.documentElement.lang=lang==='en'?'en':'zh-CN';
    syncDescription();
    document.querySelectorAll('[data-lang-toggle]').forEach(b=>{const label=lang==='en'?'中':'EN',aria=lang==='en'?'Switch to Chinese':'切换英文';if(b.textContent!==label)b.textContent=label;if(b.getAttribute('aria-label')!==aria)b.setAttribute('aria-label',aria);});
  }
  function selectData(){window.projectStories=lang==='en'?window.projectStoriesEn:zh.projects;window.projectDetails=lang==='en'?window.projectDetailsEn:zh.details;window.fieldNotes=lang==='en'?window.fieldNotesEn:zh.notes;window.projectTechnical=lang==='en'?window.projectTechnicalEn:zh.technical;}
  function set(next){lang=next==='en'?'en':'zh';try{localStorage.setItem('yuecong-language',lang);}catch{}selectData();}
  window.YuecongI18n={get lang(){return lang;},t,apply,set,selectData,strings};
  let queued=false;
  const pendingRoots=new Set();
  new MutationObserver(mutations=>{
    for(const mutation of mutations){
      const root=mutation.target.nodeType===Node.TEXT_NODE?mutation.target.parentElement:mutation.target;
      if(root?.nodeType===Node.ELEMENT_NODE&&root.isConnected)pendingRoots.add(root);
    }
    if(queued||!pendingRoots.size)return;
    queued=true;
    queueMicrotask(()=>{
      queued=false;
      const roots=[...pendingRoots].filter(root=>root.isConnected);
      pendingRoots.clear();
      for(const root of roots)if(!roots.some(parent=>parent!==root&&parent.contains(root)))apply(root);
    });
  }).observe(document.body,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['title','aria-label','placeholder']});
  selectData();
})();
