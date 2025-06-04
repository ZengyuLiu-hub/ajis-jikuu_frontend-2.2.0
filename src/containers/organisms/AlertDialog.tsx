import { useState, useEffect } from 'react';

import { DialogType, DialogTypes } from '../../types';
import { useAppDispatch } from '../../app/hooks';

import { appModule } from '../../modules';
import { useAlertDialogData } from '../../selectors';

import { AlertDialog as Component } from '../../components/organisms';

/**
 * ダイアログ
 */
export const AlertDialog = () => {
  const dispatch = useAppDispatch();

  const alertDialogData = useAlertDialogData();

  // ダイアログ種別
  const [dialogType, setDialogType] = useState<DialogType>(
    DialogTypes.INFORMATION,
  );

  // メッセージ
  const [dialogMessage, setDialogMessage] = useState<string>('');

  // 表示有無
  const [isOpen, setOpen] = useState(false);

  // とじる
  const executeClose = () => {
    dispatch(appModule.actions.clearAlertDialog());
    setOpen(false);
  };

  // 否定アクション
  const executeNegativeAction = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    if (alertDialogData.negativeAction) {
      alertDialogData.negativeAction(e);
    }
    executeClose();
  };

  // 肯定アクション
  const executePositiveAction = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    if (alertDialogData.positiveAction) {
      alertDialogData.positiveAction(e);
    }
    executeClose();
  };

  useEffect(() => {
    if (isOpen) {
      return;
    }

    if (alertDialogData && alertDialogData.message) {
      setDialogType(alertDialogData.type);
      setDialogMessage(alertDialogData.message);
      setOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alertDialogData]);

  return (
    <Component
      type={dialogType}
      message={dialogMessage}
      isOpen={isOpen}
      onRequestClose={executeClose}
      negativeAction={executeNegativeAction}
      positiveAction={executePositiveAction}
    />
  );
};
