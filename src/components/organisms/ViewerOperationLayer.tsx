import Konva from 'konva';
import { Layer } from 'react-konva';

import { ViewerSelector, ViewerTransformer } from '../../containers/organisms';

interface Props {
  layerRef: React.RefObject<Konva.Layer>;
  selectionRectangleRef: React.RefObject<Konva.Rect>;
  transformerRef: React.RefObject<Konva.Transformer>;
  onLayerClick(e: Konva.KonvaEventObject<MouseEvent>): void;
  onLayerMouseDown(e: Konva.KonvaEventObject<MouseEvent>): void;
  onLayerMouseMove(e: Konva.KonvaEventObject<MouseEvent>): void;
  onLayerMouseUp(e: Konva.KonvaEventObject<MouseEvent>): void;
}

/**
 * マップビューア：操作レイヤー
 */
export const ViewerOperationLayer = (props: Props) => {
  return (
    <Layer
      ref={props.layerRef}
      id="operationLayer"
      onClick={props.onLayerClick}
      onMouseDown={props.onLayerMouseDown}
      onMouseMove={props.onLayerMouseMove}
      onMouseUp={props.onLayerMouseUp}
    >
      <ViewerTransformer transformerRef={props.transformerRef} />
      <ViewerSelector
        selectorRef={props.selectionRectangleRef}
        id="selectionRectangle"
      />
    </Layer>
  );
};
