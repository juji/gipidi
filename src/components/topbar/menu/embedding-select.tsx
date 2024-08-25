'use client'
import { ChangeEvent, useEffect, useState } from 'react'
import styles from './style.module.css'
import { getAllEmbeddings } from '@/lib/idb/embedding/getAllEmbeddings'
import { Embeddings } from '@/lib/idb/types'
import Link from 'next/link'
import { useConvo } from '@/lib/convoStore'

export function EmbeddingSelect({ 
  setEmbeddingId,
  embeddingId
}:{ 
  setEmbeddingId: (v: string|undefined) => void
  embeddingId?: string 
}){

  const [ embeddings, setEmbeddings ] = useState<Embeddings[]|null>(null)
  useEffect(() => {
    getAllEmbeddings().then(v => setEmbeddings(v))
  },[])

  const updateEmbedding = useConvo(s => s.updateEmbedding)
  const activeConvoId = useConvo(s => s.activeConvo?.id)
  function onChange(e: ChangeEvent<HTMLSelectElement>){
    setEmbeddingId(e.target.value||undefined)
    activeConvoId && updateEmbedding(e.target.value||undefined)
  }

  return <>
    <h4 className={styles.menuHeader}>Embedding</h4>
    <div className={styles.embedding}>
      {embeddings && embeddings.length ? <div className={styles.selectWrapper}>
        <select 
          className={styles.select}
          value={embeddingId||''}
          onChange={onChange}
        >
          <option value=""></option>
          {embeddings.map(v => {
            return <option key={v.id} value={v.id}>{v.name}</option>
          })}
        </select>
        <svg className={styles.chevronDown} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.34317 7.75732L4.92896 9.17154L12 16.2426L19.0711 9.17157L17.6569 7.75735L12 13.4142L6.34317 7.75732Z" fill="currentColor" /></svg>
      </div> : embeddings ? <div className={styles.nothing}>
        <p>No Embeddings Found</p>
        <Link href="/embeddings">Create One</Link>
      </div> : <p className={styles.loading}>Loading Embeddings..</p> }
    </div>
  </>

}