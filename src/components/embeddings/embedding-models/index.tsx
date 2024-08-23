'use client'
import { useEffect, useMemo, useState } from "react"
import { getAllProvider } from "@/lib/idb/gpt/getAllProvider"
import { GPTProvider } from "@/lib/idb/types"
import { Select } from "@/components/ui/input"
import styles from './style.module.css'

export function EmbeddingModels({ disabled }:{ disabled?: boolean }){

  const [ loading, setLoading ] = useState(true)
  const [ providers, setProviders ] = useState<GPTProvider[]>([])

  useEffect(() => {
    getAllProvider().then(v => {
      setProviders(v)
      setLoading(false)
    })
  },[])

  const hasOllama = useMemo(() => {
    return providers.find(v => v.id === 'ollama')
  }, [ providers ])

  const hasGemini = useMemo(() => {
    return providers.find(v => v.id === 'gemini')
  }, [ providers ])

  return loading ? <p className={styles.p}>Loading Providers...</p> 
  
  : providers.length && (hasOllama || hasGemini) ? <Select 
    label="Embedding Model"
    disabled={disabled}
    required name="model">
    <option value=""></option>
    {hasOllama ? <>
      <option value="ollama/nomic-embed-text">ollama / nomic-embed-text</option>
      <option value="ollama/mxbai-embed-large">ollama / mxbai-embed-large</option>
      <option value="ollama/all-minilm">ollama / all-minilm</option>
      <option value="ollama/snowflake-arctic-embed">ollama / snowflake-arctic-embed</option>
      <option value="ollama/bge-m3">ollama / bge-m3</option>
      <option value="ollama/bge-large">ollama / bge-large</option>
      <option value="ollama/paraphrase-multilingual">ollama / paraphrase-multilingual</option>
    </> : null}
    {hasGemini ? <>
      <option value="gemini/text-embedding-004">gemini / text-embedding-004</option>
    </> : null}
  </Select> 
  
  : <p className={styles.pRed}>
    Need Ollama or Gemini to embed
    <input type="text" required style={{display: 'none'}} name="model" />
  </p>

}