import { Select } from "@/components/ui/input"

export function ChromaDbOptions(){

  return <>
    <Select label={"Distance Function"} required name="distance" defaultValue={"l2"}>
      <option value="l2">Euclidean (L2) - Useful for text similarity, more sensitive to noise than cosine</option>
      <option value="cosine">Cosine - Useful for text similarity</option>
      <option value="ip">Inner Product (IP) - Recommender systems</option>
    </Select>
  </>

}