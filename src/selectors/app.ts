import { createSelector } from '@reduxjs/toolkit';

import { useAppSelector } from '../app/hooks';
import { AppState } from '../modules';

export const useAppState = (): AppState => useAppSelector(({ app }) => app);

const activeProfiles = createSelector(
  (state: AppState) => state.activeProfiles,
  (activeProfiles) => activeProfiles
);
export const useActiveProfiles = () =>
  useAppSelector(({ app }) => activeProfiles(app));

const language = createSelector(
  (state: AppState) => state.language,
  (language) => language
);
export const useLanguage = () => useAppSelector(({ app }) => language(app));

const alertDialogData = createSelector(
  (state: AppState) => state.alertDialogData,
  (data) => data
);
export const useAlertDialogData = () =>
  useAppSelector(({ app }) => alertDialogData(app));
