import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type EditorWallState = {
  latestFrontWallBranchNum: number;
  latestLeftWallBranchNum: number;
  latestBackWallBranchNum: number;
  latestRightWallBranchNum: number;
};

const initialState: EditorWallState = {
  latestFrontWallBranchNum: 0,
  latestLeftWallBranchNum: 0,
  latestBackWallBranchNum: 0,
  latestRightWallBranchNum: 0,
};

const editorWallSlice = createSlice({
  name: 'editorWall',
  initialState,
  reducers: {
    updateLatestWallBranchNum(
      state: EditorWallState,
      action: PayloadAction<EditorWallState>
    ) {
      state.latestFrontWallBranchNum = action.payload.latestFrontWallBranchNum;
      state.latestLeftWallBranchNum = action.payload.latestLeftWallBranchNum;
      state.latestBackWallBranchNum = action.payload.latestBackWallBranchNum;
      state.latestRightWallBranchNum = action.payload.latestRightWallBranchNum;
    },
    updateLatestFrontWallBranchNum(
      state: EditorWallState,
      action: PayloadAction<number>
    ) {
      state.latestFrontWallBranchNum = action.payload;
    },
    updateLatestLeftWallBranchNum(
      state: EditorWallState,
      action: PayloadAction<number>
    ) {
      state.latestLeftWallBranchNum = action.payload;
    },
    updateLatestBackWallBranchNum(
      state: EditorWallState,
      action: PayloadAction<number>
    ) {
      state.latestBackWallBranchNum = action.payload;
    },
    updateLatestRightWallBranchNum(
      state: EditorWallState,
      action: PayloadAction<number>
    ) {
      state.latestRightWallBranchNum = action.payload;
    },
    clearState() {
      return initialState;
    },
  },
});

export const editorWallModule = editorWallSlice;
