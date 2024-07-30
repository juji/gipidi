'use client'
import { useEffect } from "react"
import { UserBubble, BotBubble } from "./bubble"
import { example } from "./example"
import styles from './style.module.css'

export function Chat(){

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({
        top: document.documentElement.scrollHeight - window.innerHeight,
        left: 0,
      })
    },500)
  },[])

  return <div className={styles.chat}>
    {example.map((v) => {

      return v.type === 'u' ?
        <UserBubble key={v.id} content={v.content} /> :
        <BotBubble key={v.id} content={v.content} />

    })}
  </div>

}