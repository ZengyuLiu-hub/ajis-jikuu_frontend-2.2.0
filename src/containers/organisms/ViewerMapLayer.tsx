import Konva from 'konva';
import { useEffect } from 'react';

import * as editorConstants from '../../constants/editor';

import { useAppDispatch } from '../../app/hooks';
import { ShapeData, ShapeOperations, SideMenuTypes } from '../../types';

import { viewerNodeModule } from '../../modules';
import {
  useDefaultFontSize,
  useLineDrawing,
  useShouldOptimize,
  useViewLatticeHeight,
  useViewLatticeWidth,
  useViewMapLayerData,
  useViewStageScale,
  useViewVisibleRemarksIcon,
} from '../../selectors';

import {
  PerformanceConfig,
  ShapeArrow,
  ShapeCircle,
  ShapeCircleArrow,
  ShapeEllipse,
  ShapeEllipseTable,
  ShapeFreeText,
  ShapeGondola,
  ShapeLine,
  ShapeOutlet,
  ShapePen,
  ShapePolygon,
  ShapeRect,
  ShapeRectTable,
  ShapeRegister,
  ShapeRestArea,
  ShapeSpecial,
  ShapeText,
  ShapeWc,
} from '../../components/molecules';
import { ViewerMapLayer as Component } from '../../components/organisms';

interface Props {
  layerRef: React.RefObject<Konva.Layer>;
}

/**
 * マップビューア：マップレイヤー
 */
export const ViewerMapLayer = (props: Props) => {
  const { layerRef } = props;

  const dispatch = useAppDispatch();

  const mapLayerData = useViewMapLayerData();

  const shouldOptimize = useShouldOptimize();
  const stageScale = useViewStageScale();
  const latticeWidth = useViewLatticeWidth();
  const latticeHeight = useViewLatticeHeight();
  const isLineDrawing = useLineDrawing();

  const defaultFontSize = useDefaultFontSize();

  const visibleRemarksIcon = useViewVisibleRemarksIcon();

  const shapeCache = new Map<string, any>();

  // シェイプ追加.
  const addChild = (
    data: ShapeData[],
    performanceConfig: PerformanceConfig,
  ) => {
    const additionalConfig = { readOnly: true };

    data?.forEach((d) => {
      // エリアは除外
      if (d.config.shape === SideMenuTypes.AREA) {
        return;
      }

      if (d.config.shape === SideMenuTypes.PEN) {
        // ペン
        layerRef.current?.add(
          new ShapePen({
            ...d.config,
            ...performanceConfig,
            ...additionalConfig,
            id: d.config.uuid,
            perfectDrawEnabled: false,
            strokeScaleEnabled: false,
            shadowForStrokeEnabled: !performanceConfig.shouldOptimize,
          }),
        );
      } else if (d.config.shape === SideMenuTypes.LINE) {
        // 線
        layerRef.current?.add(
          new ShapeLine({
            ...d.config,
            ...performanceConfig,
            ...additionalConfig,
            id: d.config.uuid,
            perfectDrawEnabled: false,
            strokeScaleEnabled: false,
            shadowForStrokeEnabled: !performanceConfig.shouldOptimize,
          }),
        );
      } else if (
        d.config.shape === SideMenuTypes.ARROW1 ||
        d.config.shape === SideMenuTypes.ARROW2
      ) {
        // 矢印
        layerRef.current?.add(
          new ShapeArrow({
            ...d.config,
            ...performanceConfig,
            ...additionalConfig,
            id: d.config.uuid,
            perfectDrawEnabled: false,
            strokeScaleEnabled: false,
            shadowForStrokeEnabled: !performanceConfig.shouldOptimize,
          }),
        );
      } else if (
        d.config.shape === SideMenuTypes.RECT ||
        d.config.shape === SideMenuTypes.PILLAR ||
        d.config.shape === SideMenuTypes.RECT_TEXT
      ) {
        // 長方形
        layerRef.current?.add(
          new ShapeRect({
            ...d.config,
            ...performanceConfig,
            ...additionalConfig,
            id: d.config.uuid,
            perfectDrawEnabled: false,
            strokeScaleEnabled: false,
            shadowForStrokeEnabled: !performanceConfig.shouldOptimize,
          }),
        );
      } else if (d.config.shape === SideMenuTypes.CIRCLE) {
        // 円
        layerRef.current?.add(
          new ShapeCircle({
            ...d.config,
            ...performanceConfig,
            ...additionalConfig,
            id: d.config.uuid,
          }),
        );
      } else if (
        d.config.shape === SideMenuTypes.ELLIPSE ||
        d.config.shape === SideMenuTypes.ELLIPSE_TEXT
      ) {
        // 楕円
        layerRef.current?.add(
          new ShapeEllipse({
            ...d.config,
            ...performanceConfig,
            ...additionalConfig,
            id: d.config.uuid,
            perfectDrawEnabled: false,
            strokeScaleEnabled: false,
            shadowForStrokeEnabled: !performanceConfig.shouldOptimize,
          }),
        );
      } else if (d.config.shape === SideMenuTypes.POLYGON) {
        // 多角形
        layerRef.current?.add(
          new ShapePolygon({
            ...d.config,
            ...performanceConfig,
            ...additionalConfig,
            id: d.config.uuid,
            perfectDrawEnabled: false,
            strokeScaleEnabled: false,
            shadowForStrokeEnabled: !performanceConfig.shouldOptimize,
            isLineDrawing,
            latticeWidth,
            latticeHeight,
            onChangeAnchorPoint: (data) => {},
          }),
        );
      } else if (d.config.shape === SideMenuTypes.TEXT) {
        // テキスト
        layerRef.current?.add(
          new ShapeText({
            ...d.config,
            ...performanceConfig,
            ...additionalConfig,
            id: d.config.uuid,
            perfectDrawEnabled: false,
            strokeScaleEnabled: false,
            shadowForStrokeEnabled: !performanceConfig.shouldOptimize,
            stageScale,
            defaultFontSize,
          }),
        );
      } else if (
        d.config.shape === SideMenuTypes.GONDOLA ||
        d.config.shape === SideMenuTypes.MESH_END
      ) {
        // ゴンドラ
        if (!shapeCache.has(SideMenuTypes.GONDOLA)) {
          const shape = new ShapeGondola({
            ...performanceConfig,
            ...additionalConfig,
            perfectDrawEnabled: false,
            strokeScaleEnabled: false,
            shadowForStrokeEnabled: !performanceConfig.shouldOptimize,
            hitStrokeWidth: 0,
            shape: SideMenuTypes.GONDOLA,
            uuid: '',
            areaId: '',
            tableId: '',
            branchNum: '',
            locationNum: '',
            displayLocationNum: '',
            showFullLocationNum: false,
            text: '',
            fontSize: editorConstants.FONT_SIZE_BASE,
            widthCells: 8,
            heightCells: 4,
            minWidth: latticeWidth,
            minHeight: latticeHeight,
            strokeWidth: 1,
            stroke: `rgba(0, 0, 0, 0)`,
            strokeRgb: { r: 0, g: 0, b: 0, a: 1 },
            strokeTransparent: false,
            strokeDash: false,
            fill: `rgba(255, 255, 255, 1)`,
            fillRgb: { r: 255, g: 255, b: 255, a: 1 },
            fillTransparent: false,
            rotation: 0,
            remarks: '',
            missingNumber: false,
            emptyNumber: false,
            selectable: true,
            draw: false,
            visible: true,
            disabled: false,
            visibleRemarksIcon: true,
            stageScale,
            defaultFontSize,
            isDoubleLine: d.config.shape === SideMenuTypes.MESH_END,
          });
          shapeCache.set(SideMenuTypes.GONDOLA, shape.cache());
        }

        layerRef.current?.add(
          shapeCache.get(SideMenuTypes.GONDOLA).clone({
            ...d.config,
            ...performanceConfig,
            ...additionalConfig,
            id: d.config.uuid,
            perfectDrawEnabled: false,
            strokeScaleEnabled: false,
            shadowForStrokeEnabled: !performanceConfig.shouldOptimize,
            visibleRemarksIcon: true,
            stageScale,
            defaultFontSize,
            isDoubleLine: d.config.shape === SideMenuTypes.MESH_END,
          }),
        );
      } else if (d.config.shape === SideMenuTypes.CIRCLE_TABLE) {
        // 円テーブル
        layerRef.current?.add(
          new ShapeEllipseTable({
            ...d.config,
            ...performanceConfig,
            ...additionalConfig,
            id: d.config.uuid,
            perfectDrawEnabled: false,
            strokeScaleEnabled: false,
            shadowForStrokeEnabled: !performanceConfig.shouldOptimize,
            visibleRemarksIcon: true,
            stageScale,
            defaultFontSize,
          }),
        );
      } else if (d.config.shape === SideMenuTypes.SQUARE_TABLE) {
        // 四角テーブル
        layerRef.current?.add(
          new ShapeRectTable({
            ...d.config,
            ...performanceConfig,
            ...additionalConfig,
            id: d.config.uuid,
            perfectDrawEnabled: false,
            strokeScaleEnabled: false,
            shadowForStrokeEnabled: !performanceConfig.shouldOptimize,
            visibleRemarksIcon: true,
            stageScale,
            defaultFontSize,
          }),
        );
      } else if (d.config.shape === SideMenuTypes.REGISTER_TABLE) {
        // レジ
        layerRef.current?.add(
          new ShapeRegister({
            ...d.config,
            ...performanceConfig,
            ...additionalConfig,
            id: d.config.uuid,
            perfectDrawEnabled: false,
            strokeScaleEnabled: false,
            shadowForStrokeEnabled: !performanceConfig.shouldOptimize,
            stageScale,
            defaultFontSize,
          }),
        );
      } else if (d.config.shape === SideMenuTypes.FREE_TEXT) {
        // フリーテキスト
        layerRef.current?.add(
          new ShapeFreeText({
            ...d.config,
            ...performanceConfig,
            ...additionalConfig,
            id: d.config.uuid,
            perfectDrawEnabled: false,
            strokeScaleEnabled: false,
            shadowForStrokeEnabled: !performanceConfig.shouldOptimize,
            stageScale,
            defaultFontSize,
          }),
        );
      } else if (d.config.shape === SideMenuTypes.SPECIAL_SHAPE) {
        // L字テーブル
        layerRef.current?.add(
          new ShapeSpecial({
            ...d.config,
            ...performanceConfig,
            ...additionalConfig,
            id: d.config.uuid,
            perfectDrawEnabled: false,
            strokeScaleEnabled: false,
            shadowForStrokeEnabled: !performanceConfig.shouldOptimize,
          }),
        );
      } else if (d.config.shape === SideMenuTypes.CIRCLE_ARROW) {
        // 回転矢印
        layerRef.current?.add(
          new ShapeCircleArrow({
            ...d.config,
            ...performanceConfig,
            ...additionalConfig,
            id: d.config.uuid,
            perfectDrawEnabled: false,
            strokeScaleEnabled: false,
            shadowForStrokeEnabled: !performanceConfig.shouldOptimize,
          }),
        );
      } else if (d.config.shape === SideMenuTypes.WC) {
        // トイレ
        layerRef.current?.add(
          new ShapeWc({
            ...d.config,
            ...performanceConfig,
            ...additionalConfig,
            id: d.config.uuid,
            perfectDrawEnabled: false,
            strokeScaleEnabled: false,
            shadowForStrokeEnabled: !performanceConfig.shouldOptimize,
          }),
        );
      } else if (d.config.shape === SideMenuTypes.REST_AREA) {
        // 休憩室
        layerRef.current?.add(
          new ShapeRestArea({
            ...d.config,
            ...performanceConfig,
            ...additionalConfig,
            id: d.config.uuid,
            perfectDrawEnabled: false,
            strokeScaleEnabled: false,
            shadowForStrokeEnabled: !performanceConfig.shouldOptimize,
          }),
        );
      } else if (d.config.shape === SideMenuTypes.OUTLET) {
        // 電源
        layerRef.current?.add(
          new ShapeOutlet({
            ...d.config,
            ...performanceConfig,
            ...additionalConfig,
            id: d.config.uuid,
            perfectDrawEnabled: false,
            strokeScaleEnabled: false,
            shadowForStrokeEnabled: !performanceConfig.shouldOptimize,
          }),
        );
      }
    });
  };

  const changeProperty = (propertyName: string, value: any) => {
    if (!layerRef.current) {
      return;
    }

    layerRef.current.children?.forEach((node: any) => {
      if (node.config.hasOwnProperty(propertyName)) {
        node.config = { ...node.config, [propertyName]: value };
      }
    });
  };

  useEffect(() => {
    if (!layerRef.current || !mapLayerData) {
      return;
    }

    const performanceConfig: PerformanceConfig = {
      shouldOptimize,
    };

    const { current } = mapLayerData;

    // 追加
    if (current.operation === ShapeOperations.ADD) {
      addChild(current.present as ShapeData[], performanceConfig);
    }

    // ノード設定リスト更新
    dispatch(viewerNodeModule.actions.updateChangeNodeList());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapLayerData]);

  useEffect(() => {
    changeProperty(editorConstants.SHAPE_PROP_NAME_STAGE_SCALE, stageScale);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stageScale]);

  // ロケーションメモアイコン表示・非表示の状態を更新
  useEffect(() => {
    changeProperty(
      editorConstants.SHAPE_PROP_NAME_VISIBLE_REMARKS_ICON,
      visibleRemarksIcon,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleRemarksIcon]);

  return <Component layerRef={layerRef} visible={true} />;
};
