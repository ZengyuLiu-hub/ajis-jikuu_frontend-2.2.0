import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { EditShapeData, LayerData, UndoRedoOperations } from '../types';

export type ViewerShapeState = {
  mapShapes?: LayerData;
  areaShapes?: LayerData;
};

const initialState: ViewerShapeState = {};

const slice = createSlice({
  name: 'viewerShape',
  initialState,
  reducers: {
    // マップ履歴を更新
    updateMapHistory(
      state: ViewerShapeState,
      action: PayloadAction<EditShapeData>,
    ) {
      const newPresent = action.payload;

      // エリア
      state.areaShapes = {
        operation: UndoRedoOperations.NOTHING,
        current: newPresent,
      };

      // エリア以外
      state.mapShapes = {
        operation: UndoRedoOperations.NOTHING,
        current: newPresent,
      };
    },
    // 状態クリア
    clearState() {
      return initialState;
    },
  },
});

export const viewerShapeModule = slice;
