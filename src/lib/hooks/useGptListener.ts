import { useConvo } from "@/lib/convoStore"
import { useEffect, useRef } from "react"
import { useGPT } from "@/lib/gptStore"
import { showError } from "../toast"

import { chat } from '@/lib/vendor/loader'
import { GPTProvider } from "../idb/types"

export function useGptListener(){

  const isWaitingResponse = useConvo(s => s.isWaitingResponse)
  const activeConvo = useConvo(s => s.activeConvo)
  const addGPTText = useConvo(s => s.addGPTText)
  const setStreaming = useConvo(s => s.setStreaming)
  const setStopSignal = useConvo(s => s.setStopSignal)
  const setInputAvailable = useConvo(s => s.setInputAvailable)
  const providers = useGPT(s => s.providers)

  // to wait for attachments
  // and embeddings
  const allReady = useConvo(s => s.allReady)
  const currentProvider = useRef<GPTProvider|null>(null)

  useEffect(() => {
    if(allReady && currentProvider.current){
      const provider = currentProvider.current
      currentProvider.current = null
      startChat(provider)
    }
  },[ allReady ])

  function startChat(provider: GPTProvider){

    if(!activeConvo) return;

    console.log('activeConvo startChat', activeConvo)

    chat({
      provider, 
      convoDetail: activeConvo,
      
      onResponse: (str: string, end?: boolean) => {
        addGPTText(str)
        if(end) {
          addGPTText('')
          setStreaming(false)
          setStopSignal(null)
        }
      },
      onError: (e: Error) => {
        console.error(e)
        if(e.message.match('aborted')){
          addGPTText('')
          setStreaming(false)
        }else{
          showError(e.message)
          addGPTText(' [ERROR]')
          setStreaming(false)
          setStopSignal(null)
        }
      },
      onStopSignal: (fn: () => void) => {
        setStopSignal(fn)
      }

    }).catch((e: Error) => {
      console.error(e)
      showError(e.message)
      addGPTText(' [INITIALIZATION ERROR]')
      setStreaming(false)
      setStopSignal(null)
      setInputAvailable(true)
    })
  }

  useEffect(() => {

    if(activeConvo?.id && providers.length && isWaitingResponse){

      currentProvider.current = null 
      const provider = providers.find(v => v.id === activeConvo.provider)
      if(!provider) {
        showError('Provider is undefined')
        return () => {}
      }

      // when starting, 
      // we set this two
      // but, the input will be enabled when the UI finish rendering the text
      // see: src/components/chat/bubble/useTextStream.ts
      setStreaming(true)
      setInputAvailable(false)

      // initial gpt text 
      // to show the gpt avatar with loader
      addGPTText('') 

      if(allReady) startChat(provider)
      else {
        currentProvider.current = provider
      }
    }

  },[activeConvo?.id, providers.length, isWaitingResponse])

  return null

}