import { useEffect, useReducer, useState } from 'react';
import ReactModal from 'react-modal';

import {
  MapEditorLocationCsvOutput as Component,
  Condition,
} from '../../components/pages/MapEditorLocationCsvOutput';
import { Layout } from '../../types';

// 初期値
const initialCondition: Condition = {
  layoutIds: [],
};

interface Props extends ReactModal.Props {
  /** 選択可能なレイアウト */
  selectableLayouts: Layout[];
  /** 正常終了 */
  onSuccess(layoutIds: string[]): void;
}

/**
 * ロケーション CSV 出力.
 */
export const MapEditorLocationCsvOutput = (props: Props) => {
  const { isOpen, selectableLayouts } = props;

  const [selectableLayoutIds, setSelectableLayoutIds] = useState<string[]>([]);

  // 検索条件
  const [condition, conditionEvent] = useReducer(
    (prev: Condition, next: { [P in keyof Condition]: any }): Condition => ({
      ...prev,
      ...next,
    }),
    initialCondition
  );

  // 全選択
  const handleChangeSelectAll = (e: React.ChangeEvent<HTMLInputElement>) =>
    e.target.checked
      ? conditionEvent({
          layoutIds: selectableLayoutIds,
        })
      : conditionEvent(initialCondition);

  // 閉じる
  const executeClose = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (props.onRequestClose) {
      props.onRequestClose(e);
    }
  };

  // キャンセル
  const executeCancel = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (props.onRequestClose) {
      props.onRequestClose(e);
    }
  };

  // 反映
  const executeSubmit = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    executeClose(e);

    props.onSuccess(condition.layoutIds);
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const layoutIds = selectableLayouts.map(({ layoutId }) => layoutId);
    setSelectableLayoutIds(layoutIds);
    conditionEvent({ layoutIds });
  }, [isOpen, selectableLayouts]);

  return (
    <Component
      {...props}
      condition={condition}
      conditionEvent={conditionEvent}
      selectableLayouts={selectableLayouts}
      onChangeSelectAll={handleChangeSelectAll}
      onClickClose={executeClose}
      onClickCancel={executeCancel}
      onClickSubmit={executeSubmit}
    />
  );
};
