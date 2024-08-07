import { useRef, useState } from "react";
import { convert } from './marked';


export function useTextStream(): [ s: string, t: (s: string) => void]{

  const text = useRef<string>('')
  const current = useRef<string>('')
  const [ result, setResult ] = useState('')
  const started = useRef(false)
  
  function setText(str: string){
    text.current = str
    start()
  }

  function start(){
    if(started.current) return;
    started.current = true
    requestAnimationFrame(async function addText(){
      if(current.current === text.current){
        started.current = false
        return;
      }

      current.current = text.current.substring(0,current.current.length+2)
      convert(current.current).then(v => {
        setResult(v)
        started.current = false
        start()
      }).catch(e => {
        console.error('Error from convert')
        console.error(e)
        started.current = false
        start()
      })
    })
  }

  return [ result, setText ]

}