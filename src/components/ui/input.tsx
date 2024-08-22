
import { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react'
import styles from './styles.module.css'
import cx from 'classix'

export function Input({ 
  label,
  className, 
  ...rest 
}:{ 
  label: ReactNode 
} & InputHTMLAttributes<HTMLInputElement>){

  return <label className={styles.label}>
    <span className={styles.info}>{label}</span>
    <input {...rest} className={cx(styles.input, className)} />
  </label>

}


export function Select({ 
  label,
  children,
  className, 
  ...rest 
}:{ 
  label: ReactNode 
} & SelectHTMLAttributes<HTMLSelectElement>){

  return <label className={styles.label}>
    <span className={styles.info}>{label}</span>
    <select {...rest} className={cx(styles.select, className)}>{children}</select>
  </label>

}

