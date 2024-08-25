import { ConvoAttachment } from "../idb/types";
import type { Set } from './'


export function setEmbeddingsReady(set: Set){

  return (embeddings: boolean|string[]) => {

    set(s => {

      const userData = s.activeConvo?.data.findLast(v => v.role === 'user')
      const userDataIndex = s.activeConvo ? s.activeConvo.data.findLastIndex(v => v.role === 'user') : -1
      
      if(
        s.isWaitingResponse &&
        s.activeConvo && userData && userDataIndex >= 0 && 
        typeof embeddings !== 'boolean' && embeddings
      ){
        s.activeConvo.data[userDataIndex].embeddings = embeddings
      }
      
      s.embeddingsReady = !!embeddings
      
    })
    
  }

}