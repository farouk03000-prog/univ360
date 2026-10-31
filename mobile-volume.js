/* mobile-volume.js
   يعرض شريط التحكم بالصوت أسفل زر الموسيقى على الهاتف، ثم يخفيه بعد
   3 ثوانٍ من انتهاء التفاعل. يعتمد على عناصر الموقع الموجودة:
   .top-actions .music-control و .music-volume

   كيف يعمل: يضيف الصنف volume-open إلى زر الموسيقى (و mv-js إلى <html>)،
   وملف mobile.css هو الذي يُظهر الشريط عند وجود volume-open.
   إن لم يُحمَّل هذا الملف لأي سبب، يعود mobile.css لإظهار الشريط عند
   اللمس/التركيز كما كان (لا يضيع التحكم بالصوت).

   تعديلات عن النسخة الأولى:
   - لا يعتمد على ترتيب تحميله بالنسبة إلى music.js (يُنفَّذ بعد أن يبني
     music.js الزر، وتتكرر المحاولة عند اكتمال تحميل الصفحة).
   - على شاشات اللمس لا يُحسب :hover (يبقى "عالقاً" بعد اللمس في بعض
     المتصفحات فيمنع الإخفاء)، ولا يُحسب التركيز بعد لمس الشريط
     بالإصبع؛ فقط التركيز بلوحة المفاتيح يُبقي الشريط ظاهراً.
*/
(() => {
  'use strict';

  const HIDE_DELAY = 3000;
  let mediaBound = false;
  const showers = [];

  // matches() آمنة: بعض المتصفحات القديمة لا تعرف :focus-visible
  const safeMatches = (el, selector) => {
    try { return el.matches(selector); } catch (e) { return false; }
  };
  const canHover = () => window.matchMedia('(hover: hover)').matches;

  function initVolumeControls() {
    const controls = document.querySelectorAll('header .top-actions .music-control');

    controls.forEach((control) => {
      if (control.dataset.volumeAutoInit === '1') return;

      const volume = control.querySelector('.music-volume');
      if (!volume) return;

      control.dataset.volumeAutoInit = '1';
      document.documentElement.classList.add('mv-js');
      let hideTimer = null;

      const isBeingUsed = () =>
        (canHover() && (safeMatches(volume, ':hover') || safeMatches(control, ':hover'))) ||
        safeMatches(volume, ':focus-visible');

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

      // إعادة ضبط المؤقت عند تحريك المؤشر فوق الزر أو الشريط.
      control.addEventListener('pointerenter', showVolume);
      control.addEventListener('pointerleave', hideLater);

      showers.push(showVolume);

      // عند بدء تشغيل أي صوت أو فيديو في الصفحة، أظهر الشريط لمدة 3 ثوانٍ.
      if (!mediaBound) {
        mediaBound = true;
        document.querySelectorAll('audio, video').forEach((media) => {
          media.addEventListener('play', () => showers.forEach((show) => show()));
        });
      }
    });
  }

  if (document.readyState === 'loading') {
    // بعد كل معالجات DOMContentLoaded الأخرى (music.js يبني الزر فيها).
    document.addEventListener('DOMContentLoaded', () => window.setTimeout(initVolumeControls, 0), { once: true });
  } else {
    initVolumeControls();
  }
  window.addEventListener('load', initVolumeControls, { once: true });
})();
