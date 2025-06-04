import Konva from 'konva';

import * as editorConstants from '../../constants/editor';

import { EditShapeData, RGBA, ShapeData, ShapeOperations } from '../../types';

import { EditorUtil } from '../../utils/EditorUtil';

import { ShapeGroup, ShapeGroupConfig } from './ShapeGroup';

export interface ShapeAreaConfig extends ShapeGroupConfig {
  areaId: string;
  text: string;
  fontSize: number;
  points: any[];
  closed: boolean;
  isLineDrawing: boolean;
  latticeWidth: number;
  latticeHeight: number;
  stroke: string;
  strokeRgb: RGBA;
  strokeTransparent: boolean;
  strokeWidth: number;
  strokeDash: boolean;
  fill: string;
  fillRgb: RGBA;
  fillTransparent: boolean;
  onChangeAnchorPoint(data: EditShapeData): void;
}

/**
 * エリア
 */
export class ShapeArea extends ShapeGroup<ShapeAreaConfig> {
  private ANCHOR_POINT_STROKE_WIDTH = 10;
  private ANCHOR_POINT_HIT_STROKE_WIDTH = 16;

  private _isLineMouseOverStartPoint: boolean = false;
  private _past: ShapeData;

  private _line: Konva.Line;
  private _text: Konva.Text;

  /**
   * 初期化します.
   */
  constructor(config: ShapeAreaConfig) {
    super(config);

    this._isLineMouseOverStartPoint = false;

    // デフォルト値設定
    if (!config.hasOwnProperty(editorConstants.SHAPE_PROP_NAME_FONT_SIZE)) {
      config.fontSize = editorConstants.FONT_SIZE_BASE_AREA;
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
    this.name('Area');

    // 線
    this._line = new Konva.Line({
      listening: false,
      perfectDrawEnabled: false,
      strokeScaleEnabled: false,
      shadowForStrokeEnabled: !config.shouldOptimize,
      hitStrokeWidth: 0,
      points: config.points.flat(),
      closed: config.closed,
      stroke: config.stroke,
      strokeWidth: config.strokeWidth,
      dash: config.strokeDash ? [5, 5] : [],
      fill: config.fill,
    });
    this._innerGroup.add(this._line);

    // テキスト
    this._text = new Konva.Text({
      listening: false,
      perfectDrawEnabled: false,
      strokeScaleEnabled: false,
      shadowForStrokeEnabled: !config.shouldOptimize,
      hitStrokeWidth: 0,
      x: 0,
      y: 0,
      fontSize: config.fontSize,
      text: config?.text,
      visible: config.closed,
    });
    this._innerGroup.add(this._text);

    // 移動ポイント変更
    if (config.closed) {
      // テキストの幅、高さを設定
      this._text.setAttrs({
        width: this._line.width() - 3,
        height: this._line.height() - 3,
      });

      this.addAnchorPoint(config.points.slice(0, config.points.length - 1));
    } else {
      this.addAnchorPoint(config.points);
    }

    // テキスト位置調整
    this.positioningText();

    // 変更前情報
    this._past = { id: this.id(), config: { ...config } };
  }

  /**
   * ライン追加中の有無を取得します.
   */
  get isLineDrawing() {
    return this._config.isLineDrawing;
  }

  /**
   * ライン追加中の有無を設定します.
   */
  set isLineDrawing(value: boolean) {
    this._config = { ...this._config, isLineDrawing: value };
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
   * クローズ有無を取得します.
   */
  get closed() {
    return this._config.closed;
  }

  /**
   * クローズ有無を設定します.
   */
  set closed(value: boolean) {
    this._config = { ...this._config, closed: value };
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

    // 線
    this._line.setAttrs({
      points: this._config.points.flat(),
      closed: this._config.closed,
      stroke: `rgba(${this._config.strokeRgb.r}, ${this._config.strokeRgb.g}, ${
        this._config.strokeRgb.b
      }, ${this._config.strokeTransparent ? 0 : this._config.strokeRgb.a})`,
      strokeWidth: this._config.strokeWidth ?? 0,
      dash: this._config.strokeDash ? [5, 5] : [],
      fill:
        this._config.fill ??
        `rgba(${this._config.fillRgb.r}, ${this._config.fillRgb.g}, ${
          this._config.fillRgb.b
        }, ${this._config.fillTransparent ? 0 : this._config.fillRgb.a})`,
    });

    // テキスト
    this._text.setAttrs({
      text: this._config?.text,
      fontSize: this._config.fontSize,
      visible: this._config.closed,
    });

    if (this._config.closed) {
      // テキストの幅、高さを設定
      this._text.setAttrs({
        width: this._line.width() - 3,
        height: this._line.height() - 3,
      });

      // テキスト位置調整
      this.positioningText();

      this.updateAnchorPoint(this._config.points);
    } else {
      // 移動ポイント変更
      this.addAnchorPoint(this._config.points);
    }
  };

  /**
   * テキストの表示位置を調整します.
   */
  private positioningText = () => {
    const leftTop = this.leftTopMost();
    this._text.setAttrs({
      x: leftTop.x + 3,
      y: leftTop.y + 3,
    });
  };

  /**
   * 移動ポイントを追加します.
   */
  private addAnchorPoint = (points: any[]) => {
    if (this.readOnly) {
      return;
    }

    const rects =
      this.children?.filter((node) => node instanceof Konva.Rect) ?? [];

    const addPoints: any[] =
      rects.length > 0 ? [...points.slice(rects.length)] : [...points];

    addPoints.forEach((point, index) => {
      const x = point[0] - this.ANCHOR_POINT_STROKE_WIDTH / 2;
      const y = point[1] - this.ANCHOR_POINT_STROKE_WIDTH / 2;

      const rect = new Konva.Rect({
        key: index,
        name: `AnchorPoint${index}`,
        perfectDrawEnabled: false,
        strokeScaleEnabled: false,
        shadowForStrokeEnabled: !this._config.shouldOptimize,
        hitStrokeWidth: 0,
        draggable: true,
        x: x,
        y: y,
        width: this.ANCHOR_POINT_STROKE_WIDTH,
        height: this.ANCHOR_POINT_STROKE_WIDTH,
        fill: 'rgba(255, 255, 255, 1)',
        stroke: this._config.stroke,
        strokeWidth: 1,
        cornerRadius: 4,
        visible: true,
      });

      if (rects.length === 0 && index === 0) {
        rect.fill('rgba(0, 0, 0, 1)');
        rect.on('mouseover', this.handleMouseOverStartPoint);
        rect.on('mouseout', this.handleMouseOutStartPoint);
      }

      rect.on('mouseenter', this.handleAnchorPointMouseEnter);
      rect.on('mouseleave', this.handleAnchorPointMouseLeave);
      rect.on('dragstart', this.handleAnchorPointDragStart);
      rect.on('dragmove', this.handleAnchorPointDragMove);
      rect.on('dragend', this.handleAnchorPointDragEnd);

      this._innerGroup.add(rect);
    });
  };

  /**
   * 移動ポイントの表示有無を変更します.
   */
  private visibleAnchorPoint = (visible: boolean) => {
    if (!this._config.closed) {
      return;
    }

    this._innerGroup.children
      ?.filter((node) => node instanceof Konva.Rect)
      .forEach((node) => node.visible(visible));
  };

  /**
   * 移動ポイントの位置を更新します.
   */
  private updateAnchorPoint = (points: any[]) => {
    const anchorPoints = this.children?.filter((d) => d instanceof Konva.Rect);

    points.forEach((point, index) => {
      const anchor = anchorPoints?.find(
        (d) => d.name() === `AnchorPoint${index}`,
      );
      if (!anchor) {
        return;
      }

      const x = point[0] - this.ANCHOR_POINT_STROKE_WIDTH / 2;
      const y = point[1] - this.ANCHOR_POINT_STROKE_WIDTH / 2;

      anchor.setAttrs({ x, y });
    });
  };

  /**
   * 始点移動ポイントのマウスオーバーイベント.
   */
  private handleMouseOverStartPoint = (e: any) => {
    if (!this._config.isLineDrawing || this._config.points.length < 3) {
      return;
    }

    const node = e.target;
    const point = this._config.points[0];

    const pointRadius = this.ANCHOR_POINT_HIT_STROKE_WIDTH / 2;

    node.x(point[0] - pointRadius);
    node.y(point[1] - pointRadius);

    node.scale({ x: 2, y: 2 });

    this._isLineMouseOverStartPoint = true;
  };

  /**
   * 始点移動ポイントのマウスアウトイベント.
   */
  private handleMouseOutStartPoint = (e: any) => {
    const node = e.target;
    const point = this._config.points[0];

    const pointRadius = this.ANCHOR_POINT_STROKE_WIDTH / 2;

    node.x(point[0] - pointRadius);
    node.y(point[1] - pointRadius);

    node.scale({ x: 1, y: 1 });

    this._isLineMouseOverStartPoint = false;
  };

  /**
   * 移動ポイント上にマウスカーソルが入った際のイベント.
   */
  private handleAnchorPointMouseEnter = (
    e: Konva.KonvaEventObject<MouseEvent>,
  ) => {
    if (this._config.closed) {
      const stage: any = e.currentTarget.getStage();
      stage.getContainer().style.cursor = 'move';
    }
  };

  /**
   * 移動ポイントからマウスカーソルが出ていった際のイベント.
   */
  private handleAnchorPointMouseLeave = (
    e: Konva.KonvaEventObject<MouseEvent>,
  ) => {
    if (this._config.closed) {
      const stage: any = e.currentTarget.getStage();
      stage.getContainer().style.cursor = 'default';
    }
  };

  /**
   * 移動ポイントのドラッグ開始イベント.
   */
  private handleAnchorPointDragStart = (
    e: Konva.KonvaEventObject<DragEvent>,
  ) => {
    if (this._config.closed) {
      const stage: any = e.currentTarget.getStage();
      stage.getContainer().style.cursor = 'default';
    }

    this._past = {
      id: this.id(),
      config: { ...this._config },
    };
  };

  /**
   * 移動ポイントのドラッグ中イベント.
   */
  private handleAnchorPointDragMove = (
    e: Konva.KonvaEventObject<DragEvent>,
  ) => {
    e.cancelBubble = true;

    const node = e.target;
    const index = node.index - 2;

    const pointRadius = this.ANCHOR_POINT_STROKE_WIDTH / 2;

    const x = node.x() + pointRadius;
    const y = node.y() + pointRadius;

    const newPoints =
      index === 0
        ? [[x, y], ...this._config.points.slice(index + 1, -1), [x, y]]
        : [
            ...this._config.points.slice(0, index),
            [x, y],
            ...this._config.points.slice(index + 1),
          ];
    this._line.setAttr('points', newPoints.flat());
  };

  /**
   * 移動ポイントのドラッグ終了イベント.
   */
  private handleAnchorPointDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    e.cancelBubble = true;

    const node = e.target as Konva.Rect;
    const index = node.index - 2;

    const pointRadius = this.ANCHOR_POINT_STROKE_WIDTH / 2;

    const x = EditorUtil.calcGuideGridSize(
      node.x() + pointRadius,
      this._config.latticeWidth,
    );
    const y = EditorUtil.calcGuideGridSize(
      node.y() + pointRadius,
      this._config.latticeHeight,
    );

    node.x(x - pointRadius);
    node.y(y - pointRadius);

    const newPoints =
      index === 0
        ? [[x, y], ...this._config.points.slice(index + 1, -1), [x, y]]
        : [
            ...this._config.points.slice(0, index),
            [x, y],
            ...this._config.points.slice(index + 1),
          ];
    this.points = newPoints;

    // 移動ポイントの変更結果を通知
    this._config.onChangeAnchorPoint({
      operation: ShapeOperations.CHANGE,
      past: [this._past],
      present: [
        { id: this.id(), config: { ...this._config, points: newPoints } },
      ],
    });

    if (this._config.closed) {
      const leftTop = this.leftTopMost();
      this._text.x(leftTop.x + 3);
      this._text.y(leftTop.y + 3);

      const stage: any = e.currentTarget.getStage();
      stage.getContainer().style.cursor = 'move';
    }
  };

  /**
   * シェイプの左上の座標を取得します.
   */
  private leftTopMost = () => {
    if (this._config.points.length === 1) {
      return { x: this._config.points[0][0], y: this._config.points[0][1] };
    }

    const x = this._config.points.reduce((a, b) =>
      Array.isArray(a) && a[0] < b[0] ? a[0] : a < b[0] ? a : b[0],
    );
    const y = this._config.points.reduce((a, b) =>
      Array.isArray(a) && a[1] < b[1] ? a[1] : a < b[1] ? a : b[1],
    );
    return { x, y };
  };

  /**
   * 選択の状態を変更します.
   */
  override changeSelectState(selected: boolean) {
    super.changeSelectState(selected);
    this.visibleAnchorPoint(!selected);
  }

  /**
   * 始点ポイントをマウスオーバーした場合は true を、それ以外の場合は false を返します.
   */
  public isLineMouseOverStartPoint() {
    return this._isLineMouseOverStartPoint;
  }

  /**
   * 移動ポイントの位置を初期化します.
   */
  public resetAnchorPoint = () => {
    const rects =
      this._innerGroup.children?.filter((node) =>
        node.name().startsWith('AnchorPoint'),
      ) ?? [];
    if (rects.length === 0) {
      return;
    }

    this._config.points.forEach((point, index) => {
      const rect = rects[index];
      if (!rect) {
        return;
      }
      const x = point[0] - this.ANCHOR_POINT_STROKE_WIDTH / 2;
      const y = point[1] - this.ANCHOR_POINT_STROKE_WIDTH / 2;

      rect.setAttrs({ x, y });
    });
  };
}
