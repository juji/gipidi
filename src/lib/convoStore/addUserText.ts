import { nanoid } from "nanoid";
import { Get, Set } from ".";
import { updateConvoDetail } from "../idb/convo/updateConvoDetail";

export function addUserText(set: Set, get: Get){
  
  return async ( text: string ) => {

    const { activeConvo } = get()
  
    if(!activeConvo) throw new Error(
      'activeConvo is empty when adding userText'
    )
  
    const data = [ ...activeConvo.data ]
    data.push({
      id: nanoid(),
      lastUpdate: new Date(),
      role: 'user',
      content: text
    })

    set(state => { 
      if(state.activeConvo)
        state.activeConvo.data = data
      state.isWaitingReply = true
    })

    await updateConvoDetail(activeConvo)
  }


}
