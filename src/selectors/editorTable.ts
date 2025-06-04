import { createSelector } from '@reduxjs/toolkit';

import { useAppSelector } from '../app/hooks';
import { EditorTableState } from '../modules';

export const useEditorTableState = (): EditorTableState =>
  useAppSelector(({ editorTable }) => editorTable);

const addTableLatestTableId = createSelector(
  (state: EditorTableState) => state.latestTableId,
  (locationNum) => locationNum
);
export const useAddTableLatestTableId = () =>
  useAppSelector(({ editorTable }) => addTableLatestTableId(editorTable));
