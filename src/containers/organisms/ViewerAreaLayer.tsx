import Konva from 'konva';
import { useEffect } from 'react';

import { useAppDispatch } from '../../app/hooks';
import { ShapeData, ShapeOperations, SideMenuTypes } from '../../types';

import { viewerNodeModule } from '../../modules';
import {
  useLineDrawing,
  useViewAreaLayerData,
  useViewLatticeHeight,
  useViewLatticeWidth,
  useVisibleAreaLayer
} from '../../selectors';

import { ShapeArea } from '../../components/molecules/ShapeArea';
import { ViewerAreaLayer as Component } from '../../components/organisms';

interface Props {
  layerRef: React.RefObject<Konva.Layer>;
}

/**
 * マップビューア：エリアレイヤー
 */
export const ViewerAreaLayer = (props: Props) => {
  const { layerRef } = props;

  const dispatch = useAppDispatch();

  const areaLayerData = useViewAreaLayerData();
  const visibleAreaLayer = useVisibleAreaLayer();

  const latticeWidth = useViewLatticeWidth();
  const latticeHeight = useViewLatticeHeight();
  const isLineDrawing = useLineDrawing();

  const addChild = (data: ShapeData[]) => {
    const additionalConfig = { readOnly: true };

    data?.forEach((d) => {
      // エリア以外は除外
      if (d.config.shape !== SideMenuTypes.AREA) {
        return;
      }

      layerRef.current?.add(
        new ShapeArea({
          ...d.config,
          ...additionalConfig,
          id: d.config.uuid,
          perfectDrawEnabled: false,
          strokeScaleEnabled: false,
          isLineDrawing,
          latticeWidth,
          latticeHeight,
          onChangeAnchorPoint: (data) => {},
        })
      );
    });
  };

  useEffect(() => {
    if (!layerRef.current || !areaLayerData) {
      return;
    }

    const { current } = areaLayerData;

    // 追加
    if (current.operation === ShapeOperations.ADD) {
      addChild(current.present as ShapeData[]);
    }

    // ノード設定リスト更新
    dispatch(viewerNodeModule.actions.updateChangeNodeList());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areaLayerData]);

  return <Component layerRef={layerRef} visible={visibleAreaLayer} />;
};
