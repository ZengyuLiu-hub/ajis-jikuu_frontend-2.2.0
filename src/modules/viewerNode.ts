import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ViewerNodeState = {
  nodeConfigList: any[];
  changeNodeList?: Date;
  selectedNodeIds: string[];
  selectedNodeList: any[];
};

const initialState: ViewerNodeState = {
  nodeConfigList: [],
  selectedNodeIds: [],
  selectedNodeList: [],
};

const slice = createSlice({
  name: 'viewerNode',
  initialState,
  reducers: {
    // ノード設定を更新
    updateNodeConfigList(state: ViewerNodeState, action: PayloadAction<any[]>) {
      state.nodeConfigList = action.payload;
    },
    // ノード設定をクリア
    clearNodeConfigList(state: ViewerNodeState) {
      state.nodeConfigList = [];
    },
    // 変更ノードを更新
    updateChangeNodeList(state: ViewerNodeState) {
      state.changeNodeList = new Date();
    },
    // 選択ノードIDを更新
    updateSelectedNodeIds(
      state: ViewerNodeState,
      action: PayloadAction<string[]>,
    ) {
      state.selectedNodeIds = action.payload;
    },
    // 選択ノードを更新
    updateSelectedNodeList(
      state: ViewerNodeState,
      action: PayloadAction<any[]>,
    ) {
      state.selectedNodeList = action.payload;
    },
    // 状態クリア
    clearState() {
      return initialState;
    },
  },
});

export const viewerNodeModule = slice;
