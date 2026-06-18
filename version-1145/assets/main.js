document.addEventListener("DOMContentLoaded", function () {
  setupMobileNavigation();
  setupHeroSlider();
  setupSearchFilters();
});

function setupMobileNavigation() {
  var toggle = document.querySelector(".mobile-toggle");
  var menu = document.querySelector(".nav-menu");

  if (!toggle || !menu) {
    return;
  }

  toggle.addEventListener("click", function () {
    var isOpen = menu.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.textContent = isOpen ? "×" : "☰";
  });
}

function setupHeroSlider() {
  var slider = document.querySelector("[data-hero-slider]");

  if (!slider) {
    return;
  }

  var slides = Array.from(slider.querySelectorAll("[data-hero-slide]"));
  var dots = Array.from(slider.querySelectorAll("[data-hero-dot]"));
  var prev = slider.querySelector("[data-hero-prev]");
  var next = slider.querySelector("[data-hero-next]");
  var current = 0;
  var timer = null;

  function show(index) {
    current = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle("is-active", slideIndex === current);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle("is-active", dotIndex === current);
    });
  }

  function start() {
    stop();
    timer = window.setInterval(function () {
      show(current + 1);
    }, 5200);
  }

  function stop() {
    if (timer) {
      window.clearInterval(timer);
    }
  }

  dots.forEach(function (dot) {
    dot.addEventListener("click", function () {
      show(Number(dot.dataset.heroDot));
      start();
    });
  });

  if (prev) {
    prev.addEventListener("click", function () {
      show(current - 1);
      start();
    });
  }

  if (next) {
    next.addEventListener("click", function () {
      show(current + 1);
      start();
    });
  }

  slider.addEventListener("mouseenter", stop);
  slider.addEventListener("mouseleave", start);
  start();
}

function setupSearchFilters() {
  var scopes = document.querySelectorAll("[data-search-scope]");

  scopes.forEach(function (scope) {
    var input = scope.querySelector("[data-search-input]");
    var yearFilter = scope.querySelector("[data-year-filter]");
    var typeFilter = scope.querySelector("[data-type-filter]");
    var count = scope.querySelector("[data-filter-count]");
    var cards = Array.from(scope.querySelectorAll(".movie-card"));

    if (!cards.length) {
      return;
    }

    function yearMatches(cardYear, selectedYear) {
      if (!selectedYear) {
        return true;
      }

      var numericYear = Number(cardYear);

      if (selectedYear === "2010") {
        return numericYear >= 2010 && numericYear < 2020;
      }

      if (selectedYear === "2000") {
        return numericYear >= 2000 && numericYear < 2010;
      }

      if (selectedYear === "1990") {
        return numericYear > 0 && numericYear < 2000;
      }

      return cardYear === selectedYear;
    }

    function applyFilters() {
      var query = input ? input.value.trim().toLowerCase() : "";
      var year = yearFilter ? yearFilter.value : "";
      var type = typeFilter ? typeFilter.value : "";
      var visible = 0;

      cards.forEach(function (card) {
        var searchText = card.dataset.search || "";
        var cardYear = card.dataset.year || "";
        var cardType = card.dataset.type || "";
        var matchesQuery = !query || searchText.indexOf(query) !== -1;
        var matchesYear = yearMatches(cardYear, year);
        var matchesType = !type || cardType.indexOf(type) !== -1;
        var shouldShow = matchesQuery && matchesYear && matchesType;

        card.hidden = !shouldShow;

        if (shouldShow) {
          visible += 1;
        }
      });

      if (count) {
        count.textContent = String(visible);
      }
    }

    if (input) {
      input.addEventListener("input", applyFilters);
    }

    if (yearFilter) {
      yearFilter.addEventListener("change", applyFilters);
    }

    if (typeFilter) {
      typeFilter.addEventListener("change", applyFilters);
    }
  });
}
