import { useEffect, useRef, useState } from "react";



export function useTypeWriter( initial?: string ){

  const [ text, setText ] = useState(initial||'')
  const [ result, setResult ] = useState('')

  const t = useRef('')
  useEffect(() => {
    if(!text) return () => {}

    let stop = false
    requestAnimationFrame(function animate(){
      if(stop) return;
      if(t.current.length === text.length){
        return setResult( t.current );
      }
      t.current = text.substring(0, t.current.length + 1) 
      setResult( t.current )
      requestAnimationFrame(animate)
    })

    return () => {
      stop = true
    }
  },[ text ])

  return { result, setText }

}