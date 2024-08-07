import 'highlight.js/styles/github-dark-dimmed.min.css'

export async function convert(str: string): Promise<string>{

  return new Promise((r,j) => {

    const markedWorker = new Worker('/chat-printer.js');

    const terminate = setTimeout(() => {
      markedWorker.terminate();
      j('Worker is taking too long')
    },500)

    markedWorker.onmessage = (e) => {
      clearTimeout(terminate)
      r(e.data);
      markedWorker.terminate();
    };

    markedWorker.postMessage(str);

  })

}