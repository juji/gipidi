import { PGliteWorker } from '@electric-sql/pglite/worker'
import { PGlite } from '@electric-sql/pglite'
import { type Migration } from './types';

import gptProviders from './files/000-gpt-provider'
import settings from './files/100-settings'

// simple migration, only support string
export const init = `
CREATE TABLE IF NOT EXISTS migrations (
  id VARCHAR PRIMARY KEY,
  name VARCHAR not null,
  date TIMESTAMPTZ DEFAULT current_timestamp,
  up BOOLEAN
);
`

// will run everytime when we get new HASH
// meaning, you can edit the string, and it will run migration
async function hashValue(val:string){
  return await crypto.subtle
    .digest('SHA-256', new TextEncoder().encode(val))
    .then(h => {
      let hexes = [],
        view = new DataView(h);
      for (let i = 0; i < view.byteLength; i += 4)
        hexes.push(('00000000' + view.getUint32(i).toString(16)).slice(-8));
      return hexes.join('');
    });
}

export async function runMigration(str: string, name: string, db: PGliteWorker| PGlite){

  const hash = await hashValue(str)
  const exist = await db.query<{ up?: boolean }>(
    `select up from migrations where id=$1`,
    [hash]
  )

  if(exist.rows.length && exist.rows[0].up){
    // console.debug('exist', hash)
    return true;
  }

  try{
    console.debug('Running Migration:', name)
    await db.exec(str)
    await db.query(
      `insert into migrations (id, name, up) values ($1, $2, $3)`,
      [hash, name, true]
    )
  }catch(e){
    console.error('Migration Error:', name)
    console.error(e)
    await db.query(
      `insert into migrations (id, name, up) values ($1, $2, $3)`,
      [hash, name, false]
    )
  }

  return true


}

export const migrations: Migration[] = [
  gptProviders,
  settings
]