'use client'
import { ChangeEvent, useEffect, useState } from "react";
import styles from './style.module.css'
import type { GPTProvider } from "@/lib/idb/types";
import type { GPTModel } from "@/lib/vendor/types";
import { titleCase } from 'title-case'
import { useGPT } from "@/lib/gptStore";
import { 
  getDefaultModel, 
  getDefaultProvider, 
  saveDefaultModel, 
  saveDefaultProvider 
} from "@/lib/local-storage";
import { Select } from '@/components/ui/input'

export function DefaultModel(){

  const [ defaultModel, setDefaultModel ] = useState(getDefaultModel()||'')
  const [ defaultProvider, setDefaultProvider ] = useState<GPTProvider['id']|''>(getDefaultProvider()||'')
  const [ models, setModels ] = useState<GPTModel[]>([])
  const providers = useGPT(s => s.providers)
  const loading = useGPT(s => s.loading)
  const getModels = useGPT(s => s.getModels)

  function changeDefaultProvider(e: ChangeEvent<HTMLSelectElement>){
    saveDefaultProvider(e.target.value as GPTProvider['id'])
    setDefaultProvider(e.target.value as GPTProvider['id'])
  }

  function changeDefaultModel(e: ChangeEvent<HTMLSelectElement>){
    saveDefaultModel(e.target.value)
    setDefaultModel(e.target.value)
  }

  useEffect(() => {
    if(loading) return () => {}
    
    setModels([])
    if(!defaultProvider) {
      return () => {}
    }

    const provider = providers.find(v => v.id === defaultProvider)
    provider && getModels( provider ).then(models => {
      models && setModels(models)
    })
    
  },[ defaultProvider, loading ])

  return <>
    <h6 className={styles.heading}>
      Default Model
    </h6>
    <div className={styles.form}>

      <Select label="Provider" 
        value={defaultProvider}
        onChange={changeDefaultProvider}>
        <option value="">Select Provider</option>
        {providers.map(v => {
          return <option key={v.id} value={v.id}>{titleCase(v.id)}</option>
        })}
      </Select>

      <Select label="Model" 
        value={defaultModel}
        onChange={changeDefaultModel}>
        <option value="">Select Model</option>
        {models.map(v => {
          return <option key={v.id} value={v.id}>{v.name}</option>
        })}
      </Select>

    </div>
  </>

}