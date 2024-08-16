import { Set } from ".";
// import { GPTProvider } from "../idb/types";
// import { upsertGPTProvider } from "../idb/gpt/upsertGPTProvider";
import { GPTProvider } from "@/lib/pglite/types";
import { upsertGPTProvider } from "@/lib/pglite/gpt/upsertGPTProvider";

export function saveProvider( set: Set){

  return async (
    id: GPTProvider['id'],
    setting: GPTProvider['setting'],
    icon: string
  ) => {

    const provider = await upsertGPTProvider(id, setting, icon)

    set(s => {

      const providers = s.providers
      const pIndex = providers.findIndex(v => v.id === provider.id)
      if(pIndex === -1) s.providers.push(provider)
      else s.providers[pIndex] = provider

    })

  }

}