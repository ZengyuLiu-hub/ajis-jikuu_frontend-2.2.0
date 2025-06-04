import * as ReactKonva from 'react-konva';

interface Props {
  layerRef: any;
  visible: boolean;
}

/**
 * エリアレイヤー
 */
export const EditorAreaLayer = (props: Props) => {
  return (
    <ReactKonva.Layer
      ref={props.layerRef}
      id="areaLayer"
      visible={props.visible}
    />
  );
};
