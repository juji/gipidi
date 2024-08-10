import { GoogleGenerativeAI } from "@google/generative-ai";
import { Ollama } from 'ollama/browser'
// import { data } from './data'
import { getEmbedding, EmbeddingIndex } from 'client-vector-search';


const apikey = process.env.GEMINI_API_KEY
if(!apikey) throw new Error('NO Apikey')
  

const ollama = new Ollama({ host: 'http://localhost:11434' })

const genAI = new GoogleGenerativeAI(apikey);
const model = genAI.getGenerativeModel({
  model: "text-embedding-004",
});


;(async () => {

  const prompt = "Give me something about home?"

  const d = new Date().valueOf()
  const result = await model.embedContent(prompt);
  console.log('Gemini time', new Date().valueOf() - d)
  
  // console.log(result.embedding);

  const e = new Date().valueOf()
  await ollama.embeddings({
    model: 'mxbai-embed-large',
    prompt: prompt
  })
  console.log('Ollama time', new Date().valueOf() - e)

  const f = new Date().valueOf()
  const em = await getEmbedding(prompt)
  console.log('client-vector-search time', new Date().valueOf() - f)

  console.log(em)

})();