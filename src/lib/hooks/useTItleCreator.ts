import { useEffect, useMemo, useRef } from "react";
import { useConvo } from "@/lib/convoStore";
import { useGPT } from "@/lib/gptStore";
import { useTypeWriter } from '@/lib/hooks/useTypeWriter'
import { createTitle } from '@/lib/langchain/loader'

export function useTitleCreator(){

  const isStreaming = useConvo(s => s.isStreaming)
  const isWaitingResponse = useConvo(s => s.isWaitingResponse)
  const activeConvo = useConvo(s => s.activeConvo)
  const convos = useConvo(s => s.convos)
  const loading = useConvo(s => s.loading)
  const providers = useGPT(s => s.providers)
  const setCurrentTitle = useConvo(s => s.setCurrentTitle)
  const { result: title, setText: setTitle } = useTypeWriter('')
  
  // prevent overflow (when many multiple updates happening)
  const convoLength = useMemo(() => {
    return (activeConvo?.data || []).filter(v => v.role !== 'system').length >= 2
  },[activeConvo?.data])

  const currentTitle = useMemo(() => {
    if(loading) return 'a'
    if(!activeConvo?.id) return 'a'
    const convo = convos.find(v => v.id === activeConvo.id)
    return convo?.title
  },[activeConvo?.id, convos, loading])

  const currentProvider = useMemo(() => {
    if(!providers.length) return null;
    if(!activeConvo?.provider) return null;
    const provider = providers.find(v => v.id === activeConvo?.provider)
    return provider
  },[ activeConvo?.provider, providers.length ])

  const canceled = useRef(false)
  const createTitleBool = useMemo(() => {
    return !!(
      convoLength &&
      currentProvider && 
      !isWaitingResponse && 
      !isStreaming &&
      !currentTitle
    )
  }, [ convoLength, isStreaming, isWaitingResponse, currentTitle, currentProvider ])

  async function createTitleFn(){
    
    if(!activeConvo) return;
    const convo = convos.find(v => v.id === activeConvo.id)
    if(convo?.title) return;
    if(!currentProvider) return;
    
    console.debug('CREATING TITLE')
    const title = await createTitle({ convoDetail: activeConvo, provider: currentProvider })
    if(canceled.current) return;
    
    setTitle(title)

  }

  useEffect(() => {
    if(!activeConvo) return;
    if(!createTitleBool) {
      canceled.current = true
      return;
    }

    canceled.current = false
    // wait if canceled
    setTimeout(() => {
      if(canceled.current) return;
      createTitleFn()
    },3000)

  },[ createTitleBool ])
  
  useEffect(() => {
    if(!title) return () => {}
    setCurrentTitle(title)
  },[ title ])

}