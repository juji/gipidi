import { GPTProvider } from "../idb/types";
import { loadVendor } from "../vendors/load";

export function getModels(){

  return async (
    provider: GPTProvider
  ) => {

    const vendor = await loadVendor(provider)
    const models = await vendor.models()
    return models

  }

}