
import { Convo } from '../idb/types'
import { getConvoDetail as getDetail } from '../idb/convo/getConvoDetail'
import { ls } from '../local-storage'
import type { Set } from './'

export function setActiveConvo(set: Set){

  return async ( convo: Convo ) => {
    const detail = await getDetail( convo )
    ls.saveConvoId(convo)
    set(state => ({ activeConvo: detail }))
  }

}