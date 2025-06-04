import React, { useState, useEffect } from 'react';
import ReactModal from 'react-modal';

import {
  InputType,
  InputTypes,
  GondolaAlignment,
  GondolaAlignments,
  NumberingRule,
  NumberingRules,
  TableEndTypes,
  TableEndType,
  Direction,
  Directions,
  LocationDisplayFormatType,
  LocationCustomFormat,
  RepeatDirection,
  RepeatDirections,
} from '../../types';
import {
  useAddTableLatestTableId,
  useBranchNumLength,
  useEditorPreferenceState,
  useTableIdLength,
} from '../../selectors';

import {
  MapEditorAddTable as Component,
  Condition,
  ConditionEvent,
  StartingPointData,
} from '../../components/pages/MapEditorAddTable';

export type Result = {
  firstEndType: TableEndType;
  lastEndType: TableEndType;
  firstEndDirection: Direction;
  lastEndDirection: Direction;
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
 * テーブル追加
 */
export const MapEditorAddTable = (props: Props) => {
  const { isOpen } = props;

  const latestTableId = useAddTableLatestTableId();

  const preferences = useEditorPreferenceState();
  const tableIdLength = useTableIdLength();
  const branchNumLength = useBranchNumLength();

  // 初期値
  const initialData: Condition = {
    tableEndType: TableEndTypes.BASIC,
    startLocationNum: '0101',
    locationNumInputType: InputTypes.AUTO,
    numberingRule: NumberingRules.COUNTER_CLOCKWISE,
    allViewFullLocationNum: false,
    gondolaAlignment: GondolaAlignments.VERTICAL,
    numOfSideLocation: 4,
    gondolaWidthCells: 10,
    gondolaDepthCells: 5,
    repeatDirection: RepeatDirections.TOP,
    repeatGapCells: 10,
    repeatCount: 1,
    incrementalTableId: 1,
    startingGondola: 6,
  };

  // テーブルID
  const [incrementalTableId, setIncrementalTableId] = useState(
    initialData.incrementalTableId,
  );

  // ロケーション番号指定タイプ
  const [locationNumInputType, setLocationNumInputType] = useState<InputType>(
    initialData.locationNumInputType,
  );

  // テーブルエンド種別
  const [tableEndType, setTableEndType] = useState<TableEndType>(
    initialData.tableEndType,
  );

  // ロケーション番号
  const [startLocationNum, setStartLocationNum] = useState(
    initialData.startLocationNum,
  );

  // ナンバリングルール
  const [numberingRule, setNumberingRule] = useState<NumberingRule>(
    initialData.numberingRule,
  );

  // 全フル桁表示
  const [allViewFullLocationNum, setAllViewFullLocationNum] = useState(
    initialData.allViewFullLocationNum,
  );

  // 向き
  const [gondolaAlignment, setGondolaAlignment] = useState<GondolaAlignment>(
    initialData.gondolaAlignment,
  );

  // サイドロケーション数
  const [numOfSideLocation, setNumOfSideLocation] = useState<number>(
    initialData.numOfSideLocation,
  );

  // ゴンドラの幅
  const [gondolaWidthCells, setGondolaWidthCells] = useState(
    initialData.gondolaWidthCells,
  );

  // ゴンドラの奥行き
  const [gondolaDepthCells, setGondolaDepthCells] = useState(
    initialData.gondolaDepthCells,
  );

  // 繰返し向き
  const [repeatDirection, setRepeatDirection] = useState<RepeatDirection>(
    initialData.repeatDirection,
  );

  // 繰返し間隔
  const [repeatGapCells, setRepeatGapCells] = useState(
    initialData.repeatGapCells,
  );

  // 繰返し回数
  const [repeatCount, setRepeatCount] = useState(initialData.repeatCount);

  // テーブルの起点
  const [startingGondola, setStartingGondola] = useState(
    initialData.startingGondola,
  );
  const [restartedGondola, setRestartedGondola] = useState(false);

  const [startingPointData, setStartingPointData] = useState<
    StartingPointData[]
  >([
    { key: 1, label: '04', selectable: true, tableType: TableEndTypes.BASIC },
    { key: 2, label: '05', selectable: false, tableType: TableEndTypes.BASIC },
    { key: 3, label: '03', selectable: false, tableType: TableEndTypes.BASIC },
    { key: 4, label: '06', selectable: false, tableType: TableEndTypes.BASIC },
    { key: 5, label: '02', selectable: false, tableType: TableEndTypes.BASIC },
    { key: 6, label: '01', selectable: true, tableType: TableEndTypes.BASIC },
  ]);

  const hasNoTableEnd = (endKey: number) =>
    startingPointData.some(
      ({ key, tableType }) =>
        key === endKey && tableType === TableEndTypes.NO_END,
    );

  useEffect(() => {
    if (!restartedGondola) {
      return;
    }
    if (NumberingRules.COUNTER_CLOCKWISE === numberingRule) {
      // 反時計回り
      if (startingGondola === 1) {
        // key1から開始
        const noFrontend = hasNoTableEnd(1);
        const noBackend = hasNoTableEnd(6);
        const noAllEnd = noFrontend && noBackend;
        const noAnyEnd = noFrontend || noBackend;
        setStartingPointData((current) =>
          current.map((d) => {
            if (d.key === 1) {
              return { ...d, label: noFrontend ? '' : '01' };
            }
            if (d.key === 2) {
              return { ...d, label: noFrontend ? '01' : '02' };
            }
            if (d.key === 3) {
              return { ...d, label: noAllEnd ? '04' : noAnyEnd ? '05' : '06' };
            }
            if (d.key === 4) {
              return { ...d, label: noFrontend ? '02' : '03' };
            }
            if (d.key === 5) {
              return { ...d, label: noAllEnd ? '03' : noAnyEnd ? '04' : '05' };
            }
            if (d.key === 6) {
              return { ...d, label: noBackend ? '' : noFrontend ? '03' : '04' };
            }
            return d;
          }),
        );
      } else if (startingGondola === 6) {
        // key6から開始
        const noFrontend = hasNoTableEnd(6);
        const noBackend = hasNoTableEnd(1);
        const noAllEnd = noFrontend && noBackend;
        const noAnyEnd = noFrontend || noBackend;
        setStartingPointData((current) =>
          current.map((d) => {
            if (d.key === 1) {
              return { ...d, label: noBackend ? '' : noFrontend ? '03' : '04' };
            }
            if (d.key === 2) {
              return { ...d, label: noAllEnd ? '03' : noAnyEnd ? '04' : '05' };
            }
            if (d.key === 3) {
              return { ...d, label: noFrontend ? '02' : '03' };
            }
            if (d.key === 4) {
              return { ...d, label: noAllEnd ? '04' : noAnyEnd ? '05' : '06' };
            }
            if (d.key === 5) {
              return { ...d, label: noFrontend ? '01' : '02' };
            }
            if (d.key === 6) {
              return { ...d, label: noFrontend ? '' : '01' };
            }
            return d;
          }),
        );
      }
    } else {
      // 時計回り
      if (startingGondola === 1) {
        // key1から開始
        const noFrontend = hasNoTableEnd(1);
        const noBackend = hasNoTableEnd(6);
        const noAllEnd = noFrontend && noBackend;
        const noAnyEnd = noFrontend || noBackend;
        setStartingPointData((current) =>
          current.map((d) => {
            if (d.key === 1) {
              return { ...d, label: noFrontend ? '' : '01' };
            }
            if (d.key === 2) {
              return { ...d, label: noAllEnd ? '04' : noAnyEnd ? '05' : '06' };
            }
            if (d.key === 3) {
              return { ...d, label: noFrontend ? '01' : '02' };
            }
            if (d.key === 4) {
              return { ...d, label: noAllEnd ? '03' : noAnyEnd ? '04' : '05' };
            }
            if (d.key === 5) {
              return { ...d, label: noFrontend ? '02' : '03' };
            }
            if (d.key === 6) {
              return { ...d, label: noBackend ? '' : noFrontend ? '03' : '04' };
            }
            return d;
          }),
        );
      } else if (startingGondola === 6) {
        // key6から開始
        const noFrontend = hasNoTableEnd(6);
        const noBackend = hasNoTableEnd(1);
        const noAllEnd = noFrontend && noBackend;
        const noAnyEnd = noFrontend || noBackend;
        setStartingPointData((current) =>
          current.map((d) => {
            if (d.key === 1) {
              return { ...d, label: noBackend ? '' : noFrontend ? '03' : '04' };
            }
            if (d.key === 2) {
              return { ...d, label: noFrontend ? '02' : '03' };
            }
            if (d.key === 3) {
              return { ...d, label: noAllEnd ? '03' : noAnyEnd ? '04' : '05' };
            }
            if (d.key === 4) {
              return { ...d, label: noFrontend ? '01' : '02' };
            }
            if (d.key === 5) {
              return { ...d, label: noAllEnd ? '04' : noAnyEnd ? '05' : '06' };
            }
            if (d.key === 6) {
              return { ...d, label: noFrontend ? '' : '01' };
            }
            return d;
          }),
        );
      }
    }
    setRestartedGondola(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restartedGondola]);

  useEffect(() => {
    setRestartedGondola(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numberingRule, startingGondola]);

  // テーブルエンド種別
  const onChangeTableEndType = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTableEndType(e.target.value as TableEndType);
  };

  // ロケーション番号
  const onBlurStartLocationNum = (e: React.FocusEvent<HTMLInputElement>) =>
    setStartLocationNum(e.target.value);

  // ロケーション番号指定タイプ
  const onChangeLocationNumInputType = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setLocationNumInputType(e.target.value as InputType);

    const maxTableId = Number('9'.repeat(tableIdLength));
    const nextTableId =
      (latestTableId > maxTableId ? 0 : latestTableId) + incrementalTableId;
    setStartLocationNum(
      `${nextTableId}`.padStart(tableIdLength, '0') +
        '1'.padStart(branchNumLength, '0'),
    );
  };

  // ナンバリングルール
  const onChangeNumberingRule = (e: React.ChangeEvent<HTMLInputElement>) =>
    setNumberingRule(e.target.value as NumberingRule);

  // 全フル桁表示
  const onChangeAllViewFullLocationNum = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => setAllViewFullLocationNum(e.target.checked);

  // 向き
  const onChangeGondolaAlignment = (e: React.ChangeEvent<HTMLInputElement>) =>
    setGondolaAlignment(e.target.value as GondolaAlignment);

  // サイドロケーション数
  const onChangeNumOfSideLocation = (value: number) =>
    setNumOfSideLocation(value);

  // ゴンドラの幅
  const onChangeGondolaWidthCells = (value: number) =>
    setGondolaWidthCells(value);

  // ゴンドラの奥行き
  const onChangeGondolaDepthCells = (value: number) =>
    setGondolaDepthCells(value);

  // 繰返し向き
  const onChangeRepeatDirection = (e: React.ChangeEvent<HTMLInputElement>) =>
    setRepeatDirection(e.target.value as RepeatDirection);

  // 繰返し間隔
  const onChangeRepeatGapCells = (value: number) => setRepeatGapCells(value);

  // 繰返し回数
  const onChangeRepeatCount = (value: number) => setRepeatCount(value);

  // テーブルID
  const onChangeIncrementalTableId = (e: React.ChangeEvent<HTMLInputElement>) =>
    setIncrementalTableId(Number(e.target.value));

  // テーブルの起点
  const onChangeStartingGondola = (e: number) => setStartingGondola(e);

  // テーブルのエンド
  const onChangeToMeshend = (e: number) => {
    const rotatedTableType = ({ tableType: current }: StartingPointData) => {
      const selectableTableTypes = Object.values(TableEndTypes);
      return (
        selectableTableTypes.at(selectableTableTypes.indexOf(current) + 1) ??
        TableEndTypes.BASIC
      );
    };

    setStartingPointData((current) =>
      current.map((d) => {
        if (d.key === e) {
          setRestartedGondola(true);
          return { ...d, tableType: rotatedTableType(d) };
        }
        return d;
      }),
    );
  };

  // リセット
  const resetState = () => {
    const maxTableId = Number('9'.repeat(tableIdLength));

    const nextTableId =
      (latestTableId > maxTableId ? 0 : latestTableId) + incrementalTableId;

    if (locationNumInputType === InputTypes.AUTO) {
      setStartLocationNum(
        `${nextTableId}`.padStart(tableIdLength, '0') +
          '1'.padStart(branchNumLength, '0'),
      );
    }
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
    const firstEndType =
      startingPointData.find((d) => {
        if (startingGondola === 6) {
          return d.key === 6;
        }
        return d.key === 1;
      })?.tableType ?? TableEndTypes.BASIC;

    const lastEndType =
      startingPointData.find((d) => {
        if (startingGondola === 6) {
          return d.key === 1;
        }
        return d.key === 6;
      })?.tableType ?? TableEndTypes.BASIC;

    const firstEndDirection =
      GondolaAlignments.VERTICAL === gondolaAlignment
        ? Directions.TOP
        : Directions.LEFT;

    const lastEndDirection =
      GondolaAlignments.VERTICAL === gondolaAlignment
        ? Directions.BOTTOM
        : Directions.RIGHT;

    props.onSuccess({
      tableEndType,
      startLocationNum,
      locationNumInputType,
      numberingRule,
      allViewFullLocationNum,
      gondolaAlignment,
      numOfSideLocation,
      gondolaWidthCells,
      gondolaDepthCells,
      repeatDirection,
      repeatGapCells,
      repeatCount,
      incrementalTableId,
      startingGondola,
      firstEndType,
      lastEndType,
      firstEndDirection,
      lastEndDirection,
      areaIdLength: preferences.areaIdLength,
      tableIdLength,
      branchNumLength,
      locationDisplayFormatType: preferences.locationDisplayFormatType,
      customFormats: preferences.customFormats,
    });

    executeClose(e);
  };

  const condition: Condition = {
    tableEndType,
    startLocationNum,
    locationNumInputType,
    numberingRule,
    allViewFullLocationNum,
    gondolaAlignment,
    numOfSideLocation,
    gondolaWidthCells,
    gondolaDepthCells,
    repeatDirection,
    repeatGapCells,
    repeatCount,
    incrementalTableId,
    startingGondola,
  };

  const conditionEvent: ConditionEvent = {
    onChangeTableEndType,
    onBlurStartLocationNum,
    onChangeLocationNumInputType,
    onChangeNumberingRule,
    onChangeAllViewFullLocationNum,
    onChangeGondolaAlignment,
    onChangeNumOfSideLocation,
    onChangeGondolaWidthCells,
    onChangeGondolaDepthCells,
    onChangeRepeatDirection,
    onChangeRepeatGapCells,
    onChangeRepeatCount,
    onChangeIncrementalTableId,
    onChangeStartingGondola,
    onChangeToMeshend,
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
