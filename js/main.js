/* =========================================================
   main.js … ハンバーガーメニュー、ヘッダー、デモ表示などの共通処理
   ========================================================= */
(function () {
  'use strict';

  var header = document.getElementById('site-header');
  var nav = document.getElementById('global-nav');
  var toggle = document.querySelector('.menu-toggle');
  var fixedCta = document.getElementById('fixed-cta');
  var toast = document.getElementById('toast');

  /* ---------- ハンバーガーメニュー ---------- */
  function setMenu(open) {
    if (!toggle || !nav) return;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('.visually-hidden').textContent = open ? 'メニューを閉じる' : 'メニューを開く';
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('is-menu-open', open);
    header.classList.toggle('is-solid', open);
    if (open) {
      var firstLink = nav.querySelector('a');
      if (firstLink) firstLink.focus();
    }
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });

    // メニュー内のリンクを押したら閉じる
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a') && !e.target.closest('[data-demo]')) setMenu(false);
    });

    // Esc で閉じてボタンにフォーカスを戻す
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        toggle.focus();
      }
    });

    // メニューを開いている間は Tab 移動をメニュー内とボタンに閉じ込める
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab' || toggle.getAttribute('aria-expanded') !== 'true') return;
      var items = [toggle].concat(Array.prototype.slice.call(nav.querySelectorAll('a, button')));
      var first = items[0];
      var last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    });

    // PC幅に戻ったら閉じる
    window.matchMedia('(min-width: 1024px)').addEventListener('change', function (mq) {
      if (mq.matches) setMenu(false);
    });
  }

  /* ---------- ヘッダー：スクロールで白背景＋影 ---------- */
  function onScroll() {
    var y = window.scrollY;
    if (header) header.classList.toggle('is-scrolled', y > 40);

    // スマホ固定ボタン：フッター付近では隠す
    if (fixedCta) {
      var footer = document.querySelector('.site-footer');
      var nearFooter = footer && footer.getBoundingClientRect().top < window.innerHeight - 40;
      fixedCta.classList.toggle('is-hidden', !!nearFooter);
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- ただいま営業中バッジ ----------
     端末の現在時刻から受付状況を表示する（祝日は判定しないため注記を添える） */
  var DAY_NAMES = ['日', '月', '火', '水', '木', '金', '土'];
  // 曜日ごとの受付時間（分）。0=日曜。木曜は定休日
  var WEEKDAY = [[600, 780], [900, 1230]];            // 10:00〜13:00 ／ 15:00〜20:30（最終受付）
  var SCHEDULE = {
    0: [[540, 840]],                                  // 日 9:00〜14:00
    1: WEEKDAY, 2: WEEKDAY, 3: WEEKDAY, 4: [], 5: WEEKDAY,
    6: [[540, 1020]]                                  // 土 9:00〜17:00
  };

  function toTime(min) {
    return Math.floor(min / 60) + ':' + ('0' + (min % 60)).slice(-2);
  }

  function getOpenStatus(now) {
    var day = now.getDay();
    var min = now.getHours() * 60 + now.getMinutes();
    var today = SCHEDULE[day];
    var i;

    for (i = 0; i < today.length; i++) {
      if (min >= today[i][0] && min < today[i][1]) {
        var last = today[i][1];
        var isLastSlot = i === today.length - 1;
        return {
          state: 'open',
          label: 'ただいま受付中',
          note: isLastSlot && day >= 1 && day <= 5
            ? '本日の最終受付 ' + toTime(last)
            : '本日 ' + toTime(last) + ' まで受付'
        };
      }
      if (min < today[i][0]) {
        return {
          state: i === 0 ? 'closed' : 'break',
          label: i === 0 ? '受付開始前です' : 'お昼休み中',
          note: '本日 ' + toTime(today[i][0]) + ' から受付'
        };
      }
    }

    // 本日の受付が終了 or 定休日 → 次の営業日を探す
    for (var add = 1; add <= 7; add++) {
      var d = (day + add) % 7;
      if (SCHEDULE[d].length) {
        var when = add === 1 ? '明日（' + DAY_NAMES[d] + '）' : DAY_NAMES[d] + '曜';
        return {
          state: 'closed',
          label: today.length ? '本日の受付は終了しました' : '本日は定休日です',
          note: '次回は' + when + ' ' + toTime(SCHEDULE[d][0][0]) + '〜'
        };
      }
    }
  }

  var statusEls = document.querySelectorAll('[data-open-status]');
  function renderOpenStatus() {
    var s = getOpenStatus(new Date());
    Array.prototype.forEach.call(statusEls, function (el) {
      el.className = 'open-status is-' + s.state;
      el.querySelector('.open-status-label').textContent = s.label;
      el.querySelector('.open-status-note').textContent = s.note + '（祝日を除く）';
      el.hidden = false;
    });
  }
  if (statusEls.length) {
    renderOpenStatus();
    setInterval(renderOpenStatus, 60 * 1000);
  }

  /* ---------- デモ表示（電話・LINE） ---------- */
  var toastTimer;
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('is-show'); }, 3200);
  }
  window.soyogiToast = showToast;

  document.addEventListener('click', function (e) {
    var demo = e.target.closest('[data-demo]');
    if (!demo) return;
    e.preventDefault();
    var label = demo.getAttribute('data-demo') === 'line' ? 'LINE予約' : 'お電話';
    showToast('【' + label + '】デモサイトのため、ご利用いただけません。');
  });
})();
