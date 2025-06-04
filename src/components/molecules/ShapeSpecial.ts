import Konva from 'konva';
import { match } from 'ts-pattern';

import { Direction, Directions, RGBA } from '../../types';

import { ShapeGroup, ShapeGroupConfig } from './ShapeGroup';

export interface ShapeSpecialConfig extends ShapeGroupConfig {
  data: string;
  direction: Direction;
  width: number;
  depth: number;
  tableTopDepth: number;
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
 * 特殊型
 */
export class ShapeSpecial extends ShapeGroup<ShapeSpecialConfig> {
  private _path: Konva.Path;

  /**
   * 初期化します.
   */
  constructor(config: ShapeSpecialConfig) {
    super(config);

    // デフォルト値設定
    if (!config.hasOwnProperty('strokeTransparent')) {
      config.strokeTransparent = false;
    }
    if (!config.hasOwnProperty('strokeRgb')) {
      config.strokeRgb = { r: 0, g: 0, b: 0, a: 1 };
    }
    if (!config.stroke) {
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
    this.name('Special');

    // 図形
    this._path = new Konva.Path({
      perfectDrawEnabled: false,
      strokeScaleEnabled: false,
      shadowForStrokeEnabled: !config.shouldOptimize,
      hitStrokeWidth: 0,
      x: 0,
      Y: 0,
      data: config.data,
      stroke: config.stroke,
      strokeWidth: config.strokeWidth,
      dash: config.strokeDash ? [5, 5] : [],
      fill: config.fill,
    });
    this._innerGroup.add(this._path);
  }

  /**
   * 設定を変更します.
   */
  override changeConfig = () => {
    const x = this._config.x ?? 0;
    const y = this._config.y ?? 0;
    const rotation = this._config.rotation ?? 0;
    const visible = this._config.visible ?? true;

    const { width, tableTopDepth, depth } = this._config;

    // 図形変更
    const data = match(this._config.direction)
      .with(
        Directions.TOP,
        () =>
          `M 0 0 H ${width} V ${tableTopDepth} H ${tableTopDepth} V ${depth} H 0 L 0 0`
      )
      .with(
        Directions.RIGHT,
        () =>
          `M 0 0 H ${width} V ${depth} H ${
            width - tableTopDepth
          } V ${tableTopDepth} H 0 L 0 0`
      )
      .with(
        Directions.BOTTOM,
        () =>
          `M ${width} 0 V ${depth} H 0 V ${depth - tableTopDepth} H ${
            width - tableTopDepth
          } V 0 L ${width} 0`
      )
      .with(
        Directions.LEFT,
        () =>
          `M 0 0 V ${depth} H ${width} V ${
            depth - tableTopDepth
          } H ${tableTopDepth} V 0 L 0 0`
      )
      .otherwise(() => '');

    this._config = { ...this._config, data };

    // シェイプ
    this.setAttrs({ x, y, width, rotation, visible });

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

    // 図形
    this._path.setAttrs({
      data,
      stroke: this._config.stroke,
      strokeWidth: this._config.strokeWidth ?? 0,
      dash: this._config.strokeDash ? [5, 5] : [],
      fill: this._config.fill,
    });
  };
}
