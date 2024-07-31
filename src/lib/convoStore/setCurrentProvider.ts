
import { GPTProvider } from '../idb/types'
import type { Set } from './'

export function setCurrentProvider(set: Set){

  return async ( provider: GPTProvider['id'] | null) => {
    set(state => ({ currentProvider: provider }))
  }

}