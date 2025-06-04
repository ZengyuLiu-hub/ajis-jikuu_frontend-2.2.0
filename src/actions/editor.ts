import { AppThunk } from '../app/store';
import {
  BusinessError,
  ErrorResult,
  PayloadTooLargeError,
  RestRequest,
  RestResponse,
} from '../app/http';

import * as api from '../api';

import { actionHelper } from './actionHelper';

/**
 * Excel マップ取込を実行します.
 *
 * @param parameters パラメータ
 * @param onSuccess 成功時の処理
 * @param onError 失敗時の処理
 * @returns AppThunk 遅延処理
 */
export const upload =
  (
    parameters: api.ImportExcelApiUploadCondition,
    file: File,
    onSuccess?: (result: api.ImportExcelApiUploadResult) => void,
    onError?: (options: { e: unknown; result?: ErrorResult }) => void,
  ): AppThunk =>
  async (dispatch) => {
    const payload: RestRequest<api.ImportExcelApiUploadCondition> = {
      parameters,
    };

    try {
      const response = await api.excelImports.upload(payload, file);
      if (!response.ok) {
        return;
      }

      const json: RestResponse<api.ImportExcelApiUploadResult> =
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
