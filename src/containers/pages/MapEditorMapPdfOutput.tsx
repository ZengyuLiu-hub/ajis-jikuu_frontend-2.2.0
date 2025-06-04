import React, { useEffect, useState } from 'react';
import ReactModal from 'react-modal';

import { useAppDispatch } from '../../app/hooks';
import { editorModule } from '../../modules';
import { useEditorPreferenceState } from '../../selectors';
import {
  MapPdfOutputMode,
  MapPdfOutputModes,
  MapPdfPrintSettings,
  MapPdfRotation,
  MapPdfRotations,
  ScreenCaptureRanges,
} from '../../types';

import {
  MapEditorMapPdfOutput as Component,
  Condition,
  ConditionEvent,
} from '../../components/pages/MapEditorMapPdfOutput';

interface Props extends ReactModal.Props {
  onSuccess(settings: MapPdfPrintSettings): void;
}

/**
 * マップ PDF 出力モード.
 */
export const MapEditorMapPdfOutput = (props: Props) => {
  const { isOpen } = props;

  const dispatch = useAppDispatch();

  const preferences = useEditorPreferenceState();

  // 初期値
  const initialData: Condition = {
    outputMode: MapPdfOutputModes.INVENTORY,
    outputHeaderFooter: true,
    rotation: MapPdfRotations.NONE,
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

  /**
   * 出力モード変更.
   */
  const onChangeOutputMode = (mode: MapPdfOutputMode) => setOutputMode(mode);

  /**
   * ヘッダー・フッター出力有無変更.
   */
  const onChangeOutputHeaderFooter = (value: boolean) =>
    setOutputHeaderFooter(value);

  const onChangeRotation = (value: MapPdfRotation) => setRotation(value);

  /**
   * 閉じるボタン押下.
   */
  const executeClose = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (props.onRequestClose) {
      props.onRequestClose(e);
    }
  };

  /**
   * キャンセルボタン押下.
   */
  const executeCancel = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    if (props.onRequestClose) {
      props.onRequestClose(e);
    }
  };

  /**
   * 反映ボタン押下.
   */
  const executeSubmit = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    // 画面を閉じる
    executeClose(e);

    // 画面キャプチャ範囲がステージの場合は、拡大率を 100% にリセットする
    if (preferences.screenCaptureRange === ScreenCaptureRanges.STAGE) {
      dispatch(editorModule.actions.updateStageScale(100));
    }

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
  };

  const conditionEvent: ConditionEvent = {
    onChangeOutputMode,
    onChangeOutputHeaderFooter,
    onChangeRotation,
  };

  /**
   * Load, Unload 処理
   */
  useEffect(() => {
    if (!isOpen) {
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

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
