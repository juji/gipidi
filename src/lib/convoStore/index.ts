'use client'

import { create } from 'zustand'
import { Convo, ConvoDetail, GPTProvider } from '../idb/types'
import { immer } from 'zustand/middleware/immer'
import { initialize } from './initialize'

import { setActiveConvo } from './setActiveConvo'

import { updateConvo } from './updateConvo'
import { deleteConvo } from './deleteConvo'
import { createConvo } from './createConvo'

import { setCurrentModel } from './setCurrentModel'
import { setCurrentProvider } from './setCurrentProvider'
import { setCurrentSystemPrompt } from './setCurrentSystemPrompt'
import { setCurrentTitle } from './setCurrentTitle'

import { addUserText } from './addUserText'
import { addGPTText } from './addGPTText'

export type ConvoStore = {
  loading: boolean
  convos: Convo[]
  activeConvo: ConvoDetail|null
  currentProvider: GPTProvider['id'] | null
  currentModel: string | null
  currentSystemPrompt: string | null
  currentTitle: string | null

  isStreaming: boolean
  isWaitingReply: boolean

  setActiveConvo: ( convo: Convo ) => void

  updateConvo: ( convo: Convo ) => void
  deleteConvo: ( convo: Convo ) => void
  setCurrentModel: ( model: string | null ) => void
  setCurrentProvider: ( provider: GPTProvider['id'] | null ) => void
  setCurrentSystemPrompt: ( str: string ) => void
  setCurrentTitle: ( str: string ) => void

  createConvo: ( initialContent: string ) => void
  addUserText: ( str: string ) => void
  addGPTText: ( str: string, isDone?: boolean ) => void

}

export type Set = (
  nextStateOrUpdater: (state: ConvoStore) => void, 
  shouldReplace?: boolean | undefined,
) => void

export type Get = () => ConvoStore

export const useConvo = createConvoStore()

export function createConvoStore(){

  return create<ConvoStore>()(
    initialize(
      immer(
        (set, get) => ({
          loading: true,
          convos: [],
          activeConvo: null,
          currentProvider: null,
          currentModel: null,
          currentSystemPrompt: null,
          currentTitle: null,

          isStreaming: false,
          isWaitingReply: false,

          setActiveConvo: setActiveConvo(set),

          updateConvo: updateConvo(set),
          deleteConvo: deleteConvo(set),
          setCurrentModel: setCurrentModel(set),
          setCurrentProvider: setCurrentProvider(set),
          setCurrentSystemPrompt: setCurrentSystemPrompt(set),
          setCurrentTitle: setCurrentTitle(set, get),
          createConvo: createConvo(set, get),
          addUserText: addUserText(set, get),
          addGPTText: addGPTText(set, get),

        })
      )
    )
  )

}

