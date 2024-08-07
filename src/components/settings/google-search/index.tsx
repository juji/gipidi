'use client'
import { useEffect, useState } from 'react'
import styles from './style.module.css'
import { useGoogleSearchStore } from '@/lib/googleSearchStore'

export function GoogleSearch(){

  const [ id, setId ] = useState('')
  const [ apiKey, setApiKey ] = useState('')
  const set = useGoogleSearchStore(s => s.set)
  const data = useGoogleSearchStore(s => s.data)
  const loading = useGoogleSearchStore(s => s.loading)

  useEffect(() => {
    if(loading) return () => {}
    data?.apiKey && setApiKey(data?.apiKey)
    data?.id && setId(data?.id)
  },[ loading ])

  useEffect(() => {
    if(!data || data.apiKey !== apiKey)
      set(id, apiKey)
  },[ apiKey ])

  useEffect(() => {
    if(!data || data.id !== id)
      set(id, apiKey)
  },[ id ])

  return <div className={styles.gs}>
    <h4>Google Search API</h4>
    <p className={styles.desc}>
      Checkout the <a className={styles.link} href="https://programmablesearchengine.google.com/" target="_blank">page</a>.
      Also, the <a className={styles.link} href="https://developers.google.com/custom-search/v1/introduction" target="_blank">docs</a>.
    </p>
    <div className={styles.form}>
      <label className={styles.label}>
        <span className={styles.info}>Search engine ID</span>
        <input type="text" 
          className={styles.input}
          placeholder='Search engine ID'
          onInput={(e) => setId((e.target as HTMLInputElement).value)}
        />
      </label>
    </div>

    <div className={styles.form}>
      <label className={styles.label}>
        <span className={styles.info}>API Key</span>
        <input type="text" 
          className={styles.input}
          placeholder='Custom Search JSON Api Key'
          onInput={(e) => setApiKey((e.target as HTMLInputElement).value)}
        />
      </label>
    </div>
    
  </div>

}