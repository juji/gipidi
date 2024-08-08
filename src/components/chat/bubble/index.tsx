'use client'

import { ReactElement, ReactNode, useEffect, useRef, useState } from 'react';
import { convert } from './marked';
import cx from 'classix'
import styles from './style.module.css'
import './bubble.css'
import { ColorRing } from 'react-loader-spinner'
import { ConvoData } from '@/lib/idb/types';
import { ChatAttachment } from '@/components/chat-attachment';
import { useTextStream } from './useTextStream';
import { markedToReact } from './marked-to-react';


function Bubble({ 
  className,
  profilePict,
  data,
}:{ 
  className: string 
  profilePict: string
  data: ConvoData
}){

  const [ text, setText ] = useTextStream()
  const [ result, setResult ] = useState('')

  const attachments = useRef(data.attachments)
  const isUser = data.role === 'user'
  
  // this is set only once
  const isNewText = useRef(
    data.role === 'assistant' && 
    (new Date().valueOf() - data.lastUpdate.valueOf()) < 3000 // kira-kira aja
  )

  useEffect(() => {
    
    if(isNewText.current){
      setText(data.content)
    }else{
      Promise.resolve(convert(data.content)).then((res:string) => {
        setResult(res)
      }).catch(e => {
        console.error(e)
      })
    }
    
  },[ data.content ])
  
  const [ autoScroll, setAutoScroll ] = useState(!!isNewText.current)
  const container = useRef<HTMLDivElement|null>(null)
  const bottomObserved = useRef<HTMLDivElement|null>(null)
  const [ showDownArrow, setArrowDown ] = useState(false)
  const minTop = 72

  useEffect(() => {
    // not useing arrow from user
    if(isUser) return;

    let observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if(entry.isIntersecting) setArrowDown(false)
        else if(!autoScroll) setArrowDown(true)
      })
    }, { rootMargin: `1000px 0px -${minTop}px 0px` });
    bottomObserved.current && observer.observe(bottomObserved.current);
    return () => { observer.disconnect() }
  },[ autoScroll, isUser ])

  useEffect(() => {
    if(!autoScroll) return () => {}
    if(!container.current) return () => {}
    if(!isNewText.current) return () => {}

    const top = container.current.getBoundingClientRect().top
    const shouldScroll = top > minTop

    if(shouldScroll){
      container.current.scrollIntoView({ block: "start" })
    }else{
      setAutoScroll(false)
    }

  },[ text, autoScroll ])

  function scrollDown(){
    window.scrollBy({
      top: 256
    })
  }

  const [ content, setContent ] = useState<ReactElement>()
  useEffect(() => {
    if(result||text) setContent(markedToReact(result||text))
  },[ result, text ])

  return <div ref={container} className={cx(styles.bubble, className)}>
    <div className={styles.cloud}>
      { content ? 
        <>
          <div className={cx(styles.content, 'bubble-content')}>{content}</div>
          
          {attachments.current && attachments.current.length ? <ChatAttachment
            columnNumber={attachments.current.length < 4 ? attachments.current.length : 4}
            width={attachments.current.length < 4 ? 25 * attachments.current.length +'%' : undefined}
            files={attachments.current}
            className={styles.attachments}
          /> : null}
          {/* attachments */}
        </> : 
        isNewText.current ? <div className={cx(styles.content, 'bubble-content')}>
        <ColorRing
        visible={true}
        height="46"
        width="46"
        ariaLabel="color-ring-loading"
        wrapperClass="color-ring-wrapper"
        colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
        />
      </div> : <p style={{color: 'grey'}}>[NO DATA]</p>
        
      }
    </div>
    <img className={styles.pict} src={profilePict} />
    <div className={styles.gap}>
      <button 
        onClick={() => scrollDown()}
        className={cx(styles.down, showDownArrow && styles.shown)}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.0001 3.67157L13.0001 3.67157L13.0001 16.4999L16.2426 13.2574L17.6568 14.6716L12 20.3284L6.34314 14.6716L7.75735 13.2574L11.0001 16.5001L11.0001 3.67157Z" fill="currentColor" /></svg>
      </button>
    </div>
    <div ref={bottomObserved} className={styles.bottomObserved}></div>
  </div>

}


export function UserBubble({ data }: { data: ConvoData }) {

  return <Bubble 
    className={styles.user} 
    data={data}
    profilePict={'/user.webp'}
  />

}

export function BotBubble({ data }: { data: ConvoData }){

  return <Bubble 
    className={styles.bot} 
    data={data}
    profilePict={'/bot.webp'}
  />

}