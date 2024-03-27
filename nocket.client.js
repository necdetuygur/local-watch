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
  const myName = localStorage.getItem("myName");
  const toName = localStorage.getItem("toName");
  const inputEl = `
    Ben: <input onkeyup="ChangeMyName(this)" onblur="ChangeMyName(this)" onchange="ChangeMyName(this)" style="width: 30%" value="${myName}" />
    &nbsp; &nbsp;
    O: <input onkeyup="ChangeToName(this)" onblur="ChangeToName(this)" onchange="ChangeToName(this)" style="width: 30%" value="${toName}" />
    &nbsp; &nbsp;
    <input type="button" value="Gönder" onclick="SendVideoStateToName()" />
  `;
  if (append) {
    window.denk.innerHTML += " # " + message;
  } else {
    window.denk.innerHTML = `${inputEl}<br>Denk: ${message}`;
  }
  try {
    clearTimeout(DenkTimer);
  } catch (error) {}
  DenkTimer = setTimeout(() => {
    window.denk.innerHTML = `${inputEl}<br>. . .`;
  }, 1e4);
};

const ChangeMyName = async (e) => {
  const myName = e.value;
  localStorage.setItem("myName", myName);
  await MockApi(localStorage.getItem("myName"), Nocket.ID);
};

const ChangeToName = (e) => {
  const toName = e.value;
  localStorage.setItem("toName", toName);
};

const Copy = (str) => {
  navigator.clipboard.writeText(str);
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
    play = data.play == 1 ? "▶️" : "⏸️";

    Denk(`Yeni veri geldi: ${hms} / ${speed}x / ${play}`);
  } catch (error) {}
};

const Send = (id, data = {}) => {
  if (!id) return;
  Nocket.Send(id, data);
};

const SendVideoStateToName = async () => {
  const mockApiData = await MockApi();
  const toId = mockApiData[localStorage.getItem("toName")];
  const videoState = GetVideoState();
  Denk(`${videoState.play ? "▶️" : "⏸️"} ${videoState.speed}x`, 1);
  Send(toId, videoState);
  let i = 3;
  while (--i) {
    setTimeout(() => {
      Send(toId, videoState);
    }, i * 100);
  }
};

const SendForwarded = (data) => {
  if (data.FromID != Nocket.ID) {
    Send(data.FromID, { forwarded: 1, data });
  }
};

const Reconnect = async () => {
  await Nocket.Reconnect();
  await Reconnect();
};

const MockApi = async (key = "", value = "") => {
  const endpoint = "https://65a4555a52f07a8b4a3d57cb.mockapi.io/api/nocket";
  const empty =
    (await (await fetch(endpoint + "/1")).text()).indexOf("wrong") > -1;

  if (empty) {
    await fetch(endpoint, {
      method: "POST",
      body: JSON.stringify({
        data: {},
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
  }

  const data = (await (await fetch(endpoint + "/1")).json()).data;
  data[key] = value;

  await fetch(endpoint + "/1", {
    method: "PUT",
    body: JSON.stringify({
      data,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });
  return data;
};

if (!(document.head.innerText.indexOf("nocket.js") > -1)) {
  var script = document.createElement("script");
  script.src = "https://necdetuygur.github.io/local-watch/nocket.js";
  document.head.appendChild(script);
  /* */
  setTimeout(async () => {
    CreateDenk();
    Denk(`Denk başlatıldı`);
    await MockApi(localStorage.getItem("myName"), Nocket.ID);
    Denk(`Nocket ID hazır`, 1);
    Nocket.Listen((data) => {
      console.log(JSON.stringify(data, null, 2));
      try {
        if (data.FromID != Nocket.ID) {
          if (data.forwarded) {
            Denk("İletildi", 1);
          } else {
            SendForwarded(data);
            SetVideoState(data);
          }
        }
      } catch (error) {}
    });
    await Reconnect();
  }, 3e3);
  /* */
  setTimeout(async () => {
    Denk(`Play & Pause events prepared.`, 1);
    window.frames[0].frameElement.contentWindow.document
      .querySelector(
        "#player > div.jw-wrapper.jw-reset > div.jw-media.jw-reset > video"
      )
      .addEventListener("pause", (event) => {
        SendVideoStateToName();
      });
    window.frames[0].frameElement.contentWindow.document
      .querySelector(
        "#player > div.jw-wrapper.jw-reset > div.jw-media.jw-reset > video"
      )
      .addEventListener("play", (event) => {
        SendVideoStateToName();
      });
  }, 3e3);
}
