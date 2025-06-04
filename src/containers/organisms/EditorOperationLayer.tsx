import React, { useRef, useState, useEffect } from 'react';
import Konva from 'konva';
import { useTranslation } from 'react-i18next';

import * as editorConstants from '../../constants/editor';
import { DialogTypes, SideMenuTypes } from '../../types';
import { useAppDispatch } from '../../app/hooks';

import { appModule, editorNodeModule } from '../../modules';
import {
  useSelectedNodeIds,
  useDragging,
  useTransforming,
  usePressKeyControl,
} from '../../selectors';

import { EditorOperationLayer as Component } from '../../components/organisms';

interface Props {
  layerRef: React.RefObject<Konva.Layer>;
  transformerRef: React.RefObject<Konva.Transformer>;
}

/**
 * 操作レイヤー
 */
export const EditorOperationLayer = (props: Props) => {
  const { layerRef, transformerRef } = props;

  const [t] = useTranslation();

  const dispatch = useAppDispatch();

  const selectedNodeIds = useSelectedNodeIds();

  const dragging = useDragging();
  const transforming = useTransforming();
  const pressKeyControl = usePressKeyControl();

  type SelectionPosition = {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  };

  const selectionRectangle = useRef<Konva.Rect>(null);

  const [selectionPosition, setSelectionPosition] = useState<SelectionPosition>(
    { x1: 0, y1: 0, x2: 0, y2: 0 },
  );

  const handleLayerClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (!layerRef.current || selectionRectangle.current?.visible()) {
      return;
    }

    if (!e.evt || e.evt.target instanceof Konva.Stage) {
      dispatch(editorNodeModule.actions.updateSelectedNodeIds([]));
      return;
    }
    const target: any = e.evt.target;

    if (!target.parent || !target.parent.attrs) {
      return;
    }
    const uuid = target.parent.attrs.uuid;

    const isSelected = selectedNodeIds.includes(uuid);
    if (!pressKeyControl && !isSelected) {
      // 未選択シェイプ
      dispatch(editorNodeModule.actions.updateSelectedNodeIds([uuid]));
    } else if (pressKeyControl && isSelected) {
      // Ctrl + 選択済みシェイプ
      dispatch(editorNodeModule.actions.excludeSelectedNodeIds([uuid]));
    } else if (pressKeyControl && !isSelected) {
      // Ctrl + 未選択シェイプ
      dispatch(editorNodeModule.actions.addSelectedNodeIds([uuid]));
    }
  };

  const handleLayerMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (!selectionRectangle.current || selectionRectangle.current.visible()) {
      return;
    }
    const stage = e.target.getStage();
    stage?.preventDefault();

    const event: any = e.evt;
    const targetNode: any = !!event.target.attrs ? event.target : e.target;
    const parent: any = targetNode.parent;

    if (
      parent === transformerRef.current ||
      (targetNode instanceof Konva.Rect &&
        (parent.attrs.config.shape === SideMenuTypes.POLYGON ||
          parent.attrs.config.shape === SideMenuTypes.AREA))
    ) {
      return;
    }

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

  const handleLayerMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (
      transforming ||
      !selectionRectangle.current ||
      !selectionRectangle.current.visible()
    ) {
      return;
    }
    const stage = e.target.getStage();
    stage?.preventDefault();

    if (dragging) {
      // 選択範囲リセット
      selectionRectangle.current.setAttrs({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        visible: false,
      });
      return;
    }
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
      return;
    }
    const stage = e.target.getStage();
    stage?.preventDefault();

    setTimeout(() => {
      selectionRectangle.current?.visible(false);
    });

    const box = selectionRectangle.current.getClientRect();
    const mapLayer = stage?.getLayers().find((d) => d.id() === 'mapLayer');
    const nodes: any[] =
      mapLayer?.children?.filter((node: any) =>
        Konva.Util.haveIntersection(box, node.getClientRect()),
      ) ?? [];

    if (nodes.length > 0) {
      const ids = nodes
        .sort((a, b) =>
          a.config.locationNum < b.config.locationNum
            ? -1
            : a.config.locationNum > b.config.locationNum
              ? 1
              : 0,
        )
        .map((node: any) => node.uuid);

      // 選択数が上限に達している場合はエラー表示
      if (ids.length > editorConstants.MAX_SELECTION_SHAPES) {
        dispatch(
          appModule.actions.updateAlertDialog({
            type: DialogTypes.ERROR,
            message: t(
              'organisms:EditorOperationLayer.message.maxSelectionShapes',
              {
                maxSelectionShapes: editorConstants.MAX_SELECTION_SHAPES,
              },
            ),
          }),
        );

        // 選択数を規定数に変更
        dispatch(
          editorNodeModule.actions.updateSelectedNodeIds(
            ids.slice(0, editorConstants.MAX_SELECTION_SHAPES),
          ),
        );
      } else {
        dispatch(editorNodeModule.actions.updateSelectedNodeIds(ids));
      }
    }

    // 選択範囲リセット
    selectionRectangle.current.setAttrs({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      visible: false,
    });
  };

  useEffect(() => {
    // 選択範囲リセット
    if (dragging && selectionRectangle.current?.visible()) {
      selectionRectangle.current.setAttrs({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        visible: false,
      });
    }
  }, [dragging]);

  return (
    <Component
      layerRef={layerRef}
      selectionRectangleRef={selectionRectangle}
      transformerRef={transformerRef}
      onLayerClick={handleLayerClick}
      onLayerMouseDown={handleLayerMouseDown}
      onLayerMouseMove={handleLayerMouseMove}
      onLayerMouseUp={handleLayerMouseUp}
    />
  );
};
