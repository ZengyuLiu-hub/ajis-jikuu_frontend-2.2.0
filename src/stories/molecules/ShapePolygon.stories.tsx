import { useEffect, useRef } from 'react';
import { Stage, Layer } from 'react-konva';
import Konva from 'konva';

import type { Meta, StoryObj } from '@storybook/react';

import {
  ShapePolygon,
  ShapePolygonConfig,
} from '../../components/molecules/ShapePolygon';
import { SideMenuTypes } from '../../types';

const Polygon = (props: ShapePolygonConfig) => {
  const layerRef = useRef<Konva.Layer>(null);

  useEffect(() => {
    if (!layerRef.current || layerRef.current.children.length === 0) {
      return;
    }
    layerRef.current.destroyChildren();

    layerRef.current.add(
      new ShapePolygon({
        ...props,
        uuid: '1',
        shape: SideMenuTypes.POLYGON,
        closed: true,
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
      new ShapePolygon({
        ...props,
        uuid: '1',
        shape: SideMenuTypes.POLYGON,
        closed: true,
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

const meta: Meta<typeof Polygon> = {
  component: Polygon,
  title: 'molecules/ShapePolygon',
  tags: ['autodocs'],
  argTypes: {
    stroke: { control: 'color' },
    fill: { control: 'color' },
  },
};
export default meta;

export const Default: StoryObj<typeof Polygon> = {
  render: (args) => {
    return <Polygon {...args} />;
  },
  args: {
    visible: true,
    x: 300,
    y: 100,
    stroke: 'rgba(0, 0, 0, 1)',
    strokeRgb: { r: 0, g: 0, b: 0, a: 1 },
    strokeTransparent: false,
    strokeWidth: 1,
    fill: 'rgba(255, 255, 255, 1)',
    fillRgb: { r: 255, g: 255, b: 255, a: 1 },
    fillTransparent: false,
    rotation: 0,
    points: [
      [0, 0],
      [30, 50],
      [125, 60],
      [50, 100],
      [90, 200],
      [0, 140],
      [-90, 200],
      [-50, 100],
      [-125, 60],
      [-30, 50],
      [0, 0],
    ],
    alwaysShowAnchorPoint: false,
    onChangeAnchorPoint: () => {},
  },
};
