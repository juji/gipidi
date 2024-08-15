import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatOllama } from "@langchain/ollama";
import { CreateTitleParams } from "../types";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import { createTitleSystem } from '../system'
import { OllamaSetting } from "@/lib/idb/types";

export async function createTitle({
  convoDetail,
  provider
}: CreateTitleParams ){

  const model = new ChatOllama({
    model: convoDetail.model,
    baseUrl: (provider.setting as OllamaSetting).url,
    format: 'json',
  })

  const messages = [
      new SystemMessage(createTitleSystem),
      new HumanMessage('Please create title for the following data: ' + JSON.stringify(
        convoDetail.data.filter(v => v.role !== 'system').map(v => ({
          role: v.role,
          content: v.content
        }))
      )),
  ];
  
  const parser = new JsonOutputParser()
  const result = await model.pipe(parser).invoke(messages);
  return result.title

}