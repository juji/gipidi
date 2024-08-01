import { StateCreator } from 'zustand'
import { ConvoDetail } from '../idb/types'
import { getAllConvo } from '../idb/convo/getAllConvo'
import { getConvoDetail } from '../idb/convo/getConvoDetail'

export type IDbStorageType = <T>(f: StateCreator<T, [], any[]>) => StateCreator<T, [], any[]>

export const initialize: IDbStorageType = (f) => (set, get, store) => {
  type T = ReturnType<typeof f>

  // initialize
  // get all convo
  // get last active convo
  // get last active convoDetail
  // set it on the store

  if(typeof window === 'undefined') return f(set, get, store);

  getAllConvo().then(async convos => {

    if(convos.length){


      // get state on last active session

      // get details based on last active convo
      let convo: ConvoDetail|null = null

      set({
        loading: false,
        convos,
        activeConvo: convo,
      } as unknown as Partial<T>)

    }else{

      set({
        loading: false,
        convos,
      } as unknown as Partial<T>)

    }
    
  }).catch(e => {
    console.error('error on setting up')
    console.error(e)
  })

  return f(set, get, store)
}