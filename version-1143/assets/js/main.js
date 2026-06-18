
(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  function setupMenu() {
    var toggle = document.querySelector('.mobile-toggle');
    var panel = document.querySelector('.mobile-panel');
    if (!toggle || !panel) {
      return;
    }
    toggle.addEventListener('click', function () {
      var open = panel.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.textContent = open ? '×' : '☰';
    });
  }

  function setupHero() {
    var carousel = document.querySelector('.hero-carousel');
    if (!carousel) {
      return;
    }
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll('.hero-dot'));
    var prev = carousel.querySelector('.hero-prev');
    var next = carousel.querySelector('.hero-next');
    var index = 0;
    var delay = parseInt(carousel.getAttribute('data-autoplay') || '5000', 10);
    var timer = null;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
      });
    }

    function restart() {
      if (timer) {
        window.clearInterval(timer);
      }
      timer = window.setInterval(function () {
        show(index + 1);
      }, delay);
    }

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        restart();
      });
    }
    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        restart();
      });
    }
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
        restart();
      });
    });
    if (slides.length > 1) {
      restart();
    }
  }

  function setupFilters() {
    var panels = Array.prototype.slice.call(document.querySelectorAll('.filter-panel'));
    panels.forEach(function (panel) {
      var scope = panel.parentElement.querySelector('.js-filter-scope');
      if (!scope) {
        return;
      }
      var search = panel.querySelector('.js-local-search');
      var year = panel.querySelector('.js-year-filter');
      var type = panel.querySelector('.js-type-filter');
      var region = panel.querySelector('.js-region-filter');
      var cards = Array.prototype.slice.call(scope.querySelectorAll('.movie-card'));

      function value(el) {
        return el ? el.value.trim().toLowerCase() : '';
      }

      function apply() {
        var keyword = value(search);
        var yearValue = value(year);
        var typeValue = value(type);
        var regionValue = value(region);
        cards.forEach(function (card) {
          var haystack = [
            card.getAttribute('data-title') || '',
            card.getAttribute('data-year') || '',
            card.getAttribute('data-type') || '',
            card.getAttribute('data-region') || '',
            card.getAttribute('data-genre') || ''
          ].join(' ').toLowerCase();
          var keep = true;
          if (keyword && haystack.indexOf(keyword) === -1) {
            keep = false;
          }
          if (yearValue && (card.getAttribute('data-year') || '').toLowerCase() !== yearValue) {
            keep = false;
          }
          if (typeValue && (card.getAttribute('data-type') || '').toLowerCase() !== typeValue) {
            keep = false;
          }
          if (regionValue && (card.getAttribute('data-region') || '').toLowerCase() !== regionValue) {
            keep = false;
          }
          card.classList.toggle('is-filtered-out', !keep);
        });
      }

      [search, year, type, region].forEach(function (el) {
        if (el) {
          el.addEventListener('input', apply);
          el.addEventListener('change', apply);
        }
      });
    });
  }

  ready(function () {
    setupMenu();
    setupHero();
    setupFilters();
  });
})();
