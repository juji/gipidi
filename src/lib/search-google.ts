import { fetch as tfetch } from "@tauri-apps/plugin-http";

export async function search(
  q: string,
  id: string,
  apiKey: string,
  countryCode: string
){
  
  const query = new URLSearchParams({
    q,
    cx: id,
    gl: countryCode,
    key: apiKey
  })

  const res = await tfetch(
    `https://customsearch.googleapis.com/customsearch/v1/list?` +
    query.toString()
  ).then(r => r.json())

  return res.items

}