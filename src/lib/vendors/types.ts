import { ConvoDetail, GPTProvider } from "../idb/types"


export type GPTModel = {
  id: string,
  name: string
}

export type ChatFn<T = void> = (
  client: T, 
  convoDetail: ConvoDetail,
  onResponse: (str: string, end?: boolean) => void,
  onError: (e: any) => void,
  onStopSignal?: (fn: () => void) => void
) => Promise<void>

export type GetClientFromProvider<T = void> = (
  provider: GPTProvider
) => T
