import 'highlight.js/styles/github-dark-dimmed.min.css'

export async function convert(str: string): Promise<string>{
  
  const markedWorker = new Worker('/chat-printer.js');

  return new Promise((r,j) => {

    const terminate = setTimeout(() => {
      markedWorker.terminate();
      j('Worker is taking too long')
    },300)

    markedWorker.onmessage = (e) => {
      clearTimeout(terminate)
      r(e.data);
      markedWorker.terminate();
    };

    markedWorker.postMessage(str);

  })

}