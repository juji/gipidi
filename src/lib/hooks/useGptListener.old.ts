import { useConvo } from "@/lib/convoStore"
import { useEffect, useMemo, useRef } from "react"
import { useGPT } from "@/lib/gptStore"
import { showError } from "../toast"

import { loadVendor } from '@/lib/vendors/load'

export function useGptListener(){

  const isWaitingResponse = useConvo(s => s.isWaitingResponse)
  const activeConvo = useConvo(s => s.activeConvo)
  const addGPTText = useConvo(s => s.addGPTText)
  const setStreaming = useConvo(s => s.setStreaming)
  const setStopSignal = useConvo(s => s.setStopSignal)
  const setInputAvailable = useConvo(s => s.setInputAvailable)
  const providers = useGPT(s => s.providers)
  const attachmentReady = useConvo(s => s.attachmentReady)

  const loadedVendor = useRef<null|any>(null)

  function startChat(){

    loadedVendor.current.chat({
      convoDetail: activeConvo,
      onResponse: (str: string, end?: boolean) => {
        addGPTText(str)
        if(end) {
          addGPTText('')
          setStreaming(false)
          loadedVendor.current = false
          setStopSignal(null)
        }
      },
      onError: (e: Error) => {
        console.error(e)
        if(e.message.match('aborted')){
          addGPTText('')
          setStreaming(false)
          loadedVendor.current = false
        }else{
          showError(e.message)
          addGPTText(' [ERROR]')
          setStreaming(false)
          loadedVendor.current = false
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
      loadedVendor.current = false
    })
  }

  useEffect(() => {
    if(attachmentReady && loadedVendor.current){
      startChat()
    }
  },[attachmentReady])

  useEffect(() => {

    if(!activeConvo || !isWaitingResponse) return;
    if(loadedVendor.current) return;

    const currentProvider = activeConvo.provider
    const provider = providers.find(v => v.id === currentProvider)
    if(!provider) {
      loadedVendor.current = null
      return () => {}
    }

    // when starting, 
    // we set this two
    // but, the input will be enabled when the UI finish rendering the text
    // see: src/components/chat/bubble/useTextStream.ts
    setStreaming(true)
    setInputAvailable(false)

    loadVendor(provider).then(vendor => {
      addGPTText('')
      loadedVendor.current = vendor
      if(attachmentReady) startChat()
    })

  },[ 
    providers, 
    activeConvo?.provider, 
    isWaitingResponse,
  ])

  return null

}