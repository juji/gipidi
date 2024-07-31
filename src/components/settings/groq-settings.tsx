import { useGPTStore } from "@/lib/gptStore"
import { GenericSetting } from "@/lib/idb/types"
import { getClient, list } from "@/lib/vendors/groq"
import { useEffect, useState } from "react"
import styles from './style.module.css'
import Link from "next/link"
import cx from "classix"


export function GroqSettings(){

  const [ apiKey, setApiKey ] = useState('')
  const providers = useGPTStore(s => s.providers)
  const saveProvider = useGPTStore(s => s.saveProvider)
  const removeProvider = useGPTStore(s => s.removeProvider)
  const loading = useGPTStore(s => s.loading)
  const [ isOn, setisOn ] = useState(false)
  const [ err, setErr ] = useState('')

  useEffect(() => {
    if(loading) return () => {}
    if(!providers.length) return () => {}

    const provider = providers.find(v => v.id === 'groq')
    if(!provider){
      setisOn(false)
    }else{
      const setting = provider.setting as GenericSetting
      setApiKey(setting.apiKey)
      setisOn(true)
    }
  }, [ loading, providers ])

  useEffect(() => {

    if(loading) return () => {}
    if(!apiKey) {
      removeProvider('groq')
      return () => {}
    }

    setErr('')

    list(getClient(apiKey)).then(v => {
      saveProvider('groq', { apiKey })
    }).catch(e => {
      removeProvider('groq')
      console.error(e)
      setErr(e.toString())
    })

  },[ loading, apiKey ])

  return <>
    <h6 className={styles.heading}>
      Groq
      <span className={cx(styles.indicator, isOn && styles.isOn)}></span>
      <Link className={styles.link} href="https://console.groq.com/" target="_blank" rel="noopener no referrer">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.5253 5.49475L10.5206 7.49475L15.0782 7.50541L5.47473 17.0896L6.88752 18.5052L16.5173 8.89479L16.5065 13.5088L18.5065 13.5134L18.5253 5.51345L10.5253 5.49475Z" fill="currentColor" /></svg>
      </Link>
    </h6>
    <div className={styles.form}>
      <label className={styles.label}>
        <span className={styles.info}>API Key</span>
        <input type="text" 
          className={styles.input}
          placeholder='Groq API Key'
          onInput={(e) => setApiKey((e.target as HTMLInputElement).value)}
          value={apiKey}
        />
      </label>
      {err ? <div className={styles.error}>{err}</div> : null}
    </div>
  </>

}