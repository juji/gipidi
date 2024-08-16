import { PGliteWorker } from '@electric-sql/pglite/worker'
import { PGlite } from '@electric-sql/pglite'
import { getDb } from '../index'
// import { Connection } from '@juji/jsstore';
// import { createConnection, TABLES, DEFAULT_DELETED } from '../connection'
import { GPTProvider } from '../types';

export async function upsertGPTProvider(
  id: GPTProvider['id'],
  setting: GPTProvider['setting'],
  icon: string,
  connection?: PGliteWorker | PGlite
){

  const conn = connection || await getDb()
  
  const res = await conn.query<GPTProvider>(
    `insert into provider (id, icon, setting) values ($1, $2, $3)
      on conflict (id) do update set icon = EXCLUDED.icon, setting = EXCLUDED.setting
      returning *
    `,
    [id, icon, setting]
  )

  if(!connection) await conn.close()
  return res.rows[0]

}