import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactModal from 'react-modal';
import * as xlsx from 'xlsx';

import * as editorConstants from '../../constants/editor';

import { useAppDispatch } from '../../app/hooks';

import { DialogTypes, LocationDisplayFormatTypes } from '../../types';

import { actionHelper, upload } from '../../actions';
import * as api from '../../api';
import { MapData } from '../../api';

import { appModule, editorPreferenceModule } from '../../modules';
import {
  useEditorPreferenceState,
  useLatticeHeight,
  useLatticeWidth,
} from '../../selectors';

import {
  MapEditorExcelImport as Component,
  Condition,
  ConditionEvent,
  SheetInfo,
} from '../../components/pages/MapEditorExcelImport';
import { MapEditorPreference } from '../pages';

interface Props extends ReactModal.Props {
  onSuccess(data: MapData): void;
}

/**
 * Excel マップ取り込み
 */
export const MapEditorExcelImport = (props: Props) => {
  const { isOpen } = props;

  const [t] = useTranslation();
  const dispatch = useAppDispatch();

  const preferences = useEditorPreferenceState();
  const latticeWidth = useLatticeWidth();
  const latticeHeight = useLatticeHeight();

  // 初期値
  const initialData: Condition = {
    startCell: process.env.REACT_APP_START_CELL ?? 'A1',
    endCell: process.env.REACT_APP_END_CELL ?? 'B2',
    cellWidth: latticeWidth,
    cellHeight: latticeHeight,
    tableIdLength: preferences.tableIdLength,
    branchNumLength: preferences.branchNumLength,
    pillarOption: 'UNSPECIFIED',
    pillarCell: process.env.REACT_APP_PILLAR_CELL ?? '',
    importShape: true,
  };

  const [excelFile, setExcelFile] = useState<File | undefined>(
    initialData.excelFile,
  );

  const [sheetInfo, setSheetInfo] = useState<SheetInfo | undefined>(
    initialData.sheetInfo,
  );
  const [startCell, setStartCell] = useState(initialData.startCell);
  const [endCell, setEndCell] = useState(initialData.endCell);
  const [cellWidth, setCellWidth] = useState(initialData.cellWidth);
  const [cellHeight, setCellHeight] = useState(initialData.cellHeight);
  const [tableIdLength, setTableIdLength] = useState(initialData.tableIdLength);
  const [branchNumLength, setBranchNumLength] = useState(
    initialData.branchNumLength,
  );
  const [pillarOption, setPillarOption] = useState(initialData.pillarOption);
  const [pillarCell, setPillarCell] = useState(initialData.pillarCell);
  const [importShape, setImportShape] = useState(initialData.importShape);

  const [sheetNames, setSheetNames] = useState<SheetInfo[]>([]);

  const [errors, setErrors] = useState(new Map());

  const [isPreferencesOpen, setPreferencesOpen] = useState(false);

  const closePreferences = useCallback(() => setPreferencesOpen(false), []);

  // ブック
  const onChangeExcelFile = (file: File): boolean => {
    setExcelFile(file);

    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);
    fileReader.onload = (e: any) => {
      const bufferArray = e?.target.result;
      const book = xlsx.read(bufferArray, { type: 'buffer' });

      const sheets = book.SheetNames.map((name: string) => {
        return {
          label: name,
          value: {
            name: name,
            index: book.SheetNames.indexOf(name),
          },
        };
      });

      setSheetNames(sheets);
      setSheetInfo(sheets && sheets[0]);
    };
    return true;
  };

  // シート
  const onChangeSheetInfo = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setSheetInfo(JSON.parse(e.target.value));

  // 読取り範囲（開始セル）
  const onBlurStartCell = (e: React.FocusEvent<HTMLInputElement>) =>
    setStartCell(e.target.value);

  // 読取り範囲（終了セル）
  const onBlurEndCell = (e: React.FocusEvent<HTMLInputElement>) =>
    setEndCell(e.target.value);

  // セルサイズ（幅）
  const onChangeCellWidth = (value: number) => setCellWidth(value);

  // セルサイズ（高さ）
  const onChangeCellHeight = (value: number) => setCellHeight(value);

  // 桁数（テーブルID）
  const onChangeTableIdLength = (value: number) => setTableIdLength(value);

  // 桁数（枝番）
  const onChangeBranchNumLength = (value: number) => setBranchNumLength(value);

  // 柱の色（柱の位置）
  const onChangePillarOption = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setPillarOption(value as typeof initialData.pillarOption);
    setPillarCell(value === 'UNSPECIFIED' ? '' : 'A1');
  };
  const onBlurPillarCell = (e: React.FocusEvent<HTMLInputElement>) =>
    setPillarCell(e.target.value);

  // オートシェイプ
  const onChangeImportShape = (e: React.ChangeEvent<HTMLInputElement>) =>
    setImportShape(e.target.checked);

  // リセット
  const resetState = () => {
    setExcelFile(initialData.excelFile);
    setSheetInfo(initialData.sheetInfo);
    setTableIdLength(preferences.tableIdLength);
    setBranchNumLength(preferences.branchNumLength);

    setSheetNames([]);
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
    if (props.onRequestClose) {
      props.onRequestClose(e);
    }
  };

  /**
   * 入力検証
   */
  const validImportSettings = () => {
    const errorMap = new Map<string, string>();

    // ブック
    if (!excelFile) {
      errorMap.set(
        'excelFile',
        t('pages:MapEditorExcelImport.message.error.excelFile.notSet'),
      );
    }

    // 読取り範囲：開始セル
    if (!startCell) {
      errorMap.set(
        'startCell',
        t('pages:MapEditorExcelImport.message.error.startCell.notSet'),
      );
    }

    // 読取り範囲：終了セル
    if (!endCell) {
      errorMap.set(
        'endCell',
        t('pages:MapEditorExcelImport.message.error.endCell.notSet'),
      );
    }

    // セルサイズ：幅
    if (cellWidth < 5 || cellWidth > 100) {
      errorMap.set(
        'cellWidth',
        t('pages:MapEditorExcelImport.message.error.cellWidth.outOfRange', {
          from: 5,
          to: 100,
        }),
      );
    }

    // セルサイズ：高さ
    if (cellHeight < 5 || cellHeight > 100) {
      errorMap.set(
        'cellHeight',
        t('pages:MapEditorExcelImport.message.error.cellHeight.outOfRange', {
          from: 5,
          to: 100,
        }),
      );
    }

    // 桁数：テーブルID
    if (tableIdLength === 0) {
      errorMap.set(
        'tableIdLength',
        t('pages:MapEditorExcelImport.message.error.tableIdLength.notZero'),
      );
    }

    // 桁数：枝番
    if (branchNumLength === 0) {
      errorMap.set(
        'branchNumLength',
        t('pages:MapEditorExcelImport.message.error.branchNumLength.notZero'),
      );
    }
    setErrors(errorMap);

    return errorMap;
  };

  /**
   * Excel ファイルアップロード
   */
  const executeSubmit = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    // 入力検証
    const errorMap = validImportSettings();
    if (Array.from(errorMap.keys()).length > 0 || !excelFile) {
      dispatch(
        appModule.actions.updateAlertDialog({
          type: DialogTypes.ERROR,
          message: t('pages:MapEditorExcelImport.message.error.settingError'),
        }),
      );
      return;
    }

    // テーブルID＋枝番が7桁以上の場合は、表示用ロケーション番号のカスタムフォーマット設定が必須
    const locationLength = tableIdLength + branchNumLength;
    if (
      locationLength > editorConstants.DISPLAY_LOCATION_NUM_MAX_LENGTH &&
      (preferences.locationDisplayFormatType !==
        LocationDisplayFormatTypes.CUSTOM ||
        preferences.customFormats.length === 0)
    ) {
      // 指定内容を環境設定に反映
      dispatch(
        editorPreferenceModule.actions.updatePreference({
          ...preferences,
          latticeWidth: cellWidth,
          latticeHeight: cellHeight,
          tableIdLength,
          branchNumLength,
          locationDisplayFormatType: LocationDisplayFormatTypes.CUSTOM,
          customFormats: [],
        }),
      );

      // 環境設定を促す
      dispatch(
        appModule.actions.updateAlertDialog({
          type: DialogTypes.ERROR,
          message: t('pages:MapEditorExcelImport.message.error.formatNotSet', {
            maxLength: editorConstants.DISPLAY_LOCATION_NUM_MAX_LENGTH + 1,
          }),
          positiveAction: () => setPreferencesOpen(true),
        }),
      );
      return;
    }

    (async () => {
      dispatch(appModule.actions.updateLoading(true));

      const parameters: api.ImportExcelApiUploadCondition = {
        sheetName: sheetInfo?.value.name,
        sheetIndex: sheetInfo?.value.index ?? 0,
        startCell,
        endCell,
        cellWidth,
        cellHeight,
        tableIdLength,
        branchNumLength,
        pillarCell,
        importShape,
      };

      await dispatch(
        upload(
          parameters,
          excelFile,
          (result: api.ImportExcelApiUploadResult) => {
            props.onSuccess(result.data);

            dispatch(appModule.actions.updateLoading(false));

            executeClose(e);
          },
          ({ e, result }) => {
            if (result) {
              dispatch(
                appModule.actions.updateAlertDialog({
                  type: DialogTypes.ERROR,
                  message: `${result?.error}`,
                }),
              );

              dispatch(appModule.actions.updateLoading(false));
            } else {
              actionHelper.showErrorDialog(e, dispatch);
            }
          },
        ),
      );
    })();
  };

  const condition: Condition = {
    excelFile,
    sheetInfo,
    startCell,
    endCell,
    cellWidth,
    cellHeight,
    tableIdLength,
    branchNumLength,
    pillarOption,
    pillarCell,
    importShape,
  };

  const conditionEvent: ConditionEvent = {
    onChangeExcelFile,
    onChangeSheetInfo,
    onBlurStartCell,
    onBlurEndCell,
    onChangeCellWidth,
    onChangeCellHeight,
    onChangeTableIdLength,
    onChangeBranchNumLength,
    onChangePillarOption,
    onBlurPillarCell,
    onChangeImportShape,
  };

  /**
   * 初期表示処理
   */
  useEffect(() => {
    if (!isOpen) {
      return;
    }
    resetState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <>
      <Component
        {...props}
        sheetNames={sheetNames}
        latticeWidth={latticeWidth}
        latticeHeight={latticeHeight}
        condition={condition}
        conditionEvent={conditionEvent}
        errors={errors}
        onClickClose={executeClose}
        onClickCancel={executeCancel}
        onClickSubmit={executeSubmit}
      />
      <MapEditorPreference
        isOpen={isPreferencesOpen}
        onRequestClose={closePreferences}
      />
    </>
  );
};
