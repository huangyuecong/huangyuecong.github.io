(() => {
 const root=document.getElementById('notesRoot');if(!root)return;
 const notes=window.fieldNotes||[];
 const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
 const article=new URLSearchParams(location.search).get('article');
 if(article){
  const note=notes.find(item=>item.id===article);
  if(!note){root.innerHTML='<section class="page-intro"><h2>没有找到这篇分享</h2><a href="notes.html">返回经验分享</a></section>';return;}
  document.title=note.title+' · 经验分享 · yuecong';
  document.querySelector('meta[name="description"]').content=note.description;
  root.innerHTML='<header class="story-header"><a class="note-back" href="notes.html">← 所有经验分享</a><p class="eyebrow">'+esc(note.kicker)+'</p><h1>'+esc(note.title)+'</h1><p class="story-deck">'+esc(note.description)+'</p><div class="story-meta"><span>yuecong · 2026.09.09</span><span>开发过程中的思考与方法</span></div></header><details class="note-toc" open><summary>本篇目录</summary><nav aria-label="经验文章目录">'+note.sections.map(([heading],i)=>'<a href="#note-'+i+'">'+String(i+1).padStart(2,'0')+' '+esc(heading)+'</a>').join('')+'</nav></details><article class="note-body">'+note.sections.map(([heading,paragraphs],i)=>'<section class="story-section" id="note-'+i+'"><h2>'+esc(heading)+'</h2>'+paragraphs.map(p=>'<p>'+esc(p)+'</p>').join('')+'</section>').join('')+'<section class="story-section"><h2>放进实现里的一个小例子</h2><div class="code-sample"><div class="code-heading"><span>'+esc(note.code.language)+'</span><button type="button" data-copy-code>复制示例</button></div><pre><code>'+esc(note.code.text)+'</code></pre><p class="code-caption">'+esc(note.code.label)+'</p></div><p class="story-result">'+esc(note.takeaway)+'</p><a class="button button-ghost" href="project.html?id='+esc(note.related)+'">阅读相关项目 →</a></section></article>';
 }else{
  root.innerHTML='<section class="page-intro reveal"><p class="eyebrow">FIELD NOTES / KEEP LEARNING</p><h2>经验分享</h2><p>把做过的事情想明白，再把有用的方法留下来。</p></section><div class="notes-summary"><span>03 篇思考</span><span>任务设计 · AI 验收 · 移动交互</span></div><label class="search-box note-search"><span>⌕</span><input type="search" id="noteSearch" placeholder="搜索经验、标题或技术" aria-label="搜索经验分享"></label><div class="notes-list" id="notesList"></div><p id="notesEmpty" hidden>暂时没有匹配内容，试试其他关键词。</p>';
  const render=()=>{const keyword=document.getElementById('noteSearch').value.trim().toLowerCase();const matches=notes.filter(n=>[n.title,n.description,...n.tech].join(' ').toLowerCase().includes(keyword));document.getElementById('notesList').innerHTML=matches.map((n,i)=>'<article class="note-card"><span class="note-number">'+String(i+1).padStart(2,'0')+'</span><div><p class="eyebrow">'+esc(n.kicker)+'</p><h3><a href="notes.html?article='+n.id+'">'+esc(n.title)+'</a></h3><p>'+esc(n.description)+'</p><div class="tag-list">'+n.tech.map(t=>'<span class="tag">'+esc(t)+'</span>').join('')+'</div><div class="project-actions"><a class="small-button primary" href="notes.html?article='+n.id+'">阅读分享 →</a><button type="button" class="save-button" data-bookmark="'+n.id+'" aria-pressed="false">收藏</button></div></div></article>').join('');document.getElementById('notesEmpty').hidden=matches.length>0;document.dispatchEvent(new Event('site:cards-rendered'));};
  document.getElementById('noteSearch').addEventListener('input',render);render();
 }
})();
