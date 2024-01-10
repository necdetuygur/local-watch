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
  denk.style.borderBottom = "1px solid #888";
  denk.style.fontSize = "13px";
  denk.style.color = "#fff";
  denk.style.backgroundColor = "#000";
  denk.style.padding = "5px";
};

const Denk = (message, append = 0) => {
  const inputEl = `
    Ben: <input onclick="Copy(this)" style="width: 30%" value="${
      Nocket.ID
    }" readonly />
    &nbsp; &nbsp;
    O: <input onkeyup="ChangeToId(this)" onblur="ChangeToId(this)" onchange="ChangeToId(this)" style="width: 30%" value="${localStorage.getItem(
      "toId"
    )}" />
    &nbsp; &nbsp;
    <input type="button" value="Gönder" onclick="SendVideoState()" />
  `;
  if (append) {
    window.denk.innerHTML = `${inputEl}<br>Denk: ${
      window.denk.innerHTML + " " + message
    }`;
  } else {
    window.denk.innerHTML = `${inputEl}<br>Denk: ${message}`;
  }
  try {
    clearTimeout(DenkTimer);
  } catch (error) {}
  DenkTimer = setTimeout(() => {
    window.denk.innerHTML = `${inputEl}<br>Denk: Veri bekleniyor`;
  }, 1e4);
};

const ChangeToId = (e) => {
  const toId = e.value;
  localStorage.setItem("toId", toId);
};

const Copy = (el) => {
  el.select();
  el.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(el.value);
  Denk("ID kopyalandı");
};

const GetVideoState = () => {
  try {
    const video =
      window.frames[0].frameElement.contentWindow.document.querySelector(
        "#player > div.jw-wrapper.jw-reset > div.jw-media.jw-reset > video"
      );
    return {
      time: video.currentTime,
      play: video.paused ? 0 : 1,
      speed: video.playbackRate,
    };
  } catch (error) {
    return {
      error: "not video element",
      time: 0,
      play: 0,
      speed: 0,
    };
  }
};

const SetVideoState = (data) => {
  try {
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
  } catch (error) {}
};

const Send = (id, data = {}) => {
  if (!id) return;
  Nocket.Send(id, data);
};

const SendVideoState = () => {
  const toId = localStorage.getItem("toId");
  const videoState = GetVideoState();
  Send(toId, videoState);
};

const SendForwarded = (data) => {
  if (data.FromID != Nocket.ID) {
    Send(data.FromID, { forwarded: 1, data });
  }
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
      console.log(JSON.stringify(data, null, 2));
      try {
        if (data.forwarded) {
          Denk("İletildi");
        } else {
          SendForwarded(data);
          SetVideoState(data);
        }
      } catch (error) {}
    });
  }, 3e3);
}
