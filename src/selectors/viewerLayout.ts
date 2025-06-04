import { createSelector } from '@reduxjs/toolkit';

import { useAppSelector } from '../app/hooks';
import { ViewerLayoutState } from '../modules';

/**
 * ビューアレイアウトを取得します.
 *
 * @returns State
 */
export const useViewerLayoutState = (): ViewerLayoutState =>
  useAppSelector(({ viewerLayout }) => viewerLayout);

const needsPrintPdf = createSelector(
  (state: ViewerLayoutState) => state.needsPrintPdf,
  (needsPrintPdf) => needsPrintPdf,
);
/**
 * ビューア PDF 出力するかどうかを取得します.
 *
 * @returns State で保持された値
 */
export const useViewNeedsPrintPdf = () =>
  useAppSelector(({ viewerLayout }) => needsPrintPdf(viewerLayout));
