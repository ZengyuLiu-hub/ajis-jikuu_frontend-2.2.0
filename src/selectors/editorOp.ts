import { createSelector } from '@reduxjs/toolkit';

import { useAppSelector } from '../app/hooks';
import { EditorOpState } from '../modules';

export const useEditorOpState = (): EditorOpState =>
  useAppSelector(({ editorOp }) => editorOp);

const selectedMenu = createSelector(
  (state: EditorOpState) => state.selectedMenu,
  (selectedMenu) => selectedMenu
);
export const useSelectedMenu = () =>
  useAppSelector(({ editorOp }) => selectedMenu(editorOp));

const opHoldItems = createSelector(
  (state: EditorOpState) => state.opHoldItems,
  (opHoldItems) => opHoldItems
);
export const useOpHoldItems = () =>
  useAppSelector(({ editorOp }) => opHoldItems(editorOp));

const finishOpHold = createSelector(
  (state: EditorOpState) => state.finishOpHold,
  (finishOpHold) => finishOpHold
);
export const useFinishOpHold = () =>
  useAppSelector(({ editorOp }) => finishOpHold(editorOp));
