/**
 * 商品ロケーション情報
 */
export type ProductLocation = {
  /** 一意識別子 */
  guid: string;
  /** 管轄区分 */
  jurisdictionClass: string;
  /** 企業コード */
  companyCode: string;
  /** 店舗コード */
  storeCode: string;
  /** 棚卸日 */
  inventoryDate: Date;
  /** エリアID */
  areaId: string;
  /** ロケーション番号 */
  locationNum: string;
  /** ロケーションUUID */
  locationUuid: string;
  /** シェルフ */
  shelf: string;
  /** フェイス */
  face: string;
  /** SKU コード */
  sku: string;
  /** 2段バーコード */
  twoGradeBarcode: string;
  /** 商品名 */
  productName: string;
  /** レイアウトID */
  layoutId: string;
  /** レイアウト名 */
  layoutName: string;
};
