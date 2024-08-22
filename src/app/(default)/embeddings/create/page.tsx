'use client'

import { Page } from "@/components/page"
import dynamic from "next/dynamic"
import { FormEvent, useId, useMemo, useRef, useState } from "react"
import styles from './style.module.css'
import { EmbeddingModels } from "@/components/embeddings/embedding-models"
import { ChromaDBSettings, Embeddings } from "@/lib/idb/types"
import { nanoid } from "nanoid";
import { DownloadModel } from "@/components/embeddings/create/download-model"
import { CreateChromaDb } from "@/components/embeddings/chromadb/create"
import cx from "classix"

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
    () => <div className={styles.notype}>
      Type not selected
      <input type="text" required name="type" />
    </div>
  },[ type ])

  const currentData = useRef<Embeddings|null>(null)
  const [ creating, setCreating ] = useState(false)
  function onSubmit(e: FormEvent<HTMLFormElement>){
    e.preventDefault()
    const d = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(d.entries());

    currentData.current = {
      id: nanoid(),
      name: data.name as string,
      vendor: (data.model as string).split('/')[0] as Embeddings['vendor'],
      model: (data.model as string).split('/')[1],
      db: data.db as Embeddings['db'],
      dbUrl: data.url as string,
      dbSettings: {
        tenant: data.tenant,
        database: data.database,
        distance: data.distance
      } as ChromaDBSettings,
    }

    setCreating(true)
    
  }

  const [ modelSuccess, setModelSuccess ] = useState(false)
  function onModelSuccess(){
    setModelSuccess(true)
  }

  const [ success, setSuccess ] = useState(false)
  function onSuccessAll(){
    setSuccess(true)
  }

  const [ error, setError ] = useState(false)
  function onError(){
    setError(true)
  }

  function returnToForm(){
    setError(false)
    setSuccess(false)
    setCreating(false)
  }


  return <Page title="Create Embedding" backButton={true}>

    <br />
    {creating ? <div className={styles.creating}>

      <h3>Creating Records</h3>
      {success || error ? null : <p className={styles.red}>Do not move away from this page</p>}

      {currentData.current ? <>
        <DownloadModel 
          vendor={currentData.current.vendor} 
          model={currentData.current.model} 
          onSuccess={onModelSuccess}
        />
        {modelSuccess ? (currentData.current.db === 'chromadb' ? (
          <CreateChromaDb 
            url={currentData.current.dbUrl}
            collection={currentData.current.name}
            tenant={(currentData.current.dbSettings as ChromaDBSettings).tenant}
            database={(currentData.current.dbSettings as ChromaDBSettings).database}
            distance={(currentData.current.dbSettings as ChromaDBSettings).distance}
            onSuccess={onSuccessAll}
            onError={onError}
          />
        ) : null) : null}

        {success ? <button className={styles.successButton}>Continue</button> : null}
        {error ? <button onClick={() => returnToForm()} className={styles.errorButton}>Back</button> : null}
      </> : null}
      


    </div> : null }

    <form className={cx(styles.form, creating && styles.noDisplay)} onSubmit={onSubmit}>
      <label htmlFor={name}>
        <span>Name</span>
        <input pattern="^[a-z_]+$" 
        onChange={e => {
          const val = e.target.value
          const match = val.match(/^[a-z_]+$/)
          if(!match) {
            e.target.setCustomValidity(`lowercase and underscore only`)
            e.target.reportValidity()
          }else{
            e.target.setCustomValidity('')
          }
        }}
        required type="text" id={name} name="name" />
      </label>
      <EmbeddingModels />

      <label htmlFor={vendor}>
        <span>Database</span>
        <select required id={vendor} name="db" value={type} 
          onChange={(e) => setType(e.target.value)}>
          <option value=""></option>
          <option value="chromadb">ChromaDB</option>
          <option value="postgres">Postgres</option>
          <option value="redis">Redis</option>
        </select>
      </label>
      <DatabaseSetting />
      <button type="submit">Submit</button>
    </form>
    

  </Page>

}