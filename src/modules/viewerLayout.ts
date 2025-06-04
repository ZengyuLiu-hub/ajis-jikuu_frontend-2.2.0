import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MapPdfPrintSettings } from '../types';

export type ViewerLayoutState = {
  needsPrintPdf?: MapPdfPrintSettings;
};

const initialState: ViewerLayoutState = {};

/**
 * レイアウト単位の共通ステータスを管理する.
 */
const slice = createSlice({
  name: 'viewerLayout',
  initialState,
  reducers: {
    // PDF 出力を更新
    updatePrintPdf(
      state: ViewerLayoutState,
      action: PayloadAction<MapPdfPrintSettings | undefined>,
    ) {
      state.needsPrintPdf = action.payload;
    },
    // 状態クリア
    clearState() {
      return initialState;
    },
  },
});

export const viewerLayoutModule = slice;
