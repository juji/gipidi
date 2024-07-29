'use client'
import { MouseEvent, useRef, useState } from 'react'
import styles from './styles.module.css'
import useOnClickOutside from 'use-onclickoutside'
import cx from 'classix'

const Models = [
  {
    value: 'model1',
    name: 'Model 1'
  },
  {
    value: 'model2',
    name: 'Model 2'
  },
  {
    value: 'model3',
    name: 'Model 3'
  },
  {
    value: 'model4',
    name: 'Model 4'
  }
]

export function TopBar(){

  const [ menu, setMenu ] = useState(false)
  const [ title, setTitle ] = useState('asdf')
  const [ model, setModel ] = useState('model1')
  const [ sprompt, setSprompt ] = useState('')
  const ref = useRef<HTMLDivElement|null>(null)

  function openMenu(e: MouseEvent){
    if(!menu) setMenu(true)
  }

  function onCloseMenu(){
    setTimeout(() => {
      if(menu) setMenu(false)
    },150)
  }

  useOnClickOutside(ref, onCloseMenu)

  return <div className={styles.topbar}>
    <div className={styles.title}>
      <input className={styles.titleInput} type="text" 
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
    </div>
    <div className={styles.menu}>
      <div className={styles.modelName}>
        {Models.find(v => v.value === model)?.name}
      </div>
      <div className={styles.menuContainer}>
        <button className={styles.menuButton} onClick={openMenu}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 6C4 5.44772 4.44772 5 5 5H19C19.5523 5 20 5.44772 20 6C20 6.55228 19.5523 7 19 7H5C4.44772 7 4 6.55228 4 6Z" fill="currentColor" /><path d="M4 18C4 17.4477 4.44772 17 5 17H19C19.5523 17 20 17.4477 20 18C20 18.5523 19.5523 19 19 19H5C4.44772 19 4 18.5523 4 18Z" fill="currentColor" /><path d="M11 11C10.4477 11 10 11.4477 10 12C10 12.5523 10.4477 13 11 13H19C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11H11Z" fill="currentColor" /></svg>
        </button>
        <div className={cx(styles.menuContent, menu && styles.menuOpen)} ref={ref}>
          <h4 className={styles.menuHeader}>Model</h4>
          <div className={styles.selectWrapper}>
            <select 
              className={styles.select}
              defaultValue={model}
              onChange={e => {setModel(e.target.value); e.target.blur()}}
            >
              {Models.map(v => <option 
                key={v.value}
                value={v.value}>
                  {v.name}
                </option>)}
            </select>
            <svg className={styles.chevronDown} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.34317 7.75732L4.92896 9.17154L12 16.2426L19.0711 9.17157L17.6569 7.75735L12 13.4142L6.34317 7.75732Z" fill="currentColor" /></svg>
          </div>
          <h4 className={styles.menuHeader}>System Prompt</h4>
          <textarea 
            value={sprompt}
            rows={5}
            onChange={e => setSprompt(e.target.value)}
            className={styles.systemPrompt}></textarea>
        </div>
      </div>
    </div>
  </div>

}