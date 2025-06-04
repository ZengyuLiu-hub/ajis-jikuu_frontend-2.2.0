import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import * as editorConstants from '../constants/editor';

import {
  LocationCustomFormat,
  LocationDisplayFormatType,
  LocationDisplayFormatTypes,
  MapPdfPaperSize,
  MapPdfPaperSizes,
  ScreenCaptureRange,
  ScreenCaptureRanges,
  StageRegulationSizes,
} from '../types';
import { EditorUtil } from '../utils/EditorUtil';

export type EditorPreferenceState = {
  stageWidth: number;
  stageHeight: number;
  latticeWidth: number;
  latticeHeight: number;
  enabledLattice: boolean;
  enabledRulers: boolean;
  screenCaptureRange: ScreenCaptureRange;
  printSize: MapPdfPaperSize;
  areaIdLength: number;
  tableIdLength: number;
  branchNumLength: number;
  locationDisplayFormatType: LocationDisplayFormatType;
  customFormats: LocationCustomFormat[];
  fontSize: number;
};

const initialState: EditorPreferenceState = {
  stageWidth: EditorUtil.stageRegulationSizeToPixel(
    StageRegulationSizes.VERY_SMALL,
  ).width,
  stageHeight: EditorUtil.stageRegulationSizeToPixel(
    StageRegulationSizes.VERY_SMALL,
  ).height,
  latticeWidth: 5,
  latticeHeight: 5,
  enabledLattice: true,
  enabledRulers: true,
  screenCaptureRange: ScreenCaptureRanges.STAGE,
  printSize: MapPdfPaperSizes.A4,
  areaIdLength: 2,
  tableIdLength: 2,
  branchNumLength: 2,
  locationDisplayFormatType: LocationDisplayFormatTypes.STANDARD,
  customFormats: [],
  fontSize: editorConstants.FONT_SIZE_BASE,
};

const editorPreferenceSlice = createSlice({
  name: 'editorPreference',
  initialState,
  reducers: {
    // 環境設定を更新
    updatePreference(
      state: EditorPreferenceState,
      action: PayloadAction<EditorPreferenceState>,
    ) {
      state.stageWidth = action.payload.stageWidth;
      state.stageHeight = action.payload.stageHeight;
      state.latticeWidth = action.payload.latticeWidth;
      state.latticeHeight = action.payload.latticeHeight;
      state.enabledLattice = action.payload.enabledLattice;
      state.enabledRulers = action.payload.enabledRulers;
      state.screenCaptureRange = action.payload.screenCaptureRange;
      state.printSize = action.payload.printSize;
      state.areaIdLength = action.payload.areaIdLength;
      state.tableIdLength = action.payload.tableIdLength;
      state.branchNumLength = action.payload.branchNumLength;
      state.locationDisplayFormatType =
        action.payload.locationDisplayFormatType;
      state.customFormats = action.payload.customFormats;
      state.fontSize = action.payload.fontSize;
    },
    // ステージサイズを更新
    updateStageSize(
      state: EditorPreferenceState,
      action: PayloadAction<{ width: number; height: number }>,
    ) {
      state.stageWidth = action.payload.width;
      state.stageHeight = action.payload.height;
    },
    // ステージの格子サイズを更新
    updateLattice(
      state: EditorPreferenceState,
      action: PayloadAction<{ width: number; height: number }>,
    ) {
      state.latticeWidth = action.payload.width;
      state.latticeHeight = action.payload.height;
    },
    // テーブルID、枝番の桁数を更新
    updateIdLength(
      state: EditorPreferenceState,
      action: PayloadAction<{ tableIdLength: number; branchNumLength: number }>,
    ) {
      state.tableIdLength = action.payload.tableIdLength;
      state.branchNumLength = action.payload.branchNumLength;
    },
    // 状態クリア
    clearState() {
      return initialState;
    },
  },
});

export const editorPreferenceModule = editorPreferenceSlice;
