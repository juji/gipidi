import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { GPTProvider } from '../gpt/types'
import { initialize } from './initialize'

export type GPTStore = {
  loading: boolean
  providers: GPTProvider[]
}

export type Set = (
  nextStateOrUpdater: (state: GPTStore) => void, 
  shouldReplace?: boolean | undefined,
) => void

export const useGPTStore = create<GPTStore>()(
  initialize(
    immer(
      (set) => ({
        loading: true,
        providers: [],
      })
    )
  )
)

