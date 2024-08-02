

export type Convo = {
  id: string
  title: string
  created: Date
  updated?: Date
  deleted: Date
}

export type ConvoDetail = {
  id: string
  data: ConvoData[]
  provider: GPTProvider['id'],
  systemPrompt: string,
  model: string
  created: Date
  updated?: Date
  deleted: Date
}

export type ConvoData = {
  id: string
  lastUpdate: Date
  role: 'user' | 'assistant' | 'system'
  content: string
  attachments?: {
    data: string, // base64
    mime: string
  }[]
}

export type OllamaSetting = { url: string }
export type GenericSetting = { apiKey: string }

export type GPTProvider = {
  id: 'ollama' | 'groq' | 'gemini'
  setting: OllamaSetting | GenericSetting
  created: Date
  updated?: Date
  deleted: Date
}