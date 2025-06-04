import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SubmitHandler } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  ActiveProfiles,
  AlertDialogData,
  DialogTypes,
  Language,
  LoginFormData,
} from '../../types';

import { SecurityUtil } from '../../utils';

import { useAppDispatch } from '../../app/hooks';
import { AuthenticationError } from '../../app/http';
import { i18n } from '../../app/i18n';
import { useStoreToken } from '../../app/authentication';

import * as api from '../../api';
import { login } from '../../actions';

import { appModule } from '../../modules';
import { useActiveProfiles, useLanguage, useUser } from '../../selectors';

import { Login as Component } from '../../components/pages/Login';

/**
 * ログイン
 */
export const Login = () => {
  const navigate = useNavigate();
  const [t] = useTranslation();

  const dispatch = useAppDispatch();
  const storeToken = useStoreToken();

  const activeProfiles = useActiveProfiles();
  const currentLang = useLanguage();
  const user = useUser();

  const [lang, setLang] = useState<Language>(currentLang);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | undefined>();

  // アプリケーション実行環境
  const environment = useMemo(() => {
    if (activeProfiles.includes(ActiveProfiles.HOTFIX.toLowerCase())) {
      return t('pages:Login.environment.hotfix');
    } else if (activeProfiles.includes(ActiveProfiles.STAGING.toLowerCase())) {
      return t('pages:Login.environment.staging');
    } else if (activeProfiles.includes(ActiveProfiles.TESTING.toLowerCase())) {
      return t('pages:Login.environment.testing');
    } else if (
      activeProfiles.includes(ActiveProfiles.DEVELOPMENT.toLowerCase())
    ) {
      return t('pages:Login.environment.development');
    }
    return '';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeProfiles, i18n.language]);

  // 表示言語切り替え
  const handleChangeLang = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setLang(e.target.value as Language);
      dispatch(appModule.actions.updateLanguage(e.target.value as Language));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // ログインボタン押下
  const handleClickSubmit: SubmitHandler<LoginFormData> = useCallback(
    async (data) => {
      dispatch(appModule.actions.updateLoading(true));

      const condition: api.AuthenticationCondition = {
        loginId: data.loginId,
        password: data.password,
      };
      await dispatch(
        login(
          condition,
          ({ lang, homePage }) => {
            dispatch(appModule.actions.updateLanguage(lang as Language));
             navigate(homePage);
          },
          (e) => {
            const alertDialogData: AlertDialogData = {
              type: DialogTypes.ERROR,
              message:
                e instanceof AuthenticationError
                  ? t('messages:error.HTTP401.authenticationFailed')
                  : t('messages:error.connectionRefused'),
            };
            console.log(123)
            dispatch(appModule.actions.updateAlertDialog(alertDialogData));

            dispatch(appModule.actions.updateLoading(false));
          },
        ),
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // 他画面で認証トークンが更新された場合
  useEffect(() => {
    if (!timeoutId && storeToken) {
      // Login 画面から navigate で移動してしまうと、認証情報が取得できずエラーとなってしまう為、
      // トップ画面への移動は、画面リロードによる Load 処理に委ねる
      setTimeoutId(setTimeout(() => window.location.reload(), 0));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeToken]);

  // Load, Unload 処理
  useEffect(() => {
    // ローディングをリセット
    dispatch(appModule.actions.updateLoading(false));

    // 認証済みである場合は、ログイン後トップへ移動
    if (SecurityUtil.isAuthenticated()) {
      navigate(user.homePage);
    }

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Component
        environment={environment}
        selectedLang={lang}
        onChangeLang={handleChangeLang}
        onClickSubmit={handleClickSubmit}
      />
    </>
  );
};
