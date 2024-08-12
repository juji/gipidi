'use client'
import { Page } from "@/components/page"
import { getQueryString } from "@/lib/get-query-string"
import { showNote } from "@/lib/toast"
import { useEffect } from "react"
import dynamic from 'next/dynamic'

// import { GoogleSearch } from "@/components/settings/google-search"
// import { DangerZone } from "@/components/settings/danger-zone"
// import { GPTProviders } from '@/components/settings/gpt-providers'

// some zustand store are trying to access local storage on init
// meaning: on server
// but this not a server-client app? yeah...
// i'm just too lazy to setup react context for zustand
const GoogleSearch = dynamic(
  () => import('@/components/settings/google-search').then(v => v.GoogleSearch), 
  { ssr: false }
)

const GPTProviders = dynamic(
  () => import('@/components/settings/gpt-providers').then(v => v.GPTProviders), 
  { ssr: false }
)

const DangerZone = dynamic(
  () => import('@/components/settings/danger-zone').then(v => v.DangerZone), 
  { ssr: false }
)


export default function Settings(){

  useEffect(() => {

    const { notify } = getQueryString(['notify'])
    if(!notify) return;
    
    showNote(notify)

  },[])

  return <Page title="Settings">
    <GPTProviders />
    <GoogleSearch />
    <DangerZone />
  </Page>

}