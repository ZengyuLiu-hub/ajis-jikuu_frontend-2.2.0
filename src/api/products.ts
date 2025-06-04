import dayjs from 'dayjs';

import { ProductLocation } from '../types';

import { http, Result } from '../app/http';

// 棚卸のロケーション検索条件
export type InventoryLocationSearchCondition = {
  jurisdictionClass: string;
  companyCode: string;
  storeCode: string;
  inventoryDates?: Date[];
  productName?: string;
  sku?: string;
  twoGradeBarcode?: string;
};

// 棚割のロケーション検索条件
export type PlanogramLocationSearchCondition = {
  mapId: string;
  version: number;
  sku?: string;
};

const initialCondition: {
  planogramLocationSearch: PlanogramLocationSearchCondition;
} = {
  planogramLocationSearch: {
    mapId: 'Unknown',
    version: 1,
  },
};

/**
 * 指定された条件が棚割データのロケーションを検索するものかどうかを返却します.
 *
 * @param condition 検索条件
 * @returns 棚割のロケーション検索条件の場合は true
 */
export const isPlanogramLocationSearch = (
  condition:
    | InventoryLocationSearchCondition
    | PlanogramLocationSearchCondition,
): condition is PlanogramLocationSearchCondition =>
  condition &&
  Object.keys(initialCondition.planogramLocationSearch).every(
    (key) => key in condition,
  );

// 商品ロケーション検索結果
export type ProductLocationSearchResult = {
  data: ProductLocation[];
} & Result;

class Products {
  /**
   * 棚卸のロケーションを取得します.
   *
   * @param condition 検索条件
   * @returns Promise<Response> リクエスト結果
   */
  getInventoryLocations = async ({
    jurisdictionClass,
    companyCode,
    storeCode,
    inventoryDates,
    productName,
    sku,
    twoGradeBarcode,
  }: InventoryLocationSearchCondition) => {
    const searchParams = new URLSearchParams();
    if (inventoryDates) {
      inventoryDates.forEach((date) =>
        searchParams.append('ids', `${dayjs(date).format('YYYY-MM-DD')}`),
      );
    }
    if (productName) {
      searchParams.set('pn', productName);
    }
    if (sku) {
      searchParams.set('sku', sku);
    }
    if (twoGradeBarcode) {
      searchParams.set('tb', twoGradeBarcode);
    }

    return await http.get(
      `api/products/jurisdictions/${jurisdictionClass}/companies/${companyCode}/stores/${storeCode}/locations`,
      searchParams,
    );
  };

  /**
   * 棚割のロケーションを取得します.
   *
   * @param condition 検索条件
   * @returns Promise<Response> リクエスト結果
   */
  getPlanogramLocations = async ({
    mapId,
    version,
    sku,
  }: PlanogramLocationSearchCondition) => {
    const searchParams = new URLSearchParams();
    if (sku) {
      searchParams.set('sku', sku);
    }

    return await http.get(
      `api/products/maps/${mapId}/versions/${version}/locations`,
      searchParams,
    );
  };
}

export const products = new Products();
