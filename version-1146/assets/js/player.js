function startMoviePlayer(source) {
  var video = document.querySelector('#movie-video');
  var overlay = document.querySelector('.play-overlay');
  if (!video || !source) {
    return;
  }
  var ready = false;
  var load = function () {
    if (ready) {
      return;
    }
    ready = true;
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
    } else if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls();
      hls.loadSource(source);
      hls.attachMedia(video);
    } else {
      video.src = source;
    }
  };
  var begin = function () {
    load();
    if (overlay) {
      overlay.classList.add('is-hidden');
    }
    var promise = video.play();
    if (promise && typeof promise.catch === 'function') {
      promise.catch(function () {});
    }
  };
  if (overlay) {
    overlay.addEventListener('click', begin);
  }
  video.addEventListener('play', function () {
    if (overlay) {
      overlay.classList.add('is-hidden');
    }
  });
  video.addEventListener('click', function () {
    if (!ready) {
      begin();
    }
  });
}
