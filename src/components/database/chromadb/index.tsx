'use client'

import { ChangeEvent, useEffect, useRef, useState } from "react"
import { Input, Select } from "@/components/ui/input"
import { test } from "@/lib/embeddings/chromadb"
import cx from "classix"
import styles from './style.module.css'
import DockerCommand from "./docker-command"
import { ChromaDBAuthSetting } from "@/lib/idb/types"

export function ChromaDb(){

  const [ url, setUrl ] = useState("http://localhost:8000")
  const urlInput = useRef<HTMLInputElement|null>(null)

  function onChangeTenantDB(e: ChangeEvent<HTMLInputElement>){
    const val = e.target.value
    const match = val.match(new RegExp(e.target.pattern))
    if(!match) {
      e.target.setCustomValidity(`lowercase and underscore only`)
      e.target.reportValidity()
    }else{
      e.target.setCustomValidity('')
    }
  }

  const [ ok, setOk ] = useState(false)
  useEffect(() => {
    test(url)
    .then(() => { 
      setOk(true)
      urlInput.current?.setCustomValidity('')
    })
    .catch(() => { 
      setOk(false)
      urlInput.current?.setCustomValidity('Invalid ChromaDB URL')
      urlInput.current?.reportValidity()
    })
  },[ url ])

  const tokenRef = useRef<HTMLInputElement|null>(null)
  const [ authType, setAuthType ] = useState<ChromaDBAuthSetting['type']|''>('')
  function authTypeOnChange(e: ChangeEvent<HTMLSelectElement>){
    setAuthType((e.target.value as ChromaDBAuthSetting['type'])||'')
    if(e.target.value && tokenRef.current) 
      tokenRef.current.setAttribute('required', '')
    else if(!e.target.value && tokenRef.current) 
      tokenRef.current.removeAttribute('required')
  }

  const [ authToken, setAuthToken ] = useState('')
  function authTokenOnChange(e: ChangeEvent<HTMLInputElement>){
    setAuthToken(e.target.value)
  }

  const [ docker, setDocker ] = useState(false)
  function toggleDocker(){
    setDocker(!docker)
  }

  return <>

    <h4>ChromaDB</h4>

    <Input label={<span className={styles.withIndicator}>URL
        <span className={cx(styles.indicator, ok && styles.ok)}></span>
      </span>}
      type="text" required name="url"
      ref={urlInput}
      onChange={e => setUrl(e.target.value)} value={url}
    />

    <Input label={'Tenant'}
      type="text"
      pattern="^[a-z_]+$"
      onChange={onChangeTenantDB}
      required name="tenant" defaultValue={"default_tenant"}
    />

    <Input label={'Database'}
      type="text"
      pattern="^[a-z_]+$"
      onChange={onChangeTenantDB}
      required name="database" defaultValue={"default_database"}
    />

    <h5>Authentication</h5>

    <Select label="Type" name="auth.type" 
      onChange={authTypeOnChange} 
      value={authType}>
      <option value="">Auth Type</option>
      <option value="auth-bearer">Authorization: Bearer</option>
      <option value="x-chroma-token">X-Chroma-Token</option>
    </Select>

    <Input label={'Token'}
      onChange={authTokenOnChange} 
      ref={tokenRef}
      value={authToken}
      type="text"
      placeholder="Auth Token"
      name="auth.token"
    />

    <button className={styles.showDocker} onClick={toggleDocker}>
      {docker ? 'Hide Example Docker Command' : 'Show Example Docker Command'}
    </button>

    <DockerCommand 
      visible={docker}
      auth={authType||undefined}
      token={authToken||undefined}
    />


  </>

}