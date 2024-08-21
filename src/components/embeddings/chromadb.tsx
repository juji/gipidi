'use client'

import { useId } from "react"


export function ChromaDb(){

  const db = useId()

  return <label htmlFor={db}>
    <span>URL</span>
    <input type="text" id={db} name="url" />
  </label>

}