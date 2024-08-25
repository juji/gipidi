import { ConvoDetail, GPTProvider } from "../idb/types"

export type GPTModel = {
  id: string,
  name: string
}

export type ChatFnParams = {
  provider: GPTProvider
  convoDetail: ConvoDetail
  onResponse: (str: string, end?: boolean) => void
  onError: (e: any) => void
  onStopSignal: (fn: () => void) => void
}

export type ChatFn = (
  params: ChatFnParams
) => Promise<void>

export type CreateTitleParams = {
  provider: GPTProvider
  convoDetail: ConvoDetail
}

export type CreateTitleFn = (params: CreateTitleParams) => Promise<string>