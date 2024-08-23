'use client'
import { ButtonHTMLAttributes, InputHTMLAttributes, forwardRef, ReactNode, RefObject, SelectHTMLAttributes, useId, ForwardedRef, TextareaHTMLAttributes } from 'react'
import styles from './styles.module.css'
import cx from 'classix'


export const Input = forwardRef(function Input(
  { 
    label,
    ...rest 
  }:{ 
    label: ReactNode 
  } & InputHTMLAttributes<HTMLInputElement>, 
  ref: ForwardedRef<HTMLInputElement>
){

  const id = useId()

  return <label htmlFor={id} className={styles.label}>
    <span className={styles.info}>{label}</span>
    <NakedInput {...rest} ref={ref} id={id} />
  </label>

})

export const NakedInput = forwardRef(function NakedInput(
  props: { full?: boolean } & InputHTMLAttributes<HTMLInputElement>,
  ref: ForwardedRef<HTMLInputElement>
){
  const { className, full, ...rest } = props
  return <input {...rest} ref={ref} 
    className={cx(styles.input, className, full && styles.full)} />
})

export const NakedTextarea = forwardRef(function NakedInput(
  props: { full?: boolean } & TextareaHTMLAttributes<HTMLTextAreaElement>,
  ref: ForwardedRef<HTMLTextAreaElement>
){
  const { className, full, ...rest } = props
  return <textarea {...rest} ref={ref} 
    className={cx(styles.textarea, className, full && styles.full)}></textarea>
})


export const Select = forwardRef(function Select(
  { 
    label,
    children,
    className, 
    ...rest 
  }:{ 
    label: ReactNode 
  } & SelectHTMLAttributes<HTMLSelectElement>, 
  ref: ForwardedRef<HTMLSelectElement>
){

  const id = useId()

  return <label htmlFor={id} className={styles.label}>
    <span className={styles.info}>{label}</span>
    <div className={styles.selectWrapper}>
      <select {...rest} ref={ref} id={id} className={cx(styles.select, className)}>{children}</select>
      <svg
        className={styles.chevron}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6.34317 7.75732L4.92896 9.17154L12 16.2426L19.0711 9.17157L17.6569 7.75735L12 13.4142L6.34317 7.75732Z"
          fill="currentColor"
        />
      </svg>
    </div>
  </label>

})

export const Button = forwardRef(function Button(
  { 
    className,
    color,
    ...rest
  }: {
    color?: 'success' | 'danger' | 'dark'
  } & ButtonHTMLAttributes<HTMLButtonElement>, 
  ref: ForwardedRef<HTMLButtonElement>
){

  return <button {...rest} ref={ref} className={cx(className, styles.button, color && styles[color])} />

})


export const Checkbox = forwardRef(function Checkbox(
  { 
    className,
    label,
    ...rest
  }: { 
    label: ReactNode 
  } & InputHTMLAttributes<HTMLInputElement>, 
  ref: ForwardedRef<HTMLInputElement>
){

  const id = useId()

  return <label htmlFor={id} className={styles.labelCheckbox}>
    <input {...rest} ref={ref} id={id} type="checkbox" className={cx(className)} />
    <span className={styles.info}>{label}</span>
  </label>

})

