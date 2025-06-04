import Konva from 'konva';

import { ShapeGroup, ShapeGroupConfig } from './ShapeGroup';

export interface ShapeCircleArrowConfig extends ShapeGroupConfig {
  scaleX?: number;
  scaleY?: number;
  flipHorizontal: boolean;
}

/**
 * 回転矢印
 */
export class ShapeCircleArrow extends ShapeGroup<ShapeCircleArrowConfig> {
  private _path: Konva.Path;

  /**
   * 初期化します.
   */
  constructor(config: ShapeCircleArrowConfig) {
    super(config);

    // デフォルト値を設定
    if (!config.hasOwnProperty('flipHorizontal')) {
      config.flipHorizontal = false;
    }

    // シェイプ
    this.name('CircleArrow');
    this.scaleX(config.scaleX ?? 1);
    this.scaleY(config.scaleY ?? 1);

    // 図形
    this._path = new Konva.Path({
      perfectDrawEnabled: false,
      strokeScaleEnabled: false,
      shadowForStrokeEnabled: !config.shouldOptimize,
      hitStrokeWidth: 0,
      x: 0,
      Y: 0,
      data: 'M477.694,262.331C450.839,157.565,355.775,80.137,242.645,80.137C108.637,80.137,0,188.766,0,322.782l117.984-8.92c-2.226-51.185,37.105-113.516,57.879-123.169c-28.193-3.702-60.104-2.114-60.104-2.114c21.476-8.346,45.081-12.968,69.863-12.968c90.637,0,165.581,61.775,177.733,142.025l-57.637,25.177l166.21,89.048l40.072-187L477.694,262.331z',
      scale: { x: (config.flipHorizontal ? -1 : 1) * 0.08, y: 0.08 },
      // 左右反転する軸を補正
      offset: { x: 254, y: 0 },
      strokeWidth: 1,
      stroke: 'rgba(0, 0, 0, 1)',
      fill: 'rgba(0, 0, 0, 1)',
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

      // 左右反転に変更された場合だけ図形に適用
      const hasChangedFlipHorizontal = () => {
        const flipHorizontal = this._config.flipHorizontal;
        const isFlipped = Math.sign(this._path.scaleX()) === -1;
        return (flipHorizontal && !isFlipped) || (!flipHorizontal && isFlipped);
      };
      if (hasChangedFlipHorizontal()) {
        this._path.setAttrs({ scaleX: -this._path.scaleX() });
      }
    } else {
      this._innerGroup.setAttrs({
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        config: { ...this._config },
      });
    }
  };
}
