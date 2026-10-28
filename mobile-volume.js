/* mobile-volume.js
   يعرض شريط التحكم بالصوت أسفل زر الموسيقى، ثم يخفيه بعد 3 ثوانٍ
   من انتهاء التفاعل. يعتمد على أصناف HTML الموجودة بالموقع:
   .top-actions .music-control و .music-volume
*/
(() => {
  'use strict';

  const HIDE_DELAY = 3000;

  function initVolumeControls() {
    const controls = document.querySelectorAll('header .top-actions .music-control');

    controls.forEach((control) => {
      if (control.dataset.volumeAutoInit === '1') return;

      const volume = control.querySelector('.music-volume');
      if (!volume) return;

      control.dataset.volumeAutoInit = '1';
      let hideTimer = null;

      const isBeingUsed = () =>
        volume.matches(':hover') ||
        volume.contains(document.activeElement) ||
        control.matches(':hover');

      const hideLater = () => {
        window.clearTimeout(hideTimer);
        hideTimer = window.setTimeout(() => {
          if (isBeingUsed()) {
            hideLater();
            return;
          }
          control.classList.remove('volume-open');
        }, HIDE_DELAY);
      };

      const showVolume = () => {
        window.clearTimeout(hideTimer);
        control.classList.add('volume-open');
        hideLater();
      };

      // الضغط على زر الموسيقى أو لمس عناصر التحكم يُظهر الشريط.
      control.addEventListener('click', showVolume);
      control.addEventListener('pointerdown', showVolume);
      volume.addEventListener('input', showVolume);
      volume.addEventListener('change', showVolume);
      volume.addEventListener('pointerdown', showVolume);
      volume.addEventListener('focusin', showVolume);
      volume.addEventListener('pointerenter', showVolume);
      volume.addEventListener('pointerleave', hideLater);
      volume.addEventListener('focusout', hideLater);

      // عند بدء تشغيل أي صوت أو فيديو في الصفحة، أظهر الشريط لمدة 3 ثوانٍ.
      document.querySelectorAll('audio, video').forEach((media) => {
        media.addEventListener('play', showVolume);
      });

      // إعادة ضبط المؤقت عند تحريك المؤشر فوق الزر أو الشريط.
      control.addEventListener('pointerenter', showVolume);
      control.addEventListener('pointerleave', hideLater);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initVolumeControls, { once: true });
  } else {
    initVolumeControls();
  }
})();
