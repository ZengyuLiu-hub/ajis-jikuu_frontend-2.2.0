import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  EditShapeData,
  LayerData,
  ShapeData,
  ShapeOperations,
  SideMenuTypes,
  UndoRedoOperations,
} from '../types';

type SaveShapeState = {
  map: ShapeData[];
  area: ShapeData[];
};

export type EditorShapeState = {
  mapHistory: EditShapeData[];
  mapHistoryIndex: number;
  mapPresent: EditShapeData;
  editShapes?: EditShapeData;
  mapShapes?: LayerData;
  areaShapes?: LayerData;
  saveShapes: SaveShapeState;
  needsRefreshSaveShapes: boolean;
  needsSaveShapes: boolean;
  hasUnsavedData: boolean;
  needsAutoSave?: Date;
  waitingAutoSave: boolean;
};

const initMapPresent = {
  operation: ShapeOperations.ADD,
  present: [],
};

const initialState: EditorShapeState = {
  mapHistory: [initMapPresent],
  mapHistoryIndex: 0,
  mapPresent: initMapPresent,
  saveShapes: {
    map: [],
    area: [],
  },
  needsRefreshSaveShapes: false,
  needsSaveShapes: false,
  hasUnsavedData: false,
  waitingAutoSave: false,
};

const editorShapeSlice = createSlice({
  name: 'editorShape',
  initialState,
  reducers: {
    updateMapHistory(
      state: EditorShapeState,
      action: PayloadAction<EditShapeData>
    ) {
      const newPresent = action.payload;

      state.mapPresent = newPresent;
      state.mapHistory = [newPresent];
      state.mapHistoryIndex = 0;

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
    updateMapPresent(
      state: EditorShapeState,
      action: PayloadAction<EditShapeData>
    ) {
      if (!action.payload) {
        return;
      }
      const { mapHistory } = state;

      const newPresent = action.payload;

      state.mapPresent = newPresent;

      if (state.mapHistoryIndex < mapHistory.length - 1) {
        const past = state.mapHistory.slice(0, state.mapHistoryIndex + 1);
        state.mapHistory = [...past, newPresent];
      } else {
        state.mapHistory.push(newPresent);
      }
      state.mapHistoryIndex += 1;

      if (newPresent.operation === ShapeOperations.ADD) {
        // エリア
        const areaPresent = newPresent.present.filter(
          (d) => d.config.shape === SideMenuTypes.AREA
        );
        if (areaPresent.length > 0) {
          state.areaShapes = {
            operation: UndoRedoOperations.NOTHING,
            current: {
              operation: newPresent.operation,
              present: areaPresent,
            },
          };
        }

        // エリア以外
        const mapPresent = newPresent.present.filter(
          (d) => d.config.shape !== SideMenuTypes.AREA
        );
        if (mapPresent.length > 0) {
          state.mapShapes = {
            operation: UndoRedoOperations.NOTHING,
            current: {
              operation: newPresent.operation,
              present: mapPresent,
            },
          };
        }
      }

      state.needsAutoSave = new Date();
      state.hasUnsavedData = true;
      state.waitingAutoSave = true;
    },
    undo(state: EditorShapeState) {
      if (state.mapHistoryIndex === 0) {
        return;
      }
      const previous = state.mapPresent;

      const { mapHistory } = state;

      const newIndex = state.mapHistoryIndex - 1;
      const newPresent = mapHistory[newIndex];

      state.mapHistoryIndex = newIndex;
      state.mapPresent = newPresent;

      // エリア
      const areaPresent = previous.present.filter(
        (d) => d.config.shape === SideMenuTypes.AREA
      );
      if (areaPresent.length > 0) {
        state.areaShapes = {
          operation: UndoRedoOperations.UNDO,
          current: newPresent,
          previous: {
            operation: previous.operation,
            past: previous.past?.filter(
              (d) => d.config.shape === SideMenuTypes.AREA
            ),
            present: areaPresent,
          },
        };
      }

      // エリア以外
      const mapPresent = previous.present.filter(
        (d) => d.config.shape !== SideMenuTypes.AREA
      );
      if (mapPresent.length > 0) {
        state.mapShapes = {
          operation: UndoRedoOperations.UNDO,
          current: newPresent,
          previous: {
            operation: previous.operation,
            past: previous.past?.filter(
              (d) => d.config.shape !== SideMenuTypes.AREA
            ),
            present: mapPresent,
          },
        };
      }

      state.needsAutoSave = new Date();
      state.hasUnsavedData = true;
      state.waitingAutoSave = true;
    },
    redo(state: EditorShapeState) {
      if (state.mapHistoryIndex === state.mapHistory.length - 1) {
        return;
      }
      const { mapHistory } = state;

      const newIndex = state.mapHistoryIndex + 1;
      const newPresent = mapHistory[newIndex];

      state.mapHistoryIndex = newIndex;
      state.mapPresent = newPresent;

      // エリア
      const areaPresent = newPresent.present.filter(
        (d) => d.config.shape === SideMenuTypes.AREA
      );
      if (areaPresent.length > 0) {
        state.areaShapes = {
          operation: UndoRedoOperations.REDO,
          current: {
            operation: newPresent.operation,
            present: areaPresent,
          },
        };
      }

      // エリア以外
      const mapData = newPresent.present.filter(
        (d) => d.config.shape !== SideMenuTypes.AREA
      );
      if (mapData.length > 0) {
        state.mapShapes = {
          operation: UndoRedoOperations.REDO,
          current: {
            operation: newPresent.operation,
            present: mapData,
          },
        };
      }

      state.needsAutoSave = new Date();
      state.hasUnsavedData = true;
      state.waitingAutoSave = true;
    },
    updateEditShapes(
      state: EditorShapeState,
      action: PayloadAction<EditShapeData>
    ) {
      state.editShapes = action.payload;
    },
    clearEditShapes(state: EditorShapeState) {
      state.editShapes = undefined;
    },
    clearAreaShapes(state: EditorShapeState) {
      state.areaShapes = undefined;
    },
    updateSaveShapes(
      state: EditorShapeState,
      action: PayloadAction<SaveShapeState>
    ) {
      state.saveShapes = action.payload;
    },
    needsRefreshSaveShapes(
      state: EditorShapeState,
      action: PayloadAction<boolean>
    ) {
      state.needsRefreshSaveShapes = action.payload;
    },
    needsSaveShapes(state: EditorShapeState, action: PayloadAction<boolean>) {
      state.needsSaveShapes = action.payload;
    },
    updateUnsavedData(state: EditorShapeState, action: PayloadAction<boolean>) {
      state.hasUnsavedData = action.payload;

      // 未保存状態がオンの場合は自動保存を有効化する
      if (action.payload) {
        state.needsAutoSave = new Date();
        state.waitingAutoSave = true;
      }
    },
    executeAutoSave(state: EditorShapeState) {
      state.needsAutoSave = new Date();
    },
    updateWaitingAutoSave(
      state: EditorShapeState,
      action: PayloadAction<boolean>
    ) {
      state.waitingAutoSave = action.payload;
    },
    clearState() {
      return initialState;
    },
  },
});

export const editorShapeModule = editorShapeSlice;
