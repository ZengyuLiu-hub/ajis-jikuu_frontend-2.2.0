import Konva from 'konva';
import * as ReactKonva from 'react-konva';

interface Props {
  layerRef: React.RefObject<Konva.Layer>;
  visible: boolean;
}

/**
 * マップビューア：マップレイヤー
 */
export const ViewerMapLayer = (props: Props) => {
  return (
    <ReactKonva.Layer
      ref={props.layerRef}
      id="mapLayer"
      visible={props.visible}
    />
  );
};
