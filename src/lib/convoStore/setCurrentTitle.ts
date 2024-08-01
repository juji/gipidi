
import type { Set, Get } from './'
import { updateConvo } from '../idb/convo/updateConvo';

export function setCurrentTitle(set: Set, get: Get){

  return async ( str: string | null) => {

    const { activeConvo, convos } = get()
    let convoIdx = -1;
    if(activeConvo){
      convoIdx = convos.findIndex(v => v.id === activeConvo.id)  
    }
    
    if(convoIdx > -1){
      updateConvo({
        ...convos[convoIdx],
        title: str || ''
      })
    }

    set(state => {
      if(convoIdx > -1){
        state.convos[convoIdx].title = str || ''
      }
    })
  }

}