import { Get } from ".";
import { getModels } from "./utils";

export function getAllModels( get: Get ){

  return async () => {

    return await Promise.all(get().providers.map(async provider => {
      const models = provider ? await getModels(provider) : null
      return {
        provider,
        models
      }
    }))

  }

}