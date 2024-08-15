import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatGroq } from "@langchain/groq";
import { CreateTitleParams } from "../types";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import { createTitleSystem } from '../system'
import { GenericSetting } from "@/lib/idb/types";

export async function createTitle({
  convoDetail,
  provider
}: CreateTitleParams ){

  const model = new ChatGroq({
    model: convoDetail.model,
    apiKey: (provider.setting as GenericSetting).apiKey,
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
  const result = await model.pipe(parser).invoke(
    messages, 
    { response_format: { type: "json_object" } } as any
  );
  return result.title

}