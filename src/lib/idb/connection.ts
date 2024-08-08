import workerInjector from "@juji/jsstore/dist/worker_injector";
import { Connection, DATA_TYPE, type IDataBase, type ITable } from '@juji/jsstore'

export const TABLES = {
  CONVO: 'convo',
  CONVO_DETAIL: 'convoDetail',
  GPT_PROVIDER: 'gptProvider',
  SETTINGS: 'settings'
}


export const DEFAULT_DELETED = new Date('1970-01-01T00:00:00.000Z')

function getDatabase(){

  const convo:ITable = {
    name: TABLES.CONVO,
    columns: {
      id: { dataType: DATA_TYPE.String, primaryKey: true },
      created: { dataType: DATA_TYPE.DateTime },
      updated: { dataType: DATA_TYPE.DateTime },
      deleted: { dataType: DATA_TYPE.DateTime, default: DEFAULT_DELETED },
      title: { dataType: DATA_TYPE.String, enableSearch: true },
    }
  }

  const convoDetail:ITable = {
    name: TABLES.CONVO_DETAIL,
    columns: {
      id: { dataType: DATA_TYPE.String, primaryKey: true },
      created: { dataType: DATA_TYPE.DateTime },
      updated: { dataType: DATA_TYPE.DateTime },
      deleted: { dataType: DATA_TYPE.DateTime, default: DEFAULT_DELETED },
      data: { dataType: DATA_TYPE.Array },
      embeddings: { dataType: DATA_TYPE.Array },
      provider: { dataType: DATA_TYPE.String },
      model: { dataType: DATA_TYPE.String },
      systemPrompt: { dataType: DATA_TYPE.String },
    }
  }

  const gptProvider:ITable = {
    name: TABLES.GPT_PROVIDER,
    columns: {
      id: { dataType: DATA_TYPE.String, primaryKey: true },
      created: { dataType: DATA_TYPE.DateTime },
      updated: { dataType: DATA_TYPE.DateTime },
      deleted: { dataType: DATA_TYPE.DateTime, default: DEFAULT_DELETED },
      data: { dataType: DATA_TYPE.Array },
    }
  }

  const settings:ITable = {
    name: TABLES.SETTINGS,
    columns: {
      id: { dataType: DATA_TYPE.String, primaryKey: true },
      data: { dataType: DATA_TYPE.Object },
    }
  }

  const database: IDataBase = {
    name: 'gipidi',
    version: 5,
    tables: [
      convo,
      convoDetail,
      gptProvider,
      settings
    ]
  }

  return database

}

export function createConnection(){
  const connection = new Connection();
  connection.addPlugin(workerInjector);
  const dataBase = getDatabase();
  connection.initDb(dataBase);
  return connection
}

