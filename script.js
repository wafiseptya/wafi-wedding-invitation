(function () {
  'use strict';

  /* guest name from ?to= */
  try { var to = new URLSearchParams(location.search).get('to'); if (to) { var g = document.getElementById('guestName'); if (g) g.textContent = to; } } catch (e) {}

  /* destination from ?destination= (1 = akad + resepsi 20 Sep, 2 = ngunduh mantu 23 Sep). Default 1 */
  var dest = document.documentElement.classList.contains('dest-2') ? '2' : '1';
  document.querySelectorAll('[data-dest]').forEach(function (el) { el.hidden = el.getAttribute('data-dest') !== dest; });
  var card = document.querySelector('.arch-card');
  if (card) card.classList.add('dest-' + dest);

  /* scroll lock until open */
  var locked = true;
  document.body.style.overflow = 'hidden';
  window.scrollTo(0, 0);
  function lock() { if (locked) window.scrollTo(0, 0); }
  window.addEventListener('scroll', lock, { passive: true });

  var audio = document.getElementById('music');
  var aBtn = document.getElementById('audioBtn');
  var icP = aBtn && aBtn.querySelector('.ic-pause');
  var icL = aBtn && aBtn.querySelector('.ic-play');
  function icon(on) { if (icP && icL) { icP.hidden = !on; icL.hidden = on; } }
  function play() { if (audio) audio.play().then(function(){icon(true);}).catch(function(){icon(false);}); }
  function toggle() { if (!audio) return; if (audio.paused) { audio.play().then(function(){icon(true);}).catch(function(){}); } else { audio.pause(); icon(false); } }
  if (aBtn) aBtn.addEventListener('click', toggle);
  document.addEventListener('visibilitychange', function () { if (!audio) return; if (document.hidden) audio.pause(); else if (!locked && !audio.paused) audio.play().catch(function(){}); });

  var cover = document.getElementById('section-cover');
  var openBtn = document.getElementById('btn-open');
  if (openBtn) openBtn.addEventListener('click', function (e) {
    e.preventDefault();
    locked = false;
    window.removeEventListener('scroll', lock);
    document.body.style.overflow = '';
    document.body.classList.add('invited');
    if (cover) {
      cover.classList.add('hide');
      setTimeout(function () { cover.classList.add('gone'); }, 950);
    }
    play();
    setTimeout(function () { var t = document.getElementById('buka'); if (t) t.scrollIntoView({ behavior: 'smooth' }); }, 250);
  });

  /* countdown */
  var cd = document.querySelector('.countdown');
  if (cd) {
    var target = new Date(cd.getAttribute('data-target-' + dest) || cd.getAttribute('data-target')).getTime();
    var n = {}; cd.querySelectorAll('.cd-n').forEach(function (x) { n[x.getAttribute('data-u')] = x; });
    var p = function (v) { return String(v).padStart(2, '0'); };
    function tick() {
      var diff = Math.max(0, target - Date.now());
      if (n.d) n.d.textContent = p(Math.floor(diff / 864e5));
      if (n.h) n.h.textContent = p(Math.floor(diff % 864e5 / 36e5));
      if (n.m) n.m.textContent = p(Math.floor(diff % 36e5 / 6e4));
      if (n.s) n.s.textContent = p(Math.floor(diff % 6e4 / 1e3));
    }
    tick(); setInterval(tick, 1000);
  }

  /* copy buttons */
  document.querySelectorAll('.btn-copy').forEach(function (b) {
    b.addEventListener('click', function () {
      var t = document.querySelector(b.getAttribute('data-copy'));
      if (t && navigator.clipboard) navigator.clipboard.writeText(t.textContent.trim());
      var o = b.innerHTML; b.innerHTML = '✓ Tersalin';
      setTimeout(function () { b.innerHTML = o; }, 1500);
    });
  });

  /* reveal */
  var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }); }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  /* bottom nav */
  var links = document.querySelectorAll('.bottom-nav .nv');
  links.forEach(function (a) { a.addEventListener('click', function (e) { if (locked) { e.preventDefault(); return; } var s = document.getElementById(a.getAttribute('data-t')); if (s) { e.preventDefault(); s.scrollIntoView({ behavior: 'smooth' }); } }); });
  var secs = ['section-cover', 'mempelai', 'acara', 'gift', 'wish'].map(function (id) { return document.getElementById(id); }).filter(Boolean);
  var no = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) links.forEach(function (a) { a.classList.toggle('active', a.getAttribute('data-t') === en.target.id); }); }); }, { threshold: 0.4 });
  secs.forEach(function (s) { no.observe(s); });

  /* demo comments */
  var C = [
    ['Bapak Harrysal', 'Alhamdulillah selamat yaa mas Ivan dan mba Indah, mudah-mudahan semua berjalan lancar pada H dan menjadi keluarga yang sakinah mawaddah warahmah serta segera dikaruniai keturunan yang sholeh sholehah..', '54 menit lalu'],
    ['Achmad Agus', 'Semoga acara nya lancar boyy. Semoga mnjadi keluarga yg samawa. Sekali lagi selamat ya boy.', '1 jam, 38 menit lalu'],
    ['Rifna', 'tiba2 nikah aja lu 😭 semoga dilancarkan ya senggg semoga samawwa ya besttt 💗 semoga bisa dateng 🥺', '14 jam, 53 menit lalu'],
    ['haniiii', 'lancar lancarrrrr yaaaa', '2 hari, 4 jam lalu'],
    ['Imron Rosidin', 'Lancar om sampe hari H..jadi warga pribumi karawang', '2 hari, 9 jam lalu'],
    ['Hanin', 'Masya Allah mudah mudahan dilancarkan yaa Indah dan calon suami, sampai hari H. Turut berbahagia atas kabar baiknya! 🤍', '3 hari, 6 jam lalu'],
    ['Amelia', "MasyaAllah, barakallahu lakuma wa baraka 'alaikuma wa jama'a bainakuma fi khair ✨ Lancar sampai hari-h ya kaaak 💖", '3 hari, 10 jam lalu'],
    ['Ansel', 'Happy wedding ya! Selamat atas hari bahagianya. Semoga lancar sampai hari H dan semoga kalian selalu bahagia serta langgeng selamanya 🤍', '3 hari, 11 jam lalu'],
    ['Melati', 'Omgg undangan tergemes yang pernah ada!! Selamat Indahh & Ivan, semoga bahagia selalu selamanya ya 💜💚', '4 hari, 5 jam lalu'],
    ['Diva', 'OMGGG CONGRATSSS BB 😍 lancar2 sampe hari H biii', '6 hari, 8 jam lalu'],
    ['Anita', 'Haiii, Indahhhhhhhh. Congratulation lancar sampai hari H yaaaaa. Semoga sakinnah, Mawaddah, Warrahmahhh ✨', '6 hari, 8 jam lalu'],
    ['Tiara', 'Finally!!! lancar sampai hari-h ya bebski 💖', '6 hari, 8 jam lalu']
  ];
  var ul = document.getElementById('comments');

  function addComment(name, text, time, top) {
    if (!ul) return;
    var li = document.createElement('li'); li.className = 'comment';
    li.innerHTML = '<p class="c-name"></p><p class="c-text"></p><span class="c-time"></span>';
    li.querySelector('.c-name').textContent = name;
    li.querySelector('.c-text').textContent = text;
    li.querySelector('.c-time').textContent = time;
    if (top && ul.firstChild) ul.insertBefore(li, ul.firstChild); else ul.appendChild(li);
  }

  /* ===== RSVP =====
     SHEET_URL   = Google Apps Script web app /exec URL (source of truth, page reads it back)
     FORMSPREE_URL = Formspree form endpoint (independent copy + email notification)
     Leave SHEET_URL empty to keep the demo comments below. */
  var SHEET_URL = 'https://script.google.com/macros/s/AKfycbz0zq5WEJH1Rrys4byJI2hzJHyEEBzD-U3pRmSZUNOspfQfOsPZDYfSj7qyzpbEXwtQ/exec';
  var FORMSPREE_URL = 'https://formspree.io/f/mvkogjyz';

  function ago(ts) {
    var d = Math.max(0, Date.now() - new Date(ts).getTime());
    var m = Math.floor(d / 6e4), h = Math.floor(d / 36e5), dy = Math.floor(d / 864e5);
    if (dy > 0) return dy + ' hari lalu';
    if (h > 0) return h + ' jam lalu';
    if (m > 0) return m + ' menit lalu';
    return 'baru saja';
  }

  var counts = { 'Hadir': 0, 'Tidak Hadir': 0, 'Masih Ragu': 0 };
  function paintCounts() {
    document.querySelectorAll('.rc-n').forEach(function (el) {
      var k = el.getAttribute('data-k');
      if (k in counts) el.textContent = counts[k];
    });
  }

  function loadWishes() {
    fetch(SHEET_URL).then(function (r) { return r.json(); }).then(function (d) {
      if (d.counts) { counts = d.counts; paintCounts(); }
      if (!ul || !d.wishes) return;
      ul.innerHTML = '';
      d.wishes.slice().reverse().forEach(function (w) {
        if (w.ucapan) addComment(w.nama, w.ucapan, ago(w.ts));
      });
    }).catch(function () {});
  }

  var form = document.getElementById('rsvpForm');
  var msg = document.getElementById('rsvpMsg');
  function say(text, isErr) {
    if (!msg) return;
    msg.textContent = text; msg.hidden = false;
    msg.classList.toggle('err', !!isErr);
  }

  if (form) {
    /* prefill from ?to= */
    try { if (to) form.nama.value = to; } catch (e) {}

    form.addEventListener('submit', function (e) {
      e.preventDefault(); /* always — never let the form navigate */
      if (form.website.value) return; /* honeypot */
      if (!SHEET_URL) { say('RSVP belum aktif.', true); return; }

      var data = {
        nama: form.nama.value.trim(),
        ucapan: form.ucapan.value.trim(),
        kehadiran: form.kehadiran.value
      };
      if (!data.nama || !data.kehadiran) { say('Isi nama dan konfirmasi kehadiran dulu ya.', true); return; }

      var btn = form.querySelector('.btn-kirim');
      btn.disabled = true; say('Mengirim...');

      /* backup log — fire and forget, never blocks the user */
      if (FORMSPREE_URL) {
        fetch(FORMSPREE_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(data)
        }).catch(function () {});
      }

      /* text/plain keeps this a simple request — Apps Script has no CORS preflight */
      fetch(SHEET_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(data)
      }).then(function (r) { return r.json(); }).then(function (res) {
        if (!res || !res.ok) throw new Error('rejected');
        if (data.ucapan) addComment(data.nama, data.ucapan, 'baru saja', true);
        counts[data.kehadiran] = (counts[data.kehadiran] || 0) + 1;
        paintCounts();
        form.ucapan.value = '';
        say('Terima kasih, ucapanmu sudah terkirim 💐');
      }).catch(function () {
        say('Gagal mengirim. Coba lagi sebentar lagi ya.', true);
      }).then(function () { btn.disabled = false; });
    });
  }

  /* ===== GALLERY LIGHTBOX ===== */
  (function () {
    var lb = document.getElementById('lightbox');
    if (!lb) return;

    /* every photo on the page, in document order — gallery + collage + profil + filmstrip */
    var imgs = [].slice.call(document.querySelectorAll('img[src*="assets/photos/"]'))
      .filter(function (im) { return !lb.contains(im); });
    if (!imgs.length) return;
    imgs.forEach(function (im) { im.classList.add('is-zoomable'); });

    var srcs = imgs.map(function (im) { return im.getAttribute('src'); });
    var lbImg = document.getElementById('lbImg');
    var lbCount = document.getElementById('lbCount');
    var stage = document.getElementById('lbStage');
    var idx = 0;
    var prevOverflow = '';

    function show(i, animate) {
      idx = (i + srcs.length) % srcs.length;
      if (animate) {
        lbImg.classList.add('is-swap');
        setTimeout(function () {
          lbImg.src = srcs[idx];
          lbImg.classList.remove('is-swap');
        }, 120);
      } else {
        lbImg.src = srcs[idx];
      }
      lbCount.textContent = (idx + 1) + ' / ' + srcs.length;
      /* preload neighbours */
      [srcs[(idx + 1) % srcs.length], srcs[(idx - 1 + srcs.length) % srcs.length]].forEach(function (s) {
        var p = new Image(); p.src = s;
      });
    }

    function open(i) {
      prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      document.body.classList.add('lb-open');
      lb.hidden = false;
      show(i, false);
      requestAnimationFrame(function () { lb.classList.add('is-open'); });
    }

    function close() {
      lb.classList.remove('is-open');
      document.body.classList.remove('lb-open');
      document.body.style.overflow = prevOverflow;
      setTimeout(function () { lb.hidden = true; lbImg.src = ''; }, 220);
    }

    document.addEventListener('click', function (e) {
      var im = e.target.closest && e.target.closest('img.is-zoomable');
      if (!im) return;
      var i = imgs.indexOf(im);
      if (i > -1) { e.preventDefault(); open(i); }
    });

    document.getElementById('lbClose').addEventListener('click', close);
    document.getElementById('lbPrev').addEventListener('click', function (e) { e.stopPropagation(); show(idx - 1, true); });
    document.getElementById('lbNext').addEventListener('click', function (e) { e.stopPropagation(); show(idx + 1, true); });

    /* click backdrop (not the photo) closes */
    stage.addEventListener('click', function (e) { if (e.target === stage) close(); });

    document.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') show(idx - 1, true);
      else if (e.key === 'ArrowRight') show(idx + 1, true);
    });

    /* swipe */
    var x0 = null, y0 = null;
    stage.addEventListener('touchstart', function (e) {
      x0 = e.touches[0].clientX; y0 = e.touches[0].clientY;
    }, { passive: true });
    stage.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      var dy = e.changedTouches[0].clientY - y0;
      x0 = null;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) show(idx + (dx < 0 ? 1 : -1), true);
    }, { passive: true });
  })();

  if (SHEET_URL) {
    loadWishes();
  } else {
    /* no endpoint configured yet — show demo comments */
    C.forEach(function (c) { addComment(c[0], c[1], c[2]); });
  }
})();
