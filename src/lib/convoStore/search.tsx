import type { Set, Get } from './'

export function search(set: Set, get: Get){

  return (text: string) => {

    const { convos } = get()
    
    set(state => {
      
      const lower = text.toLowerCase()
      if(!lower) state.searchResult = null
      else{
        const filtered = convos.filter(v => v.title.toLowerCase().match(lower))
        state.searchResult = filtered
      }

    })

  }


}