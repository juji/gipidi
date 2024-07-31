

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
  created: Date
  updated?: Date
  deleted: Date
}

export type ConvoData = {
  id: string
  lastUpdate: Date,
  type: 'user' | 'gpt' | 'system',
  content: string
}

export type OllamaSetting = { url: string }
export type GenericSetting = { apiKey: string }

export type GPTProvider = {
  id: 'ollama' | 'groq'
  setting: OllamaSetting | GenericSetting
  created: Date
  updated?: Date
  deleted: Date
}