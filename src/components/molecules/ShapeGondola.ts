import Konva from 'konva';

import {
  Direction,
  Directions,
  GondolaPlacement,
  GondolaPlacements,
  RGBA,
} from '../../types';

import {
  ShapeLocationGroup,
  ShapeLocationGroupConfig,
} from './ShapeLocationGroup';

export interface ShapeGondolaConfig extends ShapeLocationGroupConfig {
  minWidth: number;
  minHeight: number;
  widthCells: number;
  heightCells: number;
  placement?: GondolaPlacement;
  direction?: Direction;
  remarks: string;
  visibleRemarksIcon: boolean;
  strokeRgb: RGBA;
  strokeTransparent: boolean;
  strokeWidth: number;
  strokeDash: boolean;
  fillRgb: RGBA;
  fillTransparent: boolean;
  isDoubleLine: boolean;
}

/**
 * ゴンドラ
 */
export class ShapeGondola extends ShapeLocationGroup<ShapeGondolaConfig> {
  private OFFSET_X = 2;
  private OFFSET_Y = 2;

  private _outerFrame: Konva.Rect;
  private _meshendLine1: Konva.Line;
  private _meshendLine2: Konva.Line;
  private _locationNum: Konva.Text;
  private _text: Konva.Text;
  private _cross1: Konva.Line;
  private _cross2: Konva.Line;
  private _budgeGroup: Konva.Group;

  /**
   * 初期化します.
   */
  constructor(config: ShapeGondolaConfig) {
    super(config);

    // デフォルト値設定
    if (!config.hasOwnProperty('remarks')) {
      config.remarks = '';
    }
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
    this.name('Gondola');

    // 外枠
    this._outerFrame = new Konva.Rect({
      name: 'outerFrame',
      perfectDrawEnabled: false,
      strokeScaleEnabled: false,
      shadowForStrokeEnabled: !config.shouldOptimize,
      hitStrokeWidth: 0,
      x: 0,
      y: 0,
      width: config.width,
      height: config.height,
      strokeWidth: config.isDoubleLine ? undefined : config.strokeWidth,
      stroke: config.isDoubleLine ? undefined : config.stroke,
      dash: config.strokeDash ? [5, 5] : [],
      fill: config.fill,
    });
    this._innerGroup.add(this._outerFrame);

    // 編目エンド二重線１
    this._meshendLine1 = new Konva.Line({
      name: 'meshendLine1',
      listening: false,
      perfectDrawEnabled: false,
      strokeScaleEnabled: false,
      shadowForStrokeEnabled: !config.shouldOptimize,
      hitStrokeWidth: 0,
      points: this.lineOne(
        config.width ?? 0,
        config.height ?? 0,
        config.direction,
      ),
      strokeWidth: config.strokeWidth,
      stroke: config.stroke,
      visible: config.isDoubleLine,
    });
    this._innerGroup.add(this._meshendLine1);

    // 編目エンド二重線２
    this._meshendLine2 = new Konva.Line({
      name: 'meshendLine2',
      listening: false,
      perfectDrawEnabled: false,
      strokeScaleEnabled: false,
      shadowForStrokeEnabled: !config.shouldOptimize,
      hitStrokeWidth: 0,
      points: this.lineTwo(
        config.width ?? 0,
        config.height ?? 0,
        config.direction,
      ),
      strokeWidth: config.strokeWidth,
      stroke: config.stroke,
      visible: config.isDoubleLine,
    });
    this._innerGroup.add(this._meshendLine2);

    const fontSize = this.scaleFontSize();

    // ロケーション番号
    this._locationNum = new Konva.Text({
      name: 'locationNum',
      listening: false,
      perfectDrawEnabled: false,
      strokeScaleEnabled: false,
      shadowForStrokeEnabled: !config.shouldOptimize,
      hitStrokeWidth: 0,
      scaleX: 1,
      scaleY: 1,
      x: this.OFFSET_X,
      y:
        this._config.placement === GondolaPlacements.VERTICAL
          ? config.height && config.height - this.OFFSET_Y
          : this.OFFSET_Y,
      width:
        this._config.placement === GondolaPlacements.VERTICAL
          ? config.height && config.height - this.OFFSET_X * 2
          : config.width && config.width - this.OFFSET_X * 2,
      height: fontSize,
      rotation:
        config.placement && config.placement === GondolaPlacements.VERTICAL
          ? -90
          : 0,
      fontSize,
      text: config.showFullLocationNum
        ? config.displayLocationNum
        : config.branchNum,
      visible: this.visibleLocationNum(),
    });
    this._innerGroup.add(this._locationNum);

    // テキスト
    this._text = new Konva.Text({
      name: 'text',
      listening: false,
      perfectDrawEnabled: false,
      strokeScaleEnabled: false,
      shadowForStrokeEnabled: !config.shouldOptimize,
      hitStrokeWidth: 0,
      scaleX: 1,
      scaleY: 1,
      x:
        this._config.placement === GondolaPlacements.VERTICAL
          ? fontSize + this.OFFSET_X * 2
          : this.OFFSET_X,
      y:
        this._config.placement === GondolaPlacements.VERTICAL
          ? config.height && config.height - this.OFFSET_Y
          : fontSize + this.OFFSET_Y * 2,
      width:
        this._config.placement === GondolaPlacements.VERTICAL
          ? config.height && config.height - this.OFFSET_X * 2
          : config.width && config.width - this.OFFSET_X * 2,
      height:
        this._config.placement === GondolaPlacements.VERTICAL
          ? config.width && config.width - fontSize - this.OFFSET_Y * 2
          : config.height && config.height - fontSize - this.OFFSET_Y * 2,
      rotation:
        config.placement && config.placement === GondolaPlacements.VERTICAL
          ? -90
          : 0,
      fontSize,
      text: config?.text,
      visible: this.visibleLocationText(),
    });
    this._innerGroup.add(this._text);

    // 欠番用バッテン線１
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

    // 欠番用バッテン線２
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

    // 備考バッジグループ
    this._budgeGroup = new Konva.Group({
      name: 'budgeGroup',
      listening: false,
      perfectDrawEnabled: false,
      strokeScaleEnabled: false,
      x:
        config.placement === GondolaPlacements.VERTICAL
          ? 5
          : config.width && config.width - 13,
      y: 5,
      width: 10,
      height: 10,
      visible: config.visibleRemarksIcon && !!config.remarks,
    });

    // 備考バッジ外枠円
    this._budgeGroup.add(
      new Konva.Circle({
        name: 'budgeCircle',
        listening: false,
        perfectDrawEnabled: false,
        strokeScaleEnabled: false,
        shadowForStrokeEnabled: !config.shouldOptimize,
        hitStrokeWidth: 0,
        x: 4,
        y: 4,
        radius: 7,
        stroke: '#3249db',
        strokeWidth: 1,
      }),
    );

    // 備考バッジ感嘆符線
    this._budgeGroup.add(
      new Konva.Rect({
        name: 'budgeExclamationRect',
        listening: false,
        perfectDrawEnabled: false,
        strokeScaleEnabled: false,
        shadowForStrokeEnabled: !config.shouldOptimize,
        hitStrokeWidth: 0,
        x: 3,
        y: 0,
        width: 2,
        height: 5,
        cornerRadius: 2,
        stroke: '#3249db',
        strokeWidth: 2,
        linecap: 'round',
        lineJoin: 'round',
        fill: '#3249db',
      }),
    );

    // 備考バッジ感嘆符ドット
    this._budgeGroup.add(
      new Konva.Circle({
        name: 'budgeExclamationCircle',
        listening: false,
        perfectDrawEnabled: false,
        strokeScaleEnabled: false,
        shadowForStrokeEnabled: !config.shouldOptimize,
        hitStrokeWidth: 0,
        x: 4,
        y: 8,
        radius: 1,
        stroke: '#3249db',
        strokeWidth: 1,
        fill: '#3249db',
      }),
    );
    this._innerGroup.add(this._budgeGroup);
  }

  /**
   * 設定を変更します.
   */
  override changeConfig = () => {
    const x = this._config.x ?? 0;
    const y = this._config.y ?? 0;
    const width = this._config.width ?? this._config.minWidth;
    const height = this._config.height ?? this._config.minHeight;
    const rotation = this._config.rotation ?? 0;
    const visible = this._config.visible ?? true;

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
    this._outerFrame.setAttrs({
      x: 0,
      y: 0,
      width,
      height,
      strokeWidth: this._config.isDoubleLine
        ? 0
        : this._config.strokeWidth ?? 1,
      stroke: this._config.stroke,
      dash: this._config.strokeDash ? [5, 5] : [],
      fill: this._config.fill,
      scaleX: 1,
      scaleY: 1,
    });

    const fontSize = this.scaleFontSize();

    // ロケーション番号
    this._locationNum.setAttrs({
      x: this.OFFSET_X,
      y:
        this._config.placement === GondolaPlacements.VERTICAL
          ? height - this.OFFSET_Y
          : this.OFFSET_Y,
      width:
        this._config.placement === GondolaPlacements.VERTICAL
          ? height - this.OFFSET_X * 2
          : width - this.OFFSET_X * 2,
      height: fontSize,
      rotation: this._config.placement === GondolaPlacements.VERTICAL ? -90 : 0,
      text: this._config.showFullLocationNum
        ? this._config.displayLocationNum
        : this._config.branchNum,
      fontSize,
      visible: this.visibleLocationNum(),
      scaleX: 1,
      scaleY: 1,
    });

    // テキスト
    this._text.setAttrs({
      x:
        this._config.placement === GondolaPlacements.VERTICAL
          ? fontSize + this.OFFSET_X * 2
          : this.OFFSET_X,
      y:
        this._config.placement === GondolaPlacements.VERTICAL
          ? height - this.OFFSET_Y
          : fontSize + this.OFFSET_Y * 2,
      width:
        this._config.placement === GondolaPlacements.VERTICAL
          ? height - this.OFFSET_X * 2
          : width - this.OFFSET_X * 2,
      height:
        this._config.placement === GondolaPlacements.VERTICAL
          ? width - fontSize - this.OFFSET_Y * 2
          : height - fontSize - this.OFFSET_Y * 2,
      rotation:
        this._config.placement &&
        this._config.placement === GondolaPlacements.VERTICAL
          ? -90
          : 0,
      text: this._config.text,
      fontSize,
      visible: this.visibleLocationText(),
      scaleX: 1,
      scaleY: 1,
    });

    // 編目エンドの場合のみ更新
    if (this._config.isDoubleLine) {
      // 二重線の一段目
      this._meshendLine1.setAttrs({
        points: this.lineOne(width ?? 0, height ?? 0, this._config.direction),
      });

      // 二重線の二段目
      this._meshendLine2.setAttrs({
        points: this.lineTwo(width ?? 0, height ?? 0, this._config.direction),
      });
    }

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

    // 備考バッジグループ
    this._budgeGroup.setAttrs({
      x:
        this._config.placement === GondolaPlacements.VERTICAL
          ? 5
          : width && width - 13,
      visible: this._config.visibleRemarksIcon && !!this._config.remarks,
    });
  };

  /**
   * 編目エンドの場合の二重線の一段目の線情報を取得します.
   */
  private lineOne = (width: number, height: number, direction?: Direction) => {
    if (direction === Directions.TOP) {
      return [0, 0, width, 0];
    } else if (direction === Directions.RIGHT) {
      return [width, 0, width, height];
    } else if (direction === Directions.BOTTOM) {
      return [0, height, width, height];
    } else if (direction === Directions.LEFT) {
      return [0, 0, 0, height];
    }
    return [0, 0, width, 0];
  };

  /**
   * 編目エンドの場合の二重線の二段目の線情報を取得します.
   */
  private lineTwo = (width: number, height: number, direction?: Direction) => {
    if (direction === Directions.TOP) {
      return [0, 2, width, 2];
    } else if (direction === Directions.RIGHT) {
      return [width - 2, 0, width - 2, height];
    } else if (direction === Directions.BOTTOM) {
      return [0, height - 2, width, height - 2];
    } else if (direction === Directions.LEFT) {
      return [2, 0, 2, height];
    }
    return [0, 2, width, 2];
  };
}
