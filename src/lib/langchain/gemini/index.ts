import { ChatGoogleGenerativeAI } from "@juji/langchain-google-genai";
import { GPTModel } from "../types";
import { GoogleGenerativeAI } from "@google/generative-ai";

export function getClient( apiKey: string ){
  const gemini = new GoogleGenerativeAI( apiKey )
  return gemini
}

export async function models(): Promise<GPTModel[]>{
  return [
    {
      id: 'gemini-1.5-flash',
      name: 'Gemini 1.5 Flash'
    },
    {
      id: 'gemini-1.5-pro',
      name: 'Gemini 1.5 Pro'
    },
    {
      id: 'gemini-1.0-pro',
      name: 'Gemini 1.0 Pro'
    },
  ]
}

export async function test( apiKey: string ){
  const client = getClient(apiKey)
  const model = client.getGenerativeModel({ 
    model: 'gemini-1.5-flash',
  })
  const result = await model.generateContent('say y');
  return !!result.response.text()
}


export async function chat(  ){

}
