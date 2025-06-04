import { AppThunk } from '../app/store';
import {
  BusinessError,
  ErrorResult,
  OptimisticLockError,
  RestRequest,
  RestResponse,
} from '../app/http';

import * as api from '../api';

import { actionHelper } from './actionHelper';

/**
 * マップ版数を取得します.
 *
 * @param parameters パラメータ
 * @param onSuccess 成功時の処理
 * @param onError 失敗時の処理
 * @returns AppThunk 遅延処理
 */
export const searchMapVersion =
  (
    parameters: api.MapVersionCondition,
    onSuccess?: (result: api.EditMapResult) => void,
    onError?: (options: { e: unknown; result?: ErrorResult }) => void,
  ): AppThunk =>
  async (dispatch) => {
    try {
      const response = await api.maps.getMapVersion(
        parameters.mapId,
        parameters.version,
      );
      if (!response.ok) {
        return;
      }

      const json: RestResponse<api.EditMapResult> = await response.json();

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
 * マップデータを保存します.
 *
 * @param parameters パラメータ
 * @param onSuccess 成功時の処理
 * @param onError 失敗時の処理
 * @returns AppThunk 遅延処理
 */
export const saveMapData =
  (
    parameters: api.MapSaveCondition,
    onSuccess?: (result: api.MapVersionResult) => void,
    onError?: (options: { e: unknown; result?: ErrorResult }) => void,
  ): AppThunk =>
  async (dispatch) => {
    try {
      const payload: RestRequest<api.MapSaveCondition> = { parameters };

      const response = await api.maps.saveMapLayouts(payload);
      if (!response.ok) {
        return;
      }

      const json: RestResponse<api.MapVersionResult> = await response.json();

      if (onSuccess) {
        onSuccess(json.result);
      }
    } catch (e) {
      if (onError) {
        if (e instanceof BusinessError || e instanceof OptimisticLockError) {
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
 * マップ版数を保存します.
 *
 * @param parameters パラメータ
 * @param onSuccess 成功時の処理
 * @param onError 失敗時の処理
 * @returns AppThunk 遅延処理
 */
export const saveMapVersion =
  (
    parameters: api.MapVersionSaveCondition,
    onSuccess?: (result: api.MapVersionSaveResult) => void,
    onError?: (options: { e: unknown; result?: ErrorResult }) => void,
  ): AppThunk =>
  async (dispatch) => {
    try {
      const payload: RestRequest<api.MapVersionSaveCondition> = { parameters };

      const response = await api.maps.saveMapVersion(payload);
      if (!response.ok) {
        return;
      }

      const json: RestResponse<api.MapVersionSaveResult> =
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

/**
 * マップ版数を複製します.
 *
 * @param parameters パラメータ
 * @param onSuccess 成功時の処理
 * @param onError 失敗時の処理
 * @returns AppThunk 遅延処理
 */
export const copyMapVersion =
  (
    parameters: api.MapVersionCopyCondition,
    onSuccess?: (result: api.MapVersionCopyResult) => void,
    onError?: (options: { e: unknown; result?: ErrorResult }) => void,
  ): AppThunk =>
  async (dispatch) => {
    try {
      const payload: RestRequest<api.MapVersionCopyCondition> = { parameters };

      const response = await api.maps.copyMapVersion(payload);
      if (!response.ok) {
        return;
      }

      const json: RestResponse<api.MapVersionSaveResult> =
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

/**
 * マップ版数を削除します.
 *
 * @param parameters パラメータ
 * @param onSuccess 成功時の処理
 * @param onError 失敗時の処理
 * @returns AppThunk 遅延処理
 */
export const deleteMapVersion =
  (
    parameters: api.MapVersionDeleteCondition,
    onSuccess?: (result: api.MapVersionDeleteResult) => void,
    onError?: (options: { e: unknown; result?: ErrorResult }) => void,
  ): AppThunk =>
  async (dispatch) => {
    try {
      const response = await api.maps.deleteMapVersion(parameters);
      if (!response.ok) {
        return;
      }

      const json: RestResponse<api.MapVersionDeleteResult> =
        await response.json();

      if (onSuccess) {
        onSuccess(json.result);
      }
    } catch (e) {
      if (onError) {
        if (e instanceof BusinessError || e instanceof OptimisticLockError) {
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
 * 棚卸スケジュールを取得します.
 *
 * @param parameters パラメータ
 * @param onSuccess 成功時の処理
 * @param onError 失敗時の処理
 * @returns AppThunk 遅延処理
 */
export const searchInventorySchedule =
  (
    parameters: api.InventoryScheduleCondition,
    onSuccess?: (result: api.InventoryScheduleResult) => void,
    onError?: (e: unknown) => void,
  ): AppThunk =>
  async (dispatch) => {
    try {
      const response = await api.maps.getInventorySchedule(parameters);
      if (!response.ok) {
        return;
      }

      const json: RestResponse<api.InventoryScheduleResult> =
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

/**
 * 編集マップに論理ロックを設定します.
 *
 * @param parameters パラメータ
 * @param onSuccess 成功時の処理
 * @param onError 失敗時の処理
 * @returns AppThunk 遅延処理
 */
export const lockEditMap =
  (
    parameters: api.EditMapExclusiveCondition,
    onSuccess?: (result: api.MapVersionResult) => void,
    onError?: (options: { e: unknown; result?: ErrorResult }) => void,
  ): AppThunk =>
  async (dispatch) => {
    try {
      const response = await api.maps.lockEditMap(parameters);
      if (!response.ok) {
        return;
      }

      const json: RestResponse<api.MapVersionResult> = await response.json();

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
 * 編集マップに論理ロックを解除します.
 *
 * @param parameters パラメータ
 * @param onSuccess 成功時の処理
 * @param onError 失敗時の処理
 * @returns AppThunk 遅延処理
 */
export const unlockEditMap =
  (
    parameters: api.EditMapExclusiveCondition,
    onSuccess?: (result: api.MapVersionResult) => void,
    onError?: (options: { e: unknown; result?: ErrorResult }) => void,
  ): AppThunk =>
  async (dispatch) => {
    try {
      const response = await api.maps.unlockEditMap(parameters);
      if (!response.ok) {
        return;
      }

      const json: RestResponse<api.MapVersionResult> = await response.json();

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
