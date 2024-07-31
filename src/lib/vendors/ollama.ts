import { Ollama } from 'ollama/browser'
import type { GPTModel, ChatFn, GetClientFromProvider } from './types'
import { ConvoDetail, GPTProvider, OllamaSetting } from '../idb/types'

export function getClient( host: string ){
  const ollama = new Ollama({ host })
  return ollama
}

export const getClientFromProvider: GetClientFromProvider<Ollama> = function ( provider: GPTProvider ){
  const setting = provider.setting as OllamaSetting
  const ollama = new Ollama({ host: setting.url })
  return ollama
}

export async function models( client: Ollama ): Promise<GPTModel[]>{
  return await client.list().then(d => {

    return d.models.map(v => ({
      id: v.name,
      name: v.name + ' (' + v.details.parameter_size + ')'
    }))

  })
}

export const chat: ChatFn<Ollama> = async function( 
  client: Ollama, 
  convoDetail: ConvoDetail,
  onResponse: (str: string, end?: boolean) => void 
){

  const resp = await client.chat({
    model: convoDetail.model,
    messages: convoDetail.data.map(v => {
      return {
        role: v.role,
        content: v.content
      }
    }),
    stream: true
  })

  for await (const chunk of resp) onResponse(chunk.message.content)
  onResponse('', true)

}

export async function generate( client: Ollama, convoDetail: ConvoDetail ){

  const system = convoDetail.data[0].role === 'system' ? 
    convoDetail.data[0].content : ''

  const resp = await client.generate({
    model: convoDetail.model,
    prompt: convoDetail.data[convoDetail.data.length - 1].content,
    format: "json",
    stream: false,
    ...system? {system} : {},
  })

  return resp

}