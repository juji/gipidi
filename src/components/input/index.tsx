'use client'

import { FormEvent, Fragment, useMemo, useState } from 'react'
import styles from './style.module.css'
import cx from 'classix'

export function Inputform(){

  const [content, setContent] = useState('')
  const splitContent = useMemo(() => {
    return content ? content.split('\n') : ['s']
  },[ content ])

  function onChangeLocal(e: FormEvent<HTMLTextAreaElement>){
    const target = e.target as HTMLTextAreaElement
    setContent(target.value)
  }

  function onSubmit(s:string){

  }

  function onSubmitLocal(e: FormEvent){
    e.preventDefault()
    if(!content) return;
    onSubmit(content)
    setContent('')
  }

  return <form className={styles.form} onSubmit={onSubmitLocal}>
    <div className={styles.input}>
      {splitContent.map((v,i,a) => {
        return <Fragment key={i}>
          {v}{i === a.length-1 ? '' : <br />}
        </Fragment>
      })}
      <textarea 
        className={styles.textarea}
        placeholder="What you up to?"
        value={content}
        required
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