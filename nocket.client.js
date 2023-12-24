if (!(document.head.innerText.indexOf("nocket") > -1)) {
  var script = document.createElement("script");
  script.src = "https://necdetuygur.github.io/local-watch/nocket.js";
  document.head.appendChild(script);
  /* */
  setTimeout(() => {
    Nocket.Listen((data) => {
      alert(JSON.stringify(data, null, 2));
      const video =
        window.frames[0].frameElement.contentWindow.document.querySelector(
          "#player > div.jw-wrapper.jw-reset > div.jw-media.jw-reset > video"
        );
      data.time = parseFloat(data.time);
      data.play = data.play == 1;
      data.speed = parseFloat(data.speed);
      video.currentTime = parseFloat(data.time);
      data.play ? video.play() : video.pause();
      video.playbackRate = parseFloat(data.speed);
    });
    prompt("", Nocket.ID);
  }, 3e3);
}
