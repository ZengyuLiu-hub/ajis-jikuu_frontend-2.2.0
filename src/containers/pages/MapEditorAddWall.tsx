import React, { useState, useEffect } from 'react';
import ReactModal from 'react-modal';

import {
  InputType,
  InputTypes,
  GondolaAlignment,
  GondolaAlignments,
  WallAlignment,
  WallAlignments,
  LocationDisplayFormatType,
  LocationCustomFormat,
} from '../../types';
import {
  useBranchNumLength,
  useEditorPreferenceState,
  useEditorWallState,
  useTableIdLength,
} from '../../selectors';

import {
  MapEditorAddWall as Component,
  Condition,
  ConditionEvent,
  StartingPointData,
} from '../../components/pages/MapEditorAddWall';

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

export const MapEditorAddWall = (props: Props) => {
  const { isOpen } = props;

  const preferences = useEditorPreferenceState();
  const tableIdLength = useTableIdLength();
  const branchNumLength = useBranchNumLength();

  const wallState = useEditorWallState();

  // 初期値
  const initialData: Condition = {
    startLocationNum: '',
    locationNumInputType: InputTypes.AUTO,
    gondolaAlignment: GondolaAlignments.HORIZONTAL,
    wallAlignment: WallAlignments.FW,
    allViewFullLocationNum: false,
    gondolaWidthCells: 10,
    gondolaDepthCells: 5,
    numOfGondola: 5,
    repeatCount: 1,
    incrementalBranchNum: 1,
    startingGondola: 4,
  };

  // 開始ロケーション番号
  const [startLocationNum, setStartLocationNum] = useState<string>(
    initialData.startLocationNum,
  );

  // 指定/自動
  const [locationNumInputType, setLocationNumInputType] = useState<InputType>(
    initialData.locationNumInputType,
  );

  // ゴンドラの向き（縦、横）
  const [gondolaAlignment, setGondolaAlignment] = useState<GondolaAlignment>(
    initialData.gondolaAlignment,
  );

  // ウォールの向き（FW, LW, BW, RW）
  const [wallAlignment, setWallAlignment] = useState<WallAlignment>(
    initialData.wallAlignment,
  );

  // 全フル桁表示
  const [allViewFullLocationNum, setAllViewFullLocationNum] = useState(
    initialData.allViewFullLocationNum,
  );

  // ゴンドラの幅
  const [gondolaWidthCells, setGondolaWidthCells] = useState<number>(
    initialData.gondolaWidthCells,
  );

  // ゴンドラの奥行き
  const [gondolaDepthCells, setGondolaDepthCells] = useState<number>(
    initialData.gondolaDepthCells,
  );

  // ゴンドラの数
  const [numOfGondola, setNumOfGondola] = useState<number>(
    initialData.numOfGondola,
  );

  // 繰り返しの回数
  const [repeatCount, setRepeatCount] = useState<number>(
    initialData.repeatCount,
  );

  // 枝番の増分値
  const [incrementalBranchNum, setIncrementalBranchNum] = useState<number>(
    initialData.incrementalBranchNum,
  );

  // 起点ゴンドラ
  const [startingGondola, setStartingGondola] = useState<number>(
    initialData.startingGondola,
  );

  const [startingPointData, setStartingPointData] = useState<
    StartingPointData[]
  >([
    { key: 1, label: '01', selectable: true },
    { key: 2, label: '02', selectable: false },
    { key: 3, label: '03', selectable: false },
    { key: 4, label: '04', selectable: true },
  ]);

  useEffect(() => {
    if (startingGondola === 1) {
      setStartingPointData([
        { key: 1, label: '01', selectable: true },
        { key: 2, label: '02', selectable: false },
        { key: 3, label: '03', selectable: false },
        { key: 4, label: '04', selectable: true },
      ]);
    } else if (startingGondola === 4) {
      setStartingPointData([
        { key: 1, label: '04', selectable: true },
        { key: 2, label: '03', selectable: false },
        { key: 3, label: '02', selectable: false },
        { key: 4, label: '01', selectable: true },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startingGondola]);

  // 開始ロケーション番号
  const onBlurStartLocationNum = (e: React.FocusEvent<HTMLInputElement>) =>
    setStartLocationNum(e.target.value);

  // 指定/自動
  const onChangeLocationNumInputType = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setLocationNumInputType(e.target.value as InputType);
  };

  // ゴンドラの向き（縦、横）
  const onChangeGondolaAlignment = (e: React.ChangeEvent<HTMLInputElement>) =>
    setGondolaAlignment(e.target.value as GondolaAlignment);

  const resetStartBranchNum = (align: WallAlignment) => {
    const maxBranchNum = Number('9'.repeat(branchNumLength));

    if (align === WallAlignments.FW) {
      const tableId = '81'.padStart(tableIdLength, '0');
      const latestBranchNum = wallState.latestFrontWallBranchNum;
      const nextBranchNum =
        (latestBranchNum > maxBranchNum ? 0 : latestBranchNum) +
        incrementalBranchNum;

      setStartLocationNum(
        tableId + `${nextBranchNum}`.padStart(branchNumLength, '0'),
      );
      setGondolaAlignment(GondolaAlignments.HORIZONTAL);
      setStartingGondola(4);
    } else if (align === WallAlignments.LW) {
      const tableId = '82'.padStart(tableIdLength, '0');
      const latestBranchNum = wallState.latestLeftWallBranchNum;
      const nextBranchNum =
        (latestBranchNum > maxBranchNum ? 0 : latestBranchNum) +
        incrementalBranchNum;

      setStartLocationNum(
        tableId + `${nextBranchNum}`.padStart(branchNumLength, '0'),
      );
      setGondolaAlignment(GondolaAlignments.VERTICAL);
      setStartingGondola(4);
    } else if (align === WallAlignments.BW) {
      const tableId = '83'.padStart(tableIdLength, '0');
      const latestBranchNum = wallState.latestBackWallBranchNum;
      const nextBranchNum =
        (latestBranchNum > maxBranchNum ? 0 : latestBranchNum) +
        incrementalBranchNum;

      setStartLocationNum(
        tableId + `${nextBranchNum}`.padStart(branchNumLength, '0'),
      );
      setGondolaAlignment(GondolaAlignments.HORIZONTAL);
      setStartingGondola(1);
    } else if (align === WallAlignments.RW) {
      const tableId = '84'.padStart(tableIdLength, '0');
      const latestBranchNum = wallState.latestRightWallBranchNum;
      const nextBranchNum =
        (latestBranchNum > maxBranchNum ? 0 : latestBranchNum) +
        incrementalBranchNum;

      setStartLocationNum(
        tableId + `${nextBranchNum}`.padStart(branchNumLength, '0'),
      );
      setGondolaAlignment(GondolaAlignments.VERTICAL);
      setStartingGondola(1);
    }
  };

  // ウォールの向き（FW, LW, BW, RW）
  const onChangeWallAlignment = (e: React.ChangeEvent<HTMLInputElement>) => {
    const align = e.target.value as WallAlignment;
    setWallAlignment(align);

    resetStartBranchNum(align);
  };

  // 全フル桁表示
  const onChangeAllViewFullLocationNum = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => setAllViewFullLocationNum(e.target.checked);

  // ゴンドラの幅
  const onChangeGondolaWidthCells = (value: number) =>
    setGondolaWidthCells(value);

  // ゴンドラの奥行き
  const onChangeGondolaDepthCells = (value: number) =>
    setGondolaDepthCells(value);

  // ゴンドラ数
  const onChangeNumOfGondola = (value: number) => setNumOfGondola(value);

  // 繰り返し回数
  const onChangeRepeatCount = (value: number) => setRepeatCount(value);

  // 枝番の増分値
  const onChangeIncrementalLocationNum = (value: number) =>
    setIncrementalBranchNum(value);

  // 起点ゴンドラ
  const onChangeStartingGondola = (e: number) => setStartingGondola(e);

  // リセット
  const resetState = () => {
    resetStartBranchNum(wallAlignment);
  };

  // とじる
  const executeClose = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (props.onRequestClose) {
      props.onRequestClose(e);
    }
  };

  // キャンセル
  const executeCancel = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    props.onCancel();

    if (props.onRequestClose) {
      props.onRequestClose(e);
    }
  };

  // 反映
  const executeSubmit = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    props.onSuccess({
      startLocationNum,
      locationNumInputType,
      gondolaAlignment,
      wallAlignment,
      allViewFullLocationNum,
      gondolaWidthCells,
      gondolaDepthCells,
      numOfGondola,
      repeatCount,
      incrementalBranchNum,
      startingGondola,
      areaIdLength: preferences.areaIdLength,
      tableIdLength,
      branchNumLength,
      locationDisplayFormatType: preferences.locationDisplayFormatType,
      customFormats: preferences.customFormats,
    });

    executeClose(e);
  };

  const condition: Condition = {
    startLocationNum,
    locationNumInputType,
    gondolaAlignment,
    wallAlignment,
    allViewFullLocationNum,
    gondolaWidthCells,
    gondolaDepthCells,
    numOfGondola,
    repeatCount,
    incrementalBranchNum,
    startingGondola,
  };

  const conditionEvent: ConditionEvent = {
    onBlurStartLocationNum,
    onChangeLocationNumInputType,
    onChangeGondolaAlignment,
    onChangeWallAlignment,
    onChangeAllViewFullLocationNum,
    onChangeGondolaWidthCells,
    onChangeGondolaDepthCells,
    onChangeNumOfGondola,
    onChangeRepeatCount,
    onChangeIncrementalLocationNum,
    onChangeStartingGondola,
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
      startingPointData={startingPointData}
      onClickClose={executeClose}
      onClickCancel={executeCancel}
      onClickSubmit={executeSubmit}
    />
  );
};
