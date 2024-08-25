'use client'
import { useEffect, useState } from 'react'
import styles from './style.module.css'
import { useGoogleSearchStore } from '@/lib/googleSearchStore'
import { searchGoogle } from '@/lib/search-google'
import { Input } from '@/components/ui/input'

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
    if(!id || !apiKey) return;

    searchGoogle('awesome', id, apiKey)
      .then(res => {
        set(id, apiKey)
      }).catch(e => {
        console.error('google search error', e)
      })

  },[ id, apiKey ])

  return <div className={styles.gs}>
    <h4>Google Search API</h4>
    <p className={styles.desc}>
      Checkout the <a className={styles.link} href="https://programmablesearchengine.google.com/" target="_blank">page</a>.
      Also, the <a className={styles.link} href="https://developers.google.com/custom-search/v1/introduction" target="_blank">docs</a>.
    </p>
    
    <Input label="Search engine ID"
      type="text" 
      placeholder='Search engine ID'
      onInput={(e) => setId((e.target as HTMLInputElement).value)}
    />

    <Input label="API Key"
      type="text" 
      placeholder='Custom Search JSON Api Key'
      onInput={(e) => setApiKey((e.target as HTMLInputElement).value)}
    />
    
  </div>

}