'use client'

import { type PropsWithChildren, useEffect, useMemo, useRef, useState } from 'react'
import styles from './style.module.css'
import cx from 'classix'
import { Montserrat } from "next/font/google";
import { ChatSearch } from '../chat-search';
import { ChatList } from '../chat-list';
import { Footer } from '../footer';
import { keyboardListeners } from '@/lib/keyboard-listeners';
import { useTitleCreator } from "@/lib/hooks/useTitleCreator"
import { usePathname } from 'next/navigation';
import { removeHistory } from '@/lib/removeHistory';
import { getCC } from '@/lib/get-country-code';
import { saveCountryCode } from '@/lib/local-storage';
import { getCurrentPosition, watchPosition } from "@tauri-apps/plugin-geolocation";


const montserrat = Montserrat({
  weight: "600",
  style: "normal",
  subsets: ["latin"]
})

export function Layout({ children }: PropsWithChildren){

  const [ openMenu, setOpenMenu ] = useState(false)
  const pathname = usePathname()
  const isHome = useMemo(() => pathname === '/', [ pathname ])

  useEffect(() => {
    keyboardListeners({
      searchBarId: 'searchconvo'
    })
  },[])

  useEffect(() => {
    removeHistory()
  },[])

  useEffect(() => {
    getCC().then((cc) => {
      saveCountryCode(cc)
    })
  },[])

  const isWatching = useRef(false)
  useEffect(() => {
    if(isWatching.current) return;
    isWatching.current = true

    // getCurrentPosition(
    //   { enableHighAccuracy: false, timeout: 5000, maximumAge: 1000 }
    // ).then(v => console.log('v', v))

    // navigator.permissions.query({ name: "geolocation" }).then((result) => {
    //   console.log('geolocation permission', result)
    //   navigator.geolocation.getCurrentPosition(
    //     (pos) => { console.log('navigator', pos) },
    //     err => console.error(err)
    //   )
    // })

    // this is currently not working
    watchPosition(
      { enableHighAccuracy: false, timeout: 5000, maximumAge: 1000 },
      (pos) => {
        console.debug('pos', pos);
      }
    ).catch(e => console.error('watchPosition ERROR', e))
    // watchPos()
  },[])

  useTitleCreator()

  function addNote(){
    if(isHome) window.location.reload()
    else window.location.pathname = '/'
    setOpenMenu(false)
  }

  // slide right
  

  return <div className={cx(styles.layout, openMenu && styles.open)}>
      <div className={styles.overlay} onClick={() => setOpenMenu(false)}></div>
      <nav className={styles.sidebar}>
        <header className={styles.header}>
          <div className={styles.logo}>
            <a className={montserrat.className} href="/">GiPiDi'</a>
          </div>
          <button className={styles.plus} onClick={() => addNote()}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 4C11.4477 4 11 4.44772 11 5V11H5C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13H11V19C11 19.5523 11.4477 20 12 20C12.5523 20 13 19.5523 13 19V13H19C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11H13V5C13 4.44772 12.5523 4 12 4Z" fill="currentColor" /></svg>
          </button>
        </header>
        <ChatSearch />
        <ChatList closeSidebar={() => setOpenMenu(false)} />
        <Footer />
      </nav>
      <div className={styles.content}>
        <header className={styles.header}>
          <button className={styles.menuBtn} onClick={() => setOpenMenu(true)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 5.99519C2 5.44556 2.44556 5 2.99519 5H11.0048C11.5544 5 12 5.44556 12 5.99519C12 6.54482 11.5544 6.99039 11.0048 6.99039H2.99519C2.44556 6.99039 2 6.54482 2 5.99519Z" fill="currentColor" /><path d="M2 11.9998C2 11.4501 2.44556 11.0046 2.99519 11.0046H21.0048C21.5544 11.0046 22 11.4501 22 11.9998C22 12.5494 21.5544 12.9949 21.0048 12.9949H2.99519C2.44556 12.9949 2 12.5494 2 11.9998Z" fill="currentColor" /><path d="M2.99519 17.0096C2.44556 17.0096 2 17.4552 2 18.0048C2 18.5544 2.44556 19 2.99519 19H15.0048C15.5544 19 16 18.5544 16 18.0048C16 17.4552 15.5544 17.0096 15.0048 17.0096H2.99519Z" fill="currentColor" /></svg>
          </button>
          <div className={styles.logo}>
            <a className={montserrat.className} href="/">GiPiDi'</a>
          </div>
          <button className={styles.plus} onClick={() => addNote()}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 4C11.4477 4 11 4.44772 11 5V11H5C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13H11V19C11 19.5523 11.4477 20 12 20C12.5523 20 13 19.5523 13 19V13H19C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11H13V5C13 4.44772 12.5523 4 12 4Z" fill="currentColor" /></svg>
          </button>
        </header>
        {children}
      </div>
    </div>

}