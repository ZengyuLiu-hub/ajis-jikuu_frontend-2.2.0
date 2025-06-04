import { BusinessError, ErrorResult, RestResponse } from '../app/http';
import { AppThunk } from '../app/store';

import * as api from '../api';

import { actionHelper } from './actionHelper';

/**
 * 商品ロケーションを検索します.
 *
 * @param parameters パラメータ
 * @param onSuccess 成功時の処理
 * @param onError 失敗時の処理
 * @returns AppThunk 遅延処理
 */
export const searchProductLocations =
  (
    parameters:
      | api.InventoryLocationSearchCondition
      | api.PlanogramLocationSearchCondition,
    onSuccess?: (result: api.ProductLocationSearchResult) => void,
    onError?: (options: { e: unknown; result?: ErrorResult }) => void,
  ): AppThunk =>
  async (dispatch) => {
    try {
      let response;
      if (api.isPlanogramLocationSearch(parameters)) {
        response = await api.products.getPlanogramLocations(parameters);
      } else {
        response = await api.products.getInventoryLocations(parameters);
      }
      if (!response.ok) {
        return;
      }

      const json: RestResponse<api.ProductLocationSearchResult> =
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
