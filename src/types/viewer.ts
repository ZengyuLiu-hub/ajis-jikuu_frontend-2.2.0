import { StringUtil } from '../utils/StringUtil';

/**
 * ビューアロケーション色種別
 */
export const ViewLocationColorTypes = StringUtil.toEnum([
  // カウント進捗
  'COUNT_PROGRESS',

  // 集中チェック
  'INTENSIVE_CHECK',

  // サンプリング
  'SAMPLING',

  // オーディット
  'AUDIT',

  // 全体進捗
  'ALL_PROGRESS',

  // 商品ロケーション
  'PRODUCT_LOCATION',
]);

/**
 * ビューアロケーション色種別
 */
export type ViewLocationColorType = keyof typeof ViewLocationColorTypes;

/**
 * ビューアロケーション集計値種別選択肢
 */
export const ViewLocationAggregateDataTypes = StringUtil.toEnum([
  // なし
  'NONE',

  // 部門名
  'DEPARTMENT_NAME',

  // 数量
  'QUANTITY',

  // 社員番号
  'EMPLOYEE_NUM',

  // カウント時間
  'COUNT_TIME',

  // エディタテキスト
  'EDITOR_TEXT',
]);

/**
 * ビューアロケーション集計値種別
 */
export type ViewLocationAggregateDataType =
  keyof typeof ViewLocationAggregateDataTypes;

/**
 * カウントロケーション
 */
export type CountLocation = {
  /** 一意キー */
  id: string;

  /** 棚卸日 */
  inventoryDate: string;

  /** 管轄区分 */
  jurisdictionClass: string;

  /** 企業コード */
  companyCode: string;

  /** 店舗コード */
  storeCode: string;

  /** PC */
  computer: string;

  /** エリア */
  areaId: string;

  /** ロケーション */
  locationNum: string;

  /** 社員番号 */
  employeeCode: string;

  /** 部門名 */
  departmentName: string;

  /** 数量 */
  quantity: string;

  /** カウント時間 */
  countTime: string;

  /** TT データのみ */
  onlyTt: boolean;

  /** 集中チェック実施ステータス */
  intensiveCheckStatus: string;

  /** サンプリング実施ステータス */
  samplingStatus: string;

  /** オーディット実施ステータス */
  auditStatus: string;

  /** 全体進捗ステータス */
  allProgressStatus: string;

  /** 連携データ作成日時 */
  createdAt: string;
};

/**
 * カウントデータ.
 */
export type CountData = {
  /** 一意識別子. */
  id: string;

  /** 管轄区分. */
  jurisdictionClass: string;

  /** 企業コード. */
  companyCode: string;

  /** 店舗コード. */
  storeCode: string;

  /** 棚卸日. */
  inventoryDate: string;

  /** ダンプNo.. */
  dumpNo: number;

  /** 社員番号. */
  employeeCode: string;

  /** エリア. */
  areaId: string;

  /** ロケーション番号. */
  locationNum: string;

  /** シェルフ. */
  shelf: number;

  /** フェイス. */
  face: number;

  /** 部門. */
  department: string;

  /** 部門名. */
  departmentName: string;

  /** 商品名. */
  productName: string;

  /** SKUコード. */
  sku: string;

  /** 2段バーコード. */
  twoGradeBarcode: string;

  /** 売価. */
  sellingPrice: number;

  /** 数量. */
  quantity: number;

  /** フェイシング数. */
  facing: number;

  /** カウント時間. */
  countTime: string;

  /** 集中チェック実施ステータス. */
  intensiveCheckStatus: string;

  /** サンプリング実施ステータス. */
  samplingStatus: string;

  /** オーディット実施ステータス. */
  auditStatus: string;

  /** 全体進捗ステータス. */
  allProgressStatus: string;

  /** 更新日時. */
  updatedAt: Date;
};

export type Planogram = {
  /** 管轄区分. */
  jurisdictionClass: string;

  /** 企業コード. */
  companyCode: string;

  /** 店舗コード. */
  storeCode: string;

  /** エリア. */
  areaId: string;

  /** ロケーション番号. */
  locationNum: string;

  /** シェルフ. */
  shelf: number;

  /** フェイス. */
  face: number;

  /** SKUコード. */
  sku: string;

  /** フェイシング数. */
  facing: number;

  /** フェイス面. */
  faceSurface: number;

  /** フェイス回転. */
  faceRotation: number;

  /** 積上数. */
  stacks: number;

  /** 陳列種別. */
  displayClass: number;

  /** 棚割CSV-ID. */
  planogramCsvId: string;

  /** 更新日時. */
  updatedAt: Date;
};
