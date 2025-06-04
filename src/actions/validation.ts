import { BusinessError, ErrorResult, RestResponse } from '../app/http';
import { AppThunk } from '../app/store';

import * as api from '../api';

import { actionHelper } from './actionHelper';

/**
 * 認証状態を確認します.
 *
 * @param onSuccess 成功時の処理
 * @param onError 失敗時の処理
 * @returns AppThunk 遅延処理
 */
export const verifyAuthentication =
  (
    onSuccess?: (result: api.ValidateAccessTokenResult) => void,
    onError?: (options: { e: unknown; result?: ErrorResult }) => void,
  ): AppThunk =>
  async (dispatch) => {
    try {
      const response = await api.validations.validAccessToken();
      if (!response.ok) {
        return;
      }

      const json: RestResponse<api.ValidateAccessTokenResult> =
        await response.json();

      if (onSuccess) {
        onSuccess(json.result);
      }
    } catch (e) {
      if (onError) {
        if (e instanceof BusinessError) {
          const json: RestResponse<ErrorResult> = await e.response.json();
          onError({ e, result: json.result });
        } else {
          onError({ e });
        }
        return;
      }

      if (e instanceof Error) {
        actionHelper.showErrorDialog(e, dispatch);
        return;
      }
      console.error(e);
    }
  };
