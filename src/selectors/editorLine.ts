import { createSelector } from '@reduxjs/toolkit';

import { useAppSelector } from '../app/hooks';
import { EditorLineState } from '../modules';

export const useEditorLineState = (): EditorLineState =>
  useAppSelector(({ editorLine }) => editorLine);

const isLineDrawing = createSelector(
  (state: EditorLineState) => state.isLineDrawing,
  (isLineDrawing) => isLineDrawing
);
export const useLineDrawing = () =>
  useAppSelector(({ editorLine }) => isLineDrawing(editorLine));
