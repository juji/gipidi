import { Ollama } from 'ollama/browser'
import type { GPTModel, ChatFn, GetClientFromProvider } from './types'
import { ConvoAttachment, ConvoDetail, GPTProvider, OllamaSetting } from '../idb/types'
import { defaultSysPrompt } from "./system";
import { 
  enabled as chromaDbEnabled,
  process as chromaDbProcessFiles 
} from "../chroma-db";

export const icon = '/gpt/ollama.png'
export const attachmentEnabled = async () => await chromaDbEnabled()

export const onAttach = async ( files: ConvoAttachment[] ) => {
  // await chromaDbProcessFiles(files)
}

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
  onResponse: (str: string, end?: boolean) => void,
  onError: (e: any)   => void
){

  let convo = [...convoDetail.data]
  if(convo[0].role === 'system'){
    convo[0].content += defaultSysPrompt
  }else{
    convo.unshift({
      id: 'asdf',
      lastUpdate: new Date(),
      role: 'system', 
      content: defaultSysPrompt
    })
  }
  
  try{
    const resp = await client.chat({
      model: convoDetail.model,
      messages: convo.map((v, i) => {
        return {
          role: v.role,
          content: v.content,
          ...v.attachments && v.attachments.length ? {
            images: v.attachments.filter(v => v.mime.match('image/')).map(atta => `${atta.data}`)
          } : {}
        }
      }),
      stream: true
    })
  
    for await (const chunk of resp) onResponse(chunk.message.content)
    onResponse('', true)
  }catch(e){
    onError(e)
  }

}

export async function createTitle( client: Ollama, convoDetail: ConvoDetail ){

  const system = `
You are an excellent summarizer.
The following data is a JSON formatted conversation between a user and an assistant.
You are expected to create a short title to describe the conversation.

Prevent from using the word "user" and "assistant" in the resulting title.

Reply with JSON, using the following JSON schema:
{"title":"string"}
`

  const convo = 'Please create title for the following data: ' + JSON.stringify(
    convoDetail.data.filter(v => v.role !== 'system').map(v => ({
      role: v.role,
      content: v.content
    }))
  )

  const resp = await client.generate({
    model: convoDetail.model,
    prompt: convo,
    format: "json",
    stream: false,
    system,
  })

  let title = ''
  try{
    const r = JSON.parse(resp.response)
    title = r.title
  }catch(e){}

  return title

}

export async function test( host: string  ){

  return models(getClient(host))

}