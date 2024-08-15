import { GPTProvider } from "../idb/types";
import { ChatFn, ChatFnParams, CreateTitleFn, CreateTitleParams } from "./types";

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