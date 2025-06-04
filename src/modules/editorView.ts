import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type EditorViewState = {
  visibleMenu: boolean;
  visibleRemarksIcon: boolean;
  shapeControlTab: string;
  shapeControlExpand: boolean;
};

const initialState: EditorViewState = {
  visibleMenu: true,
  visibleRemarksIcon: true,
  shapeControlTab: 'locationShape',
  shapeControlExpand: true,
};

const editorViewSlice = createSlice({
  name: 'editorView',
  initialState,
  reducers: {
    updateVisibleMenu(state: EditorViewState, action: PayloadAction<boolean>) {
      state.visibleMenu = action.payload;
    },
    updateVisibleRemarksIcon(
      state: EditorViewState,
      action: PayloadAction<boolean>
    ) {
      state.visibleRemarksIcon = action.payload;
    },
    updateShapeControlTab(
      state: EditorViewState,
      action: PayloadAction<string>
    ) {
      state.shapeControlTab = action.payload;
    },
    updateShapeControlExpand(
      state: EditorViewState,
      action: PayloadAction<boolean>
    ) {
      state.shapeControlExpand = action.payload;
    },
    clearState() {
      return initialState;
    },
  },
});

export const editorViewModule = editorViewSlice;
