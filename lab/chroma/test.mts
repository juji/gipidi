import zlFetch from '@juji/zl-fetch'

const PREFIX = '/api/v1'
const TENANT = 'gipidi.v1'
const DBNAME = 'iamplaying'

const url = 'http://localhost:8000'

// get status
const res = await zlFetch(url + `${PREFIX}`)
console.log('get status', res.body)

// tenant
try{
  const tenant = await zlFetch(url + `${PREFIX}/tenants/${TENANT}`)
  console.log('tenant', tenant.body)
}catch(e){
  console.log('creating tenant')
  const create = await zlFetch.post(url + `${PREFIX}/tenants`, {
    body: { name: TENANT },
  })
  console.log('created tenant', create.body)
}

// db
try{
  const db = await zlFetch(url + `${PREFIX}/databases/${DBNAME}`,{
    query: {
      tenant: TENANT
    }
  })
  console.log('db', db.body)
}catch(e){
  console.log('creating db')
  const db = await zlFetch.post(url + `${PREFIX}/databases`, {
    body: { name: DBNAME },
    query: {
      tenant: TENANT
    }
  })
  console.log('db', db.body)
}

// collections
try{
  const collectionByName = await zlFetch(url + `${PREFIX}/collections/asdf`, {
    query: {
      tenant: TENANT,
      database: DBNAME
    }
  })
  console.log('collectionByName', collectionByName.body)

  const collection = await zlFetch.post(url + `${PREFIX}/collections`, {
    body: {
      name: 'asdf',
      get_or_create: true
    },
    query: {
      tenant: TENANT,
      database: DBNAME
    }
  })

  console.log('collection', collection.body)

  
}catch(e){
  console.error('failed getting collection')
}