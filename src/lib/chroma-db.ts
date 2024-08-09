
import zlFetch from '@juji/zl-fetch'
import { saveChromaDbURL, getChromaDbURL } from './local-storage'
import { pdfToText } from './pdf-to-text';
import { htmlToText } from './html-to-text';
import { ConvoAttachment, OllamaSetting } from './idb/types';
import { getGPTProvider } from './idb/gpt/getGPTProvider';
import { Ollama } from 'ollama/browser'
import mime from 'mime'
import { nanoid } from "nanoid";

const PREFIX = '/api/v1'
const TENANT = 'gipidi.v1'
const DBNAME = 'iamplaying'

// test and create db
export async function test(url: string, tenant?:string, dbname?:string){

  // check existence of ollama
  const ollamaSettings = await getGPTProvider('ollama')
  if(!ollamaSettings || !(ollamaSettings.setting as OllamaSetting).url) 
    throw new Error('test: ollama is not set')

  const ollama = new Ollama({ host: (ollamaSettings.setting as OllamaSetting).url })
  await ollama.list()

  // check if chromadb is around
  const res = await zlFetch(url + `${PREFIX}`)

  // create tenant
  try{
    await zlFetch(url + `${PREFIX}/tenants/${tenant||TENANT}`)
  }catch(e){
    await zlFetch.post(url + `${PREFIX}/tenants`, {
      body: { name: TENANT },
    })
  }

  // create db
  try{
    await zlFetch(url + `${PREFIX}/databases/${dbname||DBNAME}`,{
      query: {
        tenant: tenant||TENANT
      }
    })
  }catch(e){
    await zlFetch.post(url + `${PREFIX}/databases`, {
      body: { name: DBNAME },
      query: {
        tenant: tenant||TENANT
      }
    })
  }
  
  saveChromaDbURL( url )
  return res

}

export async function prepareOllama(){

  const ollamaSettings = await getGPTProvider('ollama')
  if(!ollamaSettings || !(ollamaSettings.setting as OllamaSetting).url) 
    throw new Error('ollama is not set')

  const ollama = new Ollama({ host: (ollamaSettings.setting as OllamaSetting).url })
  const ls = await ollama.list()
  const exists = ls.models.find(v => v.name === 'mxbai-embed-large:latest')

  if(!exists){
    return ollama.pull({
      model: 'mxbai-embed-large',
      stream: true
    })
  }else{
    return null
  }
}

export async function enabled(tenant?:string, dbname?:string){
  const url = getChromaDbURL()
  await zlFetch(url + `${PREFIX}/databases/${dbname||DBNAME}`,{
    query: {
      tenant: tenant||TENANT
    }
  })
  return true
}

async function getCollection( name: string, tenant?:string, dbname?:string ){
  const url = getChromaDbURL()
  const collection = await zlFetch.post(url + `${PREFIX}/collections`, {
    body: {
      name: name,
      get_or_create: true
    },
    query: {
      tenant: tenant||TENANT,
      database: dbname||DBNAME
    }
  })

  return collection.body
}

async function addCollectionItem( 
  collectionId: string, 
  item: (ConvoAttachment & { embedding: number[] }),
){

  const url = getChromaDbURL()
  const res = await zlFetch.post(url + `${PREFIX}/collections/${collectionId}`,{
    body: {
      embeddings: [item.embedding],
      metadatas: [{ mime: item.mime, name: item.name }],
      documents: [item.data],
      ids: [nanoid()]
    }
  })

  return res.body

}

// create embeddings
export async function process( 
  files: ConvoAttachment[], 
  convoId: string,
  tenant?:string, 
  dbname?:string
){

  const ollamaSettings = await getGPTProvider('ollama')
  if(!ollamaSettings || !(ollamaSettings.setting as OllamaSetting).url) 
    throw new Error('Ollama is not set')

  // select files by type
  const text = files.filter(v => mime.getExtension(v.mime) === 'txt')
  const json = files.filter(v => mime.getExtension(v.mime) === 'json')
  const pdf = await Promise.all(
    files.filter(v => mime.getExtension(v.mime) === 'pdf')
      .map(async v => {
        return { ...v, data: await pdfToText(v.data) }
      })
  )
  const html = await Promise.all(
    files.filter(v => mime.getExtension(v.mime) === 'html')
      .map(async v => {
        return { ...v, data: await htmlToText(v) }
      })
  )

  const ollama = new Ollama({ host: (ollamaSettings.setting as OllamaSetting).url })
  const collection = await getCollection(convoId, tenant, dbname)

  const data = await Promise.all(
    [ ...pdf, ...text, ...html, ...json, ].map(async v => {

      const resp = await ollama.embeddings({
        model: 'mxbai-embed-large',
        prompt: v.data
      })
  
      const insert = await addCollectionItem(
        collection.id,
        {
          ...v,
          embedding: resp.embedding
        },
      )

      return insert

    })
  )

  return data

}