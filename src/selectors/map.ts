import { createSelector } from '@reduxjs/toolkit';

import { useAppSelector } from '../app/hooks';
import { MapState } from '../modules';

export const useMapState = (): MapState => useAppSelector(({ map }) => map);

const mapData = createSelector(
  (state: MapState) => state.data,
  (data) => data
);
export const useMapData = () => useAppSelector(({ map }) => mapData(map));
