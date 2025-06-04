import React, { useState, useEffect } from 'react';

import {
  useStageScale,
  useStageWidth,
  useLatticeWidth,
  useEnabledRulers,
} from '../../selectors';

import { EditorRulerX as Component } from '../../components/organisms';

interface Props {
  containerRef: any;
}

const RulerX = (props: Props) => {
  const [scales, setScales] = useState<any[]>([]);

  const stageScale = useStageScale();
  const stageWidth = useStageWidth();
  const latticeSize = useLatticeWidth();
  const enabledRulers = useEnabledRulers();

  const generateScale = (width: number, scale: number, latticeSize: number) => {
    const large = Math.ceil(width / latticeSize);

    const newScales = [];
    for (let i = 0; i < large; i++) {
      newScales.push({
        text: scale > 30 || i % 5 === 0 ? `${i * 10}` : '',
      });
    }
    setScales(newScales);
  };

  useEffect(() => {
    generateScale(stageWidth, stageScale, latticeSize);
  }, [stageWidth, stageScale, latticeSize]);

  return (
    <Component
      containerRef={props.containerRef}
      latticeSize={latticeSize}
      stageScale={stageScale}
      scales={scales}
      visible={enabledRulers}
    />
  );
};

export const EditorRulerX = React.memo(RulerX);
