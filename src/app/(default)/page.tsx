'use client'

import styles from "./page.module.css";
import { useEffect, useState } from "react";
import cx from "classix";
import { getDefaultModel, getDefaultProvider } from "@/lib/local-storage";
import { useGPT } from '@/lib/gptStore'

import { Inputform } from "@/components/input";
import { TopBar } from "@/components/topbar";
import { Chat } from "@/components/chat";
import { useConvo } from "@/lib/convoStore";


export default function Home() {

  const [scrolledUp, setScrolledUp] = useState(false)
  const loading = useGPT(s => s.loading)
  const providers = useGPT(s => s.providers)
  const activeConvo = useConvo(s => s.activeConvo)

  // check if initial settings are done
  // and redirect
  useEffect(() => {
    if(loading) return () => {}
    if( 
      !providers.length || 
      !getDefaultProvider() ||
      !getDefaultModel()
    ) 
      window.location.href = '/settings?notify=Setup%20Your%20GPT%20Providers%20and%20Default%20Model'
  },[ loading, providers ])

  // show header on scroll up
  useEffect(() => {

    let initScroll = window.scrollY
    let currentScroll = initScroll
    function onScroll(){
      
      currentScroll = window.scrollY
      if(currentScroll < initScroll && !scrolledUp){
        setScrolledUp(true)
      }
      
      else if(currentScroll > initScroll &&  scrolledUp){
        setScrolledUp(false)
      }
      
      initScroll = currentScroll

    }
    document.addEventListener('scroll', onScroll)

    return () => {
      document.removeEventListener('scroll', onScroll)
    }

  },[ scrolledUp ])

  // loader, basically just a dark screen
  const [ loaderOff, setLoaderOff ] = useState(false)
  useEffect(() => {
    setLoaderOff(false)
    setTimeout(() => {
      setLoaderOff(true)
    },200)
  },[ activeConvo?.id ])

  // scroll down
  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({
        top: document.documentElement.scrollHeight - window.innerHeight,
        left: 0,
      })
    },500)
  },[ activeConvo?.id ])

  return (
    <div className={styles.page}>
      <div className={cx( styles.topbar, scrolledUp && styles.scrolledUp )}>
        <div className={styles.content}>
          <TopBar />
        </div>
      </div>
      <div className={styles.chat}>
        <div className={cx(styles.loader, loaderOff && styles.off)}></div>
        <div className={styles.content}>
          <div></div>
          <div>
            <Chat />
          </div>
        </div>
      </div>
      <div className={styles.input}>
        <div className={styles.content}>
          <Inputform />
        </div>
      </div>
    </div>
  );
}
