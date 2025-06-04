import Konva from 'konva';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import * as constants from '../../constants/app';
import * as editorConstants from '../../constants/editor';

import { EditorUtil } from '../../utils/EditorUtil';

import * as api from '../../api';
import { useAppDispatch } from '../../app/hooks';
import {
  DialogTypes,
  Layout,
  MapPdfPaperSizes,
  MapVersion,
  SaveData,
  ScreenCaptureRanges,
  ShapeOperations,
  StageRegulationSizes,
} from '../../types';

import {
  actionHelper,
  getCountLocation,
  searchMapVersion,
} from '../../actions';
import {
  appModule,
  viewerModule,
  viewerNodeModule,
  viewerPreferenceModule,
  viewerProductLocationModule,
  viewerShapeModule,
  viewerViewModule,
} from '../../modules';
import { useUser } from '../../selectors';

import { MapViewer as Component } from '../../components/pages/MapViewer';

/**
 * マップビューア
 */
export const MapViewer = () => {
  const dispatch = useAppDispatch();

  const user = useUser();

  const areaLayer = useRef<Konva.Layer>(null);
  const mapLayer = useRef<Konva.Layer>(null);

  const [mapVersion, setMapVersion] = useState<MapVersion>();

  const { mapId = '', version = '1' } = useParams<{
    mapId: string;
    version: string;
  }>();

  // 全ノード削除.
  const destroyAllNodes = () => {
    // マップレイヤー
    mapLayer.current?.destroyChildren();

    // エリアレイヤー
    areaLayer.current?.destroyChildren();

    // クリア
    dispatch(viewerNodeModule.actions.clearNodeConfigList());
  };

  // 空のレイアウト
  const emptyLayout = (): Layout => ({
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

  // DB データを復元.
  const loadMapData = async (
    mapId: string,
    version: number,
    data: SaveData,
  ) => {
    const { userId } = user;

    // IndexedDB へ退避
    const storeKey = `${constants.STORAGE_KEY_VIEWER_DATA}.${userId}.${mapId}.${version}`;

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
    if (layoutTabs.length === 0) {
      layoutTabs.push(emptyLayout());
    }

    // 欠番を除いた対象ロケーションを取得
    const allLocations = data.layouts
      .map((d) => d.maps)
      .flat()
      .filter(
        (d) =>
          d.config.hasOwnProperty(
            editorConstants.SHAPE_PROP_NAME_LOCATION_NUM,
          ) &&
          !d.config.missingNumber &&
          !d.config.emptyNumber,
      )
      .map((d) => d.config);

    // 選択レイアウト
    const layout: Layout = layoutTabs[0];

    // 環境設定
    const newPreferences = {
      ...data.preferences,
      ...layout.preferences,
    };

    // Redux state 更新
    // エリア、マップ
    const layoutData = data.layouts.find((d) => d.layoutId === layout.layoutId);
    if (layoutData) {
      const areas = layoutData.areas ?? [];
      const maps = layoutData.maps ?? [];

      // マップの復元
      dispatch(
        viewerShapeModule.actions.updateMapHistory({
          operation: ShapeOperations.ADD,
          present: areas.concat(maps),
        }),
      );
    }

    // 棚卸メモ
    dispatch(viewerModule.actions.updateInventoryNote(data.note ?? ''));

    // 環境設定の復元
    dispatch(viewerPreferenceModule.actions.updatePreference(newPreferences));

    // レイアウト一覧の復元
    dispatch(viewerModule.actions.updateLayoutTabs(layoutTabs));

    // 選択レイアウト
    dispatch(viewerModule.actions.updateCurrentLayout(layout));

    // レイアウトロケーション数（欠番を除く）
    dispatch(
      viewerModule.actions.updateNumOfLayoutLocation(allLocations.length),
    );
  };

  // カウントロケーション
  const refreshShapeCountLocation = async (mapVersion: MapVersion) => {
    const condition = {
      jurisdictionClass: mapVersion.jurisdictionClass,
      companyCode: mapVersion.companyCode,
      storeCode: mapVersion.storeCode,
      inventoryDates: mapVersion.inventorySchedule?.inventoryDates ?? [],
    };
    await dispatch(
      getCountLocation(
        condition,
        ({ data }) => {
          dispatch(viewerModule.actions.updateCountLocations(data));
        },
        ({ e }) => actionHelper.showErrorDialog(e, dispatch),
      ),
    );
  };

  const updateCountLocation = useCallback(() => {
    if (!mapVersion) {
      return;
    }

    (async () => {
      dispatch(appModule.actions.updateLoading(true));

      await refreshShapeCountLocation(mapVersion);

      dispatch(appModule.actions.updateLoading(false));
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapVersion]);

  // 全ての状態をリセット.
  const resetAllState = () => {
    dispatch(viewerModule.actions.clearState());
    dispatch(viewerNodeModule.actions.clearState());
    dispatch(viewerPreferenceModule.actions.clearState());
    dispatch(viewerShapeModule.actions.clearState());
    dispatch(viewerViewModule.actions.clearState());
    dispatch(viewerProductLocationModule.actions.clearState());
  };

  // Load, Unload 処理
  useEffect(() => {
    (async () => {
      dispatch(appModule.actions.updateLoading(true));

      // 選択マップデータを取得
      const mapCondition: api.MapVersionCondition = { mapId, version };
      await dispatch(
        // 選択マップの店舗情報
        searchMapVersion(
          mapCondition,
          async ({ mapVersion, data }) => {
            setMapVersion(mapVersion);

            // レイアウト復元
            await loadMapData(mapId, Number(version), data);

            // カウントロケーション取得
            await refreshShapeCountLocation(mapVersion);

            // マップ版数情報退避
            dispatch(viewerModule.actions.updateMapVersion({ ...mapVersion }));

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
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Component
        areaLayerRef={areaLayer}
        mapLayerRef={mapLayer}
        destroyAllNodes={destroyAllNodes}
        updateCountLocation={updateCountLocation}
      />
    </>
  );
};
