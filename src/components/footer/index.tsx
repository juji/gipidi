import styles from './style.module.css'
import Link from 'next/link'

export function Footer(){

  return <div className={styles.footerContainer}>
    <Link className={styles.link} href="/">Home</Link>
    <Link className={styles.link} href="/settings">Settings</Link>
    <Link className={styles.link} href="/about">About</Link>
  </div>

}