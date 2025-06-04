import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type EditorLayerState = {
  visibleAreaLayer: boolean;
  visibleMapLayer: boolean;
};

const initialState: EditorLayerState = {
  visibleAreaLayer: true,
  visibleMapLayer: true,
};

const editorLayerSlice = createSlice({
  name: 'editorLayer',
  initialState,
  reducers: {
    updateVisibleAreaLayer(
      state: EditorLayerState,
      action: PayloadAction<boolean>
    ) {
      state.visibleAreaLayer = action.payload;
    },
    updateVisibleMapLayer(
      state: EditorLayerState,
      action: PayloadAction<boolean>
    ) {
      state.visibleMapLayer = action.payload;
    },
    clearState() {
      return initialState;
    },
  },
});

export const editorLayerModule = editorLayerSlice;
