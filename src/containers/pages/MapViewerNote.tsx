import React, { useEffect, useState } from 'react';
import ReactModal from 'react-modal';

import { useViewInventoryNote } from '../../selectors';

import {
  MapViewerNote as Component,
  Condition,
} from '../../components/pages/MapViewerNote';

interface Props extends ReactModal.Props {}

/**
 * マップビューア：棚卸メモ
 *
 * @param props プロパティ
 * @returns {React.ReactElement} ReactElement
 */
export const MapViewerNote = (props: Props) => {
  const { isOpen } = props;

  const note = useViewInventoryNote();

  const initialData: Condition = {
    inventoryNote: note,
  };

  const [inventoryNote, setInventoryNote] = useState(initialData.inventoryNote);

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

  const condition: Condition = {
    inventoryNote,
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
    <Component {...props} condition={condition} onClickClose={executeClose} />
  );
};
