'use client'
import { useState } from 'react'
import styles from './style.module.css'
import cx from 'classix'
import { drop } from '@/lib/idb/drop'
import { removeAll } from '@/lib/local-storage'

export function DangerZone(){

  const [ confirm, setConfirm ] = useState(false)

  async function onRemove(){
    removeAll()
    await drop()
    window.location.href = '/'
  }

  return <>
    <h4 className={styles.mainHeading}>Danger Zone</h4>
    
    <div className={styles.dangerContainer}>
      { confirm ? <>
        <p className={styles.note}>This will remove all data</p>
        <button
          className={cx(styles.button, styles.cancel)}
          onClick={() => setConfirm(false)}
        >Cancel</button>
        <button
          className={cx(styles.button, styles.danger)}
          onClick={() => onRemove()}
        >Confirm Removal</button>
      </> : <button
        className={cx(styles.button, styles.danger)}
        onClick={() => setConfirm(true)}
      >Remove All Data</button>}
    </div>
  </>

}