import { MapPdfPaperSize, ScreenCaptureRange } from '../types';
import { StringUtil } from '../utils/StringUtil';

/**
 * サイドメニュー種別
 */
export const SideMenuTypes = StringUtil.toEnum([
  // 選択ツール
  'SELECT_TOOL',

  // ペースト操作
  'PASTE',

  // エリア
  'AREA',

  // テーブル
  'TABLE',

  // 壁
  'WALL',

  // 縞
  'ISLAND',

  // 円形テーブル
  'CIRCLE_TABLE',

  // 長方形テーブル
  'SQUARE_TABLE',

  // 楕円形テキスト
  'ELLIPSE_TEXT',

  // レジ
  'REGISTER_TABLE',

  // フリーテキスト
  'FREE_TEXT',

  // ゴンドラ
  'GONDOLA',

  // 網エンド
  'MESH_END',

  // 柱
  'PILLAR',

  // 長方形テキスト
  'RECT_TEXT',

  // 矢印１
  'ARROW1',

  // 矢印２
  'ARROW2',

  // L字テーブル
  'SPECIAL_SHAPE',

  // ペン
  'PEN',

  // 線
  'LINE',

  // 長方形
  'RECT',

  // 円形
  'CIRCLE',

  // 楕円形
  'ELLIPSE',

  // 多角形
  'POLYGON',

  // テキスト
  'TEXT',

  // 回転矢印
  'CIRCLE_ARROW',

  // トイレ
  'WC',

  // 休憩室
  'REST_AREA',

  // 電源
  'OUTLET',
]);
export type SideMenuType = keyof typeof SideMenuTypes;

/**
 * 色
 */
export type Color = {
  red: number;
  green: number;
  blue: number;
  alpha: number;
};

/**
 * 色(RGBA 型)
 */
export type RGBA = {
  r: number;
  g: number;
  b: number;
  a: number;
};

/**
 * シェイプデータ
 */
export type ShapeData = {
  id: string;
  index?: number;
  config: any;
};

/**
 * シェイプ操作
 */
export const ShapeOperations = StringUtil.toEnum([
  /**
   * シェイプ追加
   */
  'ADD',

  /**
   * シェイプ変更
   */
  'CHANGE',

  /**
   * シェイプ削除
   */
  'REMOVE',

  /**
   * シェイプ表示順変更
   */
  'CHANGE_INDEX',
]);
export type ShapeOperation = keyof typeof ShapeOperations;

/**
 * 表示順書操作
 */
export const DisplayOrderOperations = StringUtil.toEnum([
  /**
   * 最前面
   */
  'MOVE_TO_TOP',

  /**
   * 前面
   */
  'MOVE_UP',

  /**
   * 背面
   */
  'MOVE_DOWN',

  /**
   * 最背面
   */
  'MOVE_TO_BOTTOM',
]);
export type DisplayOrderOperation = keyof typeof DisplayOrderOperations;

/**
 * 表示順変更データ
 */
export type ChangeIndexData = {
  order: DisplayOrderOperation;
} & ShapeData;

/**
 * 編集データ
 */
export type EditShapeData = {
  operation: ShapeOperation;
  past?: ShapeData[] | ChangeIndexData[];
  present: ShapeData[] | ChangeIndexData[];
};

/**
 * やり直し、やり直しの取り消し操作
 */
export const UndoRedoOperations = StringUtil.toEnum([
  /**
   * 何もしない
   */
  'NOTHING',

  /**
   * 元に戻す
   */
  'UNDO',

  /**
   * やり直す
   */
  'REDO',
]);
export type UndoRedoOperation = keyof typeof UndoRedoOperations;

/**
 * ステージ規定サイズ
 */
export const StageRegulationSizes = StringUtil.toEnum([
  /** 極小 */
  'VERY_SMALL',

  /** 小 */
  'SMALL',

  /** 中 */
  'MEDIUM',

  /** 大 */
  'LARGE',

  /** 特大 */
  'EXTRA_LARGE',
]);
export type StageRegulationSize = keyof typeof StageRegulationSizes;

/**
 * ロケーション表示形式種別
 */
export const LocationDisplayFormatTypes = StringUtil.toEnum([
  /** 標準 */
  'STANDARD',

  /** カスタム */
  'CUSTOM',
]);
export type LocationDisplayFormatType = keyof typeof LocationDisplayFormatTypes;

/**
 * 選択ID種別
 */
export const SelectIdTypes = StringUtil.toEnum([
  /** エリアID */
  'A',

  /** テーブルID */
  'T',

  /** 枝番 */
  'B',
]);
export type SelectIdType = keyof typeof SelectIdTypes;

export type LayerData = {
  operation: UndoRedoOperation;
  current: EditShapeData;
  previous?: EditShapeData;
};

export type TableData = {
  id: string;
  datas: ShapeData[];
};

export type AreaData = {
  id: string;
  tables: TableData[];
};

export type MapPreferences = {
  /** 方眼表示有無 */
  showLattice: boolean;

  /** ルーラー表示有無 */
  showRulers: boolean;

  /** エリア ID 桁数 */
  areaIdLength: number;

  /** テーブル ID 桁数 */
  tableIdLength: number;

  /** 枝番桁数 */
  branchNumLength: number;

  /** ロケーション表示形式種別 */
  locationDisplayFormatType: LocationDisplayFormatType;

  /** ロケーションカスタム書式 */
  customFormats: LocationCustomFormat[];

  /** フォントサイズ */
  fontSize: number;
};

export type LayoutPreferences = {
  /** 印刷サイズ */
  printSize: MapPdfPaperSize;

  /** 画面キャプチャ範囲 */
  screenCaptureRange: ScreenCaptureRange;

  /** ステージ幅 */
  stageWidth: number;

  /** ステージ高さ */
  stageHeight: number;

  /** 方眼幅 */
  latticeWidth: number;

  /** 方眼高さ */
  latticeHeight: number;
};

export type Layout = {
  /** レイアウトID */
  layoutId: string;

  /** レイアウト名 */
  layoutName: string;

  /** 最新エリアID */
  latestAreaId: number;

  /** 最新テーブルID */
  latestTableId: number;

  /** 最新フロントウォール枝番 */
  latestFrontWallBranchNum: number;

  /** 最新レフトウォール枝番 */
  latestLeftWallBranchNum: number;

  /** 最新バックウォール枝番 */
  latestBackWallBranchNum: number;

  /** 最新ライトウォール枝番 */
  latestRightWallBranchNum: number;

  /** 最新レジテーブルID */
  latestRegisterTableId: number;

  /** 最新レジ枝番 */
  latestRegisterBranchNum: number;

  /** 最新フリーテキストテーブルID */
  latestFreeTextTableId: number;

  /** 最新フリーテキスト枝番 */
  latestFreeTextBranchNum: number;

  /** マップレイアウト環境設定 */
  preferences: LayoutPreferences;
};

export type LayoutData = {
  /** マップデータ */
  maps: ShapeData[];

  /** エリアデータ */
  areas: ShapeData[];
} & Layout;

export type SaveData = {
  /** マップID */
  mapId: string;

  /** マップ版数 */
  version: number;

  /** レイアウトデータ */
  layouts: LayoutData[];

  /** 棚卸メモ */
  note: string;

  /** 環境設定 */
  preferences: MapPreferences;

  /** エディターバージョン */
  editorVersion: string;
};

export type EditData = {
  map: any[];
  area: any[];
};

/**
 * ロケーションカスタム書式
 */
export type LocationCustomFormat = {
  /** 順序 */
  sequence: number;

  /** 選択ID種別 */
  selectIdType: SelectIdType;

  /** 開始位置 */
  startIndex: number;

  /** 終了位置 */
  endIndex: number;
};
