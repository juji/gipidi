import { fetch as tfetch } from '@tauri-apps/plugin-http';



export async function getCC(){

  const r = await tfetch('https://ipgeo.jujiyangasli.workers.dev/')
    .then(r => r.json())
    .then(r => r.result)
  
  return r

}