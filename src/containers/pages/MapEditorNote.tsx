import React, { useState, useEffect } from 'react';
import ReactModal from 'react-modal';

import { useAppDispatch } from '../../app/hooks';

import { editorModule, editorShapeModule } from '../../modules';
import { useInventoryNote } from '../../selectors';

import {
  MapEditorNote as Component,
  Condition,
  ConditionEvent,
} from '../../components/pages/MapEditorNote';

interface Props extends ReactModal.Props {}

/**
 * 棚卸メモ
 */
export const MapEditorNote = (props: Props) => {
  const { isOpen } = props;

  const dispatch = useAppDispatch();

  const note = useInventoryNote();

  // 初期値
  const initialData: Condition = {
    inventoryNote: note,
  };

  // 棚卸メモ
  const [inventoryNote, setInventoryNote] = useState(initialData.inventoryNote);

  const onChangeInventoryNote = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setInventoryNote(e.target.value);

  /**
   * 画面リセット
   */
  const resetState = () => {
    setInventoryNote(note);
  };

  /**
   * 閉じる
   */
  const executeClose = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (props.onRequestClose) {
      props.onRequestClose(e);
    }
  };

  /**
   * キャンセルボタン押下
   */
  const executeCancel = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    if (props.onRequestClose) {
      props.onRequestClose(e);
    }
  };

  /**
   * 反映ボタン押下
   */
  const executeSubmit = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    // 棚卸メモを更新
    dispatch(editorModule.actions.updateInventoryNote(inventoryNote));

    // 未保存状態オン
    dispatch(editorShapeModule.actions.updateUnsavedData(true));

    // 画面を閉じる
    executeClose(e);
  };

  const condition: Condition = {
    inventoryNote,
  };

  const conditionEvent: ConditionEvent = {
    onChangeInventoryNote,
  };

  // 初期表示処理
  useEffect(() => {
    if (!isOpen) {
      return;
    }
    resetState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <Component
      {...props}
      condition={condition}
      conditionEvent={conditionEvent}
      onClickClose={executeClose}
      onClickCancel={executeCancel}
      onClickSubmit={executeSubmit}
    />
  );
};
