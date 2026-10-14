(function(){
  'use strict';

  var SRC='assets/music/site-music.mp3';
  var PLAY_KEY='univ360-v15-music-playing';
  var VOLUME_KEY='univ360-v15-music-volume';
  var TIME_KEY='univ360-v15-music-time';
  var audio, box, playBtn, slider, saveTimer;

  function iconPlay(){return '<svg class="music-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M8 5.2v13.6c0 .8.9 1.3 1.6.9l10.3-6.8c.7-.5.7-1.5 0-2L9.6 4.3C8.9 3.9 8 4.4 8 5.2Z"/></svg>';}
  function iconPause(){return '<svg class="music-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 5h3v14H7zM14 5h3v14h-3z"/></svg>';}
  function iconNote(){return '<svg class="music-note" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M15 4v10.1a4 4 0 1 1-2-3.46V6.2l7-1.75V8h-2V7l-3 .75V4h0Z"/></svg>';}
  function isEnglish(){return document.documentElement.lang==='en';}
  function getItem(k,f){try{var v=localStorage.getItem(k);return v===null?f:v;}catch(e){return f;}}
  function setItem(k,v){try{localStorage.setItem(k,String(v));}catch(e){}}
  function removeItem(k){try{localStorage.removeItem(k);}catch(e){}}
  function labels(){
    if(!playBtn)return;
    var playing=audio&&!audio.paused;
    playBtn.innerHTML=playing?iconPause():iconPlay();
    var t=playing?(isEnglish()?'Pause music':'إيقاف الموسيقى'):(isEnglish()?'Play music':'تشغيل الموسيقى');
    playBtn.title=t;playBtn.setAttribute('aria-label',t);
    if(slider)slider.setAttribute('aria-label',isEnglish()?'Music volume':'مستوى صوت الموسيقى');
  }
  function saveTime(){if(audio&&isFinite(audio.currentTime))setItem(TIME_KEY,audio.currentTime);}
  function restoreTime(){
    if(!audio)return;
    var saved=parseFloat(getItem(TIME_KEY,'0'));
    if(isFinite(saved)&&saved>0){try{audio.currentTime=saved;}catch(e){}}
  }
  function play(userAction){
    if(!audio)return;
    if(userAction)setItem(PLAY_KEY,'1');
    audio.volume=Math.max(0,Math.min(1,audio.volume));
    var p=audio.play();
    if(p&&p.then)p.then(function(){setItem(PLAY_KEY,'1');box&&box.classList.add('is-playing');labels();}).catch(function(){labels();});
  }
  function pause(userAction){
    if(!audio)return;
    audio.pause();
    if(userAction)setItem(PLAY_KEY,'0');
    saveTime();
    if(box)box.classList.remove('is-playing');
    labels();
  }

  function build(){
    var actions=document.querySelector('.top-actions'), langBtn=document.getElementById('langToggle');
    if(!actions||!langBtn)return;

    audio=document.createElement('audio');
    audio.src=SRC;
    audio.loop=true;
    audio.preload='auto';
    audio.autoplay=true;
    audio.setAttribute('autoplay','');
    audio.volume=0.20;

    var savedVol=parseFloat(getItem(VOLUME_KEY,'0.20'));
    if(isFinite(savedVol))audio.volume=Math.max(0,Math.min(1,savedVol));
    else audio.volume=0.20;
    if(getItem(VOLUME_KEY,null)===null)setItem(VOLUME_KEY,'0.20');
    document.body.appendChild(audio);

    box=document.createElement('div');
    box.className='music-control';
    box.setAttribute('role','group');
    box.setAttribute('aria-label','Background music');
    playBtn=document.createElement('button');
    playBtn.className='music-play';playBtn.type='button';
    var note=document.createElement('span');note.className='music-note-wrap';note.innerHTML=iconNote();note.setAttribute('aria-hidden','true');
    slider=document.createElement('input');slider.className='music-volume';slider.type='range';slider.min='0';slider.max='1';slider.step='0.01';slider.value=String(audio.volume);
    box.appendChild(playBtn);box.appendChild(note);box.appendChild(slider);actions.insertBefore(box,langBtn);

    playBtn.addEventListener('click',function(){if(audio.paused)play(true);else pause(true);});
    slider.addEventListener('input',function(){audio.volume=parseFloat(slider.value);setItem(VOLUME_KEY,audio.volume);});
    audio.addEventListener('play',function(){box.classList.add('is-playing');labels();});
    audio.addEventListener('pause',function(){box.classList.remove('is-playing');labels();saveTime();});
    audio.addEventListener('loadedmetadata',function(){restoreTime();});
    audio.addEventListener('timeupdate',function(){if(!saveTimer)saveTimer=setTimeout(function(){saveTimer=null;saveTime();},700);});
    audio.addEventListener('ended',function(){setItem(TIME_KEY,'0');});
    window.addEventListener('pagehide',saveTime);
    window.addEventListener('beforeunload',saveTime);

    labels();

    /*
      First page: automatic playback at 20%.
      Other pages: continue automatically only if the user previously left music ON.
      Once the user presses Pause, the preference remains OFF across every page.
    */
    var preferred=getItem(PLAY_KEY,null);
    var shouldPlay=(preferred===null||preferred==='1');
    if(shouldPlay){
      play(false);
      /* Audible autoplay can be blocked by the browser. On the first permitted
         user gesture, resume automatically unless the user explicitly paused. */
      var resume=function(){
        if(audio&&audio.paused&&getItem(PLAY_KEY,'1')!=='0')play(false);
      };
      document.addEventListener('pointerdown',resume,{once:true});
      document.addEventListener('keydown',resume,{once:true});
      document.addEventListener('touchstart',resume,{once:true});
    }else{
      pause(false);
    }
  }
  document.addEventListener('DOMContentLoaded',build);
})();
