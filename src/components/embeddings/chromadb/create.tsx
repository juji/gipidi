'use client'

import { useEffect, useRef, useState } from "react"
import { Status } from "@/components/ui/status"
import { 
  getCollection,
  createCollection 
} from "@/lib/embeddings/chromadb"
import { ChromaDBSetting, EmbeddingsDb } from "@/lib/idb/types"


export function CreateChromaDb({
  db,
  collection,
  distance,
  onSuccess,
  onError, 
  onExist,
  start
}:{
  db: EmbeddingsDb
  collection: string
  tenant: string
  database: string
  distance: string
  onSuccess: (collection: any) => void
  onError: () => void
  onExist: (collection: any) => void
  start: boolean
}){

  const [ collectionPerc, setCollectionPerc ] = useState(0)
  const [ collectionError, setCollectionError ] = useState('')
  const started = useRef(false)
  useEffect(() => {

    if(!start) return;
    if(started.current) return;
    started.current = true
    
    const url = db.url
    const { tenant, database } = db.settings as ChromaDBSetting

    getCollection({ url, tenant, database, collection })
    .then(v => {
      setCollectionError(`Collection '${collection}' already exist`)
      onExist(v)
    }).catch(() => {
      return createCollection({ url, tenant, database, collection, distance }) 
      .then((v) => {
        setCollectionPerc(100)
        onSuccess(v)
      }).catch(e => {
        setCollectionError(e.body.message)
        onError()
      })
    })

  },[ start ])

  return <>
    <Status 
      text={`Create Collection: ${collection}`}
      percentage={collectionPerc}
      status={collectionError}
      isError={!!collectionError}
    />
  </>

}