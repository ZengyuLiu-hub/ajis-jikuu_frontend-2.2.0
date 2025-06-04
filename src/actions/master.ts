import { AppThunk } from '../app/store';
import { RestResponse } from '../app/http';

import * as api from '../api';
import { JurisdictionsResult } from '../api';

import { actionHelper } from './actionHelper';

/**
 * 管理区分一覧を検索します.
 *
 * @param onSuccess 成功時の処理
 * @param onError 失敗時の処理
 * @returns AppThunk 遅延処理
 */
export const searchJurisdictions =
  (
    onSuccess?: (result: JurisdictionsResult) => void,
    onError?: (e: unknown) => void,
  ): AppThunk =>
  async (dispatch) => {
    try {
      const response = await api.jurisdictions.getJurisdictions();
      if (!response.ok) {
        return;
      }

      const json: RestResponse<JurisdictionsResult> = await response.json();

      if (onSuccess) {
        onSuccess(json.result);
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
