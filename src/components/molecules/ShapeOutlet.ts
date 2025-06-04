import Konva from 'konva';

import { ShapeGroup, ShapeGroupConfig } from './ShapeGroup';

export interface ShapeOutletConfig extends ShapeGroupConfig {
  scaleX?: number;
  scaleY?: number;
}

/**
 * 電源
 */
export class ShapeOutlet extends ShapeGroup<ShapeOutletConfig> {
  private _path: Konva.Path;

  /**
   * 初期化します.
   */
  constructor(config: ShapeOutletConfig) {
    super(config);

    this._excludesPdfOutput = true;

    // シェイプ
    this.name('Outlet');
    this.scaleX(config.scaleX ?? 1);
    this.scaleY(config.scaleY ?? 1);

    // 図形
    this._path = new Konva.Path({
      perfectDrawEnabled: false,
      strokeScaleEnabled: false,
      shadowForStrokeEnabled: !config.shouldOptimize,
      hitStrokeWidth: 0,
      x: -4,
      Y: 44,
      data: 'm462-182 170-360H502v-240L332-422h130v240Zm18 102q-85 0-158-30.5T195-195q-54-54-84.5-127T80-480q0-84 30.5-157T195-764q54-54 127-85t158-31q84 0 157 31t127 85q54 54 85 127t31 157q0 85-31 158t-85 127q-54 54-127 84.5T480-80Z',
      scale: { x: 0.05, y: 0.05 },
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
