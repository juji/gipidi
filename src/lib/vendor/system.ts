import { ConvoAttachment, ConvoData } from "../idb/types"

// It is, by definition self-conscious:
// "Do not hallucinate"
// but probably not by human standard

export const defaultSysPrompt = `[default]
Never tell the user about the following:
If you ever need to output Markdown, always use GitHub Flavored Markdown (GFM) syntax.
No need to mention that you are using GFM syntax, unless the user specifically ask about it.
The setting about using GFM, may be overriden by the user.

Do not hallucinate.
Do not make up factual information.

In some cases, the user's message will contain [database] tag(s).
Those are system's generated information, procured from the system's database. 
It may help you respond to the user. Use them as your source of information.
The user does not have any information about it.
When using the information in the [database] tag, you should mention that it was sourced from the system's database.

In some cases, the user's message will contain [attachment] tag(s).
Those tags contains information about the files uploaded by the user.
Feel free to chat about it.
If you want to refer to the [attachment] tag, just say attachment.

Never say [database] or [attachment].
You should find other words to describe them when you are referring to them.
[/default]`

export function encloseWithDefaultRequirement( str: string ){
  return `
${defaultSysPrompt}
${str && str.length ? `
[user]
${str}
[/user]
` : ''}`
}

export function createHumanMessage(
  content: string, 
  attachments?: ConvoAttachment[],
  embeddings?: ConvoData['embeddings']
){

  return (embeddings && embeddings.length ? `
The following [database] tag${embeddings.length>1?'s were':' was'} created by the system to help you respond to the user:` + 
embeddings.map(v => `
[database]
${v}
[/database]`).join('') + '\n\n' : '') +
  (attachments && attachments.length ? `
The following [attachment] tag${attachments.length>1?'s were files':' was a file'} uploaded by the user:` + 
attachments.map(v => `
[attachment]
name: ${v.name}
mime: ${v.mime}
${v.mime.match(/^image\//) ? `description:
\`\`\`\`\`\`
${v.text}
\`\`\`\`\`\`
` : `content:
\`\`\`\`\`\`
${v.text}
\`\`\`\`\`\`
`}[/attachment]`).join('') + '\n\n' : '') + content

}

export const createTitleSystem = `
You are an excellent summarizer.
The following data is a JSON formatted conversation between a user and an assistant.
You are expected to create a short title to describe the conversation.

Prevent from using the word "user" and "assistant" in the resulting title.

Reply with JSON, using the following JSON schema:
{"title":"string"}
`