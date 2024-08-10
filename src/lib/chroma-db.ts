
import zlFetch from '@juji/zl-fetch'
import { saveChromaDbURL, getChromaDbURL } from './local-storage'
import { pdfToText } from './pdf-to-text';
import { htmlToText } from './html-to-text';
import { ConvoAttachment, OllamaSetting } from './idb/types';
import { getGPTProvider } from './idb/gpt/getGPTProvider';
import { Ollama } from 'ollama/browser'
import mime from 'mime'
import { nanoid } from "nanoid";
import { showError } from './toast';

const PREFIX = '/api/v1'
const TENANT = 'gipidi.v1'
const DBNAME = 'iamplaying'

async function getOllama(){
  const ollamaSettings = await getGPTProvider('ollama')
  if(!ollamaSettings || !(ollamaSettings.setting as OllamaSetting).url) 
    throw new Error('test: ollama is not set')
  const ollama = new Ollama({ host: (ollamaSettings.setting as OllamaSetting).url })
  return ollama
}

async function getEmbeddingModel(){
  const ollama = await getOllama()
  const ls = await ollama.list()
  const model = ls.models.find(v => v.name === 'mxbai-embed-large:latest')
  if(!model) throw new Error('Embedding model do not exist')
  return model
}

// test and create db
export async function test(url: string, tenant?:string, dbname?:string){

  // check existence of ollama
  const ollama = await getOllama()
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

  let exists:any = false;
  try{
    exists = await getEmbeddingModel()
  }catch(e){
    const err = (e as Error).toString()
    if(err !== 'Error: Embedding model do not exist'){
      showError(err)
      throw e
    }
  }

  if(!exists){
    const ollama = await getOllama()
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

export async function getCollection( name: string, tenant?:string, dbname?:string ){
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

export async function updateCollectionName( collectionId: string, name: string ){
  const url = getChromaDbURL()
  const collection = await zlFetch.put(url + `${PREFIX}/collections/${collectionId}`, {
    body: {
      new_name: name,
    },
  })

  return collection.body
}

// remove embeddings
export async function remove(
  collectionId: string,
  insertId:string
){

  const url = getChromaDbURL()
  await zlFetch.post(url + `${PREFIX}/collections/${collectionId}/delete`,{
    body: {
      "ids": [insertId]
    }
  })

}

// create / add embeddings
async function addCollectionItem( 
  collectionId: string, 
  item: (ConvoAttachment & { embedding: number[] }),
){

  const url = getChromaDbURL()
  const id = nanoid()
  await zlFetch.post(url + `${PREFIX}/collections/${collectionId}/add`,{
    body: {
      embeddings: [item.embedding],
      metadatas: [{ mime: item.mime, name: item.name }],
      documents: [item.data],
      ids: [id]
    }
  })

  return id

}

export async function insert( 
  files: ConvoAttachment[], 
  collectionId: string,
){

  const ollama = await getOllama()

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

  const data = await Promise.all(
    [ ...pdf, ...text, ...html, ...json, ].map(async v => {

      const resp = await ollama.embeddings({
        model: 'mxbai-embed-large',
        prompt: v.data
      })
  
      const insertId = await addCollectionItem(
        collectionId,
        {
          ...v,
          embedding: resp.embedding
        },
      )

      return {
        id: insertId,
        name: v.name,
        mime: v.mime
      }

    })
  )

  return data

}

export async function prompt(str: string){
  
}