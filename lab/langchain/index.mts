// console.log(process.env)

import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatGroq } from "@langchain/groq";
import { ChatOllama } from "@langchain/ollama";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { StringOutputParser, JsonOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";

// const model = new ChatGroq({
//   model: "llama-3.1-70b-versatile"
// });

// const model = new ChatOllama({
//   model: "llama3.1:latest"
// });

const model = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash",
});

const systemTemplate = "Translate the following into {language}:";
const promptTemplate = ChatPromptTemplate.fromMessages([
  ["system", systemTemplate],
  ["user", "{text}"],
]);

const parser = new StringOutputParser();
const chain = promptTemplate.pipe(model).pipe(parser)
const result = await chain.invoke({ language: "italian", text: "hi, i am superman" });
console.log(result)