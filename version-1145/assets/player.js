import { H as Hls } from "./hls-vendor.js";

document.addEventListener("DOMContentLoaded", function () {
  var players = document.querySelectorAll("[data-player]");

  players.forEach(function (player) {
    var button = player.querySelector("[data-player-start]");

    if (!button) {
      return;
    }

    button.addEventListener("click", function () {
      startPlayer(player);
    });
  });
});

function startPlayer(player) {
  var video = player.querySelector("video");
  var message = player.querySelector("[data-player-message]");

  if (!video) {
    return;
  }

  var source = video.dataset.hls;

  if (!source) {
    showMessage(message, "暂未配置播放源。");
    return;
  }

  player.classList.add("is-playing");

  if (video.canPlayType("application/vnd.apple.mpegurl")) {
    video.src = source;
    playVideo(video, message);
    return;
  }

  if (Hls && Hls.isSupported()) {
    var hls = new Hls({
      enableWorker: true,
      lowLatencyMode: true,
      backBufferLength: 90
    });

    hls.loadSource(source);
    hls.attachMedia(video);

    hls.on(Hls.Events.MANIFEST_PARSED, function () {
      playVideo(video, message);
    });

    hls.on(Hls.Events.ERROR, function (event, data) {
      if (data && data.fatal) {
        showMessage(message, "播放源加载失败，请刷新页面后重试。");
      }
    });

    return;
  }

  showMessage(message, "当前浏览器不支持 HLS 播放，请更换现代浏览器。");
}

function playVideo(video, message) {
  var promise = video.play();

  if (promise && typeof promise.catch === "function") {
    promise.catch(function () {
      showMessage(message, "浏览器已阻止自动播放，请再次点击播放器开始观看。");
    });
  }
}

function showMessage(target, text) {
  if (target) {
    target.textContent = text;
  }
}
