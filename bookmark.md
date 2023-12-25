Server:
```js
javascript: const sendId = () => {   const id = prompt("sendId", localStorage.getItem("nockId"));   localStorage.setItem("sendId", id); };  if (!(document.head.innerText.indexOf("nocket.server.js") > -1)) {   var script = document.createElement("script");   script.src = "https://necdetuygur.github.io/local-watch/nocket.server.js";   document.head.appendChild(script); }  send(sendId());
```

Client:
```js
javascript: if (!(document.head.innerText.indexOf("nocket.client.js") > -1)) { var script = document.createElement("script"); script.src = "https://necdetuygur.github.io/local-watch/nocket.client.js"; document.head.appendChild(script); }; prompt("", Nocket.ID);
```
