Server:
```js
javascript: if (!(document.head.innerText.indexOf("nocket.server.js") > -1)) {   var script = document.createElement("script");   script.src = "https://necdetuygur.github.io/local-watch/nocket.server.js";   document.head.appendChild(script); } send(   (() => {     const id = prompt("sendId", localStorage.getItem("sendId"));     localStorage.setItem("sendId", id);     return id;   })() ); 
```

Client:
```js
javascript: if (!(document.head.innerText.indexOf("nocket.client.js") > -1)) { var script = document.createElement("script"); script.src = "https://necdetuygur.github.io/local-watch/nocket.client.js"; document.head.appendChild(script); }; prompt("", Nocket.ID);
```
