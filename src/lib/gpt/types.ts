

export type GPTProvider = {
  id: 'ollama' | 'groq' | 'other'
  apiKey?: String
  setting: Object
  created: Date
  updated?: Date
  deleted: Date
}
