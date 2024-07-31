import { GPTProvider } from "../idb/types";
import { getModels as getGPTModels } from "./utils";

export function getModels(){

  return async (
    provider: GPTProvider
  ) => {

    return provider ? getGPTModels(provider) : null

  }

}