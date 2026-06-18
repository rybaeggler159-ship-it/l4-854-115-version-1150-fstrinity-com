
(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  function bindPlayer(shell) {
    var video = shell.querySelector('.movie-video');
    var overlay = shell.querySelector('.player-overlay');
    var stream = shell.getAttribute('data-stream');
    var prepared = false;
    var instance = null;

    if (!video || !overlay || !stream) {
      return;
    }

    function prepare() {
      if (prepared) {
        return Promise.resolve();
      }
      prepared = true;
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
        return Promise.resolve();
      }
      if (window.Hls && window.Hls.isSupported()) {
        instance = new window.Hls({
          maxBufferLength: 30,
          enableWorker: true
        });
        instance.loadSource(stream);
        instance.attachMedia(video);
        return new Promise(function (resolve) {
          instance.on(window.Hls.Events.MANIFEST_PARSED, function () {
            resolve();
          });
          window.setTimeout(resolve, 1500);
        });
      }
      video.src = stream;
      return Promise.resolve();
    }

    function start() {
      overlay.classList.add('is-hidden');
      prepare().then(function () {
        return video.play();
      }).catch(function () {
        overlay.classList.remove('is-hidden');
      });
    }

    overlay.addEventListener('click', start);
    video.addEventListener('click', function () {
      if (video.paused) {
        start();
      }
    });
    video.addEventListener('play', function () {
      overlay.classList.add('is-hidden');
    });
    video.addEventListener('ended', function () {
      overlay.classList.remove('is-hidden');
    });
    window.addEventListener('beforeunload', function () {
      if (instance) {
        instance.destroy();
      }
    });
  }

  ready(function () {
    Array.prototype.slice.call(document.querySelectorAll('.player-shell')).forEach(bindPlayer);
  });
})();
