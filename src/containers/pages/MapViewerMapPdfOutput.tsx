import React, { useState, useEffect } from 'react';
import ReactModal from 'react-modal';
import { useTranslation } from 'react-i18next';

import {
  MapPdfOutputMode,
  MapPdfOutputModes,
  MapPdfPaperSize,
  MapPdfPrintSettings,
  MapPdfRotation,
  ScreenCaptureRange,
  ScreenCaptureRanges,
  StageRegulationSize,
  StageRegulationSizes,
} from '../../types';
import { useAppDispatch } from '../../app/hooks';
import { viewerModule, viewerPreferenceModule } from '../../modules';
import {
  useOriginalPreferences,
  useViewerPdfOutputSettings,
} from '../../selectors';

import { EditorUtil } from '../../utils/EditorUtil';

import {
  MapViewerMapPdfOutput as Component,
  Condition,
  ConditionEvent,
} from '../../components/pages/MapViewerMapPdfOutput';

interface Props extends ReactModal.Props {
  onSuccess(settings: MapPdfPrintSettings): void;
}

/**
 * マップ PDF 出力モード.
 */
export const MapViewerMapPdfOutput = (props: Props) => {
  const { isOpen } = props;

  const [t] = useTranslation();
  const dispatch = useAppDispatch();

  const preferences = useOriginalPreferences();
  const pdfOutputSettings = useViewerPdfOutputSettings();

  // 規定サイズ
  const regulationSizes: any[] = [
    {
      value: StageRegulationSizes.VERY_SMALL,
      label: t(
        'pages:MapViewerMapPdfOutput.stageSize.regulationSize.verySmall',
      ),
    },
    {
      value: StageRegulationSizes.SMALL,
      label: t('pages:MapViewerMapPdfOutput.stageSize.regulationSize.small'),
    },
    {
      value: StageRegulationSizes.MEDIUM,
      label: t('pages:MapViewerMapPdfOutput.stageSize.regulationSize.medium'),
    },
    {
      value: StageRegulationSizes.LARGE,
      label: t('pages:MapViewerMapPdfOutput.stageSize.regulationSize.large'),
    },
    {
      value: StageRegulationSizes.EXTRA_LARGE,
      label: t(
        'pages:MapViewerMapPdfOutput.stageSize.regulationSize.extraLarge',
      ),
    },
  ];

  // 初期値
  const initialData: Condition = {
    outputMode: pdfOutputSettings.outputMode,
    outputHeaderFooter: pdfOutputSettings.outputHeaderFooter,
    rotation: pdfOutputSettings.rotation,
    stageWidth: pdfOutputSettings.stageWidth,
    stageHeight: pdfOutputSettings.stageHeight,
    screenCaptureRange: pdfOutputSettings.screenCaptureRange,
    printSize: pdfOutputSettings.printSize,
  };

  // 出力モード
  const [outputMode, setOutputMode] = useState(initialData.outputMode);

  // ヘッダー・フッター出力有無
  const [outputHeaderFooter, setOutputHeaderFooter] = useState(
    initialData.outputHeaderFooter,
  );

  // 回転
  const [rotation, setRotation] = useState<MapPdfRotation>(
    initialData.rotation,
  );

  // ステージサイズ：幅
  const [stageWidth, setStageWidth] = useState(initialData.stageWidth);

  // ステージサイズ：高さ
  const [stageHeight, setStageHeight] = useState(initialData.stageHeight);

  // ステージサイズ：規定サイズ
  const [regulationSize, setRegulationSize] = useState(
    initialData.regulationSize,
  );

  // 画面キャプチャ範囲
  const [screenCaptureRange, setScreenCaptureRange] =
    useState<ScreenCaptureRange>(initialData.screenCaptureRange);

  // マップ PDF 用紙サイズ
  const [printSize, setPrintSize] = useState(initialData.printSize);

  /**
   * 出力モードを変更します.
   *
   * @param {MapPdfOutputMode} mode 変更後の出力モード
   */
  const handleChangeOutputMode = (mode: MapPdfOutputMode) =>
    setOutputMode(mode);

  /**
   * ヘッダー・フッター出力有無を変更します.
   *
   * @param {boolean} value 変更後の出力有無
   */
  const handleChangeOutputHeaderFooter = (value: boolean) =>
    setOutputHeaderFooter(value);

  const handleChangeRotation = (value: MapPdfRotation) => setRotation(value);

  /**
   * ステージサイズ：幅 を変更します.
   *
   * @param {number} value 変更後の幅
   */
  const handleChangeStageWidth = (value: number) => {
    setStageWidth(value);
    setRegulationSize(undefined);
  };

  /**
   * ステージサイズ：高さ を変更します.
   *
   * @param {number} value 変更後の高さ
   */
  const handleChangeStageHeight = (value: number) => {
    setStageHeight(value);
    setRegulationSize(undefined);
  };

  /**
   * ステージサイズ：規定サイズ を変更します.
   *
   * @param {StageRegulationSize} size 変更後のサイズ
   */
  const handleChangeRegulationSize = (size: StageRegulationSize) => {
    setRegulationSize(size);

    if (size) {
      const newPageSize = EditorUtil.stageRegulationSizeToPixel(size);
      setStageWidth(newPageSize.width);
      setStageHeight(newPageSize.height);
    }
  };

  /**
   * 画面キャプチャ範囲を変更します.
   *
   * @param {ScreenCaptureRange} range 変更後の範囲
   */
  const handleChangeScreenCaptureRange = (range: ScreenCaptureRange) =>
    setScreenCaptureRange(range);

  /**
   * マップ PDF 用紙サイズを変更します.
   *
   * @param {MapPdfPaperSize} size 変更後の範囲
   */
  const handleChangePrintSize = (size: MapPdfPaperSize) => setPrintSize(size);

  /**
   * 閉じる
   */
  const executeClose = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (props.onRequestClose) {
      props.onRequestClose(e);
    }
  };

  /**
   * キャンセルボタン押下
   */
  const executeCancel = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    if (props.onRequestClose) {
      props.onRequestClose(e);
    }
  };

  /**
   * リセットボタン押下.
   */
  const executeReset = () => {
    // ビューア PDF 出力設定をオリジナル環境設定で初期化
    setStageWidth(preferences.stageWidth);
    setStageHeight(preferences.stageHeight);
    setScreenCaptureRange(preferences.screenCaptureRange);
    setPrintSize(preferences.printSize);
  };

  /**
   * 反映ボタン押下
   */
  const executeSubmit = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    // 画面を閉じる
    executeClose(e);

    // 画面キャプチャ範囲がステージの場合は、拡大率を 100% にリセットする
    if (screenCaptureRange === ScreenCaptureRanges.STAGE) {
      dispatch(viewerModule.actions.updateStageScale(100));
    }

    // ビューア PDF 出力設定を更新
    dispatch(
      viewerPreferenceModule.actions.updatePdfOutputSetting({
        outputMode,
        outputHeaderFooter,
        rotation,
        stageWidth,
        stageHeight,
        screenCaptureRange,
        printSize,
      }),
    );

    // 出力モードモード返却
    props.onSuccess({
      outputMode,
      // 棚卸モードの場合は、ヘッダー・フッターの出力を強制
      outputHeaderFooter:
        outputMode === MapPdfOutputModes.INVENTORY ? true : outputHeaderFooter,
      rotation,
    });
  };

  const condition: Condition = {
    outputMode,
    outputHeaderFooter,
    rotation,
    stageWidth,
    stageHeight,
    regulationSize,
    screenCaptureRange,
    printSize,
  };

  const conditionEvent: ConditionEvent = {
    onChangeOutputMode: handleChangeOutputMode,
    onChangeOutputHeaderFooter: handleChangeOutputHeaderFooter,
    onChangeRotation: handleChangeRotation,
    onChangeStageWidth: handleChangeStageWidth,
    onChangeStageHeight: handleChangeStageHeight,
    onChangeRegulationSize: handleChangeRegulationSize,
    onChangeScreenCaptureRange: handleChangeScreenCaptureRange,
    onChangePrintSize: handleChangePrintSize,
  };

  /**
   * Load, Unload 処理
   */
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    // 前回実行時のビューア PDF 出力設定を復元
    setOutputMode(pdfOutputSettings.outputMode);
    setOutputHeaderFooter(pdfOutputSettings.outputHeaderFooter);
    setStageWidth(pdfOutputSettings.stageWidth);
    setStageHeight(pdfOutputSettings.stageHeight);
    setScreenCaptureRange(pdfOutputSettings.screenCaptureRange);
    setPrintSize(pdfOutputSettings.printSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <Component
      {...props}
      condition={condition}
      conditionEvent={conditionEvent}
      regulationSizes={regulationSizes}
      onClickClose={executeClose}
      onClickCancel={executeCancel}
      onClickReset={executeReset}
      onClickSubmit={executeSubmit}
    />
  );
};
