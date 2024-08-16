import { GPTProvider } from "../pglite/types";
import { modelsByProvider } from "@/lib/vendor/loader";

export function getModels(){

  return async (
    provider: GPTProvider
  ) => {

    const result = await modelsByProvider(provider)
    return result

  }

}