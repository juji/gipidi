'use client'

import { create } from 'zustand'
import { Convo, ConvoAttachment, ConvoDetail, GPTProvider } from '../idb/types'
import { immer } from 'zustand/middleware/immer'
import { initialize } from './initialize'

import { updateConvo } from './updateConvo'
import { deleteConvo } from './deleteConvo'
import { createConvo } from './createConvo'
import { loadConvo } from './loadConvo'

import { setCurrentTitle } from './setCurrentTitle'

import { addUserMessage } from './addUserMessage'
import { addGPTText } from './addGPTText'

import { onCreateChat } from './onCreateChat'
import { search } from './search'

export type ChatCreationData = {
  provider: GPTProvider['id'] 
  model: string 
  systemPrompt: string
  title: string
}

export type ConvoStore = {
  loading: boolean
  convos: Convo[]
  searchResult: Convo[]|null
  activeConvo: ConvoDetail|null

  isStreaming: boolean
  isWaitingReply: boolean

  updateConvo: ( convo: Convo ) => void
  deleteConvo: ( convo: Convo ) => void
  loadConvo: ( convo: Convo ) => Promise<void>

  setCurrentTitle: ( str: string ) => Promise<void>

  createConvo: ( initialContent: string, files: ConvoAttachment[] ) => void
  addUserMessage: ( str: string, files: ConvoAttachment[] ) => void
  addGPTText: ( str: string, isDone?: boolean ) => void

  createChatListener: null | (() => ChatCreationData)
  onCreateChat: (fn: () => ChatCreationData) => void
  search: ( str: string ) => void

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
          searchResult: null,
          activeConvo: null,

          isStreaming: false,
          isWaitingReply: false,

          updateConvo: updateConvo(set),
          deleteConvo: deleteConvo(set),
          loadConvo: loadConvo(set),

          setCurrentTitle: setCurrentTitle(set, get),
          createConvo: createConvo(set, get),
          addUserMessage: addUserMessage(set, get),
          addGPTText: addGPTText(set, get),

          createChatListener: null,
          onCreateChat: onCreateChat(set),
          search: search(set, get)

        })
      )
    )
  )

}

