(function(){
  'use strict';
  var STORAGE_KEY='univ360-lang';
  var supported=['ar','en','fr','es'];
  var lang=localStorage.getItem(STORAGE_KEY)||'ar';
  if(supported.indexOf(lang)<0) lang='ar';
  var names={ar:'العربية',en:'English',fr:'Français',es:'Español'};
  var short={ar:'AR',en:'EN',fr:'FR',es:'ES'};
  var flags={ar:'assets/flags/ar.png',en:'assets/flags/en.png',fr:'assets/flags/fr.png',es:'assets/flags/es.png'};
  function esc(v){return String(v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function apply(){
    document.documentElement.lang=lang;
    document.documentElement.dir=lang==='ar'?'rtl':'ltr';
    document.querySelectorAll('[data-ar]').forEach(function(el){
      var value=el.getAttribute('data-'+lang);
      if(value===null) value=el.getAttribute('data-en')||el.getAttribute('data-ar')||'';
      el.innerHTML=value;
    });
    document.querySelectorAll('[data-ar-title]').forEach(function(el){
      var value=el.getAttribute('data-'+lang+'-title')||el.getAttribute('data-en-title')||el.getAttribute('data-ar-title');
      el.setAttribute('title',value);
    });
    var titleMap={
      'index.html':{ar:'جامعة عمار ثليجي | الجولة الافتراضية',en:'Amar Telidji University | Virtual Tour',fr:'Université Amar Telidji | Visite virtuelle',es:'Universidad Amar Telidji | Visita virtual'},
      'poles.html':{ar:'أقطاب الجامعة | جامعة عمار ثليجي',en:'University Poles | Amar Telidji University',fr:'Pôles universitaires | Université Amar Telidji',es:'Polos universitarios | Universidad Amar Telidji'},
      'economic.html':{ar:'كلية الاقتصاد | جامعة عمار ثليجي',en:'Economic Pole | Amar Telidji University',fr:'Pôle économique | Université Amar Telidji',es:'Polo Económico | Universidad Amar Telidji'},
      'literary.html':{ar:'القطب 1 | جامعة عمار ثليجي',en:'Literary Pole | Amar Telidji University',fr:'Pôle des lettres | Université Amar Telidji',es:'Polo de Letras | Universidad Amar Telidji'},
      'science-tech.html':{ar:'القطب 2 | جامعة عمار ثليجي',en:'Science & Technology Pole | Amar Telidji University',fr:'Pôle scientifique et technologique | Université Amar Telidji',es:'Polo Científico y Tecnológico | Universidad Amar Telidji'},
      'social-medical.html':{ar:'القطب 1 - مقر رئاسة الجامعة | جامعة عمار ثليجي',en:'University Presidency Headquarters | Amar Telidji University',fr:'Siège de la Présidence | Université Amar Telidji',es:'Sede de la Presidencia | Universidad Amar Telidji'}
    };
    var key=(location.pathname.split('/').pop()||'index.html');
    if(titleMap[key]) document.title=titleMap[key][lang];
    var btn=document.getElementById('langToggle');
    if(btn){
      var flag=btn.querySelector('.lang-globe');
      if(flag){
        flag.innerHTML='<img class="current-language-flag" src="'+flags[lang]+'" alt="" aria-hidden="true"/>';
        flag.classList.add('has-flag');
      }
      var cur=btn.querySelector('.lang-current'); if(cur)cur.textContent=short[lang];
      btn.setAttribute('aria-label',lang==='ar'?'اختيار اللغة':lang==='fr'?'Choisir la langue':lang==='es'?'Elegir idioma':'Choose language');
      btn.setAttribute('title',names[lang]);
      btn.classList.toggle('is-open',!!document.querySelector('.language-menu.is-open'));
    }
    window.dispatchEvent(new CustomEvent('languagechange',{detail:{lang:lang}}));
  }
  function closeMenu(){var m=document.querySelector('.language-menu');if(m){m.classList.remove('is-open');m.setAttribute('aria-hidden','true');}var b=document.getElementById('langToggle');if(b)b.setAttribute('aria-expanded','false');}
  function openMenu(){var b=document.getElementById('langToggle');if(!b)return;var m=document.querySelector('.language-menu');if(!m){m=document.createElement('div');m.className='language-menu';m.setAttribute('role','menu');m.setAttribute('aria-hidden','false');supported.forEach(function(code){var item=document.createElement('button');item.type='button';item.className='language-option';item.setAttribute('role','menuitem');item.dataset.lang=code;item.innerHTML='<img class="language-flag" src="'+flags[code]+'" alt="" loading="lazy"/><span class="language-name">'+esc(names[code])+'</span>';item.addEventListener('click',function(){setSiteLanguage(code);closeMenu();});m.appendChild(item);});b.parentNode.appendChild(m);}m.classList.toggle('is-open');m.setAttribute('aria-hidden',m.classList.contains('is-open')?'false':'true');b.setAttribute('aria-expanded',m.classList.contains('is-open')?'true':'false');}
  window.getSiteLanguage=function(){return lang;};
  window.setSiteLanguage=function(next){if(supported.indexOf(next)<0)return;lang=next;localStorage.setItem(STORAGE_KEY,lang);apply();};
  document.addEventListener('DOMContentLoaded',function(){
    var btn=document.getElementById('langToggle');
    if(btn) btn.addEventListener('click',function(e){e.stopPropagation();openMenu();});
    document.addEventListener('click',function(e){if(!e.target.closest||!e.target.closest('.top-actions'))closeMenu();});
    apply();
  });
})();