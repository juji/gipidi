'use client'

import { useId } from "react"


export function ChromaDb(){

  const db = useId()
  const tenant = useId()
  const database = useId()
  const distance = useId()

  return <>
    <label htmlFor={db}>
      <span>URL</span>
      <input type="text" id={db} required name="url" defaultValue={"http://localhost:8000"} />
    </label>
    <label htmlFor={tenant}>
      <span>Tenant</span>
      <input type="text" id={tenant} required name="tenant" defaultValue={"default_tenant"} />
    </label>
    <label htmlFor={database}>
      <span>Database</span>
      <input type="text" id={database} required name="database" defaultValue={"default_database"} />
    </label>

    <label htmlFor={distance}>
      <span>Distance Function</span>
      <select style={{width: '100%', maxWidth:'600px', display: 'block'}} id={distance} required name="distance">
        <option value=""></option>
        <option value="cosine">Cosine - Useful for text similarity</option>
        <option value="l2">Euclidean (L2) - Useful for text similarity, more sensitive to noise than cosine</option>
        <option value="IP">Inner Product (IP) - Recommender systems</option>
      </select>
    </label>
  </>

}