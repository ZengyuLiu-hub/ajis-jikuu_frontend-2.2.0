import React, { useEffect } from 'react';
import ReactModal from 'react-modal';
import { SubmitHandler } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { AlertDialogData, DialogTypes, LoginFormData } from '../../types';
import { AuthenticationError } from '../../app/http';
import { useAppDispatch } from '../../app/hooks';

import { appModule, authModule } from '../../modules';
import { useUser } from '../../selectors';

import * as api from '../../api';
import { login } from '../../actions';

import { Reauthentication as Component } from '../../components/pages/Reauthentication';

interface Props extends ReactModal.Props {}

export const Reauthentication = (props: Props) => {
  const { isOpen } = props;

  const [t] = useTranslation();

  const dispatch = useAppDispatch();

  const user = useUser();

  /**
   * 閉じる
   */
  const handleClickClose = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    dispatch(authModule.actions.updateNeedsReauthentication(false));

    if (props.onRequestClose) {
      props.onRequestClose(e);
    }
  };

  /**
   * ログアウト
   */
  const handleClickCancel = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    // ログアウト指示オン
    dispatch(authModule.actions.updateDoLogout(true));

    // 画面を閉じる
    handleClickClose(e);
  };

  /**
   * 再認証
   */
  const handleClickSubmit: SubmitHandler<LoginFormData> = async (data) => {
    dispatch(appModule.actions.updateLoading(true));

    const condition: api.AuthenticationCondition = {
      loginId: user.loginId,
      password: data.password,
    };
    await dispatch(
      login(
        condition,
        () => {
          dispatch(authModule.actions.updateNeedsReauthentication(false));
          dispatch(appModule.actions.updateLoading(false));
        },
        (e) => {
          const alertDialogData: AlertDialogData = {
            type: DialogTypes.ERROR,
            message:
              e instanceof AuthenticationError
                ? t('messages:error.HTTP401.authenticationFailed')
                : t('messages:error.connectionRefused'),
          };
          dispatch(appModule.actions.updateAlertDialog(alertDialogData));
          dispatch(appModule.actions.updateLoading(false));
        },
      ),
    );
  };

  // 初期表示処理
  useEffect(() => {
    if (!isOpen) {
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <Component
      {...props}
      userName={user.userName}
      onClickClose={handleClickClose}
      onClickCancel={handleClickCancel}
      onClickSubmit={handleClickSubmit}
    />
  );
};
