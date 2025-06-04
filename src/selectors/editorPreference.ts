import { createSelector } from '@reduxjs/toolkit';

import { useAppSelector } from '../app/hooks';
import { EditorPreferenceState } from '../modules';

/**
 * 環境設定を取得します.
 *
 * @returns State で保持された値
 */
export const useEditorPreferenceState = (): EditorPreferenceState =>
  useAppSelector(({ editorPreference }) => editorPreference);

const stageWidth = createSelector(
  (state: EditorPreferenceState) => state.stageWidth,
  (stageWidth) => stageWidth,
);
/**
 * ステージサイズ（横）を取得します.
 *
 * @returns State で保持された値
 */
export const useStageWidth = () =>
  useAppSelector(({ editorPreference }) => stageWidth(editorPreference));

const stageHeight = createSelector(
  (state: EditorPreferenceState) => state.stageHeight,
  (stageHeight) => stageHeight,
);
/**
 * ステージサイズ（縦）を取得します.
 *
 * @returns State で保持された値
 */
export const useStageHeight = () =>
  useAppSelector(({ editorPreference }) => stageHeight(editorPreference));

const latticeWidth = createSelector(
  (state: EditorPreferenceState) => state.latticeWidth,
  (latticeSize) => latticeSize,
);
/**
 * 格子サイズ（横）を取得します.
 *
 * @returns State で保持された値
 */
export const useLatticeWidth = () =>
  useAppSelector(({ editorPreference }) => latticeWidth(editorPreference));

const latticeHeight = createSelector(
  (state: EditorPreferenceState) => state.latticeHeight,
  (latticeSize) => latticeSize,
);
/**
 * 格子サイズ（縦）を取得します.
 *
 * @returns State で保持された値
 */
export const useLatticeHeight = () =>
  useAppSelector(({ editorPreference }) => latticeHeight(editorPreference));

const enabledLattice = createSelector(
  (state: EditorPreferenceState) => state.enabledLattice,
  (enabledLattice) => enabledLattice,
);
/**
 * 格子背景表示有無を取得します.
 *
 * @returns State で保持された値
 */
export const useEnabledLattice = () =>
  useAppSelector(({ editorPreference }) => enabledLattice(editorPreference));

const enabledRulers = createSelector(
  (state: EditorPreferenceState) => state.enabledRulers,
  (enabledRulers) => enabledRulers,
);
/**
 * ルーラー表示有無を取得します.
 *
 * @returns State で保持された値
 */
export const useEnabledRulers = () =>
  useAppSelector(({ editorPreference }) => enabledRulers(editorPreference));

const screenCaptureRange = createSelector(
  (state: EditorPreferenceState) => state.screenCaptureRange,
  (screenCaptureRange) => screenCaptureRange,
);
/**
 * 画面キャプチャ範囲の種別を取得します.
 *
 * @returns State で保持された値
 */
export const useScreenCaptureRange = () =>
  useAppSelector(({ editorPreference }) =>
    screenCaptureRange(editorPreference),
  );

const areaIdLength = createSelector(
  (state: EditorPreferenceState) => state.areaIdLength,
  (areaIdLength) => areaIdLength,
);
/**
 * エリアID桁数を取得します.
 *
 * @returns State で保持された値
 */
export const useAreaIdLength = () =>
  useAppSelector(({ editorPreference }) => areaIdLength(editorPreference));

const tableIdLength = createSelector(
  (state: EditorPreferenceState) => state.tableIdLength,
  (tableIdLength) => tableIdLength,
);
/**
 * テーブルID桁数を取得します.
 *
 * @returns State で保持された値
 */
export const useTableIdLength = () =>
  useAppSelector(({ editorPreference }) => tableIdLength(editorPreference));

const branchNumLength = createSelector(
  (state: EditorPreferenceState) => state.branchNumLength,
  (branchNumLength) => branchNumLength,
);
/**
 * 枝番桁数を取得します.
 *
 * @returns State で保持された値
 */
export const useBranchNumLength = () =>
  useAppSelector(({ editorPreference }) => branchNumLength(editorPreference));

const locationDisplayFormatType = createSelector(
  (state: EditorPreferenceState) => state.locationDisplayFormatType,
  (locationDisplayFormatType) => locationDisplayFormatType,
);
/**
 * 表示用ロケーション書式種別を取得します.
 *
 * @returns State で保持された値
 */
export const useLocationDisplayFormatType = () =>
  useAppSelector(({ editorPreference }) =>
    locationDisplayFormatType(editorPreference),
  );

const customFormats = createSelector(
  (state: EditorPreferenceState) => state.customFormats,
  (customFormats) => customFormats,
);
/**
 * 表示用ロケーション書式を取得します.
 *
 * @returns State で保持された値
 */
export const useCustomFormats = () =>
  useAppSelector(({ editorPreference }) => customFormats(editorPreference));

const defaultFontSize = createSelector(
  (state: EditorPreferenceState) => state.fontSize,
  (fontSize) => fontSize,
);
/**
 * デフォルトのフォントサイズを取得します.
 *
 * @returns State で保持された値
 */
export const useDefaultFontSize = () =>
  useAppSelector(({ editorPreference }) => defaultFontSize(editorPreference));
