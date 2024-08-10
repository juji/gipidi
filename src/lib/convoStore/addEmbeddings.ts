import { Get, Set } from ".";
import { updateConvoDetail } from "../idb/convo/updateConvoDetail";
import { ConvoEmbeddingsMetadata } from "../idb/types";

export function addEmbeddings(set: Set, get: Get){
  
  return async ( 
    activeConvoId: string,
    collectionId: string, 
    metadatas: ConvoEmbeddingsMetadata[]
  ) => {

    const active = get().activeConvo
    if(!active) return;
    if(active.id !== activeConvoId) return;

    // set new data to the state
    set(async state => {
      
      if(!state.activeConvo) return;

      state.activeConvo.embeddings = {
        collectionId,
        metadatas: [
          ...state.activeConvo.embeddings ? state.activeConvo.embeddings.metadatas : [],
          ...metadatas
        ]
      }
      
      await updateConvoDetail(state.activeConvo)
      
    })


  }



}
