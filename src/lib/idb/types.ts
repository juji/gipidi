

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
  providerIcon: string
  systemPrompt: string
  model: string
  created: Date
  updated?: Date
  deleted: Date
}

export type ConvoAttachment = {
  id: string
  data: string, // base64
  text?: string,
  loading?: boolean
  mime: string,
  name: string
}

export type ConvoData = {
  id: string
  lastUpdate: Date
  role: 'user' | 'assistant' | 'system'
  content: string
  stopped?: boolean
  attachments?: ConvoAttachment[]
}

export type OllamaSetting = { url: string }
export type GenericSetting = { apiKey: string }

export type GPTProvider = {
  id: 'ollama' | 'groq' | 'gemini'
  icon: string
  setting: OllamaSetting | GenericSetting
  created: Date
  updated?: Date
  deleted: Date
}

export type Embeddings = {
  id: string
  name: string
  type: 'chromadb' | 'postgres' | 'redis'
  connectionUri: string
  created: Date
  updated?: Date
  deleted: Date
}