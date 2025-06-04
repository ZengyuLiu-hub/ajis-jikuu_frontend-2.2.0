import { useEffect, useRef } from 'react';
import { Stage, Layer } from 'react-konva';
import Konva from 'konva';

import type { Meta, StoryObj } from '@storybook/react';

import {
  ShapeSpecial,
  ShapeSpecialConfig,
} from '../../components/molecules/ShapeSpecial';
import { Directions, SideMenuTypes } from '../../types';

const Special = (props: ShapeSpecialConfig) => {
  const layerRef = useRef<Konva.Layer>(null);

  useEffect(() => {
    if (!layerRef.current || layerRef.current.children.length === 0) {
      return;
    }
    layerRef.current.destroyChildren();

    layerRef.current.add(
      new ShapeSpecial({
        ...props,
        uuid: '1',
        shape: SideMenuTypes.SPECIAL_SHAPE,
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
      new ShapeSpecial({
        ...props,
        uuid: '1',
        shape: SideMenuTypes.SPECIAL_SHAPE,
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

const meta: Meta<typeof Special> = {
  component: Special,
  title: 'molecules/ShapeSpecial',
  tags: ['autodocs'],
  argTypes: {
    stroke: { control: 'color' },
    fill: { control: 'color' },
    direction: {
      control: 'select',
      options: [
        Directions.TOP,
        Directions.RIGHT,
        Directions.BOTTOM,
        Directions.LEFT,
      ],
    },
  },
};
export default meta;

const data = `M 0 0 H 120 V 30 H 30 V 120 H 0 L 0 0`;

export const Default: StoryObj<typeof Special> = {
  render: (args) => {
    return <Special {...args} />;
  },
  args: {
    visible: true,
    x: 50,
    y: 50,
    data,
    direction: Directions.TOP,
    width: 20,
    depth: 20,
    tableTopDepth: 20,
    stroke: 'rgba(0, 0, 0, 1)',
    strokeRgb: { r: 0, g: 0, b: 0, a: 1 },
    strokeTransparent: false,
    strokeWidth: 1,
    strokeDash: false,
    fill: 'rgba(255, 255, 255, 1)',
    fillRgb: { r: 255, g: 255, b: 255, a: 1 },
    fillTransparent: false,
    rotation: 0,
  },
};
