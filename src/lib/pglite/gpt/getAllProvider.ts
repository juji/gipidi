import { PGliteWorker } from '@electric-sql/pglite/worker'
import { PGlite } from '@electric-sql/pglite'
import { getDb } from '../index'
import type { GPTProvider } from '../types';

export async function getAllProvider( connection?: PGlite | PGliteWorker ){

  const conn = connection ? connection : await getDb()
  const results = await conn.query<GPTProvider>(
    'select * from provider order by created desc'
  )

  if(!connection) conn.close()
  return results.rows

}