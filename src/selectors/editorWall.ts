import { useAppSelector } from '../app/hooks';
import { EditorWallState } from '../modules';

export const useEditorWallState = (): EditorWallState =>
  useAppSelector(({ editorWall }) => editorWall);
