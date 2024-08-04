import { createConnection, TABLES, DEFAULT_DELETED } from './idb/connection'

export async function removeHistory(){

  const date = new Date(new Date().valueOf() - (90 * 24 * 60 * 60 * 1000))
  const conn = createConnection()
  await Promise.all([
    conn.remove({
      from: TABLES.CONVO_DETAIL,
      where: [
        { deleted: { '!=': DEFAULT_DELETED } },
        { deleted: { '<=': date } },
      ]
    }),
    conn.remove({
      from: TABLES.CONVO,
      where: [
        { deleted: { '!=': DEFAULT_DELETED } },
        { deleted: { '<=': date } },
      ]
    })
  ])

  await conn.terminate()


}
