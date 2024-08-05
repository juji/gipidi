import { Page } from "@/components/page"
import { History as HistoryList } from "@/components/history"

export default function History() {
  
  return <Page title="Bin">
    <p style={{margin: '1rem 0'}}>These are your deleted conversations. Retention period is 90 days.</p>
    <HistoryList />
  </Page>

}