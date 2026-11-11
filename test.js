(function () {
  'use strict';

  /* ------------------------------------------------------------------
     Fragen
     Jede Antwort setzt einen Wert. Die Auswertung steht weiter unten.
     Richtwerte nach BBK: 2 Liter Flüssigkeit pro Person und Tag,
     Vorrat für 10 Tage.
  ------------------------------------------------------------------ */
  var QUESTIONS = [
    {
      id: 'ort', time: 'Tag 0 · 19:12 Uhr',
      scene: 'Der Fernseher geht aus. Das Licht auch. Dein Handy bleibt schwarz, egal welchen Knopf Du drückst.',
      text: 'Wo bist Du gerade zu Hause?',
      answers: [
        ['hoch', 'Stadtwohnung, vierter Stock oder höher'],
        ['stadt', 'Stadtwohnung weiter unten oder Reihenhaus'],
        ['klein', 'Haus in einer Kleinstadt'],
        ['land', 'Dorf oder Einzellage auf dem Land']
      ]
    },
    {
      id: 'erste', time: 'Tag 0 · 19:20 Uhr',
      scene: 'Vor der Tür stehen Nachbarn mit Kerzen. Niemand weiß etwas.',
      text: 'Was tust Du in der ersten Stunde?',
      answers: [
        ['warten', 'Abwarten. Morgen ist bestimmt alles wieder normal.'],
        ['markt', 'Schnell zum Supermarkt, solange noch offen ist.'],
        ['wasser', 'Badewanne, Eimer und Töpfe mit Wasser füllen, solange die Leitung noch läuft.'],
        ['reden', 'Rausgehen und mit den Nachbarn reden.']
      ]
    },
    {
      id: 'trinken', time: 'Tag 0 · 21:40 Uhr',
      scene: 'Inventur im Dunkeln. Du tastest Dich durch die Schränke.',
      text: 'Wie viel Wasser und andere Getränke hast Du pro Person im Haus?',
      answers: [
        ['1', 'Eine angebrochene Flasche'],
        ['2', 'Ein, zwei Sixpacks, also 5 bis 10 Liter'],
        ['3', 'Ein paar Kisten, um die 15 Liter'],
        ['4', '20 Liter oder mehr']
      ]
    },
    {
      id: 'essen', time: 'Tag 1 · 08:30 Uhr',
      scene: 'Der Kühlschrank ist warm. Die Milch riecht schon.',
      text: 'Wie lange könntest Du von dem leben, was ungekühlt im Schrank steht?',
      answers: [
        ['1', 'Ein, zwei Tage'],
        ['2', 'Drei bis fünf Tage'],
        ['3', 'Etwa eine Woche'],
        ['4', 'Zwei Wochen oder länger']
      ]
    },
    {
      id: 'kochen', time: 'Tag 1 · 12:15 Uhr',
      scene: 'Die Nudeln sind da. Der Herd bleibt kalt.',
      text: 'Wie machst Du etwas Warmes?',
      answers: [
        ['nichts', 'Gar nicht. Ich habe nur einen Elektroherd.'],
        ['grill', 'Mit dem Holzkohlegrill, draußen auf Balkon oder Terrasse'],
        ['kocher', 'Mit einem Campingkocher und Ersatzkartuschen'],
        ['ofen', 'Mit einem Kaminofen oder Holzherd']
      ]
    },
    {
      id: 'licht', time: 'Tag 1 · 19:30 Uhr',
      scene: 'Es wird wieder dunkel. Kein Motor, kein Fernseher, nirgends ein Bildschirm. Nur Stille.',
      text: 'Womit machst Du Licht, und wie erfährst Du, was los ist?',
      answers: [
        ['handy', 'Gar nicht. Mein Handy ist tot, und sonst habe ich nichts.'],
        ['kerzen', 'Kerzen und eine Taschenlampe, aber keine Ersatzbatterien'],
        ['lampen', 'Mehrere Taschenlampen und Ersatzbatterien'],
        ['radio', 'Lampen, Batterien und ein Radio mit Batterie oder Kurbel']
      ]
    },
    {
      id: 'medis', time: 'Tag 2 · 09:10 Uhr',
      scene: 'Vor der Apotheke hängt ein Zettel: „Geschlossen“.',
      text: 'Bist Du auf Medikamente angewiesen?',
      answers: [
        ['nein', 'Nein'],
        ['lang', 'Ja, und mein Vorrat reicht mehr als zwei Wochen'],
        ['woche', 'Ja, mein Vorrat reicht etwa eine Woche'],
        ['leer', 'Ja, und die Packung ist fast leer']
      ]
    },
    {
      id: 'klo', time: 'Tag 2 · 15:40 Uhr',
      scene: 'Du drückst die Spülung. Es passiert nichts.',
      text: 'Und jetzt?',
      answers: [
        ['ahnung', 'Keine Ahnung. Darüber habe ich nie nachgedacht.'],
        ['spuelen', 'Ich spüle mit Wasser aus meinem Vorrat.'],
        ['eimer', 'Eimer, Müllbeutel und Katzenstreu. Das kriege ich hin.'],
        ['set', 'Ich habe Notfall-Toilettenbeutel oder eine Campingtoilette.']
      ]
    },
    {
      id: 'geld', time: 'Tag 3 · 10:00 Uhr',
      scene: 'Ein Bäcker verkauft, was er noch hat. Am Kartenleser klebt ein Zettel.',
      text: 'Wie viel Bargeld hast Du zu Hause?',
      answers: [
        ['0', 'Fast nichts'],
        ['1', 'Unter 100 Euro'],
        ['2', '100 bis 500 Euro'],
        ['3', 'Mehr als 500 Euro']
      ]
    },
    {
      id: 'nachbarn', time: 'Tag 4 · 18:05 Uhr',
      scene: 'Es klopft an Deiner Tür.',
      text: 'Wie gut kennst Du die Menschen in Deiner Straße?',
      answers: [
        ['0', 'Gar nicht'],
        ['1', 'Vom Grüßen'],
        ['2', 'Man hilft sich, wenn es drauf ankommt.'],
        ['3', 'Wir haben sogar schon besprochen, was wir im Notfall tun.']
      ]
    }
  ];

  /* ------------------------------------------------------------------
     Auswertung
  ------------------------------------------------------------------ */
  var WATER_DAYS = { '1': 0.5, '2': 3.5, '3': 7.5, '4': 11 };   // Liter / 2 l pro Tag
  var FOOD_DAYS = { '1': 1.5, '2': 4, '3': 7, '4': 14 };
  var MEDS_DAYS = { nein: 999, lang: 18, woche: 7, leer: 2 };
  var COOK = { nichts: 0.7, grill: 0.95, kocher: 1, ofen: 1.05 };
  var LOC = { hoch: 0.9, stadt: 0.95, klein: 1, land: 1.05 };
  var FIRST = { warten: 0.95, markt: 0.97, wasser: 1, reden: 1.05 };
  var LIGHT = { handy: 0.85, kerzen: 0.95, lampen: 1, radio: 1.1 };
  var KLO = { ahnung: 0.85, spuelen: 1, eimer: 1, set: 1.05 };
  var CASH = { '0': 0.93, '1': 0.98, '2': 1.03, '3': 1.05 };
  var NEIGH = { '0': 0.88, '1': 1, '2': 1.1, '3': 1.2 };
  var HUNGER_BUFFER = 4; // Ohne Essen hält man länger durch als ohne Wasser

  function evaluate(a) {
    // Wasser
    var water = WATER_DAYS[a.trinken];
    if (a.ort !== 'hoch') water += 1;                         // Leitung läuft unten länger
    if (a.erste === 'wasser') water += (a.ort === 'hoch' ? 2 : 4);
    if (a.ort === 'land') water += 2;                         // Brunnen, Bach, Regentonne (abgekocht)
    if (a.ort === 'klein') water += 1;
    if (a.klo === 'spuelen') water *= 0.75;

    // Essen
    var food = FOOD_DAYS[a.essen] * COOK[a.kochen];
    if (a.erste === 'markt') food += 1;
    if (a.geld === '2' || a.geld === '3') food += 1;
    if (a.ort === 'land') food += 3;
    if (a.ort === 'klein') food += 1;
    var foodLimit = food + HUNGER_BUFFER;

    // Medikamente
    var meds = MEDS_DAYS[a.medis];

    var core = Math.min(water, foodLimit, meds);
    var weak = core === meds ? 'medis' : (core === water ? 'wasser' : 'essen');

    var mod = LOC[a.ort] * FIRST[a.erste] * LIGHT[a.licht] * KLO[a.klo] *
              CASH[a.geld] * NEIGH[a.nachbarn] * (a.kochen === 'ofen' ? 1.05 : 1);

    var days = Math.max(1, Math.round(core * mod));
    if (days > 30) days = 30;

    // Pluspunkt: das stärkste, was Du mitbringst
    var plusCandidates = [
      ['nachbarn', a.nachbarn === '3' ? 1.2 : (a.nachbarn === '2' ? 1.1 : 0)],
      ['reaktion', a.erste === 'wasser' ? 1.15 : 0],
      ['radio', a.licht === 'radio' ? 1.1 : 0],
      ['ofen', a.kochen === 'ofen' ? 1.1 : 0],
      ['lage', a.ort === 'land' ? 1.08 : 0],
      ['vorrat', (a.trinken === '4' && (a.essen === '3' || a.essen === '4')) ? 1.12 : 0],
      ['kocher', a.kochen === 'kocher' ? 1.04 : 0],
      ['hygiene', a.klo === 'set' ? 1.05 : 0],
      ['bargeld', a.geld === '3' ? 1.05 : (a.geld === '2' ? 1.03 : 0)],
      ['reden', a.erste === 'reden' ? 1.05 : 0]
    ];
    var plus = 'mut', best = 0;
    plusCandidates.forEach(function (c) { if (c[1] > best) { best = c[1]; plus = c[0]; } });
    if (plus === weak) plus = 'mut';

    return { days: days, weak: weak, plus: plus };
  }

  /* ------------------------------------------------------------------
     Texte für das Ergebnis
  ------------------------------------------------------------------ */
  var TIERS = [
    { max: 2, title: 'Die erste Nacht', text: 'Die erste Nacht überstehst Du. Danach wird es eng, und zwar schnell. Spätestens am zweiten Tag musst Du raus und suchen, was Dir fehlt. Genau wie alle anderen.' },
    { max: 5, title: 'Kerzenschein', text: 'Ein paar Tage gehen gut. Dann wird aus Abwarten Organisieren, und Du stehst mit vielen anderen vor denselben leeren Regalen.' },
    { max: 9, title: 'Durststrecke', text: 'Du bist besser vorbereitet als die meisten. Für einen langen Ausfall fehlt Dir trotzdem ein Stück. Die gute Nachricht: Es ist meist nur eine Sache.' },
    { max: 19, title: 'Vorbereitet', text: 'Du erfüllst die Empfehlung des BBK: zehn Tage aus eigener Kraft. Wenn es länger dauert, entscheidet bald etwas anderes, nämlich wem Du vertraust.' },
    { max: 30, title: 'Prepper', text: 'Christinas Eltern wären stolz auf Dich. Bleibt nur eine Frage: Was tust Du, wenn jemand an Deine Tür klopft und Hunger hat?' }
  ];

  var WEAK = {
    wasser: ['Wasser', 'Ohne Essen hält man Wochen durch, ohne Trinken nur wenige Tage. Das BBK rät zu 2 Litern pro Person und Tag.'],
    essen: ['Essen', 'Was ungekühlt im Schrank steht, entscheidet. Und ob Du es ohne Strom warm bekommst.'],
    medis: ['Medikamente', 'Dein Vorrat ist schneller leer als alles andere. Das BBK rät zu mindestens zehn Tagen. Sprich mit Deiner Arztpraxis oder Apotheke über eine Reserve.']
  };
  var PLUS = {
    nachbarn: ['Deine Nachbarn', 'Wer sich kennt, teilt. Und passt aufeinander auf. Im Ernstfall ist das mehr wert als jeder Vorrat.'],
    reaktion: ['Deine erste Stunde', 'Wasser abfüllen, solange die Leitung noch läuft: der klügste Zug in der ersten Stunde.'],
    radio: ['Dein Radio', 'Wer informiert ist, trifft bessere Entscheidungen und fällt auf weniger Gerüchte herein.'],
    ofen: ['Dein Ofen', 'Wärme und warmes Essen, ganz ohne Strom. Spätestens im Oktober ist das Gold wert.'],
    lage: ['Deine Lage', 'Auf dem Land gibt es Brunnen, Gärten und Holz. Und weniger Gedränge.'],
    vorrat: ['Dein Vorrat', 'Genug zu trinken und zu essen für über eine Woche. Damit bist Du den meisten weit voraus.'],
    kocher: ['Dein Kocher', 'Warmes Essen hält Körper und Laune am Leben.'],
    hygiene: ['Deine Notfalltoilette', 'Klingt unglamourös, verhindert aber Krankheiten. Daran denkt kaum jemand.'],
    bargeld: ['Dein Bargeld', 'Wenn kein Kartenleser mehr geht, zählt nur noch Bares.'],
    reden: ['Dein Instinkt', 'Du gehst auf Menschen zu. Gemeinsam weiß man mehr als allein.'],
    mut: ['Deine Neugier', 'Du hast Dich der Frage gestellt. Damit bist Du schon weiter als die meisten.']
  };

  function tierFor(days) {
    for (var i = 0; i < TIERS.length; i++) { if (days <= TIERS[i].max) return TIERS[i]; }
    return TIERS[TIERS.length - 1];
  }


  /* ------------------------------------------------------------------
     Ergebnis als Bild (1080 × 1350), wird nur im Browser gezeichnet
  ------------------------------------------------------------------ */
  var coverImg = null;
  function loadCover() {
    if (coverImg) return Promise.resolve(coverImg);
    return new Promise(function (res) {
      var im = new Image();
      im.onload = function () { coverImg = im; res(im); };
      im.onerror = function () { res(null); };
      im.src = 'assets/cover.jpg';
    });
  }
  function fontsReady() {
    if (!document.fonts || !document.fonts.load) return Promise.resolve();
    return Promise.all([
      document.fonts.load('400 100px Anton'),
      document.fonts.load('300 40px Inter'),
      document.fonts.load('600 40px Inter')
    ]).catch(function () {});
  }
  function fitText(ctx, text, font, size, maxW) {
    var s = size;
    ctx.font = font.replace('{s}', s);
    while (ctx.measureText(text).width > maxW && s > 10) { s -= 2; ctx.font = font.replace('{s}', s); }
    return s;
  }
  function wrap(ctx, text, maxW) {
    var words = text.split(' '), lines = [], line = '';
    words.forEach(function (w) {
      var t = line ? line + ' ' + w : w;
      if (ctx.measureText(t).width > maxW && line) { lines.push(line); line = w; } else { line = t; }
    });
    if (line) lines.push(line);
    return lines;
  }

  function buildPoster(r) {
    return Promise.all([fontsReady(), loadCover()]).then(function (res) {
      var cover = res[1];
      var W = 1080, H = 1350, P = 84;
      var cv = document.createElement('canvas');
      cv.width = W; cv.height = H;
      var ctx = cv.getContext('2d');
      var ACC = '#e8662a', INK = '#f2ede6', STONE = '#8f8a84', SOFT = '#d9d3ca', MUTED = '#a39d95';

      // Grund mit leiser Glut von unten
      ctx.fillStyle = '#0b0b0a'; ctx.fillRect(0, 0, W, H);
      var g = ctx.createRadialGradient(W * 0.5, H * 1.05, 40, W * 0.5, H * 1.05, H * 0.75);
      g.addColorStop(0, 'rgba(232,102,42,0.22)'); g.addColorStop(1, 'rgba(232,102,42,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 2;
      ctx.strokeRect(24, 24, W - 48, H - 48);

      // Kopf
      ctx.textBaseline = 'alphabetic';
      ctx.font = '400 54px Anton'; ctx.fillStyle = STONE;
      ctx.fillText('OHNE', P, 150);
      var ow = ctx.measureText('OHNE ').width;
      ctx.fillStyle = ACC; ctx.fillText('LICHT', P + ow, 150);
      ctx.font = '600 26px Inter'; ctx.fillStyle = MUTED;
      ctx.textAlign = 'right';
      ctx.fillText('B L A C K O U T - T E S T', W - P, 142);
      ctx.textAlign = 'left';

      // Zahl
      ctx.font = '600 34px Inter'; ctx.fillStyle = SOFT;
      ctx.fillText('ICH HALTE', P, 300);
      var label = r.days >= 30 ? '30+' : String(r.days);
      ctx.font = '400 400px Anton'; ctx.fillStyle = ACC;
      ctx.fillText(label, P - 10, 680);
      var nw = ctx.measureText(label).width;
      ctx.font = '400 110px Anton'; ctx.fillStyle = STONE;
      var unit = r.days === 1 ? 'TAG' : 'TAGE';
      var unitX = P + nw + 24;
      if (unitX + ctx.measureText(unit).width > W - P) unitX = W - P - ctx.measureText(unit).width;
      ctx.fillText(unit, unitX, 600);
      ctx.font = '400 70px Anton'; ctx.fillStyle = STONE;
      ctx.fillText('DURCH', unitX, 680);

      // Stufe
      var tier = tierFor(r.days).title.toUpperCase();
      fitText(ctx, tier, '400 {s}px Anton', 96, W - 2 * P);
      ctx.fillStyle = INK; ctx.fillText(tier, P, 815);

      // Engpass / Pluspunkt
      ctx.fillStyle = 'rgba(255,255,255,0.08)'; ctx.fillRect(P, 868, W - 2 * P, 2);
      var colW = (W - 2 * P - 40) / 2;
      [['ENGPASS', WEAK[r.weak][0]], ['PLUSPUNKT', PLUS[r.plus][0]]].forEach(function (c, i) {
        var x = P + i * (colW + 40);
        ctx.font = '600 24px Inter'; ctx.fillStyle = MUTED;
        ctx.fillText(c[0].split('').join(' '), x, 926);
        fitText(ctx, c[1], '600 {s}px Inter', 44, colW);
        ctx.fillStyle = i === 0 ? ACC : INK;
        ctx.fillText(c[1], x, 984);
      });
      ctx.fillStyle = 'rgba(255,255,255,0.08)'; ctx.fillRect(P, 1026, W - 2 * P, 2);

      // Fuß: Cover + Einladung
      var cw = 130, ch = 208, cy = H - P - ch + 6;
      if (cover) {
        ctx.save();
        ctx.shadowColor = 'rgba(232,102,42,0.25)'; ctx.shadowBlur = 40;
        ctx.drawImage(cover, P, cy, cw, ch);
        ctx.restore();
        ctx.strokeStyle = 'rgba(255,255,255,0.12)'; ctx.lineWidth = 2; ctx.strokeRect(P, cy, cw, ch);
      }
      var tx = cover ? P + cw + 40 : P, tw = W - P - tx;
      ctx.font = '600 44px Inter'; ctx.fillStyle = INK;
      var lines = wrap(ctx, 'Wie lange hältst Du durch?', tw);
      var ty = cy + 62;
      lines.forEach(function (l) { ctx.fillText(l, tx, ty); ty += 54; });
      ctx.font = '600 38px Inter'; ctx.fillStyle = ACC;
      ctx.fillText(SHARE_HOST, tx, ty + 20);
      ctx.font = '300 26px Inter'; ctx.fillStyle = MUTED;
      ctx.fillText('Der Test zum Thriller von Daniel Nagel', tx, ty + 70);

      return new Promise(function (res) {
        if (cv.toBlob) cv.toBlob(function (b) { res(b); }, 'image/png');
        else res(null);
      });
    });
  }

  /* ------------------------------------------------------------------
     Ablauf
  ------------------------------------------------------------------ */
  var $ = function (id) { return document.getElementById(id); };
  var views = { intro: $('v-intro'), q: $('v-q'), result: $('v-result') };
  var bar = $('bar');
  var meta = $('meta');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var SHARE_URL = document.body.getAttribute('data-share-url') || location.href.split('#')[0];
  var SHARE_HOST = SHARE_URL.replace(/^https?:\/\//, '').replace(/\.html$/, '').replace(/\/test$/, '/test');
  var posterBlob = null, posterUrl = null;

  var answers = {};
  var step = 0;
  var busy = false;
  var justFinished = false;

  function show(name) {
    Object.keys(views).forEach(function (k) {
      var v = views[k];
      if (k === name) {
        v.hidden = false;
        v.classList.remove('is-leaving');
        // Animation neu starten
        v.style.animation = 'none'; void v.offsetWidth; v.style.animation = '';
      } else {
        v.hidden = true;
      }
    });
    window.scrollTo(0, 0);
  }

  function leaveThen(fn) {
    var current = null;
    Object.keys(views).forEach(function (k) { if (!views[k].hidden) current = views[k]; });
    if (!current || reduce) { fn(); return; }
    current.classList.add('is-leaving');
    setTimeout(fn, 200);
  }

  function setProgress(n) { bar.style.width = (n / QUESTIONS.length * 100) + '%'; }

  function renderQuestion() {
    var q = QUESTIONS[step];
    $('q-time').textContent = q.time;
    $('q-scene').textContent = q.scene;
    $('q-text').textContent = q.text;
    meta.textContent = (step + 1) + ' / ' + QUESTIONS.length;
    setProgress(step);

    var box = $('q-answers');
    while (box.firstChild) box.removeChild(box.firstChild);
    q.answers.forEach(function (a, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'answer' + (answers[q.id] === a[0] ? ' was-picked' : '');
      var k = document.createElement('span');
      k.className = 'key';
      k.setAttribute('aria-hidden', 'true');
      k.textContent = 'ABCD'.charAt(i);
      var t = document.createElement('span');
      t.textContent = a[1];
      b.appendChild(k);
      b.appendChild(t);
      b.addEventListener('click', function () { pick(q.id, a[0], b); });
      box.appendChild(b);
    });
    $('back').hidden = false;
    show('q');
    $('q-text').focus({ preventScroll: true });
  }

  function pick(id, value, btn) {
    if (busy) return;
    busy = true;
    answers[id] = value;
    btn.classList.add('is-picked');
    setProgress(step + 1);
    setTimeout(function () {
      leaveThen(function () {
        busy = false;
        if (step < QUESTIONS.length - 1) { step++; renderQuestion(); }
        else { finish(); }
      });
    }, reduce ? 0 : 320);
  }

  function finish() {
    var r = evaluate(answers);
    justFinished = false;
    // Kein Ergebnis in der Adresse: Wer den Link teilt, schickt immer einen frischen Test
    if (location.hash) {
      try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {}
    }
    renderResult(r, true);
  }

  function parseHash() {
    var m = /^#ergebnis-(\d{1,2})-([a-z]+)-([a-z]+)$/.exec(location.hash);
    if (!m) return null;
    var days = Math.min(30, Math.max(1, parseInt(m[1], 10)));
    if (!WEAK[m[2]] || !PLUS[m[3]]) return null;
    return { days: days, weak: m[2], plus: m[3] };
  }

  function countUp(el, to) {
    if (reduce) { el.textContent = to; return; }
    var start = null, dur = 900 + to * 25;
    function tick(ts) {
      if (!start) start = ts;
      var p = Math.min(1, (ts - start) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * to);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function renderResult(r, own) {
    var tier = tierFor(r.days);
    var label = r.days >= 30 ? '30+' : String(r.days);
    $('r-kicker').textContent = own ? 'Dein Ergebnis' : 'Geteiltes Ergebnis';
    $('r-unit').textContent = r.days === 1 ? 'Tag' : 'Tage';
    $('r-tier').textContent = tier.title;
    $('r-verdict').textContent = own ? tier.text : 'Jemand hat den Blackout-Test gemacht und hält ' + label + (r.days === 1 ? ' Tag' : ' Tage') + ' durch. Schaffst Du mehr?';
    $('r-weak-title').textContent = WEAK[r.weak][0];
    $('r-weak-text').textContent = WEAK[r.weak][1];
    $('r-plus-title').textContent = PLUS[r.plus][0];
    $('r-plus-text').textContent = PLUS[r.plus][1];

    var link = SHARE_URL; // immer zum frischen Test
    var msg = 'Ich hätte den Blackout ' + label + (r.days === 1 ? ' Tag' : ' Tage') +
              ' durchgehalten. Mein Engpass: ' + WEAK[r.weak][0] + '. Wie lange schaffst Du es? ' + link;
    $('r-wa').href = 'https://wa.me/?text=' + encodeURIComponent(msg);
    $('r-share').hidden = !own;
    $('r-copy').hidden = !own;
    $('r-copied').textContent = '';
    $('r-copy').onclick = function () {
      var done = function () { $('r-copied').textContent = 'Link kopiert.'; };
      var fail = function () { $('r-copied').textContent = link; };
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(link).then(done, fail);
        else fail();
      } catch (e) { fail(); }
    };
    $('r-again').textContent = own ? 'Test neu starten' : 'Selbst testen';

    // Ergebnisbild
    if (own) {
      var img = $('r-img');
      img.alt = 'Ergebnisbild: ' + label + (r.days === 1 ? ' Tag' : ' Tage') + ', ' + tier.title + '. Engpass: ' + WEAK[r.weak][0] + '. Pluspunkt: ' + PLUS[r.plus][0] + '.';
      posterBlob = null;
      buildPoster(r).then(function (blob) {
        if (!blob) { $('r-img-btn').hidden = true; return; }
        posterBlob = blob;
        if (posterUrl) URL.revokeObjectURL(posterUrl);
        posterUrl = URL.createObjectURL(blob);
        img.src = posterUrl;
        var file = new File([blob], 'ohne-licht-' + label.replace('+', 'plus') + '-tage.png', { type: 'image/png' });
        var canShareFile = false;
        try { canShareFile = !!(navigator.canShare && navigator.canShare({ files: [file] })); } catch (e) {}
        $('r-img-label').textContent = canShareFile ? 'Bild teilen' : 'Bild speichern';
        $('r-img-btn').hidden = false;
        $('r-img-btn').onclick = function () {
          if (canShareFile) {
            navigator.share({ files: [file], text: msg }).catch(function () {});
          } else {
            var a = document.createElement('a');
            a.href = posterUrl; a.download = file.name;
            document.body.appendChild(a); a.click(); a.remove();
            $('r-copied').textContent = 'Bild gespeichert.';
          }
        };
      });
    }

    meta.textContent = 'Ergebnis';
    setProgress(QUESTIONS.length);
    $('back').hidden = true;
    show('result');
    var num = $('r-days');
    num.textContent = '0';
    if (r.days >= 30) { countUp(num, 30); setTimeout(function () { num.textContent = '30+'; }, reduce ? 0 : 1700); }
    else countUp(num, r.days);
  }

  function restart() {
    answers = {}; step = 0; justFinished = false;
    if (location.hash) {
      // Hash entfernen, ohne die Seite neu zu laden
      try { history.replaceState(null, '', location.pathname + location.search); } catch (e) { location.hash = ''; }
    }
    leaveThen(renderQuestion);
  }

  function route() {
    var r = parseHash();
    if (r) { renderResult(r, justFinished); justFinished = false; return; }
    if (!views.result.hidden) { answers = {}; step = 0; show('intro'); setProgress(0); meta.textContent = ''; }
  }

  $('start').addEventListener('click', function () { leaveThen(renderQuestion); });
  $('back').addEventListener('click', function () {
    if (busy) return;
    if (step === 0) { leaveThen(function () { show('intro'); setProgress(0); meta.textContent = ''; $('back').hidden = true; }); return; }
    step--; leaveThen(renderQuestion);
  });
  $('r-again').addEventListener('click', restart);
  window.addEventListener('hashchange', route);

  // Start: geteiltes Ergebnis direkt anzeigen, sonst Intro
  if (parseHash()) route(); else show('intro');
})();
