import Konva from 'konva';

import { ShapeGroup, ShapeGroupConfig } from './ShapeGroup';

export interface ShapeRestAreaConfig extends ShapeGroupConfig {
  scaleX?: number;
  scaleY?: number;
}

/**
 * 休憩室
 */
export class ShapeRestArea extends ShapeGroup<ShapeRestAreaConfig> {
  private _path: Konva.Path;

  /**
   * 初期化します.
   */
  constructor(config: ShapeRestAreaConfig) {
    super(config);

    this._excludesPdfOutput = true;

    // シェイプ
    this.name('RestArea');
    this.scaleX(config.scaleX ?? 1);
    this.scaleY(config.scaleY ?? 1);

    // 図形
    this._path = new Konva.Path({
      perfectDrawEnabled: false,
      strokeScaleEnabled: false,
      shadowForStrokeEnabled: !config.shouldOptimize,
      hitStrokeWidth: 0,
      x: -3,
      Y: 1,
      data: 'M13 20h-7c-2.174-3.004-4-6.284-4-12h15c0 5.667-1.88 9.089-4 12zm5.119-10c-.057.701-.141 1.367-.252 2h1.55c-.449 1.29-1.5 2.478-2.299 2.914-.358 1.038-.787 1.981-1.26 2.852 3.274-1.143 5.846-4.509 6.142-7.766h-3.881zm-7.745-3.001c4.737-4.27-.98-4.044.117-6.999-3.783 3.817 1.409 3.902-.117 6.999zm-2.78.001c3.154-2.825-.664-3.102.087-5.099-2.642 2.787.95 2.859-.087 5.099zm9.406 15h-15v2h15v-2z',
      scale: { x: 1.96, y: 1.65 },
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
