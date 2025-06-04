import { useCallback, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { match } from 'ts-pattern';
import Konva from 'konva';

import * as constants from '../../constants/app';
import {
  AvailableTypes,
  Directions,
  GondolaAlignments,
  GondolaPlacements,
  IslandTypes,
  NumberingRules,
  RepeatDirections,
  ShapeData,
  SideMenuType,
  SideMenuTypes,
  TableEndTypes,
} from '../../types';
import { useAppDispatch } from '../../app/hooks';

import { EditorUtil } from '../../utils/EditorUtil';

import { editorNodeModule, editorOpModule } from '../../modules';
import {
  useBranchNumLength,
  useLatticeHeight,
  useLatticeWidth,
  useSelectedMenu,
  useTableIdLength,
  useVisibleMenu,
} from '../../selectors';

import { LocationTypes } from '../../components/molecules';
import { EditorSideMenu as Component } from '../../components/organisms';

import {
  MapEditorAddArea,
  Result as AddAreaResult,
} from '../pages/MapEditorAddArea';
import {
  MapEditorAddTable,
  Result as addTableResult,
} from '../pages/MapEditorAddTable';
import {
  MapEditorAddGondola,
  Result as addGondolaResult,
} from '../pages/MapEditorAddGondola';
import {
  MapEditorAddMeshend,
  Result as addMeshendResult,
} from '../pages/MapEditorAddMeshend';
import {
  MapEditorAddWall,
  Result as addWallResult,
} from '../pages/MapEditorAddWall';
import {
  MapEditorAddIsland,
  Result as addIslandResult,
} from '../pages/MapEditorAddIsland';
import {
  MapEditorAddSpecialShape,
  Result as addSpecialShapeResult,
} from '../pages/MapEditorAddSpecialShape';
import { MapEditorOtherShapeMenu } from '../pages';

interface Props {
  mapLayer: React.RefObject<Konva.Layer>;
  onClickMenuCancel?(): void;
}

/**
 * マップエディタ：サイドメニュー
 */
export const EditorSideMenu = (props: Props) => {
  const { mapLayer, onClickMenuCancel } = props;

  const DEFAULT_STROKE_RGBA = { r: 0, g: 0, b: 0, a: 1 };
  const DEFAULT_STROKE = `rgba(${DEFAULT_STROKE_RGBA.r}, ${DEFAULT_STROKE_RGBA.g}, ${DEFAULT_STROKE_RGBA.b}, ${DEFAULT_STROKE_RGBA.a})`;

  const otherShapeSubMenuRef = useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();

  const selectedMenu = useSelectedMenu();
  const visibleMenu = useVisibleMenu();
  const latticeWidth = useLatticeWidth();
  const latticeHeight = useLatticeHeight();
  const tableIdLength = useTableIdLength();
  const branchNumLength = useBranchNumLength();

  const [addAreaOpen, setAddAreaOpen] = useState(false);
  const [addGondolaOpen, setAddGondolaOpen] = useState(false);
  const [addMeshendOpen, setAddMeshendOpen] = useState(false);
  const [addTableOpen, setAddTableOpen] = useState(false);
  const [addWallOpen, setAddWallOpen] = useState(false);
  const [addIslandOpen, setAddIslandOpen] = useState(false);
  const [addSpecialShapeOpen, setAddSpecialShapeOpen] = useState(false);
  const [addOtherShapes, setAddOtherShapes] = useState(false);

  const [scrollOffset, setScrollOffset] = useState(0);

  // デフォルトのテーブルにある次の枝番
  const defaultTableNextBranchNum = () => {
    const defaultTableId = '0'.repeat(tableIdLength);
    const defaultBranchNum = '0'.repeat(branchNumLength);

    const groupShapes =
      mapLayer.current?.children?.filter(
        (node: any) =>
          node.config.areaId === constants.DEFAULT_AREA_ID &&
          node.config.tableId === defaultTableId,
      ) ?? [];

    const {
      config: { branchNum },
    } = groupShapes.reduce(
      (a: any, b: any) =>
        Number(a.config.branchNum) > Number(b.config.branchNum) ? a : b,
      {
        config: {
          branchNum: defaultBranchNum,
        },
      },
    );

    return `${Number(branchNum) + 1}`.padStart(branchNumLength, '0');
  };

  /**
   * メニューボタン押下処理結果返却.
   */
  const handleClickMenu = (menuType: SideMenuType, items: ShapeData[]) => {
    dispatch(
      editorOpModule.actions.updateOp({
        selectedMenu: menuType,
        opHoldItems: items,
        finishOpHold: false,
      }),
    );
    dispatch(editorNodeModule.actions.clearSelectedNodeIds());
  };

  /**
   * ゴンドラ単体追加.
   */
  const handleClickAddGondola = useCallback(
    (result: addGondolaResult) => {
      const {
        locationNum,
        tableIdLength,
        branchNumLength,
        locationDisplayFormatType,
        customFormats,
      } = result;

      const gondolaWidth = result.gondolaWidthCells * latticeWidth;
      const gondolaDepth = result.gondolaDepthCells * latticeHeight;

      const id = uuidv4();
      const items = [
        {
          id,
          config: {
            uuid: id,
            shape: SideMenuTypes.GONDOLA,
            areaId: constants.DEFAULT_AREA_ID,
            tableId: locationNum.slice(0, tableIdLength),
            branchNum: locationNum.slice(-branchNumLength),
            x: 0,
            y: 0,
            width:
              result.gondolaAlignment === GondolaPlacements.HORIZONTAL
                ? gondolaWidth
                : gondolaDepth,
            height:
              result.gondolaAlignment === GondolaPlacements.HORIZONTAL
                ? gondolaDepth
                : gondolaWidth,
            strokeWidth: 1,
            stroke: DEFAULT_STROKE,
            strokeRgb: DEFAULT_STROKE_RGBA,
            strokeTransparent: false,
            strokeDash: false,
            rotation: 0,
            locationNum,
            displayLocationNum: EditorUtil.generateDisplayLocationNum(
              locationNum,
              locationDisplayFormatType,
              customFormats,
            ),
            showFullLocationNum: result.showFullLocationNum,
            widthCells:
              result.gondolaAlignment === GondolaPlacements.HORIZONTAL
                ? result.gondolaWidthCells
                : result.gondolaDepthCells,
            heightCells:
              result.gondolaAlignment === GondolaPlacements.HORIZONTAL
                ? result.gondolaDepthCells
                : result.gondolaWidthCells,
            placement: result.gondolaAlignment,
            text: '',
            remarks: '',
            missingNumber: false,
            emptyNumber: false,
            selectable: true,
            draw: false,
            visible: true,
            disabled: false,
          },
        },
      ];
      handleClickMenu(SideMenuTypes.GONDOLA, items);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [latticeWidth, latticeHeight],
  );

  /**
   * 編目エンド単体追加.
   */
  const handleClickAddMeshend = useCallback(
    (result: addMeshendResult) => {
      const {
        locationNum,
        tableIdLength,
        branchNumLength,
        locationDisplayFormatType,
        customFormats,
      } = result;

      const gondolaWidth = result.gondolaWidthCells * latticeWidth;
      const gondolaDepth = result.gondolaDepthCells * latticeHeight;

      const placement =
        Directions.TOP === result.gondolaDirection ||
        Directions.BOTTOM === result.gondolaDirection
          ? GondolaPlacements.HORIZONTAL
          : GondolaPlacements.VERTICAL;

      const id = uuidv4();
      const items = [
        {
          id,
          config: {
            uuid: id,
            shape: SideMenuTypes.MESH_END,
            areaId: constants.DEFAULT_AREA_ID,
            tableId: locationNum.slice(0, tableIdLength),
            branchNum: locationNum.slice(-branchNumLength),
            width:
              GondolaPlacements.HORIZONTAL === placement
                ? gondolaWidth
                : gondolaDepth,
            height:
              GondolaPlacements.HORIZONTAL === placement
                ? gondolaDepth
                : gondolaWidth,
            strokeWidth: 1,
            stroke: DEFAULT_STROKE,
            strokeRgb: DEFAULT_STROKE_RGBA,
            strokeTransparent: false,
            rotation: 0,
            locationNum,
            displayLocationNum: EditorUtil.generateDisplayLocationNum(
              locationNum,
              locationDisplayFormatType,
              customFormats,
            ),
            showFullLocationNum: false,
            widthCells:
              GondolaPlacements.HORIZONTAL === placement
                ? result.gondolaWidthCells
                : result.gondolaDepthCells,
            heightCells:
              GondolaPlacements.HORIZONTAL === placement
                ? result.gondolaDepthCells
                : result.gondolaWidthCells,
            placement,
            direction: result.gondolaDirection,
            text: '',
            remarks: '',
            missingNumber: false,
            emptyNumber: false,
            selectable: true,
            draw: false,
            visible: true,
            disabled: false,
          },
        },
      ];
      handleClickMenu(SideMenuTypes.MESH_END, items);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [latticeWidth, latticeHeight],
  );

  /**
   * テーブル追加.
   */
  const handleClickAddTable = useCallback(
    (result: addTableResult) => {
      const {
        tableIdLength,
        branchNumLength,
        locationDisplayFormatType,
        customFormats,
      } = result;

      const maxTableId = Number('9'.repeat(tableIdLength));

      const gondolaShapes: ShapeData[] = [];

      const gondolaWidth = result.gondolaWidthCells * latticeWidth;
      const gondolaDepth = result.gondolaDepthCells * latticeHeight;

      let gapX = 0;
      if (
        result.repeatDirection === RepeatDirections.LEFT ||
        result.repeatDirection === RepeatDirections.RIGHT
      ) {
        gapX = result.repeatGapCells * latticeWidth;
      }

      let gapY = 0;
      if (
        result.repeatDirection === RepeatDirections.TOP ||
        result.repeatDirection === RepeatDirections.BOTTOM
      ) {
        gapY = result.repeatGapCells * latticeHeight;
      }

      const reverse = result.startingGondola === 1;

      const clockwise: boolean =
        result.numberingRule === NumberingRules.CLOCKWISE;

      const areaId = constants.DEFAULT_AREA_ID;
      const parentId = Number(result.startLocationNum.slice(0, tableIdLength));

      const numOfSideLocation = result.numOfSideLocation ?? 0;

      const startBranchNum = Number(
        result.startLocationNum.slice(-branchNumLength),
      );

      const noFrontend = result.firstEndType === TableEndTypes.NO_END;
      const noBackend = result.lastEndType === TableEndTypes.NO_END;

      const sideStartNum = startBranchNum + (noFrontend ? 0 : 1);
      const sideEndNum =
        numOfSideLocation * 2 + sideStartNum - (noBackend ? 1 : 0);

      const distanceSize = result.repeatCount - 1;
      for (let i = 0; i < result.repeatCount; i++) {
        let offsetX = gapX * i;
        let offsetY = gapY * i;

        const tableId =
          `${
            parentId + i > maxTableId ? parentId + i + 1 : parentId + i
          }`.padStart(tableIdLength, '0') ?? '0'.repeat(tableIdLength);

        // 向き：縦
        if (result.gondolaAlignment === GondolaAlignments.VERTICAL) {
          // エンドロケーション
          const createBackendLocation = () => {
            const branchNum = `${
              reverse
                ? startBranchNum
                : numOfSideLocation + (noFrontend ? 0 : 1) + startBranchNum
            }`.padStart(branchNumLength, '0');

            const id = uuidv4();
            const locationNum = `${tableId}${branchNum}`;

            return {
              id,
              config: {
                uuid: id,
                shape:
                  result.lastEndType === TableEndTypes.MESH_END
                    ? SideMenuTypes.MESH_END
                    : SideMenuTypes.GONDOLA,
                locationType:
                  Number(branchNum) === 1
                    ? LocationTypes.FRONTEND
                    : LocationTypes.BACKEND,
                areaId,
                tableId,
                branchNum,
                x: offsetX,
                y: offsetY,
                width: gondolaDepth * 2,
                height: gondolaDepth,
                strokeWidth: 1,
                stroke: DEFAULT_STROKE,
                strokeRgb: DEFAULT_STROKE_RGBA,
                strokeDash: false,
                rotation: 0,
                locationNum,
                displayLocationNum: EditorUtil.generateDisplayLocationNum(
                  locationNum,
                  locationDisplayFormatType,
                  customFormats,
                ),
                showFullLocationNum: result.allViewFullLocationNum || reverse,
                widthCells: result.gondolaDepthCells * 2,
                heightCells: result.gondolaDepthCells,
                placement: GondolaPlacements.HORIZONTAL,
                direction:
                  result.lastEndType === TableEndTypes.MESH_END
                    ? result.lastEndDirection
                    : undefined,
                text: '',
                remarks: '',
                missingNumber: false,
                emptyNumber: false,
                selectable: true,
                draw: false,
                visible: true,
                disabled: false,
              },
            };
          };

          if (result.repeatDirection === RepeatDirections.TOP) {
            offsetY =
              gapY * distanceSize +
              (gondolaDepth * 2 + gondolaWidth * numOfSideLocation) *
                distanceSize -
              (gapY * i +
                (gondolaDepth * 2 + gondolaWidth * numOfSideLocation) * i);
            for (const endOffset of [noFrontend, noBackend]) {
              if (endOffset) {
                offsetY -= gondolaDepth * (distanceSize - i);
              }
            }
          } else if (result.repeatDirection === RepeatDirections.RIGHT) {
            offsetX += gondolaDepth * 2 * i;
          } else if (result.repeatDirection === RepeatDirections.BOTTOM) {
            offsetY +=
              (gondolaDepth * 2 + gondolaWidth * numOfSideLocation) * i;
            for (const endOffset of [noFrontend, noBackend]) {
              if (endOffset) {
                offsetY -= gondolaDepth * i;
              }
            }
          } else if (result.repeatDirection === RepeatDirections.LEFT) {
            offsetX =
              gapX * distanceSize +
              gondolaDepth * 2 * distanceSize -
              (gapX * i + gondolaDepth * 2 * i);
          }

          if (reverse ? !noFrontend : !noBackend) {
            gondolaShapes.push(createBackendLocation());
            offsetY += gondolaDepth;
          }

          // サイドロケーション
          for (let i: number = 0; i < numOfSideLocation; i++) {
            // 左側
            gondolaShapes.push(
              (({ x, y }: { x: number; y: number }) => {
                const num = reverse
                  ? clockwise
                    ? sideEndNum - i
                    : sideStartNum + i
                  : clockwise
                    ? sideStartNum + numOfSideLocation - 1 - i
                    : sideEndNum - numOfSideLocation + 1 + i;
                const branchNum = `${num}`.padStart(branchNumLength, '0');
                const isStart = startBranchNum === num;

                const id = uuidv4();
                const locationNum = `${tableId}${branchNum}`;

                return {
                  id,
                  config: {
                    uuid: id,
                    shape: SideMenuTypes.GONDOLA,
                    locationType: LocationTypes.SIDE,
                    areaId,
                    tableId,
                    branchNum,
                    x,
                    y,
                    width: gondolaDepth,
                    height: gondolaWidth,
                    strokeWidth: 1,
                    stroke: DEFAULT_STROKE,
                    strokeRgb: DEFAULT_STROKE_RGBA,
                    strokeDash: false,
                    rotation: 0,
                    locationNum,
                    displayLocationNum: EditorUtil.generateDisplayLocationNum(
                      locationNum,
                      locationDisplayFormatType,
                      customFormats,
                    ),
                    showFullLocationNum:
                      result.allViewFullLocationNum || isStart,
                    widthCells: result.gondolaDepthCells,
                    heightCells: result.gondolaWidthCells,
                    placement: GondolaPlacements.VERTICAL,
                    text: '',
                    remarks: '',
                    missingNumber: false,
                    emptyNumber: false,
                    selectable: true,
                    draw: false,
                    visible: true,
                    disabled: false,
                  },
                };
              })({ x: offsetX, y: offsetY + gondolaWidth * i }),
            );

            // 右側
            gondolaShapes.push(
              (({ x, y }: { x: number; y: number }) => {
                const num = reverse
                  ? clockwise
                    ? sideStartNum + i
                    : sideEndNum - i
                  : clockwise
                    ? sideEndNum - numOfSideLocation + 1 + i
                    : sideStartNum + numOfSideLocation - 1 - i;
                const branchNum = `${num}`.padStart(branchNumLength, '0');
                const isStart = startBranchNum === num;

                const id = uuidv4();
                const locationNum = `${tableId}${branchNum}`;

                return {
                  id,
                  config: {
                    uuid: id,
                    shape: SideMenuTypes.GONDOLA,
                    locationType: LocationTypes.SIDE,
                    areaId,
                    tableId,
                    branchNum,
                    x,
                    y,
                    width: gondolaDepth,
                    height: gondolaWidth,
                    strokeWidth: 1,
                    stroke: DEFAULT_STROKE,
                    strokeRgb: DEFAULT_STROKE_RGBA,
                    strokeDash: false,
                    rotation: 0,
                    locationNum,
                    displayLocationNum: EditorUtil.generateDisplayLocationNum(
                      locationNum,
                      locationDisplayFormatType,
                      customFormats,
                    ),
                    showFullLocationNum:
                      result.allViewFullLocationNum || isStart,
                    widthCells: result.gondolaDepthCells,
                    heightCells: result.gondolaWidthCells,
                    placement: GondolaPlacements.VERTICAL,
                    text: '',
                    remarks: '',
                    missingNumber: false,
                    emptyNumber: false,
                    selectable: true,
                    draw: false,
                    visible: true,
                    disabled: false,
                  },
                };
              })({ x: offsetX + gondolaDepth, y: offsetY + gondolaWidth * i }),
            );
          }
          offsetY += gondolaWidth * numOfSideLocation;

          // エンドロケーション
          const createFrontendLocation = () => {
            const branchNum = `${
              reverse
                ? numOfSideLocation +
                  (reverse ? (noFrontend ? 0 : 1) : noBackend ? 0 : 1) +
                  startBranchNum
                : startBranchNum
            }`.padStart(branchNumLength, '0');

            const id = uuidv4();
            const locationNum = `${tableId}${branchNum}`;

            return {
              id,
              config: {
                uuid: id,
                shape:
                  result.firstEndType === TableEndTypes.MESH_END
                    ? SideMenuTypes.MESH_END
                    : SideMenuTypes.GONDOLA,
                locationType:
                  Number(branchNum) === 1
                    ? LocationTypes.FRONTEND
                    : LocationTypes.BACKEND,
                areaId,
                tableId,
                branchNum,
                x: offsetX,
                y: offsetY,
                width: gondolaDepth * 2,
                height: gondolaDepth,
                strokeWidth: 1,
                stroke: DEFAULT_STROKE,
                strokeRgb: DEFAULT_STROKE_RGBA,
                strokeDash: false,
                rotation: 0,
                locationNum,
                displayLocationNum: EditorUtil.generateDisplayLocationNum(
                  locationNum,
                  locationDisplayFormatType,
                  customFormats,
                ),
                showFullLocationNum: result.allViewFullLocationNum || !reverse,
                widthCells: result.gondolaDepthCells * 2,
                heightCells: result.gondolaDepthCells,
                placement: GondolaPlacements.HORIZONTAL,
                direction:
                  result.lastEndType === TableEndTypes.MESH_END
                    ? result.firstEndDirection
                    : undefined,
                text: '',
                remarks: '',
                missingNumber: false,
                emptyNumber: false,
                selectable: true,
                draw: false,
                visible: true,
                disabled: false,
              },
            };
          };

          if (reverse ? !noBackend : !noFrontend) {
            gondolaShapes.push(createFrontendLocation());
          }
        }

        // 向き：横
        if (result.gondolaAlignment === GondolaAlignments.HORIZONTAL) {
          // エンドロケーション
          const createBackendLocation = () => {
            const branchNum = `${
              reverse
                ? startBranchNum
                : numOfSideLocation + (noFrontend ? 0 : 1) + startBranchNum
            }`.padStart(branchNumLength, '0');

            const id = uuidv4();
            const locationNum = `${tableId}${branchNum}`;

            return {
              id,
              config: {
                uuid: id,
                shape:
                  result.lastEndType === TableEndTypes.MESH_END
                    ? SideMenuTypes.MESH_END
                    : SideMenuTypes.GONDOLA,
                locationType:
                  Number(branchNum) === 1
                    ? LocationTypes.FRONTEND
                    : LocationTypes.BACKEND,
                areaId,
                tableId,
                branchNum,
                x: offsetX,
                y: offsetY,
                width: gondolaDepth,
                height: gondolaDepth * 2,
                strokeWidth: 1,
                stroke: DEFAULT_STROKE,
                strokeRgb: DEFAULT_STROKE_RGBA,
                strokeDash: false,
                rotation: 0,
                locationNum,
                displayLocationNum: EditorUtil.generateDisplayLocationNum(
                  locationNum,
                  locationDisplayFormatType,
                  customFormats,
                ),
                showFullLocationNum: result.allViewFullLocationNum || reverse,
                widthCells: result.gondolaDepthCells,
                heightCells: result.gondolaDepthCells * 2,
                placement: GondolaPlacements.VERTICAL,
                direction:
                  result.lastEndType === TableEndTypes.MESH_END
                    ? result.lastEndDirection
                    : undefined,
                text: '',
                remarks: '',
                missingNumber: false,
                emptyNumber: false,
                selectable: true,
                draw: false,
                visible: true,
                disabled: false,
              },
            };
          };

          if (result.repeatDirection === RepeatDirections.TOP) {
            offsetY =
              gapY * distanceSize +
              gondolaDepth * 2 * distanceSize -
              (gapY * i + gondolaDepth * 2 * i);
          } else if (result.repeatDirection === RepeatDirections.RIGHT) {
            offsetX +=
              (gondolaDepth * 2 + gondolaWidth * numOfSideLocation) * i;
            for (const endOffset of [noFrontend, noBackend]) {
              if (endOffset) {
                offsetX -= gondolaDepth * i;
              }
            }
          } else if (result.repeatDirection === RepeatDirections.BOTTOM) {
            offsetY += gondolaDepth * 2 * i;
          } else if (result.repeatDirection === RepeatDirections.LEFT) {
            offsetX =
              gapX * distanceSize +
              (gondolaDepth * 2 + gondolaWidth * numOfSideLocation) *
                distanceSize -
              (gapX * i +
                (gondolaDepth * 2 + gondolaWidth * numOfSideLocation) * i);
            for (const endOffset of [noFrontend, noBackend]) {
              if (endOffset) {
                offsetX -= gondolaDepth * (distanceSize - i);
              }
            }
          }

          if (reverse ? !noFrontend : !noBackend) {
            gondolaShapes.push(createBackendLocation());
            offsetX += gondolaDepth;
          }

          // サイドロケーション
          for (let i: number = 0; i < numOfSideLocation; i++) {
            // 上側
            gondolaShapes.push(
              (({ x, y }: { x: number; y: number }) => {
                const num = reverse
                  ? clockwise
                    ? sideStartNum + i
                    : sideEndNum - i
                  : clockwise
                    ? sideEndNum - numOfSideLocation + 1 + i
                    : sideStartNum + numOfSideLocation - 1 - i;
                const branchNum = `${num}`.padStart(branchNumLength, '0');
                const isStart = startBranchNum === num;

                const id = uuidv4();
                const locationNum = `${tableId}${branchNum}`;

                return {
                  id,
                  config: {
                    uuid: id,
                    shape: SideMenuTypes.GONDOLA,
                    locationType: LocationTypes.SIDE,
                    areaId,
                    tableId,
                    branchNum,
                    x,
                    y,
                    width: gondolaWidth,
                    height: gondolaDepth,
                    strokeWidth: 1,
                    stroke: DEFAULT_STROKE,
                    strokeRgb: DEFAULT_STROKE_RGBA,
                    strokeDash: false,
                    rotation: 0,
                    locationNum,
                    displayLocationNum: EditorUtil.generateDisplayLocationNum(
                      locationNum,
                      locationDisplayFormatType,
                      customFormats,
                    ),
                    showFullLocationNum:
                      result.allViewFullLocationNum || isStart,
                    widthCells: result.gondolaWidthCells,
                    heightCells: result.gondolaDepthCells,
                    placement: GondolaPlacements.HORIZONTAL,
                    text: '',
                    remarks: '',
                    missingNumber: false,
                    emptyNumber: false,
                    selectable: true,
                    draw: false,
                    visible: true,
                    disabled: false,
                  },
                };
              })({ x: offsetX + gondolaWidth * i, y: offsetY }),
            );

            // 下側
            gondolaShapes.push(
              (({ x, y }: { x: number; y: number }) => {
                const num = reverse
                  ? clockwise
                    ? sideEndNum - i
                    : sideStartNum + i
                  : clockwise
                    ? sideStartNum + numOfSideLocation - 1 - i
                    : sideEndNum - numOfSideLocation + 1 + i;
                const branchNum = `${num}`.padStart(branchNumLength, '0');
                const isStart = startBranchNum === num;

                const id = uuidv4();
                const locationNum = `${tableId}${branchNum}`;

                return {
                  id,
                  config: {
                    uuid: id,
                    shape: SideMenuTypes.GONDOLA,
                    locationType: LocationTypes.SIDE,
                    areaId,
                    tableId,
                    branchNum,
                    x,
                    y,
                    width: gondolaWidth,
                    height: gondolaDepth,
                    strokeWidth: 1,
                    stroke: DEFAULT_STROKE,
                    strokeRgb: DEFAULT_STROKE_RGBA,
                    strokeDash: false,
                    rotation: 0,
                    locationNum,
                    displayLocationNum: EditorUtil.generateDisplayLocationNum(
                      locationNum,
                      locationDisplayFormatType,
                      customFormats,
                    ),
                    showFullLocationNum:
                      result.allViewFullLocationNum || isStart,
                    widthCells: result.gondolaWidthCells,
                    heightCells: result.gondolaDepthCells,
                    placement: GondolaPlacements.HORIZONTAL,
                    text: '',
                    remarks: '',
                    missingNumber: false,
                    emptyNumber: false,
                    selectable: true,
                    draw: false,
                    visible: true,
                    disabled: false,
                  },
                };
              })({ x: offsetX + gondolaWidth * i, y: offsetY + gondolaDepth }),
            );
          }
          offsetX += gondolaWidth * numOfSideLocation;

          // エンドロケーション
          const createFrontendLocation = () => {
            const branchNum = `${
              reverse
                ? numOfSideLocation +
                  (reverse ? (noFrontend ? 0 : 1) : noBackend ? 0 : 1) +
                  startBranchNum
                : startBranchNum
            }`.padStart(branchNumLength, '0');

            const id = uuidv4();
            const locationNum = `${tableId}${branchNum}`;

            return {
              id,
              config: {
                uuid: id,
                shape:
                  result.firstEndType === TableEndTypes.MESH_END
                    ? SideMenuTypes.MESH_END
                    : SideMenuTypes.GONDOLA,
                locationType:
                  Number(branchNum) === 1
                    ? LocationTypes.FRONTEND
                    : LocationTypes.BACKEND,
                areaId,
                tableId,
                branchNum,
                x: offsetX,
                y: offsetY,
                width: gondolaDepth,
                height: gondolaDepth * 2,
                strokeWidth: 1,
                stroke: DEFAULT_STROKE,
                strokeRgb: DEFAULT_STROKE_RGBA,
                strokeDash: false,
                rotation: 0,
                locationNum,
                displayLocationNum: EditorUtil.generateDisplayLocationNum(
                  locationNum,
                  locationDisplayFormatType,
                  customFormats,
                ),
                showFullLocationNum: result.allViewFullLocationNum || !reverse,
                widthCells: result.gondolaDepthCells,
                heightCells: result.gondolaDepthCells * 2,
                placement: GondolaPlacements.VERTICAL,
                direction:
                  result.firstEndType === TableEndTypes.MESH_END
                    ? result.firstEndDirection
                    : undefined,
                text: '',
                remarks: '',
                missingNumber: false,
                emptyNumber: false,
                selectable: true,
                draw: false,
                visible: true,
                disabled: false,
              },
            };
          };

          if (reverse ? !noBackend : !noFrontend) {
            gondolaShapes.push(createFrontendLocation());
          }
        }
      }

      const items = [
        ...gondolaShapes.sort((a, b) =>
          a.config.locationNum < b.config.locationNum
            ? -1
            : a.config.locationNum > b.config.locationNum
              ? 1
              : 0,
        ),
      ];
      handleClickMenu(SideMenuTypes.TABLE, items);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [latticeWidth, latticeHeight],
  );

  /**
   * ウォール追加.
   */
  const handleClickAddWall = useCallback(
    (result: addWallResult) => {
      const {
        tableIdLength,
        branchNumLength,
        locationDisplayFormatType,
        customFormats,
      } = result;

      const gondolaShapes: ShapeData[] = [];

      const gondolaWidth = result.gondolaWidthCells * latticeWidth;
      const gondolaDepth = result.gondolaDepthCells * latticeHeight;

      const reverse = result.startingGondola !== 1;

      let id;
      for (let i = 0; i < result.repeatCount; i++) {
        let offsetX = i;
        const offsetY = i;

        const tableId =
          `${
            Number(result.startLocationNum.slice(0, tableIdLength)) + i
          }`.padStart(tableIdLength, '0') ?? '0'.repeat(tableIdLength);

        const startBranchNum = Number(
          result.startLocationNum.slice(-branchNumLength),
        );

        // 向き：縦
        if (result.gondolaAlignment === GondolaAlignments.VERTICAL) {
          offsetX += gondolaDepth * 2 * i;

          const startNum = reverse
            ? result.numOfGondola + startBranchNum - 1
            : startBranchNum;

          for (let i: number = 0; i < result.numOfGondola; i++) {
            const branchNum = `${startNum + (reverse ? -i : i)}`.padStart(
              branchNumLength,
              '0',
            );
            const locationNum = `${tableId}${branchNum}`;

            id = uuidv4();
            gondolaShapes.push({
              id,
              config: {
                uuid: id,
                shape: SideMenuTypes.GONDOLA,
                locationType: LocationTypes.WALL,
                areaId: constants.DEFAULT_AREA_ID,
                tableId,
                branchNum,
                x: offsetX,
                y: offsetY + gondolaWidth * i,
                width: gondolaDepth,
                height: gondolaWidth,
                strokeWidth: 1,
                stroke: DEFAULT_STROKE,
                strokeRgb: DEFAULT_STROKE_RGBA,
                strokeDash: false,
                rotation: 0,
                locationNum,
                displayLocationNum: EditorUtil.generateDisplayLocationNum(
                  locationNum,
                  locationDisplayFormatType,
                  customFormats,
                ),
                showFullLocationNum:
                  result.allViewFullLocationNum ||
                  startBranchNum === Number(branchNum),
                widthCells: result.gondolaWidthCells,
                heightCells: result.gondolaDepthCells,
                placement: GondolaPlacements.VERTICAL,
                text: '',
                remarks: '',
                missingNumber: false,
                emptyNumber: false,
                selectable: true,
                draw: false,
                visible: true,
                disabled: false,
              },
            });
          }
        }

        // 向き：横
        if (result.gondolaAlignment === GondolaAlignments.HORIZONTAL) {
          offsetX +=
            (gondolaDepth * 2 + gondolaWidth * result.numOfGondola) * i;

          const startNum = reverse
            ? result.numOfGondola + startBranchNum - 1
            : startBranchNum;

          for (let i: number = 0; i < result.numOfGondola; i++) {
            const branchNum = `${startNum + (reverse ? -i : i)}`.padStart(
              branchNumLength,
              '0',
            );
            const locationNum = `${tableId}${branchNum}`;

            id = uuidv4();
            gondolaShapes.push({
              id,
              config: {
                uuid: id,
                shape: SideMenuTypes.GONDOLA,
                locationType: LocationTypes.WALL,
                areaId: constants.DEFAULT_AREA_ID,
                tableId,
                branchNum,
                x: offsetX + gondolaWidth * i,
                y: offsetY,
                width: gondolaWidth,
                height: gondolaDepth,
                strokeWidth: 1,
                stroke: DEFAULT_STROKE,
                strokeRgb: DEFAULT_STROKE_RGBA,
                strokeDash: false,
                rotation: 0,
                locationNum,
                displayLocationNum: EditorUtil.generateDisplayLocationNum(
                  locationNum,
                  locationDisplayFormatType,
                  customFormats,
                ),
                showFullLocationNum:
                  result.allViewFullLocationNum ||
                  startBranchNum === Number(branchNum),
                widthCells: result.gondolaWidthCells,
                heightCells: result.gondolaDepthCells,
                text: '',
                remarks: '',
                missingNumber: false,
                emptyNumber: false,
                selectable: true,
                draw: false,
                visible: true,
                disabled: false,
              },
            });
          }
        }
      }

      const items = [
        ...gondolaShapes.sort((a, b) =>
          a.config.locationNum < b.config.locationNum
            ? -1
            : a.config.locationNum > b.config.locationNum
              ? 1
              : 0,
        ),
      ];
      handleClickMenu(SideMenuTypes.WALL, items);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [latticeWidth, latticeHeight],
  );

  /**
   * アイランド追加.
   */
  const handleClickAddIsland = useCallback(
    (result: addIslandResult) => {
      const {
        tableIdLength,
        branchNumLength,
        locationDisplayFormatType,
        customFormats,
      } = result;

      const strokeRgb: any = DEFAULT_STROKE_RGBA;

      if (IslandTypes.CIRCLE === result.islandType) {
        // 丸テーブル
        const tableId =
          result.circleLocationNum
            .slice(0, tableIdLength)
            .padStart(tableIdLength, '0') ?? '0'.repeat(tableIdLength);
        const branchNum = result.circleLocationNum.slice(-branchNumLength);

        const id = uuidv4();
        const items = [
          {
            id,
            config: {
              uuid: id,
              shape: SideMenuTypes.CIRCLE_TABLE,
              locationType: LocationTypes.ISLAND,
              areaId: constants.DEFAULT_AREA_ID,
              tableId,
              branchNum,
              x: 0,
              y: 0,
              minRadiusX: 20,
              minRadiusY: 20,
              radiusX: 20,
              radiusY: 20,
              missingNumber: false,
              emptyNumber: false,
              strokeWidth: 1,
              stroke: `rgba(${strokeRgb.r}, ${strokeRgb.g}, ${strokeRgb.b}, ${
                AvailableTypes.AVAILABLE ===
                result.circleLocationBorderAvailable
                  ? strokeRgb.a
                  : 0
              })`,
              strokeRgb,
              strokeDash: false,
              strokeTransparent:
                AvailableTypes.AVAILABLE !==
                result.circleLocationBorderAvailable,
              rotation: 0,
              locationNum: result.circleLocationNum,
              displayLocationNum: EditorUtil.generateDisplayLocationNum(
                result.circleLocationNum,
                locationDisplayFormatType,
                customFormats,
              ),
              showFullLocationNum: result.circleLocationNumShowFull,
              text: '',
              selectable: false,
              draw: false,
              visible: true,
              disabled: false,
            },
          },
        ];
        handleClickMenu(SideMenuTypes.CIRCLE_TABLE, items);
      } else if (IslandTypes.SQUARE === result.islandType) {
        // 四角テーブル
        const tableId =
          result.squareLocationNum
            .slice(0, tableIdLength)
            .padStart(tableIdLength, '0') ?? '0'.repeat(tableIdLength);
        const branchNum = result.squareLocationNum.slice(-branchNumLength);

        const id = uuidv4();
        const items = [
          {
            id,
            config: {
              uuid: id,
              shape: SideMenuTypes.SQUARE_TABLE,
              locationType: LocationTypes.ISLAND,
              areaId: constants.DEFAULT_AREA_ID,
              tableId,
              branchNum,
              x: 0,
              y: 0,
              width: 60,
              height: 30,
              widthCells: 60 / latticeWidth,
              heightCells: 30 / latticeHeight,
              missingNumber: false,
              emptyNumber: false,
              strokeWidth: 1,
              stroke: `rgba(${strokeRgb.r}, ${strokeRgb.g}, ${strokeRgb.b}, ${
                AvailableTypes.AVAILABLE ===
                result.squareLocationBorderAvailable
                  ? strokeRgb.a
                  : 0
              })`,
              strokeRgb: strokeRgb,
              strokeDash: false,
              strokeTransparent:
                AvailableTypes.AVAILABLE !==
                result.squareLocationBorderAvailable,
              rotation: 0,
              locationNum: result.squareLocationNum,
              displayLocationNum: EditorUtil.generateDisplayLocationNum(
                result.squareLocationNum,
                locationDisplayFormatType,
                customFormats,
              ),
              showFullLocationNum: result.squareLocationNumShowFull,
              text: '',
              selectable: true,
              draw: false,
              visible: true,
              disabled: false,
            },
          },
        ];
        handleClickMenu(SideMenuTypes.SQUARE_TABLE, items);
      } else if (IslandTypes.REGISTER === result.islandType) {
        // レジ
        const tableId =
          result.registerLocationNum
            .slice(0, tableIdLength)
            .padStart(tableIdLength, '0') ?? '0'.repeat(tableIdLength);
        const branchNum = result.registerLocationNum.slice(-branchNumLength);

        const id = uuidv4();
        const items = [
          {
            id,
            config: {
              uuid: id,
              shape: SideMenuTypes.REGISTER_TABLE,
              locationType: LocationTypes.REGISTER,
              areaId: constants.DEFAULT_AREA_ID,
              tableId,
              branchNum,
              x: 0,
              y: 0,
              width: 60,
              height: 30,
              minWidth: latticeWidth,
              minHeight: latticeHeight,
              widthCells: 60 / latticeWidth,
              heightCells: 30 / latticeHeight,
              missingNumber: false,
              emptyNumber: false,
              strokeWidth: 1,
              stroke: `rgba(${strokeRgb.r}, ${strokeRgb.g}, ${strokeRgb.b}, ${
                AvailableTypes.AVAILABLE === result.registerBorderAvailable
                  ? strokeRgb.a
                  : 0
              })`,
              strokeRgb: strokeRgb,
              strokeDash: false,
              strokeTransparent:
                AvailableTypes.AVAILABLE !== result.registerBorderAvailable,
              rotation: 0,
              locationNum: result.registerLocationNum,
              displayLocationNum: EditorUtil.generateDisplayLocationNum(
                result.registerLocationNum,
                locationDisplayFormatType,
                customFormats,
              ),
              showFullLocationNum: result.registerLocationNumShowFull,
              text: '',
              selectable: false,
              draw: false,
              visible: true,
              disabled: false,
            },
          },
        ];
        handleClickMenu(SideMenuTypes.REGISTER_TABLE, items);
      } else if (IslandTypes.FREE_TEXT === result.islandType) {
        // フリーテキスト
        const tableId =
          result.freeTextLocationNum
            .slice(0, tableIdLength)
            .padStart(tableIdLength, '0') ?? '0'.repeat(tableIdLength);
        const branchNum = result.freeTextLocationNum.slice(-branchNumLength);

        const id = uuidv4();
        const items = [
          {
            id,
            config: {
              uuid: id,
              shape: SideMenuTypes.FREE_TEXT,
              locationType: LocationTypes.ISLAND,
              areaId: constants.DEFAULT_AREA_ID,
              tableId,
              branchNum,
              x: 0,
              y: 0,
              width: 100,
              height: 50,
              minWidth: latticeWidth,
              minHeight: latticeHeight,
              missingNumber: false,
              emptyNumber: false,
              strokeWidth: 1,
              stroke: `rgba(${strokeRgb.r}, ${strokeRgb.g}, ${strokeRgb.b}, ${
                AvailableTypes.AVAILABLE === result.freeTextBorderAvailable
                  ? strokeRgb.a
                  : 0
              })`,
              strokeRgb: strokeRgb,
              strokeDash: false,
              strokeTransparent:
                AvailableTypes.AVAILABLE !== result.freeTextBorderAvailable,
              rotation: 0,
              locationNum: result.freeTextLocationNum,
              displayLocationNum: EditorUtil.generateDisplayLocationNum(
                result.freeTextLocationNum,
                locationDisplayFormatType,
                customFormats,
              ),
              showFullLocationNum: result.freeTextLocationNumShowFull,
              text: result.freeTextValue,
              selectable: false,
              draw: false,
              visible: true,
              disabled: false,
            },
          },
        ];
        handleClickMenu(SideMenuTypes.FREE_TEXT, items);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [latticeWidth, latticeHeight],
  );

  const handleClickAddSpecialShape = useCallback(
    (result: addSpecialShapeResult) => {
      const data = match(result.direction)
        .with(
          Directions.TOP,
          () =>
            `M 0 0 H ${result.width} V ${result.tableTopDepth} H ${result.tableTopDepth} V ${result.depth} H 0 L 0 0`,
        )
        .with(
          Directions.RIGHT,
          () =>
            `M 0 0 H ${result.width} V ${result.depth} H ${
              result.width - result.tableTopDepth
            } V ${result.tableTopDepth} H 0 L 0 0`,
        )
        .with(
          Directions.BOTTOM,
          () =>
            `M ${result.width} 0 V ${result.depth} H 0 V ${
              result.depth - result.tableTopDepth
            } H ${result.width - result.tableTopDepth} V 0 L ${result.width} 0`,
        )
        .with(
          Directions.LEFT,
          () =>
            `M 0 0 V ${result.depth} H ${result.width} V ${
              result.depth - result.tableTopDepth
            } H ${result.tableTopDepth} V 0 L 0 0`,
        )
        .otherwise(() => '');

      const strokeRgb: any = { r: 0, g: 0, b: 0, a: 1 };
      const fillRgb: any = { r: 255, g: 255, b: 255, a: 1 };

      const id = uuidv4();
      const items = [
        {
          id,
          config: {
            uuid: id,
            shape: SideMenuTypes.SPECIAL_SHAPE,
            x: 0,
            y: 0,
            data,
            direction: result.direction,
            width: result.width,
            depth: result.depth,
            tableTopDepth: result.tableTopDepth,
            strokeWidth: 1,
            stroke: `rgba(${strokeRgb.r}, ${strokeRgb.g}, ${strokeRgb.b}, ${strokeRgb.a})`,
            strokeRgb,
            fill: `rgba(${fillRgb.r}, ${fillRgb.g}, ${fillRgb.b}, ${fillRgb.a})`,
            fillRgb,
            rotation: 0,
            selectable: true,
            draw: false,
            visible: true,
            disabled: false,
          },
        },
      ];
      handleClickMenu(SideMenuTypes.SPECIAL_SHAPE, items);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const handleClickAddArea = useCallback(
    (result: AddAreaResult) => {
      const strokeRgb: any = { r: 0, g: 0, b: 0, a: 1 };
      const fillRgb: any = { r: 255, g: 255, b: 255, a: 0 };

      const { areaId, text } = result;

      const id = uuidv4();
      const items = [
        {
          id,
          config: {
            uuid: id,
            shape: SideMenuTypes.AREA,
            areaId,
            points: [],
            text,
            stroke: `rgba(${strokeRgb.r}, ${strokeRgb.g}, ${strokeRgb.b}, ${strokeRgb.a})`,
            strokeRgb,
            strokeTransparent: false,
            strokeWidth: 1,
            fill: `rgba(${fillRgb.r}, ${fillRgb.g}, ${fillRgb.b}, ${fillRgb.a})`,
            fillRgb,
            fillTransparent: true,
            rotation: 0,
            selectable: false,
            draw: false,
            visible: true,
            disabled: false,
          },
        },
      ];
      handleClickMenu(SideMenuTypes.AREA, items);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const handleClickPillar = () => {
    const strokeRgb: any = { r: 0, g: 0, b: 0, a: 1 };
    const fillRgb: any = { r: 128, g: 128, b: 128, a: 1 };

    const id = uuidv4();
    const items = [
      {
        id,
        config: {
          uuid: id,
          shape: SideMenuTypes.PILLAR,
          x: 0,
          y: 0,
          width: 30,
          height: 30,
          minWidth: latticeWidth,
          minHeight: latticeHeight,
          strokeWidth: 1,
          stroke: `rgba(${strokeRgb.r}, ${strokeRgb.g}, ${strokeRgb.b}, ${strokeRgb.a})`,
          strokeRgb,
          fill: `rgba(${fillRgb.r}, ${fillRgb.g}, ${fillRgb.b}, ${fillRgb.a})`,
          fillRgb,
          rotation: 0,
          selectable: false,
          draw: false,
          visible: true,
          disabled: false,
        },
      },
    ];
    return items;
  };

  const handleClickRectText = () => {
    const strokeRgb: any = { r: 0, g: 0, b: 0, a: 1 };
    const fillRgb: any = { r: 255, g: 255, b: 255, a: 1 };

    const id = uuidv4();
    const items = [
      {
        id,
        config: {
          uuid: id,
          shape: SideMenuTypes.RECT_TEXT,
          x: 0,
          y: 0,
          width: 30,
          height: 30,
          minWidth: latticeWidth,
          minHeight: latticeHeight,
          text: 'Text',
          strokeWidth: 1,
          stroke: `rgba(${strokeRgb.r}, ${strokeRgb.g}, ${strokeRgb.b}, ${strokeRgb.a})`,
          strokeRgb,
          strokeDash: false,
          fill: `rgba(${fillRgb.r}, ${fillRgb.g}, ${fillRgb.b}, ${fillRgb.a})`,
          fillRgb,
          rotation: 0,
          selectable: false,
          draw: false,
          visible: true,
          disabled: false,
        },
      },
    ];
    return items;
  };

  const handleClickEllipseText = () => {
    const strokeRgb: any = { r: 0, g: 0, b: 0, a: 1 };
    const fillRgb: any = { r: 255, g: 255, b: 255, a: 1 };

    const id = uuidv4();
    const items = [
      {
        id,
        config: {
          uuid: id,
          shape: SideMenuTypes.ELLIPSE_TEXT,
          x: 0,
          y: 0,
          minRadiusX: 10,
          minRadiusY: 10,
          radiusX: 0,
          radiusY: 0,
          text: 'Text',
          stroke: `rgba(${strokeRgb.r}, ${strokeRgb.g}, ${strokeRgb.b}, ${strokeRgb.a})`,
          strokeRgb,
          strokeTransparent: false,
          strokeWidth: 1,
          strokeDash: false,
          fill: `rgba(${fillRgb.r}, ${fillRgb.g}, ${fillRgb.b}, ${fillRgb.a})`,
          fillRgb,
          fillTransparent: false,
          rotation: 0,
          selectable: false,
          draw: false,
          visible: true,
          disabled: false,
        },
      },
    ];
    return items;
  };

  const handleClickArrow1 = () => {
    const strokeRgb: any = { r: 0, g: 0, b: 0, a: 1 };

    const id = uuidv4();
    const items = [
      {
        id,
        config: {
          uuid: id,
          shape: SideMenuTypes.ARROW1,
          x: 0,
          y: 0,
          points: [0, 0],
          pointerLength: 4,
          pointerWidth: 5,
          pointerAtBeginning: false,
          pointerAtEnding: true,
          strokeWidth: 9,
          stroke: `rgba(${strokeRgb.r}, ${strokeRgb.g}, ${strokeRgb.b}, ${strokeRgb.a})`,
          strokeRgb,
          rotation: 0,
          selectable: false,
          draw: false,
          visible: true,
          disabled: false,
        },
      },
    ];
    return items;
  };

  const handleClickArrow2 = () => {
    const strokeRgb: any = { r: 0, g: 0, b: 0, a: 1 };

    const id = uuidv4();
    const items = [
      {
        id,
        config: {
          uuid: id,
          shape: SideMenuTypes.ARROW2,
          x: 0,
          y: 0,
          points: [0, 0],
          pointerLength: 4,
          pointerWidth: 5,
          pointerAtBeginning: true,
          pointerAtEnding: true,
          strokeWidth: 9,
          stroke: `rgba(${strokeRgb.r}, ${strokeRgb.g}, ${strokeRgb.b}, ${strokeRgb.a})`,
          strokeRgb,
          rotation: 0,
          selectable: false,
          draw: false,
          visible: true,
          disabled: false,
        },
      },
    ];
    return items;
  };

  const handleClickPen = () => {
    const id = uuidv4();
    const items = [
      {
        id,
        config: {
          uuid: id,
          shape: SideMenuTypes.PEN,
          strokeWidth: 5,
          stroke: 'rgba(223, 75, 38, 1)',
          strokeRgb: { r: 223, g: 75, b: 38, a: 1 },
          tension: 0.5,
          lineCap: 'round',
          globalCompositeOperation: 'source-over',
          points: [],
          rotation: 0,
          selectable: false,
          draw: false,
          visible: true,
          disabled: false,
        },
      },
    ];
    return items;
  };

  const handleClickLine = () => {
    const strokeRgb: any = { r: 0, g: 0, b: 0, a: 1 };

    const id = uuidv4();
    const items = [
      {
        id,
        config: {
          uuid: id,
          shape: SideMenuTypes.LINE,
          strokeWidth: 1,
          stroke: `rgba(${strokeRgb.r}, ${strokeRgb.g}, ${strokeRgb.b}, ${strokeRgb.a})`,
          strokeRgb,
          strokeDash: false,
          rotation: 0,
          points: [],
          selectable: false,
          draw: false,
          visible: true,
          disabled: false,
        },
      },
    ];
    return items;
  };

  const handleClickRect = () => {
    const strokeRgb: any = { r: 0, g: 0, b: 0, a: 1 };
    const fillRgb: any = { r: 255, g: 255, b: 255, a: 1 };

    const id = uuidv4();
    const items = [
      {
        id,
        config: {
          uuid: id,
          shape: SideMenuTypes.RECT,
          x: 0,
          y: 0,
          width: 30,
          height: 30,
          minWidth: latticeWidth,
          minHeight: latticeHeight,
          strokeWidth: 1,
          stroke: `rgba(${strokeRgb.r}, ${strokeRgb.g}, ${strokeRgb.b}, ${strokeRgb.a})`,
          strokeRgb,
          strokeDash: false,
          fill: `rgba(${fillRgb.r}, ${fillRgb.g}, ${fillRgb.b}, ${fillRgb.a})`,
          fillRgb,
          rotation: 0,
          selectable: false,
          draw: false,
          visible: true,
          disabled: false,
        },
      },
    ];
    return items;
  };

  const handleClickEllipse = () => {
    const strokeRgb: any = { r: 0, g: 0, b: 0, a: 1 };
    const fillRgb: any = { r: 255, g: 255, b: 255, a: 1 };

    const id = uuidv4();
    const items = [
      {
        id,
        config: {
          uuid: id,
          shape: SideMenuTypes.ELLIPSE,
          x: 0,
          y: 0,
          minRadiusX: 10,
          minRadiusY: 10,
          radiusX: 0,
          radiusY: 0,
          stroke: `rgba(${strokeRgb.r}, ${strokeRgb.g}, ${strokeRgb.b}, ${strokeRgb.a})`,
          strokeRgb,
          strokeTransparent: false,
          strokeWidth: 1,
          strokeDash: false,
          fill: `rgba(${fillRgb.r}, ${fillRgb.g}, ${fillRgb.b}, ${fillRgb.a})`,
          fillRgb,
          fillTransparent: false,
          rotation: 0,
          selectable: false,
          draw: false,
          visible: true,
          disabled: false,
        },
      },
    ];
    return items;
  };

  const handleClickPolygon = () => {
    const strokeRgb: any = { r: 0, g: 0, b: 0, a: 1 };
    const fillRgb: any = { r: 255, g: 255, b: 255, a: 1 };

    const id = uuidv4();
    const items = [
      {
        id,
        config: {
          uuid: id,
          shape: SideMenuTypes.POLYGON,
          points: [],
          alwaysShowAnchorPoint: false,
          stroke: `rgba(${strokeRgb.r}, ${strokeRgb.g}, ${strokeRgb.b}, ${strokeRgb.a})`,
          strokeRgb,
          strokeTransparent: false,
          strokeWidth: 1,
          strokeDash: false,
          fill: `rgba(${fillRgb.r}, ${fillRgb.g}, ${fillRgb.b}, ${fillRgb.a})`,
          fillRgb,
          fillTransparent: false,
          rotation: 0,
          selectable: false,
          draw: false,
          visible: true,
          disabled: false,
        },
      },
    ];
    return items;
  };

  const handleClickText = () => {
    const fillRgb: any = { r: 0, g: 0, b: 0, a: 1 };

    const id = uuidv4();
    const items = [
      {
        id,
        config: {
          uuid: id,
          shape: SideMenuTypes.TEXT,
          x: 300,
          y: 300,
          fill: `rgba(${fillRgb.r}, ${fillRgb.g}, ${fillRgb.b}, ${fillRgb.a})`,
          fillRgb,
          rotation: 0,
          text: 'Text',
          selectable: true,
          draw: false,
          visible: true,
          disabled: false,
        },
      },
    ];
    return items;
  };

  const handleClickCircleArrow = () => {
    const id = uuidv4();
    const items = [
      {
        id,
        config: {
          uuid: id,
          shape: SideMenuTypes.CIRCLE_ARROW,
          x: 0,
          y: 0,
          scaleX: 1,
          scaleY: 1,
          rotation: 0,
          flipHorizontal: false,
          selectable: true,
          draw: false,
          visible: true,
          disabled: false,
        },
      },
    ];
    return items;
  };

  const handleClickWc = () => {
    const id = uuidv4();
    const items = [
      {
        id,
        config: {
          uuid: id,
          shape: SideMenuTypes.WC,
          x: 0,
          y: 0,
          scaleX: 1,
          scaleY: 1,
          rotation: 0,
          selectable: true,
          draw: false,
          visible: true,
          disabled: false,
        },
      },
    ];
    return items;
  };

  const handleClickRestArea = () => {
    const id = uuidv4();
    const items = [
      {
        id,
        config: {
          uuid: id,
          shape: SideMenuTypes.REST_AREA,
          x: 0,
          y: 0,
          scaleX: 1,
          scaleY: 1,
          rotation: 0,
          selectable: true,
          draw: false,
          visible: true,
          disabled: false,
        },
      },
    ];
    return items;
  };

  const handleClickOutlet = () => {
    const id = uuidv4();
    const items = [
      {
        id,
        config: {
          uuid: id,
          shape: SideMenuTypes.OUTLET,
          x: 0,
          y: 0,
          scaleX: 1,
          scaleY: 1,
          rotation: 0,
          selectable: true,
          draw: false,
          visible: true,
          disabled: false,
        },
      },
    ];
    return items;
  };

  const handleMenuClick = useCallback((menuType: SideMenuType) => {
    if (menuType === SideMenuTypes.SELECT_TOOL) {
      handleClickMenu(menuType, []);
    } else if (menuType === SideMenuTypes.GONDOLA) {
      setAddGondolaOpen(true);
    } else if (menuType === SideMenuTypes.MESH_END) {
      setAddMeshendOpen(true);
    } else if (menuType === SideMenuTypes.TABLE) {
      setAddTableOpen(true);
    } else if (menuType === SideMenuTypes.WALL) {
      setAddWallOpen(true);
    } else if (menuType === SideMenuTypes.ISLAND) {
      setAddIslandOpen(true);
    } else if (menuType === SideMenuTypes.SPECIAL_SHAPE) {
      setAddSpecialShapeOpen(true);
    } else if (menuType === SideMenuTypes.AREA) {
      setAddAreaOpen(true);
    } else if (menuType === SideMenuTypes.PILLAR) {
      handleClickMenu(menuType, handleClickPillar());
    } else if (menuType === SideMenuTypes.RECT_TEXT) {
      handleClickMenu(menuType, handleClickRectText());
    } else if (menuType === SideMenuTypes.ELLIPSE_TEXT) {
      handleClickMenu(menuType, handleClickEllipseText());
    } else if (menuType === SideMenuTypes.ARROW1) {
      handleClickMenu(menuType, handleClickArrow1());
    } else if (menuType === SideMenuTypes.ARROW2) {
      handleClickMenu(menuType, handleClickArrow2());
    } else if (menuType === SideMenuTypes.PEN) {
      handleClickMenu(menuType, handleClickPen());
    } else if (menuType === SideMenuTypes.LINE) {
      handleClickMenu(menuType, handleClickLine());
    } else if (menuType === SideMenuTypes.RECT) {
      handleClickMenu(menuType, handleClickRect());
    } else if (menuType === SideMenuTypes.ELLIPSE) {
      handleClickMenu(menuType, handleClickEllipse());
    } else if (menuType === SideMenuTypes.POLYGON) {
      handleClickMenu(menuType, handleClickPolygon());
    } else if (menuType === SideMenuTypes.TEXT) {
      handleClickMenu(menuType, handleClickText());
    } else if (menuType === SideMenuTypes.CIRCLE_ARROW) {
      handleClickMenu(menuType, handleClickCircleArrow());
    } else if (menuType === SideMenuTypes.WC) {
      handleClickMenu(menuType, handleClickWc());
    } else if (menuType === SideMenuTypes.REST_AREA) {
      handleClickMenu(menuType, handleClickRestArea());
    } else if (menuType === SideMenuTypes.OUTLET) {
      handleClickMenu(menuType, handleClickOutlet());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // サイドメニューのスクロール位置を取得
  const handleScrollMenu = (e: React.UIEvent<HTMLDivElement>) => {
    const container: any = e.target;
    setScrollOffset(container.scrollTop);
  };

  const handleCancel = useCallback(() => {
    if (onClickMenuCancel) {
      onClickMenuCancel();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClickMenuCancel]);

  const closeAddArea = () => setAddAreaOpen(false);
  const closeAddGondola = () => setAddGondolaOpen(false);
  const closeAddMeshend = () => setAddMeshendOpen(false);
  const closeAddTable = () => setAddTableOpen(false);
  const closeAddWall = () => setAddWallOpen(false);
  const closeAddIsland = () => setAddIslandOpen(false);
  const closeAddSpecialShape = () => setAddSpecialShapeOpen(false);
  const closeAddOtherShapes = () => setAddOtherShapes(false);

  const changeOtherShapes = () =>
    addOtherShapes ? setAddOtherShapes(false) : setAddOtherShapes(true);

  return (
    <>
      <Component
        selectedMenu={selectedMenu}
        visible={visibleMenu}
        onClickMenu={handleMenuClick}
        onScrollMenu={handleScrollMenu}
        otherShapeSubMenuRef={otherShapeSubMenuRef}
        isOpenOtherShapes={addOtherShapes}
        onRequestCloseOtherShapes={closeAddOtherShapes}
        onClickOtherShapes={changeOtherShapes}
      />
      <MapEditorAddArea
        isOpen={addAreaOpen}
        onRequestClose={closeAddArea}
        onCancel={handleCancel}
        onSuccess={handleClickAddArea}
      />
      <MapEditorAddGondola
        isOpen={addGondolaOpen}
        defaultBranchNum={defaultTableNextBranchNum()}
        onRequestClose={closeAddGondola}
        onCancel={handleCancel}
        onSuccess={handleClickAddGondola}
      />
      <MapEditorAddMeshend
        isOpen={addMeshendOpen}
        defaultBranchNum={defaultTableNextBranchNum()}
        onRequestClose={closeAddMeshend}
        onCancel={handleCancel}
        onSuccess={handleClickAddMeshend}
      />
      <MapEditorAddTable
        isOpen={addTableOpen}
        onRequestClose={closeAddTable}
        onCancel={handleCancel}
        onSuccess={handleClickAddTable}
      />
      <MapEditorAddWall
        isOpen={addWallOpen}
        onRequestClose={closeAddWall}
        onCancel={handleCancel}
        onSuccess={handleClickAddWall}
      />
      <MapEditorAddIsland
        isOpen={addIslandOpen}
        onRequestClose={closeAddIsland}
        onCancel={handleCancel}
        onSuccess={handleClickAddIsland}
      />
      <MapEditorAddSpecialShape
        isOpen={addSpecialShapeOpen}
        onRequestClose={closeAddSpecialShape}
        onCancel={handleCancel}
        onSuccess={handleClickAddSpecialShape}
      />
      <MapEditorOtherShapeMenu
        isOpen={addOtherShapes}
        onRequestClose={closeAddOtherShapes}
        otherShapeSubMenuRef={otherShapeSubMenuRef}
        scrollOffset={scrollOffset}
        selectedMenu={selectedMenu}
        onClickMenu={handleMenuClick}
        onClickOtherShapes={changeOtherShapes}
      />
    </>
  );
};
