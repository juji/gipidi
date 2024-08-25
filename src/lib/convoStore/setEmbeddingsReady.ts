import { ConvoAttachment } from "../idb/types";
import type { Set } from './'


export function setEmbeddingsReady(set: Set){

  return (embeddings: boolean|string[]) => {

    set(s => {

      console.log('setting embeddings', embeddings)
      console.log('setting embeddings on', JSON.parse(JSON.stringify(s.activeConvo)))

      const userData = s.activeConvo?.data.findLast(v => v.role === 'user')
      const userDataIndex = s.activeConvo ? s.activeConvo.data.findLastIndex(v => v.role === 'user') : -1
      
      if(
        s.isWaitingResponse &&
        s.activeConvo && userData && userDataIndex >= 0 && 
        typeof embeddings !== 'boolean' && embeddings
      ){
        console.log('setEmbeddingsReady: setting embeddings')
        s.activeConvo.data[userDataIndex].embeddings = embeddings
      }
      
      s.embeddingsReady = !!embeddings
      
    })
    
  }

}