import { GPTProvider } from "../idb/types";
import { ChatFn, ChatFnParams, CreateTitleFn, CreateTitleParams, GPTModel } from "./types";

export async function modelsByProvider( provider : GPTProvider ) {

  const { modelsByProvider }: { 
    modelsByProvider: (provider : GPTProvider) => Promise<GPTModel[]> 
  } = await import(`./${provider.id}`)
  return await modelsByProvider(provider)

}

export async function chat( params : ChatFnParams ) {

  const { provider } = params
  const { chat }: { chat: ChatFn } = await import(`./${provider.id}/chat`)
  return chat(params)

}

export async function createTitle( params : CreateTitleParams & {
  provider: GPTProvider,
}) {

  const { provider } = params
  const { createTitle }: { createTitle: CreateTitleFn } = await import(`./${provider.id}/createTitle`)
  return createTitle(params)

}