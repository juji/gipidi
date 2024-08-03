

import { ConvoAttachment } from '@/lib/idb/types'
import styles from './style.module.css'
import cx from 'classix'
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';

export function ChatAttachment({
  files,
  onRemoveFile,
  className,
  columnNumber
}: {
  files: ConvoAttachment[]
  onRemoveFile?: (i: number) => void
  className?: string
  columnNumber?: number
}) {
  
  return <div
    className={cx(styles.attachments, className)}
    style={columnNumber ? { 
      ['--column-number' as string]: columnNumber 
    } : {}}
  ><PhotoProvider>
    {files.map((v, i) => (
      <div key={`${v.name}${i}`}  className={styles.file}>
        {v.mime.match(/^image\//) ? <PhotoView src={`data:${v.mime};base64,${v.data}`}>
          <img className={styles.image}
            src={`data:${v.mime};base64,${v.data}`}
          />
        </PhotoView> : <div className={cx(styles.image, styles.icon)}>
            <svg className={styles.svg} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 18H17V16H7V18Z" fill="currentColor" /><path d="M17 14H7V12H17V14Z" fill="currentColor" /><path d="M7 10H11V8H7V10Z" fill="currentColor" /><path fill-rule="evenodd" clip-rule="evenodd" d="M6 2C4.34315 2 3 3.34315 3 5V19C3 20.6569 4.34315 22 6 22H18C19.6569 22 21 20.6569 21 19V9C21 5.13401 17.866 2 14 2H6ZM6 4H13V9H19V19C19 19.5523 18.5523 20 18 20H6C5.44772 20 5 19.5523 5 19V5C5 4.44772 5.44772 4 6 4ZM15 4.10002C16.6113 4.4271 17.9413 5.52906 18.584 7H15V4.10002Z" fill="currentColor" /></svg>
            <p className={styles.fileName}>{v.name}</p>
        </div>}

        {onRemoveFile ? <button className={styles.remove} onClick={() => onRemoveFile(i)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.2253 4.81108C5.83477 4.42056 5.20161 4.42056 4.81108 4.81108C4.42056 5.20161 4.42056 5.83477 4.81108 6.2253L10.5858 12L4.81114 17.7747C4.42062 18.1652 4.42062 18.7984 4.81114 19.1889C5.20167 19.5794 5.83483 19.5794 6.22535 19.1889L12 13.4142L17.7747 19.1889C18.1652 19.5794 18.7984 19.5794 19.1889 19.1889C19.5794 18.7984 19.5794 18.1652 19.1889 17.7747L13.4142 12L19.189 6.2253C19.5795 5.83477 19.5795 5.20161 19.189 4.81108C18.7985 4.42056 18.1653 4.42056 17.7748 4.81108L12 10.5858L6.2253 4.81108Z" fill="currentColor" /></svg>
        </button> : null}
      </div>
    ))}
  </PhotoProvider>
  </div>

}