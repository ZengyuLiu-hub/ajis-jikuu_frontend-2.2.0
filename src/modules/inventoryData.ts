import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InventoryOperationDate } from '../types';

export type InventoryDataState = {
  /** 棚卸実施日リスト */
  inventoryOperationDates: InventoryOperationDate[];
  /** 棚卸実施日リスト総ヒット件数 */
  inventoryOperationDateTotalHits: number;
};

const initialState: InventoryDataState = {
  inventoryOperationDates: [],
  inventoryOperationDateTotalHits: 0,
};

// 棚卸データ
const slice = createSlice({
  name: 'inventoryData',
  initialState,
  reducers: {
    // 棚卸実施日リスト
    setInventoryOperationDates(
      state: InventoryDataState,
      action: PayloadAction<InventoryOperationDate[]>,
    ) {
      state.inventoryOperationDates = action.payload;
    },
    // 棚卸実施日リスト総ヒット件数
    setInventoryOperationDateTotalHits(
      state: InventoryDataState,
      action: PayloadAction<number>,
    ) {
      state.inventoryOperationDateTotalHits = action.payload;
    },
    // 状態クリア
    clearState(state: InventoryDataState) {
      return initialState;
    },
  },
});

export const inventoryDataModule = slice;
