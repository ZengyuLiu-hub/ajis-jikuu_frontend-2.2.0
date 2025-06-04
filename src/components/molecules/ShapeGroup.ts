import Konva from 'konva';
import { Container } from 'konva/lib/Container';

import * as editorConstants from '../../constants/editor';

import { ShapeConfig } from '.';

/**
 * シェイプグループ用設定
 */
export interface ShapeGroupConfig extends Konva.GroupConfig, ShapeConfig {}

/**
 * シェイプグループ
 */
export abstract class ShapeGroup<
  P extends ShapeGroupConfig,
> extends Konva.Group {
  /** 設定 */
  protected _config: P;
  /** 選択状態 */
  protected _isSelected: boolean;
  /** PDF 出力から除外するかどうか */
  protected _excludesPdfOutput: boolean;

  /** 内部グループ */
  protected _innerGroup: Konva.Group;

  /**
   * 初期化します.
   */
  constructor(config: P) {
    // デフォルト値設定
    if (!config.hasOwnProperty('disabled')) {
      config.disabled = false;
    }
    if (!config.hasOwnProperty('selectable')) {
      config.selectable = true;
    }

    // 親クラス初期化
    super(config);

    this._config = config;

    this._isSelected = false;

    this._excludesPdfOutput = false;

    this.on('changeAxis', this.handleChangeAxis);

    // 内部グループ
    this._innerGroup = new Konva.Group({
      uuid: config.uuid,
      name: 'innerGroup',
      perfectDrawEnabled: false,
      strokeScaleEnabled: false,
      shadowForStrokeEnabled: !config.shouldOptimize,
      hitStrokeWidth: 0,
      x: 0,
      y: 0,
      rotation: 0,
      visible: config.visible ?? true,
      config,
    });
    this._innerGroup.on('changeConfig', this.handleChangeConfigByInnerGroup);
    this._innerGroup.on('moveToParent', this.moveToParent);
    this.add(this._innerGroup);
  }

  /**
   * 設定情報を取得します.
   */
  get config() {
    return this._config as P;
  }

  /**
   * 設定情報を設定します.
   */
  set config(config: P) {
    this._config = { ...this._config, ...config };
    this.changeConfig();
  }

  /**
   * UUID を取得します.
   */
  get uuid() {
    return this.getAttr(editorConstants.SHAPE_PROP_NAME_UUID);
  }

  /**
   * 無効状態を取得します.
   */
  get disabled() {
    return this._config.disabled;
  }

  /**
   * 無効状態を設定します.
   */
  set disabled(value: boolean) {
    this._config = { ...this._config, disabled: value };
    this.changeConfig();
  }

  /**
   * 選択可否を取得します.
   */
  get selectable() {
    return this._config.selectable;
  }

  /**
   * 選択可否を設定します.
   */
  set selectable(value: boolean) {
    this._config = { ...this._config, selectable: value };
    this.changeConfig();
  }

  /**
   * 読取り専用有無を取得します.
   */
  get readOnly() {
    return this._config.readOnly ?? false;
  }

  /**
   * 読取り専用有無を設定します.
   */
  set readOnly(value: boolean) {
    this._config = { ...this._config, readOnly: value };
    this.changeConfig();
  }

  /**
   * 設定を変更します.
   */
  abstract changeConfig(): void;

  /**
   * 選択中である場合は true を、それ以外の場合は false を返します.
   */
  public isSelected = () => this._isSelected;

  /**
   * 選択の状態を変更します.
   */
  protected changeSelectState(selected: boolean) {
    this._isSelected = selected;
  }

  /**
   * @returns PDF 出力から除外する場合は true を、それ以外の場合は false を返します.
   */
  public excludesPdfOutput = () => this._excludesPdfOutput;

  /**
   * 内部グループを編集レイヤーへ移動します.
   */
  public moveToContainer = (container?: Container | null): Konva.Group => {
    if (!container || this._innerGroup.parent === container) {
      return this._innerGroup;
    }
    this.changeSelectState(true);

    this._innerGroup.moveTo(container);
    this._innerGroup.setAttrs({
      x: this.x(),
      y: this.y(),
      rotation: this.rotation(),
      scaleX: this.scaleX(),
      scaleY: this.scaleY(),
      config: { ...this._config },
    });

    return this._innerGroup;
  };

  /**
   * 内部グループを親へ戻します.
   */
  public moveToParent = () => {
    // 親へ戻す
    this._innerGroup.moveTo(this);
    this.changeSelectState(false);

    // 内部での表示位置をリセット
    this._innerGroup.setAttrs({
      x: 0,
      y: 0,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
    });
  };

  private handleChangeAxis = async () => {
    if (!this.id()) {
      return;
    }
    this._config = { ...this._config, x: this.x(), y: this.y() };
  };

  /**
   * 内部グループが保持している設定を反映します.
   */
  private handleChangeConfigByInnerGroup = () => {
    // プロパティ反映
    this.config = this._innerGroup.attrs.config as P;
  };
}
