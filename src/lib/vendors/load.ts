import type { ConvoDetail, GPTProvider } from "../idb/types";
import { getAllProvider } from "../idb/gpt/getAllProvider";
import { GPTModel } from "./types";
import { getGPTProvider } from "../idb/gpt/getGPTProvider";

export type ModelsFn = () => Promise<GPTModel[]>
export type ChatFn = (params: {
  convoDetail: ConvoDetail
  onResponse: (str: string, end?: boolean) => void
  onError: (e: any) => void
  onStopSignal?: (fn: () => void) => void
}) => Promise<void>

export type CreateTitleFn = (convoDetail: ConvoDetail) => Promise<string>

export type GetDefaultFn = () => {
  id: string
  name: string
}

export type TestFn = ( ApiKeyOrUrl: string ) => Promise<any>

function getMethods( loaded: any, client: any ){

  const models: ModelsFn =  async () => (await loaded.models(client)) as GPTModel[]  

  const chat: ChatFn = async({
    convoDetail,
    onResponse,
    onError,
    onStopSignal
  }) => await loaded.chat(
    client,
    convoDetail,
    onResponse,
    onError,
    onStopSignal
  )

  const createTitle: CreateTitleFn = async (convoDetail: ConvoDetail) => await loaded.createTitle(
    client,
    convoDetail
  )

  return {
    client,
    models,
    chat,
    processAttchments: loaded.processAttchments as boolean,
    createTitle,
    getDefaultModel: loaded.getDefaultModel ? loaded.getDefaultModel as GetDefaultFn : null,
    test: loaded.test as TestFn,
    icon: loaded.icon as string ?? null
  }

}

export async function loadFromId(
  id: string, 
  config: { [key: string]: string }
){

  const param = config[Object.keys(config)[0]]
  const l = await import(`@/lib/vendors/${id}`)
  const client = l.getClient(param)
  return getMethods(l, client)

}

export async function loadProviderById( id:GPTProvider['id'] ){
  const l = await import(`@/lib/vendors/${id}`)
  return l
}

export async function loadVendor( 
  provider: GPTProvider
){
  const l = await loadProviderById(provider.id)
  const client = l.getClientFromProvider(provider)
  return getMethods(l, client)
}

export type AwaitedVendor = Awaited<ReturnType<typeof loadVendor>>

export async function loadAll(){

  const providers = await getAllProvider()
  const v = await Promise.all(providers.map(v => loadVendor(v)))

  return providers.reduce((a,b,i) => {

    a[b.id] = v[i]
    return a

  }, {} as {[key in GPTProvider['id']]: AwaitedVendor})

}
