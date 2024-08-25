import { Ollama } from 'ollama/browser'
import { ConvoAttachment, GenericSetting, OllamaSetting } from "./idb/types";
import { getGPTProvider } from './idb/gpt/getGPTProvider';
import { GoogleGenerativeAI } from "@google/generative-ai";


export async function imageToText(file: ConvoAttachment){
  
  return await imageToTextOllama(file).then(async g => {
    if(!g) throw new Error('ollama returns empty')
    return g
  }).catch(e => {
    console.error(e)
    return imageToTextGemini(file)
  }).then(o => {
    if(!o) throw new Error('gemini returns empty')
    return o
  }).catch(e => {
    console.error(e)
    return null
  })
}

export async function imageToTextGemini( file: ConvoAttachment ){

  const gpt = await getGPTProvider('gemini')
  if(!gpt) return null
  const apiKey = (gpt.setting as GenericSetting).apiKey
  if(!apiKey) return null
  const gemini = new GoogleGenerativeAI( apiKey )

  const systemInstruction = `
You create excellent image description.

Your job is to create image description for the attached image.

Reply with JSON, using the following JSON schema:
{"description":"string"}
`

  const model = gemini.getGenerativeModel({ 
    model: 'gemini-1.5-flash',
    systemInstruction,
    generationConfig: { responseMimeType: "application/json" }  
  })

  const result = await model.generateContent([
    'Tell me about this image',
    {
      inlineData: {
        mimeType: file.mime,
        data: file.data,
      },
    }
  ]);
  
  const text = result.response.text()
  let description = ''
  try{
    const t = text && text.length && JSON.parse(text)
    if(t) description = t.description
  }catch(e){}

  return description

}

export async function imageToTextOllama( file: ConvoAttachment ){

  const system = `
You create excellent image description.

Your job is to create image description for the attached image.

Reply with JSON, using the following JSON schema:
{"description":"string"}
`
  const gpt = await getGPTProvider('ollama')
  if(!gpt) return null
  const host = (gpt.setting as OllamaSetting).url
  if(!host) return null
  const ollama = new Ollama({ host })

  const resp = await ollama.generate({
    model: 'llava-llama3:latest',
    prompt: 'Tell me about this image',
    images: [file.data],
    format: "json",
    stream: false,
    system,
  })

  let description = ''
  try{
    console.log('ollama image response', resp.response)
    const r = JSON.parse(resp.response)
    description = r.description
  }catch(e){}

  return description

}