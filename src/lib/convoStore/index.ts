'use client'

import { create } from 'zustand'
import { Convo, ConvoDetail, GPTProvider } from '../idb/types'
import { immer } from 'zustand/middleware/immer'
import { initialize } from './initialize'
import { setActiveConvo } from './setActiveConvo'
import { updateActiveConvo } from './updateActiveConvo'
import { updateConvo } from './updateConvo'
import { deleteConvo } from './deleteConvo'

import { setCurrentModel } from './setCurrentModel'
import { setCurrentProvider } from './setCurrentProvider'

export type ConvoStore = {
  loading: boolean
  convos: Convo[]
  activeConvo: ConvoDetail|null
  currentProvider: GPTProvider['id'] | null,
  currentModel: string | null,
  setActiveConvo: ( convo: Convo ) => void,
  updateActiveConvo: ( detail: ConvoDetail ) => void,
  updateConvo: ( convo: Convo ) => void,
  deleteConvo: ( convo: Convo ) => void,
  setCurrentModel: ( model: string | null ) => void
  setCurrentProvider: ( provider: GPTProvider['id'] | null ) => void
}

export type Set = (
  nextStateOrUpdater: (state: ConvoStore) => void, 
  shouldReplace?: boolean | undefined,
  
) => void

export const useConvo = createConvoStore()

export function createConvoStore(){

  return create<ConvoStore>()(
    initialize(
      immer(
        (set) => ({
          loading: true,
          convos: [],
          activeConvo: null,
          currentProvider: null,
          currentModel: null,
          setActiveConvo: setActiveConvo(set),
          updateActiveConvo: updateActiveConvo(set),
          updateConvo: updateConvo(set),
          deleteConvo: deleteConvo(set),
          setCurrentModel: setCurrentModel(set),
          setCurrentProvider: setCurrentProvider(set),
        })
      )
    )
  )

}
