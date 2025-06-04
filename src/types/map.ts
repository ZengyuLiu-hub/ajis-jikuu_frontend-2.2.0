import { InventorySchedule } from './inventory';

export type MapVersion = {
  /** 管轄区分 */
  jurisdictionClass: string;

  /** 管轄区分名 */
  jurisdictionName: string;

  /** 企業コード */
  companyCode: string;

  /** 企業名 */
  companyName: string;

  /** 店舗コード */
  storeCode: string;

  /** 店舗名 */
  storeName: string;

  /** 郵便番号 */
  zipCode: string;

  /** 国交省住所１ */
  address1: string;

  /** 国交省住所２ */
  address2: string;

  /** 国交省住所補足 */
  addressDetail: string;

  /** 電話番号 */
  tel: string;

  /** FAX番号 */
  fax: string;

  /** マップID */
  mapId: string;

  /** バージョン */
  version: number;

  /** エディターバージョン */
  editorVersion?: string;

  /** 排他ID */
  exclusiveId?: string;

  /** 排他取得ユーザーID */
  exclusiveById?: string;

  /** 排他取得ユーザー名 */
  exclusiveByName?: string;

  /** 排他取得時刻 */
  exclusiveAt?: Date;

  /** 棚卸スケジュール */
  inventorySchedule?: InventorySchedule;

  /** 作成日時 */
  createdAt: Date;

  /** 作成ユーザーID */
  createdById: string;

  /** 作成ユーザー名 */
  createdByName: string;

  /** 更新日時 */
  updatedAt: Date;

  /** 更新ユーザーID */
  updatedById: string;

  /** 更新ユーザー名 */
  updatedByName: string;

  /** 行バージョン */
  rowVersion: number;
};

export type MapVersionData = {
  companyCode: string;
  companyName: string;
  companyNameKana: string;
  storeCode: string;
  storeName: string;
  storeNameKana: string;
  jurisdictionZoneCode: string;
  jurisdictionZoneName: string;
  jurisdictionDoCode: string;
  jurisdictionDoName: string;
  mapId: string;
  latestInventoryDate: Date;
  latestInventoryUpdatedById: string;
  latestInventoryUpdatedByName: string;
  latestInventoryUpdatedAt: Date;
  versions: MapVersion[];
};

export type StoreData = {
  jurisdictionClass: string;
  jurisdictionName: string;
  companyCode: string;
  companyName: string;
  storeCode: string;
  storeName: string;
  inventoryDate: Date;
};

export type MapStore = {
  jurisdictionClass: string;
  jurisdictionName: string;
  companyCode: string;
  companyName: string;
  storeCode: string;
  storeName: string;
  zipCode?: string;
  address1?: string;
  address2?: string;
  addressDetail?: string;
  tel?: string;
  fax?: string;
};
