
self.onmessage = function handleMessageFromMain(msg) {

  const { content, id, type } = msg.data
  fetch(`data:${type};base64,${content}`)
    .then(r => r.blob())
    .then(b => b.arrayBuffer())
    .then(data => {
      self.postMessage({ id, data });
    })
    .catch(e => {
      self.postMessage({ id, error: e.toString() });
    })

};