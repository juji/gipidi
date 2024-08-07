import { StateCreator } from 'zustand'
import { getSetting } from '../idb/settings/get'
import { ID } from '.'

export type IDbStorageType = <T>(f: StateCreator<T, [], any[]>) => StateCreator<T, [], any[]>

export const initialize: IDbStorageType = (f) => (set, get, store) => {
  type T = ReturnType<typeof f>

  // initialize

  if(typeof window === 'undefined') return f(set, get, store);

  getSetting(ID).then(async (setting:any) => {

    set({
      loading: false,
      data: setting.data,
    } as unknown as Partial<T>)
    
  }).catch(e => {
    console.error('error on setting up')
    console.error(e)
  })

  return f(set, get, store)
}