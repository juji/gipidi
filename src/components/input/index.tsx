'use client'

import { FormEvent, Fragment, useMemo, useRef, useState, KeyboardEvent } from 'react'
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

  return <form className={styles.form} onSubmit={onSubmitLocal} ref={form}>
    <div className={styles.input}>
      {splitContent.map((v,i,a) => {
        return <Fragment key={i}>
          {v}{i === a.length-1 ? '' : <br />}
        </Fragment>
      })}
      <textarea 
        className={styles.textarea}
        placeholder="'sup?"
        value={content}
        required
        onKeyDown={onKeyDown}
        onInput={onChangeLocal}></textarea>
    </div>
    <button type="submit" className={cx(styles.submit, content && styles.hasContent)}>
      <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path d="M3.47 7.78a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0l4.25 4.25a.751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018L9 4.81v7.44a.75.75 0 0 1-1.5 0V4.81L4.53 7.78a.75.75 0 0 1-1.06 0Z"></path></svg>
    </button>
    <div className={styles.warning}>
      LLms can make mistakes. Verify important information.
    </div>
  </form>

}