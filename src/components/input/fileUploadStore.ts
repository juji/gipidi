'use client'

// this is why i use zustand for react state management
// use useState doesn't do good with useRef

import { ConvoAttachment } from '@/lib/idb/types'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

export type FileUploadStore = {
  files: ConvoAttachment[],
  draggedIn: boolean
  filesInQueue: number
  addFileInQueue: () => void
  onDraggedIn: () => void
  onDraggedOut: () => void
  add: (file: ConvoAttachment) => void
  remove: (index: number) => void
  removeAll: () => void
}

export const useFileUpload = create<FileUploadStore>()(
  immer(
    (set, get) => ({
      files: [],
      draggedIn: false,
      filesInQueue: 0,
      addFileInQueue(){
        set(store => { store.filesInQueue += 1 })
      },
      onDraggedIn(){
        set(store => { store.draggedIn = true })
      },
      onDraggedOut(){
        set(store => { store.draggedIn = false })
      },
      add( file: ConvoAttachment ){
        set(store => {
          store.files.push(file)
          store.filesInQueue -= 1
        })
      },
      remove(index: number) {
        set(store => { store.files.splice(index, 1) })
      },
      removeAll() {
        set(store => { store.files = [] })
      }
    })
  )
)



