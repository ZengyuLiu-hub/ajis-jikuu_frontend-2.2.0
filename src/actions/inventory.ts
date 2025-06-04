import { AppThunk } from '../app/store';
import { BusinessError, ErrorResult, RestResponse } from '../app/http';

import * as api from '../api';
import { mapVersionModule, inventoryDataModule } from '../modules';

import { actionHelper } from './actionHelper';

/**
 * 棚卸実施日リストを検索します.
 *
 * @param parameters パラメータ
 * @param onSuccess 成功時の処理
 * @param onError 失敗時の処理
 * @returns AppThunk 遅延処理
 */
export const searchInventoryOperationDates =
  (
    parameters: api.InventoryOperationDatesCondition,
    onSuccess?: (result: api.InventoryOperationDateResult) => void,
    onError?: (options: { e: unknown; result?: ErrorResult }) => void,
  ): AppThunk =>
  async (dispatch) => {
    try {
      const response = await api.inventoryData.getOperationDates(parameters);
      if (!response.ok) {
        return;
      }

      const json: RestResponse<api.InventoryOperationDateResult> =
        await response.json();

      dispatch(
        inventoryDataModule.actions.setInventoryOperationDates(
          json.result?.data ?? [],
        ),
      );
      dispatch(
        inventoryDataModule.actions.setInventoryOperationDateTotalHits(
          json.result?.totalHits ?? 0,
        ),
      );

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
 * 棚卸一覧を検索します.
 *
 * @param parameters パラメータ
 * @param onSuccess 成功時の処理
 * @param onError 失敗時の処理
 * @returns AppThunk 遅延処理
 */
export const searchInventories =
  (
    parameters: api.InventoriesCondition,
    onSuccess?: (result: api.InventoryDatesResult) => void,
    onError?: (e: unknown) => void,
  ): AppThunk =>
  async (dispatch) => {
    try {
      const response = await api.companies.getInventories(parameters);
      if (!response.ok) {
        return;
      }

      const json: RestResponse<api.InventoryDatesResult> =
        await response.json();

      dispatch(mapVersionModule.actions.setData(json.result?.data ?? []));
      dispatch(mapVersionModule.actions.setHits(json.result?.totalHits ?? 0));

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
 * 棚卸スケジュールを検索します.
 *
 * @param parameters パラメータ
 * @param onSuccess 成功時の処理
 * @param onError 失敗時の処理
 * @returns AppThunk 遅延処理
 */
export const searchInventorySchedules =
  (
    parameters: api.InventorySchedulesCondition,
    onSuccess?: (result: api.InventorySchedulesResult) => void,
    onError?: (e: unknown) => void,
  ): AppThunk =>
  async (dispatch) => {
    try {
      const response = await api.companies.getInventorySchedules(parameters);
      if (!response.ok) {
        return;
      }

      const json: RestResponse<api.InventorySchedulesResult> =
        await response.json();

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
