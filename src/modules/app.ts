import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Language, Languages, DialogTypes } from '../types';

import { AlertDialogData } from '../types';

export type AppState = {
  activeProfiles: string[];
  language: Language;
  loading: boolean;
  alertDialogData: AlertDialogData;
};

const initialState: AppState = {
  activeProfiles: [],
  language: Languages.ja,
  loading: false,
  alertDialogData: {
    type: DialogTypes.INFORMATION,
    message: '',
  },
};

const slice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setApp(state: AppState, action: PayloadAction<AppState>) {
      state.language = action.payload.language;
    },
    setActiveProfiles(state: AppState, action: PayloadAction<string[]>) {
      state.activeProfiles = action.payload;
    },
    updateLanguage(state: AppState, action: PayloadAction<Language>) {
      state.language = action.payload;
    },
    updateLoading(state: AppState, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    updateAlertDialog(state: AppState, action: PayloadAction<AlertDialogData>) {
      state.alertDialogData = action.payload;
    },
    clearAlertDialog(state: AppState) {
      state.alertDialogData = initialState.alertDialogData;
    },
    clearState(state: AppState) {
      state.alertDialogData = initialState.alertDialogData;
    },
  },
});

export const appModule = slice;
