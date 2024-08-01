import { OllamaSettings } from './ollama-settings'
import { GroqSettings } from './groq-settings'
import { GeminiSettings } from './gemini-settings'
import { DefaultModel } from './default-model'

export function GPTProviders(){

  return <>
    <h4>GPT Providers</h4>
    <OllamaSettings />
    <GroqSettings />
    <GeminiSettings />
    <DefaultModel />
  </>

}