import { createSelector } from '@reduxjs/toolkit';

import { useAppSelector } from '../app/hooks';
import { EditorKeyState } from '../modules';

export const useEditorKeyState = (): EditorKeyState =>
  useAppSelector(({ editorKey }) => editorKey);

const pressKeyControl = createSelector(
  (state: EditorKeyState) => state.pressKeyControl,
  (pressKeyControl) => pressKeyControl
);
export const usePressKeyControl = () =>
  useAppSelector(({ editorKey }) => pressKeyControl(editorKey));

const pressKeyShift = createSelector(
  (state: EditorKeyState) => state.pressKeyShift,
  (pressKeyShift) => pressKeyShift
);
export const usePressKeyShift = () =>
  useAppSelector(({ editorKey }) => pressKeyShift(editorKey));
