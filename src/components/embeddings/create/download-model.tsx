'use client'
import { useEffect, useRef, useState } from "react"
import { Status } from "@/components/ui/status"
import { downloadModel } from "@/lib/vendor/ollama"
import { getGPTProvider } from "@/lib/idb/gpt/getGPTProvider"
import { GPTProvider, OllamaSetting } from "@/lib/idb/types"

export function DownloadModel({ 
  vendor, 
  model,
  onSuccess,
  onError,
}:{ 
  vendor: string
  model: string
  onSuccess: () => void 
  onError?: () => void
}){

  const [ percentage, setPercentage ] = useState(0)
  const [ status, setStatus ] = useState('')
  const [ error, setError ] = useState(false)

  const isDrawn = useRef(true)
  useEffect(() => () => { isDrawn.current = false },[])
  async function downloadOllamaModel(){
    const provider = await getGPTProvider(vendor as GPTProvider['id'])
    const download = await downloadModel(model, (provider.setting as OllamaSetting).url)

    if(download){

      try{
        for await (let progress of download){
          
          // when this is unmounted
          if(!isDrawn.current) continue;

          let perc = Math.min(
            100,
            Math.round(100 * progress.completed / progress.total)
          )
          perc = perc ? perc - 1 : 0 // prevent 100
          setStatus(progress.status)
          setPercentage(perc)
        }

        if(!isDrawn.current) return;
  
        setStatus(`Downloaded: ${model}`)
        setPercentage(100)
        onSuccess()
      }catch(e){
        setStatus((e as Error).toString())
        setError(true)
        onError && onError()
      }
      
    }else{
      setStatus(`Downloaded: ${model}`)
      setPercentage(100)
      onSuccess()
    }
  }

  useEffect(() => {

    if(vendor === 'gemini') {
      setPercentage(100)
      setStatus('No download needed')
      onSuccess()
    }

    else if(vendor === 'ollama'){
      downloadOllamaModel()
    }

    else{
      setStatus(`unknown vendor: ${vendor}`)
      setError(true)
    }

  },[ vendor ])

  return <Status
    text="Downloading Embedding Model"
    percentage={percentage}
    status={status}
    isError={error}
  />

}