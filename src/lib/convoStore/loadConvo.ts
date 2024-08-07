
import { getConvoDetail } from '../idb/convo/getConvoDetail'
import { Convo } from '../idb/types'
import type { Set } from './'

export function loadConvo(set: Set){

  return async ( convo: Convo ) => {

    set({ loadingConvo : true })
    const details = await getConvoDetail(convo)
    set({ activeConvo : details })

    setTimeout(() => {
      set({ loadingConvo : false })
    },300)

  }

}