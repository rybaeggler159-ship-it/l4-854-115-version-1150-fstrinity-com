(function () {
    function setupPlayer(box) {
        const video = box.querySelector('video');
        const playButton = box.querySelector('[data-play]');
        const stream = box.getAttribute('data-stream');
        let loaded = false;
        let hls = null;

        function loadStream() {
            if (loaded || !video || !stream) {
                return;
            }
            loaded = true;
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = stream;
                return;
            }
            if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(stream);
                hls.attachMedia(video);
                return;
            }
            video.src = stream;
        }

        function playVideo() {
            loadStream();
            box.classList.add('is-playing');
            const result = video.play();
            if (result && typeof result.catch === 'function') {
                result.catch(function () {});
            }
        }

        if (playButton) {
            playButton.addEventListener('click', playVideo);
        }

        if (video) {
            video.addEventListener('click', function () {
                if (!loaded) {
                    playVideo();
                }
            });
            video.addEventListener('play', function () {
                box.classList.add('is-playing');
            });
            video.addEventListener('ended', function () {
                box.classList.remove('is-playing');
            });
        }

        window.addEventListener('beforeunload', function () {
            if (hls && typeof hls.destroy === 'function') {
                hls.destroy();
            }
        });
    }

    document.querySelectorAll('[data-player]').forEach(setupPlayer);
})();
