import * as httpConstants from '../constants/http';

import { User } from '../types';
import { AppThunk } from '../app/store';
import { RestRequest, RestResponse } from '../app/http';

import * as api from '../api';
import { LoginResult } from '../api';

import { appModule, authModule } from '../modules';

import { actionHelper } from './actionHelper';

/**
 * ログインします.
 *
 * @param parameters パラメータ
 * @param onSuccess 成功時の処理
 * @param onError 失敗時の処理
 * @returns AppThunk 遅延処理
 */
export const login =
  (
    parameters: api.AuthenticationCondition,
    onSuccess?: (result: LoginResult) => void,
    onError?: (e: unknown) => void,
  ): AppThunk =>
  async (dispatch) => {
    const payload: RestRequest<api.AuthenticationCondition> = {
      parameters,
    };

    try {
      const response = await api.auth.login(payload);
      if (!response.ok) {
        return;
      }

      const json: RestResponse<LoginResult> = await response.json();
      const result = json.result;

      const user: User = { ...result };

      window.localStorage.setItem(httpConstants.JWT_TOKEN_NAME, result.token);

      dispatch(appModule.actions.setActiveProfiles(result.activeProfiles));
      dispatch(authModule.actions.setToken(result.token));
      dispatch(authModule.actions.setUser(user));

      if (onSuccess) {
        onSuccess(result);
      }
    } catch (e) {
      if (onError) {
        onError(e);
        return;
      }

      if (e instanceof Error) {
        actionHelper.showErrorDialog(e, dispatch);
        return;
      }
      console.error(e);
    }
  };

/**
 * ログアウトします.
 *
 * @param parameters パラメータ
 * @param onSuccess 成功時の処理
 * @param onError 失敗時の処理
 * @returns AppThunk 遅延処理
 */
export const logout =
  (
    onSuccess?: (result: string) => void,
    onError?: (e: unknown) => void,
  ): AppThunk =>
  async (dispatch) => {
    try {
      const response = await api.auth.logout();
      if (!response.ok) {
        return;
      }
      const json: RestResponse = await response.json();

      if (onSuccess) {
        onSuccess(json.message);
      }
    } catch (e) {
      if (onError) {
        onError(e);
        return;
      }

      if (e instanceof Error) {
        actionHelper.showErrorDialog(e, dispatch);
        return;
      }
      console.error(e);
    }
  };
