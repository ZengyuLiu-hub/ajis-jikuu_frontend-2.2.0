import React, { useEffect } from 'react';

import * as editorConstants from '../../constants/editor';

import {
  ShapeData,
  ShapeOperations,
  SideMenuTypes,
  UndoRedoOperations,
} from '../../types';

import { useAppDispatch } from '../../app/hooks';

import { editorNodeModule, editorShapeModule } from '../../modules';
import {
  useAreaLayerData,
  useVisibleAreaLayer,
  useLatticeWidth,
  useLatticeHeight,
  useLineDrawing,
} from '../../selectors';

import { EditorAreaLayer as Component } from '../../components/organisms';
import { ShapeArea } from '../../components/molecules/ShapeArea';

interface Props {
  layerRef: any;
}

/**
 * エリアレイヤー
 */
export const EditorAreaLayer = (props: Props) => {
  const { layerRef } = props;

  const dispatch = useAppDispatch();

  const areaLayerData = useAreaLayerData();
  const visibleAreaLayer = useVisibleAreaLayer();

  const latticeWidth = useLatticeWidth();
  const latticeHeight = useLatticeHeight();
  const isLineDrawing = useLineDrawing();

  const addChild = (data: ShapeData[]) => {
    data?.forEach((d) => {
      // エリア以外は除外
      if (d.config.shape !== SideMenuTypes.AREA) {
        return;
      }

      layerRef.current.add(
        new ShapeArea({
          ...d.config,
          id: d.config.uuid,
          perfectDrawEnabled: false,
          strokeScaleEnabled: false,
          isLineDrawing,
          latticeWidth,
          latticeHeight,
          onChangeAnchorPoint: (data) =>
            dispatch(editorShapeModule.actions.updateMapPresent(data)),
        }),
      );
    });
  };

  const changeChild = (data: ShapeData[]) => {
    data?.forEach((d) => {
      // エリア以外は除外
      if (d.config.shape !== SideMenuTypes.AREA) {
        return;
      }

      const node = layerRef.current?.findOne(`#${d.id}`);
      if (!node) {
        return;
      }

      // 上書きプロパティの作成
      const overrideConfig: any = {};

      if (
        node.config.hasOwnProperty(
          editorConstants.SHAPE_PROP_NAME_LATTICE_WIDTH,
        )
      ) {
        overrideConfig.latticeWidth = latticeWidth;
      }

      if (
        node.config.hasOwnProperty(
          editorConstants.SHAPE_PROP_NAME_LATTICE_HEIGHT,
        )
      ) {
        overrideConfig.latticeHeight = latticeHeight;
      }

      // プロパティ更新
      node.config = {
        ...d.config,
        ...overrideConfig,
      };

      // 移動ポイントの位置をリセット
      node.resetAnchorPoint();
    });
  };

  const removeChild = (data: ShapeData[]) => {
    data?.forEach((d) => {
      // エリア以外は除外
      if (d.config.shape !== SideMenuTypes.AREA) {
        return;
      }

      const node = layerRef.current?.findOne(`#${d.id}`);
      if (node) {
        node.destroy();
      }
    });
  };

  useEffect(() => {
    if (!layerRef.current || !areaLayerData) {
      return;
    }

    const { operation, current, previous } = areaLayerData;

    if (operation === UndoRedoOperations.UNDO) {
      // 追加
      if (previous && previous.operation === ShapeOperations.ADD) {
        removeChild(previous.present as ShapeData[]);
      }

      // 変更
      if (previous && previous.operation === ShapeOperations.CHANGE) {
        changeChild(previous.past as ShapeData[]);
      }

      // 削除
      if (previous && previous.operation === ShapeOperations.REMOVE) {
        addChild(previous.present as ShapeData[]);
      }
    } else {
      // 追加
      if (current.operation === ShapeOperations.ADD) {
        addChild(current.present as ShapeData[]);
      }

      // 変更
      if (current.operation === ShapeOperations.CHANGE) {
        changeChild(current.present as ShapeData[]);
      }

      // 削除
      if (current.operation === ShapeOperations.REMOVE) {
        removeChild(current.present as ShapeData[]);
      }
    }

    // ノード設定リスト更新
    dispatch(editorNodeModule.actions.updateChangeNodeList());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areaLayerData]);

  useEffect(() => {
    if (!layerRef.current) {
      return;
    }

    layerRef.current.children?.forEach((node: any) => {
      // エリア以外は除外
      if (node.config.shape !== SideMenuTypes.AREA) {
        return;
      }

      // 上書きプロパティの作成
      const overrideConfig: any = {};

      if (
        node.config.hasOwnProperty(
          editorConstants.SHAPE_PROP_NAME_LATTICE_WIDTH,
        )
      ) {
        overrideConfig.latticeWidth = latticeWidth;
      }

      if (
        node.config.hasOwnProperty(
          editorConstants.SHAPE_PROP_NAME_LATTICE_HEIGHT,
        )
      ) {
        overrideConfig.latticeHeight = latticeHeight;
      }

      // プロパティ更新
      node.config = {
        ...node.config,
        ...overrideConfig,
      };

      // 移動ポイントの位置をリセット
      node.resetAnchorPoint();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latticeWidth, latticeHeight]);

  return <Component layerRef={props.layerRef} visible={visibleAreaLayer} />;
};
