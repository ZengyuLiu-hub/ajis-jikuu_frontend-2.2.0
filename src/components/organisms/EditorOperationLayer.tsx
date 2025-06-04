import Konva from 'konva';
import { Layer } from 'react-konva';

import { EditorSelector, EditorTransformer } from '../../containers/organisms';

interface Props {
  layerRef: any;
  selectionRectangleRef: any;
  transformerRef: any;
  onLayerClick(e: Konva.KonvaEventObject<MouseEvent>): void;
  onLayerMouseDown(e: Konva.KonvaEventObject<MouseEvent>): void;
  onLayerMouseMove(e: Konva.KonvaEventObject<MouseEvent>): void;
  onLayerMouseUp(e: Konva.KonvaEventObject<MouseEvent>): void;
}

/**
 * 操作レイヤー
 */
export const EditorOperationLayer = (props: Props) => {
  return (
    <Layer
      ref={props.layerRef}
      id="operationLayer"
      onClick={props.onLayerClick}
      onMouseDown={props.onLayerMouseDown}
      onMouseMove={props.onLayerMouseMove}
      onMouseUp={props.onLayerMouseUp}
    >
      <EditorSelector
        selectorRef={props.selectionRectangleRef}
        id="selectionRectangle"
      />
      <EditorTransformer
        transformerRef={props.transformerRef}
        id="transformer"
      />
    </Layer>
  );
};
