import { StateCreator } from 'zustand'
import { getAllProvider } from '../idb/gpt/getAllProvider'

export type IDbStorageType = <T>(f: StateCreator<T, [], any[]>) => StateCreator<T, [], any[]>

export const initialize: IDbStorageType = (f) => (set, get, store) => {
  type T = ReturnType<typeof f>

  getAllProvider().then(async providers => {

    if(providers.length){

      set({
        loading: false,
        providers,
      } as unknown as Partial<T>)

    }else{

      set({
        loading: false,
      } as unknown as Partial<T>)

    }
    
  }).catch(e => {
    console.error('error on setting up')
    console.error(e)
  })

  return f(set, get, store)
}