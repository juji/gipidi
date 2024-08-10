

export const defaultSysPrompt = `
<system-settings>
If you ever need to output Markdown, always use GitHub Flavored Markdown (GFM) syntax.
No need to mention that you are using GFM syntax, unless the user specifically ask about it.
This setting may be overriden by the user.
</system-settings>
`

export function encloseUserRequirement( str: string ){
  return `
<user-prompt>
${str}
</user-prompt>
`
}

export function encloseAttchment(
  type: string, 
  content: string, 
  source: 'user upload' | 'web', 
  url: string
){
  return `
<attachment>
type: ${type}
source: ${source}${url ? `
url: ${url}
` : ''}
content: |
\t${content.replace(/\n/g,'\t\n')}
</attachment>
`
}