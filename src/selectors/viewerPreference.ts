import { createSelector } from '@reduxjs/toolkit';

import { ViewerPdfOutputSettings } from '../types';

import { useAppSelector } from '../app/hooks';
import { ViewerPreference, ViewerPreferenceState } from '../modules';

/**
 * ビューア環境設定を取得します.
 *
 * @returns State
 */
export const useViewerPreferenceState = (): ViewerPreferenceState =>
  useAppSelector(({ viewerPreference }) => viewerPreference);

/**
 * オリジナル環境設定を取得します.
 *
 * @returns State
 */
export const useOriginalPreferences = (): ViewerPreference =>
  useAppSelector(({ viewerPreference }) => viewerPreference.preferences);

const stageWidth = createSelector(
  (preference: ViewerPreference) => preference.stageWidth,
  (stageWidth) => stageWidth,
);
/**
 * ビューアステージ幅を取得します.
 *
 * @returns State で保持された値
 */
export const useViewStageWidth = () =>
  useAppSelector(({ viewerPreference }) =>
    stageWidth(viewerPreference.preferences),
  );

const stageHeight = createSelector(
  (preference: ViewerPreference) => preference.stageHeight,
  (stageHeight) => stageHeight,
);
/**
 * ビューアステージ高さを取得します.
 *
 * @returns State で保持された値
 */
export const useViewStageHeight = () =>
  useAppSelector(({ viewerPreference }) =>
    stageHeight(viewerPreference.preferences),
  );

const latticeWidth = createSelector(
  (preference: ViewerPreference) => preference.latticeWidth,
  (latticeSize) => latticeSize,
);
/**
 * ビューア格子幅を取得します.
 *
 * @returns State で保持された値
 */
export const useViewLatticeWidth = () =>
  useAppSelector(({ viewerPreference }) =>
    latticeWidth(viewerPreference.preferences),
  );

const latticeHeight = createSelector(
  (preference: ViewerPreference) => preference.latticeHeight,
  (latticeSize) => latticeSize,
);
/**
 * ビューア格子高さを取得します.
 *
 * @returns State で保持された値
 */
export const useViewLatticeHeight = () =>
  useAppSelector(({ viewerPreference }) =>
    latticeHeight(viewerPreference.preferences),
  );

const screenCaptureRange = createSelector(
  (preference: ViewerPreference) => preference.screenCaptureRange,
  (screenCaptureRange) => screenCaptureRange,
);
/**
 * ビューア画面キャプチャ範囲を取得します.
 *
 * @returns State で保持された値
 */
export const useViewScreenCaptureRange = () =>
  useAppSelector(({ viewerPreference }) =>
    screenCaptureRange(viewerPreference.preferences),
  );

const pdfOutputSettings = createSelector(
  (settings: ViewerPdfOutputSettings) => settings,
  (settings) => settings,
);
/**
 * ビューア PDF 出力設定を取得します.
 *
 * @returns State で保持された値
 */
export const useViewerPdfOutputSettings = () =>
  useAppSelector(({ viewerPreference }) =>
    pdfOutputSettings(viewerPreference.pdfOutputSettings),
  );
