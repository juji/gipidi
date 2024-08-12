

// tauri uses non http protocol
// i guess this is safer to use
export function getQueryString( keys: string[] ){

  const params = new URLSearchParams(window.location.search.replace(/^\?/,''))
  return keys.reduce((a,b) => {
    a[b] = params.get(b)
    return a
  },{} as {[k:string]: string|null})

}