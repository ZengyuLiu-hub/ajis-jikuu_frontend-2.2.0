import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Store } from '../types';

export type StoreState = {
  data: Store[];
  hits: number;
};

const initialState: StoreState = {
  data: [],
  hits: 0,
};

const slice = createSlice({
  name: 'store',
  initialState,
  reducers: {
    setData(state: StoreState, action: PayloadAction<Store[]>) {
      state.data = action.payload;
    },
    setHits(state: StoreState, action: PayloadAction<number>) {
      state.hits = action.payload;
    },
    clearState(state: StoreState) {
      return initialState;
    },
  },
});

export const storeModule = slice;
