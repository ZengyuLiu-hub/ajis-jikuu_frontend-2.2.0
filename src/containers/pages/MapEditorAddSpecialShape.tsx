import React, { useState, useEffect } from 'react';
import ReactModal from 'react-modal';

import {
  SpecialShapeTypes,
  SpecialShapeType,
  Directions,
  Direction,
} from '../../types';

import {
  MapEditorAddSpecialShape as Component,
  Condition,
  ConditionEvent,
} from '../../components/pages/MapEditorAddSpecialShape';

export type Result = {} & Condition;

interface Props extends ReactModal.Props {
  onCancel(): void;
  onSuccess(result: Result): void;
}

/**
 * 特殊型の追加
 */
export const MapEditorAddSpecialShape = (props: Props) => {
  const { isOpen } = props;

  // 初期値
  const initialData: Condition = {
    shapeType: SpecialShapeTypes.L,
    direction: Directions.TOP,
    width: 120,
    depth: 120,
    tableTopDepth: 30,
  };

  const [shapeType, setShapeType] = useState(initialData.shapeType);
  const [direction, setDirection] = useState(initialData.direction);
  const [width, setWidth] = useState(initialData.width);
  const [depth, setDepth] = useState(initialData.depth);
  const [tableTopDepth, setTableTopDepth] = useState(initialData.tableTopDepth);

  const onChangeShapeType = (e: React.ChangeEvent<HTMLInputElement>) =>
    setShapeType(e.target.value as SpecialShapeType);

  const onChangeDirection = (e: React.ChangeEvent<HTMLInputElement>) =>
    setDirection(e.target.value as Direction);

  const onChangeWidth = (value: number) => setWidth(value);

  const onChangeDepth = (value: number) => setDepth(value);

  const onChangeTableTopDepth = (value: number) => setTableTopDepth(value);

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

    if (props.onRequestClose) {
      props.onRequestClose(e);
    }
  };

  // 反映
  const executeSubmit = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    props.onSuccess({
      shapeType,
      direction,
      width,
      depth,
      tableTopDepth,
    });

    executeClose(e);
  };

  // 初期表示処理
  useEffect(() => {
    if (!isOpen) {
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const condition: Condition = {
    shapeType,
    direction,
    width,
    depth,
    tableTopDepth,
  };

  const conditionEvent: ConditionEvent = {
    onChangeShapeType,
    onChangeDirection,
    onChangeWidth,
    onChangeDepth,
    onChangeTableTopDepth,
  };

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
