import { createSelector } from '@reduxjs/toolkit';

import { useAppSelector } from '../app/hooks';
import { ViewerState } from '../modules';

const viewMapVersion = createSelector(
  (state: ViewerState) => state.viewMapVersion,
  (storeData) => storeData,
);
/**
 * ビューアマップバージョンを取得します.
 *
 * @returns State で保持された値
 */
export const useViewMapVersion = () =>
  useAppSelector(({ viewer }) => viewMapVersion(viewer));

const viewLocationColorType = createSelector(
  (state: ViewerState) => state.viewLocationColorType,
  (type) => type,
);
/**
 * ビューアロケーション色種別を取得します.
 *
 * @returns State で保持された値
 */
export const useViewLocationColorType = () =>
  useAppSelector(({ viewer }) => viewLocationColorType(viewer));

const viewLocationAggregateDataType = createSelector(
  (state: ViewerState) => state.viewLocationAggregateDataType,
  (type) => type,
);

/**
 * ビューアロケーション集計値を取得します.
 *
 * @returns State で保持された値
 */
export const useViewLocationAggregateDataType = () =>
  useAppSelector(({ viewer }) => viewLocationAggregateDataType(viewer));

const numOfLayoutLocation = createSelector(
  (state: ViewerState) => state.numOfLayoutLocation,
  (data) => data,
);
/**
 * レイアウトロケーション数（欠番を除く）を取得します.
 *
 * @returns State で保持された値
 */
export const useNumOfLayoutLocation = () =>
  useAppSelector(({ viewer }) => numOfLayoutLocation(viewer));

const countLocations = createSelector(
  (state: ViewerState) => state.countLocations,
  (data) => data,
);
/**
 * カウントロケーションを取得します.
 *
 * @returns State で保持された値
 */
export const useCountLocations = () =>
  useAppSelector(({ viewer }) => countLocations(viewer));

const isPlanogramData = createSelector(
  (state: ViewerState) => state.isPlanogramData,
  (data) => data,
);
/**
 * 棚割データが検索対象であるかを取得します.
 */
export const useIsPlanogramData = () =>
  useAppSelector(({ viewer }) => isPlanogramData(viewer));

const hasUnknownCountLocation = createSelector(
  (state: ViewerState) => state.hasUnknownCountLocation,
  (data) => data,
);
/**
 * レイアウトマップに存在しないカウントロケーションがあるかどうかを取得します.
 *
 * @returns State で保持された値
 */
export const useHasUnknownCountLocation = () =>
  useAppSelector(({ viewer }) => hasUnknownCountLocation(viewer));

const inventoryNote = createSelector(
  (state: ViewerState) => state.inventoryNote,
  (inventoryNote) => inventoryNote,
);
/**
 * ビューア棚卸メモを取得します.
 *
 * @returns State で保持された値
 */
export const useViewInventoryNote = () =>
  useAppSelector(({ viewer }) => inventoryNote(viewer));

const stageScale = createSelector(
  (state: ViewerState) => state.stageScale,
  (stageScale) => stageScale,
);
/**
 * ビューアステージ縮尺を取得します.
 *
 * @returns State で保持された値
 */
export const useViewStageScale = () =>
  useAppSelector(({ viewer }) => stageScale(viewer));

const layoutTabs = createSelector(
  (state: ViewerState) => state.layoutTabs,
  (layoutTabs) => layoutTabs,
);
/**
 * ビューアレイアウトタブを取得します.
 *
 * @returns State で保持された値
 */
export const useViewLayoutTabs = () =>
  useAppSelector(({ viewer }) => layoutTabs(viewer));

const currentLayout = createSelector(
  (state: ViewerState) => state.currentLayout,
  (layout) => layout,
);
/**
 * ビューア現在のレイアウトを取得します.
 *
 * @returns State で保持された値
 */
export const useViewCurrentLayout = () =>
  useAppSelector(({ viewer }) => currentLayout(viewer));

const currentLayoutId = createSelector(
  (state: ViewerState) => state.currentLayout,
  (layout) => layout?.layoutId,
);
/**
 * ビューア現在のレイアウトIDを取得します.
 *
 * @returns State で保持された値
 */
export const useViewCurrentLayoutId = () =>
  useAppSelector(({ viewer }) => currentLayoutId(viewer));

const scrollPosition = createSelector(
  (state: ViewerState) => state.scrollPosition,
  (scrollPosition) => scrollPosition,
);
/**
 * ビューアスクロール位置を取得します.
 *
 * @returns State で保持された値
 */
export const useViewScrollPosition = () =>
  useAppSelector(({ viewer }) => scrollPosition(viewer));
