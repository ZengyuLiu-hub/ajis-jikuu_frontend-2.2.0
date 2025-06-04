import { createSelector } from '@reduxjs/toolkit';

import { useAppSelector } from '../app/hooks';
import { StoreState } from '../modules';

export const useStoreState = (): StoreState =>
  useAppSelector(({ store }) => store);

const storeData = createSelector(
  (state: StoreState) => state.data,
  (data) => data
);
export const useStoreData = () =>
  useAppSelector(({ store }) => storeData(store));

const storeTotalHits = createSelector(
  (state: StoreState) => state.hits,
  (hits) => hits
);
export const useStoreTotalHits = () =>
  useAppSelector(({ store }) => storeTotalHits(store));
