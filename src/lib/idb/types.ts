

export type Convo = {
  id: string
  title: string
  created: Date
  updated?: Date
  deleted: Date
}

export type ConvoEmbeddings = {
  id: string,
  name: string,
  type: string,
  content: string
}

export type ConvoDetail = {
  id: string
  data: ConvoData[]
  embeddings?: ConvoEmbeddings[],
  provider: GPTProvider['id'],
  systemPrompt: string,
  model: string
  created: Date
  updated?: Date
  deleted: Date
}

export type ConvoAttachment = {
  data: string, // base64
  mime: string,
  name: string
}

export type ConvoData = {
  id: string
  lastUpdate: Date
  role: 'user' | 'assistant' | 'system'
  embeddings?: ConvoEmbeddings['id'][]
  content: string
  attachments?: ConvoAttachment[]
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