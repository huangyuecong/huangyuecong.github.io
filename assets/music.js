/* 自包含轻音乐播放器。无自动播放；试听文件不上传。 */
(() => {
  const host=document.querySelector('.sidebar-bottom') || document.querySelector('.story-toc');
  if(!host) return;
  const icons={play:'<path d="m8 5 11 7-11 7z"/>',pause:'<path d="M7 5h3v14H7zM14 5h3v14h-3z"/>',prev:'<path d="M5 5h2v14H5zm14 0L8 12l11 7z"/>',next:'<path d="M17 5h2v14h-2zM5 5l11 7L5 19z"/>',volume:'<path d="m4 9 4 0 5-4v14l-5-4H4z"/><path d="M16 8q6 4 0 8" fill="none" stroke="currentColor" stroke-width="2"/>',list:'<path d="M4 6h16M4 12h16M4 18h10" fill="none" stroke="currentColor" stroke-width="2"/>',repeat:'<path d="M5 8h13l-3-3m3 11H5l3 3M4 8v5m16-2v5" fill="none" stroke="currentColor" stroke-width="2"/>'};
  const svg=name=>'<svg viewBox="0 0 24 24" aria-hidden="true">'+icons[name]+'</svg>';
  const tracks=[{title:'奶油午后',artist:'yuecong · 合成轻音乐',seed:0,duration:61.44},{title:'山间来信',artist:'yuecong · 合成轻音乐',seed:1,duration:61.44}];
  const playlistSource='https://api.injahow.cn/meting/?server=netease&type=playlist&id=2619366284';
  let onlineReady=false,onlineLoading=true;
  const card=document.createElement('section');card.className='music-card';card.setAttribute('aria-label','音乐播放器');
  card.innerHTML='<div class="music-heading"><strong>音乐</strong><span class="music-wave" aria-hidden="true"><i></i><i></i><i></i><i></i></span></div><div class="music-now"><div class="music-disc" aria-hidden="true"><i></i></div><div class="music-info"><strong id="trackName"></strong><small id="trackArtist"></small><div class="music-time"><span id="trackTime">0:00 / 1:01</span></div></div></div><label class="sr-only" for="musicSeek">播放进度</label><input id="musicSeek" class="music-range" type="range" min="0" max="61.44" step="0.1" value="0"><div class="music-controls"><button type="button" data-music="repeat" aria-label="切换单曲循环" aria-pressed="false">'+svg('repeat')+'</button><button type="button" data-music="prev" aria-label="上一首">'+svg('prev')+'</button><button type="button" data-music="play" class="music-play" aria-label="播放">'+svg('play')+'</button><button type="button" data-music="next" aria-label="下一首">'+svg('next')+'</button><button type="button" data-music="list" aria-label="展开播放列表" aria-expanded="false" aria-controls="musicPlaylist">'+svg('list')+'</button></div><div class="music-volume"><button type="button" data-music="mute" aria-label="静音" aria-pressed="false">'+svg('volume')+'</button><label class="sr-only" for="musicVolume">音量</label><input id="musicVolume" class="music-range" type="range" min="0" max="100" value="35"><span id="volumeLabel">35%</span></div><div id="musicPlaylist" class="music-playlist" hidden></div><div class="music-foot"><span id="musicStatus" role="status">点击播放 · 轻音乐</span><label class="music-import" title="仅在本机试听，不会上传">选歌<input type="file" accept="audio/*" id="musicFile" aria-label="选择本机音乐"></label></div>';
  host.prepend(card);
  if(!document.querySelector('.sidebar-bottom')){
    const theme=document.querySelector('[data-theme-toggle]');
    if(theme)host.append(theme.cloneNode(true));
  }
  const audio=new Audio();audio.preload='metadata';
  async function loadOnlinePlaylist(){
    try{
      const response=await fetch(playlistSource,{mode:'cors'}); if(!response.ok) throw new Error('playlist');
      const list=await response.json();
      if(!Array.isArray(list)||!list.length) throw new Error('empty');
      tracks.push(...list.map(item=>({title:item.name||'未命名歌曲',artist:item.artist||'网易云音乐',url:item.url,pic:item.pic,duration:0,online:true})));
      onlineReady=true; status('网易云歌单 · '+list.length+' 首'); playlist(); paint();
    }catch(error){status('网易云歌单暂时不可用 · 可试听本机音乐');}
    onlineLoading=false;
  }
  loadOnlinePlaylist();
  const $=selector=>card.querySelector(selector);
  let saved={};try{saved=JSON.parse(localStorage.getItem('yuecong-music')||'{}')||{};}catch{}
  let selected=Number.isInteger(saved.track)&&saved.track>=0?saved.track:0;
  let pendingTime=Math.max(0,Number(saved.time)||0),loaded=-1,lastSave=0,sequence=0;
  audio.volume=Number.isFinite(saved.volume)?Math.max(0,Math.min(1,saved.volume)):.35;
  audio.loop=saved.loop===true;
  const format=seconds=>{const n=Math.max(0,Math.floor(Number(seconds)||0));return Math.floor(n/60)+':'+String(n%60).padStart(2,'0');};
  const status=text=>$('#musicStatus').textContent=text;
  const persist=()=>{try{localStorage.setItem('yuecong-music',JSON.stringify({track:selected<2?selected:0,time:selected<2?(loaded===selected?audio.currentTime:pendingTime):0,volume:audio.volume,loop:audio.loop}));}catch{}};
  function paint(){
    const track=tracks[selected]||tracks[0];
    $('#trackName').textContent=track.title;$('#trackName').title=track.title;$('#trackArtist').textContent=track.artist;
    const length=loaded===selected&&Number.isFinite(audio.duration)?audio.duration:track.duration||0;
    const time=loaded===selected?audio.currentTime:pendingTime;
    $('#musicSeek').max=length||1;$('#musicSeek').value=Math.min(time,length);$('#musicSeek').disabled=!length;
    $('#musicSeek').style.setProperty('--range-fill',(length?time/length*100:0)+'%');
    $('#trackTime').textContent=format(time)+' / '+format(length);
    const playing=!audio.paused;
    card.classList.toggle('is-playing',playing);
    $('[data-music="play"]').innerHTML=svg(playing?'pause':'play');$('[data-music="play"]').setAttribute('aria-label',playing?'暂停':'播放');
    $('[data-music="repeat"]').setAttribute('aria-pressed',String(audio.loop));
    $('[data-music="repeat"]').title=audio.loop?'单曲循环':'顺序播放';
    $('[data-music="mute"]').setAttribute('aria-pressed',String(audio.muted));$('[data-music="mute"]').setAttribute('aria-label',audio.muted?'取消静音':'静音');
    $('#musicVolume').value=audio.volume*100;$('#musicVolume').style.setProperty('--range-fill',audio.volume*100+'%');
    $('#volumeLabel').textContent=audio.muted?'静音':Math.round(audio.volume*100)+'%';
    card.querySelectorAll('[data-track]').forEach(button=>{button.classList.toggle('active',Number(button.dataset.track)===selected);button.setAttribute('aria-current',String(Number(button.dataset.track)===selected));});
  }
  function playlist(){
    $('#musicPlaylist').replaceChildren(...tracks.map((track,index)=>{const b=document.createElement('button');b.type='button';b.dataset.track=index;b.textContent=String(index+1).padStart(2,'0')+'  '+track.title;return b;}));
  }
  // 以正弦泛音、长衰减和分解和弦生成两段原创环境旋律，PCM WAV 可直接被 audio 播放。
  function makeMusic(seed){
    const rate=22050,duration=61.44,count=Math.ceil(rate*duration),pcm=new Float32Array(count);
    const chords=seed?[[57,60,64],[53,57,60],[48,52,55],[55,59,62]]:[[48,52,55],[45,48,52],[53,57,60],[55,59,62]];
    function note(midi,start,length,amplitude){
      const freq=440*Math.pow(2,(midi-69)/12),begin=Math.floor(start*rate),limit=Math.min(count,begin+Math.floor(length*rate));
      for(let i=begin;i<limit;i++){
        const t=(i-begin)/rate,env=(1-Math.exp(-t*35))*Math.exp(-t*1.5)*Math.min(1,(length-t)*3);
        pcm[i]+=amplitude*env*(Math.sin(2*Math.PI*freq*t)+.22*Math.sin(4*Math.PI*freq*t)+.05*Math.sin(6*Math.PI*freq*t));
      }
    }
    for(let beat=0;beat<120;beat++){
      const chord=chords[Math.floor(beat/8)%4],time=beat*.48;
      note(chord[(beat+seed)%3]+12,time,2.7,.115);
      if(beat%8===0){note(chord[0]-12,time,3.6,.14);chord.forEach(n=>note(n,time,3.8,.055));}
      if(beat%4===2)note(chord[(Math.floor(beat/4)+1)%3]+24,time,2.4,.045);
    }
    const buffer=new ArrayBuffer(44+count*2),view=new DataView(buffer);
    const chars=(offset,str)=>{for(let i=0;i<str.length;i++)view.setUint8(offset+i,str.charCodeAt(i));};
    chars(0,'RIFF');view.setUint32(4,36+count*2,true);chars(8,'WAVE');chars(12,'fmt ');view.setUint32(16,16,true);view.setUint16(20,1,true);view.setUint16(22,1,true);view.setUint32(24,rate,true);view.setUint32(28,rate*2,true);view.setUint16(32,2,true);view.setUint16(34,16,true);chars(36,'data');view.setUint32(40,count*2,true);
    for(let i=0;i<count;i++){const fade=Math.min(1,i/rate/1.5,(count-i)/rate/4);view.setInt16(44+i*2,Math.tanh(pcm[i])*fade*27000,true);}
    return URL.createObjectURL(new Blob([buffer],{type:'audio/wav'}));
  }
  // PCM synthesis runs off the UI thread; the worker is released after each track.
  function generateTrack(seed){
    return new Promise((resolve,reject)=>{
      const source=makeMusic.toString().replace("return URL.createObjectURL(new Blob([buffer],{type:'audio/wav'}));","return buffer;");
      const url=URL.createObjectURL(new Blob([source+';onmessage=e=>{const buffer=makeMusic(e.data);postMessage(buffer,[buffer]);};'],{type:'text/javascript'}));
      const worker=new Worker(url);
      const finish=()=>{worker.terminate();URL.revokeObjectURL(url);};
      worker.onmessage=e=>{finish();resolve(URL.createObjectURL(new Blob([e.data],{type:'audio/wav'})));};
      worker.onerror=e=>{finish();reject(new Error(e.message));};
      worker.postMessage(seed);
    });
  }
  async function play(){
    const request=++sequence;
    try{
      if(loaded!==selected){const index=selected,track=tracks[index];if(!track){return;}status(track.online?'正在获取网易云音源…':'正在准备音频…');track.pending=track.pending|| (track.url?Promise.resolve(track.url):generateTrack(track.seed));track.url=await track.pending;if(request!==sequence)return;audio.src=track.url;loaded=index;}
      await audio.play();if(request===sequence){status(selected<2?'合成轻音乐 · 正在播放':tracks[selected]?.online?'网易云歌单 · 正在播放':'本机试听 · 不会上传');paint();}
    }catch(error){if(request===sequence&&error.name!=='AbortError'){status('无法播放，请换一首或重试');paint();}}
  }
  function select(index){
    const wasPlaying=!audio.paused;sequence++;audio.pause();selected=(index+tracks.length)%tracks.length;loaded=-1;pendingTime=0;
    audio.removeAttribute('src');audio.load();status(selected<2?'点击播放 · 轻音乐':tracks[selected]?.online?'网易云歌单 · 点击播放':'本机试听 · 不会上传');paint();persist();if(wasPlaying)play();
  }
  card.addEventListener('click',event=>{
    const track=event.target.closest('[data-track]');if(track){select(Number(track.dataset.track));return;}
    const action=event.target.closest('[data-music]')?.dataset.music;
    if(action==='play'){if(audio.paused)play();else{sequence++;audio.pause();status('已暂停');persist();}}
    if(action==='prev')select(selected-1);
    if(action==='next')select(selected+1);
    if(action==='repeat'){audio.loop=!audio.loop;persist();}
    if(action==='mute'){audio.muted=!audio.muted;}
    if(action==='list'){const list=$('#musicPlaylist');list.hidden=!list.hidden;$('[data-music="list"]').setAttribute('aria-expanded',String(!list.hidden));}
    paint();
  });
  $('#musicSeek').addEventListener('input',event=>{pendingTime=Number(event.target.value);if(loaded===selected&&Number.isFinite(audio.duration))audio.currentTime=pendingTime;paint();persist();});
  $('#musicVolume').addEventListener('input',event=>{audio.volume=Number(event.target.value)/100;audio.muted=false;paint();persist();});
  $('#musicFile').addEventListener('change',event=>{
    const file=event.target.files[0];if(!file)return;
    if(file.size>80*1024*1024){status('请选择小于 80 MB 的音频');return;}
    if(tracks.some(track=>track.local)){const localIndex=tracks.findIndex(track=>track.local);if(selected===localIndex){audio.pause();loaded=-1;}URL.revokeObjectURL(tracks[localIndex].url);tracks.splice(localIndex,1);}
    tracks.push({title:file.name.replace(/\.[^.]+$/,''),artist:'本机音频 · 仅供你试听',url:URL.createObjectURL(file),duration:0,local:true});playlist();select(tracks.length-1);play();event.target.value='';
  });
  audio.addEventListener('loadedmetadata',()=>{audio.currentTime=Math.min(pendingTime,Math.max(0,audio.duration-.05));tracks[selected].duration=audio.duration;paint();});
  audio.addEventListener('timeupdate',()=>{if(document.hidden)return;paint();if(Date.now()-lastSave>1500){persist();lastSave=Date.now();}});
  ['play','pause','volumechange'].forEach(type=>audio.addEventListener(type,paint));
  audio.addEventListener('ended',()=>{if(!audio.loop&&selected<tracks.length-1){select(selected+1);play();}else{pendingTime=0;audio.currentTime=0;status('播放结束');paint();persist();}});
  audio.addEventListener('error',()=>{if(audio.hasAttribute('src'))status('音频不可用，请选择其他曲目');});
  window.addEventListener('pagehide',persist);
  playlist();paint();
})();
