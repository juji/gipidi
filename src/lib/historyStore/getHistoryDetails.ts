import { Set } from ".";
import { getHistoryDetails as getDetails } from "../idb/history/getHistoryDetails";
import { Convo } from "../idb/types";


export function getHistoryDetails(set: Set) {
  
  return async (convo: Convo) => {

    const details = await getDetails(convo)
    set(s => { s.convoDetail = details })

  }

}