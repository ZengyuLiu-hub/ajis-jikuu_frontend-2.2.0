import Konva from 'konva';

import { RGBA } from '../../types';

import { ShapeGroup, ShapeGroupConfig } from './ShapeGroup';

export interface ShapeLineConfig extends ShapeGroupConfig {
  points: Array<number[]>;
  stroke: string;
  strokeRgb: RGBA;
  strokeWidth: number;
  strokeDash: boolean;
}

/**
 * 線
 */
export class ShapeLine extends ShapeGroup<ShapeLineConfig> {
  private BASE_SUB_FRAME_WIDTH = 10;
  private BASE_SUB_FRAME_HEIGHT = 10;

  private _rect: Konva.Rect;
  private _line: Konva.Line;

  /**
   * 初期化します.
   */
  constructor(config: ShapeLineConfig) {
    super(config);

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

    // シェイプ
    this.name('Line');
    this.on('transformEnd', this.updateSubFrame);

    // 操作用枠
    this._rect = new Konva.Rect({
      perfectDrawEnabled: false,
      strokeScaleEnabled: false,
      shadowForStrokeEnabled: !config.shouldOptimize,
      hitStrokeWidth: 0,
      x: this.calcSubFrameX(),
      y: this.calcSubFrameY(),
      width: this.calcSubFrameWidth(),
      height: this.calcSubFrameHeight(),
    });
    this._innerGroup.add(this._rect);

    // 線
    this._line = new Konva.Line({
      listening: false,
      perfectDrawEnabled: false,
      shadowForStrokeEnabled: !config.shouldOptimize,
      hitStrokeWidth: 0,
      stroke: config.stroke,
      strokeWidth: config.strokeWidth,
      dash: config.strokeDash ? [5, 5] : [],
      fill: config.fill,
      points: config.points.flat(),
    });
    this._innerGroup.add(this._line);
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
  set points(value: any[]) {
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
        scaleX: 1,
        scaleY: 1,
        config: { ...this._config },
      });
    } else {
      this._innerGroup.setAttrs({ rotation: 0, config: { ...this._config } });
    }

    // 線
    this._line.setAttrs({
      points: this._config.points.flat(),
      stroke: this._config.stroke,
      strokeWidth: this._config.strokeWidth,
      dash: this._config.strokeDash ? [5, 5] : [],
    });

    // 操作用枠
    this._rect.setAttrs({
      x: this.calcSubFrameX(),
      y: this.calcSubFrameY(),
      width: this.calcSubFrameWidth(),
      height: this.calcSubFrameHeight(),
    });
  };

  /**
   * 操作用枠を更新します.
   */
  private updateSubFrame = () => {
    if (this._config.points.length < 2) {
      return;
    }

    const x1 = this._config.points[0][0];
    const y1 = this._config.points[0][1];
    const x2 = this._config.points[1][0];
    const y2 = this._config.points[1][1];

    const width = Math.abs(x2 - x1);
    const height = Math.abs(y2 - y1);

    const lineStrokeWidth = this._config.strokeWidth ?? 1;

    const scaleX = this.scaleX();
    const scaleY = this.scaleY();

    const scaleWidth = lineStrokeWidth * scaleX;
    if (width < 10 && scaleWidth < 10) {
      this._rect.width(10);
      this._rect.x(x1 - 10 / 2);
    } else {
      this._rect.width(width);
      this._rect.x(x1 - lineStrokeWidth / 2);
    }

    const scaleHeight = lineStrokeWidth * scaleY;
    if (height < 10 && scaleHeight < 10) {
      this._rect.height(10 - scaleHeight);
      this._rect.y(y1 - (10 - scaleHeight) / 2);
    } else {
      this._rect.height(lineStrokeWidth);
      this._rect.y(y1 - lineStrokeWidth / 2);
    }
  };

  /**
   * 操作用枠の X 座標を計算します.
   */
  private calcSubFrameX = () => {
    if (this._config.points.length < 2) {
      return 0;
    }
    const x1 = this._config.points[0][0];
    const x2 = this._config.points[1][0];

    const width = Math.abs(x2) - Math.abs(x1);
    if (width === 0) {
      const lineStrokeWidth = this._config.strokeWidth ?? 1;
      if (this._config.strokeWidth > this.BASE_SUB_FRAME_WIDTH) {
        return x1 - lineStrokeWidth / 2;
      }
      if (width < this.BASE_SUB_FRAME_WIDTH) {
        return x1 - this.BASE_SUB_FRAME_WIDTH / 2;
      }
    }
    return 0;
  };

  /**
   * 操作用枠の Y 座標を計算します.
   */
  private calcSubFrameY = () => {
    if (this._config.points.length < 2) {
      return 0;
    }
    const y1 = this._config.points[0][1];
    const y2 = this._config.points[1][1];

    const height = Math.abs(y2) - Math.abs(y1);
    if (height === 0) {
      const lineStrokeWidth = this._config.strokeWidth ?? 1;
      if (lineStrokeWidth > this.BASE_SUB_FRAME_HEIGHT) {
        return y1 - lineStrokeWidth / 2;
      }
      if (height < this.BASE_SUB_FRAME_HEIGHT) {
        return y1 - this.BASE_SUB_FRAME_HEIGHT / 2;
      }
    }
    return 0;
  };

  /**
   * 操作用枠の幅を計算します.
   */
  private calcSubFrameWidth = () => {
    if (this._config.points.length < 2) {
      return 0;
    }
    const x1 = this._config.points[0][0];
    const x2 = this._config.points[1][0];

    const width = Math.abs(x2) - Math.abs(x1);
    if (width === 0 && this._config.strokeWidth > this.BASE_SUB_FRAME_WIDTH) {
      return this._config.strokeWidth;
    }
    if (width < this.BASE_SUB_FRAME_WIDTH) {
      return this.BASE_SUB_FRAME_WIDTH;
    }
    return x2;
  };

  /**
   * 操作用枠の高さを計算します.
   */
  private calcSubFrameHeight = () => {
    if (this._config.points.length < 2) {
      return 0;
    }
    const y1 = this._config.points[0][1];
    const y2 = this._config.points[1][1];

    const height = Math.abs(y2 - y1);
    if (height === 0 && this._config.strokeWidth > this.BASE_SUB_FRAME_HEIGHT) {
      return this._config.strokeWidth;
    }
    if (height < this.BASE_SUB_FRAME_HEIGHT) {
      return this.BASE_SUB_FRAME_HEIGHT;
    }
    return y2;
  };
}
