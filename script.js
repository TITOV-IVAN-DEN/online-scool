(function () {
  'use strict';

  // ========== 1. УНИВЕРСАЛЬНЫЙ СЛАЙДЕР ==========
  function initSlider(selector) {
    const slider = document.querySelector(selector);
    if (!slider) return;

    const wrapper = slider.querySelector('.slider__wrapper');
    const slides = slider.querySelectorAll('.slider__slide');
    const prevBtn = slider.querySelector('.slider__btn--prev');
    const nextBtn = slider.querySelector('.slider__btn--next');
    const dotsContainer = slider.querySelector('.slider__dots');

    if (!wrapper || slides.length === 0) return;

    let currentIndex = 0;
    const totalSlides = slides.length;

    // Создаём точки навигации
    if (dotsContainer) {
      dotsContainer.innerHTML = ''; // очищаем, если уже были
      for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
      }
    }

    function updateSlider() {
      wrapper.style.transform = `translateX(-${currentIndex * 100}%)`;

      // Обновляем активную точку
      if (dotsContainer) {
        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, i) => {
          dot.classList.toggle('active', i === currentIndex);
        });
      }
    }

    function goToSlide(index) {
      if (index < 0) index = totalSlides - 1;
      if (index >= totalSlides) index = 0;
      currentIndex = index;
      updateSlider();
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
    }

    // Инициализируем начальное положение
    updateSlider();

    // Опционально: поддержка свайпа для тач-устройств (простейшая)
    let touchStartX = 0;
    let touchEndX = 0;
    slider.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    slider.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    });

    function handleSwipe() {
      const threshold = 50;
      if (touchEndX < touchStartX - threshold) {
        // свайп влево -> следующий
        goToSlide(currentIndex + 1);
      } else if (touchEndX > touchStartX + threshold) {
        // свайп вправо -> предыдущий
        goToSlide(currentIndex - 1);
      }
    }
  }

  // ========== 2. КРУГОВАЯ АНИМАЦИЯ ПРИ ПРОКРУТКЕ ==========
  function initCircleAnimation() {
    const circle = document.querySelector('.circle-animation');
    if (!circle) return;

    // Секция, внутри которой работает анимация
    const section = circle.closest('.advantages') || document.querySelector('#advantages');
    if (!section) return;

    let ticking = false;

    function rotateCircle() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.pageYOffset;
          const speed = 0.3; // скорость вращения (градусов на пиксель прокрутки)
          circle.style.transform = `rotate(${scrollY * speed}deg)`;
          ticking = false;
        });
        ticking = true;
      }
    }

    // Intersection Observer для активации/деактивации
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            window.addEventListener('scroll', rotateCircle, { passive: true });
            rotateCircle(); // сразу обновим угол
          } else {
            window.removeEventListener('scroll', rotateCircle);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(section);
  }

  // ========== 3. ПЛАВНАЯ ПРОКРУТКА ПО ЯКОРЯМ ==========
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        // Игнорируем пустые ссылки (только #)
        if (href === '#' || href === '') return;

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // ========== 4. ОБРАБОТКА ФОРМЫ ==========
  function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const formData = new FormData(form);
      const name = formData.get('name')?.trim() || 'Гость';
      alert(`Спасибо, ${name}! Мы свяжемся с вами в ближайшее время.`);
      form.reset();
    });
  }

  // ========== ЗАПУСК ВСЕГО ПОСЛЕ ЗАГРУЗКИ DOM ==========
  function initAll() {
    // Слайдеры
    initSlider('.reviews-slider');
    initSlider('.team-slider');

    // Круговая анимация
    initCircleAnimation();

    // Плавная прокрутка
    initSmoothScroll();

    // Форма
    initContactForm();
  }

  // Стартуем, когда DOM готов
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();