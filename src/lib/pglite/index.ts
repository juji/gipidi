import { PGlite } from '@electric-sql/pglite'
import { migrations, init, runMigration } from './migrations'
import { live } from '@electric-sql/pglite/live';
import { vector } from '@electric-sql/pglite/vector';

export async function getDb(): Promise<PGlite>{

  try{
    // const client = new PGliteWorker(
    //   new Worker(new URL('./pglite/worker.js', window.location.origin), {
    //     type: 'module'
    //   }),
    // )
    // console.log('is leader', client.isLeader)
    const client = new PGlite('idb://gipidi',{
      extensions: {
        live,
        vector
      }
    })
  
    await client.waitReady
    return client
  }catch(e){
    return new Promise(r => setTimeout(() => r(getDb()),500))
  }

}

export async function migrate(){

  const db = await getDb()

  try{
    await db.exec(init)
    for(let i=0; i<migrations.length; i++){
      await runMigration(migrations[i].sql, migrations[i].name, db)
    }
    db.close()
  }catch(e){
    console.error('DB Migration Failed:', e)
    db.close()
    throw e
  }


}
