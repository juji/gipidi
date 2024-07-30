import Link from 'next/link'
import styles from './style.module.css'
import { useState } from 'react'

function OllamaSettings(){

  const [ url, setUrl ] = useState('http://localhost:11434')

  return <>
    <h6 className={styles.heading}>
      Ollama
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
          onChange={(e) => setUrl(e.target.value)}
          value={url}
        />
      </label>
      <button className={styles.button}>Save</button>
    </div>
  </>

}

function GroqSettings(){

  const [ apiKey, setApiKey ] = useState('')

  return <>
    <h6 className={styles.heading}>
      Groq
      <Link className={styles.link} href="https://groq.com/" target="_blank" rel="noopener no referrer">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.5253 5.49475L10.5206 7.49475L15.0782 7.50541L5.47473 17.0896L6.88752 18.5052L16.5173 8.89479L16.5065 13.5088L18.5065 13.5134L18.5253 5.51345L10.5253 5.49475Z" fill="currentColor" /></svg>
      </Link>
    </h6>
    <div className={styles.form}>
      <label className={styles.label}>
        <span className={styles.info}>API Key</span>
        <input type="text" 
          className={styles.input}
          placeholder='Groq API Key'
          onChange={(e) => setApiKey(e.target.value)}
          value={apiKey}
        />
      </label>
      <button className={styles.button}>Save</button>
    </div>
  </>
  
}


export function GPTProviders(){

  return <>
    <h4>GPT Providers</h4>
    <OllamaSettings />
    <GroqSettings />
  </>

}