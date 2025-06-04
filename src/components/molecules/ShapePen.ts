import Konva from 'konva';
import { LineCap } from 'konva/lib/Shape';

import { RGBA } from '../../types';

import { ShapeGroup, ShapeGroupConfig } from './ShapeGroup';

export interface ShapePenConfig extends ShapeGroupConfig {
  points: Array<number[]>;
  tension: number;
  lineCap: LineCap;
  stroke: string;
  strokeRgb: RGBA;
  strokeWidth: number;
  scaleX?: number;
  scaleY?: number;
}

/**
 * ペン
 */
export class ShapePen extends ShapeGroup<ShapePenConfig> {
  private _rect: Konva.Rect;
  private _line: Konva.Line;

  /**
   * 初期化します.
   */
  constructor(config: ShapePenConfig) {
    super(config);

    // デフォルト値設定
    if (!config.hasOwnProperty('strokeTransparent')) {
      config.strokeTransparent = false;
    }
    if (!config.hasOwnProperty('strokeRgb')) {
      config.strokeRgb = { r: 223, g: 75, b: 38, a: 1 };
    }
    if (!config.hasOwnProperty('stroke')) {
      config.stroke = `rgba(${config.strokeRgb.r}, ${config.strokeRgb.g}, ${config.strokeRgb.b}, ${config.strokeRgb.a})`;
    }
    if (!config.hasOwnProperty('strokeDash')) {
      config.strokeDash = false;
    }
    if (!config.hasOwnProperty('strokeWidth')) {
      config.strokeWidth = 5;
    }

    // シェイプ
    this.name('Pen');
    this.scaleX(config.scaleX ?? 1);
    this.scaleY(config.scaleY ?? 1);

    // 線
    this._line = new Konva.Line({
      listening: false,
      perfectDrawEnabled: false,
      shadowForStrokeEnabled: !config.shouldOptimize,
      hitStrokeWidth: 0,
      points: config.points.flat(),
      stroke: config.stroke,
      strokeWidth: config.strokeWidth ?? 5,
      tension: config.tension ?? 0.5,
      lineCap: config.lineCap ?? 'round',
      globalCompositeOperation: 'source-over',
    });
    this._innerGroup.add(this._line);

    // 直線である場合、操作枠を設定する
    this._rect = new Konva.Rect({
      perfectDrawEnabled: false,
      strokeScaleEnabled: false,
      shadowForStrokeEnabled: !this._config.shouldOptimize,
      hitStrokeWidth: 0,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      ...this.getOperationFrameConfig(config.points),
    });
    this._innerGroup.add(this._rect);
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
  set points(value: Array<number[]>) {
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
    const scaleX = this._config.scaleX ?? 1;
    const scaleY = this._config.scaleY ?? 1;

    // シェイプ
    this.setAttrs({ x, y, rotation, visible, scaleX, scaleY });

    // 内部グループ
    if (this._isSelected) {
      this._innerGroup.setAttrs({
        x,
        y,
        rotation,
        visible,
        scaleX,
        scaleY,
        config: { ...this._config },
      });
    } else {
      this._innerGroup.setAttrs({
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        config: { ...this._config },
      });
    }

    // 線
    this._line.setAttrs({
      points: this._config.points.flat(),
      strokeWidth: this._config.strokeWidth,
      stroke: this._config.stroke,
    });
  };

  /**
   * 操作枠の設定を取得します.
   */
  private getOperationFrameConfig = (points: number[][]) => {
    if (points.length <= 1) {
      return {};
    }

    // 最初の変更ポイント
    const index = points.findIndex((p) => p[0] !== 0 || p[1] !== 0);
    if (index < 1) {
      return {};
    }

    // X 軸と Y 軸の両方が 0 でなかった場合
    const point = points[index];
    if (point[0] !== 0 && point[1] !== 0) {
      return {};
    }

    // 水平方向ポイント
    const horizontalLine = points.map((d) => d[0]);

    // 垂直方向ポイント
    const verticalLine = points.map((d) => d[1]);

    const config: any = {};
    if (Math.abs(point[0]) === 0) {
      // 垂直方向
      if (!horizontalLine.every((d) => d === 0)) {
        return {};
      }
      config.x = -5;
      config.width = 10;
      config.height = verticalLine.slice(-1)[0];
    } else {
      // 水平方向ポイント
      if (!verticalLine.every((d) => d === 0)) {
        return {};
      }
      config.y = -5;
      config.width = horizontalLine.slice(-1)[0];
      config.height = 10;
    }
    return config;
  };
}
