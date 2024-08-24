'use client'
import { MouseEvent, useEffect, useMemo, useState } from 'react'
import styles from './style.module.css'
import { useConvo } from '@/lib/convoStore'
import { Menu, type MenuData } from './menu'

export function TopBar(){

  
  const [ title, setTitle ] = useState('')
  const activeConvo = useConvo(s => s.activeConvo)
  const setCurrentTitle = useConvo(s => s.setCurrentTitle)
  const convos = useConvo(s => s.convos)

  // set title when convo change
  const convo = useMemo(() => {
    if(!activeConvo) return null
    const convo = convos.find(v => v.id === activeConvo.id)
    return convo
  },[ activeConvo?.id, convos ])

  useEffect(() => {
    if(convo?.title) {
      setTitle(convo.title)
    }else{
      setTitle('')
    }
  },[ convo?.title ])

  // title
  function setTitleLocal( str: string ){
    if(activeConvo) setCurrentTitle(str)
    else setTitle(str)
  }

  // send info to chat creator
  const onCreateChat = useConvo(s => s.onCreateChat)
  const [ menuData, setMenuData ] = useState<MenuData|null>(null)

  useEffect(() => {
    if(!menuData) return;
    const { icon, modelName, ...rest } = menuData
    onCreateChat(() => ({
      title,
      providerIcon: icon,
      ...rest
    }))
  },[title, menuData ])
  
  // open close menu
  const [ menuOpen, setMenuOpen ] = useState(false)
  function openMenu(e: MouseEvent){
    if(!menuOpen) setMenuOpen(true)
  }

  function onCloseMenu(){
    setTimeout(() => {
      if(menuOpen) setMenuOpen(false)
    },150)
  }

  return <div className={styles.topbar}>
    <div className={styles.title}>
      <input className={styles.titleInput} type="text" 
        value={title}
        placeholder="untitled"
        onChange={(e) => setTitleLocal(e.target.value)}
      />
    </div>
    <div className={styles.menu}>
      <div className={styles.model}>
        <button className={styles.menuButton} onClick={openMenu}>
        { menuData?.modelName ? <span className={styles.name}>{menuData?.modelName}</span> : null}

        { menuData?.icon ? <span className={styles.icon}>
          <img className={styles.image} src={menuData?.icon} title={menuData?.modelName} />
        </span> : null}
        </button>
      </div>
      
      <Menu 
        openMenu={openMenu} 
        menuOpen={menuOpen}
        setMenuData={setMenuData}
        onCloseMenu={onCloseMenu}
      />

    </div>
  </div>

}