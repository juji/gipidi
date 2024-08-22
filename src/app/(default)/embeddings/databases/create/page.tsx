'use client'
import { Page } from "@/components/page"
import { Select, Input, Button, Checkbox } from "@/components/ui/input"
import { EmbeddingsDb } from "@/lib/idb/types"

import { FormEvent, useMemo, useState } from "react"
import formStyles from '@/components/ui/form.module.css'
import { ChromaDb } from '@/components/database/chromadb'
import { nanoid } from "nanoid"

export default function CreateDb(){

  const [ type, setType ] = useState<EmbeddingsDb['type']|"">("")
  const VendorInput = useMemo(() => {
    if(!type) return () => null
    return type === 'chromadb' ? ChromaDb : () => null
  },[ type ])

  const [ dbSetting, setDbSetting ] = useState<EmbeddingsDb|null>(null)
  function onSubmit(e: FormEvent<HTMLFormElement>){
    e.preventDefault()
    const d = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(d.entries());

    const db = {
      id: nanoid(),
      name: data.name,
      type: data.vendor,
      settings: {
        tenant: data.tenant,
        database: data.database,
        ... data['auth.type'] && data['auth.token'] ? {
          auth: {
            type: data['auth.type'],
            token: data['auth.token']
          }
        } : {}
      },
      isDefault: data.isDefault === 'on'
    } as EmbeddingsDb

    setDbSetting(db)

  }

  return <Page title="Create Database" backButton={true}>

    <br />
    <form onSubmit={onSubmit} className={formStyles.form}>
      <Input label="Name" required type="text" name="name" />
      <Select label="Vendor"
        value={type || ''}
        required
        name="vendor"
        onChange={e => setType(e.target.value as EmbeddingsDb['type'])}
      >
        <option value="">Select Vendor</option>
        <option value="chromadb">ChromaDb</option>
        <option value="postgres">PostgreSQL</option>
        <option value="redis">Redis</option>
      </Select>

      <Checkbox label="Set as default" name="isDefault" />

      <VendorInput />

      <br />
      <Button color="success" type="submit">Submit</Button>
    </form>
    
  </Page>

}