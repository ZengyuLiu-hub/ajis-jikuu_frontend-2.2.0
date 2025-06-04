import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type EditorLineState = {
  isLineDrawing: boolean;
};

const initialState: EditorLineState = {
  isLineDrawing: false,
};

const editorLineSlice = createSlice({
  name: 'editorLine',
  initialState,
  reducers: {
    updateLineDrawing(state: EditorLineState, action: PayloadAction<boolean>) {
      state.isLineDrawing = action.payload;
    },
    clearState() {
      return initialState;
    },
  },
});

export const editorLineModule = editorLineSlice;
