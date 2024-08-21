'use client'

import { FormEvent, Fragment, useMemo, useRef, useState, KeyboardEvent, useEffect } from 'react'
import styles from './style.module.css'
import cx from 'classix'
import { useConvo } from '@/lib/convoStore'
import { Files } from './files'
import { useFileUpload } from './fileUploadStore'
import { ChatAttachment } from '../chat-attachment'
import { convertAttachment } from "@/lib/convert-attachments";
import { ConvoAttachment } from '@/lib/idb/types'

export function Inputform(){

  const [content, setContent] = useState('')
  const activeConvo = useConvo(s => s.activeConvo)
  const createConvo = useConvo(s => s.createConvo)
  const stopSignal = useConvo(s => s.stopSignal)
  const addUserMessage = useConvo(s => s.addUserMessage)
  const disableInput = useConvo(s => s.disableInput)
  const setAttachmentReady = useConvo(s => s.setAttachmentReady)
  const attachmentReady = useConvo(s => s.attachmentReady)

  const splitContent = useMemo(() => {
    return content ? content.split('\n') : ['s']
  },[ content ])

  function onChangeLocal(e: FormEvent<HTMLTextAreaElement>){
    const target = e.target as HTMLTextAreaElement
    setContent(target.value)
  }

  const textarea = useRef<HTMLTextAreaElement|null>(null)
  useEffect(() => {
    textarea.current && (textarea.current as HTMLTextAreaElement).focus()
  },[])

  const files = useFileUpload(s => s.files)
  const setFileState = useFileUpload(s => s.setFileState)
  const removeByFile = useFileUpload(s => s.removeByFile)
  const remove = useFileUpload(s => s.remove)
  const removeAll = useFileUpload(s => s.removeAll)
  const filesInQueue = useFileUpload(s => s.filesInQueue)

  function onSubmitForm(e: FormEvent){
    e.preventDefault()
    onSubmit(content)
  }

  const form = useRef<HTMLFormElement|null>(null)
  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>){
    if(
      e.key === 'Enter' && !(e.ctrlKey || e.altKey)
    ){
      e.preventDefault()
      onSubmit(content)
    }
  }

  const convertion = useRef<{[id: string]:ConvoAttachment}|null>(null)
  function onRemoveFile(index: number) {
    remove(index)
    if(!convertion.current) return;
    const file = files[index]
    if(file && convertion.current[file.id])
      delete convertion.current[file.id]
  }

  files.forEach(file => {
    if(!file.loading) return;
    if(!convertion.current) convertion.current = {}
    if(convertion.current[file.id]) return;
    
    setAttachmentReady(false)
    convertion.current[file.id] = file
    convertAttachment(file).then(res => {
      if(!convertion.current) return;

      if(convertion.current[file.id] && res){
        convertion.current[file.id] = res as ConvoAttachment
        setFileState(convertion.current[file.id])
      }
      else if(convertion.current[file.id] && !res){
        delete convertion.current[file.id]
        removeByFile(file)
      }

      const notDone = Object.keys(convertion.current)
        .find(v => convertion.current && convertion.current[v].loading)

      if(!notDone){
        setAttachmentReady({...convertion.current})
        convertion.current = null
      }
    })
  })

  function onSubmit(content: string) {
    if(!content) return; 
    if(filesInQueue) return;
    if(disableInput) return;

    if(!activeConvo){
      createConvo( content, 
        attachmentReady && typeof attachmentReady !== 'boolean' ?
        Object.keys(attachmentReady).map(v => attachmentReady[v]) :
        [...files] 
      )
    }else{
      addUserMessage( content,  
        attachmentReady && typeof attachmentReady !== 'boolean' ?
        Object.keys(attachmentReady).map(v => attachmentReady[v]) :
        [...files] 
      )
    }

    if(!convertion.current || !Object.keys(convertion.current).length)
      setAttachmentReady(true)

    setContent('')
    removeAll()
  }

  return <form className={cx(styles.form, styles.fileUpload)} 
    onSubmit={onSubmitForm} ref={form}>

    {/* Where to put files preview? Here */}
    <div className={styles.filesPreview}>
      {files.length ? <ChatAttachment
        files={files}
        onRemoveFile={onRemoveFile}
        className={styles.content} /> : null}
    </div>

    <div className={styles.files}>
      <div className={styles.filesContainer}>
        <Files className={styles.fileInput} />
        <span className={styles.fileIcon}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 0C16.7614 0 19 2.23858 19 5V17C19 20.866 15.866 24 12 24C8.13401 24 5 20.866 5 17V9H7V17C7 19.7614 9.23858 22 12 22C14.7614 22 17 19.7614 17 17V5C17 3.34315 15.6569 2 14 2C12.3431 2 11 3.34315 11 5V17C11 17.5523 11.4477 18 12 18C12.5523 18 13 17.5523 13 17V6H15V17C15 18.6569 13.6569 20 12 20C10.3431 20 9 18.6569 9 17V5C9 2.23858 11.2386 0 14 0Z" fill="currentColor" /></svg>
        </span>
      </div>
    </div>
    <div className={styles.input}>
      {splitContent.map((v,i,a) => {
        return <Fragment key={i}>
          {v}{i === a.length-1 ? '' : <br />}
        </Fragment>
      })}
      <textarea 
        ref={textarea}
        className={cx(styles.textarea, disableInput && styles.disabled)}
        placeholder="'sup?"
        value={content}
        required
        onKeyDown={onKeyDown}
        onInput={onChangeLocal}></textarea>
    </div>
    {disableInput ? <button type="button" onClick={() => stopSignal()} className={cx(styles.stop)}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 7H17V17H7V7Z" fill="currentColor" /></svg>
    </button> : <button type="submit" className={cx(styles.submit, content && !filesInQueue && styles.hasContent)}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.5858 13.4142L7.75735 10.5858L6.34314 12L10.5858 16.2427L17.6568 9.1716L16.2426 7.75739L10.5858 13.4142Z" fill="currentColor" /></svg>
    </button>}
    <div className={styles.warning}>
      LLms can make mistakes. Verify important information.
    </div>
  </form>

}