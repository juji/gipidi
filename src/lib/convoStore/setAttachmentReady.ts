import { ConvoAttachment } from "../idb/types";
import type { Set } from './'


export function setAttachmentReady(set: Set){

  return (attachments: boolean|{[key: string]: ConvoAttachment}) => {
    set(s => {
      const userData = s.activeConvo?.data.findLast(v => v.role === 'user')
      if(
        typeof attachments !== 'boolean' &&
        userData
      ){
        if(!s.activeConvo) return;
        const userData = s.activeConvo?.data.findLast(v => v.role === 'user')
        const userDataIndex = s.activeConvo?.data.findLastIndex(v => v.role === 'user')
        if(!userData) return;
        if(userDataIndex === -1) return;
        const att = userData.attachments
        s.activeConvo.data[userDataIndex].attachments = att ? 
          att.map(v =>  {
            return attachments[v.id]
          }) : 
          Object.keys(attachments).map(v => attachments[v])
      }
      s.attachmentReady = !!attachments
    })
    
  }

}