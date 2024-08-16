import { PGliteWorker } from '@electric-sql/pglite/worker'
import { PGlite } from '@electric-sql/pglite'
import { getDb } from '../index'
import type { GPTProvider } from '../types';

export async function removeGPTProvider(
  id: GPTProvider['id'],
  connection?: PGliteWorker | PGlite
){

  const conn = connection || await getDb()

  await conn.query('delete from provider where id=$1',[id])

  if(!connection) conn.close()

}