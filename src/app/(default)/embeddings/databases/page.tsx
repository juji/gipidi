import { Page } from "@/components/page"
import Link from "next/link"
import styles from './style.module.css'

export default function Databases(){

  return <Page title="Embedding Databases">
    <br />
    <br />
    <p>These are the databases where we keep your embeddings.</p>
    <p>Supported databases are ChromaDb, PostgreSQL, and Redis.</p>
    <br />
    
    <Link className={styles.create} href="/embeddings/databases/create">Create New Databases</Link>
    
  </Page>

}