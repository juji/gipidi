'use client'
import { ChangeEvent, MouseEvent, useEffect, useMemo, useRef, useState } from 'react'
import styles from './styles.module.css'
import useOnClickOutside from 'use-onclickoutside'
import cx from 'classix'
import { getDefaultProvider, getDefaultModel } from '@/lib/local-storage'
import { useGPT } from '@/lib/gptStore'
import { GPTModel } from '@/lib/vendors/types'
import { useConvo } from '@/lib/convoStore'
import { GPTProvider } from '@/lib/idb/types'

import { loadAll } from '@/lib/vendors/load'

export function TopBar(){

  const [ menu, setMenu ] = useState(false)
  const [ title, setTitle ] = useState('')

  const [ provider, setProvider ] = useState<GPTProvider['id']|null>(null)
  const [ model, setModel ] = useState<string|null>(null)

  const [ systemPrompt, setSystemPrompt ] = useState('')
  const loading = useGPT(s => s.loading)

  const activeConvo = useConvo(s => s.activeConvo)
  const convos = useConvo(s => s.convos)
  const onCreateChat = useConvo(s => s.onCreateChat)
  const setCurrentTitle = useConvo(s => s.setCurrentTitle)

  const convo = useMemo(() => {
    if(!activeConvo) return null
    const convo = convos.find(v => v.id === activeConvo.id)
    return convo
  },[ activeConvo, convos ])

  useEffect(() => {
    if(provider && model)
      onCreateChat(() => ({
        title, provider, model, systemPrompt
      }))
  },[title, provider, model, systemPrompt])


  // title
  function setTitleLocal( str: string ){
    if(activeConvo) setCurrentTitle(str)
    else setTitle(str)
  }

  useEffect(() => {
    if(!convo) return;
    if(title === convo.title) return;
    setTitle(convo.title)
  },[ convo?.title ])

  useEffect(() => {
    if(activeConvo) {
      setProvider(activeConvo.provider)
      setModel(activeConvo.model)
      convo && setTitle(convo.title)
    }else{
      setTitle('')
      setProvider(getDefaultProvider())
      setModel(getDefaultModel())
    }
  },[ activeConvo ])
  
  // open close
  function openMenu(e: MouseEvent){
    if(!menu) setMenu(true)
  }
  
  function onCloseMenu(){
    setTimeout(() => {
      if(menu) setMenu(false)
    },150)
  }
  const ref = useRef<HTMLDivElement|null>(null)
  useOnClickOutside(ref, onCloseMenu)

  // activate deactivate system prompt
  const [ systemPromptSel, setSystemPromptSel ] = useState(true)
  useEffect(() => {
    if(provider === 'gemini'){
      setSystemPromptSel(false)
      setSystemPrompt('')
    }else{
      setSystemPromptSel(true)
    }
  },[ provider ])

  const [modelSelection, setModelSelection] = useState<any|null>(null)
  useEffect(() => {
    if(loading) return () => {}

    loadAll().then(async all => {
      const models = await Promise.all(Object.values(all).map(v => v.models()))
      setModelSelection(Object.keys(all).reduce((a,b,i) => {
        a[b as GPTProvider['id']] = models[i]
        return a  
      },{} as {[key in GPTProvider['id']]: GPTModel[]}))
    })

  },[ loading ])

  function onChangeModel(e: ChangeEvent){
    const target = e.target as HTMLSelectElement
    if(!target.value) {
      setProvider(null)
      setModel(null)
    }
    const val = target.value.split('|')
    setProvider(val[0] as GPTProvider['id']); 
    setModel(val[1])
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
      <div className={styles.modelName}>
        { provider && model && 
          modelSelection && modelSelection[provider] 
        ? modelSelection[provider].find((v:GPTModel) => v.id === model).name : null}
      </div>
      <div className={styles.menuContainer}>
        <button className={styles.menuButton} onClick={openMenu}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M7 3C8.86384 3 10.4299 4.27477 10.874 6H19V8H10.874C10.4299 9.72523 8.86384 11 7 11C4.79086 11 3 9.20914 3 7C3 4.79086 4.79086 3 7 3ZM7 9C8.10457 9 9 8.10457 9 7C9 5.89543 8.10457 5 7 5C5.89543 5 5 5.89543 5 7C5 8.10457 5.89543 9 7 9Z" fill="currentColor" /><path fillRule="evenodd" clipRule="evenodd" d="M17 20C15.1362 20 13.5701 18.7252 13.126 17H5V15H13.126C13.5701 13.2748 15.1362 12 17 12C19.2091 12 21 13.7909 21 16C21 18.2091 19.2091 20 17 20ZM17 18C18.1046 18 19 17.1046 19 16C19 14.8954 18.1046 14 17 14C15.8954 14 15 14.8954 15 16C15 17.1046 15.8954 18 17 18Z" fill="currentColor" /></svg>
        </button>
        <div className={cx(styles.menuContent, menu && styles.menuOpen)} ref={ref}>
          
          {activeConvo ? <p className={styles.noedit}>
            Cannot edit settings on an active conversation
          </p> : null}

          <h4 className={styles.menuHeader}>Model</h4>

          <div className={styles.selectWrapper}>
            <select 
              disabled={!!activeConvo}
              className={styles.select}
              value={provider && model ? `${provider}|${model}` : ''}
              onChange={onChangeModel}
            >
              {/* <option value={""}></option> */}
              {modelSelection && Object.keys(modelSelection).map(v => {

                return <optgroup label={v}>
                  {modelSelection[v].map((m:GPTModel) => <option key={m.id} value={`${v}|${m.id}`}>{m.name}</option>)}
                </optgroup>

              })}
            </select>
            <svg className={styles.chevronDown} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.34317 7.75732L4.92896 9.17154L12 16.2426L19.0711 9.17157L17.6569 7.75735L12 13.4142L6.34317 7.75732Z" fill="currentColor" /></svg>
          </div>

          { systemPromptSel ? <>
            <h4 className={styles.menuHeader}>System Prompt</h4>
            <textarea 
              value={systemPrompt}
              disabled={!!activeConvo}
              rows={5}
              onChange={e => setSystemPrompt(e.target.value)}
              className={styles.systemPrompt}></textarea>
          </> : <p className={styles.systemPromptDisabled}>System prompt disabled for this model</p>}
          
        </div>
      </div>
    </div>
  </div>

}