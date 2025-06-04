import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { DialogTypes } from '../../types';

import { UploadTextButton } from '../../components/atoms';
import { AlertDialog } from '../../components/organisms';

interface Props {
  label: string;
  onClickFileUpload(file: File): void;
  disabled?: boolean;
}

/**
 * ファイルアップロードボタン
 *
 * @param props プロパティ
 */
export const FileUploadButton = (props: Props) => {
  const [t] = useTranslation();

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

    setAlertDialogMessage(
      t('messages:information.fileUpload', {
        param1: file.name,
      }) ?? ''
    );
    setAlertDialogOpen(true);
  };

  // 処理継続
  const executePositiveAction = useCallback(() => {
    if (selectedFile) {
      props.onClickFileUpload(selectedFile);
    }
    closeDialog();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFile]);

  return (
    <>
      <UploadTextButton
        onFileSelection={executeFileSelection}
        disabled={props.disabled}
      >
        <span>{props.label}</span>
      </UploadTextButton>
      <AlertDialog
        type={DialogTypes.CONFIRM}
        message={alertDialogMessage}
        isOpen={alertDialogOpen}
        onRequestClose={closeDialog}
        positiveAction={executePositiveAction}
        negativeAction={closeDialog}
      />
    </>
  );
};
