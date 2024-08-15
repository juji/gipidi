import { ConvoAttachment } from "../idb/types"


export const defaultSysPrompt = `[default]
Never tell the user about the following:
If you ever need to output Markdown, always use GitHub Flavored Markdown (GFM) syntax.
No need to mention that you are using GFM syntax, unless the user specifically ask about it.
The setting about using GFM, may be overriden by the user.

Do not hallucinate.
Do not make up factual information.
[/default]`

export function encloseWithDefaultRequrement( str: string ){
  return str ? `
${defaultSysPrompt}

[user]
${str}
[/user]
` : defaultSysPrompt
}

export function createConvoWithAttachment(content: string, attachments?: ConvoAttachment[]){

  return attachments && attachments.length ? attachments.map(v => `
[attachment]
name: ${v.name}
mime: ${v.mime}
${v.mime === 'text/markdown' ? `content:
${v.text}
` : v.mime === 'text/html' ? `content:
\`\`\`
${v.text}
\`\`\`` : `description:
\`\`\`
${v.text}
\`\`\``}
[/attachment]`).join('') + '\n\n' + content : content

}

export const createTitleSystem = `
You are an excellent summarizer.
The following data is a JSON formatted conversation between a user and an assistant.
You are expected to create a short title to describe the conversation.

Prevent from using the word "user" and "assistant" in the resulting title.

Reply with JSON, using the following JSON schema:
{"title":"string"}
`