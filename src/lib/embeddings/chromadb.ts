import zlFetch from '@juji/zl-fetch'
const PREFIX = '/api/v1'

export async function test( url: string ){

  const res = await zlFetch(url + `${PREFIX}`)
  return res.body

}

export async function getCreateTenant({
  url, tenant
}:{
  url: string, 
  tenant: string
}){

  // get 
  try{
    const res = await zlFetch(url + `${PREFIX}/tenants/${tenant}`,{
      headers: { 'X-Chroma-Token': 'mycredential' }
    })
    return res.body.name
  }catch(e){}

  // post: create new tenant
  await zlFetch.post(url + `${PREFIX}/tenants`,{
    body: {
      name: tenant
    },
    headers: { 'X-Chroma-Token': 'mycredential' }
  })

  return tenant

}


export async function getCreateDb(
{
  url, 
  tenant, 
  database
}:{
  url: string, 
  tenant: string, 
  database: string
}){

  // get 
  try{
    const res = await zlFetch(url + `${PREFIX}/databases/${database}`, {
      query: { tenant },
      headers: { 'X-Chroma-Token': 'mycredential' }
    })
    return res.body.name
  }catch(e){}

  // post: create new db
  await zlFetch.post(url + `${PREFIX}/databases`,{
    body: { name: database },
    query: { tenant },
    headers: { 'X-Chroma-Token': 'mycredential' }
  })

  return database

}

export async function getCollection({
  url, 
  tenant, 
  database,
  collection
}:{
  url: string, 
  tenant: string, 
  database: string,
  collection: string
}){

  const res = await zlFetch(url + `${PREFIX}/collections/${collection}`, {
    query: { tenant, database },
    headers: { 'X-Chroma-Token': 'mycredential' }
  })

  return res.body

}

export async function createCollection({
  url, 
  tenant, 
  database,
  collection,
  distance
}:{
  url: string, 
  tenant: string, 
  database: string,
  collection: string,
  distance: string
}){

  const res = await zlFetch.post(url + `${PREFIX}/collections`, {
    query: { tenant, database },
    body: {
      name: collection,
      metadata: { "hnsw:space": distance },
      get_or_create: false
    },
    headers: { 'X-Chroma-Token': 'mycredential' }
  })

}
