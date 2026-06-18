(function () {
  function each(nodes, callback) {
    Array.prototype.forEach.call(nodes, callback);
  }

  var toggle = document.querySelector('[data-menu-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  each(document.querySelectorAll('[data-carousel]'), function (carousel) {
    var slides = carousel.querySelectorAll('[data-carousel-slide]');
    var dots = carousel.querySelectorAll('[data-carousel-dot]');
    var index = 0;
    var timer = null;

    function show(next) {
      index = (next + slides.length) % slides.length;
      each(slides, function (slide, i) {
        slide.classList.toggle('is-active', i === index);
      });
      each(dots, function (dot, i) {
        dot.classList.toggle('is-active', i === index);
      });
    }

    function start() {
      if (slides.length > 1) {
        timer = window.setInterval(function () {
          show(index + 1);
        }, 5200);
      }
    }

    each(dots, function (dot) {
      dot.addEventListener('click', function () {
        window.clearInterval(timer);
        show(Number(dot.getAttribute('data-carousel-dot') || 0));
        start();
      });
    });

    show(0);
    start();
  });

  each(document.querySelectorAll('[data-search-area]'), function (area) {
    var input = area.querySelector('[data-search-input]');
    var cards = area.querySelectorAll('[data-card]');
    var chips = area.querySelectorAll('[data-filter-value]');
    var empty = area.parentElement.querySelector('[data-empty-state]');
    var currentFilter = 'all';

    function apply() {
      var query = input ? input.value.trim().toLowerCase() : '';
      var visible = 0;

      each(cards, function (card) {
        var haystack = (card.getAttribute('data-keywords') || '').toLowerCase();
        var matchQuery = query === '' || haystack.indexOf(query) !== -1;
        var matchFilter = currentFilter === 'all' || haystack.indexOf(currentFilter.toLowerCase()) !== -1;
        var match = matchQuery && matchFilter;
        card.hidden = !match;
        if (match) {
          visible += 1;
        }
      });

      if (empty) {
        empty.classList.toggle('is-visible', visible === 0);
      }
    }

    if (input) {
      input.addEventListener('input', apply);
    }

    each(chips, function (chip) {
      chip.addEventListener('click', function () {
        currentFilter = chip.getAttribute('data-filter-value') || 'all';
        each(chips, function (item) {
          item.classList.toggle('is-active', item === chip);
        });
        apply();
      });
    });
  });
})();
