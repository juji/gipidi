'use client'

import { type PropsWithChildren, useEffect, useMemo, useState } from 'react'
import styles from './style.module.css'
import cx from 'classix'
import { Montserrat } from "next/font/google";
import { ChatSearch } from '../chat-search';
import { ChatList } from '../chat-list';
import { Footer } from '../footer';
import { keyboardListeners } from '@/lib/keyboard-listeners';
import { useTitleCreator } from "@/lib/hooks/useTItleCreator"
import { usePathname } from 'next/navigation';

const montserrat = Montserrat({
  weight: "600",
  style: "normal",
  subsets: ["latin"]
})

export function Layout({ children }: PropsWithChildren){

  const [ open, setOpen ] = useState(false)
  const pathname = usePathname()
  const isHome = useMemo(() => pathname === '/', [ pathname ])

  useEffect(() => {
    keyboardListeners({
      searchBarId: 'searchconvo'
    })
  },[])

  useTitleCreator()

  function addNote(){
    if(isHome) window.location.reload()
    else window.location.pathname = '/'
    setOpen(false)
  }

  return <div className={cx(styles.layout, open && styles.open)}>
      <div className={styles.overlay} onClick={() => setOpen(false)}></div>
      <nav className={styles.nav}>
        <header className={styles.header}>
          <div className={styles.logo}>
            <a className={montserrat.className} target="_blank" href="/">GiPiDi'</a>
          </div>
          <button className={styles.plus} onClick={() => addNote()}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 4C11.4477 4 11 4.44772 11 5V11H5C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13H11V19C11 19.5523 11.4477 20 12 20C12.5523 20 13 19.5523 13 19V13H19C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11H13V5C13 4.44772 12.5523 4 12 4Z" fill="currentColor" /></svg>
          </button>
        </header>
        <ChatSearch />
        <ChatList closeSidebar={() => setOpen(false)} />
        <Footer />
      </nav>
      <div className={styles.content}>
        <header className={styles.header}>
          <button className={styles.menuBtn} onClick={() => setOpen(true)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 5.99519C2 5.44556 2.44556 5 2.99519 5H11.0048C11.5544 5 12 5.44556 12 5.99519C12 6.54482 11.5544 6.99039 11.0048 6.99039H2.99519C2.44556 6.99039 2 6.54482 2 5.99519Z" fill="currentColor" /><path d="M2 11.9998C2 11.4501 2.44556 11.0046 2.99519 11.0046H21.0048C21.5544 11.0046 22 11.4501 22 11.9998C22 12.5494 21.5544 12.9949 21.0048 12.9949H2.99519C2.44556 12.9949 2 12.5494 2 11.9998Z" fill="currentColor" /><path d="M2.99519 17.0096C2.44556 17.0096 2 17.4552 2 18.0048C2 18.5544 2.44556 19 2.99519 19H15.0048C15.5544 19 16 18.5544 16 18.0048C16 17.4552 15.5544 17.0096 15.0048 17.0096H2.99519Z" fill="currentColor" /></svg>
          </button>
          <div className={styles.logo}>
            <a className={montserrat.className} href="/">GiPiDi</a>
          </div>
          <button className={styles.plus} onClick={() => () => addNote()}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 4C11.4477 4 11 4.44772 11 5V11H5C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13H11V19C11 19.5523 11.4477 20 12 20C12.5523 20 13 19.5523 13 19V13H19C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11H13V5C13 4.44772 12.5523 4 12 4Z" fill="currentColor" /></svg>
          </button>
        </header>
        {children}
      </div>
    </div>

}