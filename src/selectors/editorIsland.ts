import { useAppSelector } from '../app/hooks';
import { EditorIslandState } from '../modules';

export const useEditorIslandState = (): EditorIslandState =>
  useAppSelector(({ editorIsland }) => editorIsland);
