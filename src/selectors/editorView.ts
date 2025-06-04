import { createSelector } from '@reduxjs/toolkit';

import { useAppSelector } from '../app/hooks';
import { EditorViewState } from '../modules';

export const useEditorViewState = (): EditorViewState =>
  useAppSelector(({ editorView }) => editorView);

const visibleMenu = createSelector(
  (state: EditorViewState) => state.visibleMenu,
  (visibleMenu) => visibleMenu
);
export const useVisibleMenu = () =>
  useAppSelector(({ editorView }) => visibleMenu(editorView));

const visibleRemarksIcon = createSelector(
  (state: EditorViewState) => state.visibleRemarksIcon,
  (visibleRemarksIcon) => visibleRemarksIcon
);
export const useVisibleRemarksIcon = () =>
  useAppSelector(({ editorView }) => visibleRemarksIcon(editorView));

const shapeControlTab = createSelector(
  (state: EditorViewState) => state.shapeControlTab,
  (shapeControlTab) => shapeControlTab
);
export const useShapeControlTab = () =>
  useAppSelector(({ editorView }) => shapeControlTab(editorView));

const shapeControlExpand = createSelector(
  (state: EditorViewState) => state.shapeControlExpand,
  (shapeControlExpand) => shapeControlExpand
);
export const useShapeControlExpand = () =>
  useAppSelector(({ editorView }) => shapeControlExpand(editorView));
