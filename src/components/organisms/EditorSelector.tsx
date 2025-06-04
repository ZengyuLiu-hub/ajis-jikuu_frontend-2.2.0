import { Rect } from 'react-konva';

interface Props {
  selectorRef: any;
  id: string;
}

export const EditorSelector = (props: Props) => {
  return (
    <Rect
      ref={props.selectorRef}
      id={props.id}
      listening={false}
      perfectDrawEnabled={false}
      strokeScaleEnabled={false}
      stroke="rgba(81, 130, 245, 0.3)"
      strokeWidth={1}
      fill="rgba(81, 130, 245, 0.1)"
      visible={false}
      scaleX={1}
      scaleY={1}
      x={0}
      y={0}
      width={0}
      height={0}
    />
  );
};
