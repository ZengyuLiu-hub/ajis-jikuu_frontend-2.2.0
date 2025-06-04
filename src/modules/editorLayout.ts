import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MapPdfPrintSettings } from '../types';

export type EditorLayoutState = {
  needsPrintPdf?: MapPdfPrintSettings;
  layoutName?: string;
};

const initialState: EditorLayoutState = {};

/**
 * レイアウト単位の共通ステータスを管理する.
 */
const slice = createSlice({
  name: 'editorLayout',
  initialState,
  reducers: {
    // PDF 出力を更新
    updatePrintPdf(
      state: EditorLayoutState,
      action: PayloadAction<MapPdfPrintSettings | undefined>,
    ) {
      state.needsPrintPdf = action.payload;
    },
    // レイアウト名を変更
    updateLayoutName(
      state: EditorLayoutState,
      action: PayloadAction<string | undefined>,
    ) {
      state.layoutName = action.payload;
    },
    // 状態クリア
    clearState() {
      return initialState;
    },
  },
});

export const editorLayoutModule = slice;
