(function () {
  var toggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', function () {
      navLinks.classList.toggle('is-open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
  if (slides.length > 0) {
    var active = 0;
    var show = function (index) {
      active = index;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === active);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === active);
      });
    };
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
      });
    });
    setInterval(function () {
      show((active + 1) % slides.length);
    }, 5200);
  }

  var siteSearch = document.querySelector('#site-search');
  var panel = document.querySelector('#search-panel');
  if (siteSearch && panel && Array.isArray(window.SEARCH_INDEX)) {
    var renderResults = function (query) {
      var key = query.trim().toLowerCase();
      if (!key) {
        panel.classList.remove('is-open');
        panel.innerHTML = '';
        return;
      }
      var results = window.SEARCH_INDEX.filter(function (item) {
        return [item.title, item.region, item.type, item.year, item.genre, item.tags]
          .join(' ')
          .toLowerCase()
          .indexOf(key) !== -1;
      }).slice(0, 12);
      panel.innerHTML = results.length ? results.map(function (item) {
        return '<a class="search-item" href="' + item.link + '">' +
          '<img src="' + item.cover + '" alt="' + item.title.replace(/"/g, '&quot;') + '">' +
          '<span><strong>' + item.title + '</strong><span>' + item.year + ' · ' + item.region + ' · ' + item.type + '</span></span>' +
          '</a>';
      }).join('') : '<div class="search-item"><span><strong>未找到匹配影片</strong><span>请尝试其他片名、地区或类型</span></span></div>';
      panel.classList.add('is-open');
    };
    siteSearch.addEventListener('input', function () {
      renderResults(siteSearch.value);
    });
    document.addEventListener('click', function (event) {
      if (!panel.contains(event.target) && event.target !== siteSearch) {
        panel.classList.remove('is-open');
      }
    });
  }

  var localSearch = document.querySelector('.local-search');
  if (localSearch) {
    var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card, .rank-item'));
    localSearch.addEventListener('input', function () {
      var key = localSearch.value.trim().toLowerCase();
      cards.forEach(function (card) {
        var text = card.textContent.toLowerCase();
        card.style.display = text.indexOf(key) !== -1 ? '' : 'none';
      });
    });
  }
}());
