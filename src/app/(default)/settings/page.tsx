'use client'
import { Page } from "@/components/page"
import { getQueryString } from "@/lib/getQueryString"
import { showNote } from "@/lib/toast"
import { useEffect } from "react"
import dynamic from 'next/dynamic'

// weirdly throws error on dev when this is not imported with ssr false
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
    <DangerZone />
  </Page>

}