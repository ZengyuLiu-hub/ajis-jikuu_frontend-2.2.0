import Konva from 'konva';
import { useMemo } from 'react';

import { useViewSelectedNodeList } from '../../selectors';

import { ViewerTransformer as Component } from '../../components/organisms';

interface Props {
  transformerRef: React.RefObject<Konva.Transformer>;
}

/**
 * マップビューア：変形
 */
export const ViewerTransformer = (props: Props) => {
  const selectedNodeList = useViewSelectedNodeList();

  // 選択ノードリスト
  const nodes = useMemo(() => selectedNodeList, [selectedNodeList]);

  return (
    <Component
      transformerRef={props.transformerRef}
      nodes={nodes}
      visible={selectedNodeList.length > 0}
    />
  );
};
