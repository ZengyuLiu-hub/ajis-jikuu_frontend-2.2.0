import Konva from 'konva';
import { Transformer } from 'konva/lib/shapes/Transformer';
import { useEffect, useMemo, useState } from 'react';

import * as editorConstants from '../../constants/editor';

import { useAppDispatch } from '../../app/hooks';
import { GondolaPlacements, ShapeOperations, SideMenuTypes } from '../../types';
import { EditorUtil } from '../../utils/EditorUtil';

import {
  editorDragModule,
  editorNodeModule,
  editorShapeModule,
} from '../../modules';
import {
  useEditNodeList,
  useLatticeHeight,
  useLatticeWidth,
  useReselectEditNodeList,
  useSelectedMenu,
} from '../../selectors';

import { Group } from 'konva/lib/Group';
import {
  LocationTypes,
  ShapeEllipse,
  ShapeEllipseTable,
} from '../../components/molecules';
import { EditorTransformer as Component } from '../../components/organisms';

type TransformingRadiusShape = ShapeEllipse | ShapeEllipseTable;

interface Props {
  transformerRef: any;
  id: string;
}

/**
 * マップエディタ：変形
 */
export const EditorTransformer = (props: Props) => {
  const dispatch = useAppDispatch();

  const selectedMenu = useSelectedMenu();
  const editNodeList = useEditNodeList();
  const reselectEditNodeList = useReselectEditNodeList();

  const latticeWidth = useLatticeWidth();
  const latticeHeight = useLatticeHeight();

  const [beforeRotation, setBeforeRotation] = useState(0);
  const [beforeConfigMap, setBeforeConfigMap] = useState(new Map());
  const [transformingRadiusShape, setTransformingRadiusShape] =
    useState<TransformingRadiusShape>();

  /**
   * ドラッグ操作によるプロパティの変更を反映します.
   */
  const changeDragProps = (node: any, includeRotationGondola: boolean) => {
    const orgConfig: any = { ...(node.config ?? node.attrs.config) };
    const newConfig: any = {};

    // X 座標
    if (orgConfig.hasOwnProperty(editorConstants.SHAPE_PROP_NAME_X)) {
      if (includeRotationGondola) {
        newConfig.x = node.x();
      } else {
        newConfig.x = EditorUtil.calcGuideGridSize(node.x(), latticeWidth);
      }
    }

    // Y 座標
    if (orgConfig.hasOwnProperty(editorConstants.SHAPE_PROP_NAME_Y)) {
      if (includeRotationGondola) {
        newConfig.y = node.y();
      } else {
        newConfig.y = EditorUtil.calcGuideGridSize(node.y(), latticeHeight);
      }
    }

    // 結果返却
    return { ...orgConfig, ...newConfig };
  };

  /**
   * 半径を持つシェイプの変形操作中の値を更新します.
   *
   * @param {any} node 変形中のシェイプ
   * @param {Transformer} transformer 変形オブジェクト
   * @param {TransformingRadiusShape | undefined} transformingShape 変形中シェイプ
   * @returns {TransformingRadiusShape | undefined} 変形中シェイプ
   */
  const transformRadius = (
    node: any,
    transformer: Transformer,
    transformingShape: TransformingRadiusShape | undefined,
  ): TransformingRadiusShape | undefined => {
    const orgConfig: any = { ...node.attrs.config };

    // 円系シェイプ以外の場合は終了
    if (
      orgConfig.shape !== SideMenuTypes.ELLIPSE &&
      orgConfig.shape !== SideMenuTypes.ELLIPSE_TEXT &&
      orgConfig.shape !== SideMenuTypes.CIRCLE_TABLE
    ) {
      return;
    }

    const mapLayerNode = () => {
      const stage = transformer.getStage() ?? undefined;
      const mapLayer = stage?.getLayers().find((d) => d.id() === 'mapLayer');

      return mapLayer?.findOne(`#${orgConfig.id}`);
    };

    // マップレイヤーに存在する本体を取得
    const parent = transformingShape ?? mapLayerNode();
    if (
      !parent ||
      !(parent instanceof ShapeEllipse || parent instanceof ShapeEllipseTable)
    ) {
      return;
    }

    const clientRect = node.getClientRect();

    const scaleX = Math.round(node.scaleX() * 100) / 100;
    const scaleY = Math.round(node.scaleY() * 100) / 100;

    // X 半径を設定
    if (scaleX !== 1) {
      parent.dragRadiusX((clientRect.width * scaleX) / 2);
    }

    // Y 半径を設定
    if (scaleY !== 1) {
      parent.dragRadiusY((clientRect.height * scaleY) / 2);
    }
    return parent;
  };

  // 半径を持つシェイプの変形操作をリセット
  const resetTransformedRadius = (
    transformingShape: TransformingRadiusShape,
  ) => {
    const { id } = transformingShape.attrs;

    const { radiusX, radiusY } = beforeConfigMap.get(id);
    transformingShape.dragRadiusX(radiusX);
    transformingShape.dragRadiusY(radiusY);
  };

  /**
   * シェイプごとのプロパティを変更します.
   *
   * @param {Object} param パラメータ
   */
  const changeTransformShapeProps = ({
    node,
    scaleX,
    scaleY,
  }: {
    node: any;
    scaleX: number;
    scaleY: number;
  }) => {
    const orgConfig: any = { ...node.attrs.config };
    const newConfig: any = {};

    // 線
    if (orgConfig.shape === SideMenuTypes.LINE) {
      const pointEnd = orgConfig.points[1];
      const pointEndX = EditorUtil.calcGuideGridSize(
        pointEnd[0] * node.scaleX(),
        latticeWidth,
      );
      const pointEndY = EditorUtil.calcGuideGridSize(
        pointEnd[1] * node.scaleY(),
        latticeHeight,
      );
      newConfig.points = [orgConfig.points[0], [pointEndX, pointEndY]];

      const width = Math.abs(newConfig.points[0][0] - newConfig.points[1][0]);
      const height = Math.abs(newConfig.points[0][1] - newConfig.points[1][1]);
      if (width > 0 && Math.round(scaleX) === 1) {
        newConfig.strokeWidth = Math.ceil(orgConfig.strokeWidth * scaleY);
      } else if (height > 0 && Math.round(scaleY) === 1) {
        newConfig.strokeWidth = Math.ceil(orgConfig.strokeWidth * scaleX);
      }
    }

    // 矢印
    if (
      orgConfig.shape === SideMenuTypes.ARROW1 ||
      orgConfig.shape === SideMenuTypes.ARROW2
    ) {
      const pointX = EditorUtil.calcGuideGridSize(
        orgConfig.points[2] * scaleX,
        latticeWidth,
      );
      const pointY = EditorUtil.calcGuideGridSize(
        orgConfig.points[3] * scaleY,
        latticeWidth,
      );
      newConfig.points = [0, 0, pointX, pointY];

      const width = Math.abs(newConfig.points[0] - newConfig.points[2]);
      const height = Math.abs(newConfig.points[1] - newConfig.points[3]);
      if (width > 0 && Math.round(scaleX) === 1) {
        newConfig.strokeWidth = Math.ceil(orgConfig.strokeWidth * scaleY);
      } else if (height > 0 && Math.round(scaleY) === 1) {
        newConfig.strokeWidth = Math.ceil(orgConfig.strokeWidth * scaleX);
      }
    }

    // 特殊型
    if (orgConfig.shape === SideMenuTypes.SPECIAL_SHAPE) {
      if (scaleX !== 1) {
        const newWidth = EditorUtil.calcGuideGridSize(
          orgConfig.width * scaleX,
          latticeWidth,
        );

        newConfig.width = newWidth;
      }

      if (scaleY !== 1) {
        newConfig.depth = EditorUtil.calcGuideGridSize(
          orgConfig.depth * scaleY,
          latticeHeight,
        );
      }
    }

    // テキスト
    if (orgConfig.shape === SideMenuTypes.TEXT) {
      if (scaleX > 1 || scaleY > 1) {
        newConfig.fontSize = Math.floor(
          orgConfig.fontSize * Math.max(scaleX, scaleY),
        );
      } else if (scaleX <= 1 && scaleY <= 1) {
        newConfig.fontSize = Math.floor(
          orgConfig.fontSize * Math.min(scaleX, scaleY),
        );
      }
    }

    // ペン・回転矢印・トイレ・休憩室・電源
    if (
      orgConfig.shape === SideMenuTypes.PEN ||
      orgConfig.shape === SideMenuTypes.CIRCLE_ARROW ||
      orgConfig.shape === SideMenuTypes.WC ||
      orgConfig.shape === SideMenuTypes.REST_AREA ||
      orgConfig.shape === SideMenuTypes.OUTLET
    ) {
      newConfig.scaleX = scaleX;
      newConfig.scaleY = scaleY;
    }

    return newConfig;
  };

  /**
   * 変形操作によるプロパティの変更を反映します.
   */
  const changeTransformProps = (
    node: any,
    multiSelected: boolean,
    evt: MouseEvent,
  ) => {
    const orgConfig: any = { ...node.attrs.config };
    const newConfig: any = {};

    const scaleX = Math.round(node.scaleX() * 100) / 100;
    const scaleY = Math.round(node.scaleY() * 100) / 100;

    // X 座標
    const x = EditorUtil.calcGuideGridSize(node.x(), latticeWidth);
    if (orgConfig.hasOwnProperty(editorConstants.SHAPE_PROP_NAME_X)) {
      newConfig.x = x;
    }

    // Y 座標
    const y = EditorUtil.calcGuideGridSize(node.y(), latticeWidth);
    if (orgConfig.hasOwnProperty(editorConstants.SHAPE_PROP_NAME_Y)) {
      newConfig.y = y;
    }

    const width = multiSelected
      ? EditorUtil.calcGuideGridSize(
          orgConfig.width * scaleX,
          latticeWidth,
          'ceil',
        )
      : EditorUtil.calcGuideGridSize(orgConfig.width * scaleX, latticeWidth);

    // 幅
    if (orgConfig.hasOwnProperty(editorConstants.SHAPE_PROP_NAME_WIDTH)) {
      newConfig.width = width;
    }

    // 幅（セル）
    if (orgConfig.hasOwnProperty(editorConstants.SHAPE_PROP_NAME_WIDTH_CELLS)) {
      newConfig.widthCells = width / latticeWidth;
    }

    const height = multiSelected
      ? EditorUtil.calcGuideGridSize(
          orgConfig.height * scaleY,
          latticeHeight,
          'ceil',
        )
      : EditorUtil.calcGuideGridSize(orgConfig.height * scaleY, latticeHeight);

    // 高さ
    if (orgConfig.hasOwnProperty(editorConstants.SHAPE_PROP_NAME_HEIGHT)) {
      newConfig.height = height;
    }

    // 高さ（セル）
    if (
      orgConfig.hasOwnProperty(editorConstants.SHAPE_PROP_NAME_HEIGHT_CELLS)
    ) {
      newConfig.heightCells = height / latticeHeight;
    }

    // 幅の最小値が設定されている場合
    if (orgConfig.hasOwnProperty(editorConstants.SHAPE_PROP_NAME_MIN_WIDTH)) {
      const minWidth = width < orgConfig.minWidth ? orgConfig.minWidth : width;

      // 幅
      if (orgConfig.hasOwnProperty(editorConstants.SHAPE_PROP_NAME_WIDTH)) {
        newConfig.width = minWidth;
      }

      // 幅（セル）
      if (
        orgConfig.hasOwnProperty(editorConstants.SHAPE_PROP_NAME_WIDTH_CELLS)
      ) {
        newConfig.widthCells = minWidth / latticeWidth;
      }
    }

    // 高さの最小値が設定されている場合
    if (orgConfig.hasOwnProperty(editorConstants.SHAPE_PROP_NAME_MIN_HEIGHT)) {
      const minHeight =
        height < orgConfig.minHeight ? orgConfig.minHeight : height;

      // 高さ
      if (orgConfig.hasOwnProperty(editorConstants.SHAPE_PROP_NAME_HEIGHT)) {
        newConfig.height = minHeight;
      }

      // 高さ（セル）
      if (
        orgConfig.hasOwnProperty(editorConstants.SHAPE_PROP_NAME_HEIGHT_CELLS)
      ) {
        newConfig.heightCells = minHeight / latticeHeight;
      }
    }

    const clientRect = node.getClientRect();

    // X 半径
    if (orgConfig.hasOwnProperty(editorConstants.SHAPE_PROP_NAME_RADIUS_X)) {
      const radiusX = EditorUtil.calcGuideGridSize(
        Math.max(orgConfig.minRadiusX, clientRect.width * scaleX) / 2,
        latticeWidth,
      );
      newConfig.radiusX = radiusX;
    }

    // Y 半径
    if (orgConfig.hasOwnProperty(editorConstants.SHAPE_PROP_NAME_RADIUS_Y)) {
      const radiusY = EditorUtil.calcGuideGridSize(
        Math.max(orgConfig.minRadiusY, clientRect.height * scaleY) / 2,
        latticeHeight,
      );
      newConfig.radiusY = radiusY;
    }

    // 結果返却
    return {
      ...orgConfig,
      ...newConfig,
      ...changeTransformShapeProps({ node, scaleX, scaleY }),
    };
  };

  /**
   * XY 座標の再計算処理.
   */
  const recalculationXY = (
    configList: any[],
    config: any,
    sortedEditNodeList: Group[],
  ) => {
    let approximationX: any = { ...config };
    let approximationY: any = { ...config };

    if (configList.length > 0) {
      approximationX =
        configList.find(
          (node) =>
            node.uuid === getDirectlyLeft(config.uuid, sortedEditNodeList).uuid,
        ) ?? approximationX;

      approximationY =
        configList.find(
          (node) =>
            node.uuid === getDirectlyTop(config.uuid, sortedEditNodeList).uuid,
        ) ?? approximationY;
    }

    const newConfig: any = {};

    // X 値再設定
    if (approximationX.uuid !== config.uuid) {
      newConfig.x = approximationX.x + approximationX.width;
    }

    // Y 値再設定
    if (approximationY.uuid !== config.uuid) {
      newConfig.y = approximationY.y + approximationY.height;
    }

    // 結果返却
    return { ...config, ...newConfig };
  };

  /**
   * 対象のゴンドラに左側に隣接するゴンドラ取得処理.
   *
   * @param uuid UUID
   * @param sortedEditNodeList ソート済みゴンドラリスト
   * @returns 左側に隣接するゴンドラデータ
   */
  const getDirectlyLeft = (uuid: string, sortedEditNodeList: Group[]) => {
    const targetIndex = sortedEditNodeList.findIndex(
      (group) => group.attrs.config.uuid === uuid,
    );

    let directlyLeft = sortedEditNodeList[targetIndex].attrs.config;
    const target = sortedEditNodeList[targetIndex].attrs.config;

    // 先頭のゴンドラは必ず自身が基準となるため処理をスキップ
    if (targetIndex === 0) {
      return directlyLeft;
    }

    // 自身以上に位置するかつX軸が隣接するゴンドラを探す
    const directlyLeftConfigs = sortedEditNodeList
      .slice(0, targetIndex)
      .filter(
        (node) => target.x === node.attrs.config.x + node.attrs.config.width,
      );
    if (directlyLeftConfigs.length > 0) {
      // X軸が隣接するゴンドラの中から、最もY軸が近いゴンドラを探す
      const distanceTargetTo = (dest: any) =>
        Math.abs(target.y - dest.attrs.config.y);
      const [mostNearConfig] = directlyLeftConfigs.toSorted(
        (a, b) => distanceTargetTo(a) - distanceTargetTo(b),
      );
      directlyLeft = mostNearConfig.attrs.config ?? target;
    }

    return directlyLeft;
  };

  /**
   * 対象のゴンドラに上側に隣接するゴンドラ取得処理.
   *
   * @param uuid UUID
   * @param sortedEditNodeList ソート済みゴンドラリスト
   * @returns 上側に隣接するゴンドラデータ
   */
  const getDirectlyTop = (uuid: string, sortedEditNodeList: Group[]) => {
    const targetIndex = sortedEditNodeList.findIndex(
      (group) => group.attrs.config.uuid === uuid,
    );

    let directlyTop = sortedEditNodeList[targetIndex].attrs.config;
    const target = sortedEditNodeList[targetIndex].attrs.config;

    // 先頭のゴンドラは必ず自身が基準となるため処理をスキップ
    if (targetIndex === 0) {
      return directlyTop;
    }

    // 自身以上に位置するかつY軸が隣接するゴンドラを探す
    const directlyAboveConfigs = sortedEditNodeList
      .slice(0, targetIndex)
      .filter(
        (node) => target.y === node.attrs.config.y + node.attrs.config.height,
      );
    if (directlyAboveConfigs.length > 0) {
      // Y軸が隣接するゴンドラの中から、最もX軸が近いゴンドラを探す
      const distanceTargetTo = (dest: any) =>
        Math.abs(target.x - dest.attrs.config.x);
      const [mostNearConfig] = directlyAboveConfigs.toSorted(
        (a, b) => distanceTargetTo(a) - distanceTargetTo(b),
      );
      directlyTop = mostNearConfig.attrs.config ?? target;
    }

    return directlyTop;
  };

  /**
   * 回転率変更処理.
   */
  const changeRotation = (node: any, allSame: boolean) => {
    const orgConfig: any = { ...node.attrs.config };
    const newConfig: any = {};

    // 回転
    if (orgConfig.hasOwnProperty(editorConstants.SHAPE_PROP_NAME_ROTATION)) {
      if (editNodeList.length === 1) {
        // 単一選択の場合

        // 回転
        newConfig.rotation = Math.floor(node.rotation());

        // X 座標
        if (orgConfig.hasOwnProperty(editorConstants.SHAPE_PROP_NAME_X)) {
          newConfig.x = EditorUtil.calcGuideGridSize(
            node.x(),
            latticeWidth,
            'ceil',
          );
        }

        // Y 座標
        if (orgConfig.hasOwnProperty(editorConstants.SHAPE_PROP_NAME_Y)) {
          newConfig.y = EditorUtil.calcGuideGridSize(
            node.y(),
            latticeWidth,
            'ceil',
          );
        }
      } else {
        // 複数選択の場合

        // 回転
        if (allSame && Math.abs(node.rotation()) < 1) {
          newConfig.rotation = 0;
        } else {
          newConfig.rotation = node.rotation();
        }

        // X 座標
        if (orgConfig.hasOwnProperty(editorConstants.SHAPE_PROP_NAME_X)) {
          if (allSame && newConfig.rotation === 0) {
            newConfig.x = EditorUtil.calcGuideGridSize(node.x(), latticeWidth);
          } else {
            newConfig.x = node.x();
          }
        }

        // Y 座標
        if (orgConfig.hasOwnProperty(editorConstants.SHAPE_PROP_NAME_Y)) {
          if (allSame && newConfig.rotation === 0) {
            newConfig.y = EditorUtil.calcGuideGridSize(node.y(), latticeHeight);
          } else {
            newConfig.y = node.y();
          }
        }
      }
    }

    // 結果返却
    return { ...orgConfig, ...newConfig };
  };

  /**
   * 拡大率変更処理.
   */
  const changeScale = (newConfigList: any[], sortedEditNodeList: Group[]) => {
    // 結果返却
    return newConfigList.map((d: any) => {
      if (
        d.locationType !== LocationTypes.FRONTEND &&
        d.locationType !== LocationTypes.BACKEND
      ) {
        return d;
      }

      let approximationW: any = { uuid: d.uuid, x: d.x, width: d.width };
      let approximationH: any = { uuid: d.uuid, y: d.y, height: d.height };

      // ゴンドラが垂直の場合、高さのみを算出する
      if (d.placement === GondolaPlacements.VERTICAL) {
        // 上部ゴンドラの高さ計算
        const directlyRight = getDirectlyRightSelfRange(
          d.uuid,
          sortedEditNodeList,
        );
        if (directlyRight.uuid !== d.uuid) {
          const offsetHeight = newConfigList.find(
            (node) => node.uuid === directlyRight.uuid,
          );
          approximationH.height =
            offsetHeight.y + offsetHeight.height - approximationH.y;
        } else {
          //下部ゴンドラの高さ計算
          const directlyLeft = getDirectlyLeftSelfRange(
            d.uuid,
            sortedEditNodeList,
          );
          if (directlyLeft.uuid !== d.uuid) {
            const offsetHeight = newConfigList.find(
              (node) => node.uuid === directlyLeft.uuid,
            );
            approximationH.height =
              offsetHeight.y + offsetHeight.height - approximationH.y;
          }
        }
      }

      // 水平の場合、高さのみを算出する
      if (d.placement === GondolaPlacements.HORIZONTAL) {
        // 上部ゴンドラの幅計算
        const directlyUnder = getDirectlyUnderSelfRange(
          d.uuid,
          sortedEditNodeList,
        );
        if (directlyUnder.uuid !== d.uuid) {
          const offsetWidth = newConfigList.find(
            (node) => node.uuid === directlyUnder.uuid,
          );
          approximationW.width =
            offsetWidth.x + offsetWidth.width - approximationW.x;
        } else {
          //下部ゴンドラの幅計算
          const directlyTop = getDirectlyTopSelfRange(
            d.uuid,
            sortedEditNodeList,
          );
          if (directlyTop.uuid !== d.uuid) {
            const offsetWidth = newConfigList.find(
              (node) => node.uuid === directlyTop.uuid,
            );
            approximationW.width =
              offsetWidth.x + offsetWidth.width - approximationW.x;
          }
        }
      }

      return {
        ...d,
        x: approximationW.x,
        y: approximationH.y,
        width: approximationW.width,
        height: approximationH.height,
      };
    });
  };

  const getDirectlyRightSelfRange = (
    uuid: string,
    sortedEditNodeList: Group[],
  ) => {
    const targetIndex = sortedEditNodeList.findIndex(
      (group) => group.attrs.config.uuid === uuid,
    );

    let directlyRight = sortedEditNodeList[targetIndex].attrs.config;
    const target = sortedEditNodeList[targetIndex].attrs.config;

    // 自身より右に位置するかつ、自身の範囲内、X軸が隣接するゴンドラを探す
    const directlyRightConfigs = sortedEditNodeList
      .slice(targetIndex + 1, sortedEditNodeList.length)
      .filter(
        (node) =>
          node.attrs.config.locationType === LocationTypes.SIDE &&
          target.y < node.attrs.config.y &&
          node.attrs.config.y < target.y + target.height &&
          target.x + target.width === node.attrs.config.x,
      );

    if (directlyRightConfigs.length > 0) {
      // X軸が隣接するゴンドラの中から、Y軸が最も遠いゴンドラを探す
      const distanceTargetTo = (dest: any) => dest.attrs.config.y - target.y;
      const [mostNearConfig] = directlyRightConfigs.toSorted(
        (a, b) => distanceTargetTo(b) - distanceTargetTo(a),
      );
      directlyRight = mostNearConfig.attrs.config ?? target;
    }

    return directlyRight;
  };

  const getDirectlyLeftSelfRange = (
    uuid: string,
    sortedEditNodeList: Group[],
  ) => {
    const targetIndex = sortedEditNodeList.findIndex(
      (group) => group.attrs.config.uuid === uuid,
    );

    let directlyLeft = sortedEditNodeList[targetIndex].attrs.config;
    const target = sortedEditNodeList[targetIndex].attrs.config;

    // 自身より左に位置するかつ、自身の範囲内かつ、X軸が隣接するゴンドラを探す
    const directlyLeftConfigs = sortedEditNodeList
      .slice(targetIndex, sortedEditNodeList.length)
      .filter(
        (node) =>
          node.attrs.config.locationType === LocationTypes.SIDE &&
          target.y < node.attrs.config.y &&
          node.attrs.config.y < target.y + target.height &&
          target.x === node.attrs.config.x + node.attrs.config.width,
      );

    if (directlyLeftConfigs.length > 0) {
      // X軸が隣接するゴンドラの中から、Y軸が最も遠いゴンドラを探す
      const distanceTargetTo = (dest: any) => dest.attrs.config.y - target.y;
      const [mostNearConfig] = directlyLeftConfigs.toSorted(
        (a, b) => distanceTargetTo(b) - distanceTargetTo(a),
      );
      directlyLeft = mostNearConfig.attrs.config ?? target;
    }

    return directlyLeft;
  };

  const getDirectlyUnderSelfRange = (
    uuid: string,
    sortedEditNodeList: Group[],
  ) => {
    const targetIndex = sortedEditNodeList.findIndex(
      (group) => group.attrs.config.uuid === uuid,
    );

    let directlyUnder = sortedEditNodeList[targetIndex].attrs.config;
    const target = sortedEditNodeList[targetIndex].attrs.config;

    // 自身より下に位置するかつ、自身の幅の範囲内かつ、Y軸が隣接するゴンドラを探す
    const directlyUnderConfigs = sortedEditNodeList
      .slice(targetIndex, sortedEditNodeList.length)
      .filter(
        (node) =>
          node.attrs.config.locationType === LocationTypes.SIDE &&
          target.x < node.attrs.config.x &&
          node.attrs.config.x < target.x + target.width &&
          target.y + target.height === node.attrs.config.y,
      );

    if (directlyUnderConfigs.length > 0) {
      // Y軸が隣接するゴンドラの中から、X軸が最も遠いゴンドラを探す
      const distanceTargetTo = (dest: any) => dest.attrs.config.x - target.x;
      const [mostNearConfig] = directlyUnderConfigs.toSorted(
        (a, b) => distanceTargetTo(b) - distanceTargetTo(a),
      );
      directlyUnder = mostNearConfig.attrs.config ?? target;
    }

    return directlyUnder;
  };

  const getDirectlyTopSelfRange = (
    uuid: string,
    sortedEditNodeList: Group[],
  ) => {
    const targetIndex = sortedEditNodeList.findIndex(
      (group) => group.attrs.config.uuid === uuid,
    );

    let directlyTop = sortedEditNodeList[targetIndex].attrs.config;
    const target = sortedEditNodeList[targetIndex].attrs.config;

    // 自身より上に位置するかつ、自身の幅の範囲内かつ、Y軸が隣接するゴンドラを探す
    const directlyTopConfigs = sortedEditNodeList
      .slice(0, targetIndex)
      .filter(
        (node) =>
          node.attrs.config.locationType === LocationTypes.SIDE &&
          target.x < node.attrs.config.x &&
          node.attrs.config.x < target.x + target.width &&
          target.y === node.attrs.config.y + node.attrs.config.height,
      );

    if (directlyTopConfigs.length > 0) {
      // Y軸が隣接するゴンドラの中から、X軸が最も遠いゴンドラを探す
      const distanceTargetTo = (dest: any) => dest.attrs.config.x - target.x;
      const [mostNearConfig] = directlyTopConfigs.toSorted(
        (a, b) => distanceTargetTo(b) - distanceTargetTo(a),
      );
      directlyTop = mostNearConfig.attrs.config ?? target;
    }

    return directlyTop;
  };

  /**
   * リサイズ操作が可能な場合は true を、それ以外の場合は false を返します.
   */
  const canResize = (editNodeList: any[]) => {
    if (editNodeList.length === 0) {
      return true;
    }

    // 選択シェイプ数が一括操作の最大数を超えている場合は無効
    if (editNodeList.length > editorConstants.EDITABLE_MAX_SELECTION_SHAPES) {
      return false;
    }

    // エリア、多角形を単一選択した場合は無効
    const node = editNodeList[0];
    const config = node.config ?? node.attrs.config;
    if (
      editNodeList.length === 1 &&
      (config.shape === SideMenuTypes.AREA ||
        config.shape === SideMenuTypes.POLYGON)
    ) {
      return false;
    }

    // 複数選択中、かつ選択範囲に回転したゴンドラが含まれていた場合
    const rotateGondola = editNodeList.find(
      (node: any) =>
        (node.config ?? node.attrs.config).shape === SideMenuTypes.GONDOLA &&
        node.rotation() !== 0,
    );
    if (editNodeList.length > 1 && rotateGondola) {
      return false;
    }
    return true;
  };

  /**
   * 回転操作が可能な場合は true を、それ以外の場合は false を返します.
   */
  const canRotate = (editNodeList: any[]) => {
    if (editNodeList.length === 0) {
      return true;
    }

    // 選択シェイプ数が一括操作の最大数を超えている場合は無効
    if (editNodeList.length > editorConstants.EDITABLE_MAX_SELECTION_SHAPES) {
      return false;
    }
    return true;
  };

  /**
   * マウスが選択範囲に乗った場合のイベント.
   */
  const handleMouseEnter = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const transformer = e.currentTarget as Transformer;
    const stage = transformer.getStage();

    const container = stage?.container();
    if (container) {
      container.style.cursor = 'move';
    }
  };

  /**
   * マウスが選択範囲から離れた場合のイベント.
   */
  const handleMouseLeave = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const transformer = e.currentTarget as Transformer;
    const stage = transformer.getStage();

    const container = stage?.container();
    if (container) {
      if (selectedMenu === SideMenuTypes.SELECT_TOOL) {
        container.style.cursor = 'default';
      } else {
        container.style.cursor = 'crosshair';
      }
    }
  };

  /**
   * ドラッグ開始イベント.
   */
  const handleTransformerDragStart = (e: Konva.KonvaEventObject<DragEvent>) => {
    const transformer = e.currentTarget as Transformer;
    const stage = transformer.getStage();

    // 選択シェイプ数が一括操作の最大数を超えている場合
    if (editNodeList.length > editorConstants.EDITABLE_MAX_SELECTION_SHAPES) {
      const areaLayer = stage?.getLayers().find((d) => d.id() === 'areaLayer');
      const mapLayer = stage?.getLayers().find((d) => d.id() === 'mapLayer');

      const allLength =
        (areaLayer?.children?.length ?? 0) + (mapLayer?.children?.length ?? 0);

      // 全選択の場合、エリアレイヤー、マップレイヤーを非表示にする
      if (editNodeList.length === allLength) {
        areaLayer?.visible(false);
        mapLayer?.visible(false);
      }
    } else {
      // ドラッグ中は編集レイヤーを非表示にする
      const editLayer = stage?.getLayers().find((d) => d.id() === 'editLayer');
      editLayer?.visible(false);
    }

    const container = stage?.container();
    if (container) {
      container.style.cursor = 'move';
    }
    dispatch(editorDragModule.actions.updateDragging(true));
  };

  /**
   * ドラッグ中イベント.
   */
  const handleTransformerDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
    // 処理無し
  };

  /**
   * ドラッグ終了イベント.
   */
  const handleTransformerDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    const rotateGondolaList = editNodeList.filter(
      (node: any) =>
        (node.config ?? node.attrs.config).shape === SideMenuTypes.GONDOLA &&
        node.rotation() !== 0,
    );

    const past: any[] = [];
    const present: any[] = [];

    const isMoveOnly =
      editNodeList.length > editorConstants.EDITABLE_MAX_SELECTION_SHAPES;

    editNodeList.forEach((node: any) => {
      const orgConfig = { ...(node.config ?? node.attrs.config) };

      const newConfig = changeDragProps(node, rotateGondolaList.length > 0);

      // 選択シェイプ数が一括操作の最大数を超えている場合
      if (isMoveOnly) {
        // オートフィットは行わない
        node.setAttrs({ config: newConfig });
        node.fire('changeAxis');
      } else {
        node.setAttrs({ x: newConfig.x, y: newConfig.y, config: newConfig });
        node.fire('changeConfig');
      }

      past.push({ id: orgConfig.uuid, config: orgConfig });
      present.push({ id: newConfig.uuid, config: newConfig });
    });

    if (isMoveOnly) {
      // 未保存状態更新
      dispatch(editorShapeModule.actions.updateUnsavedData(true));
    } else {
      // Undo リストに追加依頼
      dispatch(
        editorShapeModule.actions.updateMapPresent({
          operation: ShapeOperations.CHANGE,
          past,
          present,
        }),
      );
    }

    dispatch(editorNodeModule.actions.updateChangeNodeList());
    dispatch(editorDragModule.actions.updateDragging(false));

    const transformer = e.currentTarget as Transformer;
    const stage = transformer.getStage();

    const areaLayer = stage?.getLayers().find((d) => d.id() === 'areaLayer');
    areaLayer?.visible(true);

    const mapLayer = stage?.getLayers().find((d) => d.id() === 'mapLayer');
    mapLayer?.visible(true);

    const editLayer = stage?.getLayers().find((d) => d.id() === 'editLayer');
    editLayer?.visible(true);
  };

  /**
   * 変形開始イベント.
   */
  const handleTransformerTransformStart = (
    e: Konva.KonvaEventObject<Event>,
  ) => {
    const transformer = e.currentTarget as Transformer;
    setBeforeRotation(transformer.rotation());

    dispatch(editorDragModule.actions.updateTransforming(true));

    // 操作前の状態を退避
    const map = new Map();
    editNodeList.forEach((node) =>
      map.set(node.attrs.config.uuid, { ...node.attrs.config }),
    );
    setBeforeConfigMap(map);
  };

  /**
   * 変形イベント.
   */
  const handleTransformerTransform = (e: Konva.KonvaEventObject<Event>) => {
    const transformer = e.currentTarget as Transformer;

    // 選択シェイプが複数の場合はスキップ
    if (transformer.nodes().length > 1) {
      return;
    }
    const node: any = transformer.nodes()[0];

    // 円系シェイプ処理
    setTransformingRadiusShape(
      transformRadius(node, transformer, transformingRadiusShape),
    );
  };

  /**
   * 変形終了イベント.
   */
  const handleTransformerTransformEnd = (e: Konva.KonvaEventObject<Event>) => {
    setTransformingRadiusShape(undefined);
    // 変形中に ESC キーを押下した場合、編集ノードが空になる
    if (editNodeList.length === 0) {
      if (transformingRadiusShape) {
        resetTransformedRadius(transformingRadiusShape);
      }
      dispatch(editorDragModule.actions.updateTransforming(false));
      return;
    }

    const past: any[] = [];
    const present: any[] = [];

    const transformer = e.currentTarget as Transformer;
    if (transformer.rotation() !== beforeRotation) {
      // 選択シェイプが全て同じ角度か
      const allSame =
        new Set(editNodeList.map((d) => d.rotation()).filter(Boolean)).size ===
        1;

      // 回転操作
      editNodeList.forEach((node) => {
        const config = changeRotation(node, allSame);

        past.push({
          id: config.uuid,
          config: beforeConfigMap.get(config.uuid),
        });

        node.setAttr('config', config);
        node.fire('changeConfig');

        present.push({ id: config.uuid, config });
      });
    } else {
      // Y値、X値の昇順にソート
      const sortedEditNodeList = [...editNodeList].sort((a: any, b: any) => {
        if (a.attrs.config.y < b.attrs.config.y) {
          return -1;
        }
        if (a.attrs.config.y > b.attrs.config.y) {
          return 1;
        }
        if (a.attrs.config.x < b.attrs.config.x) {
          return -1;
        }
        if (a.attrs.config.x > b.attrs.config.x) {
          return 1;
        }
        return 0;
      });

      // 選択シェイプの変形後処理
      const newConfigList: any[] = [];
      sortedEditNodeList.forEach((node: any) => {
        // 変形後の値を再計算
        const newConfig = changeTransformProps(
          node,
          editNodeList.length > 1,
          e.evt as MouseEvent,
        );

        // 特定のシェイプに関しては拡大率をリセットしない
        if (
          !(newConfig.shape === SideMenuTypes.PEN) &&
          !(newConfig.shape === SideMenuTypes.CIRCLE_ARROW) &&
          !(newConfig.shape === SideMenuTypes.WC) &&
          !(newConfig.shape === SideMenuTypes.REST_AREA) &&
          !(newConfig.shape === SideMenuTypes.OUTLET)
        ) {
          node.scaleX(1);
          node.scaleY(1);
        }

        // 変更リストへ追加
        newConfigList.push(
          node.attrs.config.shape === SideMenuTypes.GONDOLA
            ? recalculationXY(newConfigList, newConfig, sortedEditNodeList)
            : newConfig,
        );
      });

      const calcConfigList = changeScale(newConfigList, sortedEditNodeList);
      sortedEditNodeList.forEach((node: any) => {
        const config = calcConfigList.find(
          (d: any) => d.uuid === node.attrs.config.uuid,
        );
        if (config) {
          past.push({
            id: config.uuid,
            config: beforeConfigMap.get(config.uuid),
          });

          node.setAttr('config', config);
          node.fire('changeConfig');

          present.push({ id: config.uuid, config });
        }
      });
    }

    // 編集ノードを再選択
    transformer.nodes([]);
    transformer.resizeEnabled(canResize(editNodeList));
    transformer.nodes(editNodeList);

    // Undo リストに追加依頼
    dispatch(
      editorShapeModule.actions.updateMapPresent({
        operation: ShapeOperations.CHANGE,
        past,
        present,
      }),
    );

    dispatch(editorNodeModule.actions.updateChangeNodeList());
    dispatch(editorDragModule.actions.updateTransforming(false));
  };

  // 選択ノードリスト
  const nodes = useMemo(() => {
    if (props.transformerRef.current) {
      props.transformerRef.current.resizeEnabled(canResize(editNodeList));
      props.transformerRef.current.rotateEnabled(canRotate(editNodeList));
    }
    return editNodeList;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editNodeList]);

  /**
   * 編集シェイプ再選択処理.
   */
  useEffect(() => {
    if (!props.transformerRef) {
      return;
    }
    props.transformerRef.current.nodes([]);
    props.transformerRef.current.nodes(editNodeList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reselectEditNodeList]);

  return (
    <Component
      transformerRef={props.transformerRef}
      id={props.id}
      nodes={nodes}
      visible={editNodeList.length > 0}
      latticeWidth={latticeWidth}
      latticeHeight={latticeHeight}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onDragStart={handleTransformerDragStart}
      onDragMove={handleTransformerDragMove}
      onDragEnd={handleTransformerDragEnd}
      onTransformStart={handleTransformerTransformStart}
      onTransform={handleTransformerTransform}
      onTransformEnd={handleTransformerTransformEnd}
    />
  );
};
