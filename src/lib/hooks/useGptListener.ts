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
  const attachmentReady = useConvo(s => s.attachmentReady)

  function startChat(provider: GPTProvider){

    if(!activeConvo) return;

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

      // initial gpt text to show the bot avatar
      // with loader
      addGPTText('') 

      if(attachmentReady) startChat(provider)
      else onAttachmentReady(() => {
        startChat(provider)
      })
    }
  },[activeConvo?.id, providers.length, isWaitingResponse])

  const whenAttachmentReady = useRef<(() => void)|null>(null)
  function onAttachmentReady(fn: () => void){
    whenAttachmentReady.current = fn
  }

  useEffect(() => {
    if(attachmentReady && whenAttachmentReady.current){
      const fn = whenAttachmentReady.current
      whenAttachmentReady.current = null
      fn()
    }
  },[ attachmentReady ])

  return null

}