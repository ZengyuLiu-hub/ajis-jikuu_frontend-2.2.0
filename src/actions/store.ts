import { AppThunk } from '../app/store';
import { BusinessError, ErrorResult, RestResponse } from '../app/http';

import * as api from '../api';
import { StoreResult, StoresResult } from '../api';

import { storeModule } from '../modules';

import { actionHelper } from './actionHelper';

/**
 * 店舗情報を取得します.
 *
 * @param parameters パラメータ
 * @param onSuccess 成功時の処理
 * @param onError 失敗時の処理
 * @returns AppThunk 遅延処理
 */
export const searchStore =
  (
    parameters: api.StoreCondition,
    onSuccess?: (result: StoreResult) => void,
    onError?: (e: unknown) => void,
  ): AppThunk =>
  async (dispatch) => {
    try {
      const response = await api.companies.getStore(parameters);
      if (!response.ok) {
        return;
      }

      const json: RestResponse<StoreResult> = await response.json();

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

/**
 * 店舗一覧を検索します.
 *
 * @param parameters パラメータ
 * @param onSuccess 成功時の処理
 * @param onError 失敗時の処理
 * @returns AppThunk 遅延処理
 */
export const searchStores =
  (
    parameters: api.SearchStoresCondition,
    onSuccess?: (result: StoresResult) => void,
    onError?: (options: { e: unknown; result?: ErrorResult }) => void,
  ): AppThunk =>
  async (dispatch) => {
    try {
      const response = await api.companies.getStores(parameters);
      if (!response.ok) {
        return;
      }

      const json: RestResponse<StoresResult> = await response.json();

      dispatch(storeModule.actions.setData(json.result?.data ?? []));
      dispatch(storeModule.actions.setHits(json.result?.totalHits ?? 0));

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
