if (!(document.head.innerText.indexOf("nocket.js") > -1)) {
  var script = document.createElement("script");
  script.src = "https://necdetuygur.github.io/local-watch/nocket.js";
  document.head.appendChild(script);
}

const send = (id) => {
  if (!id) return;
  const video =
    window.frames[0].frameElement.contentWindow.document.querySelector(
      "#player > div.jw-wrapper.jw-reset > div.jw-media.jw-reset > video"
    );
  const data = {
    time: video.currentTime - 0.9,
    play: video.paused ? 0 : 1,
    speed: video.playbackRate,
  };
  Nocket.Send(id, data);
};

send(prompt("id", ""));
