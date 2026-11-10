(function () {
  'use strict';

  var WORDS = ['Netz', 'Wasser', 'Empfang', 'Bargeld', 'Benzin', 'Hilfe', 'Schutz', 'Ordnung', 'Licht'];
  var LEN = WORDS.length;
  var LAST = LEN - 1;
  var STEP_EM = 1.08;
  var FINAL_TITLE = 'OHNE Licht – Daniel Nagel';

  var page = document.querySelector('.page');
  var track = document.getElementById('track');
  var replayBtn = document.querySelector('.replay');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var idx = 0;
  var revealed = false;
  var timers = [];

  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
  function clearAll() { timers.forEach(clearTimeout); timers = []; }

  function moveTo(i, dur, ease) {
    idx = i;
    track.style.transition = dur ? 'transform ' + Math.round(dur) + 'ms ' + ease : 'none';
    track.style.transform = 'translateY(' + (-i * STEP_EM).toFixed(2) + 'em)';
    if (!revealed) document.title = 'OHNE ' + WORDS[i % LEN];
  }

  function reveal() {
    revealed = true;
    page.classList.add('is-revealed');
    document.title = FINAL_TITLE;
  }

  function cycle() {
    var slide = 700;
    var next = idx + 1;
    moveTo(next, slide, 'cubic-bezier(.65,0,.35,1)');
    later(function () { if (next >= LEN) moveTo(0, 0); }, slide + 20);
    var hold = (next % LEN === LAST) ? 4500 : 1600;
    later(cycle, slide + hold);
  }

  function play(isReplay) {
    clearAll();
    if (reduce) { moveTo(LAST, 0); reveal(); return; }
    moveTo(0, 0);
    var durs = [110, 115, 125, 145, 175, 225, 310, 720];
    var t = isReplay ? 300 : 650;
    for (var i = 1; i <= LAST; i++) {
      (function (step, d, at) {
        var ease = step === LAST ? 'cubic-bezier(.34,1.45,.6,1)' : 'cubic-bezier(.4,0,.6,1)';
        later(function () { moveTo(step, d, ease); }, at);
      })(i, durs[i - 1], t);
      t += durs[i - 1] + 30;
    }
    if (!revealed) later(reveal, t + 150);
    later(cycle, t + 4500);
  }

  replayBtn.addEventListener('click', function () { play(true); });

  // Pausiert die Walze, wenn der Tab im Hintergrund ist
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { clearAll(); }
    else if (!reduce) {
      if (!revealed) { moveTo(LAST, 0); reveal(); }
      else { moveTo(idx % LEN, 0); }
      later(cycle, 1600);
    }
  });

  // Christinas Zahlenfolge: taucht an zufälliger Stelle im Ticker auf
  var tt = document.querySelector('.tick-track');
  if (tt) {
    var n = tt.children.length / 2;
    var r = 3 + Math.floor(Math.random() * (n - 5));
    var mk = function (hidden) {
      var el = document.createElement('span');
      el.className = 'num';
      el.textContent = '3 9 13 47 23 42';
      if (hidden) el.setAttribute('aria-hidden', 'true');
      return el;
    };
    tt.insertBefore(mk(false), tt.children[r]);
    tt.insertBefore(mk(true), tt.children[n + 1 + r]);
  }

  // Wendecover
  var flip = document.querySelector('.flip');
  flip.addEventListener('click', function () {
    var on = flip.classList.toggle('is-flipped');
    flip.setAttribute('aria-pressed', on ? 'true' : 'false');
  });

  // Impressum & Datenschutz
  var legalBtn = document.querySelector('.legal-btn');
  var legal = document.getElementById('rechtliches');
  legalBtn.addEventListener('click', function () {
    var open = legal.classList.toggle('is-open');
    legalBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) {
      setTimeout(function () {
        legal.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      }, 120);
    }
  });

  // Start, sobald die Schrift geladen ist (sonst springt die Walze)
  var start = function () { play(false); };
  if (document.fonts && document.fonts.ready) {
    var started = false;
    var go = function () { if (!started) { started = true; start(); } };
    document.fonts.ready.then(go);
    setTimeout(go, 1500);
  } else {
    start();
  }
})();
