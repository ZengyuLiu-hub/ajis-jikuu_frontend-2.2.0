import { createSelector } from '@reduxjs/toolkit';

import * as editorConstants from '../constants/editor';

import { useAppSelector } from '../app/hooks';
import { ViewerNodeState } from '../modules';
import { SideMenuTypes } from '../types';

/**
 * ビューアノードを取得します.
 *
 * @returns State
 */
export const useViewNodeState = (): ViewerNodeState =>
  useAppSelector(({ viewerNode }) => viewerNode);

const nodeConfigList = createSelector(
  (state: ViewerNodeState) => state.nodeConfigList,
  (list) => list,
);

const selectedNodeIds = createSelector(
  (state: ViewerNodeState) => state.selectedNodeIds,
  (ids) => ids,
);
/**
 * ビューア選択ノードIDを取得します.
 *
 * @returns State で保持された値
 */
export const useViewSelectedNodeIds = () =>
  useAppSelector(({ viewerNode }) => selectedNodeIds(viewerNode));

const selectedNodeList = createSelector(
  (state: ViewerNodeState) => state.selectedNodeList,
  (nodes) => nodes,
);
/**
 * ビューア選択ノードを取得します.
 *
 * @returns State で保持された値
 */
export const useViewSelectedNodeList = () =>
  useAppSelector(({ viewerNode }) => selectedNodeList(viewerNode));

// プロパティに locationNum を持つシェイプ一覧を取得します.
const locationNodes = createSelector(nodeConfigList, (nodes) =>
  nodes.filter((config) =>
    config.hasOwnProperty(editorConstants.SHAPE_PROP_NAME_LOCATION_NUM),
  ),
);
/**
 * ビューアロケーションノードを取得します.
 *
 * @returns State で保持された値
 */
export const useViewLocationNodes = () =>
  useAppSelector(({ viewerNode }) => locationNodes(viewerNode));

const areaIds = createSelector(nodeConfigList, (nodes) => {
  const areas = new Set();
  nodes
    .filter(
      (config) =>
        config.shape !== SideMenuTypes.AREA &&
        config.hasOwnProperty(editorConstants.SHAPE_PROP_NAME_AREA_ID),
    )
    .forEach((config) => config.areaId && areas.add(config.areaId));
  return Array.from(areas.values()).sort();
});
/**
 * ビューアエリアIDを取得します.
 *
 * @returns State で保持された値
 */
export const useViewAreaIds = () =>
  useAppSelector(({ viewerNode }) => areaIds(viewerNode));

const tableIds = createSelector(nodeConfigList, (nodes) => {
  const areaTables = new Set();
  nodes
    .filter((config) =>
      config.hasOwnProperty(editorConstants.SHAPE_PROP_NAME_TABLE_ID),
    )
    .forEach((config) => areaTables.add(`${config.areaId}:${config.tableId}`));
  return Array.from(areaTables.values()).sort();
});
/**
 * ビューアテーブルIDを取得します.
 *
 * @returns State で保持された値
 */
export const useViewTableIds = () =>
  useAppSelector(({ viewerNode }) => tableIds(viewerNode));
