import { useConvo } from "@/lib/convoStore"
import { useEffect } from "react"
import { useGPT } from "@/lib/gptStore"
import { showError } from "../toast"

import { loadVendor } from '@/lib/vendors/load'

export function useGptListener(){

  const isInitializing = useConvo(s => s.isInitializing)
  const activeConvo = useConvo(s => s.activeConvo)
  const addGPTText = useConvo(s => s.addGPTText)
  const setDoneStreaming = useConvo(s => s.setDoneStreaming)
  const providers = useGPT(s => s.providers)

  useEffect(() => {

    if(!activeConvo || !isInitializing) return;

    const currentProvider = activeConvo.provider
    const provider = providers.find(v => v.id === currentProvider)
    if(!provider) return () => {}

    loadVendor(provider).then(vendor => {
      
      addGPTText('')
      vendor.chat({
        convoDetail: activeConvo,
        onResponse: (str: string, end?: boolean) => {
          addGPTText(str)
          if(end) {
            addGPTText('')
            setDoneStreaming()
          }
        },
        onError: (e) => {
          console.error(e)
          showError(e.message)
          addGPTText(' [ERROR]')
          setDoneStreaming()
        }
      })

    })

  },[ 
    providers, 
    activeConvo, 
    isInitializing 
  ])

  return null

}