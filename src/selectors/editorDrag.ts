import { createSelector } from '@reduxjs/toolkit';

import { useAppSelector } from '../app/hooks';
import { EditorDragState } from '../modules';

/**
 * ドラッグの状態を取得します.
 *
 * @returns State
 */
export const useEditorDragState = (): EditorDragState =>
  useAppSelector(({ editorDrag }) => editorDrag);

const dragging = createSelector(
  (state: EditorDragState) => state.dragging,
  (dragging) => dragging
);
/**
 * ドラッグ中かどうかを取得します.
 *
 * @returns State で保持された値
 */
export const useDragging = () =>
  useAppSelector(({ editorDrag }) => dragging(editorDrag));

const transforming = createSelector(
  (state: EditorDragState) => state.transforming,
  (transforming) => transforming
);
/**
 * 変形中かどうかを取得します.
 *
 * @returns State で保持された値
 */
export const useTransforming = () =>
  useAppSelector(({ editorDrag }) => transforming(editorDrag));
