'use client'

import { useEffect, useRef, useState } from 'react';
import { convert } from './marked';
import cx from 'classix'
import styles from './style.module.css'
import './bubble.css'
import { ColorRing } from 'react-loader-spinner'
import { ConvoAttachment } from '@/lib/idb/types';
import { ChatAttachment } from '@/components/chat-attachment';

function Bubble({ 
  className,
  content,
  attachments,
  profilePict,
  last
}:{ 
  className: string 
  content: string
  attachments?: ConvoAttachment[] | null
  profilePict: string
  last?: boolean
}){

  const [ result, setResult ] = useState('')
  const ref = useRef<HTMLDivElement|null>(null)
  const bottomObserved = useRef<HTMLDivElement|null>(null)
  const [ changeCounter, setCounter ] = useState(0)
  const [ autoScroll, setAutoScroll ] = useState(!!last)

  const [ showDownArrow, setArrowDown ] = useState(false)
  useEffect(() => {
    let observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if(entry.isIntersecting) setArrowDown(false)
        else if(!autoScroll) setArrowDown(true)
      })
    }, { rootMargin: '1000px 0px -72px 0px' });
    bottomObserved.current && observer.observe(bottomObserved.current);
    return () => { observer.disconnect() }
  },[ autoScroll ])

  const lastTop = useRef(Infinity)
  const minTop = 72
  useEffect(() => {
    if(!autoScroll) return () => {}
    
    if(last && !(changeCounter % 5) && ref.current) {
      
      const top = ref.current.getBoundingClientRect().top
      if(top === lastTop.current && top <= minTop){
        setAutoScroll(false)
      }
      lastTop.current = top

      ref.current.scrollIntoView({ block: "start" })
      setCounter(0)

    }
  }, [ last, changeCounter, autoScroll ])

  useEffect(() => {
    if(!autoScroll) return () => {}
    setCounter(changeCounter+1)
  },[ content, autoScroll, showDownArrow ])

  useEffect(() => {

    Promise.resolve(convert(content))
    .then((res:string) => {
      setResult(res)
    })
    .catch(e => {
      console.error(e)
    })

  },[ content ])

  function scrollDown(){
    window.scrollBy({
      top: 144
    })
  }

  return <div ref={ref} className={cx(styles.bubble, className)}>
    <div className={styles.cloud}>
      {result ? 
        <>
          <div className={cx(styles.content, 'bubble-content')} 
            dangerouslySetInnerHTML={{ __html: result }} />
          {attachments && attachments.length ? <ChatAttachment
            columnNumber={attachments.length < 4 ? attachments.length : 4}
            files={attachments}
            className={styles.attachments}
          /> : null}
          {/* attachments */}
        </> : 
        <div className={cx(styles.content, 'bubble-content')}>
          <ColorRing
          visible={true}
          height="46"
          width="46"
          ariaLabel="color-ring-loading"
          wrapperStyle={{}}
          wrapperClass="color-ring-wrapper"
          colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
          />
        </div>
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


export function UserBubble({ content, attachments }: {
  content: string,
  attachments?: ConvoAttachment[] | null
}) {

  return <Bubble 
    className={styles.user} 
    content={content}
    attachments={attachments}
    profilePict={'/user.webp'}
  />

}

export function BotBubble({ content, last }:{ content: string, last?: boolean }){

  return <Bubble 
    className={styles.bot} 
    content={content}
    last={last} 
    profilePict={'/bot.webp'}
  />

}