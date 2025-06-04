import { Store, InventoryDatesData, InventorySchedulesData } from '../types';

import { http, Result } from '../app/http';
import dayjs from 'dayjs';

export interface StoreCondition {
  jurisdictionClass: string;
  companyCode: string;
  storeCode: string;
}

export interface SearchStoresCondition {
  jurisdictionClass?: string;
  companyCode?: string;
  companyName?: string;
  storeCode?: string;
  storeName?: string;
  storeName2?: string;
  page?: number;
  pageRecords?: number;
}

export interface InventoriesCondition {
  jurisdictionClass: string;
  companyCode: string;
  storeCode: string;
  inventoryDateFrom?: Date;
  inventoryDateTo?: Date;
  linkedSchedule: boolean;
  page?: number;
  pageRecords?: number;
}

export interface InventoryCondition {
  companyCode: string;
  storeCode: string;
  inventoryDate: string;
}

export interface InventorySchedulesCondition {
  jurisdictionClass: string;
  companyCode: string;
  storeCode: string;
  mapId?: string;
  version?: number;
}

export type InventoryDatesResult = {
  data: InventoryDatesData[];
  totalHits: number;
} & Result;

export type InventoryResult = {
  data: InventoryDatesData;
} & Result;

export type InventorySchedulesResult = {
  data: InventorySchedulesData[];
} & Result;

export type StoreResult = {
  data: Store;
} & Result;

export type StoresResult = {
  data: Store[];
  totalHits: number;
} & Result;

class Companies {
  getCompanies = async () => {
    return await http.get('api/companies');
  };

  /**
   * 棚卸スケジュールを取得します.
   *
   * @param condition 検索条件
   * @returns Promise<Response> リクエスト結果
   */
  getInventorySchedules = async (condition: InventorySchedulesCondition) => {
    const paths = [];
    paths.push('api');
    paths.push('companies');
    paths.push(condition.companyCode);
    paths.push('stores');
    paths.push(condition.storeCode);
    paths.push('inventories');
    paths.push('schedules');

    const queries = [];
    if (condition.jurisdictionClass) {
      queries.push(`jc=${condition.jurisdictionClass}`);
    }
    if (condition.mapId) {
      queries.push(`mi=${condition.mapId}`);
    }
    if (condition.version) {
      queries.push(`v=${condition.version}`);
    }

    const url = [paths.join('/'), queries.join('&')].join('?');

    return await http.get(url);
  };

  /**
   * 棚卸を取得します.
   *
   * @param condition 検索条件
   * @returns Promise<Response> リクエスト結果
   */
  getInventories = async ({
    jurisdictionClass,
    companyCode,
    storeCode,
    inventoryDateFrom,
    inventoryDateTo,
    linkedSchedule,
    page,
    pageRecords,
  }: InventoriesCondition) => {
    const paths = [];
    paths.push('api');
    paths.push('companies');
    paths.push(companyCode);
    paths.push('stores');
    paths.push(storeCode);
    paths.push('inventories');

    const queries = [];
    // 管轄区分
    if (jurisdictionClass) {
      queries.push(`jc=${jurisdictionClass}`);
    }
    // 棚卸日From
    if (inventoryDateFrom) {
      queries.push(`from=${dayjs(inventoryDateFrom).format('YYYY-MM-DD')}`);
    }
    // 棚卸日To
    if (inventoryDateTo) {
      queries.push(`to=${dayjs(inventoryDateTo).format('YYYY-MM-DD')}`);
    }
    // スケジュール連携済み
    queries.push(`ls=${linkedSchedule}`);
    // ページ番号
    if (page) {
      queries.push(`p=${page}`);
    }
    // 1ページ表示件数
    if (pageRecords) {
      queries.push(`pr=${pageRecords}`);
    }

    const url = [paths.join('/'), queries.join('&')].join('?');

    return await http.get(url);
  };

  /**
   * 店舗を取得します.
   *
   * @param condition 検索条件
   * @returns Promise<Response> リクエスト結果
   */
  getStore = async (condition: StoreCondition) => {
    const paths = [];
    paths.push('api');
    paths.push('companies');
    paths.push(condition.companyCode);
    paths.push('stores');
    paths.push(condition.storeCode);

    const queries = [];
    // 管轄区分
    if (condition.jurisdictionClass) {
      queries.push(`jc=${condition.jurisdictionClass}`);
    }

    const url = [paths.join('/'), queries.join('&')].join('?');

    return await http.get(url);
  };

  /**
   * 店舗を取得します.
   *
   * @param condition 検索条件
   * @param condition.companyCode 企業コード
   * @param condition.jurisdictionClass 管轄区分
   * @param condition.storeCode 店舗コード
   * @param condition.companyName 企業名
   * @param condition.storeName 店舗名
   * @param condition.page ページ番号
   * @param condition.pageRecords 1ページの表示件数
   * @returns Promise<Response> リクエスト結果
   */
  getStores = async ({
    companyCode,
    jurisdictionClass,
    storeCode,
    companyName,
    storeName,
    page,
    pageRecords,
  }: SearchStoresCondition) => {
    const paths = [];
    paths.push('api');
    paths.push('companies');
    if (companyCode) {
      paths.push(companyCode);
    }
    paths.push('stores');

    const queries = [];
    if (jurisdictionClass) {
      queries.push(`jc=${jurisdictionClass}`);
    }
    if (storeCode) {
      queries.push(`sc=${storeCode}`);
    }
    if (companyName) {
      queries.push(`cn=${companyName}`);
    }
    if (storeName) {
      queries.push(`sn=${storeName}`);
    }
    if (page) {
      queries.push(`p=${page}`);
    }
    if (pageRecords) {
      queries.push(`pr=${pageRecords}`);
    }

    const url = [paths.join('/'), queries.join('&')].join('?');

    return await http.get(url);
  };
}

export const companies = new Companies();
