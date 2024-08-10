
import { data } from './data'
import { Ollama } from 'ollama/browser'
import { nanoid } from 'nanoid'
import zlFetch from '@juji/zl-fetch'

const ollama = new Ollama({ host: 'http://localhost:11434' })
const chromaUrl = 'http://localhost:8000'


;(async () => {

  const t = new Date(). valueOf()
  // for (let idx in data){
  
  //   // console.log('idx', data[idx])
  //   const resp = await ollama.embeddings({
  //     model: 'mxbai-embed-large',
  //     prompt: data[idx]
  //   })
  
  //   const id = nanoid()
  //   await zlFetch.post(chromaUrl + `/api/v1/collections/f7215834-a4ef-4aef-a4cc-97ce043f1589/add`,{
  //     body: {
  //       embeddings: [resp.embedding],
  //       metadatas: [{ index: idx }],
  //       documents: [data[idx]],
  //       ids: [nanoid()]
  //     }
  //   })
  
  // }

  // console.log('elapsed:', new Date().valueOf() - t, 'ms')
  const prompt = "Give me something about roses?"
  
  const resp = await ollama.embeddings({
    model: 'mxbai-embed-large',
    prompt: prompt
  })

  console.log('The Embedding Result:', resp)

  const result = await zlFetch.post(chromaUrl + `/api/v1/collections/f7215834-a4ef-4aef-a4cc-97ce043f1589/query`,{
    body: {
      query_embeddings: [resp.embedding],
      n_result: 1,
      // include: [
      //   "metadatas",
      //   "documents",
      //   "distances"
      // ]
    }
  })

  console.log(result.body)

  const r = await ollama.generate({
    model: 'llama3.1:latest',
    prompt: `Using this data: ${result.body.documents[0][0]}. Respond to this prompt: ${prompt}`
  })

  console.log(r.response)

})().catch(e => {

  console.error(e)

})

