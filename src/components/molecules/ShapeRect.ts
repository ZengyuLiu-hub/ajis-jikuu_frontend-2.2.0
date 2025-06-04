import Konva from 'konva';

import { RGBA } from '../../types';

import { ShapeGroup, ShapeGroupConfig } from './ShapeGroup';

export interface ShapeRectConfig extends ShapeGroupConfig {
  text: string;
  fontSize?: number;
  width: number;
  height: number;
  minWidth: number;
  minHeight: number;
  widthCells: number;
  heightCells: number;
  stroke: string;
  strokeRgb: RGBA;
  strokeTransparent: boolean;
  strokeWidth: number;
  strokeDash: boolean;
  fill: string;
  fillRgb: RGBA;
  fillTransparent: boolean;
}

/**
 * 長方形
 */
export class ShapeRect extends ShapeGroup<ShapeRectConfig> {
  private _rect: Konva.Rect;
  private _text: Konva.Text;

  /**
   * 初期化します.
   */
  constructor(config: ShapeRectConfig) {
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
    this.name('Rect');
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
      y: 0,
      x: 0,
      width,
      height,
      text: config.text,
      fontSize: config.fontSize,
      align: 'center',
      verticalAlign: 'middle',
      visible: !!config.text,
    });
    this._innerGroup.add(this._text);
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
      this._innerGroup.setAttrs({
        width,
        height,
        rotation: 0,
        config: { ...this._config },
      });
    }

    // 外枠
    this._rect.setAttrs({
      width,
      height,
      stroke: this._config.stroke,
      strokeWidth: this._config.strokeWidth ?? 0,
      dash: this._config.strokeDash ? [5, 5] : [],
      fill: this._config.fill,
    });

    // テキスト
    this._text.setAttrs({
      width,
      height,
      text: this._config.text,
      fontSize: this._config.fontSize,
      visible: !!this._config.text,
    });
  };

  /**
   * 追加時、横方向へドラッグした際の幅を更新します.
   */
  public dragWidth(value: number) {
    if (value === 0) {
      return;
    }
    this._config.width = value;
    this.changeConfig();
  }

  /**
   * 追加時、縦方向へドラッグした際の高さを更新します.
   */
  public dragHeight(value: number) {
    if (value === 0) {
      return;
    }
    this._config.height = value;
    this.changeConfig();
  }
}
