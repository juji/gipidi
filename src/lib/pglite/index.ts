import { PGliteWorker } from '@electric-sql/pglite/worker'

async function getDb(){

  const client = new PGliteWorker(
    new Worker(new URL('/pglite/worker.js', import.meta.url), {
      type: 'module',
    }),
  )

  await client.waitReady
  return client

}
