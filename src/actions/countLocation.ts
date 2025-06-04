import * as api from '../api';
import { BusinessError, ErrorResult, RestResponse } from '../app/http';
import { AppThunk } from '../app/store';
import { actionHelper } from './actionHelper';

/**
 * カウントロケーションを取得します.
 *
 * @param parameters パラメータ
 * @param onSuccess 成功時の処理
 * @param onError 失敗時の処理
 * @returns AppThunk 遅延処理
 */
export const getCountLocation =
  (
    parameters: api.CountLocationCondition,
    onSuccess?: (result: api.CountLocationResult) => void,
    onError?: (options: { e: unknown; result?: ErrorResult }) => void,
  ): AppThunk =>
  async (dispatch) => {
    try {
      const response = await api.inventoryData.getCountLocations(parameters);
      if (!response.ok) {
        return;
      }

      const json: RestResponse<api.CountLocationResult> = await response.json();

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
