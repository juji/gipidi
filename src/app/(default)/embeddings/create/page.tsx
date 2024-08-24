'use client'

import { Page } from "@/components/page"
import styles from './style.module.css'
import formStyles from '@/components/ui/form.module.css'
import { nanoid } from "nanoid";
import { Select, Input, Button } from "@/components/ui/input"
import cx from "classix"
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { getAllDatabase } from "@/lib/idb/embedding-database/getAllDatabase";
import { Embeddings, EmbeddingsDb } from "@/lib/idb/types";
import Link from "next/link";

import { ChromaDbOptions } from "@/components/embeddings/chromadb/options";
import { EmbeddingModels } from "@/components/embeddings/embedding-models";

import { CreateEmbeddings } from "@/components/embeddings/create";
import { getEmbeddingByName } from "@/lib/idb/embedding/getEmbeddingByName";
import { createEmbedding } from "@/lib/idb/embedding/createEmbedding";

export default function Create(){

  const [ data, setData ] = useState<Embeddings|null>(null)
  const [ db, setDb ] = useState<EmbeddingsDb|null>(null)
  function onSubmit(e: FormEvent<HTMLFormElement>){
    e.preventDefault()
    
    const data = Object.fromEntries(new FormData(e.target as HTMLFormElement).entries())
    const embeddingModel = (data.model as string).split('/')

    const db = database?.find(v => v.id === data.database)
    if(!db) throw new Error('db not found')

    const embedding = {
      id: nanoid() as string,
      name: data.name as string,
      vendor: embeddingModel[0],
      model: embeddingModel[1],
      db: data.database as string,
      dbVendor: db.type,
      settings: {
        distance: data.distance as string
      }
    } as Embeddings

    setDb(db)
    setData(embedding)
  }

  const [database, setDatabase] = useState<EmbeddingsDb[]|null>(null)
  useEffect(() => {
    getAllDatabase().then(v => setDatabase(v))
  },[])

  function onDbChange(e: ChangeEvent<HTMLSelectElement>){
    const embedding = database?.find(v => v.id === e.target.value)
    if(!embedding) setEmbeddingType(null);
    else setEmbeddingType(embedding.type)
  }

  const [embeddingType, setEmbeddingType] = useState<EmbeddingsDb['type']|null>(null)
  const Options = useMemo(() => {
    return embeddingType === 'chromadb' ? ChromaDbOptions : () => null
  },[embeddingType])

  function onChangeName(e: ChangeEvent<HTMLInputElement>){
    if(e.target.validity.patternMismatch){
      e.target.setCustomValidity('Should only be lowercase and underscore')
      e.target.reportValidity()
    }else{
      const input = e.target
      const val = input.value
      getEmbeddingByName(val).then(v => {
        if(v) input.setCustomValidity('Name already exist')
        else input.setCustomValidity('')
        input.reportValidity()
      })
    }
  }

  const [result, setResult] = useState<{
    success?: any
    existing?: any
    error?: boolean
  }|null>(null)

  function reportSuccess( collection: any ){
    setResult({ success: collection })
  }
  function reportExisting( collection: any ){
    setResult({ existing: collection })
  }
  function reportError(){
    setResult({ error: true })
  }

  function backToForm(){
    setData(null)
    setDb(null)
    setResult(null)
  }

  useEffect(() => {
    if(!result?.success) return;
    if(!data) return;

    createEmbedding({
      ...data,
      dbObject: result.success
    }).then(v => {
      setData(v)
    })
  },[ result?.success, data ])

  function continueWithExisting(){
    if(!data) return;
    if(!result?.existing) return;
    createEmbedding({
      ...data,
      dbObject: result.existing
    }).then(v => {
      setData(v)
    })
  }

  return <Page title="Create Embedding" backButton={true}>

    <br />

    { data && db ? <>
      <CreateEmbeddings 
        data={data as Embeddings} 
        db={db as EmbeddingsDb}
        reportSuccess={reportSuccess}
        reportExisting={reportExisting}
        reportError={reportError}
      />
      <br /><br />
      {result && result.error ? <Button onClick={backToForm} color="danger">Back</Button> : null}
      {result && result.existing ? <>
          <p style={{margin: '1em 0'}}>Colection already exist, use this collection instead?</p>
          <Button onClick={backToForm} color="danger">Back</Button>&nbsp;&nbsp;&nbsp;
          <Button onClick={continueWithExisting} color="success">Continue</Button>
        </> : null}
      {data.dbObject ? <Button onClick={() => history.back()} color="success">Continue</Button> : null}
    </> : null }
    

    <form className={cx(styles.form, formStyles.form, data && formStyles.hidden)} onSubmit={onSubmit}>
      
      <Input label="Name"
        onChange={onChangeName}
        pattern={'^[a-z_]+$'} 
        disabled={!database || !database.length} 
        required type="text" name="name" />

      <EmbeddingModels disabled={!database || !database.length} />

      { database && database.length ? (<>
        <Select 
          onChange={onDbChange}
          required label="Database" name="database">
          <option value="">Select Database</option>
          {database.map(v => <option key={v.id} value={v.id}>{v.name} - {v.type}</option>)}
        </Select>
        <Link 
          className={styles.link} 
          href="/embeddings/databases/create">Create new database</Link>
        <br /><br />
      </>) 
      
      : database && !database.length ? (
        <p className={styles.empty}>
          Empty database. <Link 
            className={styles.link} 
            href="/embeddings/databases/create">Create one</Link>
        </p>
      ) 
      
      : <p className={styles.loading}>Loading databases...</p> }

      <Options />
      <br />
      <Button disabled={!database || !database.length} type="submit">Submit</Button>

    </form>
    

  </Page>

}