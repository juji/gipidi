import OpenAI from "openai";


const openai = new OpenAI({
  baseURL: 'http://localhost:11434/v1/',
  apiKey: 'asdf'
})

const chatCompletion = await openai.chat.completions.create({
  messages: [{ role: 'user', content: 'Say this is a test' }],
  model: 'llama3.1',
})

console.log(chatCompletion)
