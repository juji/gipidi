'use client'

import { useEffect, useState } from "react"
import { Status } from "../create/status"
import { 
  getCreateTenant, 
  getCreateDb,
  getCollection,
  createCollection 
} from "@/lib/embeddings/chromadb"


export function CreateChromaDb({
  url,
  collection,
  tenant,
  database,
  distance,
  onSuccess,
  onError
}:{
  url: string
  collection: string
  tenant: string
  database: string
  distance: string
  onSuccess: () => void
  onError: () => void
}){

  const [ tenantPerc, setTenantPerc ] = useState(0)
  const [ tenantError, setTenantError ] = useState('')
  useEffect(() => {
    getCreateTenant({ url, tenant }).then(() => {
      setTenantPerc(100)
    }).catch(e => {
      setTenantError(e.body.message)
      onError()
    })
  },[])

  const [ dbPerc, setDbPerc ] = useState(0)
  const [ dbError, setDbError ] = useState('')
  useEffect(() => {
    if(tenantPerc === 100)
      getCreateDb({ url, tenant, database }).then(() => {
        setDbPerc(100)
      }).catch(e => {
        setDbError(e.body.message)
        onError()
      })
  },[ tenantPerc ])

  const [ collectionPerc, setCollectionPerc ] = useState(0)
  const [ collectionError, setCollectionError ] = useState('')
  useEffect(() => {
    if(dbPerc !== 100) return () => {}

    getCollection({ url, tenant, database, collection })
    .then(v => {
      setCollectionError('Collection already exist')
      onError()
    }).catch(() => {
      return createCollection({ url, tenant, database, collection, distance }) 
      .then(() => {
        setCollectionPerc(100)
        onSuccess()
      }).catch(e => {
        setCollectionError(e.body.message)
        onError()
      })
    })

  },[ dbPerc ])

  return <>
    <Status 
      text={`Get or Create Tenant: ${tenant}`}
      percentage={tenantPerc}
      status={tenantError}
      isError={!!tenantError}
    />
    <Status 
      text={`Get or Create DB: ${database}`}
      percentage={dbPerc}
      status={dbError}
      isError={!!dbError}
    />
    <Status 
      text={`Create Collection: ${collection}`}
      percentage={collectionPerc}
      status={collectionError}
      isError={!!collectionError}
    />
  </>

}