/* One persistent, user-initiated audio session across static-page navigation. */
(() => {
  const base=new URL('./',document.currentScript.src);
  const tracks=[
    {id:'cylinder-one',title:'Cylinder One',artist:'Chris Zabriskie',file:'audio/cylinders-01.m4a',duration:176},
    {id:'cylinder-four',title:'Cylinder Four',artist:'Chris Zabriskie',file:'audio/cylinders-04.m4a',duration:177},
    {id:'cylinder-nine',title:'Cylinder Nine',artist:'Chris Zabriskie',file:'audio/cylinders-09.m4a',duration:323}
  ];
  const icons={play:'<path d="m8 5 11 7-11 7z"/>',pause:'<path d="M7 5h3v14H7zM14 5h3v14h-3z"/>',prev:'<path d="M5 5h2v14H5zm14 0L8 12l11 7z"/>',next:'<path d="M17 5h2v14h-2zM5 5l11 7L5 19z"/>',volume:'<path d="m4 9 4 0 5-4v14l-5-4H4z"/><path d="M16 8q6 4 0 8" fill="none" stroke="currentColor" stroke-width="2"/>',list:'<path d="M4 6h16M4 12h16M4 18h10" fill="none" stroke="currentColor" stroke-width="2"/>'};
  const svg=name=>'<svg viewBox="0 0 24 24" aria-hidden="true">'+icons[name]+'</svg>';
  const card=document.createElement('section');card.id='siteMusicDock';card.className='music-card';card.setAttribute('aria-label','音乐播放器');
  card.innerHTML=`<div class="music-heading"><strong>音乐</strong><span class="music-wave" aria-hidden="true"><i></i><i></i><i></i><i></i></span></div><p class="music-curation">空灵氛围 · 适合阅读</p><div class="music-now"><div class="music-disc" aria-hidden="true"><i></i></div><div class="music-info"><strong id="trackName"></strong><small id="trackArtist"></small><div class="music-time"><span id="trackTime"></span></div></div></div><label class="sr-only" for="musicSeek">播放进度</label><input id="musicSeek" class="music-range" type="range" min="0" max="176" step="0.1" value="0"><div class="music-controls"><button type="button" data-music="mode" aria-label="切换播放模式">↻</button><button type="button" data-music="prev" aria-label="上一首">${svg('prev')}</button><button type="button" data-music="play" class="music-play" aria-label="播放">${svg('play')}</button><button type="button" data-music="next" aria-label="下一首">${svg('next')}</button><button type="button" data-music="list" aria-label="展开播放列表" aria-expanded="false" aria-controls="musicPlaylist">${svg('list')}</button></div><div class="music-volume"><button type="button" data-music="mute" aria-label="静音" aria-pressed="false">${svg('volume')}</button><label class="sr-only" for="musicVolume">音量</label><input id="musicVolume" class="music-range" type="range" min="0" max="100" value="25"><span id="volumeLabel">25%</span></div><div id="musicPlaylist" class="music-playlist" hidden></div><p id="musicStatus" class="music-status" role="status">点击播放，进入安静的阅读时光</p><div class="music-foot"><a href="https://chriszabriskie.com/cylinders/" target="_blank" rel="noreferrer">Chris Zabriskie · CC BY 4.0 ↗</a><label class="music-import" title="仅在本机试听，不会上传">选歌<input type="file" accept="audio/*" id="musicFile" aria-label="选择本机音乐"></label></div>`;
  const tools=document.createElement('div');tools.className='music-tools';
  tools.append(card.querySelector('[data-music="mode"]'),card.querySelector('[data-music="list"]'));
  card.querySelector('.music-wave').replaceWith(tools);
  const $=s=>card.querySelector(s),t=s=>window.YuecongI18n?.t(s)||s;
  const text=(el,value)=>{if(el.textContent!==value)el.textContent=value;};
  const attr=(el,name,value)=>{if(el.getAttribute(name)!==value)el.setAttribute(name,value);};
  const audio=new Audio();audio.preload='none';
  let saved={};try{saved=JSON.parse(localStorage.getItem('yuecong-music-v2')||'{}')||{};}catch{}
  let selected=Math.max(0,tracks.findIndex(item=>item.id===saved.id));
  let pendingTime=Math.max(0,Number(saved.time)||0),loaded=-1,request=0,saveAt=0;
  let mode=['order','random','one'].includes(saved.mode)?saved.mode:'order';
  let statusKey='点击播放，进入安静的阅读时光';
  audio.volume=Number.isFinite(saved.volume)?Math.max(0,Math.min(1,saved.volume)):.25;audio.muted=Boolean(saved.muted);audio.loop=mode==='one';
  function persist(){try{localStorage.setItem('yuecong-music-v2',JSON.stringify({id:tracks[selected].local?tracks[0].id:tracks[selected].id,time:tracks[selected].local?0:loaded===selected?audio.currentTime:pendingTime,volume:audio.volume,muted:audio.muted,mode}));}catch{}}
  const format=n=>{n=Math.max(0,Math.floor(Number(n)||0));return Math.floor(n/60)+':'+String(n%60).padStart(2,'0');};
  function paint(){
    const track=tracks[selected],duration=loaded===selected&&Number.isFinite(audio.duration)?audio.duration:track.duration;
    const time=loaded===selected?audio.currentTime:pendingTime,playing=!audio.paused;
    text($('#trackName'),track.title);attr($('#trackName'),'title',track.title);text($('#trackArtist'),track.local?t('本机试听'):track.artist);
    text($('#trackTime'),format(time)+' / '+format(duration));
    $('#musicSeek').max=duration||1;$('#musicSeek').value=Math.min(time,duration||0);$('#musicSeek').disabled=!duration;
    $('#musicSeek').setAttribute('aria-valuetext',format(time)+' / '+format(duration));$('#musicSeek').style.setProperty('--range-fill',(duration?time/duration*100:0)+'%');
    card.classList.toggle('is-playing',playing);card.dataset.currentTrack=track.id;
    const play=$('[data-music="play"]');if(play.dataset.playing!==String(playing)){play.innerHTML=svg(playing?'pause':'play');play.dataset.playing=String(playing);}attr(play,'aria-label',t(playing?'暂停':'播放'));
    text($('[data-music="mode"]'),mode==='order'?'↻':mode==='random'?'⤨':'↻¹');attr($('[data-music="mode"]'),'title',t(mode==='order'?'顺序播放':mode==='random'?'随机播放':'单曲循环'));
    attr($('[data-music="list"]'),'aria-label',t($('#musicPlaylist').hidden?'展开播放列表':'收起播放列表'));
    attr($('[data-music="mute"]'),'aria-pressed',String(audio.muted));attr($('[data-music="mute"]'),'aria-label',t(audio.muted?'取消静音':'静音'));
    $('#musicVolume').value=Math.round(audio.volume*100);$('#musicVolume').style.setProperty('--range-fill',audio.volume*100+'%');text($('#volumeLabel'),audio.muted?t('静音'):Math.round(audio.volume*100)+'%');
    text($('#musicStatus'),t(statusKey));
    card.querySelectorAll('[data-track]').forEach(b=>{b.classList.toggle('active',Number(b.dataset.track)===selected);b.setAttribute('aria-current',String(Number(b.dataset.track)===selected));});
  }
  function playlist(){$('#musicPlaylist').replaceChildren(...tracks.map((track,i)=>{const b=document.createElement('button');b.type='button';b.dataset.track=i;b.textContent=String(i+1).padStart(2,'0')+'  '+track.title;return b;}));}
  async function play(){const token=++request;statusKey='正在加载音乐…';paint();try{if(loaded!==selected||audio.error){const track=tracks[selected];audio.src=track.url||new URL(track.file,base).href;loaded=selected;audio.load();}await audio.play();if(token!==request)return;statusKey='正在播放';paint();}catch(e){if(token!==request||e.name==='AbortError')return;statusKey='音乐暂时无法播放，请重试';paint();}}
  function select(index,autoplay=!audio.paused){if(!Number.isInteger(index))return;request++;audio.pause();selected=(index+tracks.length)%tracks.length;pendingTime=0;loaded=-1;audio.removeAttribute('src');audio.load();statusKey='已切换曲目，点击播放';paint();persist();if(autoplay)void play();}
  function next(){return mode==='random'&&tracks.length>1?(selected+1+Math.floor(Math.random()*(tracks.length-1)))%tracks.length:(selected+1)%tracks.length;}
  card.addEventListener('click',event=>{
    const track=event.target.closest('[data-track]');if(track){select(Number(track.dataset.track),true);return;}
    const action=event.target.closest('[data-music]')?.dataset.music;
    if(action==='play'){if(audio.paused)void play();else{request++;audio.pause();statusKey='已暂停';}}
    if(action==='prev')select(selected-1);if(action==='next')select(next());
    if(action==='mode'){mode=mode==='order'?'random':mode==='random'?'one':'order';audio.loop=mode==='one';statusKey=mode==='order'?'顺序播放':mode==='random'?'随机播放':'单曲循环';}
    if(action==='mute')audio.muted=!audio.muted;
    if(action==='list'){const list=$('#musicPlaylist');list.hidden=!list.hidden;const b=$('[data-music="list"]');b.setAttribute('aria-expanded',String(!list.hidden));b.setAttribute('aria-label',t(list.hidden?'展开播放列表':'收起播放列表'));}
    paint();persist();
  });
  $('#musicSeek').addEventListener('input',e=>{pendingTime=Number(e.target.value);if(loaded===selected&&Number.isFinite(audio.duration))audio.currentTime=pendingTime;paint();persist();});
  $('#musicVolume').addEventListener('input',e=>{audio.volume=Number(e.target.value)/100;audio.muted=false;paint();persist();});
  $('#musicFile').addEventListener('change',e=>{const file=e.target.files[0];if(!file)return;if(!file.type.startsWith('audio/')&&!/\.(mp3|m4a|ogg|wav|flac|aac)$/i.test(file.name)){statusKey='请先选择音频文件';paint();return;}const old=tracks.findIndex(x=>x.local);if(old>=0){audio.pause();request++;loaded=-1;URL.revokeObjectURL(tracks[old].url);tracks.splice(old,1);}tracks.push({id:'local',title:file.name,artist:t('本机试听'),url:URL.createObjectURL(file),duration:0,local:true});playlist();select(tracks.length-1,true);e.target.value='';});
  audio.addEventListener('loadedmetadata',()=>{if(Number.isFinite(audio.duration)){audio.currentTime=Math.min(pendingTime,Math.max(0,audio.duration-.1));tracks[selected].duration=audio.duration;}paint();});
  audio.addEventListener('timeupdate',()=>{paint();if(Date.now()-saveAt>2000){persist();saveAt=Date.now();}});
  audio.addEventListener('ended',()=>select(next(),true));
  audio.addEventListener('playing',()=>{statusKey='正在播放';paint();});
  audio.addEventListener('error',()=>{if(audio.hasAttribute('src')){statusKey='音乐暂时无法播放，请重试';paint();}});
  ['pause','volumechange'].forEach(type=>audio.addEventListener(type,paint));
  window.addEventListener('pagehide',persist);
  function mount(){
    const host=document.querySelector('.sidebar-bottom')||document.querySelector('.story-toc')||document.querySelector('main');
    if(host&&!host.contains(card)){
      if(host.matches('.sidebar-bottom'))host.insertBefore(card,host.querySelector('.sidebar-note'));
      else if(host.closest('.engineering-layout')){
        const wrap=document.createElement('div');wrap.className='story-music-wrapper';
        const toggle=document.createElement('button');toggle.type='button';toggle.className='story-music-toggle';toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-controls',card.id);
        toggle.textContent=window.YuecongI18n.lang==='en'?'Music and playback settings':'音乐与播放设置';
        toggle.addEventListener('click',()=>{const open=wrap.classList.toggle('is-open');toggle.setAttribute('aria-expanded',String(open));},{signal:window.Yuecong.pageSignal});
        wrap.append(toggle,card);host.prepend(wrap);
      }else host.prepend(card);
    }
    paint();window.YuecongI18n?.apply(card);
  }
  window.YuecongMusic={audio,card,mount,get state(){return {id:tracks[selected].id,playing:!audio.paused,time:loaded===selected?audio.currentTime:pendingTime,volume:audio.volume,mode};}};
  playlist();paint();
})();
