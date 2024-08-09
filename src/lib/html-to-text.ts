import { ConvoAttachment } from "./idb/types";
import { convert } from 'html-to-text';

export async function htmlToText(attachment: ConvoAttachment){

  const string = await fetch(`data:${attachment.mime};base64,${attachment.data}`)
    .then(r => r.text())
  
  return convert(string)
  

}