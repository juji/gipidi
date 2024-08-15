import { Get } from ".";
import { modelsByProvider } from "@/lib/vendor/loader";

export function getAllModels( get: Get ){

  return async () => {

    return await Promise.all(get().providers.map(async provider => {
      const result = await modelsByProvider(provider)
      return {
        provider,
        models: result
      }
    }))

  }

}