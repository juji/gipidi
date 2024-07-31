import { Set } from ".";
import { GPTProvider } from "../idb/types";
import { removeGPTProvider } from "../idb/gpt/removeGPTProvider";

export function removeProvider( set: Set){

  return async (
    id: GPTProvider['id'],
  ) => {

    await removeGPTProvider(id)

    set(s => {

      const providers = s.providers
      const pIndex = providers.findIndex(v => v.id === id)
      if(pIndex === -1) return;
      else s.providers.splice(pIndex, 1)

    })

  }

}