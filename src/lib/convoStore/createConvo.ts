
import { createConvo as create } from '../idb/convo/createConvo'
import type { Set, Get } from './'

export function createConvo(set: Set, get: Get){

  return async ( initialContent: string ) => {

    const { createChatListener } = get()

    if(!createChatListener)
      throw new Error('Cannot create convo without createChatListener')

    const {
      title, provider, model, systemPrompt
    } = createChatListener()

    if(!provider)
      throw new Error('Cannot create convo with empty provider')
    if(!model)
      throw new Error('Cannot create convo with empty model')
    if(!initialContent)
      throw new Error('Cannot create convo with empty initialContent')

    const {
      convo,
      convoDetail
    } = await create(
      initialContent,
      provider,
      model,
      systemPrompt || '',
      title || ''
    )

    set(state => {
      state.convos.unshift(convo)
      state.activeConvo = convoDetail
      state.isWaitingReply = true
    })

  }

}