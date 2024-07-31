
import { ConvoDetail } from '../idb/types'
import { updateConvoDetail } from '../idb/convo/updateConvoDetail'
import type { Set } from './'

export function updateActiveConvo(set: Set){

  return async ( convoDetail: ConvoDetail ) => {
    set(state => ({ activeConvo: convoDetail }))
    await updateConvoDetail(convoDetail)
  }

}