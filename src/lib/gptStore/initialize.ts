import { StateCreator } from 'zustand'
// import { getAllProvider } from '../idb/gpt/getAllProvider'
import { getAllProvider } from '@/lib/pglite/gpt/getAllProvider'

export type IDbStorageType = <T>(f: StateCreator<T, [], any[]>) => StateCreator<T, [], any[]>

export const initialize: IDbStorageType = (f) => (set, get, store) => {
  type T = ReturnType<typeof f>

  if(typeof window === 'undefined') return f(set, get, store);
  console.debug('initialize gptStore')

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
    console.error('error on setting up GPTStore')
    console.error(e)
  })

  return f(set, get, store)
}