import workerInjector from "@juji/jsstore/dist/worker_injector";
import { Connection, DATA_TYPE, type IDataBase, type ITable } from '@juji/jsstore'

export const TABLES = {
  GPT: 'gpt',
}

export const DEFAULT_DELETED = new Date('1970-01-01T00:00:00.000Z')

function getDatabase(){

  const gpt:ITable = {
    name: TABLES.GPT,
    columns: {
      id: { dataType: DATA_TYPE.String, primaryKey: true },
      created: { dataType: DATA_TYPE.DateTime },
      updated: { dataType: DATA_TYPE.DateTime },
      deleted: { dataType: DATA_TYPE.DateTime, default: DEFAULT_DELETED },
      apiKey: { dataType: DATA_TYPE.String }
    }
  }

  const database: IDataBase = {
    name: 'gipidi-gpt',
    version: 1,
    tables: [
      gpt,
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

