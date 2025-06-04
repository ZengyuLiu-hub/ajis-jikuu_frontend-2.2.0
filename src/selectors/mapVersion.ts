import { createSelector } from '@reduxjs/toolkit';

import { useAppSelector } from '../app/hooks';
import { MapVersionState } from '../modules';

export const useMapVersionState = (): MapVersionState =>
  useAppSelector(({ mapVersion }) => mapVersion);

const mapVersionData = createSelector(
  (state: MapVersionState) => state.data,
  (data) => data
);
export const useMapVersionData = () =>
  useAppSelector(({ mapVersion }) => mapVersionData(mapVersion));

const mapVersionTotalHits = createSelector(
  (state: MapVersionState) => state.hits,
  (hits) => hits
);
export const useMapVersionTotalHits = () =>
  useAppSelector(({ mapVersion }) => mapVersionTotalHits(mapVersion));
