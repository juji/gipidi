// console.log(process.env)

import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";
import { ChatGroq } from "@langchain/groq";
import { ChatOllama } from "@langchain/ollama";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";

try{
  const model = new ChatGroq({
    model: "llama-3.1-70b-versatile"
  });
  
  // const model = new ChatOllama({
  //   model: "llama3.1:latest"
  // });

  // const model = new ChatGoogleGenerativeAI({
  //   model: "gemini-1.5-flash",
  // });
  
  const messages = [
    new SystemMessage({ content: 'You are a helpfull AI Assistant'}),
    new HumanMessage({ content: "Hi! I'm Bob" }),
    // new AIMessage({ content: "Hello Bob! How can I assist you today?" }),
    // new HumanMessage({ content: "What's my name?" }),
  ]

  // const res = await model.call(messages, {
  //   callbacks: [
  //     {
  //       handleLLMNewToken(token: string) {
  //         console.log(token);   
  //       },
  //     },
  //   ],
  // });
  
  // const parser = new StringOutputParser();
  // const chain = model.pipe(parser)
  // const res = await model.invoke(messages);
  // console.log('res', res)
  const stream = await model.stream(messages);
  let v = await stream.next()
  // let n = 0
  while(v){
    // n++;
    // if(n === 5) {
    //   stream.throw('canceledbyuser');
    //   break;
    // }
    console.log(v.value?.content);
    v = await stream.next()
  }

}catch(e){
  console.error(e)
}