/* =========================================================
   form.js … 予約フォームの入力チェックとデモ送信
   ※実際の送信・保存は一切行わない（外部サービス・localStorage も使わない）
   ========================================================= */
(function () {
  'use strict';

  var form = document.getElementById('reserve-form');
  if (!form) return;

  var modal = document.getElementById('complete-modal');
  var modalTitle = document.getElementById('complete-title');
  var modalClose = document.getElementById('complete-close');
  var summary = document.getElementById('complete-summary');
  var message = document.getElementById('f-message');
  var counter = document.getElementById('f-message-count');
  var MAX_MESSAGE = 500;
  var lastFocus = null;

  /* ---------- 日付まわり ---------- */
  function pad(n) { return ('0' + n).slice(-2); }
  function toISO(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function parseISO(v) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v);
    return m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : null;
  }
  var todayISO = toISO(new Date());
  form.date1.min = todayISO;
  form.date2.min = todayISO;

  function checkDate(value, required) {
    if (!value) return required ? '第1希望日を選択してください。' : '';
    var d = parseISO(value);
    if (!d) return '日付の形式が正しくありません。';
    if (value < todayISO) return '本日以降の日付を選択してください。';
    if (d.getDay() === 4) return '木曜日は定休日です。別の日付を選択してください。';
    return '';
  }

  /* ---------- 項目ごとのチェック ---------- */
  var rules = {
    name: function (v) {
      return v.trim() ? '' : 'お名前を入力してください。';
    },
    kana: function (v) {
      v = v.trim();
      if (!v) return 'ふりがなを入力してください。';
      return /^[ぁ-ゖー　 ]+$/.test(v) ? '' : 'ふりがなは、ひらがなで入力してください。';
    },
    tel: function (v) {
      v = v.trim();
      if (!v) return '電話番号を入力してください。';
      if (!/^[0-9-]+$/.test(v)) return '電話番号は、半角の数字とハイフンで入力してください。';
      var digits = v.replace(/-/g, '').length;
      return digits >= 10 && digits <= 11 ? '' : '電話番号の桁数をご確認ください（10〜11桁）。';
    },
    email: function (v) {
      v = v.trim();
      if (!v) return 'メールアドレスを入力してください。';
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'メールアドレスの形式が正しくありません。';
    },
    menu: function (v) { return v ? '' : 'ご希望のメニューを選択してください。'; },
    date1: function (v) { return checkDate(v, true); },
    time: function (v) { return v ? '' : '希望時間帯を選択してください。'; },
    date2: function (v) {
      var err = checkDate(v, false);
      if (!err && v && v === form.date1.value) return '第1希望日と別の日付を選択してください。';
      return err;
    },
    visit: function () {
      return form.querySelector('input[name="visit"]:checked') ? '' : '初めてか2回目以降かを選択してください。';
    },
    message: function (v) {
      return v.length > MAX_MESSAGE ? MAX_MESSAGE + '文字以内で入力してください（現在 ' + v.length + '文字）。' : '';
    },
    agree: function () {
      return form.agree.checked ? '' : '個人情報の取り扱いへの同意が必要です。';
    }
  };

  // エラー表示の対象（ラジオはグループ全体）
  function targetOf(name) {
    return name === 'visit' ? document.getElementById('f-visit') : form.elements[name];
  }
  function errorOf(name) {
    return document.getElementById('f-' + name + '-err');
  }

  function validate(name) {
    var field = form.elements[name];
    var value = field && field.value !== undefined ? field.value : '';
    var msg = rules[name](value);
    var target = targetOf(name);
    errorOf(name).textContent = msg;
    if (msg) target.setAttribute('aria-invalid', 'true');
    else target.removeAttribute('aria-invalid');
    return !msg;
  }

  /* ---------- 入力中のチェック ----------
     一度触った（フォーカスを外した）項目だけ、入力のたびにチェックする */
  var touched = {};
  Object.keys(rules).forEach(function (name) {
    var els = name === 'visit' ? form.querySelectorAll('input[name="visit"]') : [form.elements[name]];
    Array.prototype.forEach.call(els, function (el) {
      el.addEventListener('blur', function () {
        if (name === 'visit' || name === 'agree') return;
        touched[name] = true;
        validate(name);
      });
      el.addEventListener(el.tagName === 'SELECT' || el.type === 'radio' || el.type === 'checkbox' || el.type === 'date' ? 'change' : 'input', function () {
        if (el.type === 'radio' || el.type === 'checkbox' || el.tagName === 'SELECT' || el.type === 'date') touched[name] = true;
        if (touched[name]) validate(name);
        if (name === 'date1' && touched.date2) validate('date2');
      });
    });
  });

  /* ---------- 文字数カウンター ---------- */
  function updateCounter() {
    var len = message.value.length;
    counter.textContent = len + ' / ' + MAX_MESSAGE + '文字';
    counter.classList.toggle('is-over', len > MAX_MESSAGE);
  }
  message.addEventListener('input', updateCounter);
  updateCounter();

  /* ---------- 送信（デモ） ---------- */
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var firstInvalid = null;
    Object.keys(rules).forEach(function (name) {
      touched[name] = true;
      if (!validate(name) && !firstInvalid) firstInvalid = name;
    });

    if (firstInvalid) {
      var target = firstInvalid === 'visit' ? form.querySelector('input[name="visit"]') : form.elements[firstInvalid];
      var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      target.closest('.form-row').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
      target.focus({ preventScroll: true });
      return;
    }

    showComplete();
  });

  /* ---------- 完了モーダル ---------- */
  function addSummary(label, value) {
    var row = document.createElement('div');
    var dt = document.createElement('dt');
    var dd = document.createElement('dd');
    dt.textContent = label;
    dd.textContent = value;
    row.appendChild(dt);
    row.appendChild(dd);
    summary.appendChild(row);
  }

  function formatDate(v) {
    var d = parseISO(v);
    return d ? (d.getMonth() + 1) + '月' + d.getDate() + '日（' + '日月火水木金土'.charAt(d.getDay()) + '）' : '';
  }

  function showComplete() {
    summary.textContent = '';
    addSummary('お名前', form.elements.name.value.trim() + ' 様');
    addSummary('メニュー', form.menu.value);
    addSummary('第1希望', formatDate(form.date1.value) + ' ' + form.time.value);
    if (form.date2.value) addSummary('第2希望', formatDate(form.date2.value));

    lastFocus = document.activeElement;
    modal.hidden = false;
    document.body.classList.add('is-menu-open'); // 背景スクロールを止める
    modalTitle.focus();
  }

  function closeModal() {
    modal.hidden = true;
    document.body.classList.remove('is-menu-open');
    form.reset();
    touched = {};
    Object.keys(rules).forEach(function (name) {
      errorOf(name).textContent = '';
      targetOf(name).removeAttribute('aria-invalid');
    });
    updateCounter();
    if (lastFocus) lastFocus.focus();
  }

  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', function (e) {
    if (modal.hidden) return;
    if (e.key === 'Escape') closeModal();
    // フォーカスをモーダル内に留める（タイトルと閉じるボタンの間）
    if (e.key === 'Tab') {
      e.preventDefault();
      (document.activeElement === modalClose ? modalTitle : modalClose).focus();
    }
  });
})();
