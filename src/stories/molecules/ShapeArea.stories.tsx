import { useEffect, useRef } from 'react';
import { Stage, Layer } from 'react-konva';
import Konva from 'konva';

import type { Meta, StoryObj } from '@storybook/react';

import {
  ShapeArea,
  ShapeAreaConfig,
} from '../../components/molecules/ShapeArea';
import { SideMenuTypes } from '../../types';

const Area = (props: ShapeAreaConfig) => {
  const layerRef = useRef<Konva.Layer>(null);

  useEffect(() => {
    if (!layerRef.current || layerRef.current.children.length === 0) {
      return;
    }
    layerRef.current.destroyChildren();

    layerRef.current.add(
      new ShapeArea({
        ...props,
        uuid: '1',
        shape: SideMenuTypes.AREA,
        closed: true,
        selectable: true,
        disabled: false,
        onChangeAnchorPoint: () => {},
      }),
    );
  }, [props]);

  useEffect(() => {
    if (!layerRef.current) {
      return;
    }
    layerRef.current.add(
      new ShapeArea({
        ...props,
        uuid: '1',
        shape: SideMenuTypes.AREA,
        closed: true,
        selectable: true,
        disabled: false,
        onChangeAnchorPoint: () => {},
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

const meta: Meta<typeof Area> = {
  component: Area,
  title: 'molecules/ShapeArea',
  tags: ['autodocs'],
  argTypes: {
    stroke: { control: 'color' },
    fill: { control: 'color' },
  },
};
export default meta;

export const Default: StoryObj<typeof Area> = {
  render: (args) => {
    return <Area {...args} />;
  },
  args: {
    visible: true,
    x: 50,
    y: 50,
    text: 'Area',
    fill: 'rgba(255, 255, 255, 1)',
    fillRgb: { r: 255, g: 255, b: 255, a: 1 },
    fillTransparent: false,
    rotation: 0,
    strokeDash: false,
    strokeWidth: 1,
    stroke: 'rgba(0, 0, 0, 1)',
    strokeRgb: { r: 0, g: 0, b: 0, a: 1 },
    strokeTransparent: false,
    points: [
      [0, 0],
      [200, 0],
      [200, 100],
      [0, 100],
      [0, 0],
    ],
  },
};
