import styles from './style.module.css'
import cx from 'classix'
import Link from 'next/link'
import { MouseEvent, useEffect, useState } from 'react'
import { test } from '@/lib/chroma-db'

export function ChromaDB(){

  const [ isOn, setIsOn ] = useState(false)
  const [ chromaUrl, setChromaUrl ] = useState('')

  useEffect(() => {
    setChromaUrl('http://localhost:8000')
  },[])

  useEffect(() => {
    if(!chromaUrl) return () => {}
    test(chromaUrl).then((data) => {
      console.log('data from chroma', data)
      setIsOn(true)
    }).catch(e => {
      setIsOn(false)
    })
  },[ chromaUrl ])

  function onCopy(e: MouseEvent<HTMLButtonElement>){
    const btn = e.currentTarget as HTMLButtonElement
    const content = btn.parentNode?.querySelector('code')?.innerHTML
    const html = btn.innerHTML
    if(!content) return;
    navigator.clipboard.writeText(content);
    btn.innerText = 'Copied';
    setTimeout(() => {
      btn.innerHTML = html;
    },1000);
  }

  return <div className={styles.chromadb}>
    <h4 className={styles.heading}>
      Chroma DB
      <span className={cx(styles.indicator, isOn && styles.isOn)}></span>
      <Link className={styles.link} href="https://docs.trychroma.com/" target="_blank" rel="noopener noreferrer">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.5253 5.49475L10.5206 7.49475L15.0782 7.50541L5.47473 17.0896L6.88752 18.5052L16.5173 8.89479L16.5065 13.5088L18.5065 13.5134L18.5253 5.51345L10.5253 5.49475Z" fill="currentColor" /></svg>
      </Link>
    </h4>
    <p className={styles.desc}>
      Using Chroma DB will enable attachments on Ollama and Groq
    </p>

    <p className={styles.desc}>
      Installation:
    </p>
    <pre className={styles.pre}>
      <button onClick={onCopy}>
      <svg
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <path d="M13 7H7V5H13V7Z" fill="currentColor" />
  <path d="M13 11H7V9H13V11Z" fill="currentColor" />
  <path d="M7 15H13V13H7V15Z" fill="currentColor" />
  <path
    fillRule="evenodd"
    clipRule="evenodd"
    d="M3 19V1H17V5H21V23H7V19H3ZM15 17V3H5V17H15ZM17 7V19H9V21H19V7H17Z"
    fill="currentColor"
  />
</svg>

      </button>
      <code>{`docker run -d \\
  -p 8000:8000 --rm \\
  --name chromadb \\
  -v chroma:/chroma/chroma \\
  -e IS_PERSISTENT=TRUE \\
  -e CHROMA_SERVER_CORS_ALLOW_ORIGINS='["*"]' \\
  -e ANONYMIZED_TELEMETRY=TRUE chromadb/chroma:latest`}</code>
    </pre>

    <div className={styles.form}>
      <label className={styles.label}>
        <span className={styles.info}>URL</span>
        <input type="text" 
          className={styles.input}
          placeholder='Chroma DB URL'
          value={chromaUrl}
          onInput={(e) => setChromaUrl((e.target as HTMLInputElement).value)}
        />
      </label>
    </div>
    
    {/* <div className={styles.form}>
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
    </div> */}
    
  </div>

}