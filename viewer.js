(function(){
  'use strict';

  // This project no longer contains any panorama/navigation code: each pole
  // now embeds a separate 3DVista export via an iframe. This script only
  // wires that iframe up and hides the loading screen once it reports ready.
  const cfg = window.TOUR_CONFIG || {};
  const viewer = document.getElementById('viewer');
  const loading = document.getElementById('loading');
  if(!viewer) return;

  const frame = document.createElement('iframe');
  frame.id = 'tour-frame';
  frame.src = cfg.tourSrc || '';
  frame.title = cfg.poleTitleAr || cfg.poleTitleEn || '3DVista tour';
  frame.setAttribute('allow','fullscreen; xr-spatial-tracking; gyroscope; accelerometer');
  frame.setAttribute('allowfullscreen','');
  frame.loading = 'eager';

  const hide = () => loading && loading.classList.add('hidden');
  frame.addEventListener('load', hide);
  // Fallback in case the load event doesn't fire for some reason.
  setTimeout(hide, 6000);

  viewer.appendChild(frame);
})();
