import * as ReactKonva from 'react-konva';

interface Props {
  layerRef: any;
  visible: boolean;
}

/**
 * 編集レイヤー
 */
export const EditorEditLayer = (props: Props) => {
  return (
    <ReactKonva.Layer
      ref={props.layerRef}
      id="editLayer"
      visible={props.visible}
    />
  );
};
