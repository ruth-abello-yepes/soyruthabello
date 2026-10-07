(() => {
  'use strict';

  const formatCounter = (value) => Number.isInteger(value)
    ? String(value)
    : value.toFixed(1);

  const animateCounter = (element) => {
    const target = Number(element.dataset.target);
    if (!Number.isFinite(target)) return;

    const suffix = element.dataset.suffix || '';
    const duration = 1200;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = `+${formatCounter(target * eased)}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const initCounters = () => {
    const counters = document.querySelectorAll('.counter-value[data-target]');
    if (!counters.length) return;

    if (!('IntersectionObserver' in window)) {
      counters.forEach((counter) => {
        counter.textContent = `+${formatCounter(Number(counter.dataset.target))}${counter.dataset.suffix || ''}`;
      });
      return;
    }

    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        currentObserver.unobserve(entry.target);
      });
    }, { threshold: 0.5 });

    counters.forEach((counter) => observer.observe(counter));
  };

  const initMobileNavigation = () => {
    const menu = document.querySelector('.navbar-collapse');
    if (!menu || !window.bootstrap?.Collapse) return;

    document.querySelectorAll('.navbar-nav .nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        if (menu.classList.contains('show')) {
          window.bootstrap.Collapse.getOrCreateInstance(menu).hide();
        }
      });
    });
  };

  const initCurrentYear = () => {
    const year = document.getElementById('current-year');
    if (year) year.textContent = String(new Date().getFullYear());
  };

  document.addEventListener('DOMContentLoaded', () => {
    initCounters();
    initMobileNavigation();
    initCurrentYear();
  });
})();
