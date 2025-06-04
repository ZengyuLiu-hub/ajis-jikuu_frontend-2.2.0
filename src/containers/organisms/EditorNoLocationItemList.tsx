import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import * as editorConstants from '../../constants/editor';

import { DialogTypes } from '../../types';
import { useAppDispatch } from '../../app/hooks';

import { appModule, editorNodeModule } from '../../modules';
import { useSelectedNodeIds, useNoLocationNodeList } from '../../selectors';

import { EditorNoLocationItemList as Component } from '../../components/organisms/EditorNoLocationItemList';

/**
 * 付番なし
 */
export const EditorNoLocationItemList = () => {
  const [t] = useTranslation();
  const dispatch = useAppDispatch();

  const selectedNodeIds = useSelectedNodeIds();
  const noLocationNodeList = useNoLocationNodeList();

  const [pressKeyControl, setPressKeyControl] = useState(false);

  /**
   * KeyDown イベントハンドラー.
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    e.stopPropagation();

    if ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) {
      setPressKeyControl(true);
    }

    // シェイプ削除
    if (e.key.toLowerCase() === 'delete') {
      dispatch(editorNodeModule.actions.updateDeleteNodeIds(selectedNodeIds));
    }
  };

  /**
   * KeyUp イベントハンドラー.
   */
  const handleKeyUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
    e.stopPropagation();

    if (pressKeyControl) {
      setPressKeyControl(false);
    }
  };

  /**
   * 全選択ボタン押下イベントハンドラー.
   */
  const handleClickSelectAll = () => {
    if (noLocationNodeList.length === 0) {
      return;
    }
    const ids: string[] = noLocationNodeList.map((node) => node.uuid);

    // 選択数が上限に達している場合はエラー表示
    if (ids.length > editorConstants.MAX_SELECTION_SHAPES) {
      dispatch(
        appModule.actions.updateAlertDialog({
          type: DialogTypes.ERROR,
          message: t(
            'organisms:EditorOperationLayer.message.maxSelectionShapes',
            {
              maxSelectionShapes: editorConstants.MAX_SELECTION_SHAPES,
            },
          ),
        }),
      );

      // 選択数を規定数に変更
      dispatch(
        editorNodeModule.actions.updateSelectedNodeIds(
          ids.slice(0, editorConstants.MAX_SELECTION_SHAPES),
        ),
      );
    } else {
      dispatch(editorNodeModule.actions.updateSelectedNodeIds(ids));
    }
  };

  /**
   * 全解除ボタン押下イベントハンドラー.
   */
  const handleClickUnSelectAll = () => {
    if (noLocationNodeList.length === 0) {
      return;
    }
    const ids: string[] = noLocationNodeList.map((node) => node.uuid);
    dispatch(editorNodeModule.actions.excludeSelectedNodeIds(ids));
  };

  /**
   * リスト項目押下イベントハンドラー.
   */
  const handleClickItem = useCallback(
    (uuid: string) => {
      const isSelected = selectedNodeIds.includes(uuid);
      if (!pressKeyControl && !isSelected) {
        // 未選択シェイプ
        dispatch(editorNodeModule.actions.updateSelectedNodeIds([uuid]));
      } else if (pressKeyControl && isSelected) {
        // Ctrl + 選択済みシェイプ
        dispatch(editorNodeModule.actions.excludeSelectedNodeIds([uuid]));
      } else if (pressKeyControl && !isSelected) {
        // Ctrl + 未選択シェイプ
        dispatch(editorNodeModule.actions.addSelectedNodeIds([uuid]));
      }
    },
    [dispatch, pressKeyControl, selectedNodeIds],
  );

  return (
    <Component
      selectedNodeIds={selectedNodeIds}
      searchResult={noLocationNodeList}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      onClickSelectAll={handleClickSelectAll}
      onClickUnSelectAll={handleClickUnSelectAll}
      onClickItem={handleClickItem}
    />
  );
};
