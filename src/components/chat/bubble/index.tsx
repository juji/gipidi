'use client'

import { useEffect, useRef, useState } from 'react';
import { convert } from './marked';
import cx from 'classix'
import styles from './style.module.css'
import './bubble.css'
import { ColorRing } from 'react-loader-spinner'

function Bubble({ 
  className,
  content,
  profilePict,
  last
}:{ 
  className: string 
  content: string 
  profilePict: string
  last?: boolean
}){

  const [ result, setResult ] = useState('')
  const ref = useRef<HTMLDivElement|null>(null)
  const interObserver = useRef<HTMLDivElement|null>(null)
  const [changeCounter, setCounter] = useState(0)
  const [autoScroll, setAutoScroll ] = useState(true)

  useEffect(() => {
    if(!last) return;
    function callback(entries: IntersectionObserverEntry[]){
      entries.forEach((entry: IntersectionObserverEntry) => {

        console.log('entry.isIntersecting', entry.isIntersecting)
        if(!entry.isIntersecting)
          setAutoScroll(entry.isIntersecting)
      });
    }

    let observer = new IntersectionObserver(callback, {
      rootMargin: '-80px 0px 0px 0px'
    });
    interObserver.current && observer.observe(interObserver.current);
  },[ last ])

  useEffect(() => {
    if(!autoScroll) return () => {}
    if(last && !(changeCounter % 5)) {
      ref.current?.scrollIntoView({
        block: "start"
      })
      setCounter(0)
    }
  }, [ last, changeCounter, autoScroll ])

  useEffect(() => {
    console.log('autoScroll', autoScroll)
    if(!autoScroll) return () => {}
    setCounter(changeCounter+1)
  },[ content, autoScroll ])

  useEffect(() => {

    setResult(result)
    Promise.resolve(convert(content))
    .then((res:string) => {
      setResult(res)
    })
    .catch(e => {
      console.error(e)
    })

  },[ content ])

  return <div ref={ref} className={cx(styles.bubble, className)}>
    <div ref={interObserver} className={styles.interObserver}></div>
    <div className={styles.cloud}>
      { result ? 
        <div className={cx(styles.content, 'bubble-content')} 
          dangerouslySetInnerHTML={{ __html: result || '...'}} /> : 
        <div className={cx(styles.content, 'bubble-content')}>
          <ColorRing
          visible={true}
          height="34"
          width="34"
          ariaLabel="color-ring-loading"
          wrapperStyle={{}}
          wrapperClass="color-ring-wrapper"
          colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
          />
        </div>
      }
      
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

export function BotBubble({ content, last }:{ content: string, last?: boolean }){

  return <Bubble 
    className={styles.bot} 
    content={content}
    last={last} 
    profilePict={'/bot.webp'}
  />

}