import * as editorConstants from '../../constants/editor';

import { ShapeGroup, ShapeGroupConfig } from './ShapeGroup';
import { LocationConfig } from '.';

/**
 * 付番ありシェイプグループ用設定
 */
export interface ShapeLocationGroupConfig
  extends ShapeGroupConfig,
    LocationConfig {}

/**
 * 付番ありシェイプグループ
 */
export abstract class ShapeLocationGroup<
  P extends ShapeLocationGroupConfig,
> extends ShapeGroup<P> {
  /**
   * 初期化します.
   */
  constructor(config: P) {
    // デフォルト値設定
    if (!config.hasOwnProperty('areaId')) {
      config.areaId = '';
    }
    if (!config.hasOwnProperty('tableId')) {
      config.tableId = '';
    }
    if (!config.hasOwnProperty('branchNum')) {
      config.branchNum = '';
    }
    if (!config.hasOwnProperty('locationNum')) {
      config.locationNum = '';
    }
    if (!config.hasOwnProperty('displayLocationNum')) {
      config.displayLocationNum = '';
    }
    if (!config.hasOwnProperty('showFullLocationNum')) {
      config.showFullLocationNum = false;
    }
    if (!config.hasOwnProperty('text')) {
      config.text = '';
    }
    if (!config.hasOwnProperty(editorConstants.SHAPE_PROP_NAME_FONT_SIZE)) {
      config.fontSize = config.defaultFontSize;
    }
    if (
      !config.hasOwnProperty(editorConstants.SHAPE_PROP_NAME_MISSING_NUMBER)
    ) {
      config.missingNumber = false;
    }
    if (!config.hasOwnProperty(editorConstants.SHAPE_PROP_NAME_EMPTY_NUMBER)) {
      config.emptyNumber = false;
    }

    // 親クラス初期化
    super(config);
  }

  /**
   * エリアIDを取得します.
   */
  get areaId() {
    return this._config.areaId;
  }

  /**
   * エリアIDを設定します.
   */
  set areaId(value: string) {
    this._config = { ...this._config, areaId: value };
    this.changeConfig();
  }

  /**
   * テーブルIDを取得します.
   */
  get tableId() {
    return this._config.tableId;
  }

  /**
   * テーブルIDを設定します.
   */
  set tableId(value: string) {
    this._config = { ...this._config, tableId: value };
    this.changeConfig();
  }

  /**
   * 枝番を取得します.
   */
  get branchNum() {
    return this._config.branchNum;
  }

  /**
   * 枝番を設定します.
   */
  set branchNum(value: string) {
    this._config = { ...this._config, branchNum: value };
    this.changeConfig();
  }

  /**
   * ロケーション番号を取得します.
   */
  get locationNum() {
    return this._config.locationNum;
  }

  /**
   * ロケーション番号を設定します.
   */
  set locationNum(value: string) {
    this._config = { ...this._config, locationNum: value };
    this.changeConfig();
  }

  /**
   * 表示用ロケーション番号を取得します.
   */
  get displayLocationNum() {
    return this._config.displayLocationNum;
  }

  /**
   * 表示用ロケーション番号を設定します.
   */
  set displayLocationNum(value: string) {
    this._config = { ...this._config, displayLocationNum: value };
    this.changeConfig();
  }

  /**
   * ロケーション番号のフル桁表示有無を取得します.
   */
  get showFullLocationNum() {
    return this._config.showFullLocationNum;
  }

  /**
   * ロケーション番号のフル桁表示有無を設定します.
   */
  set showFullLocationNum(value: boolean) {
    this._config = { ...this._config, showFullLocationNum: value };
    this.changeConfig();
  }

  /**
   * テキストを取得します.
   */
  get text() {
    return this._config.text;
  }

  /**
   * テキストを設定します.
   */
  set text(value: string) {
    this._config.text = value;
  }

  /**
   * ステージの拡大率を取得します.
   */
  get stageScale() {
    return this._config.stageScale;
  }

  /**
   * ステージの拡大率を設定します.
   */
  set stageScale(value: number) {
    this._config = { ...this._config, stageScale: value };
    this.changeConfig();
  }

  /**
   * 拡大率に合わせたフォントサイズを取得します.
   */
  protected scaleFontSize = () => {
    if (this._config.stageScale >= 150) {
      // 拡大率が 150% 以上の場合はテキストを表示する為、フォントサイズを 100% に戻す
      return this._config.fontSize / (this._config.stageScale / 100);
    }
    return this._config.fontSize;
  };

  /**
   * ロケーション番号の表示有無を取得します.
   */
  protected visibleLocationNum = () => {
    return this._config.stageScale >= 70 && !this._config.emptyNumber;
  };

  /**
   * テキストの表示有無を取得します.
   */
  protected visibleLocationText = () => {
    return this._config.stageScale >= 150;
  };
}
