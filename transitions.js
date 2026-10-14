(function(){
  'use strict';
  // Browsers without native cross-document View Transitions get a quiet fallback fade-in.
  if(!('startViewTransition' in document)){
    var reveal=function(){document.body.classList.add('page-ready')};
    if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',reveal)}else{reveal()}
  }
})();
