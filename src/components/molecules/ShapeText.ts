import Konva from 'konva';

import { RGBA } from '../../types';

import { ShapeGroup, ShapeGroupConfig } from './ShapeGroup';

export interface ShapeTextConfig extends ShapeGroupConfig {
  defaultFontSize: number;
  text: string;
  fontSize: number;
  fill: string;
  fillRgb: RGBA;
  fillTransparent: boolean;
}

/**
 * テキスト
 */
export class ShapeText extends ShapeGroup<ShapeTextConfig> {
  private _text: Konva.Text;

  /**
   * 初期化します.
   */
  constructor(config: ShapeTextConfig) {
    super(config);

    // デフォルト値設定
    if (!config.hasOwnProperty('fontSize')) {
      config.fontSize = config.defaultFontSize;
    }
    if (!config.hasOwnProperty('fillTransparent')) {
      config.fillTransparent = false;
    }
    if (!config.hasOwnProperty('fillRgb')) {
      config.fillRgb = { r: 0, g: 0, b: 0, a: 1 };
    }
    if (!config.hasOwnProperty('fill')) {
      config.fill = `rgba(${config.fillRgb.r}, ${config.fillRgb.g}, ${config.fillRgb.b}, ${config.fillRgb.a})`;
    }

    // シェイプ
    this.name('Text');

    // テキスト
    this._text = new Konva.Text({
      perfectDrawEnabled: false,
      strokeScaleEnabled: false,
      shadowForStrokeEnabled: !config.shouldOptimize,
      hitStrokeWidth: 0,
      text: config.text,
      fontSize: config.fontSize,
      fill: config.fill,
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

    // シェイプ
    this.setAttrs({ x, y, rotation, visible });

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

    // テキスト
    this._text.setAttrs({
      text: this._config.text,
      fontSize: this._config.fontSize,
      fill:
        this._config.fill ??
        `rgba(${this._config.fillRgb.r}, ${this._config.fillRgb.g}, ${
          this._config.fillRgb.b
        }, ${this._config.fillTransparent ? 0 : this._config.fillRgb.a})`,
    });
  };
}
