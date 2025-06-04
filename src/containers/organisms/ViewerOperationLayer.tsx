import Konva from 'konva';
import React, { useRef, useState } from 'react';

import * as editorConstants from '../../constants/editor';

import { useAppDispatch } from '../../app/hooks';

import { viewerNodeModule } from '../../modules';
import { useViewSelectedNodeIds } from '../../selectors';

import { ViewerOperationLayer as Component } from '../../components/organisms';

interface Props {
  layerRef: React.RefObject<Konva.Layer>;
  transformerRef: React.RefObject<Konva.Transformer>;
}

/**
 * マップビューア：操作レイヤー
 */
export const ViewerOperationLayer = (props: Props) => {
  const { layerRef } = props;

  const dispatch = useAppDispatch();

  const selectedNodeIds = useViewSelectedNodeIds();

  const selectionRectangle = useRef<Konva.Rect>(null);

  type SelectionPosition = {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  };

  const [selectionPosition, setSelectionPosition] = useState<SelectionPosition>(
    { x1: 0, y1: 0, x2: 0, y2: 0 },
  );

  /**
   * レイヤークリック.
   *
   * @param {Konva.KonvaEventObject<MouseEvent>} e マウスイベント
   */
  const handleLayerClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (!layerRef.current || selectionRectangle.current?.visible()) {
      return;
    }

    if (!e.evt || e.evt.target instanceof Konva.Stage) {
      dispatch(viewerNodeModule.actions.updateSelectedNodeIds([]));
      return;
    }
    const target: any = e.evt.target;

    if (!target.parent || !target.parent.attrs) {
      return;
    }

    const uuid = target.parent.attrs.uuid;
    if (!uuid) {
      dispatch(viewerNodeModule.actions.updateSelectedNodeIds([]));
    }

    // 未選択シェイプ
    if (!selectedNodeIds.includes(uuid)) {
      dispatch(viewerNodeModule.actions.updateSelectedNodeIds([uuid]));
    }
  };

  /**
   * レイヤーマウスダウン.
   *
   * @param {Konva.KonvaEventObject<MouseEvent>} e マウスイベント
   */
  const handleLayerMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (!selectionRectangle.current || selectionRectangle.current.visible()) {
      return;
    }
    const stage = e.target.getStage();
    stage?.preventDefault();

    const pointerPosition = e.target.getRelativePointerPosition() ?? {
      x: 0,
      y: 0,
    };

    const x1 = pointerPosition.x;
    const y1 = pointerPosition.y;

    setSelectionPosition({ x1, y1, x2: x1, y2: y1 });

    selectionRectangle.current.setAttrs({
      x: pointerPosition.x,
      y: pointerPosition.y,
      width: 0,
      height: 0,
      visible: true,
    });
  };

  /**
   * レイヤーマウス移動.
   *
   * @param {Konva.KonvaEventObject<MouseEvent>} e マウスイベント
   */
  const handleLayerMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (!selectionRectangle.current || !selectionRectangle.current.visible()) {
      return;
    }
    const stage = e.target.getStage();
    stage?.preventDefault();

    const pointerPosition = e.target.getRelativePointerPosition() ?? {
      x: 0,
      y: 0,
    };

    const x1 = selectionPosition.x1;
    const x2 = pointerPosition.x;
    const y1 = selectionPosition.y1;
    const y2 = pointerPosition.y;

    selectionRectangle.current.setAttrs({
      x: Math.min(x1, x2),
      y: Math.min(y1, y2),
      width: Math.abs(x2 - x1),
      height: Math.abs(y2 - y1),
    });
  };

  /**
   * レイヤーマウスアップ.
   *
   * @param {Konva.KonvaEventObject<MouseEvent>} e マウスイベント
   */
  const handleLayerMouseUp = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (
      !selectionRectangle.current ||
      !selectionRectangle.current?.visible() ||
      (selectionRectangle.current.x() === 0 &&
        selectionRectangle.current.y() === 0) ||
      (selectionRectangle.current.width() === 0 &&
        selectionRectangle.current.height() === 0)
    ) {
      selectionRectangle.current?.visible(false);
      dispatch(viewerNodeModule.actions.updateSelectedNodeIds([]));
      return;
    }
    const stage = e.target.getStage();
    stage?.preventDefault();

    // 選択範囲のシェイプを取得
    const box = selectionRectangle.current.getClientRect();
    const mapLayer = stage?.getLayers().find((d) => d.id() === 'mapLayer');
    const nodes: any[] =
      mapLayer?.children?.filter((node: any) =>
        Konva.Util.haveIntersection(box, node.getClientRect()),
      ) ?? [];

    // 選択対象の UUID を取得（ロケーション以外を除外）
    const ids = nodes
      .filter((node) =>
        node.config.hasOwnProperty(
          editorConstants.SHAPE_PROP_NAME_LOCATION_NUM,
        ),
      )
      .sort((a, b) =>
        a.config.locationNum < b.config.locationNum
          ? -1
          : a.config.locationNum > b.config.locationNum
            ? 1
            : 0,
      )
      .map((node: any) => node.config.uuid);

    // 選択ノード更新指示
    dispatch(viewerNodeModule.actions.updateSelectedNodeIds(ids));

    // 選択範囲リセット
    selectionRectangle.current.setAttrs({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      visible: false,
    });
  };

  return (
    <Component
      layerRef={layerRef}
      selectionRectangleRef={selectionRectangle}
      transformerRef={props.transformerRef}
      onLayerClick={handleLayerClick}
      onLayerMouseDown={handleLayerMouseDown}
      onLayerMouseMove={handleLayerMouseMove}
      onLayerMouseUp={handleLayerMouseUp}
    />
  );
};
