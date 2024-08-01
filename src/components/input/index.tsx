'use client'

import { FormEvent, Fragment, useMemo, useRef, useState, KeyboardEvent, useEffect } from 'react'
import styles from './style.module.css'
import cx from 'classix'
import { useConvo } from '@/lib/convoStore'

export function Inputform(){

  const [content, setContent] = useState('')
  const activeConvo = useConvo(s => s.activeConvo)
  const createConvo = useConvo(s => s.createConvo)
  const addUserText = useConvo(s => s.addUserText)
  const isStreaming = useConvo(s => s.isStreaming)

  const splitContent = useMemo(() => {
    return content ? content.split('\n') : ['s']
  },[ content ])

  function onChangeLocal(e: FormEvent<HTMLTextAreaElement>){
    const target = e.target as HTMLTextAreaElement
    setContent(target.value)
  }

  function onSubmit( content:string ){
    if(!activeConvo){
      createConvo( content )
    }else{
      addUserText( content )
    }
  }

  function onSubmitLocal(e: FormEvent){
    e.preventDefault()
    if(isStreaming) return;
    if(!content) return;
    onSubmit(content)
    setContent('')
  }

  const form = useRef<HTMLFormElement|null>(null)
  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>){
    if(
      (e.metaKey || e.ctrlKey) &&
      e.key === 'Enter'
    ){
      if(isStreaming) return;
      if(!content) return;
      onSubmit(content)
      setContent('')
    }
  }

  const textarea = useRef<HTMLTextAreaElement|null>(null)
  useEffect(() => {
    textarea.current && (textarea.current as HTMLTextAreaElement).focus()
  },[])

  return <form className={styles.form} onSubmit={onSubmitLocal} ref={form}>
    <div className={styles.input}>
      {splitContent.map((v,i,a) => {
        return <Fragment key={i}>
          {v}{i === a.length-1 ? '' : <br />}
        </Fragment>
      })}
      <textarea 
        ref={textarea}
        className={styles.textarea}
        placeholder="'sup?"
        value={content}
        required
        onKeyDown={onKeyDown}
        onInput={onChangeLocal}></textarea>
    </div>
    <button type="submit" className={cx(styles.submit, content && styles.hasContent)}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.5858 13.4142L7.75735 10.5858L6.34314 12L10.5858 16.2427L17.6568 9.1716L16.2426 7.75739L10.5858 13.4142Z" fill="currentColor" /></svg>
    </button>
    <div className={styles.warning}>
      LLms can make mistakes. Verify important information.
    </div>
  </form>

}