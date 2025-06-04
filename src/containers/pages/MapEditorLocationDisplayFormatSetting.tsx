import React, { useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import { useTranslation } from 'react-i18next';

import * as editorConstants from '../../constants/editor';

import { useAppDispatch } from '../../app/hooks';

import {
  MapEditorLocationDisplayFormatSetting as Component,
  SelectIdData,
} from '../../components/pages/MapEditorLocationDisplayFormatSetting';
import { appModule } from '../../modules';
import { DialogTypes, LocationCustomFormat } from '../../types';

interface Props extends ReactModal.Props {
  tableIdLength: number;
  branchNumLength: number;
  customFormats: LocationCustomFormat[];
  onSuccess(customFormats: LocationCustomFormat[]): void;
}

/**
 * ロケーション表示形式設定
 */
export const MapEditorLocationDisplayFormatSetting = (props: Props) => {
  const { isOpen } = props;

  const [t] = useTranslation();
  const dispatch = useAppDispatch();

  const [selectIds, setSelectIds] = useState<SelectIdData[]>([]);

  /**
   * 画面をリセット
   */
  const resetState = () => {
    const newSelectIds = props.customFormats.map((format) => {
      return {
        selectIdType: format.selectIdType,
        startIndex: format.startIndex,
      };
    });
    setSelectIds(newSelectIds);
  };

  const handleClickSelectId = (data: SelectIdData) => {
    if (
      selectIds.some(
        (id) =>
          id.selectIdType === data.selectIdType &&
          id.startIndex === data.startIndex
      )
    ) {
      setSelectIds(
        selectIds.filter(
          (id) =>
            !(
              id.selectIdType === data.selectIdType &&
              id.startIndex === data.startIndex
            )
        )
      );
      return;
    }

    if (selectIds.length >= editorConstants.DISPLAY_LOCATION_NUM_MAX_LENGTH) {
      dispatch(
        appModule.actions.updateAlertDialog({
          type: DialogTypes.ERROR,
          message: t(
            'pages:MapEditorLocationDisplayFormatSetting.message.error.maxLength',
            {
              maxLength: editorConstants.DISPLAY_LOCATION_NUM_MAX_LENGTH,
            }
          ),
        })
      );
      return;
    }
    setSelectIds([...selectIds, data]);
  };

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
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    executeClose(e);
  };

  /**
   * 反映ボタン押下
   */
  const executeSubmit = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    // 画面を閉じる
    executeClose(e);

    // 返却
    const customFormats = selectIds.map((id, index) => {
      return {
        sequence: index + 1,
        selectIdType: id.selectIdType,
        startIndex: id.startIndex,
        endIndex: id.startIndex + 1,
      };
    });
    props.onSuccess(customFormats);
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
    <Component
      {...props}
      selectIds={selectIds}
      onClickSelectId={handleClickSelectId}
      onClickClose={executeClose}
      onClickCancel={executeCancel}
      onClickSubmit={executeSubmit}
    />
  );
};
