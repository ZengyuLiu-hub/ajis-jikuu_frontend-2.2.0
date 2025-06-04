import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type EditorTableState = {
  latestTableId: number;
};

const initialState: EditorTableState = {
  latestTableId: 0,
};

const editorTableSlice = createSlice({
  name: 'editorTable',
  initialState,
  reducers: {
    updateLatestTableId(
      state: EditorTableState,
      action: PayloadAction<number>
    ) {
      state.latestTableId = action.payload;
    },
    clearState() {
      return initialState;
    },
  },
});

export const editorTableModule = editorTableSlice;
