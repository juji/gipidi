'use client'
import { ChangeEvent, useEffect, useState } from "react";
import styles from './style.module.css'
import type { GenericSetting, GPTProvider, OllamaSetting } from "@/lib/idb/types";
import type { GPTModel } from "@/lib/vendors/types";
import { titleCase } from 'title-case'
import { useGPT } from "@/lib/gptStore";

import { 
  list as ollamaList,
  getClient as getOllamaClient
} from "@/lib/vendors/ollama";

import { 
  list as groqList,
  getClient as getGroqClient
} from "@/lib/vendors/groq";

import { ls } from "@/lib/local-storage";

export function DefaultModel(){

  const [ defaultModel, setDefaultModel ] = useState(ls.getDefaultModel()||'')
  const [ defaultProvider, setDefaultProvider ] = useState<GPTProvider['id']|''>(ls.getDefaultProvider()||'')
  const [ models, setModels ] = useState<GPTModel[]>([])
  const providers = useGPT(s => s.providers)
  const loading = useGPT(s => s.loading)

  function changeDefaultProvider(e: ChangeEvent<HTMLSelectElement>){
    ls.saveDefaultProvider(e.target.value as GPTProvider['id'])
    setDefaultProvider(e.target.value as GPTProvider['id'])
  }

  function changeDefaultModel(e: ChangeEvent<HTMLInputElement>){
    ls.saveDefaultModel(e.target.value)
    setDefaultModel(e.target.value)
  }

  useEffect(() => {
    if(loading) return () => {}
    if(!defaultProvider) {
      setModels([])
      return () => {}
    }

    const provider = providers.find(v => v.id === defaultProvider)
    if(defaultProvider === 'ollama'){

      const setting = provider?.setting as OllamaSetting
      setting && ollamaList(getOllamaClient(setting.url)).then(l => {
        console.log('models', l)
        setModels(l)
      })

    }else if(defaultProvider === 'groq'){

      const setting = provider?.setting as GenericSetting
      setting && groqList(getGroqClient(setting.apiKey)).then(l => {
        console.log('models', l)
        setModels(l)
      })
    }
    
  },[ defaultProvider, loading ])

  return <>
    <h6 className={styles.heading}>
      Default Model
    </h6>
    <div className={styles.form}>
      <label className={styles.label}>
        <span className={styles.info}>Provider</span>
        <select
          className={styles.select}
          value={defaultProvider}
          onChange={changeDefaultProvider}
        >
          <option value="">Select Provider</option>
          {providers.map(v => {
            return <option key={v.id} value={v.id}>{titleCase(v.id)}</option>
          })}
        </select>
      </label>
      <label className={styles.label}>
        <span className={styles.info}>Model</span>
        <input
          className={styles.input}
          type="text"
          list="modelsselection"
          value={defaultModel}
          onChange={changeDefaultModel}
        />
        <datalist id="modelsselection">
          {models.map(v => {
            return <option key={v.id} value={v.id}>{v.name}</option>
          })}
        </datalist>
      </label>
    </div>
  </>

}