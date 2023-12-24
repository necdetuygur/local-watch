Server:
```js
javascript: if (!(document.head.innerText.indexOf("nocket.server.js") > -1)) { var script = document.createElement("script"); script.src = "https://necdetuygur.github.io/local-watch/nocket.server.js"; document.head.appendChild(script); }; send(localStorage.setItem("nockId", prompt("id", localStorage.getItem("nockId"))) || localStorage.getItem("nockId"));
```

Client:
```js
javascript: if (!(document.head.innerText.indexOf("nocket.client.js") > -1)) { var script = document.createElement("script"); script.src = "https://necdetuygur.github.io/local-watch/nocket.client.js"; document.head.appendChild(script); }; prompt("", Nocket.ID);
```
