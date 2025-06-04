import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ProductLocation } from '../types';

export type ViewerProductLocationState = {
  locations: ProductLocation[];
};

const initialState: ViewerProductLocationState = {
  locations: [],
};

// 商品ロケーション
const viewerProductLocationSlice = createSlice({
  name: 'viewerProduct',
  initialState,
  reducers: {
    // 商品ロケーション検索結果を更新
    updateLocations(
      state: ViewerProductLocationState,
      action: PayloadAction<ProductLocation[]>,
    ) {
      state.locations = action.payload;
    },
    // 状態をリセット
    clearState() {
      return initialState;
    },
  },
});

export const viewerProductLocationModule = viewerProductLocationSlice;
