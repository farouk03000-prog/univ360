(function(){
  'use strict';
  // Opens a 3DVista tour (or any tourSrc) in a full-screen overlay directly
  // from a poles.html card, without navigating to an intermediate page.
  // A card opts in by adding data-tour-src="path/to/index.htm" — the card's
  // normal href is left in place as a no-JS / direct-link fallback.
  // While the overlay is open, <html> gets the class "tour-open" so the
  // page header stays on top (see tour-overlay.css), and the header's
  // "Poles" button (.tour-back) closes the tour.

  var root = document.documentElement;
  var overlay = document.getElementById('tourOverlay');
  var frame = null; // created fresh on every open (see openTour)
  var loading = document.getElementById('tourOverlayLoading');
  var backBtn = document.querySelector('.tour-back');
  var poleLabel = document.querySelector('.tour-pole-label');
  if(!overlay) return;

  var HASH = '#tour';
  var pushedState = false;

  function langValue(el, lang){
    var v = el.getAttribute('data-' + lang);
    return v === null ? (el.getAttribute('data-en') || el.getAttribute('data-ar') || '') : v;
  }

  // Show the pole name (translated, and kept in sync by i18n.js on language
  // change) next to the wordmark, copied from the card's title.
  function setPoleLabel(titleEl){
    if(!poleLabel) return;
    if(titleEl){
      ['ar','en','es','fr'].forEach(function(l){
        poleLabel.setAttribute('data-' + l, titleEl.getAttribute('data-' + l) || titleEl.textContent.trim());
      });
      poleLabel.innerHTML = langValue(poleLabel, root.lang || 'ar');
    }
  }

  function openTour(src, titleEl){
    if(!overlay.hidden) return;
    if(loading) loading.classList.remove('hidden');
    setPoleLabel(titleEl);
    // A brand-new iframe per open (src set BEFORE it is attached): re-pointing
    // an existing iframe adds extra browser-history entries and would break the
    // browser Back button / close behaviour on the second opening.
    frame = document.createElement('iframe');
    frame.className = 'tour-overlay-frame';
    frame.title = titleEl ? titleEl.textContent.trim() : 'جولة افتراضية 360°';
    frame.setAttribute('allow','fullscreen; xr-spatial-tracking; gyroscope; accelerometer');
    frame.setAttribute('allowfullscreen','');
    var thisFrame = frame;
    frame.addEventListener('load', function(){
      if(thisFrame === frame && loading) loading.classList.add('hidden');
    });
    frame.src = src;
    overlay.appendChild(frame);
    overlay.hidden = false;
    root.classList.add('tour-open');
    root.style.overflow = 'hidden';
    if(location.hash !== HASH){
      history.pushState({tourOverlay:true}, '', HASH);
      pushedState = true;
    }
  }

  function closeTour(fromPopstate){
    overlay.hidden = true;
    if(frame){ frame.remove(); frame = null; }
    root.classList.remove('tour-open');
    root.style.overflow = '';
    if(loading) loading.classList.add('hidden');
    if(!fromPopstate && pushedState && location.hash === HASH){
      history.back();
    }
    pushedState = false;
  }

  if(backBtn){
    backBtn.addEventListener('click', function(e){
      e.preventDefault();
      if(!overlay.hidden) closeTour(false);
    });
  }

  window.addEventListener('popstate', function(){
    if(!overlay.hidden) closeTour(true);
  });

  window.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && !overlay.hidden) closeTour(false);
  });

  var cards = document.querySelectorAll('[data-tour-src]');
  for(var i=0;i<cards.length;i++){
    (function(card){
      card.addEventListener('click', function(e){
        e.preventDefault();
        openTour(card.getAttribute('data-tour-src'), card.querySelector('h2'));
      });
    })(cards[i]);
  }
})();
