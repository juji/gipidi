'use client'

import { showError } from "@/lib/toast";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useFileUpload } from "./fileUploadStore";
import { createPortal } from "react-dom";
import styles from './style.module.css'
// import { useEmbedding } from "./useEmbedding";

export function Files({
  className,
}:{
  className: string,
}){

  const worker = useRef<Worker|null>(null)
  const files = useRef<(File|null)[]>([])
  const addFileUpload = useFileUpload(s => s.add)
  const onDraggedIn = useFileUpload(s => s.onDraggedIn)
  const onDraggedOut = useFileUpload(s => s.onDraggedOut)
  const draggedIn = useFileUpload(s => s.draggedIn)
  const addFileInQueue = useFileUpload(s => s.addFileInQueue)
  // const { addFileEmbeddings } = useEmbedding()

  useEffect(() => {

    if(worker.current) return () => {}

    worker.current = new Worker('/file-to-base64.js')
    worker.current.addEventListener("message", (msg: MessageEvent) => {
      if(msg.data.error) {
        showError(msg.data.error)
        files.current[msg.data.index] = null
      }

      else {

        // addFileEmbeddings({
        //   data: msg.data.data,
        //   mime: msg.data.type,
        //   name: files.current[msg.data.index]?.name || ''
        // })

        addFileUpload({
          data: msg.data.data,
          mime: msg.data.type,
          name: files.current[msg.data.index]?.name || ''
        })
        files.current[msg.data.index] = null
      }

      if (!files.current.find(v => v)) {
        files.current = []
      }
    })

  }, [])
  
  // drop file listener
  useEffect(() => {

    let to: ReturnType<typeof setTimeout> |  null = null
    function onDragOver(e: DragEvent) {
      e.preventDefault()
      onDraggedIn()
      if(to) clearTimeout(to)
      to = setTimeout(() => {
        onDraggedOut()
      },300)
    }

    function onDrop(e: DragEvent) {
      e.preventDefault()
      onDraggedOut()
      const fileList = e.dataTransfer?.files
      if (!fileList || !fileList.length) return;
      for (let i = 0; i < fileList.length;i++) {
        addFileInQueue()
        files.current.push(fileList[i])
        worker.current && worker.current.postMessage({
          index: files.current.length - 1,
          file: fileList[i],
        })
      }
    }

    document.body.addEventListener('dragover', onDragOver, false);
    document.body.addEventListener('drop', onDrop, false);

    return () => {
      document.body.removeEventListener('dragover', onDragOver);
      document.body.removeEventListener('drop', onDrop);
    }
  },[])

  const [uploaderId, setUploaderId] = useState(Math.random())
  function fileAdded(e: ChangeEvent<HTMLInputElement>){
    const target = e.target as HTMLInputElement
    if(!target.files) return;
    for(let i=0;i<target.files.length;i++){
      addFileInQueue()
      files.current.push(target.files[i])
      worker.current && worker.current.postMessage({
        index: files.current.length - 1,
        file: target.files[i],
      })
    }
    setUploaderId(Math.random())

  }

  return <>
    <input key={uploaderId} 
    className={className} 
      type="file" multiple onChange={fileAdded} />
    {draggedIn ? createPortal(
      <div className={styles.dropFile}>
        <p>drop to upload</p>
      </div>,
      document.body
    ) : null}
  </>

}