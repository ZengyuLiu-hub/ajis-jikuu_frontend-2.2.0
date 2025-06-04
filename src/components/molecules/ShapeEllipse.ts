import Konva from 'konva';

import { RGBA } from '../../types';

import { ShapeGroup, ShapeGroupConfig } from './ShapeGroup';

export interface ShapeEllipseConfig extends ShapeGroupConfig {
  text: string;
  fontSize?: number;
  radiusX: number;
  radiusY: number;
  minRadiusX: number;
  minRadiusY: number;
  strokeRgb: RGBA;
  strokeTransparent: boolean;
  strokeDash: boolean;
  fillRgb: RGBA;
  fillTransparent: boolean;
}

/**
 * 楕円
 */
export class ShapeEllipse extends ShapeGroup<ShapeEllipseConfig> {
  private _ellipse: Konva.Ellipse;
  private _text: Konva.Text;

  /**
   * 初期化します.
   */
  constructor(config: ShapeEllipseConfig) {
    super(config);

    const radiusX = !config.radiusX
      ? config.minRadiusX
      : config.radiusX < config.minRadiusX
        ? config.minRadiusX
        : config.radiusX;
    this._config.radiusX = radiusX;

    const radiusY = !config.radiusY
      ? config.minRadiusY
      : config.radiusY < config.minRadiusY
        ? config.minRadiusY
        : config.radiusY;
    this._config.radiusY = radiusY;

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
    this.name('Ellipse');
    this.width(radiusX * 2);
    this.height(radiusY * 2);

    // 外枠
    this._ellipse = new Konva.Ellipse({
      perfectDrawEnabled: false,
      strokeScaleEnabled: false,
      shadowForStrokeEnabled: !config.shouldOptimize,
      hitStrokeWidth: 0,
      x: 0,
      y: 0,
      radiusX,
      radiusY,
      strokeWidth: config.strokeWidth,
      stroke: config.stroke,
      dash: config.strokeDash ? [5, 5] : [],
      fill: config.fill,
    });
    this._innerGroup.add(this._ellipse);

    // テキスト
    this._text = new Konva.Text({
      listening: false,
      perfectDrawEnabled: false,
      strokeScaleEnabled: false,
      shadowForStrokeEnabled: !config.shouldOptimize,
      hitStrokeWidth: 0,
      x: -radiusX,
      y: -radiusY,
      width: radiusX * 2,
      height: radiusY * 2,
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

    const radiusX = !this._config.radiusX
      ? this._config.minRadiusX
      : this._config.radiusX < this._config.minRadiusX
        ? this._config.minRadiusX
        : this._config.radiusX;

    const radiusY = !this._config.radiusY
      ? this._config.minRadiusY
      : this._config.radiusY < this._config.minRadiusY
        ? this._config.minRadiusY
        : this._config.radiusY;

    // シェイプ
    this.setAttrs({
      x,
      y,
      width: radiusX * 2,
      height: radiusY * 2,
      rotation,
      visible,
    });

    // 内部グループ
    if (this._isSelected) {
      this._innerGroup.setAttrs({
        x,
        y,
        rotation,
        visible,
        config: { ...this._config },
      });
    } else {
      this._innerGroup.setAttrs({ rotation: 0, config: { ...this._config } });
    }

    // 外枠
    this._ellipse.setAttrs({
      radiusX,
      radiusY,
      stroke: this._config.stroke,
      strokeWidth: this._config.strokeWidth ?? 0,
      dash: this._config.strokeDash ? [5, 5] : [],
      fill: this._config.fill,
    });

    // テキスト
    this._text.setAttrs({
      x: -radiusX,
      y: -radiusY,
      width: radiusX * 2,
      height: radiusY * 2,
      text: this._config.text,
      fontSize: this._config.fontSize,
      visible: !!this._config.text,
    });
  };

  /**
   * 追加時 X 軸方向へドラッグした際の半径を更新します.
   */
  public dragRadiusX(value: number) {
    if (value === 0) {
      return;
    }
    this._config = { ...this._config, radiusX: value };
    this.changeConfig();
  }

  /**
   * 追加時 Y 軸方向へドラッグした際の半径を更新します.
   */
  public dragRadiusY(value: number) {
    if (value === 0) {
      return;
    }
    this._config = { ...this._config, radiusY: value };
    this.changeConfig();
  }
}
