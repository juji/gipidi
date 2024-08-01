import type { Set } from './'
import { ChatCreationData } from './'

export function onCreateChat(set: Set){

  return ( fn: () => ChatCreationData ) => {

    set(state => {
      state.createChatListener = fn
    })

  }

}