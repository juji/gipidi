import { getCollection, updateCollectionName, insert } from "@/lib/chroma-db"
import { useConvo } from "@/lib/convoStore"
import { ConvoAttachment, ConvoEmbeddings } from "@/lib/idb/types"
import { nanoid } from "nanoid"
import { useEffect, useRef } from "react"


export function useEmbedding(): { 
  addFileEmbeddings: (file: ConvoAttachment) => void 
}{

  const activeConvo = useConvo(s => s.activeConvo)
  const processAttachments = useConvo(s => s.processAttachments)
  const addEmbeddings = useConvo(s => s.addEmbeddings)

  // initial embeddings id
  const embeddingId = useRef('initial.'+nanoid())
  const initialEmbeddings = useRef<ConvoEmbeddings|null>(null) 
  const collection = useRef<Promise<any>|null>(null)

  useEffect(() => {
    if(!activeConvo?.id) return () => {}

    // change collection name of current embeddings
    // if any
    if(embeddingId.current.match('initial.') && initialEmbeddings.current){

      addEmbeddings(
        activeConvo?.id,
        initialEmbeddings.current.collectionId, 
        initialEmbeddings.current.metadatas
      )

      updateCollectionName(
        initialEmbeddings.current.collectionId,
        activeConvo?.id
      ).then(() => {
        initialEmbeddings.current = null
        embeddingId.current = activeConvo?.id
        collection.current = getCollection(embeddingId.current)
      })

    }else{
      initialEmbeddings.current = null
      embeddingId.current = activeConvo?.id
      collection.current = getCollection(embeddingId.current)
    }

  },[ activeConvo?.id ])


  // on add file
  function addFileEmbeddings( file: ConvoAttachment ){
    if(!processAttachments) return;

    if(!collection.current) {
      collection.current = getCollection(embeddingId.current)
    }
    
    collection.current.then(c => {

      if(embeddingId.current.match('initial.') && !initialEmbeddings.current){
        initialEmbeddings.current = {
          collectionId: c.id,
          metadatas: []
        }
      }

      insert([file], c.id).then(async res => {
        if(embeddingId.current.match('initial.')){
          initialEmbeddings.current?.metadatas.push(res[0])
        }else{
          await addEmbeddings(
            embeddingId.current,
            c.id, 
            res
          )
        }
      })
    })
  }

  return { addFileEmbeddings }



}