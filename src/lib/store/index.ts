import { createStore } from 'zustand/vanilla'
import { Convo, ConvoDetail } from '../convo/types'
import { initialize } from './initialize'
import { setActiveConvo } from './setActiveConvo'
import { updateActiveConvo } from './updateActiveConvo'
import { updateConvo } from './updateConvo'
import { immer } from 'zustand/middleware/immer'

export type ConvoStore = {
  loading: boolean
  convos: Convo[]
  activeConvo: ConvoDetail|null
}

export type Set = (
  nextStateOrUpdater: (state: ConvoStore) => void, 
  shouldReplace?: boolean | undefined
) => void

export const store = createStore<ConvoStore>()(
  initialize(
    immer(
      (set) => ({
        loading: true,
        convos: [],
        activeConvo: null,
        setActiveConvo: setActiveConvo(set),
        updateActiveConvo: updateActiveConvo(set),
        updateConvo: updateConvo(set),
      })
    )
  )
)

