import { createSelector } from '@reduxjs/toolkit';

import { useAppSelector } from '../app/hooks';
import { EditorAreaState } from '../modules';

const addAreaLatestAreaId = createSelector(
  (state: EditorAreaState) => state.latestAreaId,
  (areaId) => areaId
);
export const useAddAreaLatestAreaId = () =>
  useAppSelector(({ editorArea }) => addAreaLatestAreaId(editorArea));
