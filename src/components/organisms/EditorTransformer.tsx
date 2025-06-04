import Konva from 'konva';
import { Transformer } from 'react-konva';
import { Box } from 'konva/lib/shapes/Transformer';

interface Props {
  transformerRef: any;
  id: string;
  nodes: any[];
  visible: boolean;
  latticeWidth: number;
  latticeHeight: number;
  onMouseEnter(e: Konva.KonvaEventObject<MouseEvent>): void;
  onMouseLeave(e: Konva.KonvaEventObject<MouseEvent>): void;
  onDragStart(e: Konva.KonvaEventObject<DragEvent>): void;
  onDragMove(e: Konva.KonvaEventObject<DragEvent>): void;
  onDragEnd(e: Konva.KonvaEventObject<DragEvent>): void;
  onTransformStart(e: Konva.KonvaEventObject<Event>): void;
  onTransform(e: Konva.KonvaEventObject<Event>): void;
  onTransformEnd(e: Konva.KonvaEventObject<Event>): void;
}

/**
 * マップエディタ：変形
 */
export const EditorTransformer = (props: Props) => {
  const { latticeWidth, latticeHeight } = props;

  const handleTransformerBoundBoxFunc = (oldBox: Box, newBox: Box): Box => {
    // 縮小された幅または高さが格子サイズより小さくならないように制限
    const boundsWidth = newBox.width - oldBox.width !== 0;
    const boundsHeight = newBox.height - oldBox.height !== 0;
    if (
      (boundsWidth && newBox.width < latticeWidth) ||
      (boundsHeight && newBox.height < latticeHeight)
    ) {
      return oldBox;
    }
    return newBox;
  };

  return (
    <Transformer
      ref={props.transformerRef}
      id={props.id}
      anchorCornerRadius={4}
      ignoreStroke={true}
      shouldOverdrawWholeArea={true}
      rotateAnchorOffset={30}
      rotationSnaps={[0, 45, 90, 135, 180]}
      nodes={props.nodes}
      visible={props.visible}
      boundBoxFunc={handleTransformerBoundBoxFunc}
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
      onDragStart={props.onDragStart}
      onDragMove={props.onDragMove}
      onDragEnd={props.onDragEnd}
      onTransformStart={props.onTransformStart}
      onTransform={props.onTransform}
      onTransformEnd={props.onTransformEnd}
    />
  );
};
