import { PGliteWorker } from '@electric-sql/pglite/worker'
import { PGlite } from '@electric-sql/pglite'
import { getDb } from '../index'

export async function setSetting( 
  id: string,
  data: any,
  connection?: PGliteWorker | PGlite
){

  const conn = connection || await getDb()

  await conn.query(
    `insert into setting (id, data) values ($1, $2)
      on conflict (id) do update set data = EXCLUDED.data
      returning *
    `,
    [id, data]
  )

  if(!connection) await conn.close()

}