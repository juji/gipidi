'use client'

import styles from "./page.module.css";
import { useEffect, useState } from "react";
import cx from "classix";
import { getDefaultModel, getDefaultProvider } from "@/lib/local-storage";
import { useGPT } from '@/lib/gptStore'

import { Inputform } from "@/components/input";
import { TopBar } from "@/components/topbar";
import { Chat } from "@/components/chat";


export default function Home() {

  const [scrolledUp, setScrolledUp] = useState(false)
  const loading = useGPT(s => s.loading)
  const providers = useGPT(s => s.providers)

  useEffect(() => {
    if(loading) return () => {}
    if( 
      !providers.length || 
      !getDefaultProvider() ||
      !getDefaultModel()
    ) 
      window.location.href = '/settings?notify=Setup%20Your%20GPT%20Providers%20and%20Default%20Model'
  },[ loading, providers ])

  useEffect(() => {

    let initScroll = window.scrollY
    let currentScroll = initScroll
    function onScroll(){
      
      currentScroll = window.scrollY
      if(
        currentScroll < initScroll &&
        !scrolledUp
      ){
        setScrolledUp(true)
      }else if(
        currentScroll > initScroll && 
        scrolledUp
      ){
        setScrolledUp(false)
      }
      initScroll = currentScroll

    }
    document.addEventListener('scroll', onScroll)

    return () => {
      document.removeEventListener('scroll', onScroll)
    }

  },[ scrolledUp ])

  const [ loaderOff, setLoaderOff ] = useState(false)
  useEffect(() => {
    setTimeout(() => {
      setLoaderOff(true)
    },500)
  },[])

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
