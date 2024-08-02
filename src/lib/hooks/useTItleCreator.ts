import { useEffect, useMemo, useRef } from "react";
import { useConvo } from "@/lib/convoStore";
import { useGPT } from "@/lib/gptStore";
import { useTypeWriter } from '@/lib/hooks/useTypeWriter'

export function useTitleCreator(){

  const isStreaming = useConvo(s => s.isStreaming)
  const isWaitingReply = useConvo(s => s.isWaitingReply)
  const activeConvo = useConvo(s => s.activeConvo)
  const convos = useConvo(s => s.convos)
  const loading = useConvo(s => s.loading)
  const providers = useGPT(s => s.providers)
  const setCurrentTitle = useConvo(s => s.setCurrentTitle)
  const { result: title, setText: setTitle } = useTypeWriter('')
  
  // prevent overflow (when many multiple updates happening)
  const convoLength = useMemo(() => (activeConvo?.data || []).length >= 2,[activeConvo?.data])
  const currentTitle = useMemo(() => {
    if(loading) return 'a'
    if(!activeConvo?.id) return 'a'
    const convo = convos.find(v => v.id === activeConvo.id)
    return convo?.title
  },[activeConvo?.id, convos, loading])

  const canceled = useRef(false)
  const createTitle = useMemo(() => {
    return !!(
      convoLength && 
      !isWaitingReply && 
      !isStreaming &&
      !currentTitle
    )
  }, [ convoLength, isStreaming, isWaitingReply, currentTitle ])

  async function createTitleFn(){
    
    if(!activeConvo) return;
    const convo = convos.find(v => v.id === activeConvo.id)
    if(convo?.title) return;

    console.debug('CREATING TITLE')
    const currentProvider = activeConvo.provider
    const provider = providers.find(v => v.id === currentProvider) || null

    const {
      createTitle,
      getClientFromProvider
    } = await import(`@/lib/vendors/${currentProvider}`)
    if(canceled.current) return;
    
    const client = getClientFromProvider(provider)
    const title = await createTitle(client, activeConvo)
    if(canceled.current) return;
    
    setTitle(title)

  }

  useEffect(() => {
    if(!activeConvo) return;
    if(!createTitle) {
      canceled.current = true
      return;
    }

    canceled.current = false
    setTimeout(() => {
      if(canceled.current) return;
      createTitleFn()
    },5000)

  },[ createTitle ])
  
  useEffect(() => {
    if(!title) return () => {}
    setCurrentTitle(title)
  },[ title ])

}