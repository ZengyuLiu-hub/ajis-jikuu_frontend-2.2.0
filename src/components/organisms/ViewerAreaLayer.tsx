import Konva from 'konva';
import * as ReactKonva from 'react-konva';

interface Props {
  layerRef: React.RefObject<Konva.Layer>;
  visible: boolean;
}

/**
 * マップビューア：エリアレイヤー
 */
export const ViewerAreaLayer = (props: Props) => {
  return (
    <ReactKonva.Layer
      ref={props.layerRef}
      id="areaLayer"
      visible={props.visible}
    />
  );
};
