

export type Convo = {
  id: string
  title: string
  created: Date
  updated: Date
  deleted: Date
}

export type ConvoDetail = {
  id: string
  data: ConvoData[]
  created: Date
  updated: Date
  deleted: Date
}

export type ConvoData = {
  id: string
  lastUpdate: Date,
  type: 'user' | 'gpt' | 'system',
  content: string
}