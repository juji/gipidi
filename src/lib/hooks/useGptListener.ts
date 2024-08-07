import { useConvo } from "@/lib/convoStore"
import { useEffect } from "react"
import { useGPT } from "@/lib/gptStore"
import { showError } from "../toast"

import { loadVendor } from '@/lib/vendors/load'

export function useGptListener(){

  const isInitializing = useConvo(s => s.isInitializing)
  const activeConvo = useConvo(s => s.activeConvo)
  const addGPTText = useConvo(s => s.addGPTText)
  const setStreaming = useConvo(s => s.setStreaming)
  const setInputAvailable = useConvo(s => s.setInputAvailable)
  const providers = useGPT(s => s.providers)

  useEffect(() => {

    if(!activeConvo || !isInitializing) return;

    const currentProvider = activeConvo.provider
    const provider = providers.find(v => v.id === currentProvider)
    if(!provider) return () => {}

    // when starting, 
    // we set this two
    // but, the input will be enabled when the UI finish rendering the text
    // see: src/components/chat/bubble/useTextStream.ts
    setStreaming(true)
    setInputAvailable(false)

    loadVendor(provider).then(vendor => {
      
      addGPTText('')
      vendor.chat({
        convoDetail: activeConvo,
        onResponse: (str: string, end?: boolean) => {
          addGPTText(str)
          if(end) {
            addGPTText('')
            setStreaming(false)
          }
        },
        onError: (e) => {
          console.error(e)
          showError(e.message)
          addGPTText(' [ERROR]')
          setStreaming(false)
        }
      })

    }).catch(e => {
      console.error(e)
      showError(e.message)
      addGPTText(' [ERROR]')
      setStreaming(false)
    })

  },[ 
    providers, 
    activeConvo, 
    isInitializing 
  ])

  return null

}