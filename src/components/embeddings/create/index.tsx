'use client'

import { CreateChromaDb } from "@/components/embeddings/chromadb/create";
import { DownloadModel } from "@/components/embeddings/create/download-model";
import { ChromaDBEmbedding, ChromaDBSetting, Embeddings, EmbeddingsDb } from "@/lib/idb/types";
import { useMemo, useState } from "react";

export function CreateEmbeddings({ 
  data, 
  db, 
  reportSuccess,
  reportExisting,
  reportError
}:{ 
  data: Embeddings, 
  db: EmbeddingsDb,
  reportSuccess: (collection: any) => void
  reportExisting: (collection: any) => void
  reportError: () => void
}){

  const [ modelOk, setModelOk ] = useState<boolean|null>(null)
  function onModelDownloaded(){
    setModelOk(true)
  }

  function onModelError(){
    setModelOk(false)
    reportError()
  }

  function onDbSuccess(collection: any){
    reportSuccess(collection)
  }

  function onDbError(){
    reportError()
  }

  function onDbExist(collection: any){
    reportExisting(collection)
  }

  const Create = useMemo(() => {

    return db.type === 'chromadb' ? () => (
      <CreateChromaDb 
        db={db}
        collection={data.name}
        tenant={(db.settings as ChromaDBSetting).tenant}
        database={(db.settings as ChromaDBSetting).tenant}
        distance={(data.settings as ChromaDBEmbedding).distance}
        onSuccess={onDbSuccess}
        onError={onDbError}
        onExist={onDbExist}
        start={!!modelOk}
      />
    ) : () => <p style={{
      margin: '1em 0', 
      color: 'tomato'
    }}>Unknown database</p>

  },[ db.type, modelOk ])

  return <>

    <h3>Setting up</h3>

    <DownloadModel 
      vendor={data.vendor}
      model={data.model}
      onSuccess={onModelDownloaded}
      onError={onModelError}
    />

    <Create />

  </>

}