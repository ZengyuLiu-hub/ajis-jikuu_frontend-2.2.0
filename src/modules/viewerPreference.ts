import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  MapPdfOutputModes,
  MapPdfPaperSize,
  MapPdfPaperSizes,
  MapPdfRotations,
  ScreenCaptureRange,
  ScreenCaptureRanges,
  StageRegulationSizes,
  ViewerPdfOutputSettings,
} from '../types';
import { EditorUtil } from '../utils/EditorUtil';

export type ViewerPreference = {
  stageWidth: number;
  stageHeight: number;
  latticeWidth: number;
  latticeHeight: number;
  screenCaptureRange: ScreenCaptureRange;
  printSize: MapPdfPaperSize;
};

export type ViewerPreferenceState = {
  preferences: ViewerPreference;
  pdfOutputSettings: ViewerPdfOutputSettings;
};

const initialState: ViewerPreferenceState = {
  // オリジナル環境設定
  preferences: {
    stageWidth: EditorUtil.stageRegulationSizeToPixel(
      StageRegulationSizes.VERY_SMALL,
    ).width,
    stageHeight: EditorUtil.stageRegulationSizeToPixel(
      StageRegulationSizes.VERY_SMALL,
    ).height,
    latticeWidth: 5,
    latticeHeight: 5,
    screenCaptureRange: ScreenCaptureRanges.STAGE,
    printSize: MapPdfPaperSizes.A4,
  },
  // ビューア PDF 出力設定
  pdfOutputSettings: {
    outputMode: MapPdfOutputModes.INVENTORY,
    outputHeaderFooter: true,
    rotation: MapPdfRotations.NONE,
    stageWidth: EditorUtil.stageRegulationSizeToPixel(
      StageRegulationSizes.VERY_SMALL,
    ).width,
    stageHeight: EditorUtil.stageRegulationSizeToPixel(
      StageRegulationSizes.VERY_SMALL,
    ).height,
    screenCaptureRange: ScreenCaptureRanges.STAGE,
    printSize: MapPdfPaperSizes.A4,
  },
};

const slice = createSlice({
  name: 'viewerPreference',
  initialState,
  reducers: {
    // オリジナル環境設定を更新
    updatePreference(
      state: ViewerPreferenceState,
      action: PayloadAction<ViewerPreference>,
    ) {
      state.preferences = action.payload;
      state.pdfOutputSettings = {
        ...action.payload,
        outputMode: MapPdfOutputModes.INVENTORY,
        outputHeaderFooter: true,
        rotation: MapPdfRotations.NONE,
      };
    },
    // ビューア PDF 出力設定を更新
    updatePdfOutputSetting(
      state: ViewerPreferenceState,
      action: PayloadAction<ViewerPdfOutputSettings>,
    ) {
      state.pdfOutputSettings = action.payload;
    },
    // 状態クリア
    clearState() {
      return initialState;
    },
  },
});

export const viewerPreferenceModule = slice;
