'use client'

import { Page } from "@/components/page"
import dynamic from "next/dynamic"
import { useId, useMemo, useState } from "react"
import styles from './style.module.css'

const ChromaDb = dynamic(
  () => import('@/components/embeddings/chromadb').then(v => v.ChromaDb), 
  { ssr: false }
)

export default function Create(){

  const name = useId()
  const vendor = useId()

  const [ type, setType ] = useState('')

  const DatabaseSetting = useMemo(() => {
    return type === 'chromadb' ? ChromaDb : 
    () => <p>Type not selected</p>
  },[ type ])

  return <Page title="Create Embedding">

    <br /><br />
    <form className={styles.form}>
      <label htmlFor={name}>
        <span>Name</span>
        <input type="text" id={name} name="name" />
      </label>
      <label htmlFor={vendor}>
        <span>Type</span>
        <select id={vendor} name="type" value={type} 
          onChange={(e) => setType(e.target.value)}>
          <option value=""></option>
          <option value="chromadb">ChromaDB</option>
          <option value="postgres">Postgres</option>
          <option value="redis">Redis</option>
        </select>
      </label>
      <DatabaseSetting />
    </form>

  </Page>

}