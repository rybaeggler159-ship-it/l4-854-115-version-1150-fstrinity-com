function startMoviePlayer(sourceUrl) {
  var video = document.getElementById('movieVideo');
  var cover = document.querySelector('[data-player-action="play"]');
  var box = document.getElementById('playerBox');
  var hls = null;

  if (!video || !sourceUrl) {
    return;
  }

  function attach() {
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = sourceUrl;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(sourceUrl);
      hls.attachMedia(video);
      return;
    }

    video.src = sourceUrl;
  }

  function play() {
    if (cover) {
      cover.classList.add('is-hidden');
    }
    video.controls = true;
    var playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function () {});
    }
  }

  function togglePlay() {
    if (video.paused) {
      play();
    } else {
      video.pause();
    }
  }

  attach();

  if (cover) {
    cover.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      play();
    });
  }

  if (box) {
    box.addEventListener('click', function (event) {
      if (event.target === video) {
        togglePlay();
      }
    });
  }

  window.addEventListener('beforeunload', function () {
    if (hls && typeof hls.destroy === 'function') {
      hls.destroy();
    }
  });
}
