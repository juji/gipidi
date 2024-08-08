import { Fragment } from "react"
import parse from 'html-react-parser';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import styles from './style.module.css'
import { fetch } from "@tauri-apps/plugin-http";
import imageType from 'image-type';
import { save } from "@tauri-apps/plugin-dialog";
import { showError, showNote } from "@/lib/toast";
import { writeFile } from "@tauri-apps/plugin-fs";

async function downloadImage(str: any) {

  const { src } = str

  let buff;
  try{
    buff = await fetch(src).then(r => r.arrayBuffer())
  }catch(e){
    showError((e as Error).toString())
    return;
  }
  const uint8 = new Uint8Array(buff)
  const type = await imageType(uint8)
  if(!type) {
    showError('image type is unknown')
    return;
  }

  const saveRes = await save({
    filters: [
      {
        name: 'extension',
        extensions: [type.ext || ''],
      },
    ]
  })

  if (!saveRes) return;

  writeFile(saveRes, uint8)
    .then(() => {
      showNote(`Saved to ${saveRes}`)
    }).catch(e => {
      showError(e.toString())
      throw e
    })

}

export function markedToReact(str: string){

  return <Fragment>
    {parse(
      str,
      {
        replace(domNode) {
          // @ts-expect-error
          if(domNode.name === 'button' && domNode.attribs.class === 'btn-copy') {

            const onCopy = (e: Event) => {
              const button = e.target as HTMLButtonElement
              const pre = button.parentNode?.parentNode?.querySelector('pre');
              if(pre){
                navigator.clipboard.writeText(pre.innerText);
                button.innerText = 'Copied';
                setTimeout(() => {
                  button.innerText = 'Copy';
                },1000);
              }
            }

            // @ts-expect-error
            return <button className="btn-copy" onClick={onCopy}>Copy</button>
          }
          
          // @ts-expect-error
          if(domNode.name === 'img') {
            
            // @ts-expect-error
            const src = domNode.attribs.src || ''
            // @ts-expect-error
            const alt = domNode.attribs.alt || ''

            return <PhotoProvider
            toolbarRender={({ images, index }) => {
              return <button className={styles.downladImageButton} onClick={() => downloadImage(images[index])}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11 5C11 4.44772 11.4477 4 12 4C12.5523 4 13 4.44772 13 5V12.1578L16.2428 8.91501L17.657 10.3292L12.0001 15.9861L6.34326 10.3292L7.75748 8.91501L11 12.1575V5Z" fill="currentColor" /><path d="M4 14H6V18H18V14H20V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V14Z" fill="currentColor" /></svg>
              </button>
            }}>
              <PhotoView src={src}>
                <img src={src} alt={alt} />
              </PhotoView> 
            </PhotoProvider>

          }
        }
      }
    )}
  </Fragment>

}