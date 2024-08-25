import { Get, Set } from ".";
import { updateConvoDetail } from "../idb/convo/updateConvoDetail";

export function updateEmbedding(set: Set, get: Get){
  
  return async ( id?: string ) => {

    const { activeConvo } = get()
    if(!activeConvo) return;

    updateConvoDetail({
      ...activeConvo,
      embeddingId: id
    })

    set(state => {      
      if(state.activeConvo){
        state.activeConvo.embeddingId = id
      }
    })
  }

}
