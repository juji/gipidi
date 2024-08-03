import { useEffect, useMemo, useRef, useState } from 'react'
import styles from './style.module.css'
import { Convo } from '@/lib/idb/types'
import { useConvo } from '@/lib/convoStore'
import { usePathname, useRouter } from 'next/navigation'
import cx from 'classix'

function Chat({ 
  convo,
  closeSidebar,
  active
}:{ 
  convo: Convo 
  closeSidebar: () => void,
  active: boolean
}){

  const deleteConvo = useConvo(s => s.deleteConvo)
  const loadConvo = useConvo(s => s.loadConvo)

  const pathname = usePathname()
  const router = useRouter()

  const [confirm, setConfirm] = useState(false)
  function remove(){
    deleteConvo(convo)
    setConfirm(false)
  }

  const to = useRef<ReturnType<typeof setTimeout>|null>(null)
  useEffect(() => {
    
    if(confirm) to.current = setTimeout(() => {
      if(confirm) setConfirm(false)
    },5000)

    return () => {
      to.current && clearTimeout(to.current)
      to.current = null
    }
  },[ confirm ])

  function onClickTitle(){
    loadConvo(convo)
    closeSidebar()
    if(pathname !== '/') router.push('/')
  }

  return <div className={cx(styles.chat, active && styles.active)} onMouseOut={() => {
    to.current && clearTimeout(to.current)
    setConfirm(false)
  }}>
      {active ? <div className={styles.border}></div> : null}
      <button className={styles.titleButton} onClick={() => onClickTitle()}>
        {convo.title||<span className={styles.untitled}>Untitled</span>}
      </button>
      <button 
        onClick={() => confirm ? remove() : setConfirm(true)}
        className={styles.removeButton}>
          { confirm ? 'Confirm Removal' : 
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.2253 4.81108C5.83477 4.42056 5.20161 4.42056 4.81108 4.81108C4.42056 5.20161 4.42056 5.83477 4.81108 6.2253L10.5858 12L4.81114 17.7747C4.42062 18.1652 4.42062 18.7984 4.81114 19.1889C5.20167 19.5794 5.83483 19.5794 6.22535 19.1889L12 13.4142L17.7747 19.1889C18.1652 19.5794 18.7984 19.5794 19.1889 19.1889C19.5794 18.7984 19.5794 18.1652 19.1889 17.7747L13.4142 12L19.189 6.2253C19.5795 5.83477 19.5795 5.20161 19.189 4.81108C18.7985 4.42056 18.1653 4.42056 17.7748 4.81108L12 10.5858L6.2253 4.81108Z" fill="currentColor" /></svg>
          }
      </button>
    </div>

}

export function ChatList({ closeSidebar }:{ closeSidebar: () => void }){

  const loading = useConvo(s => s.loading)
  const convos = useConvo(s => s.convos)
  const searchResult = useConvo(s => s.searchResult)
  const activeConvo = useConvo(s => s.activeConvo)

  const list = useMemo(() => {
    return searchResult ? searchResult : convos
  },[convos, searchResult])

  return <div className={styles.chatList}>
    {loading ? null : list.length ? list.map(v => {

      return <Chat key={v.id} 
        convo={v} 
        active={activeConvo?.id === v.id}
        closeSidebar={closeSidebar} />

    }) : <div className={styles.empty}>
      <p>{searchResult ? 'No Result...' : "No Conversation Yet..."}</p>
    </div>}
  </div>

}