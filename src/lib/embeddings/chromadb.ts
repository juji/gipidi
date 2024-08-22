import zlFetch from '@juji/zl-fetch'
import { ChromaDBAuthSetting } from '../idb/types'

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
      'X-Chroma-Token': `${authToken}`
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
