import { MapVersion, SaveData } from '../types';

import { http, RestRequest, Result } from '../app/http';

export type MapVersionCondition = {
  mapId: string;
  version: string;
};

export type MapSaveCondition = {
  mapId: string;
  version: number;
  rowVersion: number;
  data: SaveData;
};

export type MapVersionSaveCondition = {
  /** 管轄区分 */
  jurisdictionClass: string;
  /** 企業コード */
  companyCode: string;
  /** 店舗コード */
  storeCode: string;
  /** 棚卸日 */
  inventoryDates: string[];
  /** ゾーンコード */
  zoneCode: string;
  /** DO コード */
  doCode: string;
  /** メモ */
  note: string;
  /** 行バージョン */
  rowVersion: number;
  /** マップID */
  mapId?: string;
  /** バージョン */
  version?: number;
};

/**
 * マップ版数の複製条件
 */
export type MapVersionCopyCondition = {
  /** 管理区分 */
  jurisdictionClass: string;

  /** 企業コード */
  companyCode: string;

  /** 店舗コード */
  storeCode: string;

  /** マップID */
  mapId: string;

  /** マップ版数 */
  version: number;
};

/**
 * マップ版数の削除条件
 */
export type MapVersionDeleteCondition = {
  /** マップID */
  mapId: string;

  /** バージョン */
  version: number;

  /** 行バージョン */
  rowVersion: number;
};

export type InventoryScheduleCondition = {
  mapId: string;
  version: number;
};

/**
 * 編集マップ排他管理条件
 */
export type EditMapExclusiveCondition = {
  /** マップID */
  mapId: string;

  /** バージョン */
  version: number;

  /** 行バージョン */
  rowVersion: number;
};

export type MapResult = {
  data: any;
} & Result;

export type MapVersionResult = {
  data: MapVersion;
} & Result;

export type EditMapResult = {
  mapVersion: MapVersion;
  data: SaveData;
} & Result;

export type MapsResult = {
  data: any[];
} & Result;

export type MapVersionSaveResult = {
  data: {
    mapId: string;
    version: number;
  };
} & Result;

/**
 * マップ版数の複製結果
 */
export type MapVersionCopyResult = {
  data: {
    /** マップID */
    mapId: string;

    /** マップ版数 */
    version: number;
  };
} & Result;

/**
 * マップ版数の削除結果
 */
export type MapVersionDeleteResult = {
  data: {
    /** マップID */
    mapId: string;

    /** バージョン */
    version: number;
  };
} & Result;

export type InventoryScheduleResult = {
  data: any;
  /** マップ版数 */
  mapVersion: {
    /** メモ */
    note: string;
    /** 行バージョン */
    rowVersion: number;
  };
} & Result;

class Maps {
  /**
   * マップ版数を取得します.
   *
   * @param mapId マップID
   * @param version バージョン
   * @returns Promise<Response> リクエスト結果
   */
  getMapVersion = async (mapId: string, version: string) => {
    return await http.get(`api/maps/${mapId}/versions/${version}`);
  };

  /**
   * マップレイアウトを保存します.
   *
   * @param payload 保存データ
   * @returns Promise<Response> リクエスト結果
   */
  saveMapLayouts = async (payload: RestRequest<MapSaveCondition>) => {
    return await http.put(
      `api/maps/${payload.parameters?.mapId}/versions/${payload.parameters?.version}/layouts`,
      payload
    );
  };

  /**
   * マップ版数を保存します.
   *
   * @param payload 保存データ
   * @returns Promise<Response> リクエスト結果
   */
  saveMapVersion = async (payload: RestRequest<MapVersionSaveCondition>) => {
    if (payload.parameters?.mapId && payload.parameters?.version) {
      return await http.put(
        `api/maps/${payload.parameters?.mapId}/versions/${payload.parameters?.version}`,
        payload
      );
    }
    return await http.post(`api/maps/versions`, payload);
  };

  /**
   * マップ版数を複製します.
   *
   * @param payload 複製データ
   * @returns Promise<Response> リクエスト結果
   */
  copyMapVersion = async (payload: RestRequest<MapVersionCopyCondition>) => {
    return await http.post(
      `api/maps/${payload.parameters?.mapId}/versions/${payload.parameters?.version}/copy`,
      payload
    );
  };

  /**
   * マップ版数を削除します.
   *
   * @param condition 削除条件
   * @returns Promise<Response> リクエスト結果
   */
  deleteMapVersion = async ({
    mapId,
    version,
    rowVersion,
  }: MapVersionDeleteCondition) => {
    const params = new URLSearchParams();
    params.set('rv', `${rowVersion}`);
    return await http.delete(`api/maps/${mapId}/versions/${version}`, params);
  };

  /**
   * 棚卸スケジュールを取得します.
   *
   * @param condition 検索条件
   * @returns Promise<Response> リクエスト結果
   */
  getInventorySchedule = async ({
    mapId,
    version,
  }: InventoryScheduleCondition) => {
    return await http.get(
      `api/maps/${mapId}/versions/${version}/inventories/schedules`
    );
  };

  /**
   * 編集マップに論理ロックを設定します.
   */
  lockEditMap = async ({
    mapId,
    version,
    rowVersion,
  }: EditMapExclusiveCondition) => {
    const params = new URLSearchParams();
    params.set('rv', `${rowVersion}`);
    return await http.patch(
      `api/maps/${mapId}/versions/${version}/lock`,
      params
    );
  };

  /**
   * 編集マップの論理ロックを解除します.
   */
  unlockEditMap = async ({
    mapId,
    version,
    rowVersion,
  }: EditMapExclusiveCondition) => {
    const params = new URLSearchParams();
    params.set('rv', `${rowVersion}`);
    return await http.patch(
      `api/maps/${mapId}/versions/${version}/unlock`,
      params
    );
  };
}

export const maps = new Maps();
