import { fetch as tfetch } from "@tauri-apps/plugin-http";

export async function searchGoogle(
  q: string,
  id: string,
  apiKey: string,
  countryCode?: string
){
  
  const query = new URLSearchParams({
    q,
    cx: id,
    key: apiKey,
    ...countryCode ? { gl: countryCode } : {},
  })

  const res = await tfetch(
    `https://www.googleapis.com/customsearch/v1?` +
    query.toString()
  ).then(async r => {
    return r.json()
  })
  
  return res.items

}