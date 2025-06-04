import dayjs from 'dayjs';
import { SearchParamsOption } from 'ky';
import { http, RestRequest, Result } from '../app/http';

import {
  CountData,
  CountLocation,
  InventoryOperationDate,
  Planogram,
} from '../types';

const UPLOAD_PARAM_FILENAME = 'file';

export type CountLocationCondition = {
  jurisdictionClass: string;
  companyCode: string;
  storeCode: string;
  inventoryDates: Date[];
};

export type CountLocationResult = {
  data: CountLocation[];
} & Result;

export type InventoryOperationDatesCondition = {
  jurisdictionClass: string;
  companyCode: string;
  companyName: string;
  storeCode: string;
  storeName: string;
  inventoryDateFrom?: Date;
  inventoryDateTo?: Date;
  page?: number;
  pageRecords?: number;
};

export type InventoryOperationDateResult = {
  data: InventoryOperationDate[];
  totalHits: number;
} & Result;

export type CountDataSearchCondition = {
  jurisdictionClass: string;
  companyCode: string;
  storeCode: string;
  inventoryDates: Date[];
  locationNum: string;
  areaId: string;
};

export type CountDataResult = {
  data: CountData[];
} & Result;

/**
 * 棚割データ取得条件.
 */
export type PlanogramSearchCondition = {
  jurisdictionClass: string;
  companyCode: string;
  storeCode: string;
  locationNum: string;
  areaId: string;
};

export type PlanogramResult = {
  data: Planogram[];
} & Result;

/**
 * 棚割データアップロード結果.
 */
export type PlanogramUploadResult = {
  data: boolean;
} & Result;

/**
 * 棚割データアップロード条件.
 */
export type PlanogramUploadCondition = {
  /** 管轄区分 */
  jurisdictionClass: string;

  /** 企業コード */
  companyCode: string;

  /** 店舗コード */
  storeCode: string;
};

/**
 * ロケーション比較：ロケーション情報
 */
type Location = {
  /** エリアID */
  areaId: string;

  /** ロケーション番号 */
  locationNum: string;
};

/**
 * ロケーション比較：今回条件
 */
export type CompareLocationNewCondition = {
  /** 管轄区分 */
  jurisdictionClass?: string;

  /** 企業コード */
  companyCode?: string;

  /** 店舗コード */
  storeCode?: string;

  /** 棚卸日 */
  inventoryDates?: Date[];

  /** ロケーションリスト */
  locations: Location[];
};

/**
 * ロケーション比較：前回条件
 */
export type CompareLocationOldCondition = {
  /** 管轄区分 */
  jurisdictionClass: string;

  /** 企業コード */
  companyCode: string;

  /** 店舗コード */
  storeCode: string;

  /** 棚卸日 */
  inventoryDate: Date;
};

/**
 * ロケーション比較：比較条件
 */
export type CompareCondition = {
  /** 今回ロケーション条件 */
  newLocation: CompareLocationNewCondition;

  /** 過去ロケーション条件 */
  oldLocation: CompareLocationOldCondition;
};

/**
 * ロケーション比較：比較結果トークン
 */
export type CompareLocationResult = {
  data: string;
} & Result;

/**
 * ロケーション比較：店舗情報
 */
export type CompareStore = {
  /** 管轄区分 */
  jurisdictionClass: string;

  /** 管轄区分名 */
  jurisdictionName: string;

  /** 企業コード */
  companyCode: string;

  /** 企業名 */
  companyName: string;

  /** 店舗コード */
  storeCode: string;

  /** 店舗名 */
  storeName: string;

  /** 棚卸日 */
  inventoryDates: Date[];
};

/**
 * ロケーション比較：差分結果
 */
export type DiffResult = {
  /** 今回ロケーション情報 */
  newLocation: Location;

  /** 前回ロケーション情報 */
  oldLocation: Location;

  /** 差分有無 */
  difference: boolean;
};

/**
 * ロケーション比較：比較結果
 */
export type CompareResult = {
  /** 今回データ店舗情報 */
  newStore: CompareStore;

  /** 過去データ店舗情報 */
  oldStore: CompareStore;

  /** 今回ロケーションカウント数 */
  newLocationCount: number;

  /** 過去ロケーションカウント数 */
  oldLocationCount: number;

  /** 差分結果一覧 */
  results: DiffResult[];
};

/**
 * ロケーション比較結果レスポンス
 */
export type StoredCompareResult = {
  data: CompareResult;
} & Result;

/**
 * 棚卸データ
 */
class InventoryData {
  /**
   * カウントロケーションを取得します.
   *
   * @param condition 検索条件
   * @returns Promise<Response> リクエスト結果
   */
  getCountLocations = async ({
    jurisdictionClass,
    companyCode,
    storeCode,
    inventoryDates,
  }: CountLocationCondition) => {
    const queries = [];
    if (jurisdictionClass) {
      queries.push(`jc=${jurisdictionClass}`);
    }
    if (companyCode) {
      queries.push(`cc=${companyCode}`);
    }
    if (storeCode) {
      queries.push(`sc=${storeCode}`);
    }
    if (inventoryDates) {
      inventoryDates.forEach((date) =>
        queries.push(`ids=${dayjs(date).format('YYYY-MM-DD')}`),
      );
    }

    return await http.get(
      `api/inventory-data/count-locations?${queries.join('&')}`,
    );
  };

  /**
   * 棚卸実施日リストを取得します.
   *
   * @param condition 検索条件
   * @returns Promise<Response> リクエスト結果
   */
  getOperationDates = async ({
    jurisdictionClass,
    companyCode,
    companyName,
    storeCode,
    storeName,
    inventoryDateFrom,
    inventoryDateTo,
    page,
    pageRecords,
  }: InventoryOperationDatesCondition) => {
    const searchParams: SearchParamsOption = {};
    if (jurisdictionClass) {
      searchParams['jc'] = jurisdictionClass;
    }
    if (companyCode) {
      searchParams['cc'] = companyCode;
    }
    if (companyName) {
      searchParams['cn'] = companyName;
    }
    if (storeCode) {
      searchParams['sc'] = storeCode;
    }
    if (storeName) {
      searchParams['sn'] = storeName;
    }
    if (inventoryDateFrom) {
      searchParams['from'] = dayjs(inventoryDateFrom).format('YYYY-MM-DD');
    }
    if (inventoryDateTo) {
      searchParams['to'] = dayjs(inventoryDateTo).format('YYYY-MM-DD');
    }
    if (page) {
      searchParams['p'] = page;
    }
    if (pageRecords) {
      searchParams['pr'] = pageRecords;
    }
    return await http.get('api/inventory-data/operation-dates', searchParams);
  };

  /**
   * カウントデータを取得します.
   *
   * @param condition 検索条件
   * @returns Promise<Response> リクエスト結果
   */
  getCountData = async ({
    jurisdictionClass,
    companyCode,
    storeCode,
    locationNum,
    inventoryDates,
    areaId,
  }: CountDataSearchCondition) => {
    const queries = [];
    if (jurisdictionClass) {
      queries.push(`jc=${jurisdictionClass}`);
    }
    if (companyCode) {
      queries.push(`cc=${companyCode}`);
    }
    if (storeCode) {
      queries.push(`sc=${storeCode}`);
    }
    if (locationNum) {
      queries.push(`ln=${locationNum}`);
    }
    if (inventoryDates) {
      inventoryDates.forEach((date) =>
        queries.push(`ids=${dayjs(date).format('YYYY-MM-DD')}`),
      );
    }
    if (areaId) {
      queries.push(`ai=${areaId}`);
    }
    return await http.get(`api/inventory-data/count-data?${queries.join('&')}`);
  };

  /**
   * 棚割データを取得します.
   *
   * @param condition 検索条件
   * @returns Promise<Response> リクエスト結果
   */
  getPlanogram = async ({
    jurisdictionClass,
    companyCode,
    storeCode,
    locationNum,
    areaId,
  }: PlanogramSearchCondition) => {
    const queries = [];
    if (jurisdictionClass) {
      queries.push(`jc=${jurisdictionClass}`);
    }
    if (companyCode) {
      queries.push(`cc=${companyCode}`);
    }
    if (storeCode) {
      queries.push(`sc=${storeCode}`);
    }
    if (locationNum) {
      queries.push(`ln=${locationNum}`);
    }
    if (areaId) {
      queries.push(`ai=${areaId}`);
    }
    return await http.get(`api/inventory-data/planograms?${queries.join('&')}`);
  };

  /**
   * 棚割データをアップロードします.
   *
   * @param payload 条件
   * @param file ファイル
   * @returns Promise<Response> リクエスト結果
   */
  uploadPlanogram = async (
    payload: RestRequest<PlanogramUploadCondition>,
    file: File,
  ) => {
    const formData = new FormData();
    formData.append(UPLOAD_PARAM_FILENAME, file);
    formData.append(
      'inputData',
      new Blob([JSON.stringify(payload.parameters)], {
        type: 'application/json',
      }),
    );

    return await http.postMultipart(
      'api/inventory-data/planograms/upload',
      formData,
    );
  };

  /**
   * ロケーション比較を実行します.
   *
   * @param payload 検索条件
   * @returns ロケーション比較結果トークンID
   */
  compareLocation = async (payload: RestRequest<CompareCondition>) => {
    return await http.post('api/inventory-data/compare/locations', payload);
  };

  /**
   * ロケーション比較結果を取得します.
   *
   * @param payload ロケーション比較結果トークンID
   * @returns ロケーション比較結果
   */
  getCompareResult = async (payload: RestRequest<string>) => {
    return await http.get(
      `api/inventory-data/compare/results/${payload.parameters}`,
    );
  };
}

export const inventoryData = new InventoryData();
