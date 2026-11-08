(() => {
  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('[data-cfj-slideshow]').forEach((carousel) => {
    const slides = [...carousel.querySelectorAll('[data-slide]')];
    const dots = [...carousel.querySelectorAll('[data-slide-to]')];
    const status = carousel.querySelector('[data-slide-status]');
    if (slides.length < 2) return;

    let active = 0;
    let timer = 0;

    const show = (index) => {
      active = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => {
        const selected = i === active;
        slide.hidden = !selected;
        slide.classList.toggle('is-active', selected);
      });
      dots.forEach((dot, i) => dot.setAttribute('aria-pressed', String(i === active)));
      if (status) status.textContent = `Image ${active + 1} of ${slides.length}`;
    };

    const stop = () => {
      window.clearInterval(timer);
      timer = 0;
    };
    const start = () => {
      stop();
      const pointerIsOverCarousel = carousel.matches(':hover');
      const keyboardIsUsingCarousel = carousel.contains(document.activeElement);
      if (!reducedMotion && !document.hidden && !pointerIsOverCarousel && !keyboardIsUsingCarousel) {
        timer = window.setInterval(() => show(active + 1), 6000);
      }
    };

    carousel.querySelector('[data-slide-prev]')?.addEventListener('click', () => {
      show(active - 1);
      start();
    });
    carousel.querySelector('[data-slide-next]')?.addEventListener('click', () => {
      show(active + 1);
      start();
    });
    dots.forEach((dot) => dot.addEventListener('click', () => {
      show(Number(dot.dataset.slideTo));
      start();
    }));

    carousel.addEventListener('pointerenter', stop);
    carousel.addEventListener('pointerleave', start);
    carousel.addEventListener('focusin', stop);
    carousel.addEventListener('focusout', (event) => {
      if (!carousel.contains(event.relatedTarget)) start();
    });
    carousel.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        show(active - 1);
        start();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        show(active + 1);
        start();
      }
    });
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));

    show(0);
    start();
  });
})();
