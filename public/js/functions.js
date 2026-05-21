//PC/SP判定
let spFlag = false;
let pcFlag = false;
$(window).on('load resize', function () {
  const winW = $(this).width();
  if (winW <= 768) {
    //SPサイズになったとき
    if (!spFlag) {
      spFlag = true;
      pcFlag = false;
    }
  } else {
    //PCサイズになったとき
    if (!pcFlag) {
      spFlag = false;
      pcFlag = true;
    }
  }
});

/* スムーズスクロール */
$('a[href^="#"]').on('click', function (e) {
  e.preventDefault();
  const $target = $($(this).attr('href'));
  if (!$target.length) return;
  $('body,html').animate({ scrollTop: $target.offset().top }, 500);
});

/* トップに戻るボタン */
$('.pagetopBtn a').on('click', function (e) {
  $('html,body').animate({ scrollTop: 0 }, 600);
  e.preventDefault();
});

/* 追従ナビ トグル */
$('.navFixed_toggle').on('click', function (e) {
  e.preventDefault();
  const $nav = $('.navFixed');
  if ($nav.hasClass('is-show')) {
    $nav.removeClass('is-show').addClass('is-close');
  } else {
    $nav.removeClass('is-close').addClass('is-show');
  }
});

/* 追従ナビ 閉じるボタン */
$('.navFixed_close').on('click', function (e) {
  e.preventDefault();
  $('.navFixed').removeClass('is-show').addClass('is-close');
});

/* 追従ナビ リンククリックで閉じる */
$('.navFixedBtn').on('click', function (e) {
  $('.navFixed').removeClass('is-show').addClass('is-close');
});

$(window).on('load resize', function () {
  if (spFlag) {
    $('.itemSection__leadBlock__image__space').each(function () {
      let parentHeight = $(this)
        .parent('.itemSection__leadBlock__text')
        .height();
      let nextImage = parentHeight * 0.6;
      let leadBlockImageMargin = parentHeight * 0.4;
      $(this).next('.itemSection__leadBlock__image').css({ height: nextImage });
      $(this).css({ height: leadBlockImageMargin });
    });
  }
});

/* スクロール */
$(window).on('scroll', function () {
  const winH = $(window).height();
  let scrVal = $(window).scrollTop();
  // 暖かさメーター
  $('.itemInfoArea__meterBlock').each(function () {
    const thisPos = $(this).offset().top - (winH * 3) / 4;
    const thisW = $(this).width();
    const thisWarm = $(this).find('.itemInfoArea__meter').data('warm');
    const thisWarmVal = thisW * (thisWarm / 100);
    if (thisPos < scrVal) {
      $(this)
        .find('.itemInfoArea__meter__arrow')
        .css({
          transform: 'translateX(' + thisWarmVal + 'px)',
        });
    }
  });

  //アンカー
  if ($('.pageAnchor').length) {
    const anchorPos = $('.pageAnchor').offset().top - winH / 2;
    if (anchorPos < scrVal) {
      $('.pageAnchor__list li').addClass('is-show');
    }
  }

  // 画像サイドからイン
  $('.has-imageInSide').each(function () {
    const thisPos = $(this).offset().top - winH / 2;
    if (thisPos < scrVal) {
      $(this).addClass('is-show');
    }
  });
  // 画像フェードイン
  $('.has-imageInFade').each(function () {
    const thisPos = $(this).offset().top - winH / 2;
    if (thisPos < scrVal) {
      $(this).addClass('is-show');
    }
  });
  // 小→大
  $('.has-imageInScale').each(function () {
    const thisPos = $(this).offset().top - winH / 2;
    if (thisPos < scrVal) {
      $(this).addClass('is-show');
    }
  });

  if ($(window).scrollTop() > 500) {
    $('.navFixed').addClass('scroll');
  } else {
    $('.navFixed').removeClass('scroll');
  }
});

/* ジョグパンツ画像スライダー */
document.addEventListener('DOMContentLoaded', () => {
  const slider = document.getElementById('jogPants_slider');
  if (slider) {
    const wrapper = slider.querySelector('.slider-wrapper');
    const sliders = slider.querySelectorAll('.slider');
    let currentIndex = Array.from(sliders).findIndex((s) =>
      s.classList.contains('slider-current'),
    );

    // スライダーの高さを設定
    function setWrapperHeight() {
      const currentSlider = sliders[currentIndex];
      const height = currentSlider.offsetHeight;
      if (height > 0) {
        wrapper.style.height = `${height}px`;
      }
    }

    // 画像が読み込まれた後に高さを設定
    const images = slider.querySelectorAll('img');
    let loadedCount = 0;
    images.forEach((img) => {
      if (img.complete) {
        loadedCount++;
      } else {
        img.addEventListener('load', () => {
          loadedCount++;
          if (loadedCount === images.length) {
            setWrapperHeight();
          }
        });
      }
    });
    if (loadedCount === images.length) {
      setWrapperHeight();
    }

    // リサイズ時に高さを再計算
    window.addEventListener('resize', setWrapperHeight);

    // 初期状態で前の要素にslider-prevを付与
    function updatePrevSlider() {
      const prevIndex =
        currentIndex === 0 ? sliders.length - 1 : currentIndex - 1;
      sliders.forEach((s) => s.classList.remove('slider-prev'));
      sliders[prevIndex].classList.add('slider-prev');
    }
    updatePrevSlider();

    function nextSlide() {
      // 前の要素（左側の小さい要素）を取得
      const prevIndex =
        currentIndex === 0 ? sliders.length - 1 : currentIndex - 1;
      const prevSlider = sliders[prevIndex];

      // 前の要素をさらに左に移動
      prevSlider.classList.add('slider-left-exit');
      prevSlider.classList.remove('slider-prev');

      // 現在のslider-currentを削除
      sliders[currentIndex].classList.remove('slider-current');

      // 次のインデックスへ
      currentIndex = (currentIndex + 1) % sliders.length;

      // 新しいslider-currentを追加
      sliders[currentIndex].classList.add('slider-current');

      // 新しい前の要素を設定
      updatePrevSlider();

      // 0.6秒後に左に移動した要素を右側に戻す
      setTimeout(() => {
        prevSlider.classList.remove('slider-left-exit');
      }, 600);
    }

    // スワイプ/ドラッグ機能
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    let autoPlayInterval;

    function startDrag(e) {
      isDragging = true;
      startX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
      currentX = startX;
      e.preventDefault();
    }

    function moveDrag(e) {
      if (!isDragging) return;
      currentX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    }

    function endDrag(e) {
      if (!isDragging) return;
      isDragging = false;

      const diff = startX - currentX;
      const threshold = 50; // スワイプと判定する最小距離

      // 左にスワイプ（次のスライドへ）
      if (diff > threshold) {
        // オートプレイをリセット
        clearInterval(autoPlayInterval);
        autoPlayInterval = setInterval(nextSlide, 4000);
        nextSlide();
      }
    }

    // イベントリスナー設定
    wrapper.addEventListener('mousedown', startDrag);
    wrapper.addEventListener('touchstart', startDrag, { passive: false });

    wrapper.addEventListener('mousemove', moveDrag);
    wrapper.addEventListener('touchmove', moveDrag, { passive: false });

    wrapper.addEventListener('mouseup', endDrag);
    wrapper.addEventListener('touchend', endDrag);

    wrapper.addEventListener('mouseleave', () => {
      isDragging = false;
    });

    // ドラッグ選択を無効化
    wrapper.style.userSelect = 'none';
    wrapper.style.webkitUserSelect = 'none';

    // 3秒ごとに次のスライドへ（オートプレイ）
    autoPlayInterval = setInterval(nextSlide, 4000);
  }
});

/* FV Title Swiper（data-speedで速度を個別指定） */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.fv_titleSwiper').forEach((el) => {
    const speed = Number(el.dataset.speed) || 10000;
    new Swiper(el, {
      loop: true,
      slidesPerView: 'auto',
      speed: speed,
      autoplay: {
        delay: 0,
        disableOnInteraction: false,
      },
      allowTouchMove: false,
      cssMode: false,
    });
  });
});

/* GSAP ScrollTrigger - Fade Up Animation */
document.addEventListener('DOMContentLoaded', () => {
  // ScrollTriggerプラグインを登録
  gsap.registerPlugin(ScrollTrigger);

  // .is-fadeup要素を全て取得
  const fadeUpElements = document.querySelectorAll('.is-fadeup');

  fadeUpElements.forEach((element) => {
    // itemImgBox内の要素は親をトリガーにする
    const imgBox = element.closest('[class*="itemImgBox"]');
    const isSteppiVisual = element.closest('.steppiVisual');
    const trigger = isSteppiVisual ? element : imgBox || element;

    ScrollTrigger.create({
      trigger: trigger,
      start: imgBox && !isSteppiVisual ? '20% 80%' : 'top 80%', // itemImgBox内は親、steppiVisual内は各要素で発火
      once: true, // 一度だけ実行
      onEnter: () => {
        element.classList.add('is-show');
      },
    });
  });

  // .is-zoomin: 同じトリガーで is-show を付与（CSS側の transition-delay で fadeup の後に発火）
  const zoomInElements = document.querySelectorAll('.is-zoomin');

  zoomInElements.forEach((element) => {
    ScrollTrigger.create({
      trigger: element,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        element.classList.add('is-show');
      },
    });
  });

  // itemImgBox: is-show 付与で itemCatch → itemTag をCSS transition-delay で連鎖
  const itemImgBoxes = document.querySelectorAll('.itemImgBox');

  itemImgBoxes.forEach((box) => {
    ScrollTrigger.create({
      trigger: box,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        box.classList.add('is-show');
      },
    });
  });

  // temperature_img: is-show 付与で balloon → copy を順にフェードアップ
  const temperatureImgs = document.querySelectorAll('.temperature_img');

  temperatureImgs.forEach((box) => {
    ScrollTrigger.create({
      trigger: box,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        box.classList.add('is-show');
      },
    });
  });
});
