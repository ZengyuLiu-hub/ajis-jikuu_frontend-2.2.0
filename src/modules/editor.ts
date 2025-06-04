import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  Layout,
  MapPdfPaperSizes,
  MapVersion,
  ScreenCaptureRanges,
  StageRegulationSizes,
} from '../types';
import { EditorUtil } from '../utils/EditorUtil';

export type ScrollPosition = {
  top: number;
  left: number;
};

export type UpdateSaveMapDataResult = {
  editorVersion?: string;
  updatedAt: Date;
  updatedById: string;
  updatedByName: string;
  rowVersion: number;
};

export type EditorState = {
  editMapVersion: MapVersion;
  exclusiveLock: boolean;
  othersExclusiveLock: boolean;
  inventoryNote: string;
  shouldOptimize: boolean;
  stageScale: number;
  locationNumFontSize: number;
  locationTextFontSize: number;
  visibleLocationNum: boolean;
  visibleLocationText: boolean;
  showingModal: boolean;
  layoutTabs: Layout[];
  currentLayout: Layout;
  scrollPosition?: ScrollPosition;
};

const initialState: EditorState = {
  editMapVersion: {
    jurisdictionClass: '',
    jurisdictionName: '',
    companyCode: '',
    companyName: '',
    storeCode: '',
    storeName: '',
    zipCode: '',
    address1: '',
    address2: '',
    addressDetail: '',
    tel: '',
    fax: '',
    mapId: '',
    version: 0,
    createdById: '',
    createdByName: '',
    createdAt: new Date(),
    updatedById: '',
    updatedByName: '',
    updatedAt: new Date(),
    rowVersion: 0,
  },
  exclusiveLock: false,
  othersExclusiveLock: false,
  inventoryNote: '',
  shouldOptimize: true,
  stageScale: 100,
  locationNumFontSize: 12,
  locationTextFontSize: 6,
  visibleLocationNum: true,
  visibleLocationText: false,
  showingModal: false,
  layoutTabs: [],
  currentLayout: {
    layoutId: '',
    layoutName: '',
    latestAreaId: 0,
    latestTableId: 0,
    latestFrontWallBranchNum: 0,
    latestLeftWallBranchNum: 0,
    latestBackWallBranchNum: 0,
    latestRightWallBranchNum: 0,
    latestRegisterTableId: 85,
    latestRegisterBranchNum: 0,
    latestFreeTextTableId: 60,
    latestFreeTextBranchNum: 0,
    preferences: {
      printSize: MapPdfPaperSizes.A4,
      screenCaptureRange: ScreenCaptureRanges.STAGE,
      stageWidth: EditorUtil.stageRegulationSizeToPixel(
        StageRegulationSizes.VERY_SMALL
      ).width,
      stageHeight: EditorUtil.stageRegulationSizeToPixel(
        StageRegulationSizes.VERY_SMALL
      ).height,
      latticeWidth: 5,
      latticeHeight: 5,
    },
  },
};

const slice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    updateEditMapVersion(
      state: EditorState,
      action: PayloadAction<MapVersion>
    ) {
      state.editMapVersion = action.payload;
    },
    updateEditMapSaveResult(
      state: EditorState,
      action: PayloadAction<UpdateSaveMapDataResult>
    ) {
      state.editMapVersion.editorVersion = action.payload.editorVersion;
      state.editMapVersion.updatedAt = action.payload.updatedAt;
      state.editMapVersion.updatedById = action.payload.updatedById;
      state.editMapVersion.updatedByName = action.payload.updatedByName;
      state.editMapVersion.rowVersion = action.payload.rowVersion;
    },
    updateExclusiveLock(state: EditorState, action: PayloadAction<boolean>) {
      state.exclusiveLock = action.payload;
    },
    updateOthersExclusiveLock(
      state: EditorState,
      action: PayloadAction<boolean>
    ) {
      state.othersExclusiveLock = action.payload;
    },
    updateInventoryNote(state: EditorState, action: PayloadAction<string>) {
      state.inventoryNote = action.payload;
    },
    updateStageScale(state: EditorState, action: PayloadAction<number>) {
      if (action.payload === state.stageScale) {
        return;
      }

      state.stageScale = action.payload;
      state.locationNumFontSize = action.payload < 150 ? 12 : 8;
      state.locationTextFontSize = 6;
      state.visibleLocationNum = action.payload >= 70;
      state.visibleLocationText = action.payload >= 150;
    },
    updateShowingModal(state: EditorState, action: PayloadAction<boolean>) {
      state.showingModal = action.payload;
    },
    updateLayoutTabs(state: EditorState, action: PayloadAction<Layout[]>) {
      state.layoutTabs = action.payload;
    },
    updateCurrentLayout(state: EditorState, action: PayloadAction<Layout>) {
      state.currentLayout = action.payload;
    },
    updateScrollPosition(
      state: EditorState,
      action: PayloadAction<ScrollPosition | undefined>
    ) {
      state.scrollPosition = action.payload;
    },
    clearState() {
      return initialState;
    },
  },
});

export const editorModule = slice;
