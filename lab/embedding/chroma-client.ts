import { ChromaClient } from 'chromadb'

const client = new ChromaClient();

// ;(async () => {

//   console.log('creating collection')

//   const collection = await client.createCollection({
//     name: "my_collection",
//   });

//   console.log(collection)

// })()

;(async () => {

  console.log('creating collection with cosine')

  const collection = await client.createCollection({
    name: "my_collection2",
    metadata: { "hnsw:space": "cosine" },
  });

  console.log(collection)

})()