import Konva from 'konva';

import { RGBA } from '../../types';

import {
  ShapeLocationGroup,
  ShapeLocationGroupConfig,
} from './ShapeLocationGroup';

export interface ShapeFreeTextConfig extends ShapeLocationGroupConfig {
  minWidth: number;
  minHeight: number;
  widthCells: number;
  heightCells: number;
  stroke: string;
  strokeRgb: RGBA;
  strokeTransparent: boolean;
  strokeDash: boolean;
  fill: string;
  fillRgb: RGBA;
  fillTransparent: boolean;
}

/**
 * フリーテキスト
 */
export class ShapeFreeText extends ShapeLocationGroup<ShapeFreeTextConfig> {
  private _rect: Konva.Rect;
  private _text: Konva.Text;
  private _locationNum: Konva.Text;
  private _cross1: Konva.Line;
  private _cross2: Konva.Line;

  /**
   * 初期化します.
   */
  constructor(config: ShapeFreeTextConfig) {
    super(config);

    const width = !config.width
      ? config.minWidth
      : config.width < config.minWidth
        ? config.minWidth
        : config.width;

    const height = !config.height
      ? config.minHeight
      : config.height < config.minHeight
        ? config.minHeight
        : config.height;

    // デフォルト値設定
    if (!config.hasOwnProperty('strokeTransparent')) {
      config.strokeTransparent = false;
    }
    if (!config.hasOwnProperty('strokeRgb')) {
      config.strokeRgb = { r: 0, g: 0, b: 0, a: 1 };
    }
    if (!config.hasOwnProperty('stroke')) {
      config.stroke = `rgba(${config.strokeRgb.r}, ${config.strokeRgb.g}, ${config.strokeRgb.b}, ${config.strokeRgb.a})`;
    }
    if (!config.hasOwnProperty('strokeDash')) {
      config.strokeDash = false;
    }
    if (!config.hasOwnProperty('strokeWidth')) {
      config.strokeWidth = 1;
    }
    if (!config.hasOwnProperty('fillTransparent')) {
      config.fillTransparent = false;
    }
    if (!config.hasOwnProperty('fillRgb')) {
      config.fillRgb = { r: 255, g: 255, b: 255, a: 1 };
    }
    if (!config.hasOwnProperty('fill')) {
      config.fill = `rgba(${config.fillRgb.r}, ${config.fillRgb.g}, ${config.fillRgb.b}, ${config.fillRgb.a})`;
    }

    // シェイプ
    this.name('FreeText');
    this.width(width);
    this.height(height);

    // 外枠
    this._rect = new Konva.Rect({
      perfectDrawEnabled: false,
      strokeScaleEnabled: false,
      shadowForStrokeEnabled: !config.shouldOptimize,
      hitStrokeWidth: 0,
      x: 0,
      y: 0,
      width,
      height,
      strokeWidth: config.strokeWidth,
      stroke: config.stroke,
      dash: config.strokeDash ? [5, 5] : [],
      fill: config.fill,
    });
    this._innerGroup.add(this._rect);

    // テキスト
    this._text = new Konva.Text({
      listening: false,
      perfectDrawEnabled: false,
      strokeScaleEnabled: false,
      shadowForStrokeEnabled: !config.shouldOptimize,
      hitStrokeWidth: 0,
      x: 0,
      y: 0,
      width,
      height: height / 2,
      text: config?.text,
      align: 'center',
      verticalAlign: 'bottom',
      fontSize: config.fontSize,
      visible: !!config.text && this.visibleLocationText(),
    });
    this._innerGroup.add(this._text);

    // ロケーション番号
    this._locationNum = new Konva.Text({
      listening: false,
      perfectDrawEnabled: false,
      strokeScaleEnabled: false,
      shadowForStrokeEnabled: !config.shouldOptimize,
      hitStrokeWidth: 0,
      x: 0,
      y: height / 2,
      width,
      height: height / 2,
      text: config.showFullLocationNum
        ? config.displayLocationNum
        : config.branchNum,
      align: 'center',
      verticalAlign: 'top',
      fontSize: config.fontSize,
      visible: this.visibleLocationNum(),
    });
    this._innerGroup.add(this._locationNum);

    // 欠番用バッテン線１（左上から右下）
    this._cross1 = new Konva.Line({
      name: 'cross1',
      listening: false,
      perfectDrawEnabled: false,
      strokeScaleEnabled: false,
      shadowForStrokeEnabled: !config.shouldOptimize,
      hitStrokeWidth: 0,
      points: [0, 0, config.width ?? 0, config.height ?? 0],
      stroke: 'red',
      strokeWidth: 2,
      visible: config.missingNumber,
    });
    this._innerGroup.add(this._cross1);

    // 欠番用バッテン線２（右上から左下）
    this._cross2 = new Konva.Line({
      name: 'cross2',
      listening: false,
      perfectDrawEnabled: false,
      strokeScaleEnabled: false,
      shadowForStrokeEnabled: !config.shouldOptimize,
      hitStrokeWidth: 0,
      points: [config.width ?? 0, 0, 0, config.height ?? 0],
      stroke: 'red',
      strokeWidth: 2,
      visible: config.missingNumber,
    });
    this._innerGroup.add(this._cross2);
  }

  /**
   * 設定を変更します.
   */
  override changeConfig = () => {
    const x = this._config.x ?? 0;
    const y = this._config.y ?? 0;
    const rotation = this._config.rotation ?? 0;
    const visible = this._config.visible ?? true;

    const width = !this._config.width
      ? this._config.minWidth
      : this._config.width < this._config.minWidth
        ? this._config.minWidth
        : this._config.width;
    this._config.width = width;

    const height = !this._config.height
      ? this._config.minHeight
      : this._config.height < this._config.minHeight
        ? this._config.minHeight
        : this._config.height;
    this._config.height = height;

    // シェイプ
    this.setAttrs({ x, y, width, height, rotation, visible });

    // 内部グループ
    if (this._isSelected) {
      this._innerGroup.setAttrs({
        x,
        y,
        width,
        height,
        rotation,
        visible,
        config: { ...this._config },
      });
    } else {
      this._innerGroup.setAttrs({ rotation: 0, config: { ...this._config } });
    }

    // 外枠
    this._rect.setAttrs({
      width,
      height,
      stroke: `rgba(${this._config.strokeRgb.r}, ${this._config.strokeRgb.g}, ${
        this._config.strokeRgb.b
      }, ${this._config.strokeTransparent ? 0 : this._config.strokeRgb.a})`,
      strokeWidth: this._config.strokeWidth ?? 0,
      dash: this._config.strokeDash ? [5, 5] : [],
      fill:
        this._config.fill ??
        `rgba(${this._config.fillRgb.r}, ${this._config.fillRgb.g}, ${
          this._config.fillRgb.b
        }, ${this._config.fillTransparent ? 0 : this._config.fillRgb.a})`,
    });

    // テキスト
    this._text.setAttrs({
      y: 0,
      width,
      height: height / 2,
      text: this._config?.text,
      fontSize: this._config.fontSize,
      visible: !!this._config.text && this.visibleLocationText(),
    });

    // ロケーション番号
    this._locationNum.setAttrs({
      y: height / 2,
      width,
      height: height / 2,
      text: this._config.showFullLocationNum
        ? this._config.displayLocationNum
        : this._config.branchNum,
      fontSize: this._config.fontSize,
      visible: this.visibleLocationNum(),
    });

    // 欠番用バッテン線１（左上から右下）
    this._cross1.setAttrs({
      points: [0, 0, width ?? 0, height ?? 0],
      visible: this._config.missingNumber,
    });

    // 欠番用バッテン線２（右上から左下）
    this._cross2.setAttrs({
      points: [width ?? 0, 0, 0, height ?? 0],
      visible: this._config.missingNumber,
    });
  };

  /**
   * テキストの表示有無を取得します.
   */
  override visibleLocationText = () => {
    return this._config.stageScale >= 70;
  };

  /**
   * 追加時、横方向へドラッグした際の幅を更新します.
   */
  public dragWidth(value: number) {
    if (value === 0) {
      return;
    }
    this._config = { ...this._config, width: value };
    this.changeConfig();
  }

  /**
   * 追加時、縦方向へドラッグした際の高さを更新します.
   */
  public dragHeight(value: number) {
    if (value === 0) {
      return;
    }
    this._config = { ...this._config, height: value };
    this.changeConfig();
  }
}
