'use client'

import { useEffect, useRef, useState } from 'react';
import { convert } from './marked';
import cx from 'classix'
import styles from './style.module.css'
import './bubble.css'

function Bubble({ 
  className,
  content,
  profilePict
}:{ 
  className: string 
  content: string 
  profilePict: string
}){

  const [ result, setResult ] = useState('')
  const ref = useRef<HTMLDivElement|null>(null)

  useEffect(() => {

    setResult(result + '...')
    Promise.resolve(convert(content))
    .then((res:string) => {
      setResult(res)
    })

  },[ content ])

  return <div ref={ref} className={cx(styles.bubble, className)}>
    <div className={styles.cloud}>
      <div className={cx(styles.content, 'bubble-content')} 
        dangerouslySetInnerHTML={{ __html: result}} />
    </div>
    <img className={styles.pict} src={profilePict} />
    <div className={styles.gap}></div>
  </div>

}


export function UserBubble({ content }:{ content: string }){

  return <Bubble 
    className={styles.user} 
    content={content} 
    profilePict={'/user.webp'}
  />

}

export function BotBubble({ content }:{ content: string }){

  return <Bubble 
    className={styles.bot} 
    content={content} 
    profilePict={'/bot.webp'}
  />

}