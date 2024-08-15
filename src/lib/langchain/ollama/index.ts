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

export async function test( url: string ){
  return await models( url )
}

export async function downloadLlava( models: GPTModel[], url: string ){
  console.log(models)
  const llava = models.find(v => v.name === 'llava-llama3:latest')
  if(llava) return null;
  const ollama = getClient(url)
  return await ollama.pull({
    model: 'llava-llama3:latest',
    stream: true
  })

}

