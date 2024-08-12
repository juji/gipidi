
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
    e.data.replace(/.*$/, (lastLine) => {

      // console.debug(lastLine)

      return lastLine ? lastLine

        // headings, blockquote and lists: add space
        .replace(/(^|\s+)(\#+)$/, '$1$2 ')
        .replace(/(^|\s+)(\>+)$/, '$1$2 ')
        .replace(/(^|\s+)(\-+)$/, '$1$2 ')
        .replace(/(^|\s+)(\++)$/, '$1$2 ')

        // links: not showing as link until finish
        .replace(/(^|[\s]+)\[([^\]]+)$/, '$1$2')
        .replace(/(^|[\s]+)\[([^\]]+)\]$/, '$1$2')
        .replace(/(^|[\s]+)\[([^\]]+)\]\(([^\)]+$)/, '$1$2')

        // images: not drawing untill it is finished
        .replace(/(^|[\s]+)\!\[([^\]]+)$/, '$1')
        .replace(/(^|[\s]+)\!\[([^\]]+)\]$/, '$1')
        .replace(/(^|[\s]+)\!\[([^\]]+)\]\(([^\)]+$)/, '$1')

        // codes: autoclose
        .replace(/(^|\s+)(\`+)([^\`]+)$/, '$1$2$3$2')
        
        // bolds italics striketrough: autoclose
        .replace(/(^|\s+)(\*+)([^\s][^\*]+)(\*+)?$/, (_, p1,p2,p3) => {
          return `${p1}${p2}${p3.replace(/\s+$/,'')}${p2}`
        })
        .replace(/(^|\s+)(\_+)([^\_]+)(\_+)?$/, (_, p1,p2,p3) => {
          return `${p1}${p2}${p3.replace(/\s+$/,'')}${p2}`
        })
        .replace(/(^|\s+)(\~+)([^\~]+)(\~+)?$/, (_, p1,p2,p3) => {
          return `${p1}${p2}${p3.replace(/\s+$/,'')}${p2}`
        })
        
        .replace(/(^|\s+)([\_\~]+)(\*+)([^\s][^\*\_\~]+)((\*+)?([\_\~]+)?)$/g, (_, p1,p2,p3,p4) => {
          return `${p1}${p2}${p3}${p4.replace(/\s+$/,'')}${p3}${p2}`
        })
        .replace(/(^|\s+)([\*\~]+)(\_+)([^\s][^\*\_\~]+)((\_+)?([\*\~]+)?)$/g, (_, p1,p2,p3,p4) => {
          return `${p1}${p2}${p3}${p4.replace(/\s+$/,'')}${p3}${p2}`
        })
        .replace(/(^|\s+)([\*\_]+)(\~+)([^\s][^\*\_\~]+)((\~+)?([\*\_]+)?)$/g, (_, p1,p2,p3,p4) => {
          return `${p1}${p2}${p3}${p4.replace(/\s+$/,'')}${p3}${p2}`
        }) + '❙⦀❙'

        : ''


    })

  ).then(v => {
    postMessage(v)
  })
};