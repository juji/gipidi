import type { Set, Get } from './'

export function newConvoSkeleton(set: Set, get: Get){

  const { activeConvo } = get()

  if(!activeConvo) return;

  set(state => ({ activeConvo: null }))

}