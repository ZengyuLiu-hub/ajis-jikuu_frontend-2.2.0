import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type EditorAreaState = {
  latestAreaId: number;
};

const initialState: EditorAreaState = {
  latestAreaId: 0,
};

const editorAreaSlice = createSlice({
  name: 'editorArea',
  initialState,
  reducers: {
    updateLatestAreaId(state: EditorAreaState, action: PayloadAction<number>) {
      if (Number.isFinite(action.payload)) {
        state.latestAreaId = action.payload;
      }
    },
    clearState() {
      return initialState;
    },
  },
});

export const editorAreaModule = editorAreaSlice;
