import { PGlite } from '@electric-sql/pglite'
import { worker } from '@electric-sql/pglite/worker'
import { live } from '@electric-sql/pglite/live';
import { vector } from '@electric-sql/pglite/vector';


worker({
  async init() {
    // Create and return a PGlite instance
    return new PGlite('idb://gipidi.pglite',{
      extensions: {
        live,
        vector
      }
    })
  },
})