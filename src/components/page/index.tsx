
import styles from './style.module.css'
import './style.css'
import { PropsWithChildren } from 'react'

export function Page({
  title,
  children
}: PropsWithChildren<{
  title: string
}>){

  return <div className={styles.page}>
    <h1 className={styles.heading}>{title}</h1>
    <hr />
    {children}
  </div>

}