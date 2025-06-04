import React, { useState, useEffect } from 'react';
import { History } from 'history';
import CacheBuster from 'react-cache-buster';

import * as routerConstants from './constants/router';

import { AppRoutes } from './app/routes';
import { useNeedsReauthentication } from './selectors';

import { OverlayLoader, AlertDialog } from './containers/organisms';
import { Reauthentication } from './containers/pages';

import packageInfo from '../package.json';

interface Props {
  history: History;
}

export const App = (props: Props) => {
  const isProduction = process.env.NODE_ENV === 'production';

  const needsReauthentication = useNeedsReauthentication();

  const [isOpenReauthentication, setOpenReauthentication] = useState(false);

  const closeReauthentication = () => setOpenReauthentication(false);

  useEffect(() => {
    // 表示中の画面がログイン画面の場合は再認証ダイアログを表示しない
    if (
      needsReauthentication &&
      window.location.pathname === routerConstants.PATH_LOGIN
    ) {
      setOpenReauthentication(false);
      return;
    }

    // 再認証ダイアログを表示
    setOpenReauthentication(needsReauthentication);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [needsReauthentication]);

  // Load, Unload 処理
  useEffect(() => {
    props.history.listen(() => {
      // check for sw updates on page change
      navigator.serviceWorker
        .getRegistrations()
        .then((registrations) => registrations.forEach((reg) => reg.update()));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <CacheBuster
        currentVersion={packageInfo.version}
        isEnabled={isProduction}
        isVerboseMode={false}
        metaFileDirectory={'.'}
      >
        <AppRoutes />
      </CacheBuster>
      <Reauthentication
        isOpen={isOpenReauthentication}
        onRequestClose={closeReauthentication}
      />
      <OverlayLoader />
      <AlertDialog />
    </>
  );
};
