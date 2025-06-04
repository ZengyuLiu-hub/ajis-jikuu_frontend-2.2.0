import { createSelector } from '@reduxjs/toolkit';

import { useAppSelector } from '../app/hooks';
import { ViewerViewState } from '../modules';

/**
 * [ビューア] 表示状態を取得します.
 *
 * @returns State で保持された値
 */
export const useViewerViewState = (): ViewerViewState =>
  useAppSelector(({ viewerView }) => viewerView);

// 表示状態からロケーションメモアイコン表示・非表示の状態を取得します
const visibleRemarksIcon = createSelector(
  (state: ViewerViewState) => state.visibleRemarksIcon,
  (visibleRemarksIcon) => visibleRemarksIcon,
);

/**
 * [ビューア] ロケーションメモアイコン表示・非表示の状態を取得します.
 *
 * @returns State で保持された値
 */
export const useViewVisibleRemarksIcon = () =>
  useAppSelector(({ viewerView }) => visibleRemarksIcon(viewerView));
