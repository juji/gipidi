
import { Convo } from '../idb/types'
import { deleteConvo as delConvo } from '../idb/convo/deleteConvo'
import type { Set } from './'

export function deleteConvo(set: Set){

  return async ( convo: Convo ) => {
    await delConvo(convo)
    set(state => {

      const active = state.activeConvo
      state.convos = state.convos.filter(v => v.id !== convo.id)
      if(active && active.id === convo.id)
        state.activeConvo = null

      state.onRemoveListener && state.onRemoveListener(convo)
      
    })

  }

}