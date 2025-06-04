import Konva from 'konva';
import { useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import * as constants from '../../constants/app';
import * as editorConstants from '../../constants/editor';

import { useAppDispatch } from '../../app/hooks';
import {
  AlertDialogData,
  AuthorityTypes,
  DialogTypes,
  EditData,
  Layout,
  LayoutData,
  MapPdfPaperSizes,
  SaveData,
  ScreenCaptureRanges,
  ShapeData,
  ShapeOperations,
  SideMenuTypes,
  StageRegulationSizes,
  StageScale,
  StageScales,
} from '../../types';

import {
  actionHelper,
  lockEditMap,
  searchMapVersion,
  unlockEditMap,
} from '../../actions';
import {
  appModule,
  editorAreaModule,
  editorDragModule,
  editorHistoryModule,
  editorIslandModule,
  editorKeyModule,
  editorLayerModule,
  editorLineModule,
  editorModule,
  editorNodeModule,
  editorOpModule,
  editorPreferenceModule,
  editorShapeModule,
  editorTableModule,
  editorViewModule,
  editorWallModule,
} from '../../modules';
import {
  useAreaIdLength,
  useBranchNumLength,
  useChangeNodeList,
  useCurrentLayoutId,
  useCustomFormats,
  useEditMapVersion,
  useEditorPreferenceState,
  useEnabledLattice,
  useEnabledRulers,
  useExclusiveLocked,
  useInventoryNote,
  useLayoutTabs,
  useLocationDisplayFormatType,
  useOpHoldItems,
  useOthersExclusiveLocked,
  useStageScale,
  useTableIdLength,
  useUser,
} from '../../selectors';

import * as api from '../../api';
import { MapEditor as Component } from '../../components/pages/MapEditor';
import { EditorUtil } from '../../utils/EditorUtil';

import packageInfo from '../../../package.json';
import { SecurityUtil } from '../../utils/SecurityUtil';

/**
 * マップエディター画面
 */
export const MapEditor = () => {
  const dispatch = useAppDispatch();
  const [t] = useTranslation();

  const { mapId = '', version = '1' } = useParams<{
    mapId: string;
    version: string;
  }>();

  const user = useUser();

  const transformer = useRef<Konva.Transformer>(null);

  const editMapVersion = useEditMapVersion();
  const layoutTabs = useLayoutTabs();
  const currentLayoutId = useCurrentLayoutId();
  const isExclusiveLocked = useExclusiveLocked();
  const isOthersExclusiveLocked = useOthersExclusiveLocked();

  const changeNodeList = useChangeNodeList();

  const opHoldItems = useOpHoldItems();

  const enabledRulers = useEnabledRulers();
  const note = useInventoryNote();
  const preferences = useEditorPreferenceState();

  const showLattice = useEnabledLattice();
  const showRulers = useEnabledRulers();
  const areaIdLength = useAreaIdLength();
  const tableIdLength = useTableIdLength();
  const branchNumLength = useBranchNumLength();
  const locationDisplayFormatType = useLocationDisplayFormatType();
  const customFormats = useCustomFormats();
  const stageScale = useStageScale();

  const rulerX = useRef<any>(null);
  const rulerY = useRef<any>(null);

  const mapLayer = useRef<Konva.Layer>(null);
  const areaLayer = useRef<Konva.Layer>(null);
  const editLayer = useRef<Konva.Layer>(null);

  /**
   * ステージの拡大率を変更します.
   *
   * @param scale 拡大率操作種別
   * @param value 拡大率
   */
  const handleStageScale = useCallback(
    (scale: StageScale, value?: number) => {
      const newValue = ((current: number) => {
        if (scale === StageScales.UP) {
          // 拡大
          if (current < 150) {
            return current + 10;
          }
          return current;
        } else if (scale === StageScales.DOWN) {
          // 縮小
          if (current > 20) {
            return current - 10;
          }
          return current;
        } else if (scale === StageScales.RESET) {
          // リセット
          return 100;
        } else if (scale === StageScales.DIRECT && value) {
          // 直接指定
          return value;
        }
        return current;
      })(stageScale);

      // 選択シェイプ全解除
      dispatch(editorNodeModule.actions.clearSelectedNodeIds());
      if (opHoldItems.length === 0) {
        dispatch(editorOpModule.actions.updateFinishOpHold(true));
      }

      // 拡大率変更（遅延実行）
      setTimeout(
        () => dispatch(editorModule.actions.updateStageScale(newValue)),
        1,
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [stageScale],
  );

  /**
   * ノードリスト更新.
   */
  const refreshNodeList = async () => {
    const maps =
      mapLayer.current?.children?.map((node: any) => node.config) ?? [];
    const areas =
      areaLayer.current?.children?.map((node: any) => node.config) ?? [];

    dispatch(editorNodeModule.actions.updateNodeConfigList(maps.concat(areas)));
  };

  // 元に戻す
  const undo = () => {
    dispatch(editorNodeModule.actions.clearSelectedNodeIds());
    dispatch(editorShapeModule.actions.undo());
    if (opHoldItems.length === 0) {
      dispatch(editorOpModule.actions.updateFinishOpHold(true));
    }
  };

  // やり直し
  const redo = () => {
    dispatch(editorNodeModule.actions.clearSelectedNodeIds());
    dispatch(editorShapeModule.actions.redo());
    if (opHoldItems.length === 0) {
      dispatch(editorOpModule.actions.updateFinishOpHold(true));
    }
  };

  /**
   * シェイプデータを取得.
   */
  const getCurrentShapeData = (): EditData => {
    if (!mapLayer.current || !areaLayer.current || !editLayer.current) {
      return { map: [], area: [] };
    }

    const map: any[] = [];
    const area: any[] = [];

    // マップレイヤー
    mapLayer.current.children?.forEach((node: any) =>
      map.push({ id: node.uuid, config: { ...node.config } }),
    );

    // エリアレイヤー
    areaLayer.current.children?.forEach((node: any) =>
      area.push({ id: node.uuid, config: { ...node.config } }),
    );

    return { map, area };
  };

  /**
   * 全ノード削除.
   */
  const destroyAllNodes = () => {
    // 編集レイヤー
    editLayer.current?.destroyChildren();

    // マップレイヤー
    mapLayer.current?.destroyChildren();

    // エリアレイヤー
    areaLayer.current?.destroyChildren();

    // 選択ノードクリア
    dispatch(editorNodeModule.actions.clearSelectedNodes());
    dispatch(editorNodeModule.actions.clearEditNodeList());
    dispatch(editorNodeModule.actions.clearNodeConfigList());
  };

  /**
   * @returns デフォルトのレイアウト
   */
  const defaultLayout = (): LayoutData => ({
    layoutId: uuidv4(),
    layoutName: '1F',
    latestAreaId: 0,
    latestTableId: 0,
    latestFrontWallBranchNum: 0,
    latestLeftWallBranchNum: 0,
    latestBackWallBranchNum: 0,
    latestRightWallBranchNum: 0,
    latestRegisterTableId: 85,
    latestRegisterBranchNum: 0,
    latestFreeTextTableId: 60,
    latestFreeTextBranchNum: 0,
    areas: [],
    maps: [],
    preferences: {
      printSize: MapPdfPaperSizes.A4,
      screenCaptureRange: ScreenCaptureRanges.STAGE,
      stageWidth: EditorUtil.stageRegulationSizeToPixel(
        StageRegulationSizes.VERY_SMALL,
      ).width,
      stageHeight: EditorUtil.stageRegulationSizeToPixel(
        StageRegulationSizes.VERY_SMALL,
      ).height,
      latticeWidth: 5,
      latticeHeight: 5,
    },
  });

  /**
   * タブをリセット.
   */
  const resetTab = (mapId: string, version: number) => {
    const { userId } = user;

    const layout = defaultLayout();

    const saveData: SaveData = {
      mapId,
      version,
      layouts: [layout],
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

    // IndexedDB へ退避
    const storeKey = `${constants.STORAGE_KEY_EDITOR_DATA}.${userId}.${mapId}.${version}`;
    EditorUtil.updateStoreItem(storeKey, saveData);

    // 新しいレイアウトデータを退避
    EditorUtil.updateStoreItem(`${storeKey}.${layout.layoutId}`, layout);

    // 採番IDの設定
    dispatch(editorAreaModule.actions.updateLatestAreaId(layout.latestAreaId));
    dispatch(
      editorTableModule.actions.updateLatestTableId(layout.latestTableId),
    );
    dispatch(editorWallModule.actions.updateLatestWallBranchNum({ ...layout }));
    dispatch(editorIslandModule.actions.updateLatestIds({ ...layout }));

    // レイアウト一覧の復元
    dispatch(editorModule.actions.updateLayoutTabs([layout]));

    // 選択レイアウト
    dispatch(editorModule.actions.updateCurrentLayout({ ...layout }));
  };

  /**
   * 未保存データの存在チェック.
   */
  const checkUnsavedData = async (
    mapId: string,
    version: number,
    data: SaveData,
  ) => {
    const { userId } = user;
    const unsavedDataKey = `${constants.STORAGE_KEY_EDITOR_UNSAVED_DATA}.${userId}.${mapId}.${version}`;

    const unsaved = (await EditorUtil.getStoreItem(unsavedDataKey)) as boolean;
    if (!unsaved) {
      // マップデータ読込み
      await loadMapData(mapId, version, data);

      // 未保存状態更新
      dispatch(editorShapeModule.actions.updateUnsavedData(false));
      return;
    }

    // 未保存データの復元確認
    const alertDialogData: AlertDialogData = {
      type: DialogTypes.CONFIRM,
      message: t('pages:MapEditor.message.confirm.unsavedData'),
      positiveAction: async () => {
        dispatch(appModule.actions.updateLoading(true));

        // 未保存データから状態を復元
        await loadUnsavedData();

        // 未保存状態更新
        dispatch(editorShapeModule.actions.updateUnsavedData(true));

        dispatch(appModule.actions.updateLoading(false));
      },
      negativeAction: async () => {
        dispatch(appModule.actions.updateLoading(true));

        // マップデータ読込み
        await loadMapData(mapId, version, data);

        // 未保存状態更新
        dispatch(editorShapeModule.actions.updateUnsavedData(false));

        dispatch(appModule.actions.updateLoading(false));
      },
    };
    dispatch(appModule.actions.updateAlertDialog(alertDialogData));
  };

  /**
   * 未保存データを復元.
   */
  const loadUnsavedData = async () => {
    const { userId } = user;
    const storeKey = `${constants.STORAGE_KEY_EDITOR_DATA}.${userId}.${mapId}.${version}`;

    // 未保存データ取得
    const unsavedData = (await EditorUtil.getStoreItem(storeKey)) as SaveData;

    // レイアウトデータ取得
    const layouts = await Promise.all(
      unsavedData.layouts.map(async (d) => {
        return (await EditorUtil.getStoreItem(
          `${storeKey}.${d.layoutId}`,
        )) as LayoutData;
      }),
    );

    // レイアウト一覧
    const layoutTabs: Layout[] = layouts.map((layout) => {
      return { ...layout };
    });

    // 選択レイアウト
    const newCurrentLayout = (await EditorUtil.getStoreItem(
      `${storeKey}.${layoutTabs[0].layoutId}`,
    )) as LayoutData;

    // 環境設定
    const newPreferences = {
      ...unsavedData.preferences,
      ...newCurrentLayout.preferences,
      enabledLattice: unsavedData.preferences.showLattice,
      enabledRulers: unsavedData.preferences.showRulers,
      printSize: newCurrentLayout.preferences.printSize,
    };

    // Redux state 更新
    if (newCurrentLayout) {
      // 採番IDの復元
      dispatch(
        editorAreaModule.actions.updateLatestAreaId(
          newCurrentLayout.latestAreaId,
        ),
      );
      dispatch(
        editorTableModule.actions.updateLatestTableId(
          newCurrentLayout.latestTableId,
        ),
      );
      dispatch(
        editorWallModule.actions.updateLatestWallBranchNum({
          ...newCurrentLayout,
        }),
      );
      dispatch(
        editorIslandModule.actions.updateLatestIds({ ...newCurrentLayout }),
      );

      // マップの復元
      const areas = newCurrentLayout.areas ?? [];
      const maps = newCurrentLayout.maps ?? [];

      dispatch(
        editorShapeModule.actions.updateMapHistory({
          operation: ShapeOperations.ADD,
          present: areas.concat(maps),
        }),
      );
    }

    // 棚卸メモ
    dispatch(editorModule.actions.updateInventoryNote(unsavedData.note));

    // 環境設定の復元
    dispatch(editorPreferenceModule.actions.updatePreference(newPreferences));

    // レイアウト一覧の復元
    dispatch(editorModule.actions.updateLayoutTabs(layoutTabs));

    // 選択レイアウト
    dispatch(editorModule.actions.updateCurrentLayout(newCurrentLayout));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  /**
   * DB データを復元.
   */
  const loadMapData = (mapId: string, version: number, data: SaveData) => {
    if (data.layouts.length === 0) {
      // レイアウトを初期化
      resetTab(mapId, version);

      // 環境設定
      const newPreferences = {
        ...preferences,
        ...data.preferences,
        enabledLattice: data.preferences?.showLattice ?? true,
        enabledRulers: data.preferences?.showRulers ?? true,
      };

      // Redux state 更新
      dispatch(editorPreferenceModule.actions.updatePreference(newPreferences));

      return;
    }
    const { userId } = user;

    // IndexedDB へ退避
    const storeKey = `${constants.STORAGE_KEY_EDITOR_DATA}.${userId}.${mapId}.${version}`;

    // Layouts のエリアとマップを除外する
    const layouts = data.layouts.map((d) => ({ ...d, areas: [], maps: [] }));

    // 基本データを保存
    EditorUtil.updateStoreItem(storeKey, { ...data, layouts });

    // レイアウト毎にデータを分割保存
    data.layouts.forEach((d) =>
      EditorUtil.updateStoreItem(`${storeKey}.${d.layoutId}`, { ...d }),
    );

    // レイアウト
    const layoutTabs: Layout[] = data.layouts.map((layout) => {
      return { ...layout };
    });

    // 選択レイアウト
    const layout: Layout = layoutTabs[0];

    // 環境設定
    const newPreferences = {
      ...data.preferences,
      ...layout.preferences,
      enabledLattice: data.preferences.showLattice,
      enabledRulers: data.preferences.showRulers,
    };

    // Redux state 更新
    // エリア、マップ
    const layoutData = data.layouts.find((d) => d.layoutId === layout.layoutId);

    if (layoutData) {
      const areas = layoutData.areas ?? [];
      const maps = layoutData.maps ?? [];

      // 採番IDの復元
      dispatch(
        editorAreaModule.actions.updateLatestAreaId(
          layoutData.latestAreaId ?? 0,
        ),
      );
      dispatch(
        editorTableModule.actions.updateLatestTableId(
          layoutData.latestTableId ?? 0,
        ),
      );
      dispatch(
        editorWallModule.actions.updateLatestWallBranchNum({
          latestFrontWallBranchNum: layoutData.latestFrontWallBranchNum ?? 0,
          latestLeftWallBranchNum: layoutData.latestLeftWallBranchNum ?? 0,
          latestBackWallBranchNum: layoutData.latestBackWallBranchNum ?? 0,
          latestRightWallBranchNum: layoutData.latestRightWallBranchNum ?? 0,
        }),
      );
      dispatch(
        editorIslandModule.actions.updateLatestIds({
          latestRegisterTableId: layoutData.latestRegisterTableId ?? 85,
          latestRegisterBranchNum: layoutData.latestRegisterBranchNum ?? 0,
          latestFreeTextTableId: layoutData.latestFreeTextTableId ?? 60,
          latestFreeTextBranchNum: layoutData.latestFreeTextBranchNum ?? 0,
        }),
      );

      // マップの復元
      dispatch(
        editorShapeModule.actions.updateMapHistory({
          operation: ShapeOperations.ADD,
          present: areas.concat(maps),
        }),
      );
    }

    // 棚卸メモ
    dispatch(editorModule.actions.updateInventoryNote(data.note));

    // 環境設定の復元
    dispatch(editorPreferenceModule.actions.updatePreference(newPreferences));

    // レイアウト一覧の復元
    dispatch(editorModule.actions.updateLayoutTabs(layoutTabs));

    // 選択レイアウト
    dispatch(editorModule.actions.updateCurrentLayout(layout));
  };

  /**
   * 全ての状態をリセット.
   */
  const resetAllState = () => {
    dispatch(editorModule.actions.clearState());
    dispatch(editorAreaModule.actions.clearState());
    dispatch(editorDragModule.actions.clearState());
    dispatch(editorHistoryModule.actions.clearState());
    dispatch(editorIslandModule.actions.clearState());
    dispatch(editorKeyModule.actions.clearState());
    dispatch(editorLayerModule.actions.clearState());
    dispatch(editorLineModule.actions.clearState());
    dispatch(editorNodeModule.actions.clearState());
    dispatch(editorOpModule.actions.clearState());
    dispatch(editorPreferenceModule.actions.clearState());
    dispatch(editorShapeModule.actions.clearState());
    dispatch(editorTableModule.actions.clearState());
    dispatch(editorViewModule.actions.clearState());
    dispatch(editorWallModule.actions.clearState());
  };

  /**
   * ウィンドウ（タブ）アンロードイベント
   */
  const handleBeforeUnloadEvent = (e: BeforeUnloadEvent): void => {
    e.preventDefault();

    dispatch(editorModule.actions.updateExclusiveLock(false));
  };

  /**
   * エリアID、ロケーション番号の再定義.
   */
  const redefinitionIdLength = (data: ShapeData): ShapeData => {
    const newData: any = {};

    // エリアIDが存在する場合かつ、エリアIDが空でない場合
    if (
      data.config.hasOwnProperty(editorConstants.SHAPE_PROP_NAME_AREA_ID) &&
      data.config.areaId
    ) {
      if (areaIdLength === 0) {
        newData.areaId = '';
      } else {
        const areaId =
          data.config.areaId.length > areaIdLength
            ? data.config.areaId.slice(-areaIdLength)
            : `${Number(data.config.areaId)}`.padStart(areaIdLength, '0');

        newData.areaId = areaId;
      }
    }

    // ロケーション番号が存在する場合
    if (
      data.config.hasOwnProperty(editorConstants.SHAPE_PROP_NAME_LOCATION_NUM)
    ) {
      const tableId =
        data.config.tableId.length > tableIdLength
          ? data.config.tableId.slice(-tableIdLength)
          : isNaN(data.config.tableId)
            ? `${data.config.tableId}`.padStart(tableIdLength, 'A')
            : `${Number(data.config.tableId)}`.padStart(tableIdLength, '0');

      const branchNum =
        data.config.branchNum.length > branchNumLength
          ? data.config.branchNum.slice(-branchNumLength)
          : `${Number(data.config.branchNum)}`.padStart(branchNumLength, '0');

      const locationNum = `${tableId}${branchNum}`;

      // 表示用ロケーション番号を再作成
      const displayLocationNum = EditorUtil.generateDisplayLocationNum(
        locationNum,
        preferences.locationDisplayFormatType,
        customFormats,
      );

      newData.tableId = tableId;
      newData.branchNum = branchNum;
      newData.locationNum = locationNum;
      newData.displayLocationNum = displayLocationNum;
    }

    // 値を返却
    return { ...data, config: { ...data.config, ...newData } };
  };

  /**
   * エリアID桁数、テーブルID桁数、枝番桁数、カスタム書式変更処理.
   */
  useEffect(() => {
    const { userId } = user;
    const { mapId, version } = editMapVersion;
    if (!userId || !mapId || version === 0 || !currentLayoutId) {
      return;
    }

    (async () => {
      dispatch(appModule.actions.updateLoading(true));

      const storeKey = `${constants.STORAGE_KEY_EDITOR_DATA}.${userId}.${mapId}.${version}`;
      const saveData = (await EditorUtil.getStoreItem(storeKey)) as SaveData;

      // 前回適用時と変更がない場合
      if (
        saveData.preferences.areaIdLength === areaIdLength &&
        saveData.preferences.tableIdLength === tableIdLength &&
        saveData.preferences.branchNumLength === branchNumLength &&
        JSON.stringify(saveData.preferences.customFormats) ===
          JSON.stringify(customFormats)
      ) {
        dispatch(appModule.actions.updateLoading(false));
        return;
      }

      // 現在の選択状態を解除
      dispatch(editorNodeModule.actions.clearSelectedNodeIds());

      // 表示中のレイアウトに反映
      const nodes = (areaLayer.current?.children ?? []).concat(
        mapLayer.current?.children ?? [],
      );

      nodes.forEach((node: any) => {
        const data: ShapeData = {
          id: node.config.uuid,
          config: { ...node.config },
        };
        const newData = redefinitionIdLength(data);
        node.config = { ...newData.config };
      });

      // ノードリスト更新
      await refreshNodeList();

      // 他のレイアウトに反映
      layoutTabs
        .filter((d) => d.layoutId !== currentLayoutId)
        .map((d) => `${storeKey}.${d.layoutId}`)
        .forEach(async (key) => {
          const layouts = (await EditorUtil.getStoreItem(key)) as LayoutData;
          const areas = layouts.areas.map((data) => redefinitionIdLength(data));
          const maps = layouts.maps.map((data) => redefinitionIdLength(data));

          EditorUtil.updateStoreItem(key, { ...layouts, areas, maps });
        });

      dispatch(appModule.actions.updateLoading(false));
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areaIdLength, tableIdLength, branchNumLength, customFormats]);

  useEffect(() => {
    refreshNodeList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changeNodeList]);

  /**
   * 共通設定更新時の自動保存.
   */
  useEffect(() => {
    const { userId } = user;
    const { mapId, version } = editMapVersion;
    if (!userId || !mapId || version === 0) {
      return;
    }

    const storeKey = `${constants.STORAGE_KEY_EDITOR_DATA}.${userId}.${mapId}.${version}`;

    (async () => {
      const layouts = layoutTabs.map((d) => ({ ...d, areas: [], maps: [] }));

      // 共通設定を退避
      const saveData = (await EditorUtil.getStoreItem(storeKey)) as SaveData;
      const newSaveData: SaveData = {
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
      };
      EditorUtil.updateStoreItem(storeKey, newSaveData);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    showLattice,
    showRulers,
    areaIdLength,
    tableIdLength,
    branchNumLength,
    locationDisplayFormatType,
    customFormats,
    note,
    layoutTabs,
  ]);

  /**
   * ロック取得・解除
   */
  useEffect(() => {
    // 編集権限がない、または他ユーザーが編集ロックを取得している場合は終了
    if (
      !SecurityUtil.hasAnyAuthority(user, [AuthorityTypes.MAP_EDIT]) ||
      isOthersExclusiveLocked
    ) {
      return;
    }

    (async () => {
      dispatch(appModule.actions.updateLoading(true));

      if (isExclusiveLocked && !editMapVersion.exclusiveId) {
        // ロック取得
        await dispatch(
          lockEditMap(
            { ...editMapVersion },
            ({ data }) => {
              // マップ版数情報更新
              dispatch(editorModule.actions.updateEditMapVersion({ ...data }));

              dispatch(appModule.actions.updateLoading(false));
            },
            ({ e, result }) => {
              // 編集ロック状態更新
              dispatch(editorModule.actions.updateExclusiveLock(false));

              // エラーメッセージ出力
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
      } else {
        // ロック解除
        if (
          editMapVersion.exclusiveId &&
          editMapVersion.exclusiveById === user.userId
        ) {
          await dispatch(
            unlockEditMap(
              { ...editMapVersion },
              async ({ data }) => {
                // マップ版数情報更新
                dispatch(
                  editorModule.actions.updateEditMapVersion({ ...data }),
                );

                dispatch(appModule.actions.updateLoading(false));
              },
              ({ e, result }) => {
                // エラーメッセージ出力
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
        } else {
          dispatch(appModule.actions.updateLoading(false));
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExclusiveLocked]);

  /**
   * Load, Unload 処理
   */
  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnloadEvent);

    (async () => {
      dispatch(appModule.actions.updateLoading(true));

      // 選択マップデータを取得
      const mapCondition: api.MapVersionCondition = { mapId, version };
      await dispatch(
        // 選択マップの店舗情報
        searchMapVersion(
          mapCondition,
          async ({ mapVersion, data }) => {
            const { mapId, version, exclusiveId, exclusiveById } = mapVersion;

            // 他者が排他IDを設定している場合
            if (exclusiveId && exclusiveById !== user.userId) {
              // 他者ロック状態更新
              dispatch(editorModule.actions.updateOthersExclusiveLock(true));

              // 他者ロック中メッセージ
              dispatch(
                appModule.actions.updateAlertDialog({
                  type: DialogTypes.INFORMATION,
                  message: t(
                    'pages:MapEditor.message.information.exclusiveLock',
                    {
                      exclusiveByName: mapVersion.exclusiveByName,
                    },
                  ),
                }),
              );
            } else {
              // 編集ロック状態更新
              dispatch(editorModule.actions.updateExclusiveLock(true));

              // 他者ロック状態更新
              dispatch(editorModule.actions.updateOthersExclusiveLock(false));
            }

            // メニュー選択状態リセット
            dispatch(
              editorOpModule.actions.updateOp({
                selectedMenu: SideMenuTypes.SELECT_TOOL,
                opHoldItems: [],
                finishOpHold: false,
              }),
            );

            // マップ版数情報退避
            dispatch(
              editorModule.actions.updateEditMapVersion({ ...mapVersion }),
            );

            // 未保存データチェック
            await checkUnsavedData(mapId, version, data);

            dispatch(appModule.actions.updateLoading(false));
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

    return () => {
      resetAllState();

      window.removeEventListener('beforeunload', handleBeforeUnloadEvent);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Component
        rulerXRef={rulerX}
        rulerYRef={rulerY}
        mapLayerRef={mapLayer}
        areaLayerRef={areaLayer}
        editLayerRef={editLayer}
        transformer={transformer}
        enabledRulers={enabledRulers}
        defaultLayout={defaultLayout}
        resetTab={() => resetTab(mapId, Number(version))}
        getCurrentShapeData={getCurrentShapeData}
        undo={undo}
        redo={redo}
        handleStageScale={handleStageScale}
        destroyAllNodes={destroyAllNodes}
      />
    </>
  );
};
