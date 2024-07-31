
import { createConvo as create } from '../idb/convo/createConvo'
import type { Set, Get } from './'

export function createConvo(set: Set, get: Get){

  return async ( initialContent: string ) => {

    const {
      currentProvider, 
      currentModel, 
      currentSystemPrompt,
      currentTitle
    } = get()

    if(!currentProvider)
      throw new Error('Cannot create convo with empty provider')
    if(!currentModel)
      throw new Error('Cannot create convo with empty model')
    if(!initialContent)
      throw new Error('Cannot create convo with empty initialContent')

    const {
      convo,
      convoDetail
    } = await create(
      initialContent,
      currentProvider,
      currentModel,
      currentSystemPrompt || '',
      currentTitle || ''
    )

    set(state => {
      state.convos.unshift(convo)
      state.activeConvo = convoDetail
      state.isWaitingReply = true
    })

  }

}