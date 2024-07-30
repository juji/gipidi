
import { Convo } from '../convo/types'
import { deleteConvo as delConvo } from '../convo/deleteConvo'
import type { Set } from './'

export function deleteConvo(set: Set){

  return async ( convo: Convo ) => {
    set(state => {

      const active = state.activeConvo
      state.convos = state.convos.filter(v => v.id !== convo.id)
      if(active && active.id === convo.id)
        state.activeConvo = null
      
    })

    await delConvo(convo)
  }

}