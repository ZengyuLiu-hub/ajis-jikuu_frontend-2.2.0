import Konva from 'konva';
import { Transformer } from 'react-konva';

interface Props {
  transformerRef: React.RefObject<Konva.Transformer>;
  nodes: any[];
  visible: boolean;
}

/**
 * マップビューア：変形
 */
export const ViewerTransformer = (props: Props) => {
  return (
    <Transformer
      ref={props.transformerRef}
      id="transformer"
      anchorCornerRadius={4}
      ignoreStroke={true}
      shouldOverdrawWholeArea={false}
      resizeEnabled={false}
      rotateEnabled={false}
      borderStroke="rgb(12 32 228)"
      borderStrokeWidth={3}
      nodes={props.nodes}
      visible={props.visible}
    />
  );
};
