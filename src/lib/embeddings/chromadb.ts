
import zlFetch from '@juji/zl-fetch'
import { ChromaDBAuthSetting, ChromaDBSetting, Embeddings, EmbeddingsDb } from '../idb/types'

const PREFIX = '/api/v1'

export async function test( url: string ){

  const res = await zlFetch(url + `${PREFIX}`)
  return res.body

}

function getHeaderWithAuth(
  authType?: ChromaDBAuthSetting['type'], 
  authToken?: string
){

  if(!authType || !authToken) return {}

  else if(authType === 'auth-bearer') return {
    headers: {
      'Authentication': `Bearer ${authToken}`
    }
  }

  else if(authType === 'x-chroma-token') return {
    headers: {
      'X-Chroma-Token': authToken
    }
  }

  else return {}

}

export async function getCreateTenant({
  url, tenant,
  authType,
  authToken
}:{
  url: string
  tenant: string
  authType?: ChromaDBAuthSetting['type']
  authToken?: string
}){

  // get 
  try{
    const res = await zlFetch(url + `${PREFIX}/tenants/${tenant}`,{
      ... getHeaderWithAuth(authType, authToken)
    })
    return res.body.name
  }catch(e){}

  // post: create new tenant
  await zlFetch.post(url + `${PREFIX}/tenants`,{
    body: {
      name: tenant
    },
    ... getHeaderWithAuth(authType, authToken)
  })

  return tenant

}


export async function getCreateDb(
{
  url, 
  tenant, 
  database,
  authType,
  authToken
}:{
  url: string 
  tenant: string
  database: string
  authType?: ChromaDBAuthSetting['type']
  authToken?: string
}){

  // get 
  try{
    const res = await zlFetch(url + `${PREFIX}/databases/${database}`, {
      query: { tenant },
      ... getHeaderWithAuth(authType, authToken)
    })
    return res.body.name
  }catch(e){}

  // post: create new db
  await zlFetch.post(url + `${PREFIX}/databases`,{
    body: { name: database },
    query: { tenant },
    ... getHeaderWithAuth(authType, authToken)
  })

  return database

}

export async function getCollection({
  url, 
  tenant, 
  database,
  collection,
  authType,
  authToken
}:{
  url: string 
  tenant: string
  database: string
  collection: string
  authType?: ChromaDBAuthSetting['type']
  authToken?: string
}){

  const res = await zlFetch(url + `${PREFIX}/collections/${collection}`, {
    query: { tenant, database },
    ... getHeaderWithAuth(authType, authToken)
  })

  return res.body

}

export async function createCollection({
  url, 
  tenant, 
  database,
  collection,
  distance,
  authType,
  authToken,
}:{
  url: string 
  tenant: string 
  database: string
  collection: string
  distance: string
  authType?: ChromaDBAuthSetting['type']
  authToken?: string
}){

  const res = await zlFetch.post(url + `${PREFIX}/collections`, {
    query: { tenant, database },
    body: {
      name: collection,
      metadata: { "hnsw:space": distance },
      get_or_create: false
    },
    ... getHeaderWithAuth(authType, authToken)
  })

  return res.body

}


export async function deleteCollection({
  url, 
  tenant, 
  database,
  collection,
  authType,
  authToken,
}:{
  url: string 
  tenant: string 
  database: string
  collection: string
  authType?: ChromaDBAuthSetting['type']
  authToken?: string
}){

  const res = await zlFetch.delete(url + `${PREFIX}/collections/${collection}`, {
    query: { tenant, database },
    ... getHeaderWithAuth(authType, authToken)
  })

  return res.body

}

export async function query({
  embedding,
  database,
  vector,
  nResults = 10,
  distanceLimit = 420 // lol
}:{
  embedding: Embeddings
  database: EmbeddingsDb
  vector: any
  nResults?: number
  distanceLimit?: number
}){

  const url = database.url
  const { tenant, database: db, auth } = database.settings as ChromaDBSetting
  const collectionId = embedding.dbObject.id

  const res = await zlFetch.post(url + `${PREFIX}/collections/${collectionId}/query`, {
    query: { tenant, database: db },
    body: {
      query_embeddings: [vector],
      n_results: nResults
    },
    ... getHeaderWithAuth(auth?.type, auth?.token)
  })

  console.log(res.body)

  const filtered = res.body.distances[0]?.map(
    (v:number, i:number) => v < distanceLimit ? i+1 : null
  ) || []

  return {
    ...res.body,
    distances: res.body.distances[0]?.filter((_:any,i:number) => filtered[i]) || [],
    ids: res.body.ids[0]?.filter((_:any,i:number) => filtered[i]) || [],
    documents: res.body.documents[0]?.filter((_:any,i:number) => filtered[i]) || [],
    metadatas: res.body.metadatas[0]?.filter((_:any,i:number) => filtered[i]) || [],
  }

}

export async function count({
  embedding,
  database,
}:{
  embedding: Embeddings
  database: EmbeddingsDb
}){

  const url = database.url
  const { tenant, database: db, auth } = database.settings as ChromaDBSetting
  const collectionId = embedding.dbObject.id

  const res = await zlFetch.get(url + `${PREFIX}/collections/${collectionId}/count`, {
    query: { tenant, database: db },
    ... getHeaderWithAuth(auth?.type, auth?.token)
  })

  return res.body

}


export async function get({
  embedding,
  database,
  limit = 10,
  offset = 0
}:{
  embedding: Embeddings
  database: EmbeddingsDb
  limit?: number
  offset?: number
}){

  const url = database.url
  const { tenant, database: db, auth } = database.settings as ChromaDBSetting
  const collectionId = embedding.dbObject.id

  const res = await zlFetch.post(url + `${PREFIX}/collections/${collectionId}/get`, {
    query: { tenant, database: db },
    body: {
      limit,
      offset
    },
    ... getHeaderWithAuth(auth?.type, auth?.token)
  })

  return res.body

}

export async function add({
  embedding,
  database,
  ids,
  vectors,
  documents
}:{
  embedding: Embeddings
  database: EmbeddingsDb
  ids: string[]
  vectors: number[][]
  documents: string[]
}){

  const url = database.url
  const { tenant, database: db, auth } = database.settings as ChromaDBSetting
  const collectionId = embedding.dbObject.id

  const res = await zlFetch.post(url + `${PREFIX}/collections/${collectionId}/add`, {
    query: { tenant, database: db },
    body: {
      ids: ids,
      embeddings: vectors,
      documents: documents
    },
    ... getHeaderWithAuth(auth?.type, auth?.token)
  })
  
  return res.body

}


export async function remove({
  embedding,
  database,
  id,
}:{
  embedding: Embeddings
  database: EmbeddingsDb
  id: string
}){

  const url = database.url
  const { tenant, database: db, auth } = database.settings as ChromaDBSetting
  const collectionId = embedding.dbObject.id

  const res = await zlFetch.post(url + `${PREFIX}/collections/${collectionId}/delete`, {
    query: { tenant, database: db },
    body: {
      ids: [id],
    },
    ... getHeaderWithAuth(auth?.type, auth?.token)
  })
  
  return res.body

}
