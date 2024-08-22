'use client'
import { useState } from 'react'
import styles from './style.module.css'
import cx from 'classix'
import { drop } from '@/lib/idb/drop'
import { removeAll } from '@/lib/local-storage'
import { Button } from '@/components/ui/input'

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
        <Button className={styles.cancel} onClick={() => setConfirm(false)}>Cancel</Button>
        <Button color='danger' onClick={() => onRemove()}>Confirm Removal</Button>
      </> : <Button color='danger' onClick={() => setConfirm(true)}>
        Remove All Data
      </Button>}
    </div>
  </>

}