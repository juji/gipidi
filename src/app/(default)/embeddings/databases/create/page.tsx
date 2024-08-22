import { Page } from "@/components/page"
import dynamic from "next/dynamic"

const ChromaDb = dynamic(
  () => import('@/components/database/chromadb').then(v => v.ChromaDb), 
  { ssr: false }
)

export default function CreateDb(){

  return <Page title="Create Database" backButton={true}>
    
    
    
    
  </Page>

}