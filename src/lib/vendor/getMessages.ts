import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";
import { ConvoDetail, } from "../idb/types";
import { createConvoWithAttachment, encloseWithDefaultRequrement } from "./system";

export function getMessages(convoDetail: ConvoDetail, setAttachment = true){

  let mssg = [ ...convoDetail.data ]
  if(mssg[0].role !== 'system'){
    mssg.unshift({
      id: new Date().toISOString(),
      role: 'system',
      content: '',
      lastUpdate: new Date()
    })
  }

  const messages = mssg.map(v => {

    return v.role === 'system' ? 
      new SystemMessage({ 
        content: encloseWithDefaultRequrement(v.content),
        id: v.id,
      }) :
      v.role === 'user' ? 
      new HumanMessage({ 
        content: setAttachment ? createConvoWithAttachment(v.content, v.attachments) : v.content,
        id: v.id,
      }) :
      v.role === 'assistant' ? 
      new AIMessage({ 
        content: v.content,
        id: v.id,
      }) :
      null

  })

  return messages.filter(v => v) as (SystemMessage | HumanMessage | AIMessage)[]
}