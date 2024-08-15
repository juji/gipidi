'use client'

import { test, downloadLlava } from '@/lib/langchain/ollama'
import { OllamaSetting } from "@/lib/idb/types"
import { useEffect, useRef, useState } from "react"
import styles from '../style.module.css'
import stylesDownload from './style.module.css'
import Link from "next/link"
import cx from "classix"
import { useGPT } from "@/lib/gptStore"

const PROVIDER = 'ollama'

export function OllamaSettings(){

  const [ url, setUrl ] = useState('')
  const loading = useGPT(s => s.loading)
  const providers = useGPT(s => s.providers)

  const saveProvider = useGPT(s => s.saveProvider)
  const removeProvider = useGPT(s => s.removeProvider)
  const [ isOn, setisOn ] = useState(false)
  const [ err, setErr ] = useState('')

  useEffect(() => {
    if(loading) return () => {}
    if(!providers.length) {
      setUrl('http://localhost:11434')
      return () => {}
    }

    const provider = providers.find(v => v.id === PROVIDER)
    if(!provider) {
      setUrl('http://localhost:11434')
    }
    else{
      const setting = provider.setting as OllamaSetting
      setUrl(setting.url)
    }
  },[ loading, providers ])

  const [downloadingLlava, setDownloadingLlava] = useState<any|null>(false)
  useEffect(() => {
    if(loading) return () => {}
    if(!url) {
      setisOn(false)
      setErr('URL is empty')
      return () => {}
    }
    
    setisOn(false)
    setErr('')

    test(url).then(async models => {
      
      saveProvider(PROVIDER, { url })
      setisOn( true )
      const res = await downloadLlava(models, url)
      setDownloadingLlava(res)

    }).catch((e:any) => {
      removeProvider(PROVIDER)
      console.error(e)
      setErr(e.toString())
    })

  },[ url, loading ])

  // downloading llava model to enable images in Chat
  // this works when gemini is not around. But it will be slower.
  const progressRef = useRef<HTMLDivElement|null>(null)
  const downloading = useRef(false)
  const [ llavaStatus, setLlavaStatus ] = useState('')
  async function getLlavaProgress(){
    if(!downloadingLlava) return;
    if(downloading.current) return;
    downloading.current = true


    if(downloadingLlava) {
      for await (let progress of downloadingLlava){
        
        // this will keep downloading even if we change page.
        // therefore,
        if(!progressRef.current) return;

        setLlavaStatus('Downloading Llava: ' + progress.status)
        if(progressRef.current){
          progressRef.current.style.width = Math.min(
            100,
            Math.round(100 * progress.completed / progress.total)
          ) + '%'
        }

      }
      if(progressRef.current) progressRef.current.style.width = '100%'
      setLlavaStatus('Downloaded: llava-llama3:latest')
      downloading.current = false
    }else{
      if(progressRef.current) progressRef.current.style.width = '100%'
      setLlavaStatus('Downloaded: llava-llama3:latest')
      downloading.current = false
    }
  }

  useEffect(() => {
    if(!downloadingLlava) return () => {};
    getLlavaProgress()
  },[ downloadingLlava ])

  return <>
    <h6 className={styles.heading}>
      Ollama
      <span className={cx(styles.indicator, isOn && styles.isOn)}></span>
      <Link className={styles.link} href="https://ollama.com/" target="_blank" rel="noopener noreferrer">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.5253 5.49475L10.5206 7.49475L15.0782 7.50541L5.47473 17.0896L6.88752 18.5052L16.5173 8.89479L16.5065 13.5088L18.5065 13.5134L18.5253 5.51345L10.5253 5.49475Z" fill="currentColor" /></svg>
      </Link>
    </h6>
    <div className={styles.form}>
      <label className={styles.label}>
        <span className={styles.info}>Url</span>
        <input type="text" 
          className={styles.input}
          placeholder='Ollama URL'
          onInput={(e) => setUrl((e.target as HTMLInputElement).value)}
          value={url}
        />
      </label>
      <div className={stylesDownload.download}>
        <div className={stylesDownload.downloadProgress}>
          <div ref={progressRef}></div>
        </div>
        <div className={stylesDownload.downloadInfo}>{llavaStatus}</div>
      </div>
      {err ? <div className={styles.error}>{err}</div> : null}
    </div>
  </>

}