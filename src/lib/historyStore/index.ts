'use client'

import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { Convo, ConvoDetail } from '../idb/types'
import { getConvoHistory } from './getConvoHistory'
import { getHistoryDetails } from './getHistoryDetails'
import { clearHistory } from './clearHistory'
import { removeHistoryDetails } from './removeHistoryDetail'
import { restore } from './restore'

export type HistoryStore = {
  loading: boolean
  convoHistory: Convo[]
  convoDetail: ConvoDetail | null
  getConvoHistory: () => Promise<void>
  getHistoryDetails: (convo: Convo) => Promise<void>
  removeHistoryDetails: () => void
  clearHistory: (convos: Convo[]) => Promise<void>

  onRestoreListener: null | ((convo: Convo) => void)
  onRestore: (fn: null | ((convo: Convo) => void)) => void

  restore: (convo: Convo) => Promise<void>
}

export type Set = (
  nextStateOrUpdater: (state: HistoryStore) => void, 
  shouldReplace?: boolean | undefined,
) => void

export type Get = () => HistoryStore

export const useHistory = createHistoryStore()

export function createHistoryStore(){
  return create<HistoryStore>()(
    immer(
      (set, get) => ({
        loading: true,
        convoHistory: [],
        convoDetail: null,
        getConvoHistory: getConvoHistory(set),
        getHistoryDetails: getHistoryDetails(set),
        removeHistoryDetails: removeHistoryDetails(set), 
        clearHistory: clearHistory(set),

        onRestoreListener: null,
        onRestore: (fn: null | ((convo: Convo) => void)) => {
          set(s => { s.onRestoreListener = fn })
        },

        restore: restore(set)

      })
    )
  )
}


