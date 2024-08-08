
importScripts('/modules/marked.min.js');
importScripts('./modules/marked-highlight.js')
importScripts('./modules/highlight.min.js')

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
      code(text, lang, escaped){

        return `<figure class="highlighted-code">
          <div class="highlighted-code-header">
          <span>${lang||'plaintext'}</span>
          <button class="btn-copy">Copy</button>
          </div>
          <pre><code class="hljs language-${lang||'plaintext'}">${text}</code></pre>
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
            ${caption||alt ? `<figcaption>${caption||alt}</figcaption>` : ''}
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
  parser.parse(
    e.data

      // fix stream, add temp spaces or closing

      // headings, blockquote and lists: add space
      .replace(/(^|[\s]+)([\#]+)$/, '$1$2 ')
      .replace(/(^|[\s]+)([\>]+)$/, '$1$2 ')
      .replace(/(^|[\s]+)([\-]+)$/, '$1$2 ')
      .replace(/(^|[\s]+)([\+]+)$/, '$1$2 ')

      // codes, bolds and italics: autoclose
      .replace(/(^|[\s]+)([\`]+)([^\s][^\`]+$)/, '$1$2$3$2')
      .replace(/(^|[\s]+)([\*]+)([^\s][^\*]+$)/, '$1$2$3$2')
      .replace(/(^|[\s]+)([\_]+)([^\s][^\_]+$)/, '$1$2$3$2')

      // links: not showing as link until finish
      .replace(/(^|[\s]+)\[([^\]]+)$/, '$1$2')
      .replace(/(^|[\s]+)\[([^\]]+)\]$/, '$1$2')
      .replace(/(^|[\s]+)\[([^\]]+)\]\(([^\)]+$)/, '$1$2')

      // images: not drawing untill it is finished
      .replace(/(^|[\s]+)\!\[([^\]]+)$/, '$1')
      .replace(/(^|[\s]+)\!\[([^\]]+)\]$/, '$1')
      .replace(/(^|[\s]+)\!\[([^\]]+)\]\(([^\)]+$)/, '$1')

  ).then(v => {
    postMessage(v)
  })
};