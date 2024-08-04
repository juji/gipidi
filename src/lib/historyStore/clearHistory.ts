import { Set } from ".";
import { removeHistory as remHistory } from "../idb/history/removeHistory";
import { Convo } from "../idb/types";


export function clearHistory(set: Set) {
  
  return async (convos: Convo[]) => {

    const ids = convos.map(v => v.id)
    await remHistory(convos)
    set(s => {
      if (s.convoDetail && ids.includes(s.convoDetail.id))
        s.convoDetail = null
      s.convoHistory = s.convoHistory.filter(v => !ids.includes(v.id))
    })

  }

}