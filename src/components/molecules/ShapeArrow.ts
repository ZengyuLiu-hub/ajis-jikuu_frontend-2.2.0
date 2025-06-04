import Konva from 'konva';

import { RGBA } from '../../types';

import { ShapeGroup, ShapeGroupConfig } from './ShapeGroup';

export interface ShapeArrowConfig extends ShapeGroupConfig {
  points: number[];
  pointerLength: number;
  pointerWidth: number;
  pointerAtBeginning: boolean;
  pointerAtEnding: boolean;
  stroke: string;
  strokeRgb: RGBA;
  strokeWidth: number;
}

/**
 * 矢印
 */
export class ShapeArrow extends ShapeGroup<ShapeArrowConfig> {
  private _rect: Konva.Rect;
  private _arrow: Konva.Arrow;

  /**
   * 初期化します.
   */
  constructor(config: ShapeArrowConfig) {
    super(config);

    // デフォルト値設定
    if (!config.hasOwnProperty('strokeRgb')) {
      config.strokeRgb = { r: 0, g: 0, b: 0, a: 1 };
    }
    if (!config.hasOwnProperty('stroke')) {
      config.stroke = `rgba(${config.strokeRgb.r}, ${config.strokeRgb.g}, ${config.strokeRgb.b}, ${config.strokeRgb.a})`;
    }
    if (!config.hasOwnProperty('strokeWidth')) {
      config.strokeWidth = 9;
    }
    if (!config.hasOwnProperty('pointerLength')) {
      config.pointerLength = 4;
    }
    if (!config.hasOwnProperty('pointerWidth')) {
      config.pointerWidth = 5;
    }

    // シェイプ
    this.name('Arrow');

    // 操作用枠
    this._rect = new Konva.Rect({
      perfectDrawEnabled: false,
      strokeScaleEnabled: false,
      shadowForStrokeEnabled: !config.shouldOptimize,
      hitStrokeWidth: 0,
    });
    this._innerGroup.add(this._rect);

    // 矢印
    this._arrow = new Konva.Arrow({
      listening: false,
      perfectDrawEnabled: false,
      shadowForStrokeEnabled: !config.shouldOptimize,
      hitStrokeWidth: 0,
      points: config.points,
      pointerLength: config.pointerLength,
      pointerWidth: config.pointerWidth,
      pointerAtBeginning: config.pointerAtBeginning,
      pointerAtEnding: config.pointerAtEnding,
      stroke: config.stroke,
      strokeWidth: config.strokeWidth,
    });
    this._innerGroup.add(this._arrow);

    // 操作用枠のサイズを初期化
    this.updateSubFrame();
  }

  /**
   * ポイントを取得します.
   */
  get points() {
    return this._config.points;
  }

  /**
   * ポイントを設定します.
   */
  set points(value: number[]) {
    this._config = { ...this._config, points: value };
    this.changeConfig();
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

    // 線幅、サイズ変更時
    if (
      this._arrow.strokeWidth() !== this._config.strokeWidth ||
      this._arrow.points() !== this._config.points
    ) {
      this.updateSubFrame();
    }

    // 矢印
    this._arrow.setAttrs({
      points: this._config.points,
      pointerLength: this._config.pointerLength,
      pointerWidth: this._config.pointerWidth,
      pointerAtBeginning: this._config.pointerAtBeginning,
      pointerAtEnding: this._config.pointerAtEnding,
      stroke: `rgba(${this._config.strokeRgb.r}, ${this._config.strokeRgb.g}, ${this._config.strokeRgb.b}, ${this._config.strokeRgb.a})`,
      strokeWidth: this._config.strokeWidth,
    });
  };

  /**
   * 操作用枠を更新します.
   */
  private updateSubFrame = () => {
    if (this._config.points.length < 4) {
      return;
    }

    const x1 = this._config.points[0];
    const y1 = this._config.points[1];
    const x2 = this._config.points[2];
    const y2 = this._config.points[3];

    const strokeWidth = this._config.strokeWidth ?? 1;
    const halfStrokeWidth = Math.ceil(strokeWidth / 2);

    const width = Math.abs(x2 - x1);
    if (width === 0) {
      this._rect.setAttrs({
        x: -halfStrokeWidth,
        width: strokeWidth,
      });
    } else {
      if (width < strokeWidth) {
        this._rect.x(x1 - halfStrokeWidth);
        this._rect.width(strokeWidth);
      } else {
        this._rect.setAttrs({
          x: x1 > x2 ? x2 : x1,
          width,
        });
      }
    }

    const height = Math.abs(y2 - y1);
    if (height === 0) {
      this._rect.setAttrs({
        y: -halfStrokeWidth,
        height: strokeWidth,
      });
    } else {
      if (height < strokeWidth) {
        this._rect.setAttrs({
          y: strokeWidth,
          height: y1 - halfStrokeWidth,
        });
      } else {
        this._rect.setAttrs({
          y: y1 > y2 ? y2 : y1,
          height,
        });
      }
    }
  };
}
