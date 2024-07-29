'use client'

import { marked } from 'marked';
import { useEffect, useRef, useState } from 'react';

import { markedHighlight } from "marked-highlight";
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark-dimmed.min.css'

import cx from 'classix'
import styles from './style.module.css'
import './bubble.css'

// const codeHook: HtmlHook = (html) => {
//   return `<figure class="highlighted-code">
// <div class="highlighted-code-header"><button class="btn-copy">Copy</button></div>
//   ${html}
// </figure>
// `
// }

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
<div class="highlighted-code-header"><button class="btn-copy">Copy</button></div>
<pre><code class="hljs language-${lang}>${text}</code></pre>
</figure>`

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

    const onExit: (() => void)[] = []

    function onClickCopy(e: Event){
      const btn = (e.currentTarget || e.target) as HTMLButtonElement
      const pre = btn.parentNode?.parentNode?.querySelector('pre')
      if(pre){
        navigator.clipboard.writeText(pre.innerText);
        btn.innerText = 'Copied'
        setTimeout(() => {
          btn.innerText = 'Copy'
        },1000)
      }
    }

    Promise.resolve(convert(content))
    .then((res:string) => {
      setResult(res)

      setTimeout(() => {

        // copy button
        ref.current?.querySelectorAll('button.btn-copy')
        .forEach(btn => {
          console.log(btn)
          btn.addEventListener('click', onClickCopy)
          onExit.push(() => {
            btn && btn.removeEventListener('click', onClickCopy)
          })
        })

        // adding target _blank
        ref.current?.querySelectorAll('a[href]')
        .forEach(link => {
          link.setAttribute('target', '_blank')
        })

      },500)
    })

    return () => {
      onExit.forEach(fn => fn())
    }

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