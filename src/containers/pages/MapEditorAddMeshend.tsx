import React, { useState, useEffect } from 'react';
import ReactModal from 'react-modal';

import {
  Direction,
  Directions,
  LocationCustomFormat,
  LocationDisplayFormatType,
} from '../../types';

import {
  useBranchNumLength,
  useEditorPreferenceState,
  useTableIdLength,
} from '../../selectors';

import {
  MapEditorAddMeshend as Component,
  Condition,
  ConditionEvent,
} from '../../components/pages/MapEditorAddMeshend';

export type Result = {
  areaIdLength: number;
  tableIdLength: number;
  branchNumLength: number;
  locationDisplayFormatType: LocationDisplayFormatType;
  customFormats: LocationCustomFormat[];
} & Condition;

interface Props extends ReactModal.Props {
  defaultBranchNum: string;
  onCancel(): void;
  onSuccess(result: Result): void;
}

/**
 * 編目エンドを追加
 */
export const MapEditorAddMeshend = (props: Props) => {
  const { isOpen, defaultBranchNum } = props;

  const preferences = useEditorPreferenceState();
  const tableIdLength = useTableIdLength();
  const branchNumLength = useBranchNumLength();

  // 初期値
  const initialData: Condition = {
    locationNum: '',
    gondolaDirection: Directions.TOP,
    gondolaWidthCells: 10,
    gondolaDepthCells: 5,
  };

  const [locationNum, setLocationNum] = useState<string>(
    initialData.locationNum
  );
  const [gondolaDirection, setGondolaDirection] = useState<Direction>(
    initialData.gondolaDirection
  );
  const [gondolaWidthCells, setGondolaWidthCells] = useState<number>(
    initialData.gondolaWidthCells
  );
  const [gondolaDepthCells, setGondolaDepthCells] = useState<number>(
    initialData.gondolaDepthCells
  );

  const onBlurLocationNum = (e: React.FocusEvent<HTMLInputElement>) =>
    setLocationNum(e.target.value);

  const onChangeGondolaDirection = (e: React.ChangeEvent<HTMLInputElement>) =>
    setGondolaDirection(e.target.value as Direction);

  const onChangeGondolaWidthCells = (value: number) =>
    setGondolaWidthCells(value);

  const onChangeGondolaDepthCells = (value: number) =>
    setGondolaDepthCells(value);

  // リセット
  const resetState = () => {
    const tableId = '0'.repeat(tableIdLength);

    setLocationNum(`${tableId}${defaultBranchNum}`);
  };

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
      locationNum,
      gondolaDirection,
      gondolaWidthCells,
      gondolaDepthCells,
      areaIdLength: preferences.areaIdLength,
      tableIdLength,
      branchNumLength,
      locationDisplayFormatType: preferences.locationDisplayFormatType,
      customFormats: preferences.customFormats,
    });

    executeClose(e);
  };

  // 初期表示処理
  useEffect(() => {
    if (!isOpen) {
      return;
    }
    resetState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const condition: Condition = {
    locationNum,
    gondolaDirection,
    gondolaWidthCells,
    gondolaDepthCells,
  };

  const conditionEvent: ConditionEvent = {
    onBlurLocationNum,
    onChangeGondolaDirection,
    onChangeGondolaWidthCells,
    onChangeGondolaDepthCells,
  };

  return (
    <Component
      {...props}
      locationNumLength={tableIdLength + branchNumLength}
      condition={condition}
      conditionEvent={conditionEvent}
      onClickClose={executeClose}
      onClickCancel={executeCancel}
      onClickSubmit={executeSubmit}
    />
  );
};
