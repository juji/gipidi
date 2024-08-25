
import { createConvo as create } from '../idb/convo/createConvo'
import { ConvoAttachment } from '../idb/types'
import type { Set, Get } from './'

export function createConvo(set: Set, get: Get){

  return async ( initialContent: string, files: ConvoAttachment[] ) => {

    const { createChatListener } = get()

    if(!createChatListener)
      throw new Error('Cannot create convo without createChatListener')

    const {
      title, provider, model, systemPrompt, icon, embeddingId
    } = createChatListener()

    if(!provider)
      throw new Error('Cannot create convo with empty provider')
    if(!model)
      throw new Error('Cannot create convo with empty model')
    if(!initialContent)
      throw new Error('Cannot create convo with empty initialContent')

    let embeddings = undefined

    const {
      convo,
      convoDetail
    } = await create(
      initialContent,
      provider,
      icon,
      model,
      embeddingId,
      embeddings,
      files.length ? files : undefined,
      systemPrompt || '',
      title || ''
    )

    set(state => {
      state.convos.unshift(convo)
      state.activeConvo = convoDetail
      state.isWaitingResponse = true
    })

  }

}