import { createSelector } from '@reduxjs/toolkit';

import * as editorConstants from '../constants/editor';

import { useAppSelector } from '../app/hooks';
import { EditorNodeState } from '../modules';
import { SideMenuTypes } from '../types';

export const useEditorNodeState = (): EditorNodeState =>
  useAppSelector(({ editorNode }) => editorNode);

const nodeConfigList = createSelector(
  (state: EditorNodeState) => state.nodeConfigList,
  (list) => list
);
export const useNodeConfigList = () =>
  useAppSelector(({ editorNode }) => nodeConfigList(editorNode));

const changeNodeList = createSelector(
  (state: EditorNodeState) => state.changeNodeList,
  (changeNodeList) => changeNodeList
);
export const useChangeNodeList = () =>
  useAppSelector(({ editorNode }) => changeNodeList(editorNode));

const editNodeList = createSelector(
  (state: EditorNodeState) => state.editNodeList,
  (list) => list
);
export const useEditNodeList = () =>
  useAppSelector(({ editorNode }) => editNodeList(editorNode));

const refreshNodeList = createSelector(
  (state: EditorNodeState) => state.refreshNodeList,
  (list) => list
);
export const useRefreshNodeList = () =>
  useAppSelector(({ editorNode }) => refreshNodeList(editorNode));

const selectedNodeIds = createSelector(
  (state: EditorNodeState) => state.selectedNodeIds,
  (ids) => ids
);
export const useSelectedNodeIds = () =>
  useAppSelector(({ editorNode }) => selectedNodeIds(editorNode));

const selectedNodeList = createSelector(
  (state: EditorNodeState) => state.selectedNodeList,
  (nodes) => nodes
);
export const useSelectedNodeList = () =>
  useAppSelector(({ editorNode }) => selectedNodeList(editorNode));

const minSelectedNode = createSelector(selectedNodeList, (nodes) => {
  if (nodes.length === 0) {
    return undefined;
  }
  if (nodes.length === 1) {
    return nodes[0];
  }
  const targets = nodes.filter(
    (node) =>
      node.config.hasOwnProperty(editorConstants.SHAPE_PROP_NAME_X) &&
      node.config.hasOwnProperty(editorConstants.SHAPE_PROP_NAME_Y)
  );
  if (targets.length === 0) {
    return undefined;
  }

  const x = targets.reduce((a, b) => (a.config.x < b.config.x ? a : b));
  const y = targets.reduce((a, b) => (a.config.y < b.config.y ? a : b));

  if (x === y) {
    return x;
  }
  return y;
});
export const useMinSelectedNode = () =>
  useAppSelector(({ editorNode }) => minSelectedNode(editorNode));

// プロパティに locationNum を持つシェイプ一覧を取得します.
const locationNodes = createSelector(nodeConfigList, (nodes) =>
  nodes.filter((config) =>
    config.hasOwnProperty(editorConstants.SHAPE_PROP_NAME_LOCATION_NUM)
  )
);
export const useLocationNodes = () =>
  useAppSelector(({ editorNode }) => locationNodes(editorNode));

// プロパティに locationNum を持たないシェイプ一覧を取得します.
const noLocationNodeList = createSelector(nodeConfigList, (nodes) =>
  nodes.filter(
    (config) =>
      !config.hasOwnProperty(editorConstants.SHAPE_PROP_NAME_LOCATION_NUM)
  )
);
export const useNoLocationNodeList = () =>
  useAppSelector(({ editorNode }) => noLocationNodeList(editorNode));

const deleteNodeIds = createSelector(
  (state: EditorNodeState) => state.deleteNodeIds,
  (ids) => ids
);
export const useDeleteNodeIds = () =>
  useAppSelector(({ editorNode }) => deleteNodeIds(editorNode));

const areaIds = createSelector(nodeConfigList, (nodes) => {
  const areas = new Set();
  nodes
    .filter(
      (config) =>
        config.shape !== SideMenuTypes.AREA &&
        config.hasOwnProperty(editorConstants.SHAPE_PROP_NAME_AREA_ID)
    )
    .forEach((config) => config.areaId && areas.add(config.areaId));
  return Array.from(areas.values()).sort();
});
export const useAreaIds = () =>
  useAppSelector(({ editorNode }) => areaIds(editorNode));

const tableIds = createSelector(nodeConfigList, (nodes) => {
  const areaTables = new Set();
  nodes
    .filter((config) =>
      config.hasOwnProperty(editorConstants.SHAPE_PROP_NAME_TABLE_ID)
    )
    .forEach((config) => areaTables.add(`${config.areaId}:${config.tableId}`));
  return Array.from(areaTables.values()).sort();
});
export const useTableIds = () =>
  useAppSelector(({ editorNode }) => tableIds(editorNode));

const reselectEditNodeList = createSelector(
  (state: EditorNodeState) => state.reselectEditNodeList,
  (list) => list
);
export const useReselectEditNodeList = () =>
  useAppSelector(({ editorNode }) => reselectEditNodeList(editorNode));
