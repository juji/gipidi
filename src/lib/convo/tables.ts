
export const TABLE = {
  CONVO: 'convo',
  CONVO_DETAIL: 'convoDetail',
}

export const INITDATE = new Date('1970-01-01Z00:00:00:000')

export const convo = {
  name: TABLE.CONVO,
  columns: {
    id: { dataType: 'object', primaryKey: true },
    created: { dataType: 'date_time' },
    deleted: { dataType: 'date_time', default: INITDATE },
    title: { dataType: 'string', enableSearch: true }
  }
}

export const convoDetail = {
  name: TABLE.CONVO_DETAIL,
  columns: {
    id: { dataType: 'object', primaryKey: true },
    created: { dataType: 'date_time' },
    deleted: { dataType: 'date_time', default: INITDATE },
    data: { dataType: 'array' },
  }
}