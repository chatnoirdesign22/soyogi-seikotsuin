/* =========================================================
   calc.js … 回数券おトク計算（メニュー・料金ページ）
   5回券 25,000円（1回あたり5,000円）／有効期限3か月
   ========================================================= */
(function () {
  'use strict';

  var form = document.getElementById('ticket-calc');
  if (!form) return;

  var TICKET_PRICE = 25000;
  var TICKET_COUNT = 5;
  var range = document.getElementById('calc-count');
  var out = document.getElementById('calc-count-out');
  var elNormal = document.getElementById('calc-normal');
  var elTicket = document.getElementById('calc-ticket');
  var elSave = document.getElementById('calc-save');
  var elDetail = document.getElementById('calc-detail');

  function yen(n) { return n.toLocaleString('ja-JP'); }

  function update() {
    var price = Number(form.querySelector('input[name="calc-menu"]:checked').value);
    var count = Number(range.value);
    var normal = price * count;

    // 5回ごとに回数券を使い、残りは都度払い
    var books = Math.floor(count / TICKET_COUNT);
    var rest = count % TICKET_COUNT;
    var withTicket = books * TICKET_PRICE + rest * price;
    var save = Math.max(normal - withTicket, 0);

    out.textContent = count + '回';
    elNormal.textContent = yen(normal) + '円';
    elTicket.textContent = books ? yen(withTicket) + '円' : '―';
    elSave.textContent = yen(save);
    elDetail.textContent = books
      ? '5回券' + books + '冊' + (rest ? '＋都度払い' + rest + '回' : '') + 'で計算'
      : '4回以下の場合は、都度払いのほうがおトクです。';
  }

  form.addEventListener('input', update);
  form.addEventListener('change', update);
  update();
})();
