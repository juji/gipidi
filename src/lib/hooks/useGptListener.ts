import { useConvo } from "@/lib/convoStore"
import { useEffect } from "react"
import { useGPT } from "@/lib/gptStore"
import { showError } from "../toast"

import { loadVendor } from '@/lib/vendors/load'

export function useGptListener(){

  const isWaitingReply = useConvo(s => s.isWaitingReply)
  const activeConvo = useConvo(s => s.activeConvo)
  const addGPTText = useConvo(s => s.addGPTText)
  const providers = useGPT(s => s.providers)

  useEffect(() => {

    if(!activeConvo || !isWaitingReply) return;

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
          if(stop) return;
          if(!text) {
            started = false
            return;
          }
          addGPTText(text[0], text.length === 1 && ended)
          text = text.slice(1)
          if(text) requestAnimationFrame(addText)
          else started = false
        })
      }
      
      addGPTText(text, false)
      vendor.chat({
        convoDetail: activeConvo,
        onResponse: (str: string, end?: boolean) => {
          text += str||''
          ended = !!end
          start()
        },
        onError: (e) => {
          stop = true
          console.error(e)
          showError(e.message)
          addGPTText(' [ERROR]', true)
        }
      })

    })

  },[ 
    providers, 
    activeConvo, 
    isWaitingReply 
  ])

  return null

}