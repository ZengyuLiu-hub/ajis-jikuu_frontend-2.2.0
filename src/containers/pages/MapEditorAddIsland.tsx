import React, { useState, useEffect } from 'react';
import ReactModal from 'react-modal';

import {
  IslandType,
  IslandTypes,
  InputType,
  InputTypes,
  AvailableType,
  AvailableTypes,
  LocationDisplayFormatType,
  LocationCustomFormat,
} from '../../types';

import {
  useAddTableLatestTableId,
  useBranchNumLength,
  useEditorIslandState,
  useEditorPreferenceState,
  useTableIdLength,
} from '../../selectors';

import {
  MapEditorAddIsland as Component,
  Condition,
  ConditionEvent,
} from '../../components/pages/MapEditorAddIsland';

export type Result = {
  areaIdLength: number;
  tableIdLength: number;
  branchNumLength: number;
  locationDisplayFormatType: LocationDisplayFormatType;
  customFormats: LocationCustomFormat[];
} & Condition;

interface Props extends ReactModal.Props {
  onCancel(): void;
  onSuccess(result: Result): void;
}

/**
 * 島を追加
 */
export const MapEditorAddIsland = (props: Props) => {
  const { isOpen } = props;

  const preferences = useEditorPreferenceState();
  const tableIdLength = useTableIdLength();
  const branchNumLength = useBranchNumLength();

  const latestTableId = useAddTableLatestTableId();

  const islandState = useEditorIslandState();

  const incrementalCircleTableId = 1;
  const incrementalSquareTableId = 1;
  const incrementalRegisterBranchNum = 1;
  const incrementalFreeTextBranchNum = 1;

  // 初期値
  const initialData: Condition = {
    islandType: IslandTypes.CIRCLE,
    circleLocationNum: '0001',
    circleLocationNumInputType: InputTypes.AUTO,
    circleLocationNumShowFull: true,
    circleLocationBorderAvailable: AvailableTypes.AVAILABLE,
    squareLocationNum: '0001',
    squareLocationNumInputType: InputTypes.AUTO,
    squareLocationNumShowFull: true,
    squareLocationBorderAvailable: AvailableTypes.AVAILABLE,
    registerLocationNum: '8501',
    registerLocationNumInputType: InputTypes.AUTO,
    registerLocationNumShowFull: true,
    registerBorderAvailable: AvailableTypes.AVAILABLE,
    freeTextValue: 'free text',
    freeTextLocationNum: '6001',
    freeTextLocationNumInputType: InputTypes.AUTO,
    freeTextLocationNumShowFull: true,
    freeTextBorderAvailable: AvailableTypes.AVAILABLE,
  };

  const [islandType, setIslandType] = useState<IslandType>(
    initialData.islandType
  );

  const [circleLocationNum, setCircleLocationNum] = useState(
    initialData.circleLocationNum
  );
  const [circleLocationNumInputType, setCircleLocationNumInputType] =
    useState<InputType>(initialData.circleLocationNumInputType);
  const [circleLocationNumShowFull, setCircleLocationNumShowFull] = useState(
    initialData.circleLocationNumShowFull
  );
  const [circleLocationBorderAvailable, setCircleLocationBorderAvailable] =
    useState<AvailableType>(initialData.circleLocationBorderAvailable);

  const [squareLocationNum, setSquareLocationNum] = useState(
    initialData.squareLocationNum
  );
  const [squareLocationNumInputType, setSquareLocationNumInputType] =
    useState<InputType>(initialData.squareLocationNumInputType);
  const [squareLocationNumShowFull, setSquareLocationNumShowFull] = useState(
    initialData.squareLocationNumShowFull
  );
  const [squareLocationBorderAvailable, setSquareLocationBorderAvailable] =
    useState<AvailableType>(initialData.squareLocationBorderAvailable);

  const [registerLocationNum, setRegisterLocationNum] = useState(
    initialData.registerLocationNum
  );
  const [registerLocationNumInputType, setRegisterLocationNumInputType] =
    useState<InputType>(initialData.registerLocationNumInputType);
  const [registerLocationNumShowFull, setRegisterLocationNumShowFull] =
    useState(initialData.registerLocationNumShowFull);
  const [registerBorderAvailable, setRegisterBorderAvailable] =
    useState<AvailableType>(initialData.registerBorderAvailable);

  const [freeTextValue, setFreeTextValue] = useState(initialData.freeTextValue);

  const [freeTextLocationNum, setFreeTextLocationNum] = useState(
    initialData.freeTextLocationNum
  );
  const [freeTextLocationNumInputType, setFreeTextLocationNumInputType] =
    useState<InputType>(initialData.freeTextLocationNumInputType);
  const [freeTextLocationNumShowFull, setFreeTextLocationNumShowFull] =
    useState(initialData.freeTextLocationNumShowFull);
  const [freeTextBorderAvailable, setFreeTextBorderAvailable] =
    useState<AvailableType>(initialData.freeTextBorderAvailable);

  const onChangeIslandType = (e: React.ChangeEvent<HTMLInputElement>) =>
    setIslandType(e.target.value as IslandType);

  const onBlurCircleLocationNum = (
    e: React.FocusEvent<HTMLInputElement>
  ) => {
    setCircleLocationNum(e.target.value);
    setIslandType(IslandTypes.CIRCLE);
  };

  const onChangeCircleLocationNumInputType = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCircleLocationNumInputType(e.target.value as InputType);
    setIslandType(IslandTypes.CIRCLE);
  };

  const onChangeCircleLocationNumShowFull = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => setCircleLocationNumShowFull(e.target.checked);

  const onChangeCircleLocationBorderAvailable = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCircleLocationBorderAvailable(e.target.value as AvailableType);
    setIslandType(IslandTypes.CIRCLE);
  };

  const onBlurSquareLocationNum = (
    e: React.FocusEvent<HTMLInputElement>
  ) => {
    setSquareLocationNum(e.target.value);
    setIslandType(IslandTypes.SQUARE);
  };

  const onChangeSquareLocationNumInputType = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSquareLocationNumInputType(e.target.value as InputType);
    setIslandType(IslandTypes.SQUARE);
  };

  const onChangeSquareLocationNumShowFull = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => setSquareLocationNumShowFull(e.target.checked);

  const onChangeSquareLocationBorderAvailable = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSquareLocationBorderAvailable(e.target.value as AvailableType);
    setIslandType(IslandTypes.SQUARE);
  };

  const onBlurRegisterLocationNum = (
    e: React.FocusEvent<HTMLInputElement>
  ) => {
    setRegisterLocationNum(e.target.value);
    setIslandType(IslandTypes.REGISTER);
  };

  const onChangeRegisterLocationNumInputType = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRegisterLocationNumInputType(e.target.value as InputType);
    setIslandType(IslandTypes.REGISTER);
  };

  const onChangeRegisterLocationNumShowFull = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => setRegisterLocationNumShowFull(e.target.checked);

  const onChangeRegisterBorderAvailable = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRegisterBorderAvailable(e.target.value as AvailableType);
    setIslandType(IslandTypes.REGISTER);
  };

  const onChangeFreeTextValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFreeTextValue(e.target.value);
    setIslandType(IslandTypes.FREE_TEXT);
  };

  const onBlurFreeTextLocationNum = (
    e: React.FocusEvent<HTMLInputElement>
  ) => {
    setFreeTextLocationNum(e.target.value);
    setIslandType(IslandTypes.FREE_TEXT);
  };

  const onChangeFreeTextLocationNumInputType = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFreeTextLocationNumInputType(e.target.value as InputType);
    setIslandType(IslandTypes.FREE_TEXT);
  };

  const onChangeFreeTextLocationNumShowFull = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => setFreeTextLocationNumShowFull(e.target.checked);

  const onChangeFreeTextBorderAvailable = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFreeTextBorderAvailable(e.target.value as AvailableType);
    setIslandType(IslandTypes.FREE_TEXT);
  };

  // リセット
  const resetState = () => {
    const maxTableId = Number('9'.repeat(tableIdLength));
    const maxBranchNum = Number('9'.repeat(branchNumLength));

    // 丸テーブル
    const nextCircleTableId = `${
      (latestTableId > maxTableId ? 0 : latestTableId) +
      incrementalCircleTableId
    }`.padStart(tableIdLength, '0');

    const nextCircleLocationNum = '1'.padStart(branchNumLength, '0');

    setCircleLocationNum(`${nextCircleTableId}${nextCircleLocationNum}`);

    // 四角テーブル
    const nextSquareTableId = `${
      (latestTableId > maxTableId ? 0 : latestTableId) +
      incrementalSquareTableId
    }`.padStart(tableIdLength, '0');

    const nextSquareLocationNum = '1'.padStart(branchNumLength, '0');

    setSquareLocationNum(`${nextSquareTableId}${nextSquareLocationNum}`);

    // レジ
    const nextRegisterTableId = `${islandState.latestRegisterTableId}`.padStart(
      tableIdLength,
      '0'
    );

    const nextRegisterBranchNum = `${
      (islandState.latestRegisterBranchNum > maxBranchNum
        ? 0
        : islandState.latestRegisterBranchNum) + incrementalRegisterBranchNum
    }`.padStart(branchNumLength, '0');

    setRegisterLocationNum(`${nextRegisterTableId}${nextRegisterBranchNum}`);

    // フリーテキスト
    const nextFreeTextTableId = `${islandState.latestFreeTextTableId}`.padStart(
      tableIdLength,
      '0'
    );

    const nextFreeTextBranchNum = `${
      (islandState.latestFreeTextBranchNum > maxBranchNum
        ? 0
        : islandState.latestFreeTextBranchNum) + incrementalFreeTextBranchNum
    }`.padStart(branchNumLength, '0');

    setFreeTextLocationNum(`${nextFreeTextTableId}${nextFreeTextBranchNum}`);
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
      islandType,
      circleLocationNum,
      circleLocationNumInputType,
      circleLocationNumShowFull,
      circleLocationBorderAvailable,
      squareLocationNum,
      squareLocationNumInputType,
      squareLocationNumShowFull,
      squareLocationBorderAvailable,
      registerLocationNum,
      registerLocationNumInputType,
      registerLocationNumShowFull,
      registerBorderAvailable,
      freeTextValue,
      freeTextLocationNum,
      freeTextLocationNumInputType,
      freeTextLocationNumShowFull,
      freeTextBorderAvailable,
      areaIdLength: preferences.areaIdLength,
      tableIdLength,
      branchNumLength,
      locationDisplayFormatType: preferences.locationDisplayFormatType,
      customFormats: preferences.customFormats,
    });

    executeClose(e);
  };

  const condition: Condition = {
    islandType,
    circleLocationNum,
    circleLocationNumInputType,
    circleLocationNumShowFull,
    circleLocationBorderAvailable,
    squareLocationNum,
    squareLocationNumInputType,
    squareLocationNumShowFull,
    squareLocationBorderAvailable,
    registerLocationNum,
    registerLocationNumInputType,
    registerLocationNumShowFull,
    registerBorderAvailable,
    freeTextValue,
    freeTextLocationNum,
    freeTextLocationNumInputType,
    freeTextLocationNumShowFull,
    freeTextBorderAvailable,
  };

  const conditionEvent: ConditionEvent = {
    onChangeIslandType,
    onBlurCircleLocationNum,
    onChangeCircleLocationNumInputType,
    onChangeCircleLocationNumShowFull,
    onChangeCircleLocationBorderAvailable,
    onBlurSquareLocationNum,
    onChangeSquareLocationNumInputType,
    onChangeSquareLocationNumShowFull,
    onChangeSquareLocationBorderAvailable,
    onBlurRegisterLocationNum,
    onChangeRegisterLocationNumInputType,
    onChangeRegisterLocationNumShowFull,
    onChangeRegisterBorderAvailable,
    onChangeFreeTextValue,
    onBlurFreeTextLocationNum,
    onChangeFreeTextLocationNumInputType,
    onChangeFreeTextLocationNumShowFull,
    onChangeFreeTextBorderAvailable,
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
      locationNumLength={tableIdLength + branchNumLength}
      condition={condition}
      conditionEvent={conditionEvent}
      onClickClose={executeClose}
      onClickCancel={executeCancel}
      onClickSubmit={executeSubmit}
    />
  );
};
