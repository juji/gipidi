import Groq from "groq-sdk"
import { GPTModel } from "./types"

export function getClient( apiKey: string ){
  const groq = new Groq({ apiKey, dangerouslyAllowBrowser: true })
  return groq
}

export async function list( client: Groq ): Promise<GPTModel[]>{
  return await client.models.list().then(models => {

    return models.data.map(v => ({
      id: v.id,
      name: v.id + ' (' + v.owned_by + ')'
    }))

  })
}