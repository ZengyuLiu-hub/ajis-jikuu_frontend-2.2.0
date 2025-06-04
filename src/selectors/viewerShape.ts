import { createSelector } from '@reduxjs/toolkit';

import { useAppSelector } from '../app/hooks';
import { ViewerShapeState } from '../modules';

/**
 * ビューアシェイプを取得します.
 *
 * @returns State
 */
export const useViewerShapeState = (): ViewerShapeState =>
  useAppSelector(({ viewerShape }) => viewerShape);

const mapLayerData = createSelector(
  (state: ViewerShapeState) => state.mapShapes,
  (shapes) => shapes,
);
/**
 * ビューアマップレイヤデータを取得します.
 *
 * @returns State で保持された値
 */
export const useViewMapLayerData = () =>
  useAppSelector(({ viewerShape }) => mapLayerData(viewerShape));

const areaLayerData = createSelector(
  (state: ViewerShapeState) => state.areaShapes,
  (shapes) => shapes,
);
/**
 * ビューアエリアレイヤデータを取得します.
 *
 * @returns State で保持された値
 */
export const useViewAreaLayerData = () =>
  useAppSelector(({ viewerShape }) => areaLayerData(viewerShape));
