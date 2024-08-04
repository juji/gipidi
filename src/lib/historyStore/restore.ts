import { restoreHistory } from "../idb/history/restoreHistory";
import { Set } from ".";
import { Convo } from "../idb/types";

export function restore(set: Set) {
  
  return async (convo: Convo) => {

    await restoreHistory([convo])

    set(s => {
      if (s.convoDetail && s.convoDetail.id === convo.id)
        s.convoDetail = null
      s.convoHistory = s.convoHistory.filter(v => v.id !== convo.id)
      s.onRestoreListener && s.onRestoreListener(convo)
    })
  }

}
