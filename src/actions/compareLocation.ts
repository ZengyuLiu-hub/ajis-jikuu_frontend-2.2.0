import { AppThunk } from '../app/store';
import {
  BusinessError,
  ErrorResult,
  RestRequest,
  RestResponse,
} from '../app/http';

import * as api from '../api';
import {
  CompareCondition,
  CompareLocationResult,
  StoredCompareResult,
} from '../api';

import { actionHelper } from './actionHelper';

/**
 * ロケーション一覧を過去データと比較します.
 *
 * @param parameters パラメータ
 * @param onSuccess 成功時の処理
 * @param onError 失敗時の処理
 * @returns AppThunk 遅延処理
 */
export const compare =
  (
    parameters: CompareCondition,
    onSuccess?: (result: CompareLocationResult) => void,
    onError?: (options: { e: unknown; result?: ErrorResult }) => void,
  ): AppThunk =>
  async (dispatch) => {
    const payload: RestRequest<CompareCondition> = {
      parameters,
    };

    try {
      const response = await api.inventoryData.compareLocation(payload);
      if (!response.ok) {
        return;
      }

      const json: RestResponse<CompareLocationResult> = await response.json();
      const result = json.result;

      if (onSuccess) {
        onSuccess(result);
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

/**
 * ロケーション一覧の比較結果を取得します.
 *
 * @param parameters パラメータ
 * @param onSuccess 成功時の処理
 * @param onError 失敗時の処理
 * @returns AppThunk 遅延処理
 */
export const getCompareResult =
  (
    parameters: string,
    onSuccess?: (result: StoredCompareResult) => void,
    onError?: (options: { e: unknown; result?: ErrorResult }) => void,
  ): AppThunk =>
  async (dispatch) => {
    const payload: RestRequest<string> = {
      parameters,
    };

    try {
      const response = await api.inventoryData.getCompareResult(payload);
      if (!response.ok) {
        return;
      }

      const json: RestResponse<StoredCompareResult> = await response.json();
      const result = json.result;

      if (onSuccess) {
        onSuccess(result);
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
