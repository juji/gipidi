import 'highlight.js/styles/github-dark-dimmed.min.css'

const workerQueue: {[id: string]:() => void} = {}
const maxLen = 42
let currentOp = 0
let currentQueue = 0

function start(){
  if(currentQueue < maxLen) {
    
    const key = currentOp + ''
    if(!workerQueue[key]) return;

    currentQueue++;
    currentOp++;

    const fn = workerQueue[key]
    fn && fn()
    
  }
}

function remove(i: string){
  delete workerQueue[i]
  currentQueue--;
  if(!Object.keys(workerQueue).length) currentOp = 0
  start()
}

export async function convert(str: string): Promise<string>{

  
  let resolve: (s: string) => void, reject: (s: string) => void;
  const p = new Promise((r: (s: string) => void, j: (s:string) => void) => {
    resolve = r
    reject = j
  })
  
  const id = Object.keys(workerQueue).length + ''
  workerQueue[id] = () => {
    const markedWorker = new Worker('/chat-printer.js');
  
    const terminate = setTimeout(() => {
      markedWorker.terminate();
      reject('Worker is taking too long')
      remove(id)
    },3000)

    markedWorker.onmessage = (e) => {
      clearTimeout(terminate)
      markedWorker.terminate();
      resolve(e.data as string);
      remove(id)
    };

    markedWorker.postMessage(str);

  }

  start()

  return p
  

}