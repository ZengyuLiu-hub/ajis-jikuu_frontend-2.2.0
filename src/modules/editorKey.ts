import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type EditorKeyState = {
  pressKeyControl: boolean;
  pressKeyShift: boolean;
};

const initialState: EditorKeyState = {
  pressKeyControl: false,
  pressKeyShift: false,
};

const editorKeySlice = createSlice({
  name: 'editorKey',
  initialState,
  reducers: {
    updatePressKeyControl(
      state: EditorKeyState,
      action: PayloadAction<boolean>
    ) {
      state.pressKeyControl = action.payload;
    },
    updatePressKeyShift(state: EditorKeyState, action: PayloadAction<boolean>) {
      state.pressKeyShift = action.payload;
    },
    clearState() {
      return initialState;
    },
  },
});

export const editorKeyModule = editorKeySlice;
