import Groq from "groq-sdk"
import { Ollama } from "ollama"
import { ConvoDetail, GPTProvider } from "../idb/types"


export type GPTModel = {
  id: string,
  name: string
}

export type ChatFn<T = void> = (
  client: T, 
  convoDetail: ConvoDetail,
  onResponse: (str: string, end?: boolean) => void  
) => Promise<void>

export type GetClientFromProvider<T = void> = (
  provider: GPTProvider
) => T