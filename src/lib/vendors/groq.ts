import Groq from "groq-sdk"
import type { GPTModel, ChatFn, GetClientFromProvider } from "./types"
import { ConvoDetail, GenericSetting, GPTProvider } from "../idb/types"

export function getClient( apiKey: string ){
  const groq = new Groq({ apiKey, dangerouslyAllowBrowser: true })
  return groq
}

export const getClientFromProvider: GetClientFromProvider<Groq> = function ( provider: GPTProvider ){
  const setting = provider.setting as GenericSetting
  const groq = new Groq({ 
    apiKey: setting.apiKey, 
    dangerouslyAllowBrowser: true 
  })
  return groq
}

export async function models( client: Groq ): Promise<GPTModel[]>{
  return await client.models.list().then(models => {

    return models.data.map(v => ({
      id: v.id,
      name: v.id + ' (' + v.owned_by + ')'
    }))

  })
}

export const chat: ChatFn<Groq> = async function( 
  client: Groq, 
  convoDetail: ConvoDetail,
  onResponse: (str: string, end?: boolean) => void  
){

  const resp = await client.chat.completions.create({
    model: convoDetail.model,
    messages: convoDetail.data.map(v => {
      return {
        role: v.role,
        content: v.content
      }
    }),
    stream: true
  })

  for await (const chunk of resp) onResponse(chunk.choices[0].delta.content || '')
  onResponse('', true)

}

export async function generate( client: Groq, convoDetail: ConvoDetail ){

  const data = await client.chat.completions.create({
    model: convoDetail.model,
    messages: convoDetail.data.map(v => ({
      role: v.role,
      content: v.content
    })),
    response_format: { type: "json_object" },
    stream: false,
  })

  return data

}