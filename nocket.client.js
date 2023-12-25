let DenkTimer = null;

const CreateDenk = () => {
  var div = document.createElement("div");
  div.id = "denk";
  document.body.appendChild(div);
  window.denk = document.getElementById("denk");
  denk.style.position = "fixed";
  denk.style.left = 0;
  denk.style.top = 0;
  denk.style.right = 0;
  denk.style.width = "100%";
  denk.style.zIndex = 99999;
  denk.style.fontFamily = "arial";
  denk.style.fontSize = "13px";
  denk.style.color = "#fff";
  denk.style.backgroundColor = "#000";
  denk.style.padding = "5px";
};

const Denk = (message) => {
  const inputEl = `<input onclick="Copy(this)" style="width: 100%" value="${Nocket.ID}" />`;
  window.denk.innerHTML = `${inputEl}<br>Denk: ${message}`;
  try {
    clearTimeout(DenkTimer);
  } catch (error) {}
  DenkTimer = setTimeout(() => {
    window.denk.innerHTML = `${inputEl}<br>Denk: Veri bekleniyor`;
  }, 1e4);
};

const Copy = (el) => {
  el.select();
  el.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(el.value);
  Denk("ID kopyalandı");
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
      let hms = "";
      try {
        hours = Math.floor(data.time / 3600);
        data.time %= 3600;
        minutes = Math.floor(data.time / 60);
        seconds = data.time % 60;

        hms = `${hours}:${minutes}:${seconds}`;
      } catch (error) {}

      Denk(
        `Yeni veri geldi: ${hms} / ${data.speed} / ${
          data.play == 1 ? "Play" : "Pause"
        }`
      );

      if (data.play == 1) {
        window.frames[0].frameElement.contentWindow.document
          .querySelector(
            "#player > div.jw-wrapper.jw-reset > div.jw-media.jw-reset > video"
          )
          .play();
      } else {
        window.frames[0].frameElement.contentWindow.document
          .querySelector(
            "#player > div.jw-wrapper.jw-reset > div.jw-media.jw-reset > video"
          )
          .pause();
      }

      window.frames[0].frameElement.contentWindow.document.querySelector(
        "#player > div.jw-wrapper.jw-reset > div.jw-media.jw-reset > video"
      ).currentTime = parseFloat(data.time);

      window.frames[0].frameElement.contentWindow.document.querySelector(
        "#player > div.jw-wrapper.jw-reset > div.jw-media.jw-reset > video"
      ).playbackRate = parseFloat(data.speed);
    });
  }, 5e3);
}
