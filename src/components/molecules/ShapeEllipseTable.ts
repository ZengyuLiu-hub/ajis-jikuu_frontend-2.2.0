import Konva from 'konva';

import { RGBA } from '../../types';

import {
  ShapeLocationGroup,
  ShapeLocationGroupConfig,
} from './ShapeLocationGroup';

export interface ShapeEllipseTableConfig extends ShapeLocationGroupConfig {
  radiusX: number;
  radiusY: number;
  minRadiusX: number;
  minRadiusY: number;
  strokeRgb: RGBA;
  strokeTransparent: boolean;
  strokeDash: boolean;
  fillRgb: RGBA;
  fillTransparent: boolean;
  visibleRemarksIcon: boolean;
}

/**
 * 丸テーブル
 */
export class ShapeEllipseTable extends ShapeLocationGroup<ShapeEllipseTableConfig> {
  private _ellipse: Konva.Ellipse;
  private _locationNum: Konva.Text;
  private _text: Konva.Text;
  private _cross1: Konva.Line;
  private _cross2: Konva.Line;

  /**
   * 初期化します.
   */
  constructor(config: ShapeEllipseTableConfig) {
    super(config);

    const radiusX = !config.radiusX
      ? config.minRadiusX
      : config.radiusX < config.minRadiusX
        ? config.minRadiusX
        : config.radiusX;

    const radiusY = !config.radiusY
      ? config.minRadiusY
      : config.radiusY < config.minRadiusY
        ? config.minRadiusY
        : config.radiusY;

    const width = radiusX * 2;
    const height = radiusY * 2;

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
    this.name('EllipseTable');
    this.width(width);
    this.height(height);

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

    const fontSize = this.scaleFontSize();
    const visibleText = !!this._config.text && this.visibleLocationText();

    // ロケーション番号
    this._locationNum = new Konva.Text({
      listening: false,
      perfectDrawEnabled: false,
      strokeScaleEnabled: false,
      shadowForStrokeEnabled: !config.shouldOptimize,
      hitStrokeWidth: 0,
      scaleX: 1,
      scaleY: 1,
      x: -radiusX,
      y: -radiusY,
      width,
      height: visibleText ? radiusY : height,
      rotation: 0,
      fontSize,
      text: config.showFullLocationNum
        ? config.displayLocationNum
        : config.branchNum,
      align: 'center',
      verticalAlign: visibleText ? 'bottom' : 'middle',
      visible: this.visibleLocationNum(),
    });
    this._innerGroup.add(this._locationNum);

    // テキスト
    this._text = new Konva.Text({
      listening: false,
      perfectDrawEnabled: false,
      strokeScaleEnabled: false,
      shadowForStrokeEnabled: !config.shouldOptimize,
      hitStrokeWidth: 0,
      scaleX: 1,
      scaleY: 1,
      y: 0,
      x: -radiusX,
      width,
      height: radiusY,
      rotation: 0,
      fontSize,
      text: config.text,
      align: 'center',
      verticalAlign: 'top',
      visible: visibleText,
    });
    this._innerGroup.add(this._text);

    const cross1Start = getEllipsePoint(radiusX, radiusY, Math.PI / 4);
    const cross1End = getEllipsePoint(radiusX, radiusY, (5 * Math.PI) / 4);
    const cross2Start = getEllipsePoint(radiusX, radiusY, (3 * Math.PI) / 4);
    const cross2End = getEllipsePoint(radiusX, radiusY, (7 * Math.PI) / 4);

    // 欠番用バッテン線１（左上から右下）
    this._cross1 = new Konva.Line({
      name: 'cross1',
      listening: false,
      perfectDrawEnabled: false,
      strokeScaleEnabled: false,
      shadowForStrokeEnabled: !config.shouldOptimize,
      hitStrokeWidth: 0,
      points: [
        cross1Start.x,
        cross1Start.y,
        width ? cross1End.x : 0,
        height ? cross1End.y : 0,
      ],
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
      points: [
        cross2Start.x,
        cross2Start.y,
        width ? cross2End.x : 0,
        height ? cross2End.y : 0,
      ],
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

    const radiusX = !this._config.radiusX
      ? this._config.minRadiusX
      : this._config.radiusX < this._config.minRadiusX
        ? this._config.minRadiusX
        : this._config.radiusX;
    this._config.radiusX = radiusX;

    const radiusY = !this._config.radiusY
      ? this._config.minRadiusY
      : this._config.radiusY < this._config.minRadiusY
        ? this._config.minRadiusY
        : this._config.radiusY;
    this._config.radiusY = radiusY;

    const width = radiusX * 2;
    const height = radiusY * 2;

    // シェイプ
    this.setAttrs({
      x,
      y,
      width,
      height,
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
      strokeWidth: this._config.strokeWidth ?? 0,
      stroke: this._config.stroke,
      dash: this._config.strokeDash ? [5, 5] : [],
      fill: this._config.fill,
    });

    const fontSize = this.scaleFontSize();
    const visibleText = !!this._config.text && this.visibleLocationText();

    // ロケーション番号
    this._locationNum.setAttrs({
      x: -radiusX,
      y: -radiusY,
      width,
      height: visibleText ? radiusY : height,
      text: this._config.showFullLocationNum
        ? this._config.displayLocationNum
        : this._config.branchNum,
      fontSize,
      verticalAlign: visibleText ? 'bottom' : 'middle',
      visible: this.visibleLocationNum(),
    });

    // テキスト
    this._text.setAttrs({
      y: 0,
      x: -radiusX,
      width,
      height: radiusY,
      fontSize,
      text: this._config.text,
      visible: visibleText,
    });

    const cross1Start = getEllipsePoint(radiusX, radiusY, Math.PI / 4);
    const cross1End = getEllipsePoint(radiusX, radiusY, (5 * Math.PI) / 4);
    const cross2Start = getEllipsePoint(radiusX, radiusY, (3 * Math.PI) / 4);
    const cross2End = getEllipsePoint(radiusX, radiusY, (7 * Math.PI) / 4);

    // 欠番用バッテン線１（左上から右下）
    this._cross1.setAttrs({
      points: [
        cross1Start.x,
        cross1Start.y,
        width ? cross1End.x : 0,
        height ? cross1End.y : 0,
      ],
      visible: this._config.missingNumber,
    });

    // 欠番用バッテン線２（右上から左下）
    this._cross2.setAttrs({
      points: [
        cross2Start.x,
        cross2Start.y,
        width ? cross2End.x : 0,
        height ? cross2End.y : 0,
      ],
      visible: this._config.missingNumber,
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

/**
 * 角度に応じたポイントの座標を取得します.
 *
 * @param radiusX X軸半径
 * @param radiusY Y軸半径
 * @param angle 角度
 * @returns ポイント
 */
function getEllipsePoint(radiusX: number, radiusY: number, angle: number) {
  return {
    x: radiusX * Math.cos(angle),
    y: radiusY * Math.sin(angle),
  };
}
