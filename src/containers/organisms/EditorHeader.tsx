import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';

import * as constants from '../../constants/app';
import * as editorConstants from '../../constants/editor';
import * as routerConstants from '../../constants/router';

import {
  AuthorityTypes,
  ChangeIndexData,
  DialogTypes,
  DisplayOrderOperations,
  EditData,
  GondolaPlacements,
  Layout,
  LayoutData,
  RGBA,
  SaveData,
  ShapeData,
  ShapeOperations,
  SideMenuTypes,
  StageScale,
  StageScales,
} from '../../types';
import { EditorUtil, SecurityUtil } from '../../utils';

import { MapData, MapSaveCondition, MapShapeData } from '../../api';
import { useAppDispatch } from '../../app/hooks';

import {
  actionHelper,
  compare,
  saveMapData,
  unlockEditMap,
  verifyAuthentication,
} from '../../actions';
import {
  appModule,
  editorLayoutModule,
  editorModule,
  editorNodeModule,
  editorPreferenceModule,
  editorShapeModule,
  editorViewModule,
} from '../../modules';
import {
  useAddAreaLatestAreaId,
  useAddTableLatestTableId,
  useCurrentLayout,
  useCurrentLayoutId,
  useEditMapVersion,
  useEditorIslandState,
  useEditorPreferenceState,
  useEditorWallState,
  useExclusiveLocked,
  useHasUnsavedData,
  useInventoryNote,
  useLayoutTabs,
  useLocationNodes,
  useMapHistory,
  useMapHistoryIndex,
  useNeedsSaveShapes,
  useOthersExclusiveLocked,
  useSaveShapes,
  useSelectedNodeIds,
  useSelectedNodeList,
  useStageScale,
  useUser,
  useVisibleMenu,
  useWaitingAutoSave,
} from '../../selectors';

import { EditorHeader as Component } from '../../components/organisms';
import {
  InventoryOperationDateSearch,
  MapEditorExcelImport,
  MapEditorLocationCsvOutput,
  MapEditorNote,
  MapEditorPreference,
} from '../pages';

import packageInfo from '../../../package.json';

type SelectedCountData = {
  jurisdictionClass: string;
  jurisdictionName: string;
  companyCode: string;
  companyName: string;
  storeCode: string;
  storeName: string;
  inventoryDate: Date;
};

interface Props {
  getCurrentShapeData(): EditData;
  undo: () => void;
  redo: () => void;
  handleStageScale: (scale: StageScale, value?: number) => void;
}

/**
 * マップエディタ：ヘッダー
 *
 * @param props プロパティ
 * @returns {React.ReactElement} ReactElement
 */
export const EditorHeader = (props: Props) => {
  const { undo, redo } = props;

  const navigate = useNavigate();
  const location = useLocation();

  const dispatch = useAppDispatch();
  const [t] = useTranslation();

  const user = useUser();

  const editMapVersion = useEditMapVersion();
  const layoutTabs = useLayoutTabs();
  const locationNodes = useLocationNodes();
  const currentLayoutId = useCurrentLayoutId();
  const isExclusiveLocked = useExclusiveLocked();
  const isOthersExclusiveLocked = useOthersExclusiveLocked();

  const saveShapes = useSaveShapes();
  const needsSaveShapes = useNeedsSaveShapes();

  const hasUnsavedData = useHasUnsavedData();

  const note = useInventoryNote();
  const preferences = useEditorPreferenceState();

  const stageScale = useStageScale();
  const visibleMenu = useVisibleMenu();

  const currentLayout = useCurrentLayout();

  const mapHistory = useMapHistory();
  const mapHistoryIndex = useMapHistoryIndex();

  const latestAreaId = useAddAreaLatestAreaId();
  const latestTableId = useAddTableLatestTableId();
  const wallState = useEditorWallState();
  const islandState = useEditorIslandState();

  const selectedNodeIds = useSelectedNodeIds();
  const selectedNodeList = useSelectedNodeList();

  const waitingAutoSave = useWaitingAutoSave();

  const [stateHistories, setStateHistories] = useState<any[]>([]);
  const [enableBackButton, setEnableBackButton] = useState<boolean>(false);

  const [isExcelImportOpen, setExcelImportOpen] = useState(false);
  const [
    isInventoryOperationDateSearchOpen,
    setInventoryOperationDateSearchOpen,
  ] = useState(false);
  const [isCsvOutputOpen, setIsCsvOutputOpen] = useState(false);
  const [isNoteOpen, setNoteOpen] = useState(false);
  const [isPreferenceOpen, setPreferenceOpen] = useState(false);

  // CSV 出力可能なレイアウト
  const [csvOutputableLayouts, setCsvOutputableLayouts] = useState<
    ({ locations: any[] } & Layout)[]
  >([]);

  const latestLayoutLocations = useCallback(async () => {
    const { userId } = user;
    const { mapId, version } = editMapVersion;
    if (!userId || !mapId || version === 0) {
      return [];
    }

    const storeKey = `${constants.STORAGE_KEY_EDITOR_DATA}.${userId}.${mapId}.${version}`;
    // 現在のレイアウト以外
    const otherLayouts = await Promise.all(
      layoutTabs
        .filter(({ layoutId }) => layoutId !== currentLayoutId)
        .map(({ layoutId }) => `${storeKey}.${layoutId}`)
        .map(async (key) => (await EditorUtil.getStoreItem(key)) as LayoutData),
    );

    return (
      layoutTabs
        .map(({ layoutId }) => {
          // 現在のレイアウトは最新のロケーションを返却
          if (layoutId === currentLayoutId) {
            return { ...currentLayout, locations: locationNodes };
          }
          const otherLayout = otherLayouts.find(
            ({ layoutId: otherLayoutId }) => layoutId === otherLayoutId,
          );
          return {
            ...(otherLayout as Layout),
            locations:
              otherLayout?.maps
                .map(({ config }) => config)
                .filter((config) =>
                  config.hasOwnProperty(
                    editorConstants.SHAPE_PROP_NAME_LOCATION_NUM,
                  ),
                ) ?? [],
          };
        })
        .map((layout) => ({
          ...layout,
          // 欠番、空白を除いたロケーションに絞込み
          locations: layout.locations.filter(
            (config) => !config.missingNumber && !config.emptyNumber,
          ),
        }))
        // ロケーションが存在するレイアウトに絞込み
        .filter(({ locations }) => locations.length !== 0)
    );
  }, [
    editMapVersion,
    layoutTabs,
    user,
    currentLayoutId,
    currentLayout,
    locationNodes,
  ]);

  const openExcelImport = useCallback(() => setExcelImportOpen(true), []);
  const openInventoryOperationDateSearch = () =>
    setInventoryOperationDateSearchOpen(true);
  const openCsvOutput = useCallback(async () => {
    setCsvOutputableLayouts(await latestLayoutLocations());
    setIsCsvOutputOpen(true);
  }, [latestLayoutLocations]);
  const openNote = useCallback(() => setNoteOpen(true), []);
  const openPreference = useCallback(() => setPreferenceOpen(true), []);

  const closeExcelImport = useCallback(() => setExcelImportOpen(false), []);
  const closeInventoryOperationDateSearch = useCallback(
    () => setInventoryOperationDateSearchOpen(false),
    [],
  );
  const closeCsvOutput = useCallback(() => setIsCsvOutputOpen(false), []);
  const closeNote = useCallback(() => setNoteOpen(false), []);
  const closePreference = useCallback(() => setPreferenceOpen(false), []);

  const [selectedInventoryOperationDate, setSelectedInventoryOperationDate] =
    useState<SelectedCountData>();
  const selectInventoryOperationDateSearch = (data: SelectedCountData) => {
    setSelectedInventoryOperationDate({
      jurisdictionClass: data.jurisdictionClass,
      jurisdictionName: data.jurisdictionName,
      companyCode: data.companyCode,
      companyName: data.companyName,
      storeCode: data.storeCode,
      storeName: data.storeName,
      inventoryDate: data.inventoryDate,
    });
    closeInventoryOperationDateSearch();
  };

  /**
   * ハンバーガー押下
   */
  const handleClickHamburger = () => {
    dispatch(editorViewModule.actions.updateVisibleMenu(!visibleMenu));
  };

  /**
   * 戻るボタン押下.
   */
  const handleClickBack = useCallback(async () => {
    // 選択シェイプ全解除
    dispatch(editorNodeModule.actions.clearSelectedNodeIds());

    dispatch(appModule.actions.updateLoading(true));

    await dispatch(
      verifyAuthentication(() => {
        // 編集ロック解除
        if (
          SecurityUtil.hasAnyAuthority(user, [AuthorityTypes.MAP_EDIT]) &&
          isExclusiveLocked
        ) {
          dispatch(unlockEditMap({ ...editMapVersion }));
        }

        // 戻る（遅延実行）
        setTimeout(() => {
          if (stateHistories.length > 0) {
            const { referer } = stateHistories.slice(-1)[0];
            navigate(referer, { state: { stateHistories }, replace: true });
            return;
          }
          navigate(-1);
        }, 1);
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExclusiveLocked, editMapVersion, stateHistories]);

  /**
   * 保存ボタン押下
   */
  const handleClickSave = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.stopPropagation();

    dispatch(
      verifyAuthentication(() => {
        dispatch(editorNodeModule.actions.clearSelectedNodeIds());
        dispatch(editorShapeModule.actions.needsRefreshSaveShapes(true));
        dispatch(editorShapeModule.actions.needsSaveShapes(true));
      }),
    );
  };

  /**
   * 元に戻すボタン押下
   */
  const handleClickUndo = useCallback(undo, [undo]);

  /**
   * 元に戻すの取り消しボタン押下
   */
  const handleClickRedo = useCallback(redo, [redo]);

  /**
   * 表示順序変更：最前面へ
   */
  const handleClickShapeToForeground = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.stopPropagation();

    const past: ChangeIndexData[] = [];
    const present: ChangeIndexData[] = selectedNodeList.map((node: any) => {
      past.push({
        id: node.id(),
        index: node.index,
        config: { ...node.config },
        order: DisplayOrderOperations.MOVE_TO_TOP,
      });
      node.moveToTop();

      return {
        id: node.id(),
        index: node.index,
        config: { ...node.config },
        order: DisplayOrderOperations.MOVE_TO_TOP,
      };
    });

    // Undo リストに追加依頼
    dispatch(
      editorShapeModule.actions.updateMapPresent({
        operation: ShapeOperations.CHANGE_INDEX,
        past,
        present,
      }),
    );
  };

  /**
   * 表示順序変更：前面へ
   */
  const handleClickShapeToFront = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.stopPropagation();

    const past: ShapeData[] = [];
    const present: ChangeIndexData[] = selectedNodeList.map((node: any) => {
      past.push({
        id: node.id(),
        index: node.index,
        config: { ...node.config },
      });
      node.moveUp();

      return {
        id: node.id(),
        index: node.index,
        config: { ...node.config },
        order: DisplayOrderOperations.MOVE_UP,
      };
    });

    // Undo リストに追加依頼
    dispatch(
      editorShapeModule.actions.updateMapPresent({
        operation: ShapeOperations.CHANGE_INDEX,
        past,
        present,
      }),
    );
  };

  /**
   * 表示順序変更：背面へ
   */
  const handleClickShapeToBack = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.stopPropagation();

    const past: ShapeData[] = [];
    const present: ChangeIndexData[] = selectedNodeList.map((node: any) => {
      past.push({
        id: node.id(),
        index: node.index,
        config: { ...node.config },
      });
      node.moveDown();

      return {
        id: node.id(),
        index: node.index,
        config: { ...node.config },
        order: DisplayOrderOperations.MOVE_DOWN,
      };
    });

    // Undo リストに追加依頼
    dispatch(
      editorShapeModule.actions.updateMapPresent({
        operation: ShapeOperations.CHANGE_INDEX,
        past,
        present,
      }),
    );
  };

  /**
   * 表示順序変更：最背面へ
   */
  const handleClickShapeToBackmost = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.stopPropagation();

    const past: ShapeData[] = [];
    const present: ChangeIndexData[] = selectedNodeList.map((node: any) => {
      past.push({
        id: node.id(),
        index: node.index,
        config: { ...node.config },
      });
      node.moveToBottom();

      return {
        id: node.id(),
        index: node.index,
        config: { ...node.config },
        order: DisplayOrderOperations.MOVE_TO_BOTTOM,
      };
    });

    // Undo リストに追加依頼
    dispatch(
      editorShapeModule.actions.updateMapPresent({
        operation: ShapeOperations.CHANGE_INDEX,
        past,
        present,
      }),
    );
  };

  /**
   * 編集ロック取得・解除ボタン押下.
   */
  const handleClickExclusiveLock = async (lock: boolean) => {
    dispatch(appModule.actions.updateLoading(true));

    await dispatch(
      verifyAuthentication(async () => {
        await dispatch(editorModule.actions.updateExclusiveLock(lock));

        dispatch(appModule.actions.updateLoading(false));
      }),
    );
  };

  /**
   * マップエディタ上で利用可能な型に変換します.
   */
  const toShapeData = (
    data: MapShapeData,
    cellWidth: number,
    cellHeight: number,
    tableIdLength: number,
    branchNumLength: number,
  ): ShapeData[] => {
    const svgShapes: ShapeData[] = [];

    const locationNumLength = tableIdLength + branchNumLength;

    const width = data.width;
    const height = data.height;

    const strokeRgb: RGBA = {
      r: data.strokeRgb?.red ?? 0,
      g: data.strokeRgb?.green ?? 0,
      b: data.strokeRgb?.blue ?? 0,
      a: data.strokeRgb?.alpha ?? 1,
    };
    const fillRgb: RGBA = {
      r: data.fillRgb?.red ?? 255,
      g: data.fillRgb?.green ?? 255,
      b: data.fillRgb?.blue ?? 255,
      a: data.fillRgb?.alpha ?? 1,
    };

    const strokeDash = data.strokeDash;

    const locationNum = data.locationNum
      ? `${data.locationNum}`.padStart(locationNumLength, '0')
      : '0'.repeat(locationNumLength);
    const showFullLocationNum =
      `${data.locationNum}`.length === locationNumLength;
    const tableId = locationNum?.slice(0, tableIdLength);
    const branchNum = locationNum?.slice(-branchNumLength);

    const id = uuidv4();

    if (data.shape === SideMenuTypes.GONDOLA) {
      const placement =
        height > width
          ? GondolaPlacements.VERTICAL
          : GondolaPlacements.HORIZONTAL;

      svgShapes.push({
        id,
        config: {
          uuid: id,
          shape: SideMenuTypes.GONDOLA,
          areaId: data.areaId ?? constants.DEFAULT_AREA_ID,
          tableId: tableId ?? constants.DEFAULT_TABLE_ID,
          branchNum: branchNum ?? '1'.padStart(branchNumLength, '0'),
          x: data.x,
          y: data.y,
          width,
          height,
          strokeWidth: 1,
          stroke: `rgba(${strokeRgb.r}, ${strokeRgb.g}, ${strokeRgb.b}, ${strokeRgb.a})`,
          strokeRgb,
          strokeDash,
          fill: `rgba(${fillRgb.r}, ${fillRgb.g}, ${fillRgb.b}, ${fillRgb.a})`,
          fillRgb,
          rotation: 0,
          locationNum,
          displayLocationNum: EditorUtil.generateDisplayLocationNum(
            locationNum,
            preferences.locationDisplayFormatType,
            preferences.customFormats,
          ),
          showFullLocationNum,
          widthCells: width / cellWidth,
          heightCells: height / cellHeight,
          placement,
          text: '',
          remarks: '',
          missingNumber: false,
          emptyNumber: false,
          selectable: true,
          draw: true,
          visible: true,
          disabled: false,
        },
      });
    } else if (data.shape === SideMenuTypes.MESH_END) {
      const placement =
        height > width
          ? GondolaPlacements.VERTICAL
          : GondolaPlacements.HORIZONTAL;

      const direction = data.direction;

      svgShapes.push({
        id,
        config: {
          uuid: id,
          shape: SideMenuTypes.MESH_END,
          areaId: data.areaId ?? constants.DEFAULT_AREA_ID,
          tableId: tableId ?? constants.DEFAULT_TABLE_ID,
          branchNum: branchNum ?? '1'.padStart(branchNumLength, '0'),
          x: data.x,
          y: data.y,
          width,
          height,
          strokeWidth: 1,
          stroke: `rgba(${strokeRgb.r}, ${strokeRgb.g}, ${strokeRgb.b}, ${strokeRgb.a})`,
          strokeRgb,
          fill: `rgba(${fillRgb.r}, ${fillRgb.g}, ${fillRgb.b}, ${fillRgb.a})`,
          fillRgb,
          rotation: 0,
          locationNum,
          displayLocationNum: EditorUtil.generateDisplayLocationNum(
            locationNum,
            preferences.locationDisplayFormatType,
            preferences.customFormats,
          ),
          showFullLocationNum,
          widthCells: width / cellWidth,
          heightCells: height / cellHeight,
          placement,
          direction,
          text: '',
          remarks: '',
          missingNumber: false,
          emptyNumber: false,
          selectable: true,
          draw: true,
          visible: true,
          disabled: false,
        },
      });
    } else if (data.shape === SideMenuTypes.FREE_TEXT) {
      svgShapes.push({
        id,
        config: {
          uuid: id,
          shape: SideMenuTypes.FREE_TEXT,
          areaId: data.areaId ?? constants.DEFAULT_AREA_ID,
          tableId: tableId ?? constants.DEFAULT_TABLE_ID,
          branchNum: branchNum ?? '1'.padStart(branchNumLength, '0'),
          x: data.x,
          y: data.y,
          width,
          height,
          minWidth: cellWidth,
          minHeight: cellHeight,
          missingNumber: false,
          emptyNumber: false,
          strokeWidth: 1,
          stroke: `rgba(${strokeRgb.r}, ${strokeRgb.g}, ${strokeRgb.b}, ${strokeRgb.a})`,
          strokeRgb,
          strokeDash,
          fill: `rgba(${fillRgb.r}, ${fillRgb.g}, ${fillRgb.b}, ${fillRgb.a})`,
          fillRgb,
          rotation: 0,
          locationNum,
          displayLocationNum: EditorUtil.generateDisplayLocationNum(
            locationNum,
            preferences.locationDisplayFormatType,
            preferences.customFormats,
          ),
          showFullLocationNum,
          widthCells: width / cellWidth,
          heightCells: height / cellHeight,
          text: data.text,
          selectable: false,
          draw: false,
          visible: true,
          disabled: false,
        },
      });
    } else if (data.shape === SideMenuTypes.RECT_TEXT) {
      svgShapes.push({
        id,
        config: {
          uuid: id,
          shape: SideMenuTypes.RECT_TEXT,
          x: data.x,
          y: data.y,
          width: data.width,
          height: data.height,
          minWidth: cellWidth,
          minHeight: cellHeight,
          text: data.text,
          strokeWidth: 1,
          stroke: `rgba(${strokeRgb.r}, ${strokeRgb.g}, ${strokeRgb.b}, ${strokeRgb.a})`,
          strokeRgb,
          strokeDash,
          fill: `rgba(${fillRgb.r}, ${fillRgb.g}, ${fillRgb.b}, ${fillRgb.a})`,
          fillRgb,
          rotation: 0,
          selectable: true,
          draw: true,
          visible: true,
          disabled: false,
        },
      });
    } else if (data.shape === SideMenuTypes.PILLAR) {
      svgShapes.push({
        id,
        config: {
          uuid: id,
          shape: SideMenuTypes.PILLAR,
          x: data.x,
          y: data.y,
          width: data.width,
          height: data.height,
          minWidth: cellWidth,
          minHeight: cellHeight,
          strokeWidth: 1,
          stroke: `rgba(${strokeRgb.r}, ${strokeRgb.g}, ${strokeRgb.b}, ${strokeRgb.a})`,
          strokeRgb,
          fill: `rgba(${fillRgb.r}, ${fillRgb.g}, ${fillRgb.b}, ${fillRgb.a})`,
          fillRgb,
          rotation: 0,
          selectable: true,
          draw: true,
          visible: true,
          disabled: false,
        },
      });
    } else if (data.shape === SideMenuTypes.RECT) {
      svgShapes.push({
        id,
        config: {
          uuid: id,
          shape: SideMenuTypes.RECT,
          x: data.x,
          y: data.y,
          width: data.width,
          height: data.height,
          minWidth: cellWidth,
          minHeight: cellHeight,
          strokeWidth: 1,
          stroke: `rgba(${strokeRgb.r}, ${strokeRgb.g}, ${strokeRgb.b}, ${strokeRgb.a})`,
          strokeRgb,
          strokeDash,
          fill: `rgba(${fillRgb.r}, ${fillRgb.g}, ${fillRgb.b}, ${fillRgb.a})`,
          fillRgb,
          rotation: 0,
          selectable: true,
          draw: true,
          visible: true,
          disabled: false,
        },
      });
    } else if (data.shape === SideMenuTypes.ARROW1) {
      const points = [0, 0, data.x2, data.y2];

      svgShapes.push({
        id,
        config: {
          uuid: id,
          shape: SideMenuTypes.ARROW1,
          x: data.x,
          y: data.y,
          points,
          pointerLength: 4,
          pointerWidth: 5,
          pointerAtBeginning: false,
          pointerAtEnding: true,
          strokeWidth: 9,
          stroke: `rgba(${strokeRgb.r}, ${strokeRgb.g}, ${strokeRgb.b}, ${strokeRgb.a})`,
          strokeRgb,
          rotation: 0,
          selectable: true,
          draw: true,
          visible: true,
          disabled: false,
        },
      });
    } else if (data.shape === SideMenuTypes.ARROW2) {
      const points = [0, 0, data.x2, data.y2];

      svgShapes.push({
        id,
        config: {
          uuid: id,
          shape: SideMenuTypes.ARROW2,
          x: data.x,
          y: data.y,
          points,
          pointerLength: 4,
          pointerWidth: 5,
          pointerAtBeginning: true,
          pointerAtEnding: true,
          strokeWidth: 9,
          stroke: `rgba(${strokeRgb.r}, ${strokeRgb.g}, ${strokeRgb.b}, ${strokeRgb.a})`,
          strokeRgb,
          rotation: 0,
          selectable: true,
          draw: true,
          visible: true,
          disabled: false,
        },
      });
    } else if (data.shape === SideMenuTypes.CIRCLE_ARROW) {
      svgShapes.push({
        id,
        config: {
          uuid: id,
          shape: SideMenuTypes.CIRCLE_ARROW,
          x: data.x,
          y: data.y,
          rotation: data.rotation,
          flipHorizontal: data.flipHorizontal,
          selectable: true,
          draw: true,
          visible: true,
          disabled: false,
        },
      });
    } else if (data.shape === SideMenuTypes.CIRCLE_TABLE) {
      const ellipseFillR: number = data.fillRgb?.red ?? 255;
      const ellipseFillG: number = data.fillRgb?.green ?? 255;
      const ellipseFillB: number = data.fillRgb?.blue ?? 255;
      const ellipseFillA: number = data.fillRgb?.alpha ?? 0;

      const ellipseStrokeRgb: RGBA = { r: 0, g: 0, b: 0, a: 1 };
      const ellipseFillRgb: RGBA = {
        r: ellipseFillR,
        g: ellipseFillG,
        b: ellipseFillB,
        a: ellipseFillA,
      };

      svgShapes.push({
        id,
        config: {
          uuid: id,
          shape: SideMenuTypes.CIRCLE_TABLE,
          areaId: constants.DEFAULT_AREA_ID,
          tableId,
          branchNum,
          x: data.x,
          y: data.y,
          minRadiusX: 20,
          minRadiusY: 20,
          radiusX: data.width / 2,
          radiusY: data.height / 2,
          missingNumber: false,
          emptyNumber: false,
          strokeWidth: 1,
          stroke: `rgba(${ellipseStrokeRgb.r}, ${ellipseStrokeRgb.g}, ${ellipseStrokeRgb.b}, ${ellipseStrokeRgb.a})`,
          strokeRgb: ellipseStrokeRgb,
          strokeDash,
          fill: `rgba(${ellipseFillRgb.r}, ${ellipseFillRgb.g}, ${ellipseFillRgb.b}, ${ellipseFillRgb.a})`,
          fillRgb: ellipseFillRgb,
          rotation: 0,
          locationNum,
          displayLocationNum: EditorUtil.generateDisplayLocationNum(
            locationNum,
            preferences.locationDisplayFormatType,
            preferences.customFormats,
          ),
          showFullLocationNum,
          selectable: false,
          draw: false,
          visible: true,
          disabled: false,
        },
      });
    } else if (data.shape === SideMenuTypes.ELLIPSE_TEXT) {
      const ellipseFillR: number = data.fillRgb?.red ?? 255;
      const ellipseFillG: number = data.fillRgb?.green ?? 255;
      const ellipseFillB: number = data.fillRgb?.blue ?? 255;
      const ellipseFillA: number = data.fillRgb?.alpha ?? 0;

      const ellipseStrokeRgb: any = { r: 0, g: 0, b: 0, a: 1 };
      const ellipseFillRgb: any = {
        r: ellipseFillR,
        g: ellipseFillG,
        b: ellipseFillB,
        a: ellipseFillA,
      };

      svgShapes.push({
        id,
        config: {
          uuid: id,
          shape: SideMenuTypes.ELLIPSE_TEXT,
          x: data.x,
          y: data.y,
          minRadiusX: 20,
          minRadiusY: 20,
          radiusX: data.width / 2,
          radiusY: data.height / 2,
          strokeWidth: 1,
          stroke: `rgba(${ellipseStrokeRgb.r}, ${ellipseStrokeRgb.g}, ${ellipseStrokeRgb.b}, ${ellipseStrokeRgb.a})`,
          strokeRgb: ellipseStrokeRgb,
          strokeDash,
          fill: `rgba(${ellipseFillRgb.r}, ${ellipseFillRgb.g}, ${ellipseFillRgb.b}, ${ellipseFillRgb.a})`,
          fillRgb: ellipseFillRgb,
          rotation: 0,
          text: data.text,
          selectable: true,
          draw: true,
          visible: true,
          disabled: false,
        },
      });
    } else if (data.shape === SideMenuTypes.ELLIPSE) {
      const ellipseFillR: number = data.fillRgb?.red ?? 255;
      const ellipseFillG: number = data.fillRgb?.green ?? 255;
      const ellipseFillB: number = data.fillRgb?.blue ?? 255;
      const ellipseFillA: number = data.fillRgb?.alpha ?? 0;

      const ellipseStrokeRgb: RGBA = { r: 0, g: 0, b: 0, a: 1 };
      const ellipseFillRgb: RGBA = {
        r: ellipseFillR,
        g: ellipseFillG,
        b: ellipseFillB,
        a: ellipseFillA,
      };

      svgShapes.push({
        id,
        config: {
          uuid: id,
          shape: SideMenuTypes.ELLIPSE,
          x: data.x,
          y: data.y,
          minRadiusX: 20,
          minRadiusY: 20,
          radiusX: data.width / 2,
          radiusY: data.height / 2,
          strokeWidth: 1,
          stroke: `rgba(${ellipseStrokeRgb.r}, ${ellipseStrokeRgb.g}, ${ellipseStrokeRgb.b}, ${ellipseStrokeRgb.a})`,
          strokeRgb: ellipseStrokeRgb,
          strokeDash,
          fill: `rgba(${ellipseFillRgb.r}, ${ellipseFillRgb.g}, ${ellipseFillRgb.b}, ${ellipseFillRgb.a})`,
          fillRgb: ellipseFillRgb,
          rotation: 0,
          selectable: true,
          draw: true,
          visible: true,
          disabled: false,
        },
      });
    } else if (data.shape === SideMenuTypes.TEXT) {
      const fillRgb: any = { r: 0, g: 0, b: 0, a: 1 };

      svgShapes.push({
        id,
        config: {
          uuid: id,
          shape: SideMenuTypes.TEXT,
          x: data.x,
          y: data.y,
          fontSize: 12,
          fill: `rgba(${fillRgb.r}, ${fillRgb.g}, ${fillRgb.b}, ${fillRgb.a})`,
          fillRgb,
          rotation: 0,
          text: data.text,
          selectable: true,
          draw: true,
          visible: true,
          disabled: false,
        },
      });
    }
    return svgShapes;
  };

  /**
   * Excel 取込データ変換後処理.
   */
  const handleClickExcelImport = useCallback(
    (mapData: MapData) => {
      const {
        sheetName,
        width,
        height,
        cellWidth,
        cellHeight,
        tableIdLength,
        branchNumLength,
        message,
      } = mapData;

      const svgShapes: ShapeData[] = [];
      mapData.excelShapes.forEach((data: MapShapeData) =>
        svgShapes.push(
          ...toShapeData(
            data,
            cellWidth,
            cellHeight,
            tableIdLength,
            branchNumLength,
          ),
        ),
      );

      // for All
      dispatch(editorShapeModule.actions.clearState());
      dispatch(editorNodeModule.actions.clearState());

      dispatch(editorModule.actions.updateStageScale(100));
      dispatch(
        editorPreferenceModule.actions.updateLattice({
          width: cellWidth,
          height: cellHeight,
        }),
      );
      dispatch(
        editorPreferenceModule.actions.updateStageSize({ width, height }),
      );
      dispatch(
        editorPreferenceModule.actions.updateIdLength({
          tableIdLength,
          branchNumLength,
        }),
      );
      dispatch(
        editorShapeModule.actions.updateMapPresent({
          operation: ShapeOperations.ADD,
          present: svgShapes,
        }),
      );
      dispatch(editorLayoutModule.actions.updateLayoutName(sheetName));

      if (message) {
        dispatch(
          appModule.actions.updateAlertDialog({
            type: DialogTypes.INFORMATION,
            message,
          }),
        );
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [preferences],
  );

  const downloadCsv = async (locations: any[]) => {
    const { companyCode, storeCode } = editMapVersion;

    const records = new Set<string>();
    locations.forEach((config) => {
      const record: string[] = [];

      record.push(config.areaId);
      record.push('');
      record.push(config.locationNum);
      record.push('');

      records.add(record.join(','));
    });

    const csv = Array.from(records).sort().join('\n');
    const data = `data:text/csv;charset=utf-8,${csv}`;
    const filename = `${companyCode}-${storeCode}LocShelfCheck.csv`;

    await EditorUtil.downloadFile(data, filename);
  };

  // CSV 出力
  const handleClickDownloadCsv = async (layoutIds: string[]) => {
    dispatch(appModule.actions.updateLoading(true));

    const selectedLayoutLocations = csvOutputableLayouts
      .filter(({ layoutId }) => layoutIds.includes(layoutId))
      .flatMap(({ locations }) => locations);

    await downloadCsv(selectedLayoutLocations);

    dispatch(appModule.actions.updateLoading(false));
  };

  /**
   * マップデータ保存処理.
   */
  useEffect(() => {
    if (!needsSaveShapes) {
      return;
    }

    (async () => {
      dispatch(appModule.actions.updateLoading(true));

      const currentLayoutData: LayoutData = {
        ...currentLayout,
        latestAreaId,
        latestTableId,
        ...wallState,
        ...islandState,
        areas: saveShapes.area,
        maps: saveShapes.map,
        preferences: {
          printSize: preferences.printSize,
          screenCaptureRange: preferences.screenCaptureRange,
          stageWidth: preferences.stageWidth,
          stageHeight: preferences.stageHeight,
          latticeWidth: preferences.latticeWidth,
          latticeHeight: preferences.latticeHeight,
        },
      };

      const { userId } = user;
      const { mapId, version } = editMapVersion;
      const storeKey = `${constants.STORAGE_KEY_EDITOR_DATA}.${userId}.${mapId}.${version}`;

      // 退避データ取得
      const saveData = (await EditorUtil.getStoreItem(storeKey)) as SaveData;

      // レイアウトデータ取得
      const layouts = await Promise.all(
        saveData.layouts.map(async (d) => {
          if (d.layoutId === currentLayoutData.layoutId) {
            return currentLayoutData;
          }
          return (await EditorUtil.getStoreItem(
            `${storeKey}.${d.layoutId}`,
          )) as LayoutData;
        }),
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

      // 保存データ退避
      await EditorUtil.updateStoreItem(storeKey, data);

      // 保存
      const condition: MapSaveCondition = {
        mapId: editMapVersion.mapId,
        version: editMapVersion.version,
        rowVersion: editMapVersion.rowVersion,
        data,
      };

      await dispatch(
        saveMapData(
          condition,
          async (result) => {
            // マップ版数情報更新
            dispatch(
              editorModule.actions.updateEditMapSaveResult({
                ...result.data,
              }),
            );

            // 未保存状態更新
            dispatch(editorShapeModule.actions.updateUnsavedData(false));

            // 成功メッセージ出力
            dispatch(
              appModule.actions.updateAlertDialog({
                type: DialogTypes.INFORMATION,
                message: t(
                  'organisms:EditorHeader.message.saveMapData.success',
                ),
              }),
            );

            dispatch(appModule.actions.updateLoading(false));
          },
          ({ e, result }) => {
            if (result) {
              // 失敗メッセージ出力
              dispatch(
                appModule.actions.updateAlertDialog({
                  type: DialogTypes.ERROR,
                  message: `${result?.error}`,
                }),
              );

              dispatch(appModule.actions.updateLoading(false));
            } else {
              actionHelper.showErrorDialog(e, dispatch);
            }
          },
        ),
      );

      // 自動保存解除
      dispatch(editorShapeModule.actions.updateWaitingAutoSave(false));

      // 状態更新
      dispatch(editorShapeModule.actions.needsSaveShapes(false));
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saveShapes]);

  /**
   * 未保存データ状態更新.
   */
  useEffect(() => {
    const { userId } = user;
    const { mapId, version } = editMapVersion;
    if (!userId || !mapId || version === 0) {
      return;
    }

    // 未保存データ更新
    const unsavedDataKey = `${constants.STORAGE_KEY_EDITOR_UNSAVED_DATA}.${userId}.${mapId}.${version}`;
    EditorUtil.updateStoreItem(unsavedDataKey, hasUnsavedData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasUnsavedData, editMapVersion]);

  /**
   * 拡大・縮小の値を更新.
   */
  const scale = useMemo(() => stageScale, [stageScale]);

  /**
   * Load, Unload 処理
   */
  useEffect(() => {
    const histories = location?.state?.stateHistories ?? [];
    if (histories.length === 0) {
      return;
    }

    const { referer, payload } = histories.slice(-1)[0];
    setEnableBackButton(!!referer);

    if (payload?.condition && referer === location.pathname) {
      const prevHistories = histories.slice(0, -1);
      setEnableBackButton(prevHistories.length !== 0);

      setStateHistories(prevHistories);
    } else {
      setStateHistories(histories);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ロケーション比較結果一覧を表示
  useEffect(() => {
    if (!selectedInventoryOperationDate) {
      return;
    }

    const { map: latestMaps } = props.getCurrentShapeData();

    (async () => {
      dispatch(appModule.actions.updateLoading(true));

      const { userId } = user;
      const { mapId, version } = editMapVersion;
      const storeKey = `${constants.STORAGE_KEY_EDITOR_DATA}.${userId}.${mapId}.${version}`;

      const layouts = await Promise.all(
        layoutTabs.map(
          async (d) =>
            (await EditorUtil.getStoreItem(
              `${storeKey}.${d.layoutId}`,
            )) as LayoutData,
        ),
      );

      const locations = layouts
        .map((layout) => {
          if (layout.layoutId === currentLayout.layoutId) {
            return { ...layout, maps: latestMaps };
          }
          return layout;
        })
        .flatMap(({ maps }) => maps)
        .filter(({ config: { tableId } }) => tableId)
        .map(({ config: { areaId, locationNum } }) => ({
          areaId,
          locationNum,
        }));

      const newLocation = (({
        jurisdictionClass,
        companyCode,
        storeCode,
        inventorySchedule,
      }) => ({
        jurisdictionClass,
        companyCode,
        storeCode,
        inventoryDates: inventorySchedule?.inventoryDates,
        locations,
      }))(editMapVersion);

      const oldLocation = (({
        jurisdictionClass,
        companyCode,
        storeCode,
        inventoryDate,
      }) => ({
        jurisdictionClass,
        companyCode,
        storeCode,
        inventoryDate,
      }))(selectedInventoryOperationDate);

      const parameters = { newLocation, oldLocation };
      setSelectedInventoryOperationDate(undefined);

      await dispatch(
        compare(
          parameters,
          ({ data }) => {
            dispatch(appModule.actions.updateLoading(false));

            window.open(
              `${routerConstants.PATH_COMPARE_LOCATIONS}/${data}`,
              '_blank',
              `noopener,width=1200px,height=800px,left=${window.screenX},top=${window.screenY}`,
            );
          },
          ({ e, result }) => {
            if (result) {
              dispatch(
                appModule.actions.updateAlertDialog({
                  type: DialogTypes.ERROR,
                  message: `${result?.error}`,
                }),
              );

              dispatch(appModule.actions.updateLoading(false));
            } else {
              actionHelper.showErrorDialog(e, dispatch);
            }
          },
        ),
      );
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedInventoryOperationDate]);

  return (
    <>
      <Component
        selectedNodeIds={selectedNodeIds}
        stageScale={scale}
        enableBackButton={enableBackButton}
        waitingAutoSave={waitingAutoSave}
        onClickHamburger={handleClickHamburger}
        onClickBack={handleClickBack}
        onClickSave={handleClickSave}
        onClickUndo={handleClickUndo}
        onClickRedo={handleClickRedo}
        canSave={
          SecurityUtil.hasAnyAuthority(user, [AuthorityTypes.MAP_EDIT]) &&
          !isOthersExclusiveLocked &&
          isExclusiveLocked
        }
        canExcelImport={SecurityUtil.hasAnyAuthority(user, [
          AuthorityTypes.MAP_EXCEL_IMPORT,
        ])}
        canLocationCompare={SecurityUtil.hasAnyAuthority(user, [
          AuthorityTypes.MAP_LOCATION_COMPARE,
        ])}
        canUndo={mapHistoryIndex > 0}
        canRedo={mapHistoryIndex < mapHistory.length - 1}
        onClickShapeToForeground={handleClickShapeToForeground}
        onClickShapeToFront={handleClickShapeToFront}
        onClickShapeToBack={handleClickShapeToBack}
        onClickShapeToBackmost={handleClickShapeToBackmost}
        onClickScaleUp={() => props.handleStageScale(StageScales.UP)}
        onClickScaleDown={() => props.handleStageScale(StageScales.DOWN)}
        onClickScaleReset={() => props.handleStageScale(StageScales.RESET)}
        onChangeStageScale={(e: number) =>
          props.handleStageScale(StageScales.DIRECT, e)
        }
        onClickShowExcelImport={openExcelImport}
        onClickEditorNote={openNote}
        onClickLocationComparation={openInventoryOperationDateSearch}
        onClickDownloadCsv={openCsvOutput}
        canExclusiveLock={SecurityUtil.hasAnyAuthority(user, [
          AuthorityTypes.MAP_EDIT,
        ])}
        isExclusiveLocked={isExclusiveLocked}
        isOthersExclusiveLocked={isOthersExclusiveLocked}
        onClickExclusiveLock={handleClickExclusiveLock}
        onClickEditorPreferences={openPreference}
        hasUnsavedData={hasUnsavedData}
      />
      <MapEditorExcelImport
        isOpen={isExcelImportOpen}
        onRequestClose={closeExcelImport}
        onSuccess={handleClickExcelImport}
      />
      <InventoryOperationDateSearch
        isOpen={isInventoryOperationDateSearchOpen}
        onRequestClose={closeInventoryOperationDateSearch}
        onClickSelect={selectInventoryOperationDateSearch}
      />
      <MapEditorLocationCsvOutput
        isOpen={isCsvOutputOpen}
        onRequestClose={closeCsvOutput}
        onSuccess={handleClickDownloadCsv}
        selectableLayouts={csvOutputableLayouts}
      />
      <MapEditorNote isOpen={isNoteOpen} onRequestClose={closeNote} />
      <MapEditorPreference
        isOpen={isPreferenceOpen}
        onRequestClose={closePreference}
      />
    </>
  );
};
