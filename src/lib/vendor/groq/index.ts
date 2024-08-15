import { GenericSetting, GPTProvider } from "@/lib/idb/types";
import { GPTModel } from "../types";
import Groq from "groq-sdk"

export function getClient( apiKey: string ){
  const groq = new Groq({ apiKey, dangerouslyAllowBrowser: true })
  return groq
}

export async function models( url: string ): Promise<GPTModel[]>{
  const client = getClient(url)
  const list = await client.models.list()
  return list.data.map(v => ({
    id: v.id,
    name: v.id + ' (' + v.owned_by + ')'
  }))
}

export async function modelsByProvider( provider: GPTProvider ): Promise<GPTModel[]>{
  const client = getClient((provider.setting as GenericSetting).apiKey)
  const list = await client.models.list()
  return list.data.map(v => ({
    id: v.id,
    name: v.id + ' (' + v.owned_by + ')'
  }))
}

export async function test( url: string ){
  return await models( url )
}
