'use client'
import { OllamaSetting } from "@/lib/idb/types"
import { getClient, list } from "@/lib/vendors/ollama"
import { useEffect, useState } from "react"
import styles from './style.module.css'
import Link from "next/link"
import cx from "classix"
import { useGPT } from "@/lib/gptStore"


export function OllamaSettings(){

  const [ url, setUrl ] = useState('http://localhost:11434')
  const providers = useGPT(s => s.providers)
  const saveProvider = useGPT(s => s.saveProvider)
  const removeProvider = useGPT(s => s.removeProvider)
  const loading = useGPT(s => s.loading)
  const [ isOn, setisOn ] = useState(false)
  const [ err, setErr ] = useState('')

  useEffect(() => {
    if(loading) return () => {}
    if(!providers.length) return () => {}

    const provider = providers.find(v => v.id === 'ollama')
    if(!provider){
      setisOn(false)
    }else{
      const setting = provider.setting as OllamaSetting
      setUrl(setting.url)
      setisOn(true)
    }
  }, [ loading, providers ])

  useEffect(() => {

    if(loading) return () => {}
    if(!url) {
      removeProvider('ollama')
      return () => {}
    }
    setErr('')

    list(getClient(url)).then(v => {
      saveProvider('ollama', { url })
    }).catch(e => {
      removeProvider('ollama')
      console.error(e)
      setErr(e.toString())
    })

  },[ loading, url ])

  return <>
    <h6 className={styles.heading}>
      Ollama
      <span className={cx(styles.indicator, isOn && styles.isOn)}></span>
      <Link className={styles.link} href="https://ollama.com/" target="_blank" rel="noopener no referrer">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.5253 5.49475L10.5206 7.49475L15.0782 7.50541L5.47473 17.0896L6.88752 18.5052L16.5173 8.89479L16.5065 13.5088L18.5065 13.5134L18.5253 5.51345L10.5253 5.49475Z" fill="currentColor" /></svg>
      </Link>
    </h6>
    <div className={styles.form}>
      <label className={styles.label}>
        <span className={styles.info}>URL</span>
        <input type="text" 
          className={styles.input}
          placeholder='Ollama URL'
          onInput={(e) => setUrl((e.target as HTMLInputElement).value)}
          value={url}
        />
      </label>
      {err ? <div className={styles.error}>{err}</div> : null}
    </div>
  </>

}