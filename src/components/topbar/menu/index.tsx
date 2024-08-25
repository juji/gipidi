import { ChangeEvent, MouseEventHandler, useEffect, useId, useRef, useState } from 'react'
import styles from './style.module.css'
import cx from 'classix'
import { useConvo } from '@/lib/convoStore'
import { GPTProvider } from '@/lib/idb/types'
import { useGPT } from '@/lib/gptStore'
import { type GPTModel } from '@/lib/vendor/types'
import { getDefaultProvider, getDefaultModel } from '@/lib/local-storage'
import useOnClickOutside from 'use-onclickoutside'
import { EmbeddingSelect } from './embedding-select'

export type ProviderData = {
  provider: GPTProvider['id']
  model: string
  icon: string
  modelName: string
}

export type MenuData = ProviderData & {
  systemPrompt: string
  embeddingId?: string
}

export function Menu({
  openMenu,
  menuOpen,
  setMenuData,
  onCloseMenu
}:{
  openMenu: MouseEventHandler<HTMLButtonElement>
  menuOpen: boolean
  setMenuData: (m: MenuData) => void
  onCloseMenu: () => void
}){

  const ref = useRef<HTMLDivElement|null>(null)
  useOnClickOutside(ref, onCloseMenu)

  const activeConvo = useConvo(s => s.activeConvo)
  const providers = useGPT(s => s.providers)
  const loading = useGPT(s => s.loading)
  const getAllModels = useGPT(s => s.getAllModels)
  const [ systemPrompt, setSystemPrompt ] = useState('')

  const [modelSelection, setModelSelection] = useState<any|null>(null)
  useEffect(() => {
    if(loading) return () => {}

    getAllModels().then(providerModels => {

      setModelSelection(providerModels.reduce((a,b) => {
        a[b.provider.id] = b.models
        return a  
      },{} as {[key in GPTProvider['id']]: GPTModel[]}))

    })

  },[ loading ])

  const [ embeddingId, setEmbeddingId ] = useState<string|undefined>(undefined)
  useEffect(() => {
    if(activeConvo?.embeddingId === embeddingId) return;
    setEmbeddingId(activeConvo?.embeddingId)
  },[ activeConvo?.embeddingId ])
  
  // report to parent about current state
  const [ providerData, setProviderData ] = useState<ProviderData|null>(null)
  useEffect(() => {
    if(providerData)
    setMenuData({ systemPrompt, embeddingId, ...providerData })
  },[ providerData, systemPrompt, embeddingId ])

  const modelSelId = useId()
  function onChangeModel(e: ChangeEvent){
    const target = e.target as HTMLSelectElement
    if(!target.value) {
      setProviderData(null)
    }
    const val = target.value.split('|')

    setProviderData({
      provider: val[0] as GPTProvider['id'],
      model: val[1],
      modelName: modelSelection && modelSelection[val[0]] ?
        modelSelection[val[0]].find((v:GPTModel) => v.id === val[1]).name : '',
      icon: providers.find(v => v.id === val[0])?.icon || ''
    })

    // force the ui to change
    document.getElementById(modelSelId)?.blur()
  }


  useEffect(() => {
    if(!modelSelection) return () => {}

    if(activeConvo) {
      // when convo becomes active

      activeConvo.systemPrompt && setSystemPrompt(activeConvo.systemPrompt)
      const modelSel = modelSelection[activeConvo.provider]
      setProviderData({
        provider: activeConvo.provider, 
        model: activeConvo.model,
        icon: providers.find(v => v.id === activeConvo.provider)?.icon || '',
        modelName: modelSel?.find((v:GPTModel) => v.id === activeConvo.model).name || '',
      })
      
    }else{

      // initial
      setSystemPrompt('')

      const defaultProvider = getDefaultProvider()
      const provider = providers.find(v => v.id === defaultProvider)
      const defaultModel = getDefaultModel()
      if(!defaultProvider) return;
      if(!defaultModel) return;
      const modelSel = modelSelection[defaultProvider]
      setProviderData({
        provider: defaultProvider,
        model: defaultModel,
        icon: provider?.icon || '',
        modelName: modelSel?.find((v:GPTModel) => v.id === defaultModel).name || '',
      })
    }
  },[ activeConvo?.provider, modelSelection ])

  return <div className={styles.menuContainer}>
  <button className={styles.menuButton} onClick={openMenu}>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M7 3C8.86384 3 10.4299 4.27477 10.874 6H19V8H10.874C10.4299 9.72523 8.86384 11 7 11C4.79086 11 3 9.20914 3 7C3 4.79086 4.79086 3 7 3ZM7 9C8.10457 9 9 8.10457 9 7C9 5.89543 8.10457 5 7 5C5.89543 5 5 5.89543 5 7C5 8.10457 5.89543 9 7 9Z" fill="currentColor" /><path fillRule="evenodd" clipRule="evenodd" d="M17 20C15.1362 20 13.5701 18.7252 13.126 17H5V15H13.126C13.5701 13.2748 15.1362 12 17 12C19.2091 12 21 13.7909 21 16C21 18.2091 19.2091 20 17 20ZM17 18C18.1046 18 19 17.1046 19 16C19 14.8954 18.1046 14 17 14C15.8954 14 15 14.8954 15 16C15 17.1046 15.8954 18 17 18Z" fill="currentColor" /></svg>
  </button>
  <div className={cx(styles.menuContent, menuOpen && styles.menuOpen)} ref={ref}>
    
    { activeConvo?.id ? <EmbeddingSelect 
      setEmbeddingId={setEmbeddingId}
      embeddingId={embeddingId}
    /> : null }

    {activeConvo?.id ? <p className={styles.noedit}>
      Can't edit the following on an active conversation
    </p> : null}

    <h4 className={styles.menuHeader}>Model</h4>

    <div className={styles.selectWrapper}>
      <select 
        disabled={!!activeConvo}
        className={styles.select}
        value={providerData?.provider && providerData?.model ? `${providerData?.provider}|${providerData?.model}` : ''}
        onChange={onChangeModel}
        id={modelSelId}
      >
        {modelSelection && Object.keys(modelSelection).map(v => {

          return <optgroup key={v} label={v}>
            {modelSelection[v].map((m:GPTModel) => <option 
              key={m.id} value={`${v}|${m.id}`}>{m.name}</option>)}
          </optgroup>

        })}
      </select>
      <svg className={styles.chevronDown} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.34317 7.75732L4.92896 9.17154L12 16.2426L19.0711 9.17157L17.6569 7.75735L12 13.4142L6.34317 7.75732Z" fill="currentColor" /></svg>
    </div>
    
    <h4 className={styles.menuHeader}>System Prompt</h4>
    <textarea 
      value={systemPrompt}
      disabled={!!activeConvo}
      rows={5}
      onChange={e => setSystemPrompt(e.target.value)}
      className={styles.systemPrompt}></textarea>

    { activeConvo?.id ? null : <EmbeddingSelect 
      setEmbeddingId={setEmbeddingId}
      embeddingId={embeddingId}
    /> }
    
    
  </div>
</div>

}