import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type EditorDragState = {
  /** ドラッグ中かどうか */
  dragging: boolean;
  /** 変形中かどうか */
  transforming: boolean;
};

const initialState: EditorDragState = {
  dragging: false,
  transforming: false,
};

const editorDragSlice = createSlice({
  name: 'editorDrag',
  initialState,
  reducers: {
    // ドラッグ中かどうかを更新
    updateDragging(state: EditorDragState, action: PayloadAction<boolean>) {
      state.dragging = action.payload;
    },
    // 変形中かどうかを更新
    updateTransforming(state: EditorDragState, action: PayloadAction<boolean>) {
      state.transforming = action.payload;
    },
    // 状態クリア
    clearState() {
      return initialState;
    },
  },
});

export const editorDragModule = editorDragSlice;
