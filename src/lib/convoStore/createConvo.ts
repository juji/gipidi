
import { createConvo as create } from '../convo/createConvo'
import type { Set } from './'

export function createConvo(set: Set){

  return async () => {

    const {
      convo,
      convoDetail
    } = await create()

    set(state => {
      state.convos.unshift(convo)
      state.activeConvo = convoDetail
    })

  }

}