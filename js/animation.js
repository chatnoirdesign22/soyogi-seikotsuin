/* =========================================================
   animation.js … GSAP + ScrollTrigger によるアニメーション
   方針：やさしく・ゆっくり・控えめ
   ・視差効果を減らす設定（prefers-reduced-motion: reduce）では何もしない
   ・GSAP が読み込めなかった場合は、隠していた要素をそのまま表示する
   ========================================================= */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function showAll() { root.classList.remove('js-anim'); }

  if (reduceMotion || typeof window.gsap === 'undefined' || typeof window.ScrollTrigger === 'undefined') {
    showAll();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: 'power2.out' });

  /* ---------- 1. ページ読み込み時：ヒーロー ---------- */
  var heroItems = gsap.utils.toArray('[data-hero]');
  if (heroItems.length) {
    gsap.set(heroItems, { opacity: 0, y: 24 });
    var lines = heroItems.filter(function (el) { return el.classList.contains('line'); });
    var others = heroItems.filter(function (el) { return !el.classList.contains('line'); });
    var badges = others.filter(function (el) { return el.classList.contains('hero-badges'); });
    var rest = others.filter(function (el) { return !el.classList.contains('hero-badges'); });

    gsap.timeline({ delay: 0.25 })
      .to(badges, { opacity: 1, y: 0, duration: 0.9 })
      .to(lines, { opacity: 1, y: 0, duration: 1.2, stagger: 0.45 }, '-=0.4')   // キャッチコピーを1行ずつ
      .to(rest, { opacity: 1, y: 0, duration: 1, stagger: 0.25 }, '-=0.5');     // サブコピー → ボタン
  }

  /* ---------- 2. スクロール時：見出し・カードのフェードイン ---------- */
  var revealItems = gsap.utils.toArray('[data-reveal]');
  gsap.set(revealItems, { opacity: 0, y: 36 });

  ScrollTrigger.batch(revealItems, {
    start: 'top 88%',
    once: true,
    onEnter: function (batch) {
      // 同時に画面に入ったカードは少しずつ時間差で表示
      gsap.to(batch, { opacity: 1, y: 0, duration: 1, stagger: 0.12, overwrite: true });
    }
  });

  /* ---------- 3. ヒーロー画像：控えめなパララックス ---------- */
  gsap.utils.toArray('[data-parallax]').forEach(function (img) {
    gsap.fromTo(img, { yPercent: -4 }, {
      yPercent: 8,
      ease: 'none',
      scrollTrigger: {
        trigger: img.closest('section') || img,
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });
  });

  /* ---------- 4. 装飾の葉っぱ：ゆらゆら揺れるループ ---------- */
  gsap.utils.toArray('[data-sway]').forEach(function (leaf, i) {
    var dir = i % 2 === 0 ? 1 : -1;
    gsap.set(leaf, { rotation: -6 * dir });
    gsap.to(leaf, {
      rotation: 8 * dir,
      y: '+=6',
      duration: 2.6 + (i % 3) * 0.6,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: i * 0.3
    });
  });

  /* ---------- 5. ヘッダー：背景・影は main.js（CSSトランジション）で制御 ---------- */

  /* ---------- 6. 木漏れ日：光の粒がゆっくり明滅しながら漂い、葉影がそよぐ ---------- */
  gsap.utils.toArray('[data-komorebi]').forEach(function (box) {
    gsap.utils.toArray(box.querySelectorAll('.sun')).forEach(function (sun, i) {
      gsap.fromTo(sun, { opacity: 0.35 }, {
        opacity: 1,
        x: gsap.utils.random(-30, 30),
        y: gsap.utils.random(-20, 20),
        duration: gsap.utils.random(3.5, 6),
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: i * 0.7
      });
    });
    var shade = box.querySelector('.shade');
    if (shade) {
      gsap.fromTo(shade, { rotation: -3 }, {
        rotation: 4, x: -12, duration: 4.5, ease: 'sine.inOut', yoyo: true, repeat: -1
      });
    }
  });

  // 準備ができたら隠しクラスを外す（以降は GSAP がインラインで制御）
  showAll();

  // 画像の読み込みで高さが変わったときに位置を再計算
  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
