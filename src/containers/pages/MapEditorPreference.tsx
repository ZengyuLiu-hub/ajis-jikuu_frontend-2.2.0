import React, { useCallback, useState, useEffect } from 'react';
import ReactModal from 'react-modal';
import { useTranslation } from 'react-i18next';

import * as editorConstants from '../../constants/editor';

import {
  DialogTypes,
  LocationCustomFormat,
  LocationDisplayFormatType,
  LocationDisplayFormatTypes,
  MapPdfPaperSize,
  ScreenCaptureRange,
  StageRegulationSize,
  StageRegulationSizes,
} from '../../types';
import { useAppDispatch } from '../../app/hooks';

import { EditorUtil } from '../../utils/EditorUtil';

import {
  appModule,
  editorModule,
  editorPreferenceModule,
  editorShapeModule,
} from '../../modules';
import { useEditorPreferenceState } from '../../selectors';

import {
  MapEditorPreference as Component,
  Condition,
  ConditionEvent,
} from '../../components/pages/MapEditorPreference';
import { MapEditorLocationDisplayFormatSetting } from './MapEditorLocationDisplayFormatSetting';

interface Props extends ReactModal.Props {}

export const MapEditorPreference = (props: Props) => {
  const { isOpen } = props;

  const [t] = useTranslation();
  const dispatch = useAppDispatch();

  const preferences = useEditorPreferenceState();

  // 規定サイズ
  const regulationSizes: any[] = [
    {
      value: StageRegulationSizes.VERY_SMALL,
      label: t('pages:MapEditorPreference.stageSize.regulationSize.verySmall'),
    },
    {
      value: StageRegulationSizes.SMALL,
      label: t('pages:MapEditorPreference.stageSize.regulationSize.small'),
    },
    {
      value: StageRegulationSizes.MEDIUM,
      label: t('pages:MapEditorPreference.stageSize.regulationSize.medium'),
    },
    {
      value: StageRegulationSizes.LARGE,
      label: t('pages:MapEditorPreference.stageSize.regulationSize.large'),
    },
    {
      value: StageRegulationSizes.EXTRA_LARGE,
      label: t('pages:MapEditorPreference.stageSize.regulationSize.extraLarge'),
    },
  ];

  // 初期値
  const initialData: Condition = {
    stageWidth: EditorUtil.stageRegulationSizeToPixel(
      StageRegulationSizes.VERY_SMALL,
    ).width,
    stageHeight: EditorUtil.stageRegulationSizeToPixel(
      StageRegulationSizes.VERY_SMALL,
    ).height,
    latticeWidth: preferences.latticeWidth,
    latticeHeight: preferences.latticeHeight,
    showLattice: preferences.enabledLattice,
    showRulers: preferences.enabledRulers,
    screenCaptureRange: preferences.screenCaptureRange,
    printSize: preferences.printSize,
    areaIdLength: preferences.areaIdLength,
    tableIdLength: preferences.tableIdLength,
    branchNumLength: preferences.branchNumLength,
    locationDisplayFormatType: LocationDisplayFormatTypes.STANDARD,
    fontSize: editorConstants.FONT_SIZE_BASE,
  };

  const [stageWidth, setStageWidth] = useState(initialData.stageWidth);
  const [stageHeight, setStageHeight] = useState(initialData.stageHeight);
  const [regulationSize, setRegulationSize] = useState(
    initialData.regulationSize,
  );
  const [showLattice, setShowLattice] = useState(initialData.showLattice);
  const [latticeWidth, setLatticeWidth] = useState(initialData.latticeWidth);
  const [latticeHeight, setLatticeHeight] = useState(initialData.latticeHeight);
  const [showRulers, setShowRulers] = useState(initialData.showRulers);
  const [screenCaptureRange, setScreenCaptureRange] =
    useState<ScreenCaptureRange>(initialData.screenCaptureRange);
  const [printSize, setPrintSize] = useState(initialData.printSize);
  const [areaIdLength, setAreaIdLength] = useState(initialData.areaIdLength);
  const [tableIdLength, setTableIdLength] = useState(initialData.tableIdLength);
  const [branchNumLength, setBranchNumLength] = useState(
    initialData.branchNumLength,
  );
  const [locationDisplayFormatType, setLocationDisplayFormatType] = useState(
    initialData.locationDisplayFormatType,
  );
  const [customFormats, setCustomFormats] = useState<LocationCustomFormat[]>(
    [],
  );
  const [fontSize, setFontSize] = useState(initialData.fontSize);

  const [
    isLocationDisplayFormatSettingOpen,
    setLocationDisplayFormatSettingOpen,
  ] = useState(false);

  // ステージサイズ：幅
  const onChangeStageWidth = (value: number) => {
    setStageWidth(value);
    setRegulationSize(undefined);
  };

  // ステージサイズ：高さ
  const onChangeStageHeight = (value: number) => {
    setStageHeight(value);
    setRegulationSize(undefined);
  };

  // ステージサイズ：規定サイズ
  const onChangeRegulationSize = (size: StageRegulationSize) => {
    setRegulationSize(size);

    if (size) {
      const newPageSize = EditorUtil.stageRegulationSizeToPixel(size);
      setStageWidth(newPageSize.width);
      setStageHeight(newPageSize.height);
    }
  };

  // 格子：表示有無
  const onChangeShowLattice = (e: React.ChangeEvent<HTMLInputElement>) =>
    setShowLattice(e.target.checked);

  // 格子：幅
  const onChangeLatticeWidth = (value: number) => setLatticeWidth(value);

  // 格子：高さ
  const onChangeLatticeHeight = (value: number) => setLatticeHeight(value);

  // ルーラー：表示有無
  const onChangeShowRulers = (e: React.ChangeEvent<HTMLInputElement>) =>
    setShowRulers(e.target.checked);

  // 画面キャプチャ範囲
  const onChangeScreenCaptureRange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setScreenCaptureRange(e.target.value as ScreenCaptureRange);

  // マップ PDF 用紙サイズ
  const onChangePrintSize = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPrintSize(e.target.value as MapPdfPaperSize);

  // 桁数：エリアID
  const onChangeAreaIdLength = (value: number) => setAreaIdLength(value);

  // 桁数：テーブルID
  const onChangeTableIdLength = (value: number) => {
    setTableIdLength(value);
    setCustomFormats([]);
  };

  // 桁数：枝番
  const onChangeBranchNumLength = (value: number) => {
    setBranchNumLength(value);
    setCustomFormats([]);
  };

  // 表示用ロケーション書式：選択
  const onChangeLocationDisplayFormatType = (
    type: LocationDisplayFormatType,
  ) => {
    setLocationDisplayFormatType(type);
    if (type === LocationDisplayFormatTypes.STANDARD) {
      setCustomFormats([]);
    }
  };

  // 初期値：フォントサイズ
  const onChangeFontSize = (value: number) => setFontSize(value);

  // 表示用ロケーション書式：書式設定画面を閉じる
  const closeLocationDisplayFormatSetting = useCallback(
    () => setLocationDisplayFormatSettingOpen(false),
    [],
  );

  // 表示用ロケーション書式：書式
  const successLocationDisplayFormatSetting = useCallback(
    (customFormats: LocationCustomFormat[]) => {
      setCustomFormats(customFormats);
    },
    [],
  );

  /**
   * 画面をリセット
   */
  const resetState = () => {
    setStageWidth(preferences.stageWidth);
    setStageHeight(preferences.stageHeight);
    setLatticeWidth(preferences.latticeWidth);
    setLatticeHeight(preferences.latticeHeight);
    setShowLattice(preferences.enabledLattice);
    setShowRulers(preferences.enabledRulers);
    setScreenCaptureRange(preferences.screenCaptureRange);
    setPrintSize(preferences.printSize);
    setAreaIdLength(preferences.areaIdLength);
    setTableIdLength(preferences.tableIdLength);
    setBranchNumLength(preferences.branchNumLength);
    setLocationDisplayFormatType(preferences.locationDisplayFormatType);
    setCustomFormats(preferences.customFormats);
    setFontSize(preferences.fontSize);

    dispatch(editorModule.actions.updateShowingModal(true));
  };

  const showLocationDisplayFormatSetting = () => {
    setLocationDisplayFormatSettingOpen(true);
  };

  /**
   * 閉じる
   */
  const handleClickClose = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    dispatch(editorModule.actions.updateShowingModal(false));

    if (props.onRequestClose) {
      props.onRequestClose(e);
    }
  };

  /**
   * キャンセルボタン押下
   */
  const handleClickCancel = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    handleClickClose(e);
  };

  /**
   * 反映操作検証処理
   */
  const validSubmit = () => {
    const locationLength = tableIdLength + branchNumLength;

    // ロケーション番号の桁数が最大桁より大きい
    if (locationLength > editorConstants.DISPLAY_LOCATION_NUM_MAX_LENGTH) {
      // 書式が標準
      if (locationDisplayFormatType === LocationDisplayFormatTypes.STANDARD) {
        dispatch(
          appModule.actions.updateAlertDialog({
            type: DialogTypes.ERROR,
            message: t('pages:MapEditorPreference.message.error.formatType', {
              maxLength: editorConstants.DISPLAY_LOCATION_NUM_MAX_LENGTH,
            }),
          }),
        );
        return false;
      }

      // カスタム設定が未設定
      if (
        locationDisplayFormatType === LocationDisplayFormatTypes.CUSTOM &&
        customFormats.length === 0
      ) {
        dispatch(
          appModule.actions.updateAlertDialog({
            type: DialogTypes.ERROR,
            message: t('pages:MapEditorPreference.message.error.formatNotSet'),
          }),
        );
        return false;
      }
    }
    return true;
  };

  /**
   * 反映ボタン押下
   */
  const handleClickSubmit = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    // 検証
    if (!validSubmit()) {
      return;
    }

    // 環境設定更新
    dispatch(
      editorPreferenceModule.actions.updatePreference({
        stageWidth,
        stageHeight,
        latticeWidth,
        latticeHeight,
        enabledLattice: showLattice,
        enabledRulers: showRulers,
        screenCaptureRange,
        printSize,
        areaIdLength,
        tableIdLength,
        branchNumLength,
        locationDisplayFormatType,
        customFormats,
        fontSize,
      }),
    );

    // 未保存状態オン
    dispatch(editorShapeModule.actions.updateUnsavedData(true));

    // 画面を閉じる
    handleClickClose(e);
  };

  const condition: Condition = {
    stageWidth,
    stageHeight,
    regulationSize,
    showLattice,
    latticeWidth,
    latticeHeight,
    showRulers,
    screenCaptureRange,
    printSize,
    areaIdLength,
    tableIdLength,
    branchNumLength,
    locationDisplayFormatType,
    fontSize,
  };

  const conditionEvent: ConditionEvent = {
    onChangeStageWidth,
    onChangeStageHeight,
    onChangeRegulationSize,
    onChangeShowLattice,
    onChangeLatticeWidth,
    onChangeLatticeHeight,
    onChangeShowRulers,
    onChangeScreenCaptureRange,
    onChangePrintSize,
    onChangeAreaIdLength,
    onChangeTableIdLength,
    onChangeBranchNumLength,
    onChangeLocationDisplayFormatType,
    onChangeFontSize,
  };

  /**
   * Load, Unload 処理
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
        condition={condition}
        conditionEvent={conditionEvent}
        regulationSizes={regulationSizes}
        onClickFormatSetting={showLocationDisplayFormatSetting}
        onClickClose={handleClickClose}
        onClickCancel={handleClickCancel}
        onClickSubmit={handleClickSubmit}
      />
      <MapEditorLocationDisplayFormatSetting
        isOpen={isLocationDisplayFormatSettingOpen}
        onRequestClose={closeLocationDisplayFormatSetting}
        tableIdLength={tableIdLength}
        branchNumLength={branchNumLength}
        customFormats={customFormats}
        onSuccess={successLocationDisplayFormatSetting}
      />
    </>
  );
};
