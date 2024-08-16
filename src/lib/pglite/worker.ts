import { PGlite } from '@electric-sql/pglite'
import { worker } from '@electric-sql/pglite/worker'
import { live } from '@electric-sql/pglite/live';
import { vector } from '@electric-sql/pglite/vector';

/*
this should be compiled
checkout: bun run workers:esbuild
*/

worker({
  async init() {
    // Create and return a PGlite instance
    return new PGlite('idb://gipidi',{
      extensions: {
        live,
        vector
      }
    })
  },
})