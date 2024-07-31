'use client'

import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { GPTProvider } from '../idb/types'
import { initialize } from './initialize'
import { saveProvider } from './saveProvider'
import { removeProvider } from './removeProvider'

export type GPTStore = {
  loading: boolean
  providers: GPTProvider[]
  saveProvider: (id: GPTProvider['id'], setting: GPTProvider['setting']) => void
  removeProvider: (id: GPTProvider['id']) => void
}

export type Set = (
  nextStateOrUpdater: (state: GPTStore) => void, 
  shouldReplace?: boolean | undefined,
) => void

export const useGPT = createGPTStore()

export function createGPTStore(){
  return create<GPTStore>()(
    initialize(
      immer(
        (set) => ({
          loading: true,
          providers: [],
          saveProvider: saveProvider(set),
          removeProvider: removeProvider(set)
        })
      )
    )
  )
}


