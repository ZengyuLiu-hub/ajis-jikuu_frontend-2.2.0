import { useEffect, useRef } from 'react';
import { Stage, Layer } from 'react-konva';
import Konva from 'konva';

import type { Meta, StoryObj } from '@storybook/react';

import { ShapePen, ShapePenConfig } from '../../components/molecules/ShapePen';
import { SideMenuTypes } from '../../types';

const Pen = (props: ShapePenConfig) => {
  const layerRef = useRef<Konva.Layer>(null);

  useEffect(() => {
    if (!layerRef.current || layerRef.current.children.length === 0) {
      return;
    }
    layerRef.current.destroyChildren();

    layerRef.current.add(
      new ShapePen({
        ...props,
        uuid: '1',
        shape: SideMenuTypes.PEN,
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
      new ShapePen({
        ...props,
        uuid: '1',
        shape: SideMenuTypes.PEN,
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

const meta: Meta<typeof Pen> = {
  component: Pen,
  title: 'molecules/ShapePen',
  tags: ['autodocs'],
  argTypes: {
    stroke: { control: 'color' },
  },
};
export default meta;

export const Default: StoryObj<typeof Pen> = {
  render: (args) => {
    return <Pen {...args} />;
  },
  args: {
    visible: true,
    x: 50,
    y: 50,
    stroke: 'rgba(223, 75, 38, 1)',
    strokeRgb: { r: 223, g: 75, b: 38, a: 1 },
    strokeTransparent: false,
    strokeWidth: 5,
    rotation: 0,
    tension: 0.5,
    lineCap: 'round',
    globalCompositeOperation: 'source-over',
    points: [
      [0, 0],
      [0, 0],
      [0, 0],
      [0, 0],
      [0, -5],
      [0, -5],
      [0, -5],
      [5, -10],
      [5, -10],
      [5, -15],
      [5, -15],
      [10, -15],
      [15, -15],
      [20, -15],
      [25, -20],
      [30, -20],
      [40, -20],
      [45, -20],
      [50, -20],
      [60, -15],
      [65, -15],
      [70, -15],
      [75, -15],
      [75, -15],
      [80, -15],
      [80, -15],
      [80, -10],
      [80, -10],
      [80, -10],
      [80, -10],
      [80, -10],
      [80, -5],
      [80, -5],
      [75, 0],
      [75, 5],
      [70, 10],
      [70, 15],
      [65, 20],
      [60, 25],
      [55, 30],
      [50, 30],
      [45, 30],
      [40, 30],
      [35, 35],
      [35, 35],
      [30, 30],
      [30, 30],
      [25, 30],
      [25, 25],
      [20, 25],
      [20, 20],
      [20, 15],
      [15, 15],
      [15, 15],
      [15, 10],
      [15, 10],
      [15, 5],
      [15, 5],
      [15, 0],
      [15, 0],
      [15, -5],
      [20, -5],
      [25, -10],
      [25, -20],
      [30, -20],
      [35, -25],
      [40, -30],
      [40, -35],
      [45, -35],
      [50, -40],
      [50, -40],
      [55, -45],
      [55, -45],
      [60, -45],
      [60, -45],
      [65, -45],
      [65, -45],
      [70, -45],
      [75, -45],
      [75, -45],
      [80, -40],
      [85, -40],
      [90, -40],
      [90, -40],
      [95, -40],
      [95, -35],
      [95, -35],
      [95, -35],
      [95, -35],
      [100, -35],
      [100, -35],
      [100, -35],
      [100, -35],
      [100, -35],
      [100, -35],
      [100, -35],
      [100, -35],
      [100, -35],
      [100, -35],
      [100, -35],
      [100, -35],
      [100, -35],
      [100, -35],
      [100, -35],
      [100, -35],
      [100, -35],
      [105, -35],
      [105, -35],
      [105, -35],
      [105, -35],
    ],
  },
};
