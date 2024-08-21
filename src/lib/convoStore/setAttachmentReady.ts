import { ConvoAttachment } from "../idb/types";
import type { Set } from './'


export function setAttachmentReady(set: Set){

  return (attachments: boolean|{[key: string]: ConvoAttachment}) => {

    set(s => {
      s.attachmentReady = !!attachments
      
      if(!s.activeConvo) return;
      const userData = s.activeConvo.data.findLast(v => v.role === 'user')
      if(!userData) return;
      const userDataIndex = s.activeConvo?.data.findLastIndex(v => v.role === 'user')
      if(userDataIndex === -1) return;

      if(typeof attachments !== 'boolean'){
        const att = userData.attachments
        s.activeConvo.data[userDataIndex].attachments = att ? 
          att.map(v =>  attachments[v.id]) : 
          Object.keys(attachments).map(v => attachments[v])
      }
      
    })
    
  }

}