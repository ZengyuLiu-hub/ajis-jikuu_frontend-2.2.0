import Konva from 'konva';

import {
  ShapeLocationGroup,
  ShapeLocationGroupConfig,
} from './ShapeLocationGroup';

export interface ShapeRegisterConfig extends ShapeLocationGroupConfig {
  minWidth: number;
  minHeight: number;
}

/**
 * レジ
 */
export class ShapeRegister extends ShapeLocationGroup<ShapeRegisterConfig> {
  private OFFSET_X = 2;
  private OFFSET_Y = 2;
  private CASHIER_SYMBOL = 'R';

  private _rect: Konva.Rect;
  private _locationNum: Konva.Text;
  private _text: Konva.Text;
  private _cross1: Konva.Line;
  private _cross2: Konva.Line;

  /**
   * 初期化します.
   */
  constructor(config: ShapeRegisterConfig) {
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
    this.name('Register');
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

    const fontSize = this.scaleFontSize();

    // ロケーション番号
    this._locationNum = new Konva.Text({
      name: 'locationNum',
      listening: false,
      perfectDrawEnabled: false,
      strokeScaleEnabled: false,
      shadowForStrokeEnabled: !config.shouldOptimize,
      hitStrokeWidth: 0,
      x: this.OFFSET_X,
      y: this.OFFSET_Y,
      width: width - this.OFFSET_X * 2,
      height: fontSize,
      text: config.showFullLocationNum
        ? `${this.CASHIER_SYMBOL} ${config.displayLocationNum}`
        : `${this.CASHIER_SYMBOL} ${config.branchNum}`,
      fontSize,
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
      x: this.OFFSET_X,
      y: fontSize + this.OFFSET_Y * 2,
      width: width - this.OFFSET_X * 2,
      height: height - fontSize - this.OFFSET_Y * 2,
      text: config.text,
      fontSize,
      visible: this.visibleLocationText(),
    });
    this._innerGroup.add(this._text);

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
      strokeWidth: this._config.strokeWidth ?? 1,
      dash: this._config.strokeDash ? [5, 5] : [],
      fill:
        this._config.fill ??
        `rgba(${this._config.fillRgb.r}, ${this._config.fillRgb.g}, ${
          this._config.fillRgb.b
        }, ${this._config.fillTransparent ? 0 : this._config.fillRgb.a})`,
    });

    const fontSize = this.scaleFontSize();

    // ロケーション番号
    this._locationNum.setAttrs({
      width: width - this.OFFSET_X * 2,
      height: fontSize,
      text: this._config.showFullLocationNum
        ? `${this.CASHIER_SYMBOL} ${this._config.displayLocationNum}`
        : `${this.CASHIER_SYMBOL} ${this._config.branchNum}`,
      fontSize,
      visible: this.visibleLocationNum(),
    });

    // テキスト
    this._text.setAttrs({
      y: fontSize + this.OFFSET_Y * 2,
      width: width - this.OFFSET_X * 2,
      height: height - fontSize - this.OFFSET_Y * 2,
      text: this._config.text,
      fontSize,
      visible: this.visibleLocationText(),
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
