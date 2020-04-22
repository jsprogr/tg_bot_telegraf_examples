import {IMain, IDatabase, IInitOptions} from 'pg-promise';
const pgPromise = require('pg-promise')

import {IExtensions, UsersRepository} from './repos';

export type DBT = IDatabase<IExtensions> & IExtensions
export type PgDBT = {
  db: DBT,
  pgp: IMain,
}

export function createPgDB(config: any){
  const initOptions: IInitOptions<IExtensions> = {
    extend(obj: IExtensions, dc: any) {
      obj.users = new UsersRepository(obj, pgp);
    }
  };

  const pgp: IMain = pgPromise(initOptions);
  const db = <DBT>pgp(config)

  return {
    db,
    pgp
  }
}

export async function initializePgDB(pgDB: PgDBT) {
  await pgDB.db.users.create()
}

export function destroyPgDb(pgDB: PgDBT) {
  return pgDB.pgp.end
}
