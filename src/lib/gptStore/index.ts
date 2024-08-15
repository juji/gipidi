'use client'

import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { GPTProvider } from '../idb/types'
import { initialize } from './initialize'
import { saveProvider } from './saveProvider'
import { removeProvider } from './removeProvider'
import { getAllModels } from './getAllModels'
import { getModels } from './getModels'
import { GPTModel } from '@/lib/vendor/types'

export type GPTStore = {
  loading: boolean
  providers: GPTProvider[]
  saveProvider: (id: GPTProvider['id'], setting: GPTProvider['setting'], icon: string) => void
  removeProvider: (id: GPTProvider['id']) => void
  getModels: ( provider: GPTProvider ) => Promise<GPTModel[]>
  getAllModels: () => Promise<{
    provider: GPTProvider 
    models: GPTModel[]
  }[]>
}

export type Set = (
  nextStateOrUpdater: (state: GPTStore) => void, 
  shouldReplace?: boolean | undefined,
) => void

export type Get = () => GPTStore

export const useGPT = createGPTStore()

export function createGPTStore(){
  return create<GPTStore>()(
    initialize(
      immer(
        (set, get) => ({
          loading: true,
          providers: [],
          saveProvider: saveProvider(set),
          removeProvider: removeProvider(set),
          getAllModels: getAllModels(get),
          getModels: getModels(),
        })
      )
    )
  )
}


