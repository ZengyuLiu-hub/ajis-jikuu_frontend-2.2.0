import { useEffect } from 'react';

import * as editorConstants from '../../constants/editor';

import { useAppDispatch } from '../../app/hooks';
import {
  ChangeIndexData,
  DisplayOrderOperations,
  ShapeData,
  ShapeOperations,
  SideMenuTypes,
  UndoRedoOperations,
} from '../../types';

import { editorNodeModule, editorShapeModule } from '../../modules';
import {
  useDefaultFontSize,
  useLatticeHeight,
  useLatticeWidth,
  useLineDrawing,
  useMapLayerData,
  useShouldOptimize,
  useStageScale,
  useVisibleMapLayer,
  useVisibleRemarksIcon,
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
import { EditorMapLayer as Component } from '../../components/organisms';

interface Props {
  layerRef: any;
}

/**
 * マップレイヤー
 */
export const EditorMapLayer = (props: Props) => {
  const { layerRef } = props;

  const dispatch = useAppDispatch();

  const mapLayerData = useMapLayerData();

  const shouldOptimize = useShouldOptimize();
  const stageScale = useStageScale();
  const latticeWidth = useLatticeWidth();
  const latticeHeight = useLatticeHeight();
  const isLineDrawing = useLineDrawing();

  const defaultFontSize = useDefaultFontSize();

  const visibleRemarksIcon = useVisibleRemarksIcon();

  const visibleMapLayer = useVisibleMapLayer();

  const shapeCache = new Map<string, any>();

  const changeProperty = (propertyName: string, value: any) => {
    if (!layerRef.current) {
      return;
    }

    layerRef.current.children.forEach((node: any) => {
      if (node.config.hasOwnProperty(propertyName)) {
        node.config = { ...node.config, [propertyName]: value };
      }
    });

    // ノード設定リスト更新
    dispatch(editorNodeModule.actions.updateChangeNodeList());
  };

  const addChild = (
    data: ShapeData[],
    performanceConfig: PerformanceConfig,
  ) => {
    data?.forEach((d) => {
      const config: any = { ...d.config };

      // エリアは除外
      if (config.shape === SideMenuTypes.AREA) {
        return;
      }

      if (config.shape === SideMenuTypes.PEN) {
        // ペン
        layerRef.current.add(
          new ShapePen({
            ...config,
            ...performanceConfig,
            id: config.uuid,
            perfectDrawEnabled: false,
            strokeScaleEnabled: false,
            shadowForStrokeEnabled: !performanceConfig.shouldOptimize,
          }),
        );
      } else if (config.shape === SideMenuTypes.LINE) {
        // 線
        layerRef.current.add(
          new ShapeLine({
            ...config,
            ...performanceConfig,
            id: config.uuid,
            perfectDrawEnabled: false,
            strokeScaleEnabled: false,
            shadowForStrokeEnabled: !performanceConfig.shouldOptimize,
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
            id: config.uuid,
            perfectDrawEnabled: false,
            strokeScaleEnabled: false,
            shadowForStrokeEnabled: !performanceConfig.shouldOptimize,
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
            id: config.uuid,
            perfectDrawEnabled: false,
            strokeScaleEnabled: false,
            shadowForStrokeEnabled: !performanceConfig.shouldOptimize,
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
            id: config.uuid,
            perfectDrawEnabled: false,
            strokeScaleEnabled: false,
            shadowForStrokeEnabled: !performanceConfig.shouldOptimize,
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
            id: config.uuid,
            perfectDrawEnabled: false,
            strokeScaleEnabled: false,
            shadowForStrokeEnabled: !performanceConfig.shouldOptimize,
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
            id: config.uuid,
            perfectDrawEnabled: false,
            strokeScaleEnabled: false,
            shadowForStrokeEnabled: !performanceConfig.shouldOptimize,
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
            id: config.uuid,
            perfectDrawEnabled: false,
            strokeScaleEnabled: false,
            shadowForStrokeEnabled: !performanceConfig.shouldOptimize,
          }),
        );
      } else if (config.shape === SideMenuTypes.POLYGON) {
        // 多角形
        layerRef.current.add(
          new ShapePolygon({
            ...config,
            ...performanceConfig,
            id: config.uuid,
            perfectDrawEnabled: false,
            strokeScaleEnabled: false,
            shadowForStrokeEnabled: !performanceConfig.shouldOptimize,
            isLineDrawing,
            latticeWidth,
            latticeHeight,
            onChangeAnchorPoint: (data) =>
              dispatch(editorShapeModule.actions.updateMapPresent(data)),
          }),
        );
      } else if (config.shape === SideMenuTypes.TEXT) {
        // テキスト
        layerRef.current.add(
          new ShapeText({
            defaultFontSize,
            ...config,
            ...performanceConfig,
            id: config.uuid,
            perfectDrawEnabled: false,
            strokeScaleEnabled: false,
            shadowForStrokeEnabled: !performanceConfig.shouldOptimize,
            stageScale,
          }),
        );
      } else if (
        config.shape === SideMenuTypes.GONDOLA ||
        config.shape === SideMenuTypes.MESH_END
      ) {
        // ゴンドラ
        if (!shapeCache.has(SideMenuTypes.GONDOLA)) {
          const shape = new ShapeGondola({
            defaultFontSize,
            ...performanceConfig,
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
            fontSize: defaultFontSize,
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
            visibleRemarksIcon,
            stageScale,
            isDoubleLine: config.shape === SideMenuTypes.MESH_END,
          });
          shapeCache.set(SideMenuTypes.GONDOLA, shape.cache());
        }

        layerRef.current.add(
          shapeCache.get(SideMenuTypes.GONDOLA).clone({
            defaultFontSize,
            ...config,
            ...performanceConfig,
            id: config.uuid,
            perfectDrawEnabled: false,
            strokeScaleEnabled: false,
            shadowForStrokeEnabled: !performanceConfig.shouldOptimize,
            visibleRemarksIcon,
            stageScale,
            isDoubleLine: config.shape === SideMenuTypes.MESH_END,
          }),
        );
      } else if (config.shape === SideMenuTypes.CIRCLE_TABLE) {
        // 円テーブル
        layerRef.current.add(
          new ShapeEllipseTable({
            defaultFontSize,
            ...config,
            ...performanceConfig,
            id: config.uuid,
            perfectDrawEnabled: false,
            strokeScaleEnabled: false,
            shadowForStrokeEnabled: !performanceConfig.shouldOptimize,
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
            id: config.uuid,
            perfectDrawEnabled: false,
            strokeScaleEnabled: false,
            shadowForStrokeEnabled: !performanceConfig.shouldOptimize,
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
            id: config.uuid,
            perfectDrawEnabled: false,
            strokeScaleEnabled: false,
            shadowForStrokeEnabled: !performanceConfig.shouldOptimize,
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
            id: config.uuid,
            perfectDrawEnabled: false,
            strokeScaleEnabled: false,
            shadowForStrokeEnabled: !performanceConfig.shouldOptimize,
            stageScale,
          }),
        );
      } else if (config.shape === SideMenuTypes.SPECIAL_SHAPE) {
        // L字テーブル
        layerRef.current.add(
          new ShapeSpecial({
            ...config,
            ...performanceConfig,
            id: config.uuid,
            perfectDrawEnabled: false,
            strokeScaleEnabled: false,
            shadowForStrokeEnabled: !performanceConfig.shouldOptimize,
          }),
        );
      } else if (config.shape === SideMenuTypes.CIRCLE_ARROW) {
        // 回転矢印
        layerRef.current.add(
          new ShapeCircleArrow({
            ...config,
            ...performanceConfig,
            id: config.uuid,
            perfectDrawEnabled: false,
            strokeScaleEnabled: false,
            shadowForStrokeEnabled: !performanceConfig.shouldOptimize,
          }),
        );
      } else if (config.shape === SideMenuTypes.WC) {
        // トイレ
        layerRef.current.add(
          new ShapeWc({
            ...config,
            ...performanceConfig,
            id: config.uuid,
            perfectDrawEnabled: false,
            strokeScaleEnabled: false,
            shadowForStrokeEnabled: !performanceConfig.shouldOptimize,
          }),
        );
      } else if (config.shape === SideMenuTypes.REST_AREA) {
        // 休憩室
        layerRef.current.add(
          new ShapeRestArea({
            ...config,
            ...performanceConfig,
            id: config.uuid,
            perfectDrawEnabled: false,
            strokeScaleEnabled: false,
            shadowForStrokeEnabled: !performanceConfig.shouldOptimize,
          }),
        );
      } else if (config.shape === SideMenuTypes.OUTLET) {
        // 電源
        layerRef.current.add(
          new ShapeOutlet({
            ...config,
            ...performanceConfig,
            id: config.uuid,
            perfectDrawEnabled: false,
            strokeScaleEnabled: false,
            shadowForStrokeEnabled: !performanceConfig.shouldOptimize,
          }),
        );
      }
    });
  };

  const changeChild = (
    data: ShapeData[],
    performanceConfig: PerformanceConfig,
  ) => {
    data?.forEach((d) => {
      // エリアは除外
      if (d.config.shape === SideMenuTypes.AREA) {
        return;
      }

      const node = layerRef.current?.findOne(`#${d.config.uuid}`);
      if (!node) {
        return;
      }

      // 上書きプロパティの作成
      const overrideConfig: any = {};

      if (
        node.config.hasOwnProperty(
          editorConstants.SHAPE_PROP_NAME_LATTICE_WIDTH,
        )
      ) {
        overrideConfig.latticeWidth = latticeWidth;
      }

      if (
        node.config.hasOwnProperty(
          editorConstants.SHAPE_PROP_NAME_LATTICE_HEIGHT,
        )
      ) {
        overrideConfig.latticeHeight = latticeHeight;
      }

      if (
        node.config.hasOwnProperty(
          editorConstants.SHAPE_PROP_NAME_VISIBLE_REMARKS_ICON,
        )
      ) {
        overrideConfig.visibleRemarksIcon = visibleRemarksIcon;
      }

      if (
        node.config.hasOwnProperty(editorConstants.SHAPE_PROP_NAME_STAGE_SCALE)
      ) {
        overrideConfig.stageScale = stageScale;
      }

      // プロパティ更新
      node.config = {
        ...d.config,
        shouldOptimize: performanceConfig.shouldOptimize,
        ...overrideConfig,
      };

      // 多角形の場合
      if (node.config.shape === SideMenuTypes.POLYGON) {
        // 移動ポイントの位置をリセット
        node.resetAnchorPoint();
      }
    });
  };

  const removeChild = (data: ShapeData[]) => {
    data?.forEach((d) => {
      // エリアは除外
      if (d.config.shape === SideMenuTypes.AREA) {
        return;
      }

      const node = layerRef.current?.findOne(`#${d.config.uuid}`);
      if (node) {
        node.destroy();
      }
    });
  };

  const changeDisplayOrder = (data: ChangeIndexData[]) => {
    data?.forEach((d) => {
      // エリアは除外
      if (d.config.shape === SideMenuTypes.AREA) {
        return;
      }

      const node = layerRef.current?.findOne(`#${d.config.uuid}`);
      if (!node) {
        return;
      }

      if (d.order === DisplayOrderOperations.MOVE_TO_TOP) {
        node.moveToTop();
      } else if (d.order === DisplayOrderOperations.MOVE_UP) {
        node.moveUp();
      } else if (d.order === DisplayOrderOperations.MOVE_DOWN) {
        node.moveDown();
      } else if (d.order === DisplayOrderOperations.MOVE_TO_BOTTOM) {
        node.moveToBottom();
      }
    });
  };

  const restoreDisplayOrder = (data: ChangeIndexData[]) => {
    data?.forEach((d) => {
      // エリアは除外
      if (d.config.shape === SideMenuTypes.AREA) {
        return;
      }

      const node = layerRef.current?.findOne(`#${d.config.uuid}`);
      if (!node) {
        return;
      }
      node.zIndex(d.index);
    });
  };

  useEffect(() => {
    changeProperty(editorConstants.SHAPE_PROP_NAME_STAGE_SCALE, stageScale);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stageScale]);

  useEffect(() => {
    changeProperty(
      editorConstants.SHAPE_PROP_NAME_VISIBLE_REMARKS_ICON,
      visibleRemarksIcon,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleRemarksIcon]);

  useEffect(() => {
    if (!layerRef.current || !mapLayerData) {
      return;
    }

    const performanceConfig: PerformanceConfig = {
      shouldOptimize,
    };

    const { operation, current, previous } = mapLayerData;

    if (operation === UndoRedoOperations.UNDO) {
      // 追加
      if (previous && previous.operation === ShapeOperations.ADD) {
        removeChild(previous.present as ShapeData[]);
      }

      // 変更
      if (previous && previous.operation === ShapeOperations.CHANGE) {
        changeChild(previous.past as ShapeData[], performanceConfig);
      }

      // 削除
      if (previous && previous.operation === ShapeOperations.REMOVE) {
        addChild(previous.present as ShapeData[], performanceConfig);
      }

      // 表示順
      if (previous && previous.operation === ShapeOperations.CHANGE_INDEX) {
        restoreDisplayOrder(previous.past as ChangeIndexData[]);
      }
    } else {
      // 追加
      if (current.operation === ShapeOperations.ADD) {
        addChild(current.present as ShapeData[], performanceConfig);
      }

      // 変更
      if (current.operation === ShapeOperations.CHANGE) {
        changeChild(current.present as ShapeData[], performanceConfig);
      }

      // 削除
      if (current.operation === ShapeOperations.REMOVE) {
        removeChild(current.present as ShapeData[]);
      }

      // 表示順
      if (current.operation === ShapeOperations.CHANGE_INDEX) {
        changeDisplayOrder(current.present as ChangeIndexData[]);
      }
    }

    // ノード設定リスト更新
    dispatch(editorNodeModule.actions.updateChangeNodeList());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapLayerData]);

  useEffect(() => {
    if (!layerRef.current) {
      return;
    }

    layerRef.current.children?.forEach((node: any) => {
      // 多角形以外は除外
      if (node.config.shape !== SideMenuTypes.POLYGON) {
        return;
      }

      // 上書きプロパティの作成
      const overrideConfig: any = {};

      if (
        node.config.hasOwnProperty(
          editorConstants.SHAPE_PROP_NAME_LATTICE_WIDTH,
        )
      ) {
        overrideConfig.latticeWidth = latticeWidth;
      }

      if (
        node.config.hasOwnProperty(
          editorConstants.SHAPE_PROP_NAME_LATTICE_HEIGHT,
        )
      ) {
        overrideConfig.latticeHeight = latticeHeight;
      }

      // プロパティ更新
      node.config = {
        ...node.config,
        ...overrideConfig,
      };

      // 移動ポイントの位置をリセット
      node.resetAnchorPoint();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latticeWidth, latticeHeight]);

  return <Component layerRef={layerRef} visible={visibleMapLayer} />;
};
