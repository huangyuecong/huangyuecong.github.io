/* 长文阅读、结构图与目录导航；无外部图表依赖。 */
(() => {
  const root = document.getElementById('storyRoot');
  if (!root) return;
  const stories = window.projectStories || [];
  const id = new URLSearchParams(location.search).get('id');
  const project = stories.find(item => item.id === id);
  const detail = window.projectDetails?.[id];
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  if (!project || !detail) {
    document.title = '未找到项目 · yuecong';
    root.innerHTML = '<header class="story-header"><h1>这篇项目介绍还没有收录</h1><p>可以从项目目录选择一篇继续阅读。</p><a class="button button-primary" href="projects.html">返回项目目录</a></header>';
    return;
  }
  document.title = project.title + ' · yuecong';
  document.querySelector('meta[name="description"]').content = detail.summary;
  const sections = [
    ['background','业务背景与产品定位'],
    ['users','谁会使用这个产品'],
    ['features','核心功能与产品设计'],
    ['scenario','一个完整的使用场景'],
    ['architecture','系统架构与技术方案'],
    ['decisions','关键工程取舍'],
    ['data-model','数据模型与关联关系'],
    ['testing','测试策略与验收标准'],
    ['delivery','交付范围与实施边界'],
    ['value','产品价值与后续方向']
  ];
  const paragraphs = list => list.map(text => '<p>'+esc(text)+'</p>').join('');
  const section = (key, content) => {
    const index = sections.findIndex(item=>item[0]===key);
    return '<section class="story-section" id="'+key+'"><div class="chapter-heading"><span>'+String(index+1).padStart(2,'0')+'</span><h2>'+sections[index][1]+'</h2></div>'+content+'</section>';
  };
  const table = (heads, rows, caption) => '<div class="story-table-wrap"><table class="story-table"><caption>'+esc(caption)+'</caption><thead><tr>'+heads.map(head=>'<th scope="col">'+esc(head)+'</th>').join('')+'</tr></thead><tbody>'+rows.map(row=>'<tr>'+row.map(cell=>'<td>'+esc(cell)+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>';
  function erDiagram() {
    const height = detail.er.length * 132 + 10;
    const rows = detail.er.map(([parent,pk,child,fk,label],index)=>{
      const y = index*132+8;
      const kind = detail.logicalER ? '业务标识' : 'FK';
      return '<g transform="translate(0,'+y+')"><rect x="12" y="8" width="248" height="86" rx="12"/><text class="er-title" x="27" y="40">'+esc(parent)+'</text><text x="27" y="70">PK · '+esc(pk)+'</text><path d="M260 51 H446"/><text class="relation-label" text-anchor="middle" x="353" y="34">'+(detail.logicalER?'逻辑关联':'1 : N')+'</text><path d="M432 44 L446 51 L432 58"/><rect x="446" y="8" width="280" height="86" rx="12"/><text class="er-title" x="461" y="40">'+esc(child)+'</text><text x="461" y="70">'+kind+' · '+esc(fk)+'</text><text class="relation-label" x="12" y="117">'+esc(label)+'</text></g>';
    }).join('');
    const description=detail.er.map(row=>row[0]+' → '+row[2]+'：'+row[4]).join('；');
    return '<figure class="diagram-figure"><div class="diagram-label">'+(detail.logicalER?'LOGICAL DATA MODEL':'ENTITY RELATIONSHIPS')+'</div><div class="er-scroll"><svg class="er-svg" viewBox="0 0 740 '+height+'" role="img" aria-labelledby="erTitle erDescription"><title id="erTitle">'+(detail.logicalER?'逻辑数据关联图':'业务主干 ER 关系图')+'</title><desc id="erDescription">'+esc(description)+'</desc>'+rows+'</svg></div><figcaption>'+(detail.logicalER?'连线按业务标识关联，不代表数据库外键约束；具体一对一或一对多关系见每行说明。':'按已核对外键逐条展开关系，重复实体用于避免连线交叉。PK 为父表主键，FK 为子表外键；1:N 表示父记录可以对应多条子记录，可空关系已标注。')+'</figcaption></figure>';
  }
  const roles=table(['使用角色','主要任务','产品需要解决的问题'],detail.roles,'角色与任务分工');
  const modules=detail.modules.map(([title,goal,copy],i)=>'<section class="feature-detail"><div class="feature-top"><span>'+String(i+1).padStart(2,'0')+'</span><h3>'+esc(title)+'</h3></div><p class="feature-goal">'+esc(goal)+'</p><p>'+esc(copy)+'</p></section>').join('');
  const scenario='<div class="scenario-lead"><h3>'+esc(detail.scenario.title)+'</h3><p>'+esc(detail.scenario.intro)+'</p></div><ol class="journey-steps">'+detail.scenario.steps.map(([title,copy],i)=>'<li><span class="journey-number">'+(i+1)+'</span><div><h3>'+esc(title)+'</h3><p>'+esc(copy)+'</p></div></li>').join('')+'</ol><p class="story-result">'+esc(detail.scenario.result)+'</p><figure class="diagram-figure"><div class="diagram-label">BUSINESS FLOW</div><ol class="flow-diagram" aria-label="业务处理主流程">'+project.flow.map(step=>'<li>'+esc(step)+'</li>').join('')+'</ol><figcaption>'+esc(project.flowNote)+'</figcaption></figure>';
  const architecture='<div class="tag-list">'+project.tech.map(tag=>'<span class="tag">'+esc(tag)+'</span>').join('')+'</div><figure class="diagram-figure architecture-figure"><div class="diagram-label">SYSTEM RESPONSIBILITIES</div><ol class="architecture-layers" aria-label="系统职责分层图">'+project.architecture.map(([title,copy],i)=>'<li><span class="layer-number">L'+(i+1)+'</span><div><h3>'+esc(title)+'</h3><p>'+esc(copy)+'</p></div></li>').join('')+'</ol><figcaption>按职责展示系统的主要组成与衔接，箭头表达阅读顺序，不表示每项功能都必须依次调用全部模块。</figcaption></figure>';
  const decisions=detail.solution.map(([title,copy])=>'<h3>'+esc(title)+'</h3><p>'+esc(copy)+'</p>').join('');
  const data=paragraphs(detail.dataNotes)+erDiagram()+(detail.dataObjects?table(['数据对象','业务用途','说明'],detail.dataObjects,'独立业务数据对象'):'');
  const testing='<p>验收应围绕用户能否完成任务，以及异常发生后系统是否仍然可解释。下表把预期行为与当前证据分开列出；建议用例不视为已完成验证，模型效果与工程流程也分别评估。</p>'+table(['验收场景','预期产品行为','当前证据与后续验证'],detail.acceptance,'业务验收与验证状态');
  const readTime=Math.ceil((JSON.stringify(detail).match(/[\u4e00-\u9fff]/g)||[]).length/300);
  const counterpart=id==='silver-guardian'?['elderly-android','查看 Android 版 →']:id==='elderly-android'?['silver-guardian','查看 HarmonyOS 版 →']:null;
  const next=stories[(stories.indexOf(project)+1)%stories.length];
  root.innerHTML='<header class="story-header"><p class="eyebrow">'+esc(project.kicker)+' / PRODUCT CASE STUDY</p><h1>'+esc(project.title)+'</h1><p class="story-deck">'+esc(detail.summary)+'</p><div class="story-meta"><span>作者 yuecong</span><span>'+esc(project.status)+'</span><span>约 '+readTime+' 分钟阅读</span></div>'+(counterpart?'<div class="platform-note"><strong>'+esc(project.platform)+' 独立版本</strong><span>功能、技术栈与验证范围分别说明</span><a href="project.html?id='+counterpart[0]+'">'+counterpart[1]+'</a></div>':'')+'</header><div class="story-layout"><article class="story-body">'+
    section('background',paragraphs(detail.positioning))+
    section('users',roles)+
    section('features',modules)+
    section('scenario',scenario)+
    section('architecture',architecture)+
    section('decisions',decisions)+
    section('data-model',data)+
    section('testing',testing)+
    section('delivery',paragraphs(detail.delivery))+
    section('value',paragraphs(detail.value))+
    '<details class="story-section evidence-details"><summary>实现依据与阅读说明</summary><p>依据项目文档、接口、数据模型和已有测试整理。业务示例用于解释产品，不是客户实测记录；本次文章改写未执行原项目、操作业务数据或重新运行原工程测试。</p><ul class="story-evidence">'+project.evidence.map(file=>'<li>'+esc(file)+'</li>').join('')+'</ul></details></article><nav class="story-toc" aria-label="文章目录"><strong>阅读目录</strong><div class="reading-track" aria-hidden="true"><i id="readingProgress"></i></div>'+sections.map(([key,label],index)=>'<a href="#'+key+'"><span>'+String(index+1).padStart(2,'0')+'</span>'+label+'</a>').join('')+'<button class="story-print" type="button" id="printStory">打印 / 保存 PDF</button></nav></div><nav class="story-next" aria-label="更多文章"><a class="button button-ghost" href="projects.html">← 所有项目</a><a class="button button-primary" href="project.html?id='+encodeURIComponent(next.id)+'">下一篇：'+esc(next.title.split('：')[0])+' →</a></nav>';
  document.getElementById('printStory').addEventListener('click',()=>window.print());
  const anchors=[...document.querySelectorAll('.story-toc a')];
  const chapters=sections.map(([key])=>document.getElementById(key));
  let scheduled=false;
  function updateReading() {
    scheduled=false;
    const denominator=document.documentElement.scrollHeight-window.innerHeight;
    document.getElementById('readingProgress').style.width=Math.min(100,Math.max(0,denominator?window.scrollY/denominator*100:0))+'%';
    let active=chapters[0].id;
    for(const chapter of chapters) if(chapter.getBoundingClientRect().top<=170) active=chapter.id;
    anchors.forEach(anchor=>{
      const current=anchor.getAttribute('href')==='#'+active;
      anchor.classList.toggle('active',current);
      if(current) anchor.setAttribute('aria-current','location'); else anchor.removeAttribute('aria-current');
    });
  }
  window.addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(updateReading);}},{passive:true});
  updateReading();
  if(location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView();
})();
