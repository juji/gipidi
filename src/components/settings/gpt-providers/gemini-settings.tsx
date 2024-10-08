'use client'
import { GenericSetting } from "@/lib/idb/types"
import { useEffect, useState } from "react"
import styles from './style.module.css'
import Link from "next/link"
import cx from "classix"
import { useGPT } from "@/lib/gptStore"
import { test } from "@/lib/vendor/gemini"
import { Input } from '@/components/ui/input'

const PROVIDER = 'gemini'

export function GeminiSettings(){

  const [ apiKey, setApiKey ] = useState('')
  const loading = useGPT(s => s.loading)
  const providers = useGPT(s => s.providers)

  const saveProvider = useGPT(s => s.saveProvider)
  const removeProvider = useGPT(s => s.removeProvider)
  const [ isOn, setisOn ] = useState(false)
  const [ err, setErr ] = useState('')

  useEffect(() => {
    if(loading) return () => {}
    if(!providers.length) return () => {}

    const provider = providers.find(v => v.id === PROVIDER)
    if(provider) {
      const setting = provider.setting as GenericSetting
      setApiKey(setting.apiKey)
    }
  },[ loading, providers ])

  useEffect(() => {
    if(loading) return () => {}
    if(!apiKey) {
      setisOn(false)
      setErr('Api key not found')
      return () => {}
    }
    
    setisOn(false)
    setErr('')

    test(apiKey).then(() => {
      saveProvider(PROVIDER, { apiKey }, '/gpt/gemini.svg')
      setisOn(true)
      setErr('')
    }).catch((e:any) => {
      removeProvider(PROVIDER)
      console.error(e)
      setErr(e.toString())
    })

  },[ apiKey, loading ])

  return <>
    <h6 className={styles.heading}>
      Gemini
      <span className={cx(styles.indicator, isOn && styles.isOn)}></span>
      <Link className={styles.link} href="https://ai.google.dev/gemini-api/docs" target="_blank" rel="noopener noreferrer">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.5253 5.49475L10.5206 7.49475L15.0782 7.50541L5.47473 17.0896L6.88752 18.5052L16.5173 8.89479L16.5065 13.5088L18.5065 13.5134L18.5253 5.51345L10.5253 5.49475Z" fill="currentColor" /></svg>
      </Link>
    </h6>
    <div className={styles.form}>

      <Input label={'API Key'} 
        type="text" 
        placeholder='Gemini API Key'
        onInput={(e) => setApiKey((e.target as HTMLInputElement).value)}
      />
      
      {err ? <div className={styles.error}>{err}</div> : null}
    </div>
  </>

}