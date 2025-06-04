import * as localforage from 'localforage';

export class LocalStore {
  private static DB_NAME = 'ajis.jp';
  private static STORE_NAME = 'localStore';

  private constructor() {}

  public static get newInstance(): LocalForage {
    return localforage.createInstance({
      driver: localforage.INDEXEDDB,
      name: this.DB_NAME,
      storeName: this.STORE_NAME,
      version: 1,
    });
  }
}
