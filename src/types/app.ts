import { StringUtil } from '../utils/StringUtil';

/**
 * 表示言語
 */
export const Languages = StringUtil.toEnum([
  'ja',
  'en',
  'cn',
  'tw',
  'ko',
  'vi',
  'th',
]);
export type Language = keyof typeof Languages;

export type Lang = {
  label: string;
  lang: Language;
};

/**
 * ダイアログメッセージ種別
 */
export const DialogTypes = StringUtil.toEnum([
  'ERROR',
  'INFORMATION',
  'CONFIRM',
]);
export type DialogType = keyof typeof DialogTypes;

/**
 * メディアタイプ
 */
export const MediaTypes = {
  JSON: 'application/json',
};
export type MediaType = keyof typeof MediaTypes;

/**
 * 用紙サイズ
 */
export const PaperSizes = StringUtil.toEnum([
  'B0',
  'A0',
  'B1',
  'A1',
  'B2',
  'A2',
  'B3',
  'A3',
  'B4',
  'A4',
]);
export type PaperSize = keyof typeof PaperSizes;

/**
 * 向き
 */
export const Directions = StringUtil.toEnum(['TOP', 'RIGHT', 'BOTTOM', 'LEFT']);
export type Direction = keyof typeof Directions;

/**
 * ゴンドラの配置
 */
export const GondolaAlignments = StringUtil.toEnum(['VERTICAL', 'HORIZONTAL']);
export type GondolaAlignment = keyof typeof GondolaAlignments;

/**
 * ゴンドラの配置
 */
export const GondolaPlacements = StringUtil.toEnum([
  /**
   * 横置き
   */
  'HORIZONTAL',

  /**
   * 縦置き
   */
  'VERTICAL',
]);
export type GondolaPlacement = keyof typeof GondolaPlacements;

/**
 * 壁の配置
 */
export const WallAlignments = StringUtil.toEnum(['FW', 'LW', 'BW', 'RW']);
export type WallAlignment = keyof typeof WallAlignments;

/**
 * ナンバリングルール
 */
export const NumberingRules = StringUtil.toEnum([
  /**
   * 時計回り
   */
  'CLOCKWISE',

  /**
   * 反時計回り
   */
  'COUNTER_CLOCKWISE',
]);
export type NumberingRule = keyof typeof NumberingRules;

/**
 * ステージの規模
 */
export const StageScales = StringUtil.toEnum([
  /**
   * 拡大
   */
  'UP',

  /**
   * 縮小
   */
  'DOWN',

  /**
   * リセット
   */
  'RESET',

  /**
   * 直接指定
   */
  'DIRECT',
]);
export type StageScale = keyof typeof StageScales;

/**
 * 繰返しの方向
 */
export const RepeatDirections = StringUtil.toEnum([
  /**
   * 上
   */
  'TOP',

  /**
   * 右
   */
  'RIGHT',

  /**
   * 下
   */
  'BOTTOM',

  /**
   * 左
   */
  'LEFT',
]);
export type RepeatDirection = keyof typeof RepeatDirections;

/**
 * 特殊型
 */
export const SpecialShapeTypes = StringUtil.toEnum([
  /**
   * L字
   */
  'L',
]);
export type SpecialShapeType = keyof typeof SpecialShapeTypes;

/**
 * 入力種別
 */
export const InputTypes = StringUtil.toEnum([
  /**
   * 指定
   */
  'MANUAL',

  /**
   * 自動
   */
  'AUTO',
]);
export type InputType = keyof typeof InputTypes;

/**
 * 島種別
 */
export const IslandTypes = StringUtil.toEnum([
  /**
   * 円
   */
  'CIRCLE',

  /**
   * 四角
   */
  'SQUARE',

  /**
   * レジ
   */
  'REGISTER',

  /**
   * フリーテキスト
   */
  'FREE_TEXT',
]);
export type IslandType = keyof typeof IslandTypes;

/**
 * 有効種別
 */
export const AvailableTypes = StringUtil.toEnum([
  /**
   * 利用可能
   */
  'AVAILABLE',

  /**
   * 利用不可
   */
  'NOT_AVAILABLE',
]);
export type AvailableType = keyof typeof AvailableTypes;

/**
 * テーブルエンド種別
 */
export const TableEndTypes = StringUtil.toEnum([
  /**
   * 標準
   */
  'BASIC',

  /**
   * 網目エンド
   */
  'MESH_END',

  /**
   * エンドなし
   */
  'NO_END',
]);
export type TableEndType = keyof typeof TableEndTypes;

/**
 * 画面キャプチャ範囲
 */
export const ScreenCaptureRanges = StringUtil.toEnum([
  /**
   * 表示領域
   */
  'VIEW',

  /**
   * ステージ全体
   */
  'STAGE',
]);
export type ScreenCaptureRange = keyof typeof ScreenCaptureRanges;

/**
 * ロケーション検索種別
 */
export const LocationSearchCategories = StringUtil.toEnum([
  /**
   * エリアID
   */
  'AREA_ID',

  /**
   * テーブルID
   */
  'TABLE_ID',

  /**
   * ロケーション番号
   */
  'LOCATION_NUM',

  /**
   * 重複ロケーション番号
   */
  'DUPLICATED_LOCATION_NUM',

  /**
   * エリアID 不整合
   */
  'AREA_ID_MISMATCH',
]);
export type LocationSearchCategory = keyof typeof LocationSearchCategories;

/**
 * 役割種別
 */
export const RoleTypes = StringUtil.toEnum([
  /**
   * 管理者
   */
  'MANGER',

  /**
   * 編集者
   */
  'EDITOR',

  /**
   * 閲覧者
   */
  'VIEWER',
]);
export type RoleType = keyof typeof RoleTypes;

/**
 * 権限種別
 */
export const AuthorityTypes = StringUtil.toEnum([
  /**
   * 企業検索
   */
  'COMPANY_SEARCH',

  /**
   * カウントデータ検索
   */
  'COUNT_DATA_SEARCH',

  /**
   * カウントロケーション検索
   */
  'COUNT_LOCATION_SEARCH',

  /**
   * 現在作業中カウントデータ検索
   */
  'CURRENT_COUNT_DATA_SEARCH',

  /**
   * 棚卸スケジュール検索
   */
  'INVENTORY_SCHEDULE_SEARCH',

  /**
   * 管理検索
   */
  'JURISDICTION_SEARCH',

  /**
   * 管轄指定
   */
  'JURISDICTION_SELECT',

  /**
   * マップ作成
   */
  'MAP_ADD',

  /**
   * マップ複製
   */
  'MAP_COPY',

  /**
   * マップ削除
   */
  'MAP_DELETE',

  /**
   * マップ編集
   */
  'MAP_EDIT',

  /**
   * マップ Excel 取込
   */
  'MAP_EXCEL_IMPORT',

  /**
   * マップロケーション比較
   */
  'MAP_LOCATION_COMPARE',

  /**
   * マップ PDF 出力
   */
  'MAP_PDF_OUTPUT',

  /**
   * マップ検索
   */
  'MAP_SEARCH',

  /**
   * マップ表示
   */
  'MAP_VIEW',

  /**
   * 棚割データ CSV 取込
   */
  'PLANOGRAM_CSV_UPLOAD',

  /**
   * 商品ロケーション検索
   */
  'PRODUCT_LOCATION_SEARCH',

  /**
   * 店舗検索
   */
  'STORE_SEARCH',

  /**
   * 棚割検索
   */
  'PLANOGRAM_SEARCH',
]);
export type AuthorityType = keyof typeof AuthorityTypes;

export type AlertDialogData = {
  type: DialogType;
  message: string;
  negativeAction?(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
  positiveAction?(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
};

export const ActiveProfiles = StringUtil.toEnum([
  /**
   * 開発環境
   */
  'DEVELOPMENT',

  /**
   * テスト環境
   */
  'TESTING',

  /**
   * ステージング環境
   */
  'STAGING',

  /**
   * ホットフィックス環境
   */
  'HOTFIX',

  /**
   * 本番環境
   */
  'PRODUCTION',
]);
export type ActiveProfile = keyof typeof ActiveProfiles;
