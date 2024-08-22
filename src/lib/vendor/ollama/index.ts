import { GPTProvider, OllamaSetting } from "@/lib/idb/types";
import { GPTModel } from "../types";
import { Ollama } from "ollama/browser";

export function getClient( url: string ){
  const ollama = new Ollama({ host: url })
  return ollama
}

export async function models( url: string ): Promise<GPTModel[]>{
  const client = getClient(url)
  const list = await client.list()
  return list.models.map(v => ({
    id: v.name,
    name: v.name + ' (' + v.details.parameter_size + ')'
  }))
}

export async function modelsByProvider( provider: GPTProvider ): Promise<GPTModel[]>{
  return await models((provider.setting as OllamaSetting).url)
}

export async function test( url: string ){
  return await models( url )
}

export async function downloadLlava( models: GPTModel[], url: string ){
  const llava = models.find(v => v.id === 'llava-llama3:latest')
  if(llava) return null;
  const ollama = getClient(url)
  return await ollama.pull({
    model: 'llava-llama3:latest',
    stream: true
  })
}

export async function downloadModel( model: string, url: string ){
  const currentModels = await models(url)
  const cm = currentModels.find(v => v.id === `${model}:latest`)
  if(cm) return null;
  
  const ollama = getClient(url)
  return await ollama.pull({
    model: `${model}:latest`,
    stream: true
  })

}

