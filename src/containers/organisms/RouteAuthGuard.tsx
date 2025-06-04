import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { AlertDialogData, AuthorityType, DialogTypes } from '../../types';
import { SecurityUtil } from '../../utils/SecurityUtil';

import { useAppDispatch } from '../../app/hooks';
import { appModule } from '../../modules';
import { useUser } from '../../selectors';

interface Props {
  component: React.ReactNode;
  redirect: string;
  allowAuthorities?: AuthorityType[];
}

/**
 * 認証チェック制御ルート.
 */
export const RouteAuthGuard = (props: Props) => {
  const [t] = useTranslation();
  const dispatch = useAppDispatch();

  const location = useLocation();
  const user = useUser();

  // 認証されていない場合はリダイレクト
  if (!SecurityUtil.isAuthenticated()) {
    return (
      <Navigate
        to={props.redirect}
        state={{ from: location }}
        replace={false}
      />
    );
  }

  // 権限がない場合はエラーメッセージを表示し、移動元の画面へ戻す
  if (!SecurityUtil.hasAnyAuthority(user, props.allowAuthorities ?? [])) {
    const alertDialogData: AlertDialogData = {
      type: DialogTypes.ERROR,
      message: t('messages:error.accessDenied'),
    };
    dispatch(appModule.actions.updateAlertDialog(alertDialogData));

    const histories = location?.state?.stateHistories ?? [];
    if (histories.length === 0) {
      // 移動元の情報がない場合は、リダイレクトページへ移動する
      return (
        <Navigate
          to={props.redirect}
          state={{ from: location }}
          replace={false}
        />
      );
    }
    const { referer, payload } = histories.slice(-1)[0];

    return <Navigate to={referer} state={{ payload }} replace={true} />;
  }
  return <>{props.component}</>;
};
