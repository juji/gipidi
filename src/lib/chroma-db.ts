
import zlFetch from '@juji/zl-fetch'

// test and create db
export async function test(url: string){

  const res = await zlFetch(url + `/api/v1`)
  const db = await zlFetch(url + `/api/v1/databases/gipidi.v1`)
  
  if(db.error) {
    await zlFetch.post(url + `/api/v1/databases`, {
      body: { name: 'gipidi.v1' },
    })
  }
  

  return res

}