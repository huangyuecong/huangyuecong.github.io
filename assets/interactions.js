(() => {
 const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
 const read=()=>{try{const a=JSON.parse(localStorage.getItem('yuecong-saved')||'[]');return new Set(Array.isArray(a)?a:[]);}catch{return new Set();}};
 let saved=read();
 function announce(message){let toast=document.getElementById('toast');if(!toast){toast=document.createElement('div');toast.id='toast';toast.className='toast';toast.setAttribute('role','status');document.body.append(toast);}toast.textContent=message;toast.classList.add('show');clearTimeout(announce.timer);announce.timer=setTimeout(()=>toast.classList.remove('show'),2600);}
 function refreshSaved(){document.querySelectorAll('[data-bookmark]').forEach(button=>{const active=saved.has(button.dataset.bookmark);button.setAttribute('aria-pressed',String(active));button.textContent=active?'✓ 已收藏':'＋ 收藏';button.title='收藏仅保存在当前浏览器';});}
 document.addEventListener('site:cards-rendered',refreshSaved);
 document.addEventListener('click',async event=>{
  const bookmark=event.target.closest('[data-bookmark]');
  if(bookmark){const id=bookmark.dataset.bookmark;saved.has(id)?saved.delete(id):saved.add(id);try{localStorage.setItem('yuecong-saved',JSON.stringify([...saved]));announce(saved.has(id)?'已收藏到当前浏览器':'已取消收藏');}catch{announce('浏览器未允许保存，本次临时收藏');}refreshSaved();document.dispatchEvent(new Event('site:saved-changed'));}
  const copy=event.target.closest('[data-copy-code]');
  if(copy){try{await navigator.clipboard.writeText(copy.closest('.code-sample').querySelector('code').textContent);copy.textContent='已复制';setTimeout(()=>copy.textContent='复制示例',1600);}catch{announce('无法自动复制，请选中代码后复制');}}
 });
 const params=new URLSearchParams(location.search),articleId=params.get('id')||params.get('article');
 const header=document.querySelector('.story-header');
 if(header&&articleId&&document.querySelector('.story-body,.note-body')){
  const toolbar=document.createElement('div');toolbar.className='reading-tools';toolbar.innerHTML='<button type="button" class="save-button" data-bookmark="'+esc(articleId)+'">收藏</button><button type="button" data-reading="size" aria-pressed="false">A+ 大字阅读</button><button type="button" data-reading="focus" aria-pressed="false">专注阅读</button><button type="button" data-reading="share">复制文章链接</button>';
  header.append(toolbar);
  toolbar.addEventListener('click',async event=>{const button=event.target.closest('[data-reading]');if(!button)return;const action=button.dataset.reading;if(action==='share'){try{await navigator.clipboard.writeText(location.href.split('#')[0]);announce('文章链接已复制');}catch{announce('请从地址栏复制链接');}return;}const cls=action==='size'?'large-reading':'focus-reading';const active=document.body.classList.toggle(cls);button.setAttribute('aria-pressed',String(active));button.textContent=action==='size'?(active?'A− 标准字号':'A+ 大字阅读'):(active?'退出专注':'专注阅读');});
 }
 document.querySelectorAll('.diagram-figure').forEach((figure,index)=>{
  if(!figure.querySelector('svg'))return;
  const button=document.createElement('button');button.type='button';button.className='diagram-expand';button.textContent='⤢ 放大查看';button.setAttribute('aria-label','放大数据关系图');figure.prepend(button);
  button.addEventListener('click',()=>{
   let dialog=document.getElementById('diagramDialog');if(!dialog){dialog=document.createElement('dialog');dialog.id='diagramDialog';dialog.className='diagram-dialog';dialog.setAttribute('aria-label','放大数据关系图');document.body.append(dialog);}
   dialog.innerHTML='<header><strong>数据关系图</strong><button type="button" data-close-diagram aria-label="关闭图表">×</button></header><label class="diagram-zoom">缩放 <input type="range" min="70" max="180" value="100" aria-label="图表缩放"><span>100%</span></label><div class="diagram-canvas"></div>';
   const clone=figure.querySelector('svg').cloneNode(true);clone.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));clone.removeAttribute('aria-labelledby');clone.setAttribute('aria-label','放大的数据关系图');clone.style.width='900px';clone.style.minWidth='0';dialog.querySelector('.diagram-canvas').append(clone);
   dialog.querySelector('[data-close-diagram]').onclick=()=>dialog.close();dialog.onclick=event=>{if(event.target===dialog){const box=dialog.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)dialog.close();}};
   dialog.querySelector('input').oninput=event=>{clone.style.width=(9*Number(event.target.value))+'px';dialog.querySelector('.diagram-zoom span').textContent=event.target.value+'%';};dialog.showModal();
  });
 });
 document.querySelectorAll('[data-checkpoint]').forEach(input=>{const key='yuecong-check:'+articleId+':'+input.dataset.checkpoint;try{input.checked=localStorage.getItem(key)==='1';}catch{}input.addEventListener('change',()=>{try{localStorage.setItem(key,input.checked?'1':'0');}catch{}});});
 // 搜索快捷键只在非编辑区域生效。
 document.addEventListener('keydown',event=>{if(event.key==='/'&&!event.ctrlKey&&!event.metaKey&&!event.altKey&&!event.target.closest('input,textarea,select,[contenteditable="true"]')){const search=document.querySelector('#projectSearch,#noteSearch');if(search){event.preventDefault();search.focus();}}if(event.key==='Escape'){document.body.classList.remove('sidebar-open');}});
 refreshSaved();
})();
