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

      let text = ''
      let ended = false
      let started = false
      let stop = false
      function start(){
        if(started) return;
        started = true
        requestAnimationFrame(function addText(){
          if(stop) {
            addGPTText('') // add empty string to commit the last string to db
            setDoneStreaming()
            return;
          }
          if(!text.length) {
            started = false
            addGPTText('')
            setDoneStreaming()
            return;
          }

          addGPTText(text[0])
          text = text.slice(1)
          if(text.length) requestAnimationFrame(addText)
          else {
            started = false
            addGPTText('')
            setDoneStreaming()
          }
        })
      }
      
      addGPTText('')
      vendor.chat({
        convoDetail: activeConvo,
        onResponse: (str: string, end?: boolean) => {
          text += str
          ended = !!end
          // addGPTText(str, !!end)
          start()
        },
        onError: (e) => {
          stop = true
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