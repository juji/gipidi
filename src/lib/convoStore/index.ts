import { create } from 'zustand'
import { Convo, ConvoDetail } from '../idb/types'
import { immer } from 'zustand/middleware/immer'
import { initialize } from './initialize'
import { setActiveConvo } from './setActiveConvo'
import { updateActiveConvo } from './updateActiveConvo'
import { updateConvo } from './updateConvo'
import { deleteConvo } from './deleteConvo'

export type ConvoStore = {
  loading: boolean
  convos: Convo[]
  activeConvo: ConvoDetail|null
  setActiveConvo: ( convo: Convo ) => void,
  updateActiveConvo: ( detail: ConvoDetail ) => void,
  updateConvo: ( convo: Convo ) => void,
  deleteConvo: ( convo: Convo ) => void
}

export type Set = (
  nextStateOrUpdater: (state: ConvoStore) => void, 
  shouldReplace?: boolean | undefined,
  
) => void

export const useChatStore = create<ConvoStore>()(
  initialize(
    immer(
      (set) => ({
        loading: true,
        convos: [],
        activeConvo: null,
        setActiveConvo: setActiveConvo(set),
        updateActiveConvo: updateActiveConvo(set),
        updateConvo: updateConvo(set),
        deleteConvo: deleteConvo(set)
      })
    )
  )
)

