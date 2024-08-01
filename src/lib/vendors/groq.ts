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

export async function createTitle( client: Groq, convoDetail: ConvoDetail ){

  const system = `
You are an excellent summarizer.
The following data is a JSON formatted conversation between a user and an assistant.
You are expected to create a short title to describe the conversation.

Reply with JSON, using the following JSON schema:
{"title":"string"}
`

  const convo = 'Please create title for the following data: ' + JSON.stringify(
    convoDetail.data.filter(v => v.role !== 'system').map(v => ({
      role: v.role,
      content: v.content
    }))
  )

  const data = await client.chat.completions.create({
    model: convoDetail.model,
    messages: [
      {
        role:"system",
        content: system
      },{
        role: "user",
        content: convo
      }
    ],
    response_format: { type: "json_object" },
    stream: false,
  })

  console.log(data)

  let title = ''
  try{
    const t = data.choices[0].message.content && 
      JSON.parse(data.choices[0].message.content)
    if(t) title = t.title
  }catch(e){}

  return title

}