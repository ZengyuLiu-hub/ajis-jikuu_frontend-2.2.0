import React, { useState, useEffect } from 'react';
import ReactModal from 'react-modal';

import { useAddAreaLatestAreaId, useAreaIdLength } from '../../selectors';

import {
  MapEditorAddArea as Component,
  Condition,
  ConditionEvent,
} from '../../components/pages/MapEditorAddArea';

export type Result = {} & Condition;

interface Props extends ReactModal.Props {
  onCancel(): void;
  onSuccess(result: Result): void;
}

/**
 * エリア追加
 *
 * @param props プロパティ
 * @returns {React.ReactElement} ReactElement
 */
export const MapEditorAddArea = (props: Props): React.ReactElement => {
  const { isOpen } = props;

  const areaIdLength = useAreaIdLength();

  const latestAreaId = useAddAreaLatestAreaId();

  const initialData: Condition = {
    areaId: '01',
    text: 'エリア',
  };

  const [areaId, setAreaId] = useState<string>(initialData.areaId);
  const [text, setText] = useState<string>(initialData.text);

  // とじる
  const executeClose = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (props.onRequestClose) {
      props.onRequestClose(e);
    }
  };

  // キャンセル
  const executeCancel = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    props.onCancel();

    executeClose(e);
  };

  // 作成
  const executeSubmit = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    props.onSuccess({
      areaId,
      text,
    });

    executeClose(e);
  };

  const condition: Condition = {
    areaId,
    text,
  };

  const conditionEvent: ConditionEvent = {
    onChangeAreaId: (e: React.ChangeEvent<HTMLInputElement>) =>
      setAreaId(e.target.value),
    onBlurAreaId: (e: React.ChangeEvent<HTMLInputElement>) =>
      setAreaId(e.target.value.padStart(areaIdLength, '0')),
    onChangeText: (e: React.ChangeEvent<HTMLInputElement>) =>
      setText(e.target.value),
  };

  // 初期表示処理
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    // エリアIDの桁数が 0 の場合は空文字
    if (areaIdLength === 0) {
      setAreaId('');
      return;
    }

    const maxAreaId = Number('9'.repeat(areaIdLength));

    // エリアIDを復元
    const nextAreaId = (latestAreaId > maxAreaId ? 0 : latestAreaId) + 1;
    setAreaId(`${nextAreaId}`.padStart(areaIdLength, '0'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <Component
      {...props}
      areaIdLength={areaIdLength}
      condition={condition}
      conditionEvent={conditionEvent}
      onClickClose={executeClose}
      onClickCancel={executeCancel}
      onClickSubmit={executeSubmit}
    />
  );
};
