'use client'

import { useSearchParams } from 'next/navigation'
import styles from './style.module.css'
import { Page } from "@/components/page"
import { FormEvent, useEffect, useState } from 'react'
import { getEmbeddingById } from '@/lib/idb/embedding/getEmbeddingById'
import { Embeddings, EmbeddingsDb } from '@/lib/idb/types'
import { createVector } from '@/lib/embeddings/createVector'
import { uuidv7 } from "uuidv7";
import { Button, Checkbox, NakedInput, NakedTextarea } from '@/components/ui/input'
import { add, count, get, query } from '@/lib/embeddings/chromadb'
import cx from 'classix'
import { showError, showNote } from '@/lib/toast'

async function splitPromise<T>(fns: (() => Promise<T>)[], num: number = 5){
  let ret: T[] = []
  while(fns.length){
    const n = fns.splice(0, num)
    const res = await Promise.all(n.map(v => v()))
    ret = ret.concat(res)
  }
  return ret
}

function getResults( result: any, embedding: Embeddings ){
  return embedding.dbVendor === 'chromadb' ? result.documents : []
}

export default function Edit(){

  const params = useSearchParams()
  const id = params.get('id')
  const [ result, setResult ] = useState<string[]|null>(null)

  const [ data, setData ] = useState<null|{
    embedding: Embeddings
    database: EmbeddingsDb
  }>(null)
  useEffect(() => {
    if(!id) return;
    getEmbeddingById(id).then(v => {
      setData(v)
    })
  },[ id ])

  async function search(q: string){
    if(!data?.embedding) return;
    if(!data?.database) return;
    const v = await createVector(q, data?.embedding.vendor, data?.embedding.model)
    query({
      embedding: data.embedding,
      database: data.database,
      vector: v
    }).then(v => {
      setResult(getResults(v, data.embedding)[0])
    }).catch(e => {
      console.error(e)
      showError('Something wrong is happening')
    })
  }

  const [ currentOffset, setCurrentOffset ] = useState(0)
  async function page(){
    if(!data?.embedding) return;
    if(!data?.database) return;
    get({
      embedding: data.embedding,
      database: data.database,
      offset: currentOffset
    }).then(v => {
      setResult(getResults(v, data.embedding))
    }).catch(e => {
      console.error(e)
      showError('Something wrong is happening')
    })
  }

  useEffect(() => {
    if(data) page()
  },[data, currentOffset])

  async function addData(str: string, split: boolean){
    if(!data?.embedding) return;
    if(!data?.database) return;

    let docs, vectors, ids;
    if(split){
      docs = str.replace(/\r\n/g,'\n').split('\n').filter(v => v).map(v => v.trim())
      vectors = await splitPromise<number[]>(docs.map(v => {
        return () => createVector(v, data?.embedding.vendor, data?.embedding.model)
      }))
      ids = docs.map(v => uuidv7())
    }else{
      const v = await createVector(str, data?.embedding.vendor, data?.embedding.model)
      vectors = [v]
      docs = [str]
      ids = [uuidv7()]
    }

    await add({
      embedding: data.embedding,
      database: data.database,
      ids,
      vectors,
      documents: docs
    })
  }

  const [ inputIsOn, setInputIsOn ] = useState(true)

  function onSubmit(e: FormEvent<HTMLFormElement>){
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const data = Object.fromEntries(new FormData(form).entries())
    addData( 
      data.content as string, 
      data.split === 'on'
    ).then(() => {
      form.reset()
      showNote('data added', false)
      setCurrentOffset(0)
      page()
    }).catch(e => {
      console.error(e)
      showError(e.toString())
    })
  }

  const [ searchInput, setSearchInput ] = useState('')
  useEffect(() => {
    if(searchInput) search(searchInput)
    else{
      setCurrentOffset(0)
      page()
    }
  },[ searchInput ])

  const [ collectionDetails, setCollectionDetails ] = useState(false)


  return <Page 
    title={id ? `Embedding: ${data?.embedding.name}` : 'No Embedding ID found'} 
    backButton={true}>

      <br />

      <div className={styles.details}>
        <div className={styles.button}>
          <Button onClick={() => setCollectionDetails(!collectionDetails)}>
            Collection Details
          </Button>
        </div>
        <div className={cx(styles.detailsContent, collectionDetails && styles.open)}>
          <div><pre>{JSON.stringify(data?.embedding.dbObject, null, 2)}</pre></div>
        </div>
      </div>

      <div className={styles.tabs}>
        <Button 
          onClick={() => setInputIsOn(true)} 
          className={cx(inputIsOn && styles.on)} 
          color="dark">Input</Button>
        <Button 
          onClick={() => setInputIsOn(false)} 
          className={cx(!inputIsOn && styles.on)} 
          color="dark">Contents</Button>
      </div>

      <div className={cx(styles.contentsTab, !inputIsOn && styles.on)}>
        <NakedInput 
          full={true}
          onChange={e => setSearchInput(e.target.value)} 
          value={searchInput}
          placeholder={"search"} 
        /><br />
        <div className={cx(styles.contents)}>
          {!result || !result.length ? <div className={styles.nocontent}>No Content</div> : <>
            {result.map((v, i) => <div key={`${v}${i}`} className={styles.result}>
              <div className={styles.content}>{v}</div>
            </div>)}
          </>} 
        </div>
      </div>

      <form className={cx(styles.input, inputIsOn && styles.on)}
        onSubmit={onSubmit}
      >
        <NakedTextarea name="content" required rows={10} full={true} placeholder="add your text" />
        <div className={styles.controls}>
          <Checkbox name="split" label="Split by paragraph" />
          <Button>Submit</Button>
        </div>
      </form>

  </Page>

}
