(function () {
  'use strict';

  /* ---------- Guest name from ?to= ---------- */
  try {
    var to = new URLSearchParams(location.search).get('to');
    if (to) {
      var el = document.getElementById('guestName');
      if (el) el.textContent = to;
    }
  } catch (e) {}

  /* ---------- Scroll lock until OPEN ---------- */
  var locked = true;
  document.body.style.overflow = 'hidden';
  window.scrollTo(0, 0);
  function lockScroll(e) { if (locked) window.scrollTo(0, 0); }
  window.addEventListener('scroll', lockScroll, { passive: true });

  var audio = document.getElementById('weddingAudio');
  var audioBtn = document.getElementById('audioButton');
  var icPause = audioBtn ? audioBtn.querySelector('.ic-pause') : null;
  var icPlay = audioBtn ? audioBtn.querySelector('.ic-play') : null;

  function setAudioIcon(playing) {
    if (!icPause || !icPlay) return;
    icPause.hidden = !playing;
    icPlay.hidden = playing;
  }
  function playAudio() { if (audio) { audio.play().then(function(){setAudioIcon(true);}).catch(function(){setAudioIcon(false);}); } }
  function toggleAudio() {
    if (!audio) return;
    if (audio.paused) { audio.play().then(function(){setAudioIcon(true);}).catch(function(){}); }
    else { audio.pause(); setAudioIcon(false); }
  }
  if (audioBtn) audioBtn.addEventListener('click', toggleAudio);
  document.addEventListener('visibilitychange', function () {
    if (!audio) return;
    if (document.visibilityState === 'visible') { if (!locked && !audio.paused) audio.play().catch(function(){}); }
    else audio.pause();
  });

  var cover = document.getElementById('cover');
  var btnCover = document.getElementById('btn-cover');
  if (btnCover) {
    btnCover.addEventListener('click', function (e) {
      e.preventDefault();
      locked = false;
      window.removeEventListener('scroll', lockScroll);
      document.body.style.overflow = '';
      if (cover) cover.classList.add('hide');
      playAudio();
      var target = document.getElementById('ayatsuci');
      setTimeout(function () {
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      }, 250);
    });
  }

  /* ---------- Countdown ---------- */
  var cd = document.querySelector('.countdown');
  if (cd) {
    var target = new Date(cd.getAttribute('data-target')).getTime();
    var nums = {};
    cd.querySelectorAll('.cd-num').forEach(function (n) { nums[n.getAttribute('data-u')] = n; });
    var pad = function (n) { return String(n).padStart(2, '0'); };
    function tick() {
      var diff = target - Date.now();
      if (diff < 0) diff = 0;
      var d = Math.floor(diff / 86400000);
      var h = Math.floor(diff % 86400000 / 3600000);
      var m = Math.floor(diff % 3600000 / 60000);
      var s = Math.floor(diff % 60000 / 1000);
      if (nums.d) nums.d.textContent = pad(d);
      if (nums.h) nums.h.textContent = pad(h);
      if (nums.m) nums.m.textContent = pad(m);
      if (nums.s) nums.s.textContent = pad(s);
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ---------- Save-the-date carousel ---------- */
  var slides = document.querySelectorAll('.sd-slide');
  if (slides.length > 1) {
    var idx = 0;
    setInterval(function () {
      slides[idx].classList.remove('active');
      idx = (idx + 1) % slides.length;
      slides[idx].classList.add('active');
    }, 3000);
  }

  /* ---------- Gift reveal + copy ---------- */
  var giftBtn = document.getElementById('btn-gift');
  var giftReveal = document.getElementById('gift-reveal');
  if (giftBtn && giftReveal) {
    giftBtn.addEventListener('click', function () {
      giftReveal.hidden = !giftReveal.hidden;
    });
  }
  document.querySelectorAll('.btn-copy').forEach(function (b) {
    b.addEventListener('click', function () {
      var sel = b.getAttribute('data-copy');
      var t = sel ? document.querySelector(sel) : null;
      if (t) {
        navigator.clipboard && navigator.clipboard.writeText(t.textContent.trim());
        var old = b.textContent; b.textContent = 'Tersalin';
        setTimeout(function () { b.textContent = old; }, 1500);
      }
    });
  });

  /* ---------- Wishes counter ---------- */
  var ta = document.querySelector('.wf-textarea');
  var counter = document.querySelector('.wf-counter');
  if (ta && counter) {
    ta.addEventListener('input', function () {
      counter.textContent = (1000 - ta.value.length);
    });
  }

  /* ---------- Reveal on scroll (IntersectionObserver) ---------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  /* ---------- Bottom nav active state + smooth scroll ---------- */
  var navLinks = document.querySelectorAll('.bottom-nav .nav-ic');
  navLinks.forEach(function (a) {
    a.addEventListener('click', function (e) {
      if (locked) { e.preventDefault(); return; }
      var id = a.getAttribute('data-target');
      var sec = document.getElementById(id);
      if (sec) { e.preventDefault(); sec.scrollIntoView({ behavior: 'smooth' }); }
    });
  });
  var sections = ['cover', 'profil', 'event', 'rsvp', 'wishes'].map(function (id) { return document.getElementById(id); }).filter(Boolean);
  var navObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        navLinks.forEach(function (a) { a.classList.toggle('active', a.getAttribute('data-target') === en.target.id); });
      }
    });
  }, { threshold: 0.5 });
  sections.forEach(function (s) { navObs.observe(s); });
})();
