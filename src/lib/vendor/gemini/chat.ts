import { Content, GoogleGenerativeAI } from "@google/generative-ai";
import { ConvoData, GenericSetting } from "../../idb/types";
import { ChatFnParams } from "../types";
import { getMessages } from "../getMessages";

export async function chat({
  convoDetail,
  onResponse,
  onError,
  onStopSignal,
  provider
}: ChatFnParams){

  
  try{
    
    const apiKey = (provider.setting as GenericSetting).apiKey
    const gemini = new GoogleGenerativeAI( apiKey )

    let stopped = false
    onStopSignal && onStopSignal(() => {
      stopped = true
    })

    const messages = getMessages(convoDetail)

    if(messages.at(0)?._getType() !== 'system') throw new Error('System message is gone')

    const systemInstruction = messages.at(0)?.content as string
    const last = messages.findLast(v => v._getType() === 'human')
    if(!last) throw new Error('User message is empty')
    
    // remove current gpt and human messages
    const history = messages.slice(1,-2).filter(v => v._getType() === 'human' || v._getType() === 'ai')
    
    const isGemini1 = 'gemini-1.0-pro' === convoDetail.model

    const convoDetailById = convoDetail.data.reduce((a,b) => {
      a[b.id] = b
      return a
    },{} as {[key:string]: ConvoData})

    const model = gemini.getGenerativeModel({ 
      model: convoDetail.model,
      ...isGemini1 ? {} : {
        systemInstruction
      }
    })
    
    
    const chat = model.startChat({ 
      history: history.map((v, i) => ({
        role: v._getType() === 'human' ? 'user' : 'model',
        parts: [
          ...!i && isGemini1 ? [{ text: systemInstruction }] : [],
          { text: v.content as string },
          ...v.id ? convoDetailById[v.id].attachments?.map(atta => ({
            inlineData: {
              mimeType: atta.mime,
              data: atta.data,
              },
            })) || [] : []
        ],
      }) as Content) 
    });


    const attachment = convoDetailById[last.id||''].attachments?.map(atta => ({
        inlineData: {
          mimeType: atta.mime,
          data: atta.data,
        },
      })) || []

    const result = await chat.sendMessageStream(
      attachment && attachment.length ? [
        last.content as string,
        ...attachment as any
      ] : last.content as string)

    let next = await result.stream.next()
    while(next.value){
      if(stopped) result.stream.throw('stopped')
      onResponse(next.value.text() || '')
      next = await result.stream.next()
    }
    onResponse('', true)

  }catch(e){
    onError(e)
  }


}