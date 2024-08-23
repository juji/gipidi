
import { data } from './data'
import { Ollama } from 'ollama/browser'
import { nanoid } from 'nanoid'
import zlFetch from '@juji/zl-fetch'
import { uuidv7 } from "uuidv7";

const ollama = new Ollama({ host: 'http://localhost:11434' })
const chromaUrl = 'http://localhost:8000'


async function insert(){
  const t = new Date(). valueOf()
  for (let idx in data){
  
    // console.log('idx', data[idx])
    const resp = await ollama.embeddings({
      model: 'mxbai-embed-large',
      prompt: data[idx]
    })
  
    const id = nanoid()
    await zlFetch.post(chromaUrl + `/api/v1/collections/a7e953f3-a303-497e-a45c-dc0bb0709eef/add`,{
      body: {
        embeddings: [resp.embedding],
        documents: [data[idx]],
        ids: [uuidv7()]
      }
    })

    console.log('embedding', resp.embedding.length)
  
  }

  console.log('done inserting')
}

async function prompt(){

  const prompt = "lorem"
  
  const resp = await ollama.embeddings({
    model: 'mxbai-embed-large',
    prompt: prompt
  })

  // // console.log('The Embedding Result:', resp)

  const result = await zlFetch.post(chromaUrl + `/api/v1/collections/a7e953f3-a303-497e-a45c-dc0bb0709eef/query`,{
    body: {
      query_embeddings: [resp.embedding],
      n_results: 2,
      // include: [
      //   "metadatas",
      //   "documents",
      //   "distances"
      // ]
    }
  })

  console.log(result.body)

}

;(async () => {

  await insert()
  // await prompt()

})().catch(e => {

  console.error(e)

})

