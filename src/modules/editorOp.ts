import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ShapeData, SideMenuType, SideMenuTypes } from '../types';

/**
 * エディタ メニューから選択された操作で保持する項目を管理する状態.
 */
export type EditorOpState = {
  /** 選択メニュー */
  selectedMenu: SideMenuType;
  /** 選択された操作で保持する項目 */
  opHoldItems: ShapeData[];
  /** 保持させる操作を終了するかどうか */
  finishOpHold: boolean;
};

const initialState: EditorOpState = {
  selectedMenu: SideMenuTypes.SELECT_TOOL,
  opHoldItems: [],
  finishOpHold: false,
};

const editorOpSlice = createSlice({
  name: 'editorOp',
  initialState,
  reducers: {
    // 選択された操作の状態を更新
    updateOp(state: EditorOpState, action: PayloadAction<EditorOpState>) {
      state.selectedMenu = action.payload.selectedMenu;
      state.opHoldItems = [...action.payload.opHoldItems];
      state.finishOpHold = action.payload.finishOpHold;
    },
    // 選択メニューを更新
    updateSelectedMenu(
      state: EditorOpState,
      action: PayloadAction<SideMenuType>
    ) {
      state.selectedMenu = action.payload;
    },
    // 保持する項目を更新
    updateHoldItems(state: EditorOpState, action: PayloadAction<ShapeData[]>) {
      state.opHoldItems = [...action.payload];
    },
    // 保持する項目をクリア
    clearHoldItems(state: EditorOpState) {
      state.opHoldItems = [];
    },
    // 保持させる操作を終了するかどうかを更新
    updateFinishOpHold(state: EditorOpState, action: PayloadAction<boolean>) {
      state.finishOpHold = action.payload;
    },
    // 状態クリア
    clearState() {
      return initialState;
    },
  },
});

export const editorOpModule = editorOpSlice;
