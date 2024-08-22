'use client'
import { test } from "@/lib/embeddings/chromadb"
import { ChangeEvent, MouseEvent, useEffect, useId, useRef, useState } from "react"
import cx from "classix"
import styles from './style.module.css'

export function ChromaDb(){

  const db = useId()
  const tenant = useId()
  const database = useId()
  const distance = useId()

  const [ url, setUrl ] = useState("http://localhost:8000")
  const [ ok, setOk ] = useState(false)
  const urlInput = useRef<HTMLInputElement|null>(null)

  useEffect(() => {
    test(url)
    .then(() => { 
      setOk(true) 
      urlInput.current?.setCustomValidity('')
    })
    .catch(() => { 
      setOk(false) 
      urlInput.current?.setCustomValidity('Invalid ChromaDB URL')
      urlInput.current?.reportValidity()
    })
  },[ url ])

  function onChangeTenantDB(e: ChangeEvent<HTMLInputElement>){
    const val = e.target.value
    const match = val.match(new RegExp(e.target.pattern))
    if(!match) {
      e.target.setCustomValidity(`lowercase and underscore only`)
      e.target.reportValidity()
    }else{
      e.target.setCustomValidity('')
    }
  }

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

  const [ docker, setDocker ] = useState(false)

  return <>
    <button type="button" onClick={() => setDocker(!docker)} className={styles.docker}>{docker ? 'Close': 'Show'} docker command</button>
    {docker ? <pre className={styles.pre}>
      <button type="button" onClick={onCopy}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13 7H7V5H13V7Z" fill="currentColor" />
          <path d="M13 11H7V9H13V11Z" fill="currentColor" />
          <path d="M7 15H13V13H7V15Z" fill="currentColor" />
          <path fillRule="evenodd" clipRule="evenodd" d="M3 19V1H17V5H21V23H7V19H3ZM15 17V3H5V17H15ZM17 7V19H9V21H19V7H17Z" fill="currentColor" />
        </svg>
      </button>
      <code>{`docker run -d \\
  -p 8000:8000 \\
  -v chroma:/chroma/chroma \\
  -e IS_PERSISTENT=TRUE \\
  -e CHROMA_SERVER_CORS_ALLOW_ORIGINS='["*"]' \\
  -e CHROMA_SERVER_AUTHN_CREDENTIALS='mycredential' \\
  -e CHROMA_SERVER_AUTHN_PROVIDER='chromadb.auth.token_authn.TokenAuthenticationServerProvider' \\
  -e CHROMA_AUTH_TOKEN_TRANSPORT_HEADER='X-Chroma-Token' \\
  -e ANONYMIZED_TELEMETRY=TRUE \\
  --name chromadb \\
  chromadb/chroma:latest`}</code>
    </pre> : null}
    <label htmlFor={db}>
      <span>
        URL
        <span className={cx(styles.indicator, ok && styles.ok)}></span>
      </span>
      <input type="text" id={db} required name="url"
        ref={urlInput}
        onChange={e => setUrl(e.target.value)} value={url} />
    </label>
    <label htmlFor={tenant}>
      <span>Tenant</span>
      <input type="text" id={tenant}
      pattern="^[a-z_]+$"
      onChange={onChangeTenantDB}
      required name="tenant" defaultValue={"default_tenant"} />
    </label>
    <label htmlFor={database}>
      <span>Database</span>
      <input type="text" id={database} 
      pattern="^[a-z_]+$"
      onChange={onChangeTenantDB}
      required name="database" defaultValue={"default_database"} />
    </label>

    <label htmlFor={distance}>
      <span>Distance Function</span>
      <select style={{width: '100%', maxWidth:'600px', display: 'block', overflow: 'hidden'}} id={distance} 
        required name="distance" defaultValue={"l2"}>
        <option value="l2">Euclidean (L2) - Useful for text similarity, more sensitive to noise than cosine</option>
        <option value="cosine">Cosine - Useful for text similarity</option>
        <option value="ip">Inner Product (IP) - Recommender systems</option>
      </select>
    </label>
  </>

}