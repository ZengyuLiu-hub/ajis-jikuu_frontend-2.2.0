import { createSelector } from '@reduxjs/toolkit';
import { useAppSelector } from '../app/hooks';
import { InventoryDataState } from '../modules';

const inventoryOperationDates = createSelector(
  (state: InventoryDataState) => state.inventoryOperationDates,
  (list) => list,
);
/**
 * 棚卸実施日リストを取得します.
 *
 * @returns State で保持された値
 */
export const useInventoryOperationDates = () =>
  useAppSelector(({ inventoryData }) => inventoryOperationDates(inventoryData));

const inventoryOperationDateTotalHits = createSelector(
  (state: InventoryDataState) => state.inventoryOperationDateTotalHits,
  (hits) => hits,
);
/**
 * 棚卸実施日リスト総ヒット件数を取得します.
 *
 * @returns State で保持された値
 */
export const useInventoryOperationDateTotalHits = () =>
  useAppSelector(({ inventoryData }) =>
    inventoryOperationDateTotalHits(inventoryData),
  );
