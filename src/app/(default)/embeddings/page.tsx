'use client'

import { Page } from "@/components/page"
import Link from "next/link"
import styles from './style.module.css'
import { ChromaDBSetting, Embeddings } from "@/lib/idb/types"
import { useEffect, useRef, useState } from "react"
import { getAllEmbeddings } from "@/lib/idb/embedding/getAllEmbeddings"
import { Button } from "@/components/ui/input"
import { getDatabaseById } from "@/lib/idb/embedding-database/getDatabaseById"
import { deleteCollection } from "@/lib/embeddings/chromadb"
import { deleteEmbedding } from "@/lib/idb/embedding/deleteEmbedding"
import { dbTypeToCased } from "@/lib/stringUtils"

export default function About(){

  const [ embeddings, setEmbeddings ] = useState<Embeddings[]|null>(null)
  function getData(){
    getAllEmbeddings().then((v) => {
      setEmbeddings(v)
    })
  }

  useEffect(() => {
    getData()
  },[])

  async function deleteSelectedEmbedding(v: Embeddings){
    const db = await getDatabaseById(v.db)
    try{
      await deleteCollection({
        url: db.url,
        tenant: (db.settings as ChromaDBSetting).tenant,
        database: (db.settings as ChromaDBSetting).database,
        collection: v.dbObject.name,
        authType: (db.settings as ChromaDBSetting).auth?.type,
        authToken: (db.settings as ChromaDBSetting).auth?.token,
      })
    }catch(e){
      console.error(e)
    }
    await deleteEmbedding(v)
    getData()
    setToDelete(null)
  }

  const [ toDelete, setToDelete ] = useState<Embeddings|null>(null)
  function confirmDelete(v: Embeddings){
    setToDelete(v)
  }

  const to = useRef<ReturnType<typeof setTimeout>>()
  useEffect(() => {
    if(!toDelete) return;
    if(to.current) clearTimeout(to.current)
    to.current = setTimeout(() => {
      setToDelete(null)
    },5000)
  },[ toDelete ])

  return <Page title="Embeddings" link={<Link href="/embeddings/databases">Databases</Link>}>
    <br />
    <br />
    <p>Embeddings add contents to GPT.</p>
    <p>It will be used as a `Knowledge Base` for model(s) to look for information.</p>
    <br />
    
    <Link className={styles.create} href="/embeddings/create">Create New Embedding</Link>
    &nbsp;&nbsp;&nbsp;&nbsp;
    <Link className={styles.create} href="/embeddings/databases/create">Add New Database</Link>

    <br /><br />

    {embeddings?.map(v => {

      return <div key={v.id} className={styles.embedding}>
        <Link href={`/embeddings/edit?id=${v.id}`}>{v.name}</Link>
        <p>{dbTypeToCased(v.dbVendor||'')} - {v.vendor} / {v.model}</p>
        <div>
          {toDelete && toDelete.id === v.id ? <Button 
            color="danger" 
            onClick={() => deleteSelectedEmbedding(v)}>Confirm</Button> : 
          <Button onClick={() => confirmDelete(v)}>Delete</Button> }
        </div>
      </div>

    })}
    
  </Page>

}