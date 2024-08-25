'use client'
import styles from './style.module.css'
import { PropsWithChildren, ReactNode } from 'react'

export function Page({
  title,
  backButton,
  link,
  children
}: PropsWithChildren<{
  title: string
  backButton?: boolean
  link?: ReactNode
}>){

  return <div className={styles.page}>
    <div className={styles.headingContainer}>
      {backButton ? <button onClick={() => history.back()}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.9481 14.8285L10.5339 16.2427L6.29126 12L10.5339 7.7574L11.9481 9.17161L10.1197 11H17.6568V13H10.1197L11.9481 14.8285Z" fill="currentColor" />
        <path fillRule="evenodd" clipRule="evenodd" d="M23 19C23 21.2091 21.2091 23 19 23H5C2.79086 23 1 21.2091 1 19V5C1 2.79086 2.79086 1 5 1H19C21.2091 1 23 2.79086 23 5V19ZM19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21Z" fill="currentColor" />
      </svg>
      </button> : null}
      <h1 className={styles.heading}>{title}</h1>
      {link ? <span className={styles.link}>{link}</span> : null}
    </div>
    <hr />
    {children}
  </div>

}