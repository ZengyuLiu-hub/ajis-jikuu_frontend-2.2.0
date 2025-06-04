import Konva from 'konva';
import React, { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import * as constants from '../../constants/app';
import * as editorConstants from '../../constants/editor';

import {
  AuthorityTypes,
  EditData,
  LayoutData,
  MapPdfOrientations,
  MapPdfOutputModes,
  MapPdfPrintSettings,
  MapPdfRotations,
  SaveData,
  ScreenCaptureRanges,
  ShapeData,
  ShapeOperations,
  SideMenuTypes,
  StageScale,
  StageScales,
} from '../../types';

import { useAppDispatch } from '../../app/hooks';

import {
  editorAreaModule,
  editorIslandModule,
  editorKeyModule,
  editorLayoutModule,
  editorLineModule,
  editorModule,
  editorNodeModule,
  editorOpModule,
  editorShapeModule,
  editorTableModule,
  editorViewModule,
  editorWallModule,
} from '../../modules';
import {
  useAddAreaLatestAreaId,
  useAddTableLatestTableId,
  useCurrentLayout,
  useCustomFormats,
  useDeleteNodeIds,
  useEditMapVersion,
  useEditNodeList,
  useEditorIslandState,
  useEditorPreferenceState,
  useEditorWallState,
  useEnabledLattice,
  useFinishOpHold,
  useHasUnsavedData,
  useInventoryNote,
  useLanguage,
  useLatticeHeight,
  useLatticeWidth,
  useLineDrawing,
  useLocationDisplayFormatType,
  useMinSelectedNode,
  useNeedsAutoSave,
  useNeedsPrintPdf,
  useNeedsRefreshSaveShapes,
  useOpHoldItems,
  usePressKeyControl,
  usePressKeyShift,
  useScrollPosition,
  useSelectedMenu,
  useSelectedNodeIds,
  useSelectedNodeList,
  useStageHeight,
  useStageScale,
  useStageWidth,
  useTableIdLength,
  useUser,
  useVisibleRemarksIcon,
  useWaitingAutoSave,
} from '../../selectors';

import {
  LocationTypes,
  ShapeArea,
  ShapeArrow,
  ShapeEllipseTable,
  ShapeFreeText,
  ShapeGondola,
  ShapeLine,
  ShapePen,
  ShapePolygon,
  ShapeRect,
  ShapeRectTable,
  ShapeRegister,
} from '../../components/molecules';
import { ShapeEllipse } from '../../components/molecules/ShapeEllipse';
import {
  EditorMainStage as Component,
  MapPdf,
  MapPdfInventory,
  MapPdfStatementOfDelivery,
} from '../../components/organisms';

import packageInfo from '../../../package.json';
import { MapPdfProps } from '../../components/organisms/MapPdf';
import { MapPdfData } from '../../components/organisms/MapPdfStatementOfDelivery';
import { EditorUtil } from '../../utils/EditorUtil';
import { SecurityUtil } from '../../utils/SecurityUtil';

Konva.pixelRatio = 1;

interface Props {
  rulerX: any;
  rulerY: any;
  mapLayer: React.RefObject<Konva.Layer>;
  editLayer: React.RefObject<Konva.Layer>;
  areaLayer: React.RefObject<Konva.Layer>;
  transformer: React.RefObject<Konva.Transformer>;
  getCurrentShapeData(): EditData;
  undo: () => void;
  redo: () => void;
  handleStageScale: (scale: StageScale, value?: number) => void;
}

export const EditorMainStage = (props: Props) => {
  const { rulerX, rulerY, mapLayer, editLayer, areaLayer, undo, redo } = props;

  const MOVE_KEYS = ['arrowup', 'arrowdown', 'arrowleft', 'arrowright'];
  const PASTE_PARENT_ID_CHARS = /[A-Za-z]/;

  const dispatch = useAppDispatch();

  const wrapper = useRef<any>(null);
  const stage = useRef<Konva.Stage>(null);
  const operationLayer = useRef<Konva.Layer>(null);

  const user = useUser();
  const language = useLanguage();

  const editMapVersion = useEditMapVersion();
  const scrollPosition = useScrollPosition();

  const note = useInventoryNote();
  const preferences = useEditorPreferenceState();
  const formatType = useLocationDisplayFormatType();
  const customFormats = useCustomFormats();

  const selectedMenu = useSelectedMenu();
  const opHoldItems = useOpHoldItems();
  const finishOpHold = useFinishOpHold();

  const editNodeList = useEditNodeList();
  const selectedNodeIds = useSelectedNodeIds();
  const selectedNodeList = useSelectedNodeList();
  const deleteNodeIds = useDeleteNodeIds();
  const minSelectedNode = useMinSelectedNode();

  const stageScale = useStageScale();
  const pressKeyControl = usePressKeyControl();
  const pressKeyShift = usePressKeyShift();
  const isLineDrawing = useLineDrawing();
  const stageWidth = useStageWidth();
  const stageHeight = useStageHeight();
  const latticeWidth = useLatticeWidth();
  const latticeHeight = useLatticeHeight();
  const enabledLattice = useEnabledLattice();
  const tableIdLength = useTableIdLength();

  const needsPrintPdf = useNeedsPrintPdf();

  const needsRefreshSaveShapes = useNeedsRefreshSaveShapes();
  const needsAutoSave = useNeedsAutoSave();
  const hasUnsavedData = useHasUnsavedData();
  const isWaitingAutoSave = useWaitingAutoSave();
  const currentLayout = useCurrentLayout();

  const latestAreaId = useAddAreaLatestAreaId();
  const latestTableId = useAddTableLatestTableId();
  const wallState = useEditorWallState();
  const islandState = useEditorIslandState();

  const visibleRemarksIcon = useVisibleRemarksIcon();

  const [latestPasteBranchNum, setLatestPasteBranchNum] = useState<number>();

  const [autoSaveTimeoutId, setAutoSaveTimeoutId] = useState<NodeJS.Timeout>();

  /**
   * ノード削除.
   */
  const destroyNodes = (uuidList: string[]) => {
    if (uuidList.length === 0) {
      return;
    }

    // マップレイヤー
    const mapNodes =
      mapLayer.current?.children?.filter((node: any) =>
        uuidList.includes(node.uuid),
      ) ?? [];

    const removeMapNodes: ShapeData[] = [];
    mapNodes.forEach((node: any) => {
      removeMapNodes.push({
        id: node.config.uuid,
        config: node.config,
      });
      node.destroy();
    });

    // エリアレイヤー
    const areaNodes =
      areaLayer.current?.children?.filter((node: any) =>
        uuidList.includes(node.uuid),
      ) ?? [];

    const removeAreaNode: ShapeData[] = [];
    areaNodes.forEach((node: any) => {
      removeAreaNode.push({
        id: node.config.uuid,
        config: node.config,
      });
      node.destroy();
    });

    // 編集レイヤークリア
    editLayer.current?.destroyChildren();

    // 選択ノードクリア
    const removeNodes = removeMapNodes.concat(removeAreaNode);

    dispatch(
      editorShapeModule.actions.updateMapPresent({
        operation: ShapeOperations.REMOVE,
        present: removeNodes,
      }),
    );

    dispatch(editorNodeModule.actions.clearSelectedNodes());
    dispatch(editorNodeModule.actions.clearEditNodeList());
    dispatch(editorNodeModule.actions.updateChangeNodeList());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  const removeLineDrawingNode = () => {
    if (opHoldItems.length === 0) {
      return;
    }
    const [shape] = opHoldItems;

    const node = editLayer.current?.findOne(`#${shape.config.uuid}`);
    if (
      node &&
      [ShapeArea, ShapePolygon].some(
        (shape) => node instanceof shape && node.isLineDrawing,
      )
    ) {
      node.destroy();
    }
  };

  // シェイプ移動
  const moveShape = (pressKey: string) => {
    // 矢印キーでまとめて移動可能な最大選択シェイプ数を超えていた場合、パフォーマンスに問題がある為、処理しない
    if (
      editNodeList.length > editorConstants.ARROW_KEY_MOVE_MAX_SELECTION_SHAPES
    ) {
      return;
    }

    editNodeList.forEach((node: any) => {
      // 上矢印
      if (pressKey === 'arrowup') {
        const newConfig = { ...node.attrs.config, y: node.y() - latticeHeight };
        node.setAttrs({ y: newConfig.y, config: newConfig });
      }

      // 下矢印
      if (pressKey === 'arrowdown') {
        const newConfig = { ...node.attrs.config, y: node.y() + latticeHeight };
        node.setAttrs({ y: newConfig.y, config: newConfig });
      }

      // 左矢印
      if (pressKey === 'arrowleft') {
        const newConfig = { ...node.attrs.config, x: node.x() - latticeWidth };
        node.setAttrs({ x: newConfig.x, config: newConfig });
      }

      // 右矢印
      if (pressKey === 'arrowright') {
        const newConfig = { ...node.attrs.config, x: node.x() + latticeWidth };
        node.setAttrs({ x: newConfig.x, config: newConfig });
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();

    // Control
    if ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) {
      dispatch(editorKeyModule.actions.updatePressKeyControl(true));

      if (props.transformer.current) {
        props.transformer.current.shouldOverdrawWholeArea(false);
      }
    }

    // Shift
    if (e.shiftKey) {
      dispatch(editorKeyModule.actions.updatePressKeyShift(true));
    }

    const pressKey = e.key.toLowerCase();

    // All Select
    if (pressKeyControl && !pressKeyShift && pressKey === 'a') {
      const mapIds =
        mapLayer.current?.children?.map((node: any) => node.config.uuid) ?? [];

      const areaIds =
        areaLayer.current?.children?.map((node: any) => node.config.uuid) ?? [];

      dispatch(
        editorNodeModule.actions.updateSelectedNodeIds(mapIds.concat(areaIds)),
      );
      return;
    }

    // Copy
    if (pressKeyControl && pressKey === 'c') {
      if (selectedNodeList.length === 0) {
        return;
      }
      setLatestPasteBranchNum(undefined);
      dispatch(editorOpModule.actions.updateSelectedMenu(SideMenuTypes.PASTE));
      return;
    }

    // Undo
    if (pressKeyControl && !pressKeyShift && pressKey === 'z') {
      undo();
      return;
    }

    // Redo
    if (pressKeyControl && pressKeyShift && pressKey === 'z') {
      redo();
      return;
    }

    // Escape
    if (pressKey === 'escape') {
      if (selectedNodeIds.length > 0) {
        dispatch(editorNodeModule.actions.clearSelectedNodeIds());
      }
      if (selectedMenu !== SideMenuTypes.SELECT_TOOL) {
        dispatch(
          editorOpModule.actions.updateOp({
            selectedMenu: SideMenuTypes.SELECT_TOOL,
            opHoldItems: [],
            finishOpHold: false,
          }),
        );
      }
      if (isLineDrawing) {
        removeLineDrawingNode();
        dispatch(editorLineModule.actions.updateLineDrawing(false));
      }
      return;
    }

    // シェイプ削除
    if (pressKey === 'delete' || pressKey === 'backspace') {
      destroyNodes(selectedNodeIds);
      return;
    }

    // シェイプ移動
    if (MOVE_KEYS.includes(pressKey)) {
      moveShape(pressKey);
    }

    // 拡大
    if (pressKeyControl && pressKey === 'u') {
      props.handleStageScale(StageScales.UP);
      return;
    }

    // 縮小
    if (pressKeyControl && pressKey === 'o') {
      props.handleStageScale(StageScales.DOWN);
      return;
    }

    // リセット
    if (pressKeyControl && pressKey === 'i') {
      props.handleStageScale(StageScales.RESET);
      return;
    }
  };

  // シェイプ移動を更新
  const updateMoveShape = () => {
    const past: any[] = [];
    const present: any[] = [];
    selectedNodeList.forEach((node: any) => {
      const { uuid: id } = node.config;
      const {
        attrs: { x, y },
      } = editNodeList.find(({ attrs: { uuid } }) => uuid === id);

      // 差異がない場合は処理しない
      if (x === node.config.x && y === node.config.y) {
        return;
      }

      past.push({ id, config: { ...node.config } });

      node.config = { ...node.config, x, y };

      present.push({ id, config: { ...node.config } });
    });

    if (present.length === 0) {
      return;
    }

    // Undo リストに追加依頼
    dispatch(
      editorShapeModule.actions.updateMapPresent({
        operation: ShapeOperations.CHANGE,
        past,
        present,
      }),
    );
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    // Control
    if (!e.ctrlKey) {
      dispatch(editorKeyModule.actions.updatePressKeyControl(false));
    }
    if (pressKeyControl && props.transformer.current) {
      props.transformer.current.shouldOverdrawWholeArea(true);
    }

    // Shift
    if (!e.shiftKey) {
      dispatch(editorKeyModule.actions.updatePressKeyShift(false));
    }

    const pressKey = e.key.toLowerCase();

    // 上下左右矢印
    if (MOVE_KEYS.includes(pressKey)) {
      updateMoveShape();
    }
  };

  const handleScrollWrapper = (e: React.UIEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const container: any = e.target;

    rulerX.current.scrollLeft = container.scrollLeft;
    rulerY.current.scrollTop = container.scrollTop;
  };

  const nextPasteTableId = (targetMaxId?: string) => {
    const targets =
      mapLayer.current?.children?.filter(
        (node: any) =>
          node.config.tableId &&
          PASTE_PARENT_ID_CHARS.test(node.config.tableId),
      ) ?? [];

    if (!targetMaxId && targets.length === 0) {
      return 'A'.repeat(tableIdLength);
    }

    // 現在の最大値を取得
    const maxId: string =
      targetMaxId ??
      targets
        .reduce((result: string[], current: any) => {
          if (
            result.length === 0 ||
            !result.find((id) => id === current.config.tableId)
          ) {
            result.push(current.config.tableId);
          }
          return result;
        }, [] as string[])
        .reduce((a: string, b: string) => {
          const arrA = [...a];
          const arrB = [...b];

          const index = arrB.findIndex((prev, i) => prev !== arrB[i]);
          if (index > -1) {
            return b;
          }
          return arrA[index] > arrB[index] ? a : b;
        });

    // 最大値まで進んでしまった場合は最初に戻す
    if (maxId === 'z'.repeat(tableIdLength)) {
      return 'A'.repeat(tableIdLength);
    }
    const ids = [...maxId];

    const newIds: string[] = [];

    let promotionIndex = 0;
    ids.reverse().forEach((id, index) => {
      const idCode = id.codePointAt(0);
      if (!idCode) {
        return;
      }

      // z まで到達した場合、位を上げる
      if (idCode === 122) {
        newIds.push('A');
        promotionIndex = index + 1;
        return;
      }

      // Z まで到達した場合、a から始める
      if (idCode === 90) {
        newIds.push('a');
        return;
      }

      // 次の位を上げる
      if (index === promotionIndex) {
        newIds.push(String.fromCharCode(idCode + 1));
        return;
      }
      newIds.push(id);
    });
    return newIds.reverse().join('');
  };

  const pasteShapes = (nodes: any[], x: number, y: number): ShapeData[] => {
    const min = nodes.reduce((a: any, b: any) => {
      if (!!a.config.points) {
        if (a.config.points[0][0] === b.config.points[0][0]) {
          return a.config.points[0][1] < b.config.points[0][1] ? a : b;
        }
        return a.config.points[0][0] < b.config.points[0][0] ? a : b;
      }

      if (a.config.x === b.config.x) {
        return a.config.y < b.config.y ? a : b;
      }
      return a.config.x < b.config.x ? a : b;
    });

    const offsetX =
      x - (!!min.config.points ? min.config.points[0][0] : min.config.x);
    const offsetY =
      y - (!!min.config.points ? min.config.points[0][1] : min.config.y);

    const tableGroup: string[] = nodes
      .filter((d) => d.config.tableId)
      .reduce((result, current) => {
        if (
          result.length === 0 ||
          !result.find((id: string) => id === current.config.tableId)
        ) {
          result.push(current.config.tableId);
        }
        return result;
      }, [] as string[]);

    const newTableIds = new Map();

    let nextId: string | undefined = undefined;
    tableGroup.forEach((id) => {
      nextId = nextPasteTableId(nextId);
      newTableIds.set(id, nextId);
    });

    let index =
      (mapLayer.current &&
        mapLayer?.current.children &&
        mapLayer.current.children.length - 1) ??
      -1;

    const maxBranchNum = Number('9'.repeat(preferences.branchNumLength));

    const copyNodes: ShapeData[] = [];
    nodes.forEach((node) => {
      index += 1;

      if (
        node instanceof ShapePen ||
        node instanceof ShapePolygon ||
        node instanceof ShapeArea
      ) {
        const points = node.config.points.map((point: number[]) => {
          return [point[0] + offsetX, point[1] + offsetY];
        });

        const id = uuidv4();
        copyNodes.push({
          id,
          index,
          config: {
            ...node.config,
            uuid: id,
            points,
            x: x - points[0][0],
            y: y - points[0][1],
          },
        });
      } else if (node instanceof ShapeLine || node instanceof ShapeArrow) {
        const id = uuidv4();
        copyNodes.push({
          id,
          index,
          config: { ...node.config, uuid: id, x, y },
        });
      } else if (
        node instanceof ShapeEllipseTable ||
        node instanceof ShapeRectTable
      ) {
        var nextBranchNum =
          nodes.length > 1
            ? Number(node.config.branchNum)
            : (latestPasteBranchNum ?? Number(node.config.branchNum)) + 1;

        // 次の枝番が上限を超えている場合
        if (nextBranchNum > maxBranchNum) {
          nextBranchNum = 1;
        }

        // 選択数が１つの場合、連続ペースト時に枝番を＋１する
        if (nodes.length === 1) {
          setLatestPasteBranchNum(nextBranchNum);
        }

        const branchNum = `${nextBranchNum}`.padStart(
          preferences.branchNumLength,
          '0',
        );
        const locationNum = `${node.config.tableId}${branchNum}`;

        const displayLocationNum = EditorUtil.generateDisplayLocationNum(
          locationNum,
          formatType,
          customFormats,
        );

        const id = uuidv4();
        copyNodes.push({
          id,
          index,
          config: {
            ...node.config,
            uuid: id,
            branchNum,
            locationNum,
            displayLocationNum,
            x: (node.config.x ?? 0) + offsetX,
            y: (node.config.y ?? 0) + offsetY,
          },
        });
      } else if (node instanceof ShapeGondola) {
        const tableId = newTableIds.get(node.config.tableId);
        const locationNum = `${tableId}${node.config.branchNum}`;

        const id = uuidv4();
        copyNodes.push({
          id,
          index,
          config: {
            ...node.config,
            uuid: id,
            tableId,
            locationNum,
            displayLocationNum: locationNum,
            x: (node.config.x ?? 0) + offsetX,
            y: (node.config.y ?? 0) + offsetY,
          },
        });
      } else {
        const id = uuidv4();
        copyNodes.push({
          id,
          index,
          config: {
            ...node.config,
            uuid: id,
            x: node.config.x + offsetX,
            y: node.config.y + offsetY,
          },
        });
      }
    });

    return copyNodes;
  };

  const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // 選択ツール
    if (selectedMenu === SideMenuTypes.SELECT_TOOL && !finishOpHold) {
      operationLayer.current?.dispatchEvent(e);
      return;
    }
  };

  const handleStageMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (
      e.target.getClassName() === 'Stage' &&
      selectedMenu === SideMenuTypes.SELECT_TOOL &&
      selectedNodeIds.length > 0
    ) {
      dispatch(editorNodeModule.actions.clearSelectedNodeIds());
    }

    // 選択ツール
    if (selectedMenu === SideMenuTypes.SELECT_TOOL) {
      operationLayer.current?.dispatchEvent(e);
      return;
    }

    const pointerPosition = stage.current?.getRelativePointerPosition() ?? {
      x: 0,
      y: 0,
    };
    const x = Math.round(pointerPosition.x / latticeWidth) * latticeWidth;
    const y = Math.round(pointerPosition.y / latticeHeight) * latticeHeight;

    // ペースト
    if (selectedMenu === SideMenuTypes.PASTE && selectedNodeList.length > 0) {
      const copyNodes = pasteShapes(selectedNodeList, x, y);
      const ids = copyNodes.map((node: any) => node.id);

      dispatch(
        editorShapeModule.actions.updateMapPresent({
          operation: ShapeOperations.ADD,
          present: copyNodes,
        }),
      );
      dispatch(editorNodeModule.actions.updateSelectedNodeIds(ids));

      return;
    }

    const index =
      (mapLayer.current &&
        mapLayer?.current.children &&
        mapLayer.current.children.length) ??
      0;

    // ペン
    if (selectedMenu === SideMenuTypes.PEN && opHoldItems.length > 0) {
      const shape = opHoldItems[0];

      const newShape: ShapeData = {
        ...shape,
        index,
        config: {
          ...shape.config,
          x,
          y,
          points: [[0, 0]],
          selectable: false,
          draw: true,
        },
      };

      dispatch(editorOpModule.actions.updateHoldItems([newShape]));
      dispatch(editorLineModule.actions.updateLineDrawing(true));
      dispatch(
        editorShapeModule.actions.updateEditShapes({
          operation: ShapeOperations.ADD,
          present: [newShape],
        }),
      );

      return;
    }

    // 線
    if (selectedMenu === SideMenuTypes.LINE && opHoldItems.length > 0) {
      const shape = opHoldItems[0];

      const newShape = {
        ...shape,
        index,
        config: {
          ...shape.config,
          x,
          y,
          points: [[0, 0]],
          selectable: false,
          draw: true,
        },
      };

      dispatch(editorOpModule.actions.updateHoldItems([newShape]));
      dispatch(
        editorShapeModule.actions.updateEditShapes({
          operation: ShapeOperations.ADD,
          present: [newShape],
        }),
      );

      return;
    }

    // 追加時にサイズ変更が可能なシェイプ
    if (
      (selectedMenu === SideMenuTypes.RECT ||
        selectedMenu === SideMenuTypes.CIRCLE ||
        selectedMenu === SideMenuTypes.ELLIPSE ||
        selectedMenu === SideMenuTypes.PILLAR ||
        selectedMenu === SideMenuTypes.RECT_TEXT ||
        selectedMenu === SideMenuTypes.ARROW1 ||
        selectedMenu === SideMenuTypes.ARROW2 ||
        selectedMenu === SideMenuTypes.ELLIPSE_TEXT ||
        selectedMenu === SideMenuTypes.CIRCLE_TABLE ||
        selectedMenu === SideMenuTypes.SQUARE_TABLE ||
        selectedMenu === SideMenuTypes.REGISTER_TABLE ||
        selectedMenu === SideMenuTypes.FREE_TEXT) &&
      opHoldItems.length > 0
    ) {
      const shape = opHoldItems[0];

      const newShape = {
        ...shape,
        index,
        config: {
          ...shape.config,
          x,
          y,
          selectable: false,
          draw: true,
        },
      };

      dispatch(editorOpModule.actions.updateHoldItems([newShape]));
      dispatch(
        editorShapeModule.actions.updateEditShapes({
          operation: ShapeOperations.ADD,
          present: [newShape],
        }),
      );

      return;
    }

    // 追加時にサイズ変更ができないシェイプ
    if (
      (selectedMenu === SideMenuTypes.TEXT ||
        selectedMenu === SideMenuTypes.SPECIAL_SHAPE ||
        selectedMenu === SideMenuTypes.CIRCLE_ARROW ||
        selectedMenu === SideMenuTypes.WC ||
        selectedMenu === SideMenuTypes.REST_AREA ||
        selectedMenu === SideMenuTypes.OUTLET) &&
      opHoldItems.length > 0
    ) {
      const shape = opHoldItems[0];

      const newShape = {
        ...shape,
        index,
        config: {
          ...shape.config,
          x,
          y,
          selectable: true,
          draw: true,
        },
      };

      dispatch(
        editorShapeModule.actions.updateMapPresent({
          operation: ShapeOperations.ADD,
          present: [newShape],
        }),
      );

      return;
    }

    // ゴンドラ、網目エンド
    if (
      (selectedMenu === SideMenuTypes.GONDOLA ||
        selectedMenu === SideMenuTypes.MESH_END) &&
      opHoldItems.length > 0
    ) {
      const shape = opHoldItems[0];

      const areaId = constants.DEFAULT_AREA_ID;
      const tableId = shape.config.tableId;
      const branchNum = shape.config.branchNum;
      const locationNum = `${tableId}${branchNum}`;

      const newShape = {
        ...shape,
        index,
        config: {
          ...shape.config,
          areaId,
          tableId,
          branchNum,
          locationNum,
          displayLocationNum: EditorUtil.generateDisplayLocationNum(
            locationNum,
            preferences.locationDisplayFormatType,
            preferences.customFormats,
          ),
          x,
          y,
          selectable: true,
          draw: true,
        },
      };

      dispatch(
        editorShapeModule.actions.updateMapPresent({
          operation: ShapeOperations.ADD,
          present: [newShape],
        }),
      );

      return;
    }

    // エリア
    if (selectedMenu === SideMenuTypes.AREA && opHoldItems.length > 0) {
      const shape = opHoldItems[0];

      const node = editLayer.current?.findOne(`#${shape.config.uuid}`);
      if (node && node instanceof ShapeArea && isLineDrawing) {
        const nearStartPos =
          Math.abs(node.x() - x) <= 15 && Math.abs(node.y() - y) <= 15;

        if (
          node.points.length < 3 ||
          (!node.isLineMouseOverStartPoint() && !nearStartPos)
        ) {
          const startX = shape.config.x;
          const startY = shape.config.y;

          node.points = [...node.points, [x - startX, y - startY]];
        }
      } else {
        const newShape = {
          ...shape,
          index,
          config: {
            ...shape.config,
            x,
            y,
            isLineDrawing: true,
            points: [[0, 0]],
            closed: false,
            draw: true,
          },
        };

        dispatch(editorOpModule.actions.updateHoldItems([newShape]));
        dispatch(editorLineModule.actions.updateLineDrawing(true));
        dispatch(
          editorShapeModule.actions.updateEditShapes({
            operation: ShapeOperations.ADD,
            present: [newShape],
          }),
        );
      }
      return;
    }

    // 多角形
    if (selectedMenu === SideMenuTypes.POLYGON && opHoldItems.length > 0) {
      const shape = opHoldItems[0];

      const node = editLayer.current?.findOne(`#${shape.config.uuid}`);
      if (node && node instanceof ShapePolygon && isLineDrawing) {
        const nearStartPos =
          Math.abs(node.x() - x) <= 15 && Math.abs(node.y() - y) <= 15;

        if (
          node.points.length < 3 ||
          (!node.isLineMouseOverStartPoint() && !nearStartPos)
        ) {
          const startX = shape.config.x;
          const startY = shape.config.y;

          node.points = [...node.points, [x - startX, y - startY]];
        }
      } else {
        const newShape = {
          ...shape,
          index,
          config: {
            ...shape.config,
            x,
            y,
            isLineDrawing: true,
            points: [[0, 0]],
            closed: false,
            draw: true,
          },
        };

        dispatch(editorOpModule.actions.updateHoldItems([newShape]));
        dispatch(editorLineModule.actions.updateLineDrawing(true));
        dispatch(
          editorShapeModule.actions.updateEditShapes({
            operation: ShapeOperations.ADD,
            present: [newShape],
          }),
        );
      }
      return;
    }

    // Table, Wall
    if (
      (selectedMenu === SideMenuTypes.TABLE ||
        selectedMenu === SideMenuTypes.WALL) &&
      opHoldItems.length > 0
    ) {
      const newShapes: ShapeData[] = [];
      const ids: string[] = [];

      opHoldItems.forEach((d, i) => {
        ids.push(d.id);
        newShapes.push({
          ...d,
          index: index + i,
          config: {
            ...d.config,
            x: d.config.x + x,
            y: d.config.y + y,
            selectable: true,
            draw: true,
          },
        });
      });

      dispatch(
        editorShapeModule.actions.updateMapPresent({
          operation: ShapeOperations.ADD,
          present: newShapes,
        }),
      );
      return;
    }
  };

  const handleStageMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // 選択ツール
    if (selectedMenu === SideMenuTypes.SELECT_TOOL) {
      operationLayer.current?.dispatchEvent(e);
      return;
    }

    if (e.target !== stage.current) {
      const style = stage.current?.container().style;
      if (style!.cursor === 'default') {
        style!.cursor = 'crosshair';
      }
    }

    const pointerPosition = stage.current?.getRelativePointerPosition() ?? {
      x: 0,
      y: 0,
    };
    const x = Math.round(pointerPosition.x / latticeWidth) * latticeWidth;
    const y = Math.round(pointerPosition.y / latticeHeight) * latticeHeight;

    // ペン
    if (selectedMenu === SideMenuTypes.PEN && isLineDrawing) {
      const shape = opHoldItems[0];
      if (!shape?.config.draw) {
        return;
      }

      const node = editLayer.current?.findOne(`#${shape.id}`);

      const startX = shape.config.x;
      const startY = shape.config.y;

      const nextX = x - startX;
      const nextY = y - startY;

      if (node instanceof ShapePen) {
        node.points = node.points.concat([[nextX, nextY]]);
      }
      return;
    }

    // 線
    if (selectedMenu === SideMenuTypes.LINE) {
      const shape = opHoldItems[0];
      if (!shape?.config.draw) {
        return;
      }

      const node = editLayer.current?.findOne(`#${shape.id}`);

      const startX = shape.config.x;
      const startY = shape.config.y;

      const endX = x - startX;
      const endY = y - startY;

      const point2 = (() => {
        if (pressKeyShift) {
          const angle = Math.abs(Math.atan2(y - startY, x - startX));
          if ((angle > 0 && angle < 0.75) || (angle > 1.5 && angle < 3.14)) {
            return [endX, 0];
          } else if (angle > 0.75 && angle < 1.5) {
            return [0, endY];
          }
          return [endX, endY];
        }
        return [endX, endY];
      })();

      if (node instanceof ShapeLine) {
        const point1 = shape.config.points[0];
        node.config = {
          ...node.config,
          width: Math.abs(point2[0]),
          height: Math.abs(point2[1]),
          points: [point1, point2],
        };
      }
      return;
    }

    // 矢印１、矢印２
    if (
      selectedMenu === SideMenuTypes.ARROW1 ||
      selectedMenu === SideMenuTypes.ARROW2
    ) {
      const shape = opHoldItems[0];
      if (!shape?.config.draw) {
        return;
      }

      const node = editLayer.current?.findOne(`#${shape.id}`);
      if (node instanceof ShapeArrow) {
        node.points = [0, 0, x - shape.config.x, y - shape.config.y];
      }
      return;
    }

    // 四角系シェイプ
    if (
      selectedMenu === SideMenuTypes.RECT ||
      selectedMenu === SideMenuTypes.PILLAR ||
      selectedMenu === SideMenuTypes.RECT_TEXT ||
      selectedMenu === SideMenuTypes.SQUARE_TABLE ||
      selectedMenu === SideMenuTypes.REGISTER_TABLE ||
      selectedMenu === SideMenuTypes.FREE_TEXT
    ) {
      const shape = opHoldItems[0];
      if (!shape?.config.draw) {
        return;
      }

      const x1 = shape.config.x;
      const y1 = shape.config.y;

      const node = editLayer.current?.findOne(`#${shape.id}`);
      if (
        node instanceof ShapeRect ||
        node instanceof ShapeRectTable ||
        node instanceof ShapeRegister ||
        node instanceof ShapeFreeText
      ) {
        node.dragWidth(Math.abs(x1 - x));
        node.dragHeight(Math.abs(y1 - y));
      }
      return;
    }

    // 円系シェイプ
    if (
      selectedMenu === SideMenuTypes.ELLIPSE ||
      selectedMenu === SideMenuTypes.ELLIPSE_TEXT ||
      selectedMenu === SideMenuTypes.CIRCLE_TABLE
    ) {
      const shape = opHoldItems[0];
      if (!shape?.config.draw) {
        return;
      }

      const x1 = shape.config.x;
      const y1 = shape.config.y;

      const node = editLayer.current?.findOne(`#${shape.id}`);
      if (node instanceof ShapeEllipse || node instanceof ShapeEllipseTable) {
        node.dragRadiusX(Math.abs(x - x1));
        node.dragRadiusY(Math.abs(y - y1));
      }
      return;
    }
  };

  const handleStageMouseUp = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // 選択ツール
    if (selectedMenu === SideMenuTypes.SELECT_TOOL) {
      operationLayer.current?.dispatchEvent(e);
      return;
    }

    const scale = stageScale / 100;

    const pointerPosition = stage.current?.getPointerPosition() ?? {
      x: 0,
      y: 0,
    };
    const x =
      Math.round(pointerPosition.x / scale / latticeWidth) * latticeWidth;
    const y =
      Math.round(pointerPosition.y / scale / latticeHeight) * latticeHeight;

    // ペン
    if (selectedMenu === SideMenuTypes.PEN && isLineDrawing) {
      const shape = opHoldItems[0];

      const node = editLayer.current?.findOne(`#${shape.id}`);
      if (node instanceof ShapePen) {
        node.selectable = true;

        dispatch(
          editorShapeModule.actions.updateMapPresent({
            operation: ShapeOperations.ADD,
            present: [
              {
                ...shape,
                config: { ...node.config },
              },
            ],
          }),
        );
      }

      editLayer.current?.destroyChildren();
      dispatch(editorLineModule.actions.updateLineDrawing(false));
      dispatch(editorNodeModule.actions.updateSelectedNodeIds([shape.id]));
      dispatch(editorOpModule.actions.updateFinishOpHold(true));

      return;
    }

    // 線
    if (selectedMenu === SideMenuTypes.LINE) {
      const shape = opHoldItems[0];

      const node = editLayer.current?.findOne(`#${shape.id}`);
      if (node instanceof ShapeLine) {
        if (x === node.x() && y === node.y()) {
          node.destroy();
        } else {
          node.selectable = true;

          dispatch(
            editorShapeModule.actions.updateMapPresent({
              operation: ShapeOperations.ADD,
              present: [
                {
                  ...shape,
                  config: { ...node.config },
                },
              ],
            }),
          );
        }
      }

      editLayer.current?.destroyChildren();
      dispatch(editorNodeModule.actions.updateSelectedNodeIds([shape.id]));
      dispatch(editorOpModule.actions.updateFinishOpHold(true));

      return;
    }

    // 矢印１、矢印２
    if (
      selectedMenu === SideMenuTypes.ARROW1 ||
      selectedMenu === SideMenuTypes.ARROW2
    ) {
      const shape = opHoldItems[0];

      const node = editLayer.current?.findOne(`#${shape.id}`);
      if (node instanceof ShapeArrow) {
        if (node.x() === x && node.y() === y) {
          node.destroy();
        } else {
          node.selectable = true;

          dispatch(
            editorShapeModule.actions.updateMapPresent({
              operation: ShapeOperations.ADD,
              present: [
                {
                  ...shape,
                  config: { ...node.config },
                },
              ],
            }),
          );
        }
      }

      editLayer.current?.destroyChildren();
      dispatch(editorNodeModule.actions.updateSelectedNodeIds([shape.id]));
      dispatch(editorOpModule.actions.updateFinishOpHold(true));

      return;
    }

    // 四角系シェイプ
    if (
      selectedMenu === SideMenuTypes.RECT ||
      selectedMenu === SideMenuTypes.PILLAR ||
      selectedMenu === SideMenuTypes.RECT_TEXT ||
      selectedMenu === SideMenuTypes.SQUARE_TABLE ||
      selectedMenu === SideMenuTypes.REGISTER_TABLE ||
      selectedMenu === SideMenuTypes.FREE_TEXT ||
      selectedMenu === SideMenuTypes.CIRCLE
    ) {
      const shape = opHoldItems[0];

      const x1 = shape.config.x;
      const y1 = shape.config.y;

      const node = editLayer.current?.findOne(`#${shape.id}`);
      if (
        node instanceof ShapeRect ||
        node instanceof ShapeRectTable ||
        node instanceof ShapeRegister ||
        node instanceof ShapeFreeText
      ) {
        node.dragWidth(Math.abs(x1 - x));
        node.dragHeight(Math.abs(y1 - y));

        const width = !node.config.width
          ? node.config.minWidth
          : node.config.width < node.config.minWidth
            ? node.config.minWidth
            : node.config.width;

        const height = !node.config.height
          ? node.config.minHeight
          : node.config.height < node.config.minHeight
            ? node.config.minHeight
            : node.config.height;

        const widthCells = width / latticeWidth;
        const heightCells = height / latticeHeight;

        dispatch(
          editorShapeModule.actions.updateMapPresent({
            operation: ShapeOperations.ADD,
            present: [
              {
                ...shape,
                config: { ...node.config, widthCells, heightCells },
              },
            ],
          }),
        );
      }

      // for SQUARE_TABLE
      if (
        selectedMenu === SideMenuTypes.SQUARE_TABLE &&
        shape.config.locationType === LocationTypes.ISLAND
      ) {
        // 最後のテーブルIDを更新
        const maxTableId = Math.max(
          ...opHoldItems.map((d) => d.config.tableId),
        );
        dispatch(
          editorTableModule.actions.updateLatestTableId(Number(maxTableId)),
        );
      }

      // for REGISTER_TABLE
      if (
        selectedMenu === SideMenuTypes.REGISTER_TABLE &&
        shape.config.locationType === LocationTypes.REGISTER
      ) {
        // 最後のテーブルIDを更新
        const maxTableId = Math.max(
          ...opHoldItems.map((d) => d.config.tableId),
        );
        dispatch(
          editorIslandModule.actions.updateLatestRegisterTableId(maxTableId),
        );

        // 最後の枝番を更新
        const maxBranchNum = Math.max(
          ...opHoldItems.map((d) => d.config.branchNum),
        );
        dispatch(
          editorIslandModule.actions.updateLatestRegisterBranchNum(
            maxBranchNum,
          ),
        );
      }

      // for FREE_TEXT
      if (
        selectedMenu === SideMenuTypes.FREE_TEXT &&
        shape.config.locationType === LocationTypes.ISLAND
      ) {
        // 最後のテーブルIDを更新
        const maxTableId = Math.max(
          ...opHoldItems.map((d) => d.config.tableId),
        );
        dispatch(
          editorIslandModule.actions.updateLatestFreeTextTableId(maxTableId),
        );

        // 最後の枝番を更新
        const maxBranchNum = Math.max(
          ...opHoldItems.map((d) => d.config.branchNum),
        );
        dispatch(
          editorIslandModule.actions.updateLatestFreeTextBranchNum(
            maxBranchNum,
          ),
        );
      }

      // for All
      editLayer.current?.destroyChildren();
      dispatch(editorNodeModule.actions.updateSelectedNodeIds([shape.id]));
      dispatch(editorOpModule.actions.updateFinishOpHold(true));

      return;
    }

    // 円系シェイプ
    if (
      selectedMenu === SideMenuTypes.ELLIPSE ||
      selectedMenu === SideMenuTypes.ELLIPSE_TEXT ||
      selectedMenu === SideMenuTypes.CIRCLE_TABLE
    ) {
      const shape = opHoldItems[0];

      const x1 = shape.config.x;
      const y1 = shape.config.y;

      const node = editLayer.current?.findOne(`#${shape.id}`);

      // for ShapeEllipse or ShapeEllipseTable
      if (node instanceof ShapeEllipse || node instanceof ShapeEllipseTable) {
        node.dragRadiusX(Math.abs(x1 - x));
        node.dragRadiusY(Math.abs(y1 - y));

        dispatch(
          editorShapeModule.actions.updateMapPresent({
            operation: ShapeOperations.ADD,
            present: [
              {
                ...shape,
                config: { ...node.config },
              },
            ],
          }),
        );
      }

      // for CIRCLE_TABLE
      if (
        selectedMenu === SideMenuTypes.CIRCLE_TABLE &&
        shape.config.locationType === LocationTypes.ISLAND
      ) {
        const maxTableId = Math.max(
          ...opHoldItems.map((d) => d.config.tableId),
        );
        dispatch(
          editorTableModule.actions.updateLatestTableId(Number(maxTableId)),
        );
      }

      // for All
      editLayer.current?.destroyChildren();
      dispatch(editorNodeModule.actions.updateSelectedNodeIds([shape.id]));
      dispatch(editorOpModule.actions.updateFinishOpHold(true));

      return;
    }

    // 追加時にサイズ変更ができないシェイプ
    if (
      selectedMenu === SideMenuTypes.TEXT ||
      selectedMenu === SideMenuTypes.SPECIAL_SHAPE ||
      selectedMenu === SideMenuTypes.CIRCLE_ARROW ||
      selectedMenu === SideMenuTypes.WC ||
      selectedMenu === SideMenuTypes.REST_AREA ||
      selectedMenu === SideMenuTypes.OUTLET
    ) {
      const shape = opHoldItems[0];

      if (shape.config.locationType === LocationTypes.ISLAND) {
        const maxTableId = Math.max(
          ...opHoldItems.map((d) => d.config.tableId),
        );
        dispatch(
          editorTableModule.actions.updateLatestTableId(Number(maxTableId)),
        );
      }

      editLayer.current?.destroyChildren();
      dispatch(editorNodeModule.actions.updateSelectedNodeIds([shape.id]));
      dispatch(editorOpModule.actions.updateFinishOpHold(true));

      return;
    }

    // ゴンドラ、網目エンド
    if (
      selectedMenu === SideMenuTypes.GONDOLA ||
      selectedMenu === SideMenuTypes.MESH_END
    ) {
      const shape = opHoldItems[0];

      editLayer.current?.destroyChildren();
      dispatch(editorNodeModule.actions.updateSelectedNodeIds([shape.id]));
      dispatch(editorOpModule.actions.updateFinishOpHold(true));

      return;
    }

    // エリア
    if (selectedMenu === SideMenuTypes.AREA) {
      const shape = opHoldItems[0];

      const node = editLayer.current?.findOne(`#${shape.config.uuid}`);
      if (!node || !(node instanceof ShapeArea) || !isLineDrawing) {
        return;
      }
      const nearStartPos =
        Math.abs(node.x() - x) <= 15 && Math.abs(node.y() - y) <= 15;

      if (
        (node.isLineMouseOverStartPoint() || nearStartPos) &&
        node.points.length >= 3
      ) {
        node.config = {
          ...node.config,
          points: [...node.points, node.points[0]],
          isLineDrawing: false,
          selectable: true,
          closed: true,
        };

        // エリアIDを保持
        editLayer.current?.destroyChildren();
        dispatch(
          editorAreaModule.actions.updateLatestAreaId(
            Math.max(
              ...opHoldItems.map(({ config: { areaId } }) => Number(areaId)),
            ),
          ),
        );
        dispatch(editorLineModule.actions.updateLineDrawing(false));
        dispatch(editorNodeModule.actions.updateSelectedNodeIds([shape.id]));
        dispatch(editorOpModule.actions.updateFinishOpHold(true));
        dispatch(
          editorShapeModule.actions.updateMapPresent({
            operation: ShapeOperations.ADD,
            present: [
              {
                id: shape.id,
                config: { ...node.config },
              },
            ],
          }),
        );
      }
      return;
    }

    // 多角形
    if (selectedMenu === SideMenuTypes.POLYGON) {
      const shape = opHoldItems[0];

      const node = editLayer.current?.findOne(`#${shape.config.uuid}`);
      if (!node || !(node instanceof ShapePolygon) || !isLineDrawing) {
        return;
      }
      const nearStartPos =
        Math.abs(node.x() - x) <= 15 && Math.abs(node.y() - y) <= 15;

      if (
        (node.isLineMouseOverStartPoint() || nearStartPos) &&
        node.points.length >= 3
      ) {
        node.config = {
          ...node.config,
          points: [...node.points, node.points[0]],
          isLineDrawing: false,
          selectable: true,
          closed: true,
        };

        editLayer.current?.destroyChildren();
        dispatch(editorLineModule.actions.updateLineDrawing(false));
        dispatch(editorNodeModule.actions.updateSelectedNodeIds([shape.id]));
        dispatch(editorOpModule.actions.updateFinishOpHold(true));
        dispatch(
          editorShapeModule.actions.updateMapPresent({
            operation: ShapeOperations.ADD,
            present: [
              {
                id: shape.id,
                config: { ...node.config },
              },
            ],
          }),
        );
      }
      return;
    }

    // Table, Wall
    if (
      selectedMenu === SideMenuTypes.TABLE ||
      selectedMenu === SideMenuTypes.WALL
    ) {
      const maxTableId = Math.max(...opHoldItems.map((d) => d.config.tableId));
      const ids: string[] = opHoldItems.map((d: any) => d.id);

      // for Table
      if (selectedMenu === SideMenuTypes.TABLE) {
        dispatch(
          editorTableModule.actions.updateLatestTableId(Number(maxTableId)),
        );
      }

      // for Wall
      if (selectedMenu === SideMenuTypes.WALL) {
        const maxBranchNum = Math.max(
          ...opHoldItems.map((d) => d.config.branchNum),
        );

        // Front
        if (maxTableId === 81) {
          dispatch(
            editorWallModule.actions.updateLatestFrontWallBranchNum(
              maxBranchNum,
            ),
          );
        }
        // Left
        if (maxTableId === 82) {
          dispatch(
            editorWallModule.actions.updateLatestLeftWallBranchNum(
              maxBranchNum,
            ),
          );
        }
        // Back
        if (maxTableId === 83) {
          dispatch(
            editorWallModule.actions.updateLatestBackWallBranchNum(
              maxBranchNum,
            ),
          );
        }
        // Right
        if (maxTableId === 84) {
          dispatch(
            editorWallModule.actions.updateLatestRightWallBranchNum(
              maxBranchNum,
            ),
          );
        }
      }

      // for All
      editLayer.current?.destroyChildren();
      if (ids.length <= editorConstants.MAX_SELECTION_SHAPES) {
        // 追加数が選択上限数を超えていない場合は選択状態とする
        dispatch(editorNodeModule.actions.updateSelectedNodeIds(ids));
      }
      dispatch(editorOpModule.actions.updateFinishOpHold(true));

      return;
    }
  };

  /**
   * 自動保存処理
   */
  const autoSave = async () => {
    // 自動保存が解除されている場合は終了
    if (!isWaitingAutoSave) {
      return;
    }

    const { userId } = user;
    const { mapId, version } = editMapVersion;
    const storeKey = `${constants.STORAGE_KEY_EDITOR_DATA}.${userId}.${mapId}.${version}`;
    const unsavedDataKey = `${constants.STORAGE_KEY_EDITOR_UNSAVED_DATA}.${userId}.${mapId}.${version}`;

    // 現在の編集データ
    const currentShapeData = props.getCurrentShapeData();
    const currentLayoutData: LayoutData = {
      ...currentLayout,
      latestAreaId,
      latestTableId,
      ...wallState,
      ...islandState,
      areas: currentShapeData.area,
      maps: currentShapeData.map,
      preferences: {
        printSize: preferences.printSize,
        screenCaptureRange: preferences.screenCaptureRange,
        stageWidth: preferences.stageWidth,
        stageHeight: preferences.stageHeight,
        latticeWidth: preferences.latticeWidth,
        latticeHeight: preferences.latticeHeight,
      },
    };

    // 退避データ取得
    const saveData = (await EditorUtil.getStoreItem(storeKey)) as SaveData;

    // レイアウトデータ取得
    const layouts = await Promise.all(
      saveData?.layouts?.map(async (d) => {
        if (d.layoutId === currentLayoutData.layoutId) {
          return currentLayoutData;
        }
        return (await EditorUtil.getStoreItem(
          `${storeKey}.${d.layoutId}`,
        )) as LayoutData;
      }) ?? [currentLayoutData],
    );

    // 保存データ構築
    const data: SaveData = {
      ...saveData,
      layouts,
      note,
      preferences: {
        showLattice: preferences.enabledLattice,
        showRulers: preferences.enabledRulers,
        areaIdLength: preferences.areaIdLength,
        tableIdLength: preferences.tableIdLength,
        branchNumLength: preferences.branchNumLength,
        locationDisplayFormatType: preferences.locationDisplayFormatType,
        customFormats: preferences.customFormats,
        fontSize: preferences.fontSize,
      },
      editorVersion: packageInfo.version,
    };
    EditorUtil.updateStoreItem(storeKey, data);
    EditorUtil.updateStoreItem(
      `${storeKey}.${currentLayout.layoutId}`,
      currentLayoutData,
    );

    // 未保存データ更新
    EditorUtil.updateStoreItem(unsavedDataKey, true);

    // 自動保存待ち状態を更新
    dispatch(editorShapeModule.actions.updateWaitingAutoSave(false));
  };

  /**
   * マップの PDF 帳票を作成します.
   */
  const printPdf = (settings: MapPdfPrintSettings) => {
    if (!wrapper || !stage || !stage.current) {
      return;
    }

    const mimeType = 'image/jpeg';
    const quality = 0;
    const pixelRatio = 2;

    const wrapperRect = wrapper.current.getClientRects()[0];
    const { stageWidth, stageHeight } = preferences;

    const width =
      preferences.screenCaptureRange === ScreenCaptureRanges.STAGE
        ? stageWidth
        : wrapperRect.width > stageWidth
          ? stageWidth
          : wrapperRect.width;

    const height =
      preferences.screenCaptureRange === ScreenCaptureRanges.STAGE
        ? stageHeight
        : wrapperRect.height > stageHeight
          ? stageHeight
          : wrapperRect.height;

    const clientWidth = () => {
      const scaledStage = stageWidth * (stageScale / 100);
      if (scaledStage < wrapperRect.width) {
        return Math.max(scaledStage - wrapper.current.scrollLeft, 1);
      }

      // スクロール分を除いた幅を返却
      return wrapperRect.width - 20;
    };

    const clientHeight = () => {
      const scaledStage = stageHeight * (stageScale / 100);
      if (scaledStage < wrapperRect.height) {
        return Math.max(scaledStage - wrapper.current.scrollTop, 1);
      }

      // スクロール分を除いた高さを返却
      return wrapperRect.height - 20;
    };

    const option =
      preferences.screenCaptureRange === ScreenCaptureRanges.STAGE
        ? {
            mimeType,
            x: 0,
            y: 0,
            width,
            height,
            quality,
            pixelRatio,
          }
        : {
            mimeType,
            x: wrapper.current.scrollLeft,
            y: wrapper.current.scrollTop,
            width: clientWidth(),
            height: clientHeight(),
            quality,
            pixelRatio,
          };

    const imageSize = {
      width: option.width * pixelRatio,
      height: option.height * pixelRatio,
    };

    // キャプチャ用背景
    const background = new Konva.Rect({
      id: 'printBackground',
      listening: false,
      perfectDrawEnabled: false,
      strokeScaleEnabled: false,
      shadowForStrokeEnabled: false,
      hitStrokeWidth: 0,
      x: 0,
      y: 0,
      // ステージサイズ範囲外にズームが小さいほど広い余白を指定
      width: stageWidth * 1.5 * (100 / stageScale),
      height: stageHeight * 1.5 * (100 / stageScale),
      fill: 'rgba(255, 255, 255, 1)',
      strokeWidth: 0,
    });

    const areaLayer = stage.current
      .getLayers()
      .find((d: any) => d.id() === 'areaLayer');
    if (areaLayer && areaLayer.visible()) {
      // キャプチャ用背景追加
      areaLayer.add(background);
      background.moveToBottom();
    }

    // 印刷から除外するシェイプを非表示
    let excludeNodes: any[] = [];
    if (settings.outputMode === MapPdfOutputModes.STATEMENT_OF_DELIVERY) {
      const nodes =
        stage.current
          .getLayers()
          .find((d) => d.id() === 'mapLayer')
          ?.children?.filter(
            (node: any) => node.excludesPdfOutput() && node.getAttr('visible'),
          ) ?? [];
      excludeNodes.push(...nodes);
      excludeNodes.forEach((node: any) => node.setAttr('visible', false));
    }

    const { jurisdictionClass, companyCode, storeCode } = editMapVersion;

    const layoutName = currentLayout.layoutName.replace(/[\s　]+/g, '');

    const mapPdfData: MapPdfData = {
      ...(({
        jurisdictionClass,
        companyName,
        storeName,
        zipCode,
        address1,
        address2,
        addressDetail,
        tel,
        fax,
        inventorySchedule: { inventoryDates } = { inventoryDates: [] },
      }) => ({
        jurisdictionClass,
        companyName,
        storeName,
        zipCode,
        address1,
        address2,
        addressDetail,
        tel,
        fax,
        inventoryDates,
      }))(editMapVersion),
      layoutName: currentLayout.layoutName,
    };

    // 最新の日付けを取得する
    let latestDate = '';
    if (mapPdfData.inventoryDates.length > 0) {
      latestDate = mapPdfData.inventoryDates
        .reduce((latest, current) => (current > latest ? current : latest))
        .toString();
    }

    // ファイル名
    const filename =
      settings.outputMode === MapPdfOutputModes.STATEMENT_OF_DELIVERY
        ? `${latestDate}_${jurisdictionClass}_${companyCode}_${storeCode}_${layoutName}_layoutmap.pdf`
        : `${latestDate}_${jurisdictionClass}_${companyCode}_${storeCode}_${layoutName}_layoutmap_inv.pdf`;

    // PDF 化
    const createMapPdf = (props: MapPdfProps) => {
      // ヘッダー・フッターなし
      if (!settings.outputHeaderFooter) {
        return new MapPdf(props);
      }

      // ヘッダー・フッターあり
      if (settings.outputMode === MapPdfOutputModes.STATEMENT_OF_DELIVERY) {
        return new MapPdfStatementOfDelivery({ ...props, data: mapPdfData });
      } else if (settings.outputMode === MapPdfOutputModes.INVENTORY) {
        return new MapPdfInventory({ ...props, note });
      }
      return new MapPdf(props);
    };

    if (settings.rotation !== MapPdfRotations.NONE) {
      const degree = settings.rotation === MapPdfRotations.RIGHT ? 90 : -90;

      const canvas = document.createElement('canvas');
      canvas.width = option.height;
      canvas.height = option.width;

      const context = canvas.getContext('2d');

      // 印刷範囲のイメージをキャンバスに書き出してから回転して PDF 出力
      const image = new Image();
      image.src = stage.current.toDataURL(option);
      image
        .decode()
        .then(() => {
          if (!context) {
            return;
          }

          context.translate(canvas.width / 2, canvas.height / 2);
          context.rotate(degree * (Math.PI / 180));
          context.drawImage(
            image,
            -(canvas.height / 2),
            -(canvas.width / 2),
            canvas.height,
            canvas.width,
          );

          const pdf = createMapPdf({
            orientation: MapPdfOrientations.landscape,
            paperSize: preferences.printSize,
            imageData: canvas.toDataURL(mimeType),
            imageSize: { width: imageSize.height, height: imageSize.width },
            filename,
            language,
            timezone: user.timeZone,
          });
          pdf.build();
        })
        .finally(() => {
          canvas.remove();
        });
    } else {
      const pdf = createMapPdf({
        orientation: MapPdfOrientations.landscape,
        paperSize: preferences.printSize,
        imageData: stage.current.toDataURL(option),
        imageSize,
        filename,
        language,
        timezone: user.timeZone,
      });
      pdf.build();
    }

    // 印刷から除外するシェイプを復元
    excludeNodes.forEach((node: any) => node.setAttr('visible', true));

    // キャプチャ用背景削除
    if (areaLayer && areaLayer.visible()) {
      const printBackground = areaLayer.findOne('#printBackground');
      if (printBackground) {
        printBackground.destroy();
      }
    }
  };

  /**
   * 選択中のノードを全て選択解除します.
   */
  const unselectAllEditNode = () => {
    if (
      !editLayer.current ||
      (editNodeList.length === 0 && selectedNodeList.length === 0)
    ) {
      return;
    }

    // 編集レイヤーに存在するシェイプを元の場所に戻す
    if ((editLayer.current.children?.length ?? 0) > 0) {
      editNodeList.forEach((node: any) => node.fire('moveToParent'));
    }

    dispatch(editorNodeModule.actions.clearEditNodeList());
    dispatch(editorNodeModule.actions.clearSelectedNodes());
  };

  /**
   * 選択ノードを変更します.
   */
  const changeSelectedNodeIds = () => {
    if (!mapLayer.current || !editLayer.current || !areaLayer.current) {
      return;
    }

    // 選択対象シェイプが存在しない場合
    if (selectedNodeIds.length === 0) {
      unselectAllEditNode();
      return;
    }

    // 編集レイヤーに存在する未選択シェイプを戻す
    editLayer.current?.children
      ?.filter((node: any) => !selectedNodeIds.includes(node.attrs.uuid))
      .forEach((node: any) => node.fire('moveToParent'));

    // 選択ノード取得
    const mapNodes = (mapLayer.current.children ?? []).filter((node: any) =>
      selectedNodeIds.includes(node.uuid),
    );
    const areaNodes = (areaLayer.current.children ?? []).filter((node: any) =>
      selectedNodeIds.includes(node.uuid),
    );

    // 状態更新
    dispatch(
      editorNodeModule.actions.updateSelectedNodeList(
        mapNodes.concat(areaNodes),
      ),
    );

    if (
      selectedNodeIds.length > editorConstants.EDITABLE_MAX_SELECTION_SHAPES
    ) {
      // 選択シェイプ数が一括操作の最大数を超えている場合はレイヤー移動しない
      dispatch(
        editorNodeModule.actions.updateEditNodeList(mapNodes.concat(areaNodes)),
      );
    } else {
      // マップレイヤー上の選択シェイプを編集レイヤーへ移動
      const editNodes: any[] = mapNodes
        .concat(areaNodes)
        .map((node: any) => node.moveToContainer(editLayer.current));

      dispatch(editorNodeModule.actions.updateEditNodeList(editNodes));
    }
  };

  useEffect(() => {
    const style = stage.current?.container().style;

    if (selectedMenu === SideMenuTypes.SELECT_TOOL) {
      style!.cursor = 'default';
    } else {
      style!.cursor = 'crosshair';
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMenu]);

  useEffect(() => {
    if (finishOpHold) {
      dispatch(
        editorOpModule.actions.updateOp({
          selectedMenu: SideMenuTypes.SELECT_TOOL,
          opHoldItems: [],
          finishOpHold: false,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finishOpHold]);

  /**
   * シェイプ選択変更.
   */
  useEffect(() => {
    changeSelectedNodeIds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedNodeIds]);

  /**
   * スクロール位置変更.
   */
  useEffect(() => {
    if (!wrapper.current || !scrollPosition) {
      return;
    }

    wrapper.current.scrollTop = scrollPosition.top;
    wrapper.current.scrollLeft = scrollPosition.left;

    // リセット
    dispatch(editorModule.actions.updateScrollPosition(undefined));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollPosition]);

  useEffect(() => {
    if (!wrapper.current || !minSelectedNode) {
      return;
    }
    const scale = stageScale / 100;

    const clientRect = wrapper.current.getClientRects();

    const maxScrollLeft = wrapper.current.scrollWidth - clientRect[0].width;
    const scrollLeft = wrapper.current.scrollLeft;

    const targetX = minSelectedNode.config.x * scale;
    const width = minSelectedNode?.config?.width ?? 100;

    // 横スクロール：左側
    if (targetX + width < scrollLeft) {
      const newScrollLeft = targetX - 20;
      wrapper.current.scrollLeft = newScrollLeft < 0 ? 0 : newScrollLeft;
    }

    // 横スクロール：右側
    if (targetX > clientRect[0].width + scrollLeft) {
      const newScrollLeft = targetX + width - clientRect[0].width + 20;

      wrapper.current.scrollLeft =
        newScrollLeft > maxScrollLeft ? maxScrollLeft : newScrollLeft;
    }

    const maxScrollTop = wrapper.current.scrollHeight - clientRect[0].height;
    const scrollTop = wrapper.current.scrollTop;

    const targetY = minSelectedNode.config.y * scale;
    const height = minSelectedNode?.config?.height ?? 100;

    // 縦スクロール：上方向
    if (targetY + height < scrollTop) {
      const newScrollTop = targetY - 20;
      wrapper.current.scrollTop = newScrollTop < 0 ? 0 : newScrollTop;
    }

    // 縦スクロール：下方向
    if (targetY > clientRect[0].height + scrollTop) {
      const newScrollTop = targetY + height - clientRect[0].height + 20;

      wrapper.current.scrollTop =
        newScrollTop > maxScrollTop ? maxScrollTop : newScrollTop;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minSelectedNode]);

  useEffect(() => {
    destroyNodes(deleteNodeIds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteNodeIds]);

  /**
   * PDF 帳票作成.
   */
  useEffect(() => {
    if (!needsPrintPdf) {
      return;
    }

    // 選択解除
    changeSelectedNodeIds();

    // ロケーションメモアイコンの現在の状態を退避
    const currentVisibleRemarksIcon = visibleRemarksIcon;

    // 出力モードが納品モード、かつ表示状態の場合は非表示にする
    if (
      needsPrintPdf.outputMode === MapPdfOutputModes.STATEMENT_OF_DELIVERY &&
      currentVisibleRemarksIcon
    ) {
      dispatch(editorViewModule.actions.updateVisibleRemarksIcon(false));
    }

    // PDF 作成
    printPdf(needsPrintPdf);

    // ロケーションメモアイコンの状態を復元
    dispatch(
      editorViewModule.actions.updateVisibleRemarksIcon(
        currentVisibleRemarksIcon,
      ),
    );

    // 出力モードリセット
    dispatch(editorLayoutModule.actions.updatePrintPdf(undefined));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [needsPrintPdf]);

  /**
   * 保存データ更新指示検知
   */
  useEffect(() => {
    if (!needsRefreshSaveShapes) {
      return;
    }

    // 保存
    dispatch(
      editorShapeModule.actions.updateSaveShapes(props.getCurrentShapeData()),
    );
    dispatch(editorShapeModule.actions.needsRefreshSaveShapes(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [needsRefreshSaveShapes]);

  /**
   * 自動保存検知
   */
  useEffect(() => {
    if (!needsAutoSave) {
      return;
    }

    if (!SecurityUtil.hasAnyAuthority(user, [AuthorityTypes.MAP_EDIT])) {
      // 権限がなければ未保存および自動保存しない
      dispatch(editorShapeModule.actions.updateUnsavedData(false));
      dispatch(editorShapeModule.actions.updateWaitingAutoSave(false));

      return;
    }

    // 実行中の自動保存を削除
    clearTimeout(autoSaveTimeoutId);

    // 変更を検知してから設定時間後に自動保存
    const timeoutId = setTimeout(
      () => autoSave(),
      editorConstants.AUTOSAVE_TIMEOUT_MILLISECONDS,
    );
    setAutoSaveTimeoutId(timeoutId);

    return () => clearTimeout(autoSaveTimeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [needsAutoSave, editMapVersion]);

  /**
   * 保存処理完了時、自動保存が動作中の場合は解除
   */
  useEffect(() => {
    if (!hasUnsavedData) {
      dispatch(editorShapeModule.actions.updateWaitingAutoSave(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasUnsavedData]);

  /**
   * 自動保存を解除
   */
  useEffect(() => {
    if (!isWaitingAutoSave) {
      // 実行中の自動保存を削除
      clearTimeout(autoSaveTimeoutId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWaitingAutoSave]);

  return (
    <Component
      wrapperRef={wrapper}
      stageRef={stage}
      transformer={props.transformer}
      mapLayerRef={mapLayer}
      areaLayerRef={areaLayer}
      editLayerRef={editLayer}
      operationLayerRef={operationLayer}
      latticeWidth={latticeWidth}
      latticeHeight={latticeHeight}
      enabledLattice={enabledLattice}
      stageScale={stageScale}
      stageWidth={stageWidth}
      stageHeight={stageHeight}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      onScrollWrapper={handleScrollWrapper}
      onStageClick={handleStageClick}
      onStageMouseDown={handleStageMouseDown}
      onStageMouseMove={handleStageMouseMove}
      onStageMouseUp={handleStageMouseUp}
    />
  );
};
