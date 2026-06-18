
(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  function card(movie) {
    var tags = movie.tags.slice(0, 3).map(function (tag) {
      return '<span>' + tag + '</span>';
    }).join('');
    return [
      '<article class="movie-card">',
      '<a class="poster-link" href="detail/movie-' + movie.mid + '.html" aria-label="观看' + movie.title + '">',
      '<img src="./' + movie.poster + '.jpg" alt="' + movie.title + '" loading="lazy">',
      '<span class="poster-shade"></span>',
      '<span class="play-hover">▶</span>',
      '<span class="card-badge">' + movie.category + '</span>',
      '</a>',
      '<div class="card-body">',
      '<h3><a href="detail/movie-' + movie.mid + '.html">' + movie.title + '</a></h3>',
      '<p>' + movie.oneLine + '</p>',
      '<div class="tag-row">' + tags + '</div>',
      '<div class="card-meta"><span>' + movie.year + '</span><span>' + movie.region + '</span><span>★ ' + movie.rating + '</span></div>',
      '</div>',
      '</article>'
    ].join('');
  }

  ready(function () {
    var results = document.getElementById('search-results');
    var summary = document.getElementById('search-summary');
    var input = document.querySelector('.search-page-form input[name="q"]');
    if (!results || !summary || !window.SEARCH_MOVIES) {
      return;
    }
    var params = new URLSearchParams(window.location.search);
    var query = params.get('q') || '';
    if (input) {
      input.value = query;
    }
    var keyword = normalize(query);
    var list = window.SEARCH_MOVIES.filter(function (movie) {
      if (!keyword) {
        return true;
      }
      return normalize([
        movie.title,
        movie.region,
        movie.type,
        movie.year,
        movie.genre,
        movie.oneLine,
        movie.tags.join(' ')
      ].join(' ')).indexOf(keyword) !== -1;
    }).slice(0, 120);
    if (list.length === 0) {
      summary.textContent = '没有找到匹配影片';
      results.innerHTML = '';
      return;
    }
    summary.textContent = keyword ? '搜索结果' : '热门影片';
    results.innerHTML = list.map(card).join('');
  });
})();
