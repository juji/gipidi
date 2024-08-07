'use client'
import { type GPTProvider } from "./idb/types";



export function removeAll(){
  localStorage.removeItem('default-provider')
  localStorage.removeItem('default-model')
}

export function saveDefaultProvider( str: GPTProvider['id'] ){
  localStorage.setItem('default-provider', str)
}

export function getDefaultProvider(): GPTProvider['id'] | null {
  return localStorage.getItem('default-provider') as GPTProvider['id'] || null
}

export function saveDefaultModel( str: string ){
  localStorage.setItem('default-model', str)
}

export function getDefaultModel(): string | null {
  return localStorage.getItem('default-model') || null
}

export function saveCountryCode( str: string ){
  localStorage.setItem('country-code', str)
}

export function getCountryCode(){
  localStorage.getItem('country-code')
}


