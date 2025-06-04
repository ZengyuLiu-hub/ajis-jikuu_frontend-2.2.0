import { createSelector } from '@reduxjs/toolkit';

import { useAppSelector } from '../app/hooks';
import { EditorShapeState } from '../modules';

export const useEditorShapeState = (): EditorShapeState =>
  useAppSelector(({ editorShape }) => editorShape);

const mapHistory = createSelector(
  (state: EditorShapeState) => state.mapHistory,
  (history) => history
);
export const useMapHistory = () =>
  useAppSelector(({ editorShape }) => mapHistory(editorShape));

const mapHistoryIndex = createSelector(
  (state: EditorShapeState) => state.mapHistoryIndex,
  (historyIndex) => historyIndex
);
export const useMapHistoryIndex = () =>
  useAppSelector(({ editorShape }) => mapHistoryIndex(editorShape));

const mapPresent = createSelector(
  (state: EditorShapeState) => state.mapPresent,
  (present) => present
);
export const useMapPresent = () =>
  useAppSelector(({ editorShape }) => mapPresent(editorShape));

const editLayerData = createSelector(
  (state: EditorShapeState) => state.editShapes,
  (shapes) => shapes
);
export const useEditLayerData = () =>
  useAppSelector(({ editorShape }) => editLayerData(editorShape));

const mapLayerData = createSelector(
  (state: EditorShapeState) => state.mapShapes,
  (shapes) => shapes
);
export const useMapLayerData = () =>
  useAppSelector(({ editorShape }) => mapLayerData(editorShape));

const areaLayerData = createSelector(
  (state: EditorShapeState) => state.areaShapes,
  (shapes) => shapes
);
export const useAreaLayerData = () =>
  useAppSelector(({ editorShape }) => areaLayerData(editorShape));

const saveShapes = createSelector(
  (state: EditorShapeState) => state.saveShapes,
  (shapes) => shapes
);
export const useSaveShapes = () =>
  useAppSelector(({ editorShape }) => saveShapes(editorShape));

const needsRefreshSaveShapes = createSelector(
  (state: EditorShapeState) => state.needsRefreshSaveShapes,
  (needsRefreshSaveShapes) => needsRefreshSaveShapes
);
export const useNeedsRefreshSaveShapes = () =>
  useAppSelector(({ editorShape }) => needsRefreshSaveShapes(editorShape));

const needsSaveShapes = createSelector(
  (state: EditorShapeState) => state.needsSaveShapes,
  (needsSaveShapes) => needsSaveShapes
);
export const useNeedsSaveShapes = () =>
  useAppSelector(({ editorShape }) => needsSaveShapes(editorShape));

const hasUnsavedData = createSelector(
  (state: EditorShapeState) => state.hasUnsavedData,
  (hasUnsavedData) => hasUnsavedData
);
export const useHasUnsavedData = () =>
  useAppSelector(({ editorShape }) => hasUnsavedData(editorShape));

const needsAutoSave = createSelector(
  (state: EditorShapeState) => state.needsAutoSave,
  (needsAutoSave) => needsAutoSave
);
export const useNeedsAutoSave = () =>
  useAppSelector(({ editorShape }) => needsAutoSave(editorShape));

const waitingAutoSave = createSelector(
  (state: EditorShapeState) => state.waitingAutoSave,
  (waitingAutoSave) => waitingAutoSave
);
export const useWaitingAutoSave = () =>
  useAppSelector(({ editorShape }) => waitingAutoSave(editorShape));
