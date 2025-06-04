import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { InventoryDatesData } from '../types';

export type MapVersionState = {
  data: InventoryDatesData[];
  hits: number;
};

const initialState: MapVersionState = {
  data: [],
  hits: 0,
};

const slice = createSlice({
  name: 'mapVersion',
  initialState,
  reducers: {
    setData(
      state: MapVersionState,
      action: PayloadAction<InventoryDatesData[]>
    ) {
      state.data = action.payload;
    },
    setHits(state: MapVersionState, action: PayloadAction<number>) {
      state.hits = action.payload;
    },
    clearState(state: MapVersionState) {
      return initialState;
    },
  },
});

export const mapVersionModule = slice;
