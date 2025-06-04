import { StringUtil } from '../utils/StringUtil';

export type InventoryDatesData = {
  jurisdictionClass: string;
  companyCode: string;
  storeCode: string;
  inventoryDate: Date;
  inventoryId: string;
  mapId: string;
  version: number;
  exclusiveId: string;
  editLockAt: Date;
  editLockById: string;
  editLockByName: string;
  createdAt: Date;
  createdById: string;
  createdByName: string;
  updatedAt: Date;
  updatedById: string;
  updatedByName: string;
  rowVersion: number;
  linkedSchedule: boolean;
};

export type InventorySchedulesData = {
  jurisdictionClass: string;
  companyCode: string;
  storeCode: string;
  inventoryDate: Date;
  zoneCode: string;
  zoneName: string;
  doCode: string;
  doName: string;
};

export type InventorySchedule = {
  /** マップID */
  mapId: string;

  /** バージョン */
  version: number;

  /** 棚卸ID */
  inventoryId: string;

  /** 管轄区分 */
  jurisdictionClass: string;

  /** 管轄区分名 */
  jurisdictionName: string;

  /** 企業コード */
  companyCode: string;

  /** 企業名 */
  companyName: string;

  /** 企業名(カナ) */
  companyNameKana: string;

  /** 店舗コード */
  storeCode: string;

  /** 店舗名 */
  storeName: string;

  /** 店舗名(カナ) */
  storeNameKana: string;

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

  /** 棚卸日 */
  inventoryDates: Date[];

  /** ゾーンコード */
  zoneCode: string;

  /** ゾーン名 */
  zoneName: string;

  /** DO コード */
  doCode: string;

  /** DO 名 */
  doName: string;

  /** 昼夜 */
  timeFrame: string;
};

export const MapStatuses = StringUtil.toEnum(['EDITING', 'UPDATED']);
export type MapStatus = keyof typeof MapStatuses;

export type InventoryOperationDate = {
  /** 管轄区分 */
  jurisdictionClass: string;

  /** 管轄区分名 */
  jurisdictionName: string;

  /** 企業コード */
  companyCode: string;

  /** 企業名 */
  companyName: string;

  /** 企業名(カナ) */
  companyNameKana: string;

  /** 店舗コード */
  storeCode: string;

  /** 店舗名 */
  storeName: string;

  /** 店舗名(カナ) */
  storeNameKana: string;

  /** 棚卸日 */
  inventoryDate: Date;
};
