import { useConvo } from "@/lib/convoStore"
import { useEffect, useRef, useState } from "react"

import { ChatFn, GetClientFromProvider } from "@/lib/vendors/types"
import { useGPT } from "@/lib/gptStore"
import { GPTProvider } from "@/lib/idb/types"

export function useGptListener(){

  const chat = useRef<ChatFn|null>(null)
  const getClientFromProvider = useRef<GetClientFromProvider|null>(null)
  const provider = useRef<GPTProvider|null>(null)
  const currentProvider = useConvo(s => s.currentProvider)
  const isWaitingReply = useConvo(s => s.isWaitingReply)
  const activeConvo = useConvo(s => s.activeConvo)
  const addGPTText = useConvo(s => s.addGPTText)
  const providers = useGPT(s => s.providers)

  useEffect(() => {
    
    if(!currentProvider) {
      chat.current = null
      provider.current = null  
      getClientFromProvider.current = null
      return () => {}
    }

    provider.current = providers.find(v => v.id === currentProvider) || null
    import(`@/lib/vendors/${currentProvider}`).then(v => {
      chat.current = v.chat
      getClientFromProvider.current = v.getClientFromProvider
    }).catch(e => {
      console.error(e)
    })

  },[ currentProvider, providers ])

  useEffect(() => {
    if(!activeConvo || !isWaitingReply) return;

    const int = setInterval(() => {
      if(!provider.current) return;
      if(!chat.current) return;
      if(!getClientFromProvider.current) return;

      clearInterval(int)
      const client = getClientFromProvider.current(provider.current)
      
      addGPTText('', false)
      chat.current(
        client,
        activeConvo,
        (str: string, end?: boolean) => {
          addGPTText(str, end)
        }
      )

    },100)

    return () => {
      int && clearInterval(int)
    }

  },[ activeConvo, isWaitingReply ])
  

  return null

}