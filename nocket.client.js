let DenkTimer = null;
let ChangeMyNameTimer = null;
let OldNocketId = "";

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
  const toName = localStorage.getItem("toName");
  Nocket.Name = localStorage.getItem("Nocket.Name") || new Date().getTime();
  setInterval(async () => {
    await Nocket.Reconnect();
    if (OldNocketId != Nocket.ID) {
      fetch(`https://nocket-api.vercel.app/${Nocket.Name}/${Nocket.ID}`);
    }
  }, 1e3);
  fetch(`https://nocket-api.vercel.app/${Nocket.Name}/${Nocket.ID}`);
  const inputEl = `
    Ben: <input onkeyup="ChangeMyName(this)" style="width: 30%" value="${Nocket.Name}" />
    &nbsp; &nbsp;
    O: <input onkeyup="ChangeToName(this)" style="width: 30%" value="${toName}" />
    &nbsp; &nbsp;
    <input type="button" value="Gönder" onclick="SendName('${toName}')" />
  `;
  window.denk.innerHTML = `${inputEl}<br>Denk: ${message}`;
  try {
    clearTimeout(DenkTimer);
  } catch (error) {}
  DenkTimer = setTimeout(() => {
    window.denk.innerHTML = `${inputEl}<br>Denk: Veri bekleniyor`;
  }, 1e4);
};

const ChangeMyName = (e) => {
  Nocket.Name = e.value;
  localStorage.setItem("Nocket.Name", Nocket.Name);
  try {
    clearTimeout(ChangeMyNameTimer);
  } catch (error) {}
  ChangeMyNameTimer = setTimeout(() => {
    fetch(`https://nocket-api.vercel.app/${Nocket.Name}/${Nocket.ID}`);
  }, 2e3);
};

const ChangeToName = (e) => {
  const toName = e.value;
  localStorage.setItem("toName", toName);
};

const Copy = (el) => {
  el.select();
  el.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(el.value);
  Denk("ID kopyalandı");
};

const Send = (id) => {
  if (!id) return;
  const video =
    window.frames[0].frameElement.contentWindow.document.querySelector(
      "#player > div.jw-wrapper.jw-reset > div.jw-media.jw-reset > video"
    );
  const data = {
    time: video.currentTime,
    play: video.paused ? 0 : 1,
    speed: video.playbackRate,
  };
  Nocket.Send(id, data);
};

const SendName = async (name) => {
  const request = await fetch(`https://nocket-api.vercel.app/${name}`);
  const response = await request.json();
  const nocketId = response.nocket_id;
  Send(nocketId);
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
  }, 3e3);
}
