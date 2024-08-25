import { ChatOllama } from "@langchain/ollama";
import { OllamaSetting } from "../../idb/types";
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

    const model = new ChatOllama({
      model: convoDetail.model,
      baseUrl: (provider.setting as OllamaSetting).url,
    });
  
    let canceled = false
    onStopSignal && onStopSignal(() => {
      canceled = true
    })
  
    const stream = await model.stream(getMessages(convoDetail));
    let v = await stream.next()
    while(v){
      
      if(canceled) {
        stream.throw('canceledbyuser');
        break;
      }

      if(!v.done && v.value){
        onResponse(v.value.content as string)
        v = await stream.next()
      }else{
        break;
      }
    }
    
    onResponse('', true)

  }catch(e){
    onError(e)
  }


}