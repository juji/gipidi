'use client'
import { UserBubble, BotBubble } from "./bubble"
// import { example } from "./example"
import { useConvo } from "@/lib/convoStore"
import { useGptListener } from '@/lib/hooks/useGptListener'
import { ConvoDetail } from "@/lib/idb/types"

export function ChatBubbles({ activeConvo }:{ activeConvo: ConvoDetail }){

  return <div>
    {activeConvo.data.map((v, i, a) => {

      return v.role === 'user' ?
        <UserBubble key={v.id} content={v.content} attachments={v.attachments} /> :
        i === (a.length - 1) ? 
          <BotBubble key={v.id} last={true} content={v.content} /> :
          <BotBubble key={v.id} content={v.content} />

    })}
  </div>

}

export function Chat(){

  const activeConvo = useConvo(s => s.activeConvo)
  useGptListener()

  return activeConvo ? <ChatBubbles activeConvo={activeConvo} /> : null

}