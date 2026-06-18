(function () {
    const body = document.body;
    const menuToggle = document.querySelector('[data-menu-toggle]');

    if (menuToggle) {
        menuToggle.addEventListener('click', function () {
            body.classList.toggle('menu-open');
        });
    }

    document.querySelectorAll('.mobile-nav a').forEach(function (link) {
        link.addEventListener('click', function () {
            body.classList.remove('menu-open');
        });
    });

    const slides = Array.from(document.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(document.querySelectorAll('[data-hero-dot]'));
    let heroIndex = 0;
    let heroTimer = null;

    function activateHero(index) {
        if (!slides.length) {
            return;
        }
        heroIndex = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle('active', slideIndex === heroIndex);
        });
        dots.forEach(function (dot, dotIndex) {
            dot.classList.toggle('active', dotIndex === heroIndex);
        });
        const image = slides[heroIndex].querySelector('img');
        const heroBg = document.querySelector('[data-hero-bg]');
        if (image && heroBg) {
            heroBg.setAttribute('src', image.getAttribute('src'));
            heroBg.setAttribute('alt', image.getAttribute('alt') || '');
        }
    }

    function startHero() {
        if (slides.length < 2) {
            return;
        }
        window.clearInterval(heroTimer);
        heroTimer = window.setInterval(function () {
            activateHero(heroIndex + 1);
        }, 5200);
    }

    dots.forEach(function (dot, index) {
        dot.addEventListener('click', function () {
            activateHero(index);
            startHero();
        });
    });

    activateHero(0);
    startHero();

    document.querySelectorAll('[data-card-search]').forEach(function (scope) {
        const input = scope.querySelector('[data-search-input]');
        const chips = Array.from(scope.querySelectorAll('[data-filter]'));
        const cards = Array.from(scope.querySelectorAll('[data-card]'));
        const count = scope.querySelector('[data-result-count]');
        let activeFilter = 'all';

        function normalize(value) {
            return (value || '').toString().trim().toLowerCase();
        }

        function applyFilter() {
            const query = normalize(input ? input.value : '');
            let visible = 0;
            cards.forEach(function (card) {
                const searchText = normalize(card.getAttribute('data-search'));
                const filterValue = card.getAttribute('data-category') || '';
                const queryMatch = !query || searchText.indexOf(query) !== -1;
                const filterMatch = activeFilter === 'all' || filterValue === activeFilter;
                const show = queryMatch && filterMatch;
                card.style.display = show ? '' : 'none';
                if (show) {
                    visible += 1;
                }
            });
            if (count) {
                count.textContent = visible + ' 部影片';
            }
        }

        if (input) {
            input.addEventListener('input', applyFilter);
        }

        chips.forEach(function (chip) {
            chip.addEventListener('click', function () {
                activeFilter = chip.getAttribute('data-filter') || 'all';
                chips.forEach(function (item) {
                    item.classList.toggle('active', item === chip);
                });
                applyFilter();
            });
        });

        applyFilter();
    });
})();
