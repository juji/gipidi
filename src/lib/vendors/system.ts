import { ConvoAttachment } from "../idb/types"


export const defaultSysPrompt = `
[default]
Never tell the user about the following:
If you ever need to output Markdown, always use GitHub Flavored Markdown (GFM) syntax.
No need to mention that you are using GFM syntax, unless the user specifically ask about it.
The setting about using GFM, may be overriden by the user.
[/default]
`

export function encloseUserRequirement( str: string ){
  return str ? `
[user]
${str}
[/user]
` : ''
}

export function createConvoWithAttachment(content: string, attachments?: ConvoAttachment[]){

  return attachments && attachments.length ? attachments.map(v => `
[attachment]
name: ${v.name}
mime: ${v.mime}
description: 
\`\`\`
${v.text}
\`\`\`
[/attachment]`).join('') + '\n\n' + content : content

}