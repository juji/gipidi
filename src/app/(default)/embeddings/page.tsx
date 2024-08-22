import { Page } from "@/components/page"
import Link from "next/link"
import styles from './style.module.css'

export default function About(){

  return <Page title="Embeddings">
    <br />
    <br />
    <p>Embeddings add contents to GPT.</p>
    <p>It will be used as a `Knowledge Base` for model(s) to look for information.</p>
    <br />
    
    <Link className={styles.create} href="/embeddings/create">Create New Embedding</Link>
    &nbsp;&nbsp;&nbsp;&nbsp;
    <Link className={styles.create} href="/embeddings/databases/create">Add New Database</Link>
    
  </Page>

}