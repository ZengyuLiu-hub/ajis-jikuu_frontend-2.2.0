import Konva from 'konva';

import { ShapeGroup, ShapeGroupConfig } from './ShapeGroup';

export interface ShapeWcConfig extends ShapeGroupConfig {
  scaleX?: number;
  scaleY?: number;
}

/**
 * トイレ
 */
export class ShapeWc extends ShapeGroup<ShapeWcConfig> {
  private _rect: Konva.Rect;
  private _paths: Konva.Path[];

  /**
   * 初期化します.
   */
  constructor(config: ShapeWcConfig) {
    super(config);

    this._excludesPdfOutput = true;

    // シェイプ
    this.name('Wc');
    this.scaleX(config.scaleX ?? 1);
    this.scaleY(config.scaleY ?? 1);

    // 図形
    this._rect = new Konva.Rect({
      perfectDrawEnabled: false,
      strokeScaleEnabled: false,
      shadowForStrokeEnabled: !config.shouldOptimize,
      hitStrokeWidth: 0,
      x: 21,
      y: 1,
      width: 1,
      height: 38,
      stroke: 'rgba(0, 0, 0, 1)',
      fill: 'rgba(0, 0, 0, 1)',
    });
    this._innerGroup.add(this._rect);

    const partsPath = ({ data }: { data: string }) =>
      new Konva.Path({
        perfectDrawEnabled: false,
        strokeScaleEnabled: false,
        shadowForStrokeEnabled: !config.shouldOptimize,
        hitStrokeWidth: 0,
        x: 0,
        Y: 0,
        data,
        scale: { x: 0.08, y: 0.08 },
        strokeWidth: 1,
        stroke: 'rgba(0, 0, 0, 1)',
        fill: 'rgba(0, 0, 0, 1)',
      });

    this._paths = [
      partsPath({
        data: 'M106.846,97.722c21.867,0,39.598-17.73,39.598-39.606c0-21.867-17.73-39.589-39.598-39.589   c-21.885,0-39.598,17.722-39.598,39.589C67.248,79.992,84.961,97.722,106.846,97.722z',
      }),
      partsPath({
        data: 'M184.04,154.202c-8.026-27.097-26.002-45.054-46.244-45.054c-14.994,0-30.95,0-30.95,0s-15.956,0-30.949,0   c-20.243,0-38.238,17.958-46.264,45.054L0.478,257.652c-2.153,8.715,3.172,17.608,11.877,19.742   c8.724,2.153,17.448-2.946,19.6-11.66l29.062-103.13h8.573L19.02,341.994H66.7v133.068c0,10.169,8.252,18.411,18.411,18.411   c10.178,0,18.429-8.242,18.429-18.411V341.994h10.141v133.068c0,10.169,8.252,18.411,18.43,18.411   c10.159,0,18.411-8.242,18.411-18.411V341.994h44.13l-50.569-179.389h8.573l29.061,103.13c2.152,8.714,10.895,13.813,19.6,11.66   c8.724-2.134,14.03-11.028,11.877-19.742L184.04,154.202z',
      }),
      partsPath({
        data: 'M423.174,97.722c21.886,0,39.598-17.73,39.598-39.606c0-21.867-17.712-39.589-39.598-39.589   c-21.866,0-39.598,17.722-39.598,39.589C383.577,79.992,401.308,97.722,423.174,97.722z',
      }),
      partsPath({
        data: 'M471.93,108.902H367.884c-19.184,0-40.07,20.884-40.07,40.07v133.097c0,9.593,7.78,17.373,17.373,17.373   c9.592,0,17.372-7.78,17.372-17.373V172.642h8.006v297.067c0,12.604,10.215,22.82,22.829,22.82   c12.614,0,22.829-10.216,22.829-22.82V297.307h7.365v172.402c0,12.604,10.215,22.82,22.829,22.82   c12.595,0,22.83-10.216,22.83-22.82V172.642h8.006v109.426c0,9.593,7.78,17.373,17.372,17.373c9.593,0,17.373-7.78,17.373-17.373   V148.971C512,129.786,491.115,108.902,471.93,108.902z',
      }),
    ];
    this._innerGroup.add(...this._paths);
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
