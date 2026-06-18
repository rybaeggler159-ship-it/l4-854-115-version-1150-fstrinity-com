
(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function renderCard(movie, root) {
        var title = escapeHtml(movie.title);
        var first = escapeHtml(movie.title.slice(0, 2));
        var tags = String(movie.tags || "")
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 3)
            .map(function (tag) {
                return "<span>" + escapeHtml(tag) + "</span>";
            })
            .join("");

        return [
            "<article class=\"movie-card\">",
            "<a class=\"poster " + escapeHtml(movie.tone || "tone-0") + "\" href=\"" + root + escapeHtml(movie.url) + "\">",
            "<span class=\"poster-kind\">" + escapeHtml(movie.type) + "</span>",
            "<span class=\"poster-title\">" + first + "</span>",
            "<span class=\"poster-year\">" + escapeHtml(movie.year) + "</span>",
            "</a>",
            "<div class=\"movie-card-body\">",
            "<h3><a href=\"" + root + escapeHtml(movie.url) + "\">" + title + "</a></h3>",
            "<p class=\"movie-meta\">" + escapeHtml(movie.year) + " · " + escapeHtml(movie.region) + " · " + escapeHtml(movie.type) + "</p>",
            "<p class=\"movie-genre\">" + escapeHtml(movie.genre) + "</p>",
            "<p class=\"movie-line\">" + escapeHtml(movie.oneLine) + "</p>",
            "<div class=\"tag-row\">" + tags + "</div>",
            "</div>",
            "</article>"
        ].join("");
    }

    function normalize(value) {
        return String(value || "").toLowerCase().replace(/\s+/g, "");
    }

    function initNavigation() {
        var button = document.querySelector(".nav-toggle");
        var nav = document.querySelector(".site-nav");
        if (!button || !nav) {
            return;
        }

        button.addEventListener("click", function () {
            var opened = nav.classList.toggle("is-open");
            button.setAttribute("aria-expanded", opened ? "true" : "false");
        });
    }

    function initSearch() {
        var input = document.getElementById("movie-search");
        var results = document.getElementById("search-results");
        var count = document.getElementById("search-count");
        var data = window.MOVIE_INDEX || [];
        var root = document.body.getAttribute("data-root") || "";

        if (!input || !results || !count || !data.length) {
            return;
        }

        function runSearch() {
            var query = normalize(input.value);
            if (!query) {
                results.innerHTML = "";
                count.textContent = "输入关键词后显示结果";
                return;
            }

            var matched = data.filter(function (movie) {
                var haystack = normalize([
                    movie.title,
                    movie.year,
                    movie.region,
                    movie.type,
                    movie.genre,
                    movie.tags,
                    movie.oneLine
                ].join(" "));
                return haystack.indexOf(query) !== -1;
            }).slice(0, 96);

            count.textContent = "找到 " + matched.length + " 条结果";
            results.innerHTML = matched.map(function (movie) {
                return renderCard(movie, root);
            }).join("");
        }

        input.addEventListener("input", runSearch);
        var params = new URLSearchParams(window.location.search);
        var keyword = params.get("q");
        if (keyword) {
            input.value = keyword;
            runSearch();
        }
    }

    ready(function () {
        initNavigation();
        initSearch();
    });
}());
