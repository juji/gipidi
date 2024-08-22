'use client'
import { useEffect, useState } from "react"
import { Status } from "./status"
import { downloadModel } from "@/lib/vendor/ollama"
import { getGPTProvider } from "@/lib/idb/gpt/getGPTProvider"
import { GPTProvider, OllamaSetting } from "@/lib/idb/types"

export function DownloadModel({ 
  vendor, 
  model,
  onSuccess,
}:{ 
  vendor: string, 
  model: string,
  onSuccess: () => void 
}){

  const [ percentage, setPercentage ] = useState(0)
  const [ status, setStatus ] = useState('')
  const [ error, setError ] = useState(false)

  async function downloadEmbeddingModel(){
    const provider = await getGPTProvider(vendor as GPTProvider['id'])
    const download = await downloadModel(model, (provider.setting as OllamaSetting).url)

    if(download){

      try{
        for await (let progress of download){
          let perc = Math.min(
            100,
            Math.round(100 * progress.completed / progress.total)
          )
          perc = perc ? perc - 1 : 0 // prevent 100
          setStatus(progress.status)
          setPercentage(perc)
        }
  
        setStatus(`Downloaded: ${model}`)
        setPercentage(100)
        onSuccess()
      }catch(e){
        setStatus((e as Error).toString())
        setError(true)
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
      downloadEmbeddingModel()
    }
    else{
      throw new Error(`unknown vendor: ${vendor}`)
    }
  },[ vendor, model ])

  return <Status
    text="Downloading Embedding Model"
    percentage={percentage}
    status={status}
    isError={error}
  />

}