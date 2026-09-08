/* 项目文章渲染；SVG 图表离线可用，无远程图表依赖。 */
(() => {
  const root = document.getElementById('storyRoot');
  if (!root) return;
  const stories = window.projectStories || [];
  const id = new URLSearchParams(location.search).get('id');
  const project = stories.find(item => item.id === id);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  if (!project) {
    document.title = '未找到项目 · yuecong';
    root.innerHTML = '<header class="story-header"><h1>这篇项目笔记还没有收录</h1><p>可以从项目目录选择一篇文章继续阅读。</p><a class="button button-primary" href="projects.html">返回项目目录</a></header>';
    return;
  }
  document.title = `${project.title} · yuecong`;
  document.querySelector('meta[name="description"]').content = project.description;
  const sections = [['background','为什么做'],['architecture','架构与技术栈'],['workflow','业务流程'],['decisions','工程取舍'],['data-model','数据模型'],['testing','测试与边界'],['reflection','做完之后'],['sources','技术依据']];
  const paragraphs = list => list.map(text => `<p>${esc(text)}</p>`).join('');
  const section = (key, content) => `<section class="story-section" id="${key}"><h2>${sections.find(item => item[0] === key)[1]}</h2>${content}</section>`;
  function erDiagram() {
    const positions = [[18,35],[335,35],[335,265]];
    const edges = project.relations.map(([from,to,label], index) => {
      let path, x, y;
      if (from === 0 && to === 1) { path='M258 100 H335'; x=265; y=78; }
      else if (from === 1 && to === 2) { path='M455 165 V265'; x=465; y=214; }
      else { path='M138 165 V330 H335'; x=154; y=312; }
      const split = label.split(' · ');
      return `<path d="${path}"/><text class="relation-label" x="${x}" y="${y}">${esc(split[0])}<tspan x="${x}" dy="16">${esc(split[1])}</tspan></text>`;
    }).join('');
    const boxes = project.entities.map((entity,i) => {
      const [x,y]=positions[i];
      return `<g transform="translate(${x},${y})"><rect width="240" height="130" rx="12"/><text class="er-title" x="14" y="27">${esc(entity[1])}</text><text x="14" y="50">${esc(entity[0])}</text><text x="14" y="81">${esc(entity[2])}</text><text x="14" y="107">${esc(entity[3])}</text></g>`;
    }).join('');
    const height=project.entities.length===2?200:420;
    const description=project.relations.map(([a,b,label])=>`${project.entities[a][1]}与${project.entities[b][1]}：${label}`).join('；');
    return `<figure><div class="er-scroll"><svg class="er-svg" viewBox="0 0 600 ${height}" role="img" aria-labelledby="erTitle erDescription"><title id="erTitle">${esc(project.title)}：局部 ER 图</title><desc id="erDescription">${esc(description)}</desc>${edges}${boxes}</svg></div><figcaption class="story-note">${esc(project.erNote)} PK 为主键，FK 为外键；1 : N 表示一对多关系。</figcaption></figure>`;
  }
  const architecture = `<div class="tag-list">${project.tech.map(tag=>`<span class="tag">${esc(tag)}</span>`).join('')}</div><div class="story-stack">${project.architecture.map(([title,copy])=>`<div><h3>${esc(title)}</h3><p>${esc(copy)}</p></div>`).join('')}</div>`;
  const flow = `<figure><ol class="flow-diagram" aria-label="业务处理流程">${project.flow.map(step=>`<li>${esc(step)}</li>`).join('')}</ol><figcaption class="story-note">${esc(project.flowNote)}</figcaption></figure>`;
  const testing = '<p class="story-note">以下依据已有源码与测试文件整理。本次为只读分析，未运行原项目测试、模型服务或业务操作；不将已有用例写成已通过的测试结果。</p>'+`<div class="story-table-wrap"><table class="story-table"><thead><tr><th scope="col">验证方向</th><th scope="col">证据状态</th><th scope="col">说明</th></tr></thead><tbody>${project.tests.map(row=>`<tr>${row.map(cell=>`<td>${esc(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  const next=stories[(stories.indexOf(project)+1)%stories.length];
  root.innerHTML = `<header class="story-header"><p class="eyebrow">${esc(project.kicker)}</p><h1>${esc(project.title)}</h1><p>${esc(project.description)}</p><div class="story-meta"><span>作者 yuecong</span><span>${esc(project.status)}</span><span>整理于 2026.09.08</span></div></header>
    <div class="story-layout"><article class="story-body">
    ${section('background',paragraphs(project.intro))}
    ${section('architecture',architecture)}
    ${section('workflow',flow)}
    ${section('decisions',project.challenges.map(([title,copy])=>`<h3>${esc(title)}</h3><p>${esc(copy)}</p>`).join(''))}
    ${section('data-model',erDiagram())}
    ${section('testing',testing)}
    ${section('reflection',`<p>${esc(project.reflection)}</p>`)}
    ${section('sources','<p>本文根据项目 README、数据模型与测试文件整理，图示为便于阅读的局部结构。这里只记录技术过程，未附业务源码、运行数据或内部凭证。</p>'+`<ul class="story-evidence">${project.evidence.map(file=>`<li>${esc(file)}</li>`).join('')}</ul>`)}
    </article><nav class="story-toc" aria-label="文章目录"><strong>本篇目录</strong>${sections.map(([key,label])=>`<a href="#${key}">${label}</a>`).join('')}</nav></div>
    <nav class="story-next" aria-label="更多文章"><a class="button button-ghost" href="projects.html">← 所有项目</a><a class="button button-primary" href="project.html?id=${encodeURIComponent(next.id)}">下一篇：${esc(next.title.split('：')[0])} →</a></nav>`;
})();
