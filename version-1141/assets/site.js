(function () {
    function qs(selector, root) {
        return (root || document).querySelector(selector);
    }

    function qsa(selector, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(selector));
    }

    function setupMenu() {
        var button = qs(".mobile-menu-button");
        var nav = qs(".main-nav");
        if (!button || !nav) {
            return;
        }
        button.addEventListener("click", function () {
            var opened = nav.classList.toggle("is-open");
            button.setAttribute("aria-expanded", opened ? "true" : "false");
        });
    }

    function setupHero() {
        var root = qs("[data-hero-carousel]");
        if (!root) {
            return;
        }
        var slides = qsa(".hero-slide", root);
        var dots = qsa(".hero-dot", root);
        var prev = qs(".hero-prev", root);
        var next = qs(".hero-next", root);
        var index = 0;
        var timer = null;

        function show(nextIndex) {
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle("active", i === index);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle("active", i === index);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                show(Number(dot.getAttribute("data-target") || 0));
                start();
            });
        });

        if (prev) {
            prev.addEventListener("click", function () {
                show(index - 1);
                start();
            });
        }

        if (next) {
            next.addEventListener("click", function () {
                show(index + 1);
                start();
            });
        }

        root.addEventListener("mouseenter", stop);
        root.addEventListener("mouseleave", start);
        show(0);
        start();
    }

    function setupSearch() {
        var form = qs("[data-search-form]");
        if (!form) {
            return;
        }
        var cards = qsa(".searchable-card");
        var noResult = qs(".no-result");

        function applyFilter() {
            var data = new FormData(form);
            var keyword = String(data.get("keyword") || "").trim().toLowerCase();
            var category = String(data.get("category") || "").trim();
            var year = String(data.get("year") || "").trim();
            var visible = 0;

            cards.forEach(function (card) {
                var text = [
                    card.getAttribute("data-title") || "",
                    card.getAttribute("data-genre") || "",
                    card.getAttribute("data-region") || "",
                    card.getAttribute("data-category") || ""
                ].join(" ").toLowerCase();
                var cardCategory = card.getAttribute("data-category") || "";
                var cardYear = card.getAttribute("data-year") || "";
                var matched = true;

                if (keyword && text.indexOf(keyword) === -1) {
                    matched = false;
                }
                if (category && cardCategory !== category) {
                    matched = false;
                }
                if (year && cardYear !== year) {
                    matched = false;
                }

                card.hidden = !matched;
                if (matched) {
                    visible += 1;
                }
            });

            if (noResult) {
                noResult.hidden = visible !== 0;
            }
        }

        form.addEventListener("submit", function (event) {
            event.preventDefault();
            applyFilter();
        });
        form.addEventListener("input", applyFilter);
        form.addEventListener("change", applyFilter);
        form.addEventListener("reset", function () {
            window.setTimeout(applyFilter, 0);
        });
        applyFilter();
    }

    document.addEventListener("DOMContentLoaded", function () {
        setupMenu();
        setupHero();
        setupSearch();
    });
}());

function setupMoviePlayer(videoId, buttonId, streamUrl) {
    var video = document.getElementById(videoId);
    var button = document.getElementById(buttonId);
    var ready = false;
    var hls = null;

    if (!video || !button || !streamUrl) {
        return;
    }

    function bindSource() {
        if (ready) {
            return;
        }
        ready = true;

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = streamUrl;
            return;
        }

        if (typeof Hls !== "undefined" && Hls.isSupported()) {
            hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hls.loadSource(streamUrl);
            hls.attachMedia(video);
            return;
        }

        video.src = streamUrl;
    }

    function startPlayback() {
        bindSource();
        button.classList.add("is-hidden");
        var promise = video.play();
        if (promise && typeof promise.catch === "function") {
            promise.catch(function () {
                button.classList.remove("is-hidden");
            });
        }
    }

    button.addEventListener("click", startPlayback);
    video.addEventListener("click", function () {
        if (video.paused) {
            startPlayback();
        }
    });
    video.addEventListener("play", function () {
        button.classList.add("is-hidden");
    });
    window.addEventListener("pagehide", function () {
        if (hls) {
            hls.destroy();
            hls = null;
        }
    });
}
