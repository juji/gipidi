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
import { loadAll } from './loadAll'
import { setAttachmentReady } from './setAttachmentReady'

import { WritableDraft } from 'immer'

export type ChatCreationData = {
  provider: GPTProvider['id'] 
  providerIcon: string
  model: string 
  systemPrompt: string
  title: string
}

export type ConvoStore = {
  loading: boolean
  convos: Convo[]
  searchResult: Convo[]|null
  activeConvo: ConvoDetail|null
  loadingConvo: boolean

  isStreaming: boolean
  disableInput: boolean
  isWaitingResponse: boolean

  updateConvo: ( convo: Convo ) => void
  deleteConvo: ( convo: Convo ) => void
  loadConvo: ( convo: Convo ) => Promise<void>

  setCurrentTitle: ( str: string ) => Promise<void>

  createConvo: ( initialContent: string, files: ConvoAttachment[] ) => void
  addUserMessage: ( str: string, files: ConvoAttachment[] ) => void
  addGPTText: ( str: string ) => void

  createChatListener: null | (() => ChatCreationData)
  onCreateChat: (fn: () => ChatCreationData) => void
  search: ( str: string ) => void

  onRemoveListener: null | ((convo: Convo) => void)
  onRemove: (fn: null | ((convo: Convo) => void)) => void

  loadAll: () => Promise<void>
  setStreaming: (b: boolean) => void
  setInputAvailable: (b: boolean) => void

  onReadyListener: null | (() => void)
  onReady: (fn: null | (() => void)) => void

  attachmentReady: boolean
  setAttachmentReady: (attachments: boolean|{[key: string]: ConvoAttachment}) => void

  stopSignal: () => void
  setStopSignal: (fn: null | (() => void)) => void

}

export type Set = (
  nextStateOrUpdater: ConvoStore | Partial<ConvoStore> | ((state: WritableDraft<ConvoStore>) => void), 
  shouldReplace?: boolean | undefined
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
          loadingConvo: false,

          isStreaming: false,
          disableInput: false,
          isWaitingResponse: false,

          updateConvo: updateConvo(set),
          deleteConvo: deleteConvo(set),
          loadConvo: loadConvo(set),

          setCurrentTitle: setCurrentTitle(set, get),
          createConvo: createConvo(set, get),
          addUserMessage: addUserMessage(set, get),
          addGPTText: addGPTText(set, get),

          createChatListener: null,
          onCreateChat: onCreateChat(set),
          search: search(set, get),

          onRemoveListener: null,
          onRemove: (fn: null | ((convo: Convo) => void)) => {
            set(s => { s.onRemoveListener = fn })
          },
          
          loadAll: loadAll(set),

          setStreaming( b: boolean ){
            if(b) set({ isStreaming: b })
            else set({ isStreaming: b })
          },

          setInputAvailable(b: boolean){
            set({ disableInput:!b })
          },

          onReadyListener: null,
          onReady: (fn: null | (() => void)) => {
            set({ onReadyListener: fn })
            if(get().attachmentReady && fn) fn()
          },

          attachmentReady: false,
          setAttachmentReady: setAttachmentReady(set),

          stopSignal: () => {},
          setStopSignal: (fn: null | (() => void)) => {
            set(s => {

              s.stopSignal = fn ? () => {
                fn()
                set(ss => {
                  if(ss.activeConvo){
                    console.log(ss.activeConvo.data[ss.activeConvo.data.length -1])
                    ss.activeConvo.data[ss.activeConvo.data.length -1].stopped = true
                  }
                })
              } : () => {
                set(ss => {
                  if(ss.activeConvo){
                    console.log(ss.activeConvo.data[ss.activeConvo.data.length -1])
                    ss.activeConvo.data[ss.activeConvo.data.length -1].stopped = true
                  }
                })
              }

            })
          }

        })
      )
    )
  )

}

