'use client'
import { type Convo } from "./idb/types";
import { type GPTProvider } from "./idb/types";

export const ls = {

  removeAll(){
    localStorage.removeItem('convo')
    localStorage.removeItem('default-provider')
    localStorage.removeItem('default-model')
  },

  saveConvoId( convo: Convo ){
    localStorage.setItem('convo', convo.id)
  },
  
  getLastConvoId(){
    return localStorage.getItem('convo')
  },

  saveDefaultProvider( str: GPTProvider['id'] ){
    localStorage.setItem('default-provider', str)
  },
  
  getDefaultProvider(): GPTProvider['id'] | null {
    return localStorage.getItem('default-provider') as GPTProvider['id'] || null
  },

  saveDefaultModel( str: string ){
    localStorage.setItem('default-model', str)
  },
  
  getDefaultModel(): string | null {
    return localStorage.getItem('default-model') || null
  },

}

