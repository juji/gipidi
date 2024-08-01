import { useConvo } from "@/lib/convoStore"
import { useEffect, useMemo, useRef } from "react"

import { ChatFn, GetClientFromProvider } from "@/lib/vendors/types"
import { useGPT } from "@/lib/gptStore"
import { GPTProvider } from "@/lib/idb/types"
import { showError } from "../toast"

export function useGptListener(){

  const chat = useRef<ChatFn|null>(null)
  const getClientFromProvider = useRef<GetClientFromProvider|null>(null)
  const provider = useRef<GPTProvider|null>(null)
  const isWaitingReply = useConvo(s => s.isWaitingReply)
  const activeConvo = useConvo(s => s.activeConvo)
  const addGPTText = useConvo(s => s.addGPTText)
  const providers = useGPT(s => s.providers)

  const currentProvider = useMemo(() => activeConvo?.provider, [ activeConvo?.provider ])
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
        },
        (e) => {
          console.error(e)
          showError(e.message)
        }
      )

    },100)

    return () => {
      int && clearInterval(int)
    }

  },[ activeConvo, isWaitingReply ])
  

  return null

}