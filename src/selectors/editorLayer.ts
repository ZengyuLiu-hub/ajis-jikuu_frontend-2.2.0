import { createSelector } from '@reduxjs/toolkit';

import { useAppSelector } from '../app/hooks';
import { EditorLayerState } from '../modules';

export const useEditorLayerState = (): EditorLayerState =>
  useAppSelector(({ editorLayer }) => editorLayer);

const visibleAreaLayer = createSelector(
  (state: EditorLayerState) => state.visibleAreaLayer,
  (visibleAreaLayer) => visibleAreaLayer
);
export const useVisibleAreaLayer = () =>
  useAppSelector(({ editorLayer }) => visibleAreaLayer(editorLayer));

const visibleMapLayer = createSelector(
  (state: EditorLayerState) => state.visibleMapLayer,
  (visibleMapLayer) => visibleMapLayer
);
export const useVisibleMapLayer = () =>
  useAppSelector(({ editorLayer }) => visibleMapLayer(editorLayer));
