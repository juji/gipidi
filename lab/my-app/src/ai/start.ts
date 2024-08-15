'use client'

import { ChatGroq } from "@langchain/groq";
import { ChatOllama } from "@langchain/ollama";
import { ChatGoogleGenerativeAI } from "@juji/langchain-google-genai";
import { useEffect, useRef } from "react";
import { z } from "zod";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { JsonOutputParser } from "@langchain/core/output_parsers";


const translation = z.object({
  translation: z.string().describe("The translated text"),
});

// Can also pass in JSON schema.
// It's also beneficial to pass in an additional "name" parameter to give the
// model more context around the type of output to generate.


export default function Start(){

  const started = useRef(false)
  
  useEffect(() => {

    if(started.current) return;
    started.current = true
    
    ;(() => {
      
      const model = new ChatGroq({
        model: "llama-3.1-70b-versatile",
        apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
      })
    
      start(model, 'groq',{ response_format: { type: "json_object" } })
    
    })()
    
    ;(() => {
    
      const model = new ChatOllama({
        model: "llama3.1:latest",
        format: 'json'
      })
    
      start(model, 'ollama')
    
    })()
    
    ;(() => {
    
      const model = new ChatGoogleGenerativeAI({
        model: "gemini-1.5-flash",
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
        json: true
      })
    
      start(model, 'gemini')
    
    })()

  },[])

  return null

}



async function start( model: any, name: string, options?:any ){
  const messages = [
    new SystemMessage(`
Translate the following English text into Italian. 

Reply with JSON, using the following JSON schema:
{"translation": "string"}
`),
    new HumanMessage("hi, i am superman"),
];

  const parser = new JsonOutputParser()
  const result = await model.pipe(parser).invoke(messages, options || {});
  console.log({name, result})
}

