
import { GenericSetting, GPTProvider, OllamaSetting } from "../idb/types";
import { 
  models as ollamaModels,
  getClient as getOllamaClient
} from "@/lib/vendors/ollama";

import { 
  models as groqModels,
  getClient as getGroqClient
} from "@/lib/vendors/groq";

import { 
  models as geminiModels,
  getClient as getGeminiClient
} from "@/lib/vendors/gemini";

export async function getModels( provider: GPTProvider ){

  if(provider && provider.id === 'ollama'){

    const setting = provider.setting as OllamaSetting
    if(!setting) return null
    return await ollamaModels(getOllamaClient(setting.url))

  }else if(provider && provider.id === 'groq'){

    const setting = provider?.setting as GenericSetting
    if(!setting) return null
    return await groqModels(getGroqClient(setting.apiKey))

  }else if(provider && provider.id === 'gemini'){

    const setting = provider?.setting as GenericSetting
    if(!setting) return null
    return await geminiModels(getGeminiClient(setting.apiKey))

  }else{
    return null
  }

}