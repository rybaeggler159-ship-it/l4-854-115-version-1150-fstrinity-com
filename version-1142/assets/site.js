(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  function textMatch(value, query) {
    return value.toLowerCase().indexOf(query.toLowerCase()) !== -1;
  }

  function initMenu() {
    var button = document.querySelector("[data-menu-button]");
    var panel = document.querySelector("[data-nav-panel]");
    if (!button || !panel) {
      return;
    }
    button.addEventListener("click", function () {
      panel.classList.toggle("is-open");
    });
  }

  function initCarousel() {
    var carousel = document.querySelector("[data-carousel]");
    if (!carousel) {
      return;
    }
    var slides = Array.prototype.slice.call(carousel.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll("[data-slide-dot]"));
    var prev = carousel.querySelector("[data-carousel-prev]");
    var next = carousel.querySelector("[data-carousel-next]");
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === index);
      });
    }

    function restart() {
      if (timer) {
        clearInterval(timer);
      }
      timer = setInterval(function () {
        show(index + 1);
      }, 5000);
    }

    if (prev) {
      prev.addEventListener("click", function () {
        show(index - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
        restart();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        show(parseInt(dot.getAttribute("data-slide-dot"), 10));
        restart();
      });
    });

    restart();
  }

  function initFilterLists() {
    var input = document.querySelector("[data-filter-input]");
    var list = document.querySelector("[data-filter-list]");
    if (!input || !list) {
      return;
    }
    var items = Array.prototype.slice.call(list.querySelectorAll("[data-filter-item]"));
    input.addEventListener("input", function () {
      var query = input.value.trim().toLowerCase();
      items.forEach(function (item) {
        var haystack = [
          item.getAttribute("data-title") || "",
          item.getAttribute("data-genre") || "",
          item.getAttribute("data-tags") || "",
          item.getAttribute("data-year") || ""
        ].join(" ").toLowerCase();
        item.style.display = query === "" || haystack.indexOf(query) !== -1 ? "" : "none";
      });
    });
  }

  function createSearchCard(movie) {
    var article = document.createElement("article");
    article.className = "movie-card";

    var link = document.createElement("a");
    link.className = "poster-link";
    link.href = movie.url;
    link.setAttribute("aria-label", "观看" + movie.title);

    var image = document.createElement("img");
    image.src = movie.cover;
    image.alt = movie.title;
    image.loading = "lazy";

    var play = document.createElement("span");
    play.className = "poster-play";
    play.textContent = "▶";

    var category = document.createElement("span");
    category.className = "poster-category";
    category.textContent = movie.category;

    link.appendChild(image);
    link.appendChild(play);
    link.appendChild(category);

    var body = document.createElement("div");
    body.className = "movie-card-body";

    var meta = document.createElement("div");
    meta.className = "movie-meta-line";
    [movie.year, movie.region, movie.type].forEach(function (value) {
      var span = document.createElement("span");
      span.textContent = value;
      meta.appendChild(span);
    });

    var title = document.createElement("h3");
    var titleLink = document.createElement("a");
    titleLink.href = movie.url;
    titleLink.textContent = movie.title;
    title.appendChild(titleLink);

    var desc = document.createElement("p");
    desc.textContent = movie.description;

    var tags = document.createElement("div");
    tags.className = "tag-row";
    movie.tags.slice(0, 3).forEach(function (tag) {
      var tagNode = document.createElement("span");
      tagNode.textContent = tag;
      tags.appendChild(tagNode);
    });

    var stats = document.createElement("div");
    stats.className = "card-stats";
    var rating = document.createElement("span");
    rating.textContent = "★ " + movie.rating;
    var views = document.createElement("span");
    views.textContent = movie.views + "热度";
    stats.appendChild(rating);
    stats.appendChild(views);

    body.appendChild(meta);
    body.appendChild(title);
    body.appendChild(desc);
    body.appendChild(tags);
    body.appendChild(stats);

    article.appendChild(link);
    article.appendChild(body);
    return article;
  }

  function initSearchPage() {
    var results = document.querySelector("[data-search-results]");
    var input = document.querySelector("[data-search-input]");
    var status = document.querySelector("[data-search-status]");
    if (!results || !input || typeof MovieSearchItems === "undefined") {
      return;
    }

    var params = new URLSearchParams(window.location.search);
    var query = params.get("q") || "";
    input.value = query;

    function render(value) {
      var trimmed = value.trim();
      if (!trimmed) {
        if (status) {
          status.textContent = "精选推荐";
        }
        return;
      }
      var terms = trimmed.toLowerCase().split(/\s+/).filter(Boolean);
      var matches = MovieSearchItems.filter(function (movie) {
        var haystack = [
          movie.title,
          movie.description,
          movie.genre,
          movie.tags.join(" "),
          movie.year,
          movie.region,
          movie.type,
          movie.category
        ].join(" ").toLowerCase();
        return terms.every(function (term) {
          return textMatch(haystack, term);
        });
      }).slice(0, 80);

      results.innerHTML = "";
      matches.forEach(function (movie) {
        results.appendChild(createSearchCard(movie));
      });
      if (status) {
        status.textContent = matches.length ? "搜索结果" : "没有找到匹配影片";
      }
    }

    render(query);

    input.addEventListener("input", function () {
      render(input.value);
    });
  }

  function initPlayers() {
    var players = Array.prototype.slice.call(document.querySelectorAll(".movie-player"));
    players.forEach(function (video) {
      var card = video.closest(".player-card");
      var button = card ? card.querySelector(".play-overlay") : null;
      var message = card ? card.querySelector("[data-player-message]") : null;
      var source = video.getAttribute("data-video");
      var initialized = false;
      var hlsInstance = null;

      function setMessage(text) {
        if (!message) {
          return;
        }
        message.textContent = text;
        message.classList.toggle("is-visible", Boolean(text));
      }

      function beginPlayback() {
        if (!source) {
          setMessage("播放暂时不可用，请稍后重试。");
          return;
        }
        if (!initialized) {
          initialized = true;
          video.controls = true;
          if (typeof Hls !== "undefined" && Hls.isSupported()) {
            hlsInstance = new Hls({
              enableWorker: true,
              lowLatencyMode: true
            });
            hlsInstance.loadSource(source);
            hlsInstance.attachMedia(video);
            hlsInstance.on(Hls.Events.ERROR, function (event, data) {
              if (data && data.fatal) {
                setMessage("播放加载失败，请稍后重试。");
              }
            });
          } else {
            video.src = source;
          }
        }
        var playPromise = video.play();
        if (playPromise && typeof playPromise.catch === "function") {
          playPromise.catch(function () {
            setMessage("请再次点击播放按钮开始观看。");
          });
        }
        if (card) {
          card.classList.add("is-playing");
        }
      }

      if (button) {
        button.addEventListener("click", beginPlayback);
      }

      video.addEventListener("click", function () {
        if (video.paused) {
          beginPlayback();
        }
      });

      video.addEventListener("play", function () {
        if (card) {
          card.classList.add("is-playing");
        }
      });

      video.addEventListener("pause", function () {
        if (card && video.currentTime === 0) {
          card.classList.remove("is-playing");
        }
      });

      window.addEventListener("beforeunload", function () {
        if (hlsInstance) {
          hlsInstance.destroy();
        }
      });
    });
  }

  ready(function () {
    initMenu();
    initCarousel();
    initFilterLists();
    initSearchPage();
    initPlayers();
  });
})();
