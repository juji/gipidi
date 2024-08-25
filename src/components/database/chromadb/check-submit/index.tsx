import { ChromaDBSetting, EmbeddingsDb } from "@/lib/idb/types";
import { Status } from "@/components/ui/status";

import { test, getCreateTenant, getCreateDb } from "@/lib/embeddings/chromadb";
import { createDatabase } from "@/lib/idb/embedding-database/createDatabase";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/input";

export function CheckSubmitChroma({ 
  data,
  goBack
}: { 
  data: EmbeddingsDb
  goBack: () => void
}){

  // connection check
  const [ connectionCheck, setConnectionCheck ] = useState<boolean|null>(null)
  useEffect(() => {
    test(data.url)
    .then(() => { setConnectionCheck(true) })
    .catch(() => { setConnectionCheck(false) })
  },[])

  // Get or Set Tenant
  const [ tenant, setTenant ] = useState<boolean|null>(null)
  const [ tenantError, setTenantError ] = useState<string>('')
  useEffect(() => {
    if(connectionCheck === null) return;
    if(connectionCheck === false) {
      setTenantError('Connection Check returned falsy')
      return;
    }

    getCreateTenant({
      url: data.url,
      tenant: (data.settings as ChromaDBSetting).tenant,
      authType: (data.settings as ChromaDBSetting).auth?.type || undefined,
      authToken: (data.settings as ChromaDBSetting).auth?.token || undefined,
    })
    .then(() => { setTenant(true) })
    .catch((e) => { setTenant(false); setTenantError(JSON.stringify(e.body)) })
  },[ connectionCheck ])

  // Get or Set DB
  const [ db, setDb ] = useState<boolean|null>(null)
  const [ dbError, setDbError ] = useState<string>('')
  useEffect(() => {
    if(tenant === null) return;
    if(tenant === false) {
      setDbError('Tenant Check returned falsy')
      return;
    }

    getCreateDb({
      url: data.url,
      tenant: (data.settings as ChromaDBSetting).tenant,
      database: (data.settings as ChromaDBSetting).database,
      authType: (data.settings as ChromaDBSetting).auth?.type || undefined,
      authToken: (data.settings as ChromaDBSetting).auth?.token || undefined,
    })
    .then(() => { setDb(true) })
    .catch((e) => { setDb(false); setDbError(JSON.stringify(e.body)) })
  },[ tenant ])

  // save info to db
  const [ save, setSave ] = useState<boolean|null>(null)
  const [ saveError, setSaveError ] = useState<string>('')
  useEffect(() => {
    if(db === null) return;
    if(db === false) {
      setSaveError('DB Check returned falsy')
      return;
    }

    createDatabase( data )
    .then(() => { setSave(true) })
    .catch((e) => { 
      console.error(e)
      setSave(false); 
      setSaveError(e.message) 
    })
  },[ db ])

  return <>

    <h3>Checking ChromaDB Setting</h3>

    <Status 
      text={"Checking Connection"} 
      percentage={connectionCheck ? 100 : 0}
      status={connectionCheck === false ? "Could not connect" : ""}
      isError={connectionCheck === false}
    />

    <Status 
      text={"Get or Set Tenant"} 
      percentage={tenant ? 100 : 0}
      status={tenantError||''}
      isError={!!tenantError}
    />

    <Status 
      text={"Get or Set Database"} 
      percentage={db ? 100 : 0}
      status={dbError||''}
      isError={!!dbError}
    />

    <Status 
      text={"Saving Data"} 
      percentage={save ? 100 : 0}
      status={saveError||''}
      isError={!!saveError}
    />
    <br /><br />
    { save ? <Button color="success" onClick={() => history.back()}>
      <svg
        width="12"
        height="16"
        viewBox="10 0 12 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16.2426 6.34317L14.8284 4.92896L7.75739 12L14.8285 19.0711L16.2427 17.6569L10.5858 12L16.2426 6.34317Z"
          fill="currentColor"
        />
      </svg> Back
    </Button> : null }
    { saveError ? <Button color="danger" onClick={() => goBack()}>
      <svg
        width="12"
        height="16"
        viewBox="10 0 12 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16.2426 6.34317L14.8284 4.92896L7.75739 12L14.8285 19.0711L16.2427 17.6569L10.5858 12L16.2426 6.34317Z"
          fill="currentColor"
        />
      </svg> Back
    </Button> : null }

  </>


}