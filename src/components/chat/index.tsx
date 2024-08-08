'use client'
import { UserBubble, BotBubble } from "./bubble"
import { useConvo } from "@/lib/convoStore"
import { useGptListener } from '@/lib/hooks/useGptListener'
import { ConvoDetail } from "@/lib/idb/types"

export function ChatBubbles({ activeConvo }:{ activeConvo: ConvoDetail }){

  return <div>
    {activeConvo.data.map((v, i, a) => {

      return v.role === 'user' ?
          <UserBubble key={v.id} data={v} /> :
        v.role === 'assistant' ? 
          <BotBubble key={v.id} data={v} /> : 
        null

    })}
  </div>

}

export function Chat(){

  const activeConvo = useConvo(s => s.activeConvo)
  useGptListener()

  return activeConvo ? <ChatBubbles activeConvo={activeConvo} /> : null

}