import { createSelector } from '@reduxjs/toolkit';

import { useAppSelector } from '../app/hooks';
import { EditorState } from '../modules';

export const useEditorState = (): EditorState =>
  useAppSelector(({ editor }) => editor);

const editMapVersion = createSelector(
  (state: EditorState) => state.editMapVersion,
  (storeData) => storeData
);
export const useEditMapVersion = () =>
  useAppSelector(({ editor }) => editMapVersion(editor));

const exclusiveLock = createSelector(
  (state: EditorState) => state.exclusiveLock,
  (exclusiveLock) => exclusiveLock
);
export const useExclusiveLocked = () =>
  useAppSelector(({ editor }) => exclusiveLock(editor));

const othersExclusiveLock = createSelector(
  (state: EditorState) => state.othersExclusiveLock,
  (othersExclusiveLock) => othersExclusiveLock
);
export const useOthersExclusiveLocked = () =>
  useAppSelector(({ editor }) => othersExclusiveLock(editor));

const inventoryNote = createSelector(
  (state: EditorState) => state.inventoryNote,
  (inventoryNote) => inventoryNote
);
export const useInventoryNote = () =>
  useAppSelector(({ editor }) => inventoryNote(editor));

const shouldOptimize = createSelector(
  (state: EditorState) => state.shouldOptimize,
  (shouldOptimize) => shouldOptimize
);
export const useShouldOptimize = () =>
  useAppSelector(({ editor }) => shouldOptimize(editor));

const stageScale = createSelector(
  (state: EditorState) => state.stageScale,
  (stageScale) => stageScale
);
export const useStageScale = () =>
  useAppSelector(({ editor }) => stageScale(editor));

const locationNumFontSize = createSelector(
  (state: EditorState) => state.locationNumFontSize,
  (locationNumFontSize) => locationNumFontSize
);
export const useLocationNumFontSize = () =>
  useAppSelector(({ editor }) => locationNumFontSize(editor));

const locationTextFontSize = createSelector(
  (state: EditorState) => state.locationTextFontSize,
  (locationTextFontSize) => locationTextFontSize
);
export const useLocationTextFontSize = () =>
  useAppSelector(({ editor }) => locationTextFontSize(editor));

const visibleLocationNum = createSelector(
  (state: EditorState) => state.visibleLocationNum,
  (visibleLocationNum) => visibleLocationNum
);
export const useVisibleLocationNum = () =>
  useAppSelector(({ editor }) => visibleLocationNum(editor));

const visibleLocationText = createSelector(
  (state: EditorState) => state.visibleLocationText,
  (visibleLocationText) => visibleLocationText
);
export const useVisibleLocationText = () =>
  useAppSelector(({ editor }) => visibleLocationText(editor));

const showingModal = createSelector(
  (state: EditorState) => state.showingModal,
  (showingModal) => showingModal
);
export const useShowingModal = () =>
  useAppSelector(({ editor }) => showingModal(editor));

const layoutTabs = createSelector(
  (state: EditorState) => state.layoutTabs,
  (layoutTabs) => layoutTabs
);
export const useLayoutTabs = () =>
  useAppSelector(({ editor }) => layoutTabs(editor));

const currentLayout = createSelector(
  (state: EditorState) => state.currentLayout,
  (layout) => layout
);
export const useCurrentLayout = () =>
  useAppSelector(({ editor }) => currentLayout(editor));

const currentLayoutId = createSelector(
  (state: EditorState) => state.currentLayout,
  (layout) => layout?.layoutId
);
export const useCurrentLayoutId = () =>
  useAppSelector(({ editor }) => currentLayoutId(editor));

const scrollPosition = createSelector(
  (state: EditorState) => state.scrollPosition,
  (scrollPosition) => scrollPosition
);
export const useScrollPosition = () =>
  useAppSelector(({ editor }) => scrollPosition(editor));
