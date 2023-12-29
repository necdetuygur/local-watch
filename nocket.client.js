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
  Nocket.Name = localStorage.getItem("Nocket.Name");
  const inputEl = `<input onkeyup="ChangeName(this)" style="width: 100%" value="${Nocket.Name}" />`;
  window.denk.innerHTML = `${inputEl}<br>Denk: ${message}`;
  try {
    clearTimeout(DenkTimer);
  } catch (error) {}
  DenkTimer = setTimeout(() => {
    window.denk.innerHTML = `${inputEl}<br>Denk: Veri bekleniyor`;
  }, 1e4);
};

let ChangeNameTimer = null;
const ChangeName = (e) => {
  Nocket.Name = e.value;
  localStorage.setItem("Nocket.Name", Nocket.Name);
  try {
    clearTimeout(ChangeNameTimer);
  } catch (error) {}
  ChangeNameTimer = setTimeout(() => {
    fetch(`https://nocket-api.vercel.app/${name}/${Nocket.ID}`);
  }, 2e3);
};

// const Copy = (el) => {
//   el.select();
//   el.setSelectionRange(0, 99999);
//   navigator.clipboard.writeText(el.value);
//   Denk("ID kopyalandı");
// };

if (!(document.head.innerText.indexOf("nocket.js") > -1)) {
  var script = document.createElement("script");
  script.src = "https://necdetuygur.github.io/local-watch/nocket.js";
  document.head.appendChild(script);
  /* */
  setTimeout(() => {
    CreateDenk();
    Denk(`Denk başlatıldı`);
    Nocket.Listen((data) => {
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
      ).currentTime = data.time;

      window.frames[0].frameElement.contentWindow.document.querySelector(
        "#player > div.jw-wrapper.jw-reset > div.jw-media.jw-reset > video"
      ).playbackRate = data.speed;

      hms = new Date(data.time * 1000).toISOString().slice(11, 19);
      speed = data.speed;
      play = data.play == 1 ? "Play" : "Pause";

      Denk(`Yeni veri geldi: ${hms} / ${speed}x / ${play}`);
    });
  }, 5e3);
}
