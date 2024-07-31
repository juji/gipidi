
import type { Set, Get } from './'

export function setCurrentTitle(set: Set, get: Get){

  return ( str: string | null) => {

    const { activeConvo, convos } = get()
    let convoIdx = -1;
    if(activeConvo){
      convoIdx = convos.findIndex(v => v.id === activeConvo.id)  
    }
    set(state => {
      state.currentTitle = str
      if(convoIdx > -1){
        state.convos[convoIdx].title = str || ''
      }
    })
  }

}