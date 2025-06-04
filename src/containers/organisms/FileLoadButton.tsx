import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { DialogType, DialogTypes } from '../../types';

import { LoadFileTextButton } from '../../components/atoms';
import { AlertDialog } from '../../components/organisms';

interface Props {
  label: string;
  accept?: string;
  onClickFileLoad(file: File): boolean;
  disabled?: boolean;
}

/**
 * ローカルファイル読み込み.
 *
 * @param props プロパティ
 */
export const FileLoadButton = (props: Props) => {
  const [t] = useTranslation();

  // ダイアログ状態
  const [alertDialogState, setAlertDialogState] = useState('CONFIRM');

  // ダイアログタイプ
  const [alertDialogType, setAlertDialogType] = useState<DialogType>(
    DialogTypes.CONFIRM
  );

  // ダイアログメッセージ
  const [alertDialogMessage, setAlertDialogMessage] = useState('');

  // ダイアログ表示有無
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);

  // 選択ファイル
  const [selectedFile, setSelectedFile] = useState<File>();

  // ダイアログを閉じる
  const closeDialog = useCallback(() => {
    setAlertDialogOpen(false);
    setSelectedFile(undefined);
  }, []);

  // ファイル選択時の処理
  const executeFileSelection = (file: File) => {
    setSelectedFile(file);

    setAlertDialogState('CONFIRM');
    setAlertDialogType(DialogTypes.CONFIRM);
    setAlertDialogMessage(
      t('messages:information.fileLoad', {
        param1: file.name,
      }) ?? ''
    );
    setAlertDialogOpen(true);
  };

  // 処理継続
  const executePositiveAction = useCallback(() => {
    closeDialog();

    // 読み込み処理実行
    if (
      alertDialogState === 'CONFIRM' &&
      selectedFile &&
      props.onClickFileLoad(selectedFile)
    ) {
      setAlertDialogState('COMPLETE');
      setAlertDialogType(DialogTypes.INFORMATION);
      setAlertDialogMessage(`${t('messages:information.fileLoadComplete')}`);
      setAlertDialogOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alertDialogState, selectedFile]);

  return (
    <>
      <LoadFileTextButton
        accept={props.accept}
        onFileSelection={executeFileSelection}
        disabled={props.disabled}
      >
        <span>{props.label}</span>
      </LoadFileTextButton>
      <AlertDialog
        type={alertDialogType}
        message={alertDialogMessage}
        isOpen={alertDialogOpen}
        onRequestClose={closeDialog}
        positiveAction={executePositiveAction}
        negativeAction={closeDialog}
      />
    </>
  );
};
