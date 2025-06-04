import React, { useState, useEffect } from 'react';

import {
  useStageScale,
  useLatticeHeight,
  useStageHeight,
  useEnabledRulers,
} from '../../selectors';

import { EditorRulerY as Component } from '../../components/organisms';

interface Props {
  containerRef: any;
}

const RulerY = (props: Props) => {
  const [scales, setScales] = useState<any[]>([]);

  const stageScale = useStageScale();
  const stageHeight = useStageHeight();
  const latticeSize = useLatticeHeight();
  const enabledRulers = useEnabledRulers();

  const generateScale = (
    height: number,
    scale: number,
    latticeSize: number
  ) => {
    const large = Math.ceil(height / latticeSize);

    const newScales = [];
    for (let i = 0; i < large; i++) {
      newScales.push({
        text: scale > 30 || i % 5 === 0 ? `${i * 10}` : '',
      });
    }
    setScales(newScales);
  };

  useEffect(() => {
    generateScale(stageHeight, stageScale, latticeSize);
  }, [stageHeight, stageScale, latticeSize]);

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

export const EditorRulerY = React.memo(RulerY);
