import { Set } from ".";

export function removeHistoryDetails(set: Set) {
  
  return () => {
    set(s => { s.convoDetail = null })
  }

}