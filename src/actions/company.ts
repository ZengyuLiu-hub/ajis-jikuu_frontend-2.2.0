// src/actions/company.ts

import { CompaniesResult  } from '../api/company';
import { companyModule } from '../modules/company';
import * as api from '../api/company';
import { BusinessError, ErrorResult, RestResponse } from '../app/http';
import { AppThunk } from '../app/store';
import { actionHelper } from './actionHelper';

/**
 * 企业一覧を検索します.
 *
 * @param parameters パラメータ
 * @param onSuccess 成功時の処理
 * @param onError 失敗時の処理
 * @returns AppThunk 遅延処理
 */
export const searchCompanies =
  (
    parameters: api.SearchCompaniesCondition,
    onSuccess?: (result: CompaniesResult) => void,
    onError?: (options: { e: unknown; result?: ErrorResult }) => void,
  ): AppThunk =>
  async (dispatch) => {
    try {
      const response = await api.company.getCompanys(parameters);
      if (!response.ok) {
        return;
      }

      const json: RestResponse<CompaniesResult> = await response.json();

      dispatch(companyModule.actions.setData(json.result?.data ?? []));
      dispatch(companyModule.actions.setHits(json.result?.totalHits ?? 0));

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
