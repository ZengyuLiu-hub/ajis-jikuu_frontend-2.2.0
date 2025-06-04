import { useSyncExternalStore } from 'react';

import * as httpConstants from '../constants/http';

// コールバック登録
const subscribe = (callback: () => void) => {
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener('storage', callback);
  };
};
// 認証トークン現在の値を返す
// 認証トークン現在の値を返す
const getCurrentToken = () =>
  localStorage.getItem(httpConstants.JWT_TOKEN_NAME);

/**
 * 認証トークン（JWT）の変更を検知します.
 *
 * @return {string} 認証トークン
 */
export const useStoreToken = (): string =>
  useSyncExternalStore(subscribe, getCurrentToken) || '';
