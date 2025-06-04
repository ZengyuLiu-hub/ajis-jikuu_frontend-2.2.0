import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { MapVersionData } from '../types';

export type MapState = {
  data: MapVersionData[];
};

const initialState: MapState = {
  data: [],
};

const slice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setData(state: MapState, action: PayloadAction<MapVersionData[]>) {
      state.data = action.payload;
    },
    clearState(state: MapState) {
      return initialState;
    },
  },
});

export const mapModule = slice;
