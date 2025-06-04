import * as api from '../api';
import {
  BusinessError,
  ErrorResult,
  PayloadTooLargeError,
  RestRequest,
  RestResponse,
} from '../app/http';
import { AppThunk } from '../app/store';
import { actionHelper } from './actionHelper';

/**
 * カウントデータを検索します.
 *
 * @param parameters パラメータ
 * @param onSuccess 成功時の処理
 * @param onError 失敗時の処理
 * @returns AppThunk 遅延処理
 */
export const searchCountData =
  (
    parameters: api.CountDataSearchCondition,
    onSuccess?: (result: api.CountDataResult) => void,
    onError?: (options: { e: unknown; result?: ErrorResult }) => void,
  ): AppThunk =>
  async (dispatch) => {
    try {
      var response: Response = await api.inventoryData.getCountData(parameters);

      if (!response.ok) {
        return;
      }

      const json: RestResponse<api.CountDataResult> = await response.json();

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

/**
 * 棚割データを検索します.
 *
 * @param parameters パラメータ
 * @param onSuccess 成功時の処理
 * @param onError 失敗時の処理
 * @returns AppThunk 遅延処理
 */
export const searchPlanogram =
  (
    parameters: api.PlanogramSearchCondition,
    onSuccess?: (result: api.PlanogramResult) => void,
    onError?: (options: { e: unknown; result?: ErrorResult }) => void,
  ): AppThunk =>
  async (dispatch) => {
    try {
      var response: Response = await api.inventoryData.getPlanogram(parameters);

      if (!response.ok) {
        return;
      }

      const json: RestResponse<api.PlanogramResult> = await response.json();

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

/**
 * 棚割データ CSV 取込を実行します.
 *
 * @param parameters パラメータ
 * @param file ファイル
 * @param onSuccess 成功時の処理
 * @param onError 失敗時の処理
 * @returns AppThunk 遅延処理
 */
export const uploadPlanogram =
  (
    parameters: api.PlanogramUploadCondition,
    file: File,
    onSuccess?: (result: api.PlanogramUploadResult) => void,
    onError?: (options: { e: unknown; result?: ErrorResult }) => void,
  ): AppThunk =>
  async (dispatch) => {
    const payload: RestRequest<api.PlanogramUploadCondition> = { parameters };

    try {
      const response = await api.inventoryData.uploadPlanogram(payload, file);
      if (!response.ok) {
        return;
      }

      const json: RestResponse<api.PlanogramUploadResult> =
        await response.json();
      if (onSuccess) {
        onSuccess(json.result);
      }
    } catch (e) {
      if (onError) {
        if (e instanceof BusinessError || e instanceof PayloadTooLargeError) {
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
