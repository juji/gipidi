

import { Set } from ".";
import { getConvoHistory as getHistory } from "../idb/history/getConvoHistory";


export function getConvoHistory( set: Set ) {
  
  return async () => {

    const history = await getHistory()

    set(s => {
      s.convoHistory = history
      s.loading = false
    })

  }

}