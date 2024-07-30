'use client'
import { Page } from "@/components/page"
import { GPTProviders } from '@/components/settings/gpt-providers'
import { getQueryString } from "@/lib/getQueryString"
import { showNote } from "@/lib/toast"
import { useEffect } from "react"

export default function Settings(){

  useEffect(() => {

    const { notify } = getQueryString(['notify'])
    if(!notify) return;
    
    showNote(notify)

  },[])

  return <Page title="Settings">
    <GPTProviders />
  </Page>

}