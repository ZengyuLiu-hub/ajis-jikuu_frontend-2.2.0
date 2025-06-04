import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  CountLocation,
  Layout,
  MapPdfPaperSizes,
  MapVersion,
  ScreenCaptureRanges,
  StageRegulationSizes,
  ViewLocationAggregateDataType,
  ViewLocationAggregateDataTypes,
  ViewLocationColorType,
  ViewLocationColorTypes,
} from '../types';
import { EditorUtil } from '../utils/EditorUtil';

type ScrollPosition = {
  top: number;
  left: number;
};

export type ViewerState = {
  /** マップバージョン */
  viewMapVersion: MapVersion;
  /** ビューアロケーション色種別 */
  viewLocationColorType: ViewLocationColorType;
  /** ビューアロケーション集計値種別 */
  viewLocationAggregateDataType: ViewLocationAggregateDataType;
  /** レイアウトロケーション数（欠番を除く） */
  numOfLayoutLocation: number;
  /** カウントロケーション */
  countLocations: CountLocation[];
  /** 棚割データ検索対象 */
  isPlanogramData: boolean;
  /** レイアウトマップに存在しないカウントロケーションがあるかどうか */
  hasUnknownCountLocation: boolean;
  /** 棚卸メモ */
  inventoryNote: string;
  /** ステージ縮尺 */
  stageScale: number;
  /** レイアウトタブ */
  layoutTabs: Layout[];
  /** 現在のレイアウト */
  currentLayout: Layout;
  /** スクロール位置 */
  scrollPosition?: ScrollPosition;
};

const initialState: ViewerState = {
  viewMapVersion: {
    jurisdictionClass: '',
    jurisdictionName: '',
    companyCode: '',
    companyName: '',
    storeCode: '',
    storeName: '',
    zipCode: '',
    address1: '',
    address2: '',
    addressDetail: '',
    tel: '',
    fax: '',
    mapId: '',
    version: 0,
    createdById: '',
    createdByName: '',
    createdAt: new Date(),
    updatedById: '',
    updatedByName: '',
    updatedAt: new Date(),
    rowVersion: 0,
  },
  viewLocationColorType: ViewLocationColorTypes.COUNT_PROGRESS,
  viewLocationAggregateDataType: ViewLocationAggregateDataTypes.DEPARTMENT_NAME,
  numOfLayoutLocation: 0,
  countLocations: [],
  isPlanogramData: true,
  hasUnknownCountLocation: false,
  inventoryNote: '',
  stageScale: 100,
  layoutTabs: [],
  currentLayout: {
    layoutId: '',
    layoutName: '',
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
  },
};

const slice = createSlice({
  name: 'viewer',
  initialState,
  reducers: {
    // マップバージョンを更新
    updateMapVersion(state: ViewerState, action: PayloadAction<MapVersion>) {
      state.viewMapVersion = action.payload;
    },
    // ビューアロケーション色種別を更新
    updateViewLocationColorType(
      state: ViewerState,
      action: PayloadAction<ViewLocationColorType>,
    ) {
      state.viewLocationColorType = action.payload;
    },
    // ビューアロケーション集計値種別
    updateViewLocationAggregateDataType(
      state: ViewerState,
      action: PayloadAction<ViewLocationAggregateDataType>,
    ) {
      state.viewLocationAggregateDataType = action.payload;
    },
    // レイアウトロケーション数（欠番を除く）
    updateNumOfLayoutLocation(
      state: ViewerState,
      action: PayloadAction<number>,
    ) {
      state.numOfLayoutLocation = action.payload;
    },
    // カウントロケーションを更新
    updateCountLocations(
      state: ViewerState,
      action: PayloadAction<CountLocation[]>,
    ) {
      const data = action.payload;

      const unique = (locations: CountLocation[]) => {
        const map = new Map();
        locations.forEach((location) => {
          const key = `${location.areaId}${location.locationNum}`;
          if (!map.has(key)) {
            map.set(key, location);
          }
        });
        return Array.from(map.values());
      };

      state.countLocations = unique(data.filter(({ onlyTt }) => !onlyTt));
      state.hasUnknownCountLocation = data.some(({ onlyTt }) => onlyTt);
    },
    // 棚割データ検索対象を更新
    updateIsPlanogramData(state: ViewerState, action: PayloadAction<boolean>) {
      state.isPlanogramData = action.payload;
    },
    // 棚卸メモを更新
    updateInventoryNote(state: ViewerState, action: PayloadAction<string>) {
      state.inventoryNote = action.payload;
    },
    // ステージ縮尺を更新
    updateStageScale(state: ViewerState, action: PayloadAction<number>) {
      if (action.payload === state.stageScale) {
        return;
      }

      state.stageScale = action.payload;
    },
    // レイアウトタブを更新
    updateLayoutTabs(state: ViewerState, action: PayloadAction<Layout[]>) {
      state.layoutTabs = action.payload;
    },
    // 現在のレイアウトを更新
    updateCurrentLayout(state: ViewerState, action: PayloadAction<Layout>) {
      state.currentLayout = action.payload;
    },
    // スクロール位置を更新
    updateScrollPosition(
      state: ViewerState,
      action: PayloadAction<ScrollPosition | undefined>,
    ) {
      state.scrollPosition = action.payload;
    },
    // 状態クリア
    clearState() {
      return initialState;
    },
  },
});

export const viewerModule = slice;
