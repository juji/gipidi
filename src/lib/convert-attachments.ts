
import { ConvoAttachment } from "./idb/types"
import mime from 'mime'
import { pdfToText } from './pdf-to-text';
import { htmlToText } from './html-to-text';
import { imageToText } from "./image-to-text";

async function base64ToString(file: ConvoAttachment){
  return fetch(`data:${file.mime};base64,${file.data}`)
    .then(r => r.text())
}

export async function convertAttachment( 
  file: ConvoAttachment, 
){

  // select files by type
  const content = mime.getExtension(file.mime) === 'txt' ? 
      await base64ToString(file) :
    mime.getExtension(file.mime) === 'json' ? 
      await base64ToString(file) :
    mime.getExtension(file.mime) === 'pdf' ? 
      await pdfToText(file) :
    mime.getExtension(file.mime) === 'html' ? 
      await htmlToText(file) :
    file.mime.match(/^image\//) ? 
      await imageToText(file) :
    null

  console.debug('Convert Attachment: ', {
    ...file, 
    loading: false,
    text: content
  })

  return content ? {
    ...file, 
    loading: false,
    text: content
  } : null

}