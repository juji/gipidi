import { Get } from ".";
import { loadVendor } from "../vendors/load";

export function getAllModels( get: Get ){

  return async () => {

    return await Promise.all(get().providers.map(async provider => {
      const vendor = provider ? await loadVendor(provider) : null
      const models = vendor ? await vendor.models() : null
      return {
        provider,
        models
      }
    }))

  }

}