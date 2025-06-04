import { createSelector } from '@reduxjs/toolkit';

import { useAppSelector } from '../app/hooks';
import { EditorLayoutState } from '../modules';

export const useEditorLayoutState = (): EditorLayoutState =>
  useAppSelector(({ editorLayout }) => editorLayout);

const needsPrintPdf = createSelector(
  (state: EditorLayoutState) => state.needsPrintPdf,
  (needsPrintPdf) => needsPrintPdf
);
export const useNeedsPrintPdf = () =>
  useAppSelector(({ editorLayout }) => needsPrintPdf(editorLayout));

const layoutName = createSelector(
  (state: EditorLayoutState) => state.layoutName,
  (layoutName) => layoutName
);
export const useLayoutName = () =>
  useAppSelector(({ editorLayout }) => layoutName(editorLayout));
