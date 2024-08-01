import { useEffect, useRef, useState } from "react";



export function useTypeWriter( initial?: string ){

  const [ text, setText ] = useState(initial||'')
  const [ result, setResult ] = useState('')

  const t = useRef('')
  useEffect(() => {
    if(!text) return () => {}

    const to = setInterval(() => {
      if(t.current.length === text.length) {
        to && clearInterval(to)
        return setResult( t.current );
      }
      t.current = text.substring(0, t.current.length + 1) 
      setResult( t.current )
    },20)

    return () => {
      to && clearInterval(to)
    }
  },[ text ])

  return { result, setText }

}