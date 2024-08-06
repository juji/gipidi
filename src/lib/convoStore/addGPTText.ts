import { nanoid } from "nanoid";
import { Get, Set } from ".";
import { updateConvoDetail } from "../idb/convo/updateConvoDetail";

export function addGPTText(set: Set, get: Get){
  
  return async ( text: string ) => {

    const { activeConvo } = get()
  
    if(!activeConvo) throw new Error(
      'activeConvo is empty when adding userText'
    )

    const last = activeConvo.data.at(-1)
    const lastIndex = activeConvo.data.length - 1

    // update db with the last data
    updateConvoDetail(activeConvo)

    // set new data to the state
    set(state => {
      
      if(state.activeConvo){
        if(last?.role === 'assistant'){
          state.activeConvo.data[lastIndex].content += text
          state.activeConvo.data[lastIndex].lastUpdate = new Date()
        }else{
          state.activeConvo.data.push({
            id: nanoid(),
            lastUpdate: new Date(),
            role: 'assistant',
            content: text
          })
        }
      }

      state.isInitializing = false
    })

  }



}
