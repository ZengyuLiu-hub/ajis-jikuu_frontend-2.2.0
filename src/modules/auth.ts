import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { User } from '../types';

export type AuthState = {
  token?: string;
  user: User;
  needsReauthentication: boolean;
  doLogout: boolean;
};

const initialState: AuthState = {
  user: {
    loginId: 'Unknown',
    userId: 'Unknown',
    userName: 'Unknown',
    lang: 'ja',
    timeZone: 'Asia/Tokyo',
    homePage: '/',
    authorities: [],
    employee: {
      jurisdictionClass: 'Unknown',
      zoneCode: 'Unknown',
      doCode: 'Unknown',
      employeeCode: 'Unknown',
      employeeName: 'Unknown',
    },
  },
  needsReauthentication: false,
  doLogout: false,
};

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken(state: AuthState, action: PayloadAction<string>) {
      state.token = action.payload;
    },
    setUser(state: AuthState, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    updateNeedsReauthentication(
      state: AuthState,
      action: PayloadAction<boolean>
    ) {
      state.needsReauthentication = action.payload;
    },
    updateDoLogout(state: AuthState, action: PayloadAction<boolean>) {
      state.doLogout = action.payload;
    },
    clearState(state: AuthState) {
      return initialState;
    },
  },
});

export const authModule = slice;
