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
})();
