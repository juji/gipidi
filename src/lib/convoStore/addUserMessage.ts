import { nanoid } from "nanoid";
import { Get, Set } from ".";
import { updateConvoDetail } from "../idb/convo/updateConvoDetail";
import { ConvoAttachment } from "../idb/types";

export function addUserMessage(set: Set, get: Get){
  
  return async ( text: string, files: ConvoAttachment[] ) => {

    const { activeConvo } = get()
  
    if(!activeConvo) throw new Error(
      'activeConvo is empty when adding userText'
    )
  
    const data = [ ...activeConvo.data ]
    data.push({
      id: nanoid(),
      lastUpdate: new Date(),
      role: 'user',
      content: text,
      ...files && files.length ? {attachments: files} : {}
    })

    set(state => { 
      if(state.activeConvo)
        state.activeConvo.data = data
      
      state.isWaitingResponse = true
    })

    await updateConvoDetail(activeConvo)
  }


}
