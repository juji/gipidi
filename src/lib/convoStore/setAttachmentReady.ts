import { ConvoAttachment } from "../idb/types";
import type { Set } from './'


export function setAttachmentReady(set: Set){

  return (attachments: boolean|{[key: string]: ConvoAttachment}) => {

    set(s => {

      console.log('setting attachments', attachments)

      const userData = s.activeConvo?.data.findLast(v => v.role === 'user')
      const userDataIndex = s.activeConvo ? s.activeConvo.data.findLastIndex(v => v.role === 'user') : -1
      
      if(
        s.isWaitingResponse &&
        s.activeConvo && userData && userDataIndex >= 0 && 
        typeof attachments !== 'boolean' && attachments
      ){
        console.log('setAttachmentReady: setting attachment')
        const att = userData.attachments
        s.activeConvo.data[userDataIndex].attachments = att ? 
        att.map(v =>  attachments[v.id]) : 
        Object.keys(attachments).map(v => attachments[v])
      }
      
      s.attachmentReady = !!attachments

    })
    
  }

}