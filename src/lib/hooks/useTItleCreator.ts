import { useEffect, useMemo, useState } from "react";
import { useConvo } from "@/lib/convoStore";
import { useGPT } from "@/lib/gptStore";
import { useTypeWriter } from '@/lib/hooks/useTypeWriter'

export function useTitleCreator(){

  const isStreaming = useConvo(s => s.isStreaming)
  const isWaitingReply = useConvo(s => s.isWaitingReply)
  const activeConvo = useConvo(s => s.activeConvo)
  const convos = useConvo(s => s.convos)
  const providers = useGPT(s => s.providers)
  const setCurrentTitle = useConvo(s => s.setCurrentTitle)
  const currentTitle = useConvo(s => s.currentTitle)
  const { result: title, setText: setTitle } = useTypeWriter('')
  
  // prevent overflow
  const convoLength = useMemo(() => (activeConvo?.data || []).length >= 2,[activeConvo?.data])
  const createTitle = useMemo(() => {
    return !!(
      convoLength && 
      !isWaitingReply && 
      !isStreaming &&
      !currentTitle
    )
  }, [ convoLength, isStreaming, isWaitingReply, currentTitle ])

  useEffect(() => {
    if(!activeConvo) return;
    if(!createTitle) return;

    const convo = convos.find(v => v.id === activeConvo.id)
    if(convo?.title) return;
    
    const currentProvider = activeConvo.provider
    const provider = providers.find(v => v.id === currentProvider) || null
    import(`@/lib/vendors/${currentProvider}`).then(v => {
      const {
        createTitle,
        getClientFromProvider
      } = v
      const client = getClientFromProvider(provider)
      createTitle(client, activeConvo).then((v: any) => {
        if(!currentTitle) setTitle(v)
      })
    }).catch(e => {
      console.error(e)
    })
  
  },[ createTitle ])
  
  useEffect(() => {
    if(!title) return () => {}
    setCurrentTitle(title)
  },[ title ])

}