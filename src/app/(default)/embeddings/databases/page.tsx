'use client'
import { Page } from "@/components/page"
import Link from "next/link"
import styles from './style.module.css'

import { getAllDatabase } from "@/lib/idb/embedding-database/getAllDatabase"
import { deleteDatabase } from "@/lib/idb/embedding-database/deleteDatabase"
import { useEffect, useRef, useState } from "react"
import { ChromaDBSetting, EmbeddingsDb, EmbeddingsDbWithCount } from "@/lib/idb/types"
import cx from "classix"
import { Button } from "@/components/ui/input"
import { dbTypeToCased } from "@/lib/stringUtils"

function stringifySettings(db: EmbeddingsDb){

  return db.type === 'chromadb' ? JSON.stringify({
    ...db.settings, 
    ...(db.settings as ChromaDBSetting).auth ? { auth: '...'} : {}
  }, null, 2) : ''

}

export default function Databases(){

  const [databases, setDatabases] = useState<EmbeddingsDbWithCount[]>([])
  function getAll(){
    getAllDatabase({ withCount: true }).then(v => {
      setDatabases(v as EmbeddingsDbWithCount[])
    })
  }

  useEffect(() => {
    getAll()
  },[])

  const [ confirmRemoval, setConfirmRemove ] = useState<string|null>(null)
  function confirmRemove(id: string){
    setConfirmRemove(id)
  }

  const to = useRef<ReturnType<typeof setTimeout>>()
  useEffect(() => {
    if(!confirmRemoval) return;
    if(to.current) clearTimeout(to.current)
    to.current = setTimeout(() => {
      setConfirmRemove(null)
    },5000)
  },[ confirmRemoval ])

  function remove(id: string){
    const db = databases.find(v => v.id === id)
    if(!db) return;
    deleteDatabase(db).then(() => {
      getAll()
    })
  }

  return <Page title="Embedding Databases" backButton={true}>
    <br />
    <br />
    <p>These are the databases where we keep your embeddings.</p>
    <p>Supported databases are ChromaDB, PostgreSQL, and Redis.</p>
    <br />
    
    <Link className={styles.create} href="/embeddings/databases/create">Add New Database</Link>
    <br /><br />

    {databases.map(v => {

      return <div key={v.id} className={styles.database}>
        <div className={styles.nameContainer}>
          <span className={styles.name}>{v.name}</span>
          <div className={styles.usage}>
            <p>{v.count} usage</p>
            {!v.count ? <div>
              { confirmRemoval === v.id ? 
                <Button color="danger" onClick={() => remove(v.id)}>Confirm Removal</Button>
              : <Button onClick={() => confirmRemove(v.id)}>Remove</Button>}
            </div> : null}
          </div>
        </div> 
        <p className={cx(styles.url, styles[v.type])}>
          <span>{dbTypeToCased(v.type)}</span>
          <span>{v.url}</span>
        </p>
        <pre>{stringifySettings(v)}</pre>
      </div>

    })}
    
  </Page>

}