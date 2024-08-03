'use client'
import { useEffect } from "react"
import { UserBubble, BotBubble } from "./bubble"
// import { example } from "./example"
import styles from './style.module.css'
import { useConvo } from "@/lib/convoStore"
import { useGptListener } from '@/lib/hooks/useGptListener'

export function Chat(){

  const activeConvo = useConvo(s => s.activeConvo)
  useGptListener()

  return <>
    <div className={styles.chat}>
    {activeConvo && activeConvo.data.map((v, i, a) => {

      return v.role === 'user' ?
        <UserBubble key={v.id} content={v.content} attachments={v.attachments} /> :
        i === (a.length - 1) ? 
          <BotBubble key={v.id} last={true} content={v.content} /> :
          <BotBubble key={v.id} content={v.content} />

    })}
    </div>
  </>

}