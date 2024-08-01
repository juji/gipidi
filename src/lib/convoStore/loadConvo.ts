
import { getConvoDetail } from '../idb/convo/getConvoDetail'
import { Convo } from '../idb/types'
import type { Set } from './'
import { ls } from '../local-storage'

export function loadConvo(set: Set){

  return async ( convo: Convo ) => {

    const details = await getConvoDetail(convo)
    ls.saveConvoId(convo)

    set(state => {
      state.activeConvo = details
    })

  }

}