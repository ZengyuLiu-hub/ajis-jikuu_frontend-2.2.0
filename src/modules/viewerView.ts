import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ViewerViewState = {
  visibleRemarksIcon: boolean;
};

const initialState: ViewerViewState = {
  visibleRemarksIcon: true,
};

const viewerViewSlice = createSlice({
  name: 'viewerView',
  initialState,
  reducers: {
    // ロケーションメモアイコンの表示・非表示
    updateVisibleRemarksIcon(
      state: ViewerViewState,
      action: PayloadAction<boolean>,
    ) {
      state.visibleRemarksIcon = action.payload;
    },
    // 状態をリセット
    clearState() {
      return initialState;
    },
  },
});

export const viewerViewModule = viewerViewSlice;
