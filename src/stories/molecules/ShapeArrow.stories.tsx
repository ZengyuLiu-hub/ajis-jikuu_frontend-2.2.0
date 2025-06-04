import { useEffect, useRef } from 'react';
import { Stage, Layer } from 'react-konva';
import Konva from 'konva';

import type { Meta, StoryObj } from '@storybook/react';

import {
  ShapeArrow,
  ShapeArrowConfig,
} from '../../components/molecules/ShapeArrow';
import { SideMenuTypes } from '../../types';

const Arrow = (props: ShapeArrowConfig) => {
  const layerRef = useRef<Konva.Layer>(null);

  useEffect(() => {
    if (!layerRef.current || layerRef.current.children.length === 0) {
      return;
    }
    layerRef.current.destroyChildren();

    layerRef.current.add(
      new ShapeArrow({
        ...props,
        uuid: '1',
        shape: SideMenuTypes.ARROW1,
        selectable: true,
        disabled: false,
      }),
    );
  }, [props]);

  useEffect(() => {
    if (!layerRef.current) {
      return;
    }
    layerRef.current.add(
      new ShapeArrow({
        ...props,
        uuid: '1',
        shape: SideMenuTypes.ARROW1,
        selectable: true,
        disabled: false,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Stage width={window.innerWidth} height={600}>
      <Layer ref={layerRef}></Layer>
    </Stage>
  );
};

const meta: Meta<typeof Arrow> = {
  component: Arrow,
  title: 'molecules/ShapeArrow',
  tags: ['autodocs'],
  argTypes: {
    stroke: { control: 'color' },
  },
};
export default meta;

export const Default: StoryObj<typeof Arrow> = {
  render: (args) => {
    return <Arrow {...args} />;
  },
  args: {
    visible: true,
    x: 50,
    y: 50,
    stroke: 'rgba(0, 0, 0, 1)',
    strokeRgb: { r: 0, g: 0, b: 0, a: 1 },
    strokeTransparent: false,
    strokeWidth: 9,
    rotation: 0,
    points: [0, 0, 100, 0],
    pointerLength: 4,
    pointerWidth: 5,
    pointerAtBeginning: false,
    pointerAtEnding: true,
  },
};
