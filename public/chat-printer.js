
importScripts('/modules/marked.min.js');
importScripts('./modules/marked-highlight.js')
importScripts('./modules/highlight.min.js')

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

const parser = marked.use(
  {
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
      code(text, lang, escaped ){
        return `<figure class="highlighted-code">
          <div class="highlighted-code-header">
          <span>${lang}</span>
          <button 
            onclick="${copyAction}"
            class="btn-copy">Copy</button>
          </div>
          <pre><code class="hljs language-${lang}>${text}</code></pre>
          </figure>
        `

      },

      link(
        href, title, content
      ){
        
        return `<a href="${href}" 
          target="_blank"
          rel="noopener noreferrer"
          title="${title||''}">${content}</a>`

      },
      
      // @ts-expect-error
      image(
        href,
        caption,
        alt,
      ){
        return `
          <figure class="convo-image">
            <img src="${href}" alt="${alt?alt.replace(/\"/g,'\\"'):''}" />
            ${caption ? `<figcaption>${caption}</figcaption>` : ''}
          </figure>
        `
      },

      // @ts-expect-error
      table(
        header,
        content
      ){
        return `<div class="table-container">
          <table>
            ${header||''}
            ${content||''}
          </table>
          </div>
        `
      }
    }
  }
)

onmessage = (e) => {
  parser.parse(e.data).then(v => {
    postMessage(v)
  })
};