import { Set } from ".";
import { getAllConvo } from "../idb/convo/getAllConvo";




export function loadAll(set: Set){

  return async () => {

    const convos = await getAllConvo()
    set(s => { s.convos = convos })

  }


}