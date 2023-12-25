const CreateDenk = () => {
  var div = document.createElement("div");
  div.id = "denk";
  document.body.appendChild(div);
  window.denk = document.getElementById("denk");
  denk.style.position = "fixed";
  denk.style.left = 0;
  denk.style.top = 0;
  denk.style.zIndex = 99999;
  denk.style.fontFamily = "courier new";
  denk.style.fontSize = "17px";
  denk.style.color = "#fff";
  denk.style.backgroundColor = "#000";
  denk.style.padding = "5px";
};

const Denk = (message) => {
  window.denk.innerHTML = `<input style="width: 250px" value="${Nocket.ID}" /><br>Denk: ${message}`;
  setTimeout(() => {
    window.denk.innerHTML = `<input style="width: 250px" value="${Nocket.ID}" /><br>Denk: Veri bekleniyor`;
  }, 5e3);
};

if (!(document.head.innerText.indexOf("nocket.js") > -1)) {
  var script = document.createElement("script");
  script.src = "https://necdetuygur.github.io/local-watch/nocket.js";
  document.head.appendChild(script);
  /* */
  setTimeout(() => {
    CreateDenk();
    Denk(`Denk başlatıldı`);
    Nocket.Listen((data) => {
      Denk(`Yeni veri geldi: ${data.time}`);

      const video =
        window.frames[0].frameElement.contentWindow.document.querySelector(
          "#player > div.jw-wrapper.jw-reset > div.jw-media.jw-reset > video"
        );
      if (data.hasOwnProperty("play") && data.play) {
        data.play == 1 ? video.play() : video.pause();
      }
      video.currentTime = parseFloat(data.time);
      video.playbackRate = parseFloat(data.speed);
    });
  }, 5e3);
}
