import { useEffect } from 'react';

import { ShapeData, ShapeOperations, SideMenuTypes } from '../../types';

import {
  useDefaultFontSize,
  useEditLayerData,
  useLatticeHeight,
  useLatticeWidth,
  useLineDrawing,
  useShouldOptimize,
  useStageScale,
  useVisibleMapLayer,
  useVisibleRemarksIcon,
} from '../../selectors';

import {
  PerformanceConfig,
  ShapeArea,
  ShapeArrow,
  ShapeCircle,
  ShapeCircleArrow,
  ShapeEllipse,
  ShapeEllipseTable,
  ShapeFreeText,
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
import { EditorEditLayer as Component } from '../../components/organisms';

interface Props {
  layerRef: any;
}

/**
 * 編集レイヤー
 */
export const EditorEditLayer = (props: Props) => {
  const { layerRef } = props;

  const editLayerData = useEditLayerData();

  const shouldOptimize = useShouldOptimize();
  const stageScale = useStageScale();
  const latticeWidth = useLatticeWidth();
  const latticeHeight = useLatticeHeight();
  const isLineDrawing = useLineDrawing();

  const defaultFontSize = useDefaultFontSize();

  const visibleRemarksIcon = useVisibleRemarksIcon();

  const visibleMapLayer = useVisibleMapLayer();

  const addChild = (
    shapeData: ShapeData[],
    performanceConfig: PerformanceConfig,
  ) => {
    shapeData.forEach((data) => {
      const config: any = { ...data.config };

      if (config.shape === SideMenuTypes.PEN) {
        // ペン
        layerRef.current.add(
          new ShapePen({
            ...config,
            ...performanceConfig,
            key: config.uuid,
            id: config.uuid,
          }),
        );
      } else if (config.shape === SideMenuTypes.LINE) {
        // 線
        layerRef.current.add(
          new ShapeLine({
            ...config,
            ...performanceConfig,
            key: config.uuid,
            id: config.uuid,
          }),
        );
      } else if (
        config.shape === SideMenuTypes.ARROW1 ||
        config.shape === SideMenuTypes.ARROW2
      ) {
        // 矢印
        layerRef.current.add(
          new ShapeArrow({
            ...config,
            ...performanceConfig,
            key: config.uuid,
            id: config.uuid,
          }),
        );
      } else if (config.shape === SideMenuTypes.RECT_TEXT) {
        // 長方形テキスト
        layerRef.current.add(
          new ShapeRect({
            fontSize: config.hasOwnProperty('fontSize')
              ? config.fontSize
              : defaultFontSize,
            ...config,
            ...performanceConfig,
            key: config.uuid,
            id: config.uuid,
          }),
        );
      } else if (config.shape === SideMenuTypes.RECT) {
        // 長方形
        if (config.hasOwnProperty('defaultFontSize')) {
          delete config.defaultFontSize;
        }
        if (config.hasOwnProperty('fontSize')) {
          delete config.fontSize;
        }
        layerRef.current.add(
          new ShapeRect({
            ...config,
            ...performanceConfig,
            key: config.uuid,
            id: config.uuid,
          }),
        );
      } else if (config.shape === SideMenuTypes.PILLAR) {
        // 柱
        if (config.hasOwnProperty('defaultFontSize')) {
          delete config.defaultFontSize;
        }
        if (config.hasOwnProperty('fontSize')) {
          delete config.fontSize;
        }
        layerRef.current.add(
          new ShapeRect({
            ...config,
            ...performanceConfig,
            key: config.uuid,
            id: config.uuid,
            fillRgb: { r: 128, g: 128, b: 128, a: 1 },
          }),
        );
      } else if (config.shape === SideMenuTypes.CIRCLE) {
        // 円
        layerRef.current.add(
          new ShapeCircle({
            defaultFontSize,
            ...config,
            ...performanceConfig,
            key: config.uuid,
            id: config.uuid,
          }),
        );
      } else if (config.shape === SideMenuTypes.ELLIPSE_TEXT) {
        // 楕円テキスト
        layerRef.current.add(
          new ShapeEllipse({
            fontSize: config.hasOwnProperty('fontSize')
              ? config.fontSize
              : defaultFontSize,
            ...config,
            ...performanceConfig,
            key: config.uuid,
            id: config.uuid,
          }),
        );
      } else if (config.shape === SideMenuTypes.ELLIPSE) {
        // 楕円
        if (config.hasOwnProperty('defaultFontSize')) {
          delete config.defaultFontSize;
        }
        if (config.hasOwnProperty('fontSize')) {
          delete config.fontSize;
        }
        layerRef.current.add(
          new ShapeEllipse({
            ...config,
            ...performanceConfig,
            key: config.uuid,
            id: config.uuid,
          }),
        );
      } else if (config.shape === SideMenuTypes.POLYGON) {
        // 多角形
        layerRef.current.add(
          new ShapePolygon({
            ...config,
            ...performanceConfig,
            key: config.uuid,
            id: config.uuid,
            isLineDrawing,
            latticeWidth,
            latticeHeight,
          }),
        );
      } else if (config.shape === SideMenuTypes.TEXT) {
        // テキスト
        layerRef.current.add(
          new ShapeText({
            defaultFontSize,
            ...config,
            ...performanceConfig,
            key: config.uuid,
            id: config.uuid,
            stageScale,
          }),
        );
      } else if (config.shape === SideMenuTypes.AREA && !config.closed) {
        // エリア
        layerRef.current.add(
          new ShapeArea({
            ...config,
            ...performanceConfig,
            key: config.uuid,
            id: config.uuid,
            isLineDrawing,
            latticeWidth,
            latticeHeight,
          }),
        );
      } else if (config.shape === SideMenuTypes.CIRCLE_TABLE) {
        // 円テーブル
        layerRef.current.add(
          new ShapeEllipseTable({
            defaultFontSize,
            ...config,
            ...performanceConfig,
            key: config.uuid,
            id: config.uuid,
            visibleRemarksIcon,
            stageScale,
          }),
        );
      } else if (config.shape === SideMenuTypes.SQUARE_TABLE) {
        // 四角テーブル
        layerRef.current.add(
          new ShapeRectTable({
            defaultFontSize,
            ...config,
            ...performanceConfig,
            key: config.uuid,
            id: config.uuid,
            visibleRemarksIcon,
            stageScale,
          }),
        );
      } else if (config.shape === SideMenuTypes.REGISTER_TABLE) {
        // レジ
        layerRef.current.add(
          new ShapeRegister({
            defaultFontSize,
            ...config,
            ...performanceConfig,
            key: config.uuid,
            id: config.uuid,
            stageScale,
          }),
        );
      } else if (config.shape === SideMenuTypes.FREE_TEXT) {
        // フリーテキスト
        layerRef.current.add(
          new ShapeFreeText({
            defaultFontSize,
            ...config,
            ...performanceConfig,
            key: config.uuid,
            id: config.uuid,
            stageScale,
          }),
        );
      } else if (config.shape === SideMenuTypes.SPECIAL_SHAPE) {
        // L字テーブル
        layerRef.current.add(
          new ShapeSpecial({
            ...config,
            ...performanceConfig,
            key: config.uuid,
            id: config.uuid,
          }),
        );
      } else if (config.shape === SideMenuTypes.CIRCLE_ARROW) {
        // 回転矢印
        layerRef.current.add(
          new ShapeCircleArrow({
            ...config,
            ...performanceConfig,
            key: config.uuid,
            id: config.uuid,
          }),
        );
      } else if (config.shape === SideMenuTypes.WC) {
        // トイレ
        layerRef.current.add(
          new ShapeWc({
            ...config,
            ...performanceConfig,
            key: config.uuid,
            id: config.uuid,
          }),
        );
      } else if (config.shape === SideMenuTypes.REST_AREA) {
        // 休憩室
        layerRef.current.add(
          new ShapeRestArea({
            ...config,
            ...performanceConfig,
            key: config.uuid,
            id: config.uuid,
          }),
        );
      } else if (config.shape === SideMenuTypes.OUTLET) {
        // 電源
        layerRef.current.add(
          new ShapeOutlet({
            ...config,
            ...performanceConfig,
            key: config.uuid,
            id: config.uuid,
          }),
        );
      }
    });
  };

  const changeChild = (shapeData: ShapeData[]) => {
    shapeData.forEach((data) => {
      if (layerRef.current.children.length > 0) {
        const node = props.layerRef.current?.findOne(`#${data.config.uuid}`);
        if (node) {
          node.config = data.config;
        }
      }
    });
  };

  useEffect(() => {
    if (!layerRef.current || !editLayerData) {
      return;
    }

    const performanceConfig: PerformanceConfig = {
      shouldOptimize,
    };

    if (editLayerData.operation === ShapeOperations.ADD) {
      addChild(editLayerData.present as ShapeData[], performanceConfig);
    } else if (editLayerData.operation === ShapeOperations.CHANGE) {
      changeChild(editLayerData.present as ShapeData[]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editLayerData]);

  return <Component layerRef={layerRef} visible={visibleMapLayer} />;
};
