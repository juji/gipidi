
import { Convo } from '../convo/types'
import { updateConvo as update } from '../convo/updateConvo'
import type { Set } from './'

export function updateConvo(set: Set){

  return async ( convo: Convo  ) => {
    set(state => {
      const convIndex = state.convos.findIndex(v => v.id === convo.id)
      if(convIndex === -1) return;
      state.convos[convIndex] = convo
    })
    await update(convo)
  }

}