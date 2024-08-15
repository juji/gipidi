import { useRef, useState } from "react";
import { convert } from './marked';
import { useConvo } from "@/lib/convoStore";


export function useTextStream(): [ s: string, t: (s: string) => void]{

  const text = useRef<string>('')
  const current = useRef<string>('')
  const [ result, setResult ] = useState('')
  const started = useRef(false)
  const setInputAvailable = useConvo(s => s.setInputAvailable)
  
  const inputAvailTo = useRef<ReturnType<typeof setTimeout>|null>(null)

  function setText(str: string){
    text.current = str
    if(inputAvailTo.current) clearTimeout(inputAvailTo.current)
    setInputAvailable(false)
    start()
  }

  function start(){
    if(started.current) return;
    if(!text.current) return;
    started.current = true

    requestAnimationFrame(function addText(){
      if(current.current === text.current){
        started.current = false
        inputAvailTo.current = setTimeout(() => {
          setInputAvailable(true)
        },500)
        return;
      }

      current.current = text.current.substring(0,current.current.length+64)
      convert(current.current).then(v => {
        setResult(v)
        started.current = false
        setTimeout(() => start(), 1) // to make lighter load, lesser error
      }).catch(e => {
        console.error('Error from convert')
        console.error(e)
        started.current = false
        setTimeout(() => start(), 1)
      })
    })
  }

  return [ result, setText ]

}