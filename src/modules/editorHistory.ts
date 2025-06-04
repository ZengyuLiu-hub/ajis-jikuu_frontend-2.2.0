import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type EditorHistoryState = {
  past: any[];
  present: any;
  future: any[];
};

export type HistoryState = {
  history: any;
};

const initialState: EditorHistoryState = {
  past: [],
  present: undefined,
  future: [],
};

const editorHistorySlice = createSlice({
  name: 'editorHistory',
  initialState,
  reducers: {
    pushState(state: EditorHistoryState, action: PayloadAction<HistoryState>) {
      state.past = [...state.past, action.payload.history];
    },
    undo(state: EditorHistoryState, action: PayloadAction) {
      state.past = state.past.slice(0, state.past.length - 1);
      state.present = state.past[state.past.length - 1];
      state.future = [state.present, ...state.future];
    },
    redo(state: EditorHistoryState, action: PayloadAction) {
      state.past = [...state.past, state.present];
      state.present = state.future[0];
      state.future = state.future.slice(1);
    },
    clearState() {
      return initialState;
    },
  },
});

export const editorHistoryModule = editorHistorySlice;
