import { getGPTProvider } from "../idb/gpt/getGPTProvider";
import { Embeddings, GenericSetting, OllamaSetting } from "../idb/types";
import { Ollama } from "ollama/browser";
import { GoogleGenerativeAI } from "@google/generative-ai";

const providers: {
  ollama: Ollama | null,
  gemini: GoogleGenerativeAI | null
} = {
  ollama: null,
  gemini: null
}

async function ollamaEmbedding( text: string, model: string ){
  
  if(!providers.ollama){
    const olm = await getGPTProvider('ollama')
    providers.ollama = new Ollama({ host: (olm.setting as OllamaSetting).url })
  }

  const result = await providers.ollama.embeddings({
    model: model,
    prompt: text,
  })

  return result.embedding

}

async function geminiEmbedding( text: string, model: string ){
  
  if(!providers.gemini){
    const gmn = await getGPTProvider('gemini')
    providers.gemini = new GoogleGenerativeAI( (gmn.setting as GenericSetting).apiKey )
  }

  const mod = providers.gemini.getGenerativeModel({ model: model });
  const result = await mod.embedContent(text);

  return result.embedding.values
  
}


export async function createVector(
  text: string,
  vendor: Embeddings['vendor'],
  model: string
){

  if(vendor !== 'ollama' && vendor !== 'gemini')
    throw new Error(`vendor ${vendor} can\'t be used for embedding`)

  return vendor === 'gemini' ? 
    await geminiEmbedding(text, model) :
    await ollamaEmbedding(text, model)

}