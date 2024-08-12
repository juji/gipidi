import { GoogleGenerativeAI } from "@google/generative-ai";
import type { GPTModel, ChatFn, GetClientFromProvider } from "./types"
import { ConvoDetail, GenericSetting, GPTProvider } from "../idb/types"

import { defaultSysPrompt, encloseUserRequirement } from "./system";


export const icon = '/gpt/gemini.svg'
export const processAttchments = false

export function getClient( apiKey: string ){
  const gemini = new GoogleGenerativeAI( apiKey )
  return gemini
}

export const getClientFromProvider: GetClientFromProvider<GoogleGenerativeAI> = function ( provider: GPTProvider ){
  const setting = provider.setting as GenericSetting
  const gemini = new GoogleGenerativeAI(setting.apiKey)
  return gemini
}

export function getDefaultModel(){
  return {
    id: 'gemini-1.0-pro',
    name: 'Gemini 1.0 Pro'
  }
}

export async function models( client: GoogleGenerativeAI ): Promise<GPTModel[]>{

  return [
    {
      id: 'gemini-1.5-flash',
      name: 'Gemini 1.5 Flash'
    },
    {
      id: 'gemini-1.5-pro',
      name: 'Gemini 1.5 Pro'
    },
    {
      id: 'gemini-1.0-pro',
      name: 'Gemini 1.0 Pro'
    },
  ]
}

export const chat: ChatFn<GoogleGenerativeAI> = async function( 
  client: GoogleGenerativeAI, 
  convoDetail: ConvoDetail,
  onResponse: (str: string, end?: boolean) => void,
  onError: (e: any)   => void,
  onStopSignal?: (fn: () => void) => void
){

  try{

    let stopped = false
    onStopSignal && onStopSignal(() => {
      stopped = true
    })

    const isGemini1 = getDefaultModel().id === convoDetail.model
    const systemInstruction = defaultSysPrompt + (
      convoDetail.data[0].role === 'system' && !isGemini1 ? 
      encloseUserRequirement(convoDetail.data[0].content) : null
    )

    const model = client.getGenerativeModel({ 
      model: convoDetail.model,
      systemInstruction
    })

    const history = convoDetail.data.filter(v => v.role !== 'system')
      .map(v => ({
        role: v.role === 'user' ? 'user' : 'model',
        parts: [
          { text: v.content },
          ...v.attachments && v.attachments.length ? v.attachments.map(atta => ({
            inlineData: {
              mimeType: atta.mime,
              data: atta.data,
            },
          })) : []
        ],
      }))
    
    const last = convoDetail.data.at(-1)
    if(!last) throw new Error('User message is empty')

    const chat = model.startChat({ history });
    const result = await chat.sendMessageStream(last.attachments?.length ? [
      last.content,
      ...last.attachments.map(atta => ({
        inlineData: {
          mimeType: atta.mime,
          data: atta.data,
        },
      }))
    ] : last.content)

    let next = result.stream.next()
    while((await next).value){
      if(stopped) result.stream.throw('stopped')
      onResponse((await next).value.text() || '')
      next = result.stream.next()
    }
    onResponse('', true)

  }catch(e){
    onError(e)
  }

}

export async function createTitle( client: GoogleGenerativeAI, convoDetail: ConvoDetail ){

  const systemInstruction = `You are an excellent summarizer.
The following data is a JSON formatted conversation between a user and an assistant.
You are expected to create a short title to describe the conversation.

Prevent from using the word "user" and "assistant" in the resulting title.

Reply with JSON, using the following JSON schema:
{"title":"string"}
`
  const isGemini1 = getDefaultModel().id === convoDetail.model
  const isGeminiPro = convoDetail.model.match('pro')
  const prompt = (isGemini1 ? systemInstruction + '\n\n' : '') + 'Please create title for the following data: ' + JSON.stringify(
    convoDetail.data.filter(v => v.role !== 'system').map(v => ({
      role: v.role,
      content: v.content
    }))
  )

  const modelUsed = isGeminiPro ? getDefaultModel().id : convoDetail.model

  const model = client.getGenerativeModel({ 
    model: modelUsed,
    ...isGemini1 ? {} : { 
      systemInstruction,
      generationConfig: { responseMimeType: "application/json" }  
    }
  })
  const result = await model.generateContent(prompt);
  const response = result.response;
  let text = ''
  if(isGemini1){
    const t = response.text().match(/{"title":"[^"]+"}/)
    text = t ? t[0] : '{}'
  } else {
    text = response.text()
  }

  let title = ''
  try{
    const t = text && text.length && JSON.parse(text)
    if(t) title = t.title
  }catch(e){}

  return title

}

export async function test( apiKey: string ){

  const client = getClient(apiKey)
  const model = client.getGenerativeModel({ 
    model: getDefaultModel().id,
  })
  const result = await model.generateContent('say y');
  return !!result.response.text()

}