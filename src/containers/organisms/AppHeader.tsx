import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { clear } from 'redux-localstorage-simple';

import * as appConstants from '../../constants/app';
import * as routerConstants from '../../constants/router';
import * as httpConstants from '../../constants/http';

import { i18n } from '../../app/i18n';
import { ActiveProfiles, AuthorityTypes } from '../../types';
import { SecurityUtil } from '../../utils/SecurityUtil';

import { useAppDispatch } from '../../app/hooks';
import { useStoreToken } from '../../app/authentication';

import {
  appModule,
  authModule,
  editorModule,
  inventoryDataModule,
  mapModule,
  mapVersionModule,
  storeModule,
} from '../../modules';
import {
  useActiveProfiles,
  useDoLogout,
  useEditMapVersion,
  useExclusiveLocked,
  useUser,
} from '../../selectors';
import { logout, unlockEditMap, verifyAuthentication } from '../../actions';

import { AppHeader as Component } from '../../components/organisms';
import { PersonalWindow } from '../pages/PersonalWindow';

/**
 * アプリケーションヘッダー
 */
export const AppHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [t] = useTranslation();

  const dispatch = useAppDispatch();
  const storeToken = useStoreToken();

  const user = useUser();
  const activeProfiles = useActiveProfiles();

  const doLogout = useDoLogout();

  const editMapVersion = useEditMapVersion();
  const isExclusiveLocked = useExclusiveLocked();

  const [personalWindowOpen, setPersonalWindowOpen] = useState(false);

  /**
   * 個人用設定画面を開く
   */
  const showPersonalWindow = (e: React.MouseEvent<HTMLButtonElement>) =>
    setPersonalWindowOpen(true);

  /**
   * 個人用設定画面を閉じる
   */
  const hidePersonalWindow = useCallback(
    () => setPersonalWindowOpen(false),
    [],
  );

  /**
   * 画面移動前処理
   */
  const beforeNavigate = async () => {
    // 現在の表示画面がマップ編集画面、かつ編集権限を有する、かつ自身がロックを取得している場合
    if (
      location.pathname.startsWith(routerConstants.PATH_MAPS) &&
      SecurityUtil.hasAnyAuthority(user, [AuthorityTypes.MAP_EDIT]) &&
      isExclusiveLocked
    ) {
      dispatch(unlockEditMap({ ...editMapVersion }));
    }
  };

  /**
   * アプリケーションロゴ押下
   */
  const handleClickLogo = async () => {
    dispatch(appModule.actions.updateLoading(true));

    await dispatch(
      verifyAuthentication(async () => {
        await beforeNavigate();

        navigate(user.homePage);
      }),
    );

    dispatch(appModule.actions.updateLoading(false));
  };

  /**
   * ログアウト押下
   */
  const handleLogout = async () => {
    dispatch(appModule.actions.updateLoading(true));

    await beforeNavigate();

    // ログアウト処理
    dispatch(logout());

    // 状態クリア
    clearState();

    // ログアウト指示オフ
    dispatch(authModule.actions.updateDoLogout(false));

    // ログイン画面へ移動
    navigate(routerConstants.PATH_LOGIN, { replace: true });
  };

  /**
   * 状態を初期化
   */
  const clearState = () => {
    // clear local storage
    clear({
      namespace: appConstants.REDUX_LOCAL_STORAGE_SIMPLE_NAMESPACE,
      disableWarnings: false,
    });

    window.localStorage.removeItem(httpConstants.JWT_TOKEN_NAME);

    // clear redux state
    dispatch(appModule.actions.clearState());
    dispatch(authModule.actions.clearState());
    dispatch(editorModule.actions.clearState());
    dispatch(inventoryDataModule.actions.clearState());
    dispatch(mapModule.actions.clearState());
    dispatch(mapVersionModule.actions.clearState());
    dispatch(storeModule.actions.clearState());
  };

  // 環境情報
  const environment = useMemo(() => {
    if (activeProfiles.includes(ActiveProfiles.HOTFIX.toLowerCase())) {
      return t('organisms:AppHeader.environment.hotfix');
    } else if (activeProfiles.includes(ActiveProfiles.STAGING.toLowerCase())) {
      return t('organisms:AppHeader.environment.staging');
    } else if (activeProfiles.includes(ActiveProfiles.TESTING.toLowerCase())) {
      return t('organisms:AppHeader.environment.testing');
    } else if (
      activeProfiles.includes(ActiveProfiles.DEVELOPMENT.toLowerCase())
    ) {
      return t('organisms:AppHeader.environment.development');
    }
    return '';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeProfiles, i18n.language]);

  /**
   * 認証トークンが変わった場合
   */
  useEffect(() => {
    // 認証トークンがない場合はログアウト
    if (!storeToken) {
      handleLogout();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeToken]);

  /**
   * ログアウト指示
   */
  useEffect(() => {
    if (doLogout) {
      handleLogout();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doLogout]);

  /**
   * Load, Unload 処理
   */
  useEffect(() => {
    if (!window.localStorage.getItem(httpConstants.JWT_TOKEN_NAME)) {
      clearState();
      navigate(routerConstants.PATH_LOGIN, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Component
        environment={environment}
        onClickLogo={handleClickLogo}
        onClickShowPersonalWindow={showPersonalWindow}
      />
      <PersonalWindow
        isOpen={personalWindowOpen}
        onClose={hidePersonalWindow}
      />
    </>
  );
};
