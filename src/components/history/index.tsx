'use client'
import { useHistory } from "@/lib/historyStore";
import { ChangeEvent, useEffect, useId, useRef, useState } from "react";
import styles from './style.module.css'
import { Convo } from "@/lib/idb/types";
import cx from "classix";
import { ChatBubbles } from "../chat";
import { useConvo } from "@/lib/convoStore";

function HistoryRow({
  convo,
  checked,
  onItemToggle,
}:{
  convo: Convo,
  checked: boolean
  onItemToggle: () => void
}) {

  const convoDetail = useHistory(s => s.convoDetail)
  const getHistoryDetails = useHistory(s => s.getHistoryDetails)
  const removeHistoryDetails = useHistory(s => s.removeHistoryDetails)
  const restoreHistory = useHistory(s => s.restore)
  const [ open, setOpen ] = useState(false)
  const id = useId()

  useEffect(() => {
    if(open) getHistoryDetails(convo)
    else setTimeout(() => {
      if(convoDetail?.id === convo.id)
        removeHistoryDetails()
    },300)
  },[ open ])

  useEffect(() => {
    if(convoDetail && convoDetail.id !== convo.id)
      setOpen(false)
  },[ convoDetail ])

  function restore(){
    restoreHistory(convo)
  }
  
  return <div className={cx(styles.item, styles.row, open && styles.open)}>
  <span className={styles.left}>
    <input id={id} className={styles.input} type="checkbox" checked={checked||false} onChange={onItemToggle} />
  </span>
  <span className={styles.middle}>
    <label htmlFor={id}>{convo.title || <i className={styles.i}>untitled</i>}</label>
  </span>
  <span className={styles.right}>
    <button className={styles.button} onClick={() => setOpen(!open)}>{open ? 'Close' : 'Open'}</button>
    &nbsp;&nbsp;
    <button className={styles.button} onClick={() => restore()}>Restore</button>
  </span>
  <div className={cx(styles.convoDetail, open && styles.open)}>
    <div className={styles.content}>
      <div className={styles.contentContainer}>
      {convoDetail?.id === convo.id ? <ChatBubbles activeConvo={convoDetail} /> : null}
      </div>
    </div>
  </div>
</div>

}

function HistoryHeader({
  onChange,
  checked,
  selected,
  onRemoveAll
}: {
  onChange: (e: ChangeEvent) => void
  checked: boolean
  selected: number
  onRemoveAll: () => void
}) {

  const [ confirm, setConfirm ] = useState(false)
  function onRemove(){
    if(!confirm) setConfirm(true)
    else onRemoveAll()
  }

  const to = useRef<null | ReturnType<typeof setTimeout>>(null)
  useEffect(() => {
    if(!confirm) return () => {}
    if(to.current) clearTimeout(to.current)
    to.current = setTimeout(() => {
      setConfirm(false)
      to.current = null
    },5000)
  },[confirm])
  
  return <div className={cx(styles.header, styles.row)}>
    <span className={styles.left}>
      <input className={styles.input} type="checkbox" checked={checked} onChange={onChange} />
    </span>
    <span className={styles.middle}>
      {selected ? `${selected} number of item${selected===1?'':'s'} selected`:null}
    </span>
    <span className={styles.right}>
      {checked ? <button onClick={() => onRemove()}>{confirm ? 'Confirm Removal' : 'Remove All'}</button> : null}
    </span>   
  </div>
}

export function History() {

  const loading = useHistory(s => s.loading)
  const getConvoHistory = useHistory(s => s.getConvoHistory)
  const convoHistory = useHistory(s => s.convoHistory)
  const clearHistory = useHistory(s => s.clearHistory)
  const onRemove = useConvo(s => s.onRemove)

  useEffect(() => {
    onRemove(() => {
      getConvoHistory()
    })
    return () => {
      onRemove(null)
    }
  },[])

  useEffect(() => {
    getConvoHistory()
  }, [])

  function onChangeHeader(e: ChangeEvent) {
    const checkbox = e.target as HTMLInputElement
    if (checkbox.checked) {
      setHeaderChecked(true)
      setItemChecked(itemChecked.map(v => true))
    }else{
      setHeaderChecked(false)
      setItemChecked(itemChecked.map(v => false))
    }
  }

  function removeAllChecked(){
    const checked = itemChecked.reduce((a,b,i) => {
      if(b) a.push(convoHistory[i])
      return a
    },[] as Convo[])
    
    clearHistory(checked)
    setHeaderChecked(false)
  }

  const [ headerChecked, setHeaderChecked ] = useState(false)
  const [ itemChecked, setItemChecked ] = useState<boolean[]>([])
  useEffect(() => {
    setItemChecked(convoHistory.map(v => false))
  },[ convoHistory ])

  function onItemToggle(index: number){
    let items = [...itemChecked]
    items[index] = !items[index]
    setItemChecked(items)
    const somethingOn = items.find(v => v)
    if(somethingOn) setHeaderChecked(true)
    else setHeaderChecked(false)
  }
  
  return <div className={styles.history}>

    {loading ? <p className={styles.loading}>Loading history...</p> : <>
      {convoHistory.length ? <HistoryHeader 
        onChange={onChangeHeader}
        checked={headerChecked}
        selected={itemChecked.filter(v => v).length}
        onRemoveAll={removeAllChecked}
      /> : null }
      {convoHistory.length ? convoHistory.map((v,i) => <HistoryRow 
        key={v.id}
        convo={v}
        checked={itemChecked[i]}
        onItemToggle={() => onItemToggle(i)}
      />) : <p className={styles.empty}>Nothing here...</p>}
    </>}

  </div>
  




}