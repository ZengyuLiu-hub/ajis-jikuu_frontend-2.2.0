import { ScreenCaptureRange } from './';
import { StringUtil } from '../utils/StringUtil';

/**
 * マップ PDF 操作
 */
export const MapPdfOrientations = StringUtil.toEnum([
  /**
   * 縦向き
   */
  'portrait',

  /**
   * 横向き
   */
  'landscape',
]);
export type MapPdfOrientation = keyof typeof MapPdfOrientations;

/**
 * マップ PDF 用紙サイズ
 */
export const MapPdfPaperSizes = StringUtil.toEnum([
  /**
   * A4
   */
  'A4',

  /**
   * A3
   */
  'A3',
]);
export type MapPdfPaperSize = keyof typeof MapPdfPaperSizes;

/**
 * マップ PDF 出力モード
 */
export const MapPdfOutputModes = StringUtil.toEnum([
  /**
   * 棚卸モード
   */
  'INVENTORY',

  /**
   * 納品モード
   */
  'STATEMENT_OF_DELIVERY',
]);
export type MapPdfOutputMode = keyof typeof MapPdfOutputModes;

/**
 * マップ PDF 回転
 */
export const MapPdfRotations = StringUtil.toEnum([
  /**
   * なし
   */
  'NONE',

  /**
   * 右方向
   */
  'RIGHT',

  /**
   * 左方向
   */
  'LEFT',
]);
export type MapPdfRotation = keyof typeof MapPdfRotations;

/**
 * マップ PDF 印刷設定
 */
export type MapPdfPrintSettings = {
  /** マップ PDF 出力モード */
  outputMode: MapPdfOutputMode;

  /** ヘッダー・フッター出力有無 */
  outputHeaderFooter: boolean;

  /** マップ PDF 回転 */
  rotation: MapPdfRotation;
};

/**
 * [ビューア] マップ PDF 印刷設定
 */
export type ViewerPdfOutputSettings = {
  /** ステージサイズ（幅） */
  stageWidth: number;

  /** ステージサイズ（高さ） */
  stageHeight: number;

  /** 画面キャプチャ範囲 */
  screenCaptureRange: ScreenCaptureRange;

  /** マップ PDF 用紙サイズ */
  printSize: MapPdfPaperSize;
} & MapPdfPrintSettings;
