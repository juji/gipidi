import { MouseEvent } from "react";
import styles from './style.module.css'
import { ChromaDBAuthSetting } from "@/lib/idb/types";
import cx from "classix";


export default function DockerCommand({ 
  visible,
  auth,
  token 
}:{ 
  auth?: ChromaDBAuthSetting['type']
  token?: string
  visible: boolean 
}){

  function onCopy(e: MouseEvent<HTMLButtonElement>){
    const btn = e.currentTarget as HTMLButtonElement
    const content = btn.parentNode?.querySelector('code')?.innerHTML
    const html = btn.innerHTML
    if(!content) return;
    navigator.clipboard.writeText(content);
    btn.innerText = 'Copied';
    setTimeout(() => {
      btn.innerHTML = html;
    },1000);
  }

  return <div className={cx(styles.dockerCommand, visible && styles.visible)}>
    <div className={styles.container}>
    <pre className={styles.pre}>
  <button type="button" onClick={onCopy}>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13 7H7V5H13V7Z" fill="currentColor" />
      <path d="M13 11H7V9H13V11Z" fill="currentColor" />
      <path d="M7 15H13V13H7V15Z" fill="currentColor" />
      <path fillRule="evenodd" clipRule="evenodd" d="M3 19V1H17V5H21V23H7V19H3ZM15 17V3H5V17H15ZM17 7V19H9V21H19V7H17Z" fill="currentColor" />
    </svg>
  </button>
  <code>{`docker run -d \\
  -p 8000:8000 \\
  -v chroma:/chroma/chroma \\
  -e IS_PERSISTENT=TRUE \\
  -e CHROMA_SERVER_CORS_ALLOW_ORIGINS='["*"]' \\${auth === 'x-chroma-token' ? `
  -e CHROMA_SERVER_AUTHN_CREDENTIALS='${token}' \\
  -e CHROMA_SERVER_AUTHN_PROVIDER='chromadb.auth.token_authn.TokenAuthenticationServerProvider' \\
  -e CHROMA_AUTH_TOKEN_TRANSPORT_HEADER='X-Chroma-Token' \\` : ''}${auth === 'auth-bearer' ? `
  -e CHROMA_SERVER_AUTHN_CREDENTIALS='${token}' \\
  -e CHROMA_SERVER_AUTHN_PROVIDER='chromadb.auth.token_authn.TokenAuthenticationServerProvider' \\` : ''}
  -e ANONYMIZED_TELEMETRY=TRUE \\
  --name chromadb \\
  chromadb/chroma:latest`}</code>
  </pre>
  </div>
  </div>

}