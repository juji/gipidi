

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
  icon: string
  model: string
  systemPrompt: string
  embeddingId?: string
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
  embeddings?: string[]
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

export type ChromaDBAuthSetting = {
  type: 'auth-bearer' | 'x-chroma-token'
  token: string
}

export type ChromaDBSetting = {
  tenant: string,
  database: string,
  auth?: ChromaDBAuthSetting
}

export type EmbeddingsDb = {
  id: string
  name: string
  type: 'chromadb' | 'postgres' | 'redis'
  url: string
  settings: ChromaDBSetting | object
  isDefault: boolean
  created?: Date
  updated?: Date
  deleted?: Date
}

export type EmbeddingsDbWithCount = EmbeddingsDb & {
  count: number
}

export type ChromaDBEmbedding = {
  distance: string,
}

export type Embeddings = {
  id: string
  name: string
  vendor: 'ollama' | 'gemini'
  model: string
  db: string
  dbVendor?: EmbeddingsDb['type']
  dbObject?: any
  settings: ChromaDBEmbedding | object
  created?: Date
  updated?: Date
  deleted?: Date
}