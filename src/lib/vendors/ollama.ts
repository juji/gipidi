import { Ollama } from 'ollama/browser'
import type { GPTModel } from './types'

export function getClient( host: string ){
  const ollama = new Ollama({ host })
  return ollama
}

export async function list( client: Ollama ): Promise<GPTModel[]>{
  return await client.list().then(d => {

    return d.models.map(v => ({
      id: v.name,
      name: v.name + ' ' + v.details.parameter_size
    }))

  })
}