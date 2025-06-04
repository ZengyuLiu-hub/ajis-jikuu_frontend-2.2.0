import { useEffect, useRef } from 'react';
import { Stage, Layer } from 'react-konva';
import Konva from 'konva';

import type { Meta, StoryObj } from '@storybook/react';

import {
  ShapeLine,
  ShapeLineConfig,
} from '../../components/molecules/ShapeLine';
import { SideMenuTypes } from '../../types';

const Line = (props: ShapeLineConfig) => {
  const layerRef = useRef<Konva.Layer>(null);

  useEffect(() => {
    if (!layerRef.current || layerRef.current.children.length === 0) {
      return;
    }
    layerRef.current.destroyChildren();

    layerRef.current.add(
      new ShapeLine({
        ...props,
        uuid: '1',
        shape: SideMenuTypes.LINE,
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
      new ShapeLine({
        ...props,
        uuid: '1',
        shape: SideMenuTypes.LINE,
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

const meta: Meta<typeof Line> = {
  component: Line,
  title: 'molecules/ShapeLine',
  tags: ['autodocs'],
  argTypes: {
    stroke: { control: 'color' },
  },
};
export default meta;

export const Default: StoryObj<typeof Line> = {
  render: (args) => {
    return <Line {...args} />;
  },
  args: {
    visible: true,
    x: 50,
    y: 50,
    stroke: 'rgba(0, 0, 0, 1)',
    strokeRgb: { r: 0, g: 0, b: 0, a: 1 },
    strokeTransparent: false,
    strokeWidth: 1,
    strokeDash: false,
    rotation: 0,
    points: [
      [0, 0],
      [300, 0],
    ],
  },
};
