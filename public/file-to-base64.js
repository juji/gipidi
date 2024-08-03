

const toBase64 = file => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = reject;
});

self.onmessage = function handleMessageFromMain(msg) {

  const { index, file } = msg.data
  
  toBase64(file)
    .then((v) => {
      const data = v.split(',')
      const type = data[0].split(';').shift().split(':').pop()
      self.postMessage({
        index,
        data: data[1],
        type 
      });
    })
    .catch(e => {
      self.postMessage({ index, error: e })
    })
};