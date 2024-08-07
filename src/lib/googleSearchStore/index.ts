'use client'

import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { initialize } from './initialize'
import { setSetting } from '../idb/settings/set'

export const ID = 'google-search'

export type GoogleSearchData = {
  id: string,
  apiKey: string
}

export type GoogleSearchStore = {
  loading: boolean
  data: GoogleSearchData | null
  set: ( id: string, apiKey: string ) => Promise<void>
}

export type Set = (
  nextStateOrUpdater: (state: GoogleSearchStore) => void, 
  shouldReplace?: boolean | undefined,
) => void

export type Get = () => GoogleSearchStore

export const useGoogleSearchStore = createGoogleSearchStore()

export function createGoogleSearchStore(){
  return create<GoogleSearchStore>()(
    initialize(
      immer(
        (set, get) => ({
          loading: true,
          data: null,
          set: async ( id: string, apiKey: string ) => {
            set({ data: { id, apiKey }})
            await setSetting(ID, { id, apiKey })
          }
        })
      )
    )
  )
}


