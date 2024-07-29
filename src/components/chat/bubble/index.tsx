'use client'

import { marked } from 'marked';
import { useEffect, useRef, useState } from 'react';

import { markedHighlight } from "marked-highlight";
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark-dimmed.min.css'

import cx from 'classix'
import styles from './style.module.css'
import './bubble.css'

const copyAction = `(() => {
  const pre = this.parentNode?.parentNode?.querySelector('pre');
  if(pre){
    navigator.clipboard.writeText(pre.innerText);
    this.innerText = 'Copied';
    setTimeout(() => {
      this.innerText = 'Copy';
    },1000);
  }
})()
`.replace(/\n|\r/g,'').replace(/\s{2,}/g,' ')

const convert = marked.use({
  async: true,
  pedantic: false,
  gfm: true,
}, 
markedHighlight({
  langPrefix: 'hljs language-',
  highlight(code, lang, info) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, { language }).value
  }
}),
{
  renderer: {
    // @ts-expect-error
    code(text: string, lang:string, escaped?:boolean ){
      return `<figure class="highlighted-code">
<div class="highlighted-code-header">
<span>${lang}</span>
<button 
  onclick="${copyAction}"
  class="btn-copy">Copy</button>
</div>
<pre><code class="hljs language-${lang}>${text}</code></pre>
</figure>`

    },
    // @ts-expect-error
    image(
      href: string,
      caption?: string,
      alt?: string | null,
    ){
      console.log({
        href, alt, caption
      })
      return `
        <figure class="convo-image">
          <img src="${href}" alt="${alt?.replace(/\"/g,'\\"')}" />
          ${caption && `<figcaption>${caption}</figcaption>`}
        </figure>
      `
    }
  }
}
)


function Bubble({ 
  className,
  content,
  profilePict
}:{ 
  className: string 
  content: string 
  profilePict: string
}){

  const [ result, setResult ] = useState('')
  const ref = useRef<HTMLDivElement|null>(null)

  useEffect(() => {

    Promise.resolve(convert(content))
    .then((res:string) => {
      setResult(res)
    })

  },[])

  return <div ref={ref} className={cx(styles.bubble, className)}>
    <div className={styles.cloud}>
      <div className={cx(styles.content, 'bubble-content')} 
        dangerouslySetInnerHTML={{ __html: result}} />
    </div>
    <img className={styles.pict} src={profilePict} />
    <div className={styles.gap}></div>
  </div>

}


export function UserBubble({ content }:{ content: string }){

  return <Bubble 
    className={styles.user} 
    content={content} 
    profilePict={'/user.webp'}
  />

}

export function BotBubble({ content }:{ content: string }){

  return <Bubble 
    className={styles.bot} 
    content={content} 
    profilePict={'/bot.webp'}
  />

}