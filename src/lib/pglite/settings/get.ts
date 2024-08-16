import { PGliteWorker } from '@electric-sql/pglite/worker'
import { PGlite } from '@electric-sql/pglite'
import { getDb } from '../index'

export async function getSetting( 
  id: string,
  connection?: PGliteWorker | PGlite
){

  const conn = connection || await getDb()

  const res = await conn.query(
    `select * from setting where id=$1`,
    [id]
  )

  if(!connection) await conn.close()
  return res.rows[0]

}