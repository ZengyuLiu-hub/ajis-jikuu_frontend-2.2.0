import { useAppSelector } from '../app/hooks';
import { EditorHistoryState } from '../modules';

export const useEditorHistoryState = (): EditorHistoryState =>
  useAppSelector(({ editorHistory }) => editorHistory);
