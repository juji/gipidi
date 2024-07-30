'use client'

import { Chat } from "@/components/chat";
import styles from "./page.module.css";
import { Inputform } from "@/components/input";
import { TopBar } from "@/components/topbar";
import { useEffect, useState } from "react";
import cx from "classix";

export default function Home() {

  const [scrolledUp, setScrolledUp] = useState(false)

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

  return (
    <div className={styles.page}>
      <div className={cx( styles.topbar, scrolledUp && styles.scrolledUp )}>
        <div className={styles.content}>
          <TopBar />
        </div>
      </div>
      <div className={styles.chat}>
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
