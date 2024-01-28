(() => {
  // src/index.ts
  function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      var successful = document.execCommand("copy");
      var msg = successful ? "successful" : "unsuccessful";
      console.log("Fallback: Copying text command was " + msg);
    } catch (err) {
      console.error("Fallback: Oops, unable to copy", err);
    }
    document.body.removeChild(textArea);
  }
  function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
      fallbackCopyTextToClipboard(text);
      return;
    }
    navigator.clipboard.writeText(text).then(function() {
      console.log("Async: Copying to clipboard was successful!");
    }, function(err) {
      console.error("Async: Could not copy text: ", err);
    });
  }
  var $ = (s) => {
    const el = document.querySelector(s);
    if (!el)
      throw new Error(`${s} not found!`);
    return el;
  };
  var sendClipboardBtn = $("#send-clipboard");
  var textarea = $("#textarea");
  var sendTextareaBtn = $("#send-textarea");
  var received = $("#received");
  sendClipboardBtn.addEventListener("click", async () => {
    const text = await window.navigator.clipboard.readText();
    await fetch("/data", {
      method: "POST",
      body: JSON.stringify({
        data: text,
        date: +/* @__PURE__ */ new Date()
      })
    });
    window.location.reload();
  });
  sendTextareaBtn.addEventListener("click", async () => {
    const text = textarea.value;
    if (text === "")
      return;
    await fetch("/data", {
      method: "POST",
      body: JSON.stringify({
        data: text,
        date: +/* @__PURE__ */ new Date()
      })
    });
    textarea.value = "";
    window.location.reload();
  });
  (async () => {
    try {
      const broadcastedReq = await fetch("/data");
      const data = await broadcastedReq.json();
      data.reverse().forEach((message) => {
        const container = document.createElement("div");
        const btn = document.createElement("button");
        const pre = document.createElement("pre");
        container.appendChild(btn);
        container.appendChild(pre);
        btn.innerText = "Copy";
        pre.innerText = message.data;
        btn.addEventListener("click", () => {
          copyTextToClipboard(message.data);
        });
        received.appendChild(container);
      });
    } catch (e) {
      console.log(e);
    }
  })();
})();
