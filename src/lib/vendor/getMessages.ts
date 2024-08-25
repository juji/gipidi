import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";
import { ConvoData, ConvoDetail, } from "../idb/types";
import { createHumanMessage, encloseWithDefaultRequrement } from "./system";

export function getMessages(convoDetail: ConvoDetail){

  let mssg = [ ...convoDetail.data ]
  if(mssg[0].role !== 'system'){
    mssg.unshift({
      id: new Date().toISOString(),
      role: 'system',
      content: '',
      lastUpdate: new Date()
    }) 
  }

  const messages = mssg.map((v: ConvoData) => {

    if(v.role === 'user'){
      console.log('user message object', v)
      console.log('user message', createHumanMessage(v.content, v.attachments, v.embeddings))
    }

    return v.role === 'system' ? 
      new SystemMessage({ 
        content: encloseWithDefaultRequrement(v.content),
        id: v.id,
      }) :
      v.role === 'user' ? 
      new HumanMessage({ 
        content: createHumanMessage(v.content, v.attachments, v.embeddings),
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