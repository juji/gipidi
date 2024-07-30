
export function searchBarFocus(searchBarId: string){
  const input = document.querySelector(searchBarId)
  if(input) (input as HTMLInputElement).focus()
}

const initZoomLevel = 1
export function zoomNormalize(){
  document.body.style.zoom = initZoomLevel+''
}

export function zoomIn(){
  if(!document.body.style.zoom){
    document.body.style.zoom = (initZoomLevel + .1) + ''
  }else{
    document.body.style.zoom = (Number(document.body.style.zoom) + .1) + ''
  }
}

export function zoomOut(){
  if(!document.body.style.zoom){
    document.body.style.zoom = (initZoomLevel - .1) + ''
  }else{
    document.body.style.zoom = (Number(document.body.style.zoom) - .1) + ''
  }
}


export function keyboardListeners({
  searchBarId = ''
}:{
  searchBarId?: string
}){

  function listener(e: KeyboardEvent) {

    if (e.key === 'r' && (e.metaKey || e.ctrlKey) && e.shiftKey) {
      window.location.reload()
    }

    if (e.key === 'f5' && e.ctrlKey) {
      window.location.reload()
    }

    if (e.key === 'r' && (e.metaKey || e.ctrlKey)) {
      window.location.reload()
    }

    if (e.key === 'f' && (e.metaKey || e.ctrlKey)) {
      if(searchBarId) searchBarFocus(searchBarId)
    }

    if (e.key === '0' && (e.metaKey || e.ctrlKey)) {
      zoomNormalize()
    }

    if (e.key === '+' && (e.metaKey || e.ctrlKey)) {
      zoomIn()
    }
    
    if (e.key === '=' && (e.metaKey || e.ctrlKey)) {
      zoomIn()
    }

    if (e.key === '-' && (e.metaKey || e.ctrlKey)) {
      zoomOut()
    }
  }

  window.addEventListener('keydown', listener);

  return () => {
    window.removeEventListener('keydown', listener);
  }

}