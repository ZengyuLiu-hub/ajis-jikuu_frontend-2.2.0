import { createSelector } from '@reduxjs/toolkit';

import { useAppSelector } from '../app/hooks';
import { AuthState } from '../modules';

export const useAuthState = (): AuthState => useAppSelector(({ auth }) => auth);

const user = createSelector(
  (state: AuthState) => state.user,
  (user) => user
);
export const useUser = () => useAppSelector(({ auth }) => user(auth));

const token = createSelector(
  (state: AuthState) => state.token,
  (token) => token
);
export const useToken = () => useAppSelector(({ auth }) => token(auth));

const authorities = createSelector(
  (state: AuthState) => state.user.authorities,
  (authorities) => authorities
);
export const useAuthorities = () =>
  useAppSelector(({ auth }) => authorities(auth));

const needsReauthentication = createSelector(
  (state: AuthState) => state.needsReauthentication,
  (needsReauthentication) => needsReauthentication
);
export const useNeedsReauthentication = () =>
  useAppSelector(({ auth }) => needsReauthentication(auth));

const doLogout = createSelector(
  (state: AuthState) => state.doLogout,
  (doLogout) => doLogout
);
export const useDoLogout = () => useAppSelector(({ auth }) => doLogout(auth));
