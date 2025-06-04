import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type EditorIslandState = {
  latestRegisterTableId: number;
  latestRegisterBranchNum: number;
  latestFreeTextTableId: number;
  latestFreeTextBranchNum: number;
};

const initialState: EditorIslandState = {
  latestRegisterTableId: 85,
  latestRegisterBranchNum: 0,
  latestFreeTextTableId: 60,
  latestFreeTextBranchNum: 0,
};

const editorIslandSlice = createSlice({
  name: 'editorIsland',
  initialState,
  reducers: {
    updateLatestIds(
      state: EditorIslandState,
      action: PayloadAction<EditorIslandState>
    ) {
      state.latestRegisterTableId = action.payload.latestRegisterTableId;
      state.latestRegisterBranchNum = action.payload.latestRegisterBranchNum;
      state.latestFreeTextTableId = action.payload.latestFreeTextTableId;
      state.latestFreeTextBranchNum = action.payload.latestFreeTextBranchNum;
    },
    updateLatestRegisterTableId(
      state: EditorIslandState,
      action: PayloadAction<number>
    ) {
      state.latestRegisterTableId = action.payload;
    },
    updateLatestRegisterBranchNum(
      state: EditorIslandState,
      action: PayloadAction<number>
    ) {
      state.latestRegisterBranchNum = action.payload;
    },
    updateLatestFreeTextTableId(
      state: EditorIslandState,
      action: PayloadAction<number>
    ) {
      state.latestFreeTextTableId = action.payload;
    },
    updateLatestFreeTextBranchNum(
      state: EditorIslandState,
      action: PayloadAction<number>
    ) {
      state.latestFreeTextBranchNum = action.payload;
    },
    clearState() {
      return initialState;
    },
  },
});

export const editorIslandModule = editorIslandSlice;
