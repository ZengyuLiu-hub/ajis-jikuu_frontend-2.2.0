import * as ReactKonva from 'react-konva';

interface Props {
  layerRef: any;
  visible: boolean;
}

/**
 * マップレイヤー
 */
export const EditorMapLayer = (props: Props) => {
  return (
    <ReactKonva.Layer
      ref={props.layerRef}
      id="mapLayer"
      visible={props.visible}
    />
  );
};
