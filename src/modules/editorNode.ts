import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type EditorNodeState = {
  nodeConfigList: any[];
  changeNodeList?: Date;
  editNodeList: any[];
  refreshNodeList: boolean;
  selectedNodeIds: string[];
  selectedNodeList: any[];
  selectedEditIds: string[];
  deleteNodeIds: string[];
  reselectEditNodeList?: Date;
};

const initialState: EditorNodeState = {
  nodeConfigList: [],
  editNodeList: [],
  refreshNodeList: false,
  selectedNodeIds: [],
  selectedNodeList: [],
  selectedEditIds: [],
  deleteNodeIds: [],
};

const editorNodeSlice = createSlice({
  name: 'editorNode',
  initialState,
  reducers: {
    updateNodeConfigList(state: EditorNodeState, action: PayloadAction<any[]>) {
      state.nodeConfigList = action.payload;
    },
    clearNodeConfigList(state: EditorNodeState) {
      state.nodeConfigList = [];
    },
    updateChangeNodeList(state: EditorNodeState) {
      state.changeNodeList = new Date();
    },
    updateEditNodeList(state: EditorNodeState, action: PayloadAction<any[]>) {
      state.editNodeList = action.payload;
    },
    clearEditNodeList(state: EditorNodeState) {
      state.editNodeList = [];
    },
    updateRefreshNodeList(
      state: EditorNodeState,
      action: PayloadAction<boolean>
    ) {
      state.refreshNodeList = action.payload;
    },
    addSelectedNodeIds(
      state: EditorNodeState,
      action: PayloadAction<string[]>
    ) {
      if (action.payload.length === 0) {
        return;
      }
      state.selectedNodeIds = state.selectedNodeIds.concat(action.payload);
    },
    updateSelectedNodeIds(
      state: EditorNodeState,
      action: PayloadAction<string[]>
    ) {
      state.selectedNodeIds = action.payload;
    },
    excludeSelectedNodeIds(
      state: EditorNodeState,
      action: PayloadAction<string[]>
    ) {
      if (action.payload.length === 0) {
        return;
      }
      state.selectedNodeIds = state.selectedNodeIds.filter(
        (id) => !action.payload.includes(id)
      );
    },
    clearSelectedNodeIds(state: EditorNodeState) {
      state.selectedNodeIds = [];
    },
    updateSelectedNodeList(
      state: EditorNodeState,
      action: PayloadAction<any[]>
    ) {
      state.selectedNodeList = action.payload;
    },
    clearSelectedNodes(state: EditorNodeState) {
      state.selectedNodeIds = [];
      state.selectedNodeList = [];
    },
    updateSelectedEditIds(
      state: EditorNodeState,
      action: PayloadAction<string[]>
    ) {
      state.selectedEditIds = action.payload;
    },
    updateDeleteNodeIds(
      state: EditorNodeState,
      action: PayloadAction<string[]>
    ) {
      state.deleteNodeIds = action.payload;
    },
    reselectEditNodeList(state: EditorNodeState) {
      state.reselectEditNodeList = new Date();
    },
    clearState() {
      return initialState;
    },
  },
});

export const editorNodeModule = editorNodeSlice;
