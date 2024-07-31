
import type { Set } from './'

export function setCurrentSystemPrompt(set: Set){

  return async ( str: string | null) => {
    set(state => ({ currentSystemPrompt: str }))
  }

}