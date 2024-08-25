import { ConvoAttachment } from "../idb/types";
import type { Set } from './'


export function setEmbeddingsReady(set: Set){

  return (embeddings: boolean|string[]) => {

    set(s => {

      console.log('setting embeddings', embeddings)
      console.log('setting embeddings on', JSON.parse(JSON.stringify(s.activeConvo)))

      s.embeddingsReady = !!embeddings
      
      const userData = s.activeConvo?.data.findLast(v => v.role === 'user')
      const userDataIndex = s.activeConvo ? s.activeConvo.data.findLastIndex(v => v.role === 'user') : -1

      console.log('userData', userData)
      console.log('userDataIndex', userDataIndex)

      if(s.activeConvo && userData && userDataIndex >= 0 && typeof embeddings !== 'boolean'){
        console.log('adding embeddings to user message')
        s.activeConvo.data[userDataIndex].embeddings = embeddings
      }

      if(
        s.embeddingsReady && s.attachmentReady
      ) {
        console.log('setting allReady, true')
        s.allReady = true
      }
      
    })
    
  }

}