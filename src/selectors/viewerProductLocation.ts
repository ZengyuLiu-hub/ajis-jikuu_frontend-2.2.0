import { createSelector } from '@reduxjs/toolkit';

import { useAppSelector } from '../app/hooks';
import { ViewerProductLocationState } from '../modules';

/**
 * [ビューア] 表示状態を取得します.
 *
 * @returns State で保持された値
 */
export const useViewerProductLocationState = (): ViewerProductLocationState =>
  useAppSelector(({ viewerProductLocation }) => viewerProductLocation);

// 表示状態から商品ロケーション検索結果を取得します.
const locations = createSelector(
  (state: ViewerProductLocationState) => state.locations,
  (locations) => locations,
);
/**
 * [ビューア] 商品ロケーション検索結果を取得します.
 *
 * @returns State で保持された値
 */
export const useViewProductLocations = () =>
  useAppSelector(({ viewerProductLocation }) =>
    locations(viewerProductLocation),
  );
