/* Тридцать первое — общий скрипт для всех страниц */
(function () {
  'use strict';

  var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Обратный отсчёт ---------- */

  function nextDate(month, day) {
    var now = new Date();
    var target = new Date(now.getFullYear(), month - 1, day, 0, 0, 0);
    if (target <= now) target.setFullYear(target.getFullYear() + 1);
    return target;
  }

  function startCountdown(box) {
    var parts = box.dataset.countdown.split('-');
    var target = nextDate(+parts[0], +parts[1]);
    var d = box.querySelector('.cd-d');
    var h = box.querySelector('.cd-h');
    var m = box.querySelector('.cd-m');
    var s = box.querySelector('.cd-s');

    function pad(n) { return n < 10 ? '0' + n : String(n); }

    function tick() {
      var left = Math.max(0, target - new Date());
      var sec = Math.floor(left / 1000);
      d.textContent = Math.floor(sec / 86400);
      h.textContent = pad(Math.floor(sec / 3600) % 24);
      m.textContent = pad(Math.floor(sec / 60) % 60);
      s.textContent = pad(sec % 60);
    }

    tick();
    setInterval(tick, 1000);
  }

  document.querySelectorAll('[data-countdown]').forEach(startCountdown);

  /* ---------- Снегопад ---------- */

  var canvas = document.getElementById('snow');
  if (canvas && !calm) {
    var ctx = canvas.getContext('2d');
    var flakes = [];
    var w = 0, h = 0;

    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      var count = Math.round(w * h / 14000);
      flakes = [];
      for (var i = 0; i < count; i++) {
        flakes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 1.9 + 0.6,
          sp: Math.random() * 0.5 + 0.2,
          sw: Math.random() * 0.7 + 0.2,
          ph: Math.random() * Math.PI * 2
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = 'rgba(223, 236, 246, 0.75)';
      for (var i = 0; i < flakes.length; i++) {
        var f = flakes[i];
        f.y += f.sp;
        f.ph += 0.008;
        f.x += Math.sin(f.ph) * f.sw * 0.35;
        if (f.y > h + 4) { f.y = -4; f.x = Math.random() * w; }
        ctx.globalAlpha = f.r > 1.6 ? 0.85 : 0.45;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
      }
      requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener('resize', resize);
    requestAnimationFrame(draw);
  }

  /* ---------- Костюм из того, что дома ---------- */

  var costumes = [
    { name: 'Призрак', items: 'Белая простыня, ножницы, чёрный маркер',
      how: 'Вырежьте два отверстия для глаз и обведите их широкой каймой. Края простыни не подшивайте — рваный низ выглядит убедительнее ровного.' },
    { name: 'Вампир из бухгалтерии', items: 'Белая рубашка, чёрный пиджак, красная помада',
      how: 'Воротник поднимите, галстук ослабьте. Две точки помадой на шее и капля в углу рта — больше ничего не нужно.' },
    { name: 'Ведьма', items: 'Чёрное платье, шарф, длинная палка',
      how: 'Шарф повяжите на пояс узлами наружу. Волосы начешите и не расчёсывайте — весь образ держится на них.' },
    { name: 'Мумия', items: 'Старая простыня, бинт из аптечки, чай',
      how: 'Порвите простыню на полосы, замочите в крепком чае на десять минут и высушите феном. Обматывайтесь неровно, оставляя просветы.' },
    { name: 'Чучело с огорода', items: 'Клетчатая рубашка, солома или бумага, румяна',
      how: 'Пучки соломы закрепите в рукавах и вороте. На щеках нарисуйте круглые пятна румян, от губ — короткие стежки чёрным карандашом.' },
    { name: 'Чёрная кошка', items: 'Чёрная водолазка, ободок, картон, карандаш для глаз',
      how: 'Два картонных треугольника на ободок, обмотать чёрной тканью. Нос закрасьте, усы проведите одной линией, не тремя.' },
    { name: 'Скелет', items: 'Чёрная одежда, белая изолента или малярный скотч',
      how: 'Наклейте рёбра дугами от центра груди и полосы на руках и ногах. Симметрию не выверяйте — на расстоянии её всё равно не видно.' },
    { name: 'Тыквенный человек', items: 'Оранжевая футболка, зелёная шапка, чёрная бумага',
      how: 'Вырежьте глаза-треугольники и зубчатый рот, приклейте на футболку скотчем с изнанки. Шапка изображает хвостик.' }
  ];

  var costumeBtn = document.getElementById('costumeBtn');
  if (costumeBtn) {
    var last = -1;
    costumeBtn.addEventListener('click', function () {
      var i = last;
      while (i === last) i = Math.floor(Math.random() * costumes.length);
      last = i;
      var c = costumes[i];
      document.getElementById('costumeName').textContent = c.name;
      document.getElementById('costumeItems').textContent = c.items;
      document.getElementById('costumeHow').textContent = c.how;
      document.getElementById('costumeCard').hidden = false;
      costumeBtn.textContent = 'Другой костюм';
    });
  }

  /* ---------- Калькулятор оливье ---------- */

  var guests = document.getElementById('guests');
  if (guests) {
    var cells = document.querySelectorAll('.calc-table td[data-per]');
    var note = document.getElementById('calcNote');

    function recalc() {
      var n = Math.min(30, Math.max(1, parseInt(guests.value, 10) || 1));
      var totalGrams = 0;

      cells.forEach(function (cell) {
        var per = parseFloat(cell.dataset.per);
        var unit = cell.dataset.unit;
        var value = per * n;

        if (unit === 'шт') {
          cell.textContent = Math.max(1, Math.round(value)) + ' шт';
          totalGrams += Math.round(value) * 45;
        } else if (value >= 1000) {
          cell.textContent = (value / 1000).toFixed(1).replace('.', ',') + ' кг';
          totalGrams += value;
        } else {
          cell.textContent = Math.round(value) + ' г';
          totalGrams += value;
        }
      });

      var kg = (totalGrams / 1000).toFixed(1).replace('.', ',');
      note.textContent = 'Выйдет около ' + kg + ' кг салата. Нарезайте кубиком в 7–8 мм и заправляйте перед подачей, иначе к утру оливье пустит сок.';
    }

    guests.addEventListener('input', recalc);
    recalc();
  }

  /* ---------- Генератор открыток ---------- */

  var pcCard = document.getElementById('pcCard');
  if (pcCard) {
    var pcWishes = {
      h: [
        'Пусть в этом доме будет ровно столько мистики, сколько нужно для хорошего настроения — и ни каплей больше.',
        'Желаю сладостей больше, чем гадостей, и тыквы, которая переживёт весь ноябрь.',
        'Пусть все монстры в твоей жизни останутся бумажными, а конфеты — настоящими.',
        'Тёмная ночь, тёплая компания, полный карман конфет — чего ещё желать на Хэллоуин.',
        'Пусть свеча в тыкве горит долго, а хорошее настроение — ещё дольше.',
        'Пусть единственное, что пугает тебя в этом году, — это будильник по утрам.'
      ],
      ny: [
        'Пусть Новый год принесёт столько же тепла, сколько было в мандарине под ёлкой.',
        'Желаю, чтобы куранты пробили ровно двенадцать раз — и все желания успели сбыться.',
        'Пусть год будет лёгким на подъём и тяжёлым на разочарования.',
        'Пусть гирлянда в доме горит дольше, чем список несбывшихся в этом году планов.',
        'Желаю столько же радости, сколько бывает от первого снега в начале зимы.',
        'Пусть следующий год окажется добрее, чем черновик планов на него.'
      ]
    };

    var pcTitles = { h: 'С Хэллоуином!', ny: 'С Новым годом!' };

    var pcToggleBtns = document.querySelectorAll('.pc-toggle-btn');
    var pcTo = document.getElementById('pcTo');
    var pcFrom = document.getElementById('pcFrom');
    var pcMsg = document.getElementById('pcMsg');
    var pcCardTitle = document.getElementById('pcCardTitle');
    var pcCardTo = document.getElementById('pcCardTo');
    var pcCardMsg = document.getElementById('pcCardMsg');
    var pcCardFrom = document.getElementById('pcCardFrom');
    var pcRandomBtn = document.getElementById('pcRandom');
    var pcDownloadBtn = document.getElementById('pcDownload');
    var pcLastWish = -1;

    function currentTheme() {
      return document.body.classList.contains('ny') ? 'ny' : 'h';
    }

    function refreshPreview() {
      var theme = currentTheme();
      pcCardTitle.textContent = pcTitles[theme];
      pcCardTo.textContent = (pcTo.value.trim() || 'Друг') + ',';
      pcCardMsg.textContent = pcMsg.value.trim() || pcWishes[theme][0];
      pcCardFrom.textContent = '— ' + (pcFrom.value.trim() || 'Аноним');
    }

    pcToggleBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var theme = this.dataset.theme;
        document.body.classList.remove('h', 'ny');
        document.body.classList.add(theme);
        pcToggleBtns.forEach(function (b) { b.classList.toggle('is-active', b === btn); });
        pcLastWish = -1;
        refreshPreview();
      });
    });

    [pcTo, pcFrom, pcMsg].forEach(function (field) {
      field.addEventListener('input', refreshPreview);
    });

    pcRandomBtn.addEventListener('click', function () {
      var theme = currentTheme();
      var pool = pcWishes[theme];
      var i = pcLastWish;
      while (i === pcLastWish) i = Math.floor(Math.random() * pool.length);
      pcLastWish = i;
      pcMsg.value = pool[i];
      refreshPreview();
    });

    function wrapCanvasText(ctx, text, maxWidth) {
      var words = text.split(' ');
      var lines = [];
      var current = '';
      words.forEach(function (word) {
        var test = current ? current + ' ' + word : word;
        if (ctx.measureText(test).width > maxWidth && current) {
          lines.push(current);
          current = word;
        } else {
          current = test;
        }
      });
      if (current) lines.push(current);
      return lines;
    }

    function downloadPostcard() {
      var theme = currentTheme();
      var W = 1200, H = 800, scale = 2;
      var canvas = document.createElement('canvas');
      canvas.width = W * scale;
      canvas.height = H * scale;
      var ctx = canvas.getContext('2d');
      ctx.scale(scale, scale);

      var palettes = {
        h: { bg1: '#2C1739', bg2: '#150C1C', accent: '#E2652A', accent2: '#F2C14E', text: '#EDE3DC' },
        ny: { bg1: '#143761', bg2: '#08152C', accent: '#F79B3D', accent2: '#BFD8E8', text: '#EFF4F7' }
      };
      var c = palettes[theme];

      function draw() {
        var grad = ctx.createRadialGradient(W * 0.32, H * 0.18, 40, W * 0.32, H * 0.18, W * 0.95);
        grad.addColorStop(0, c.bg1);
        grad.addColorStop(1, c.bg2);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);

        var glow = ctx.createRadialGradient(W * 0.86, H * 0.1, 10, W * 0.86, H * 0.1, W * 0.32);
        glow.addColorStop(0, c.accent + '55');
        glow.addColorStop(1, c.accent + '00');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(W * 0.86, H * 0.1, W * 0.32, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = 1;
        if (theme === 'ny') {
          ctx.fillStyle = 'rgba(255,255,255,0.75)';
          for (var i = 0; i < 70; i++) {
            var sx = Math.random() * W, sy = Math.random() * H, sr = Math.random() * 2 + 0.6;
            ctx.globalAlpha = Math.random() * 0.5 + 0.25;
            ctx.beginPath();
            ctx.arc(sx, sy, sr, 0, Math.PI * 2);
            ctx.fill();
          }
        } else {
          ctx.fillStyle = c.accent2;
          for (var j = 0; j < 26; j++) {
            var tx = Math.random() * W, ty = Math.random() * H * 0.55, tr = Math.random() * 1.6 + 0.4;
            ctx.globalAlpha = Math.random() * 0.4 + 0.15;
            ctx.beginPath();
            ctx.arc(tx, ty, tr, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.globalAlpha = 1;

        ctx.strokeStyle = 'rgba(255,255,255,0.14)';
        ctx.lineWidth = 2;
        ctx.strokeRect(20, 20, W - 40, H - 40);

        ctx.fillStyle = c.text;
        ctx.globalAlpha = 0.75;
        ctx.font = '700 20px Unbounded, sans-serif';
        ctx.fillText('31 / 31', 60, 76);
        ctx.globalAlpha = 1;

        ctx.fillStyle = c.accent;
        ctx.font = '900 50px Unbounded, sans-serif';
        ctx.fillText(pcTitles[theme], 60, 172);

        ctx.fillStyle = c.accent2;
        ctx.font = '700 32px Unbounded, sans-serif';
        ctx.fillText((pcTo.value.trim() || 'Друг') + ',', 60, 228);

        ctx.fillStyle = c.text;
        ctx.font = '400 25px Onest, sans-serif';
        var msgText = pcMsg.value.trim() || pcWishes[theme][0];
        var lines = wrapCanvasText(ctx, msgText, W - 120);
        var ly = 288;
        lines.forEach(function (line) {
          ctx.fillText(line, 60, ly);
          ly += 37;
        });

        ctx.fillStyle = c.accent;
        ctx.font = '700 25px Unbounded, sans-serif';
        var fromText = '— ' + (pcFrom.value.trim() || 'Аноним');
        var fw = ctx.measureText(fromText).width;
        ctx.fillText(fromText, W - 60 - fw, H - 60);

        canvas.toBlob(function (blob) {
          var url = URL.createObjectURL(blob);
          var a = document.createElement('a');
          a.href = url;
          a.download = (theme === 'ny' ? 'otkrytka-novyj-god' : 'otkrytka-halloween') + '.png';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
        }, 'image/png');
      }

      if (document.fonts && document.fonts.ready) {
        Promise.all([
          document.fonts.load('900 50px Unbounded'),
          document.fonts.load('700 25px Unbounded'),
          document.fonts.load('400 25px Onest')
        ]).then(function () { return document.fonts.ready; }).then(draw).catch(draw);
      } else {
        draw();
      }
    }

    pcDownloadBtn.addEventListener('click', downloadPostcard);
    refreshPreview();
  }

  /* ---------- Викторина: праздники разных стран ---------- */

  var quizCard = document.getElementById('quizCard');
  if (quizCard) {
    var quizQuestions = [
      {
        holiday: 'h',
        question: 'В какой стране родилась традиция, из которой вырос современный Хэллоуин?',
        options: ['Ирландия', 'Франция', 'Италия', 'Швеция'],
        correct: 0,
        explanation: 'Хэллоуин вырос из кельтского праздника Самайн, которым в Ирландии отмечали конец урожайного года и начало зимы.'
      },
      {
        holiday: 'h',
        question: 'В какой стране существует старое поверье не оставлять на столе ножи в канун Хэллоуина — чтобы не поранить возвращающихся духов?',
        options: ['Норвегия', 'Германия', 'Польша', 'Португалия'],
        correct: 1,
        explanation: 'В немецких деревнях ножи убирали подальше в ночь на 1 ноября — считалось, что духи умерших возвращаются домой и могут случайно пораниться.'
      },
      {
        holiday: 'h',
        question: 'Как называется мексиканский праздник в начале ноября с яркими алтарями, цветами календулы и сахарными черепами в память об умерших?',
        options: ['Ханами', 'Дивали', 'День мёртвых', 'Обон'],
        correct: 2,
        explanation: 'День мёртвых (Día de los Muertos) отмечается в Мексике 1–2 ноября: семьи украшают алтари фотографиями, цветами и любимой едой ушедших близких.'
      },
      {
        holiday: 'h',
        question: 'В какой стране до появления американского «сладость или гадость» дети ходили по домам и получали не конфеты, а постные «поминальные» пирожки?',
        options: ['Англия', 'Испания', 'Бельгия', 'Дания'],
        correct: 0,
        explanation: 'В Англии существовал обряд souling: дети и бедняки ходили по домам, пели и получали soul cakes — небольшие пряные пирожки, за которые обещали помолиться за усопших хозяев.'
      },
      {
        holiday: 'h',
        question: 'В какой стране тыква заменила репу как главный материал для фонаря Джека — просто потому, что её было больше и резать её удобнее?',
        options: ['Канада', 'США', 'Австралия', 'Мексика'],
        correct: 1,
        explanation: 'Ирландские переселенцы принесли традицию вырезать фонари в США в XIX веке. Репы там было мало, а тыквы — в избытке, крупнее и мягче, поэтому именно они стали новым символом.'
      },
      {
        holiday: 'ny',
        question: 'В какой стране в новогоднюю ночь принято съедать по одной виноградине на каждый удар часов — всего двенадцать?',
        options: ['Греция', 'Испания', 'Турция', 'Португалия'],
        correct: 1,
        explanation: 'В Испании традиция «двенадцати виноградин» (las doce uvas) означает удачу на каждый из двенадцати месяцев нового года — если успеть съесть все под бой часов.'
      },
      {
        holiday: 'ny',
        question: 'Новогодний праздник в этой стране называется Хогманай. Считается, что первый гость, вошедший в дом после полуночи, должен принести уголь или виски на счастье. Что это за страна?',
        options: ['Ирландия', 'Уэльс', 'Шотландия', 'Исландия'],
        correct: 2,
        explanation: 'Хогманай — главный зимний праздник в Шотландии. Обряд «первой ноги» (first-footing) определяет, каким будет год: гость с углём, виски или выпечкой в руках приносит дому удачу.'
      },
      {
        holiday: 'ny',
        question: 'В какой стране в полночь принято залезать на стул и спрыгивать с него — будто «впрыгивая» в новый год?',
        options: ['Дания', 'Норвегия', 'Финляндия', 'Швеция'],
        correct: 0,
        explanation: 'В Дании этот обычай соседствует с другим — разбивать старую посуду о двери друзей на счастье. Чем больше осколков у порога утром, тем больше вас любят.'
      },
      {
        holiday: 'ny',
        question: 'Новый год в этой стране называется Омисока. Какое блюдо там едят в новогоднюю ночь, чтобы жизнь была такой же длинной, как оно само?',
        options: ['Рис моти', 'Лапша соба', 'Суши-роллы', 'Рамен'],
        correct: 1,
        explanation: 'Тосикоси-соба — «лапша, переходящая в новый год» — символизирует долголетие благодаря своей длине. Её едят в Японии вечером 31 декабря.'
      },
      {
        holiday: 'ny',
        question: 'В какой стране в новогоднюю ночь принято встречать Новый год на пляже в белой одежде и перепрыгивать через семь набегающих волн на удачу?',
        options: ['Аргентина', 'Бразилия', 'Чили', 'Уругвай'],
        correct: 1,
        explanation: 'В Бразилии новогодний праздник Réveillon особенно масштабно отмечают на пляжах Рио-де-Жанейро: белая одежда символизирует мир, а прыжки через волны — подношение богине моря Йеманже.'
      },
      {
        holiday: 'ny',
        question: 'В этой стране после перехода на новый календарь появился обычай праздновать Новый год ещё раз — в ночь на 14 января. Что это за страна?',
        options: ['Испания', 'Россия', 'Япония', 'Мексика'],
        correct: 1,
        explanation: 'После революции 1917 года Россия перешла на григорианский календарь, но по старому, юлианскому стилю дата Нового года сдвинулась на 14 января. Праздновать решили оба раза — так родился «старый Новый год», который отмечают до сих пор.'
      }
    ];

    var quizIndex = 0;
    var quizScore = 0;
    var quizAnswered = false;

    var quizStep = document.getElementById('quizStep');
    var quizFill = document.getElementById('quizProgressFill');
    var quizBadge = document.getElementById('quizBadge');
    var quizQuestionEl = document.getElementById('quizQuestion');
    var quizOptionsEl = document.getElementById('quizOptions');
    var quizExplainEl = document.getElementById('quizExplain');
    var quizNextBtn = document.getElementById('quizNext');
    var quizResultEl = document.getElementById('quizResult');
    var quizScoreEl = document.getElementById('quizScore');
    var quizMsgEl = document.getElementById('quizMsg');
    var quizRestartBtn = document.getElementById('quizRestart');

    function renderQuizQuestion() {
      quizAnswered = false;
      var q = quizQuestions[quizIndex];

      quizStep.textContent = 'Вопрос ' + (quizIndex + 1) + ' из ' + quizQuestions.length;
      quizFill.style.width = Math.round(((quizIndex) / quizQuestions.length) * 100) + '%';

      quizBadge.textContent = q.holiday === 'h' ? 'Хэллоуин' : 'Новый год';
      quizBadge.className = 'quiz-badge ' + (q.holiday === 'h' ? 'is-h' : 'is-ny');

      quizQuestionEl.textContent = q.question;
      quizExplainEl.hidden = true;
      quizNextBtn.hidden = true;

      quizOptionsEl.innerHTML = '';
      q.options.forEach(function (opt, i) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'quiz-option';
        btn.textContent = opt;
        btn.addEventListener('click', function () { handleQuizAnswer(i, btn); });
        quizOptionsEl.appendChild(btn);
      });
    }

    function handleQuizAnswer(choiceIndex, btnEl) {
      if (quizAnswered) return;
      quizAnswered = true;
      var q = quizQuestions[quizIndex];
      var buttons = quizOptionsEl.querySelectorAll('.quiz-option');

      buttons.forEach(function (b, i) {
        b.disabled = true;
        if (i === q.correct) b.classList.add('is-correct');
        else if (i === choiceIndex) b.classList.add('is-wrong');
        else b.classList.add('is-muted');
      });

      if (choiceIndex === q.correct) quizScore++;

      quizExplainEl.textContent = q.explanation;
      quizExplainEl.hidden = false;
      quizNextBtn.hidden = false;
      quizNextBtn.textContent = (quizIndex === quizQuestions.length - 1) ? 'Смотреть результат' : 'Следующий вопрос';
    }

    function finishQuiz() {
      quizCard.hidden = true;
      document.querySelector('.quiz-progress').hidden = true;
      quizResultEl.hidden = false;
      quizScoreEl.textContent = quizScore + ' / ' + quizQuestions.length;

      var msg;
      if (quizScore >= 10) msg = 'Отличный результат — вы явно интересуетесь тем, как праздники живут за пределами родной страны.';
      else if (quizScore >= 7) msg = 'Неплохо! Часть традиций уже знакома, остальные — повод почитать дальше.';
      else msg = 'Есть с чем познакомиться поближе — истории про оба праздника ждут в соответствующих разделах.';
      quizMsgEl.textContent = msg;
    }

    quizNextBtn.addEventListener('click', function () {
      if (quizIndex === quizQuestions.length - 1) {
        finishQuiz();
      } else {
        quizIndex++;
        renderQuizQuestion();
      }
    });

    quizRestartBtn.addEventListener('click', function () {
      quizIndex = 0;
      quizScore = 0;
      quizResultEl.hidden = true;
      quizCard.hidden = false;
      document.querySelector('.quiz-progress').hidden = false;
      renderQuizQuestion();
    });

    renderQuizQuestion();
  }
})();
