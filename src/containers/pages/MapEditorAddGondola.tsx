import React, { useState, useEffect } from 'react';
import ReactModal from 'react-modal';

import {
  GondolaAlignment,
  GondolaAlignments,
  LocationCustomFormat,
  LocationDisplayFormatType,
} from '../../types';

import {
  useBranchNumLength,
  useEditorPreferenceState,
  useTableIdLength,
} from '../../selectors';

import {
  MapEditorAddGondola as Component,
  Condition,
  ConditionEvent,
} from '../../components/pages/MapEditorAddGondola';

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
 * テーブル追加
 */
export const MapEditorAddGondola = (props: Props) => {
  const { isOpen, defaultBranchNum } = props;

  const preferences = useEditorPreferenceState();
  const tableIdLength = useTableIdLength();
  const branchNumLength = useBranchNumLength();

  // 初期値
  const initialData: Condition = {
    locationNum: '',
    showFullLocationNum: false,
    gondolaAlignment: GondolaAlignments.HORIZONTAL,
    gondolaWidthCells: 10,
    gondolaDepthCells: 5,
  };

  const [locationNum, setLocationNum] = useState<string>(
    initialData.locationNum
  );
  const [showFullLocationNum, setShowFullLocationNum] = useState(
    initialData.showFullLocationNum
  );
  const [gondolaAlignment, setGondolaAlignment] = useState<GondolaAlignment>(
    initialData.gondolaAlignment
  );
  const [gondolaWidthCells, setGondolaWidthCells] = useState<number>(
    initialData.gondolaWidthCells
  );
  const [gondolaDepthCells, setGondolaDepthCells] = useState<number>(
    initialData.gondolaDepthCells
  );

  const handleChangeLocationNum = (e: React.FocusEvent<HTMLInputElement>) =>
    setLocationNum(e.target.value);

  const handleChangeShowFullLocationNum = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => setShowFullLocationNum(e.target.checked);

  const handleChangeGondolaAlignment = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => setGondolaAlignment(e.target.value as GondolaAlignment);

  const handleChangeGondolaWidthCells = (value: number) =>
    setGondolaWidthCells(value);

  const handleChangeGondolaDepthCells = (value: number) =>
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
      showFullLocationNum,
      gondolaAlignment,
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
    showFullLocationNum,
    gondolaAlignment,
    gondolaWidthCells,
    gondolaDepthCells,
  };

  const conditionEvent: ConditionEvent = {
    onBlurLocationNum: handleChangeLocationNum,
    onChangeShowFullLocationNum: handleChangeShowFullLocationNum,
    onChangeGondolaAlignment: handleChangeGondolaAlignment,
    onChangeGondolaWidthCells: handleChangeGondolaWidthCells,
    onChangeGondolaDepthCells: handleChangeGondolaDepthCells,
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
