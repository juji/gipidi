import type { Set } from './'

export function setCurrentModel(set: Set){

  return async ( model: string | null) => {
    set(state => ({ currentModel: model }))
  }

}