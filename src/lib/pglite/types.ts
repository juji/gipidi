export type OllamaSetting = { url: string }
export type GenericSetting = { apiKey: string }

export type GPTProvider = {
  id: 'ollama' | 'groq' | 'gemini'
  icon: string
  setting: OllamaSetting | GenericSetting
  created?: Date
  updated?: Date
  deleted?: Date
}