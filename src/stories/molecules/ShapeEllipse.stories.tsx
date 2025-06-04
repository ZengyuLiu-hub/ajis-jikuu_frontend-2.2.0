import { useEffect, useRef } from 'react';
import { Stage, Layer } from 'react-konva';
import Konva from 'konva';

import type { Meta, StoryObj } from '@storybook/react';

import {
  ShapeEllipse,
  ShapeEllipseConfig,
} from '../../components/molecules/ShapeEllipse';
import { SideMenuTypes } from '../../types';

const Ellipse = (props: ShapeEllipseConfig) => {
  const layerRef = useRef<Konva.Layer>(null);

  useEffect(() => {
    if (!layerRef.current || layerRef.current.children.length === 0) {
      return;
    }
    layerRef.current.destroyChildren();

    layerRef.current.add(
      new ShapeEllipse({
        ...props,
        uuid: '1',
        shape: SideMenuTypes.RECT,
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
      new ShapeEllipse({
        ...props,
        uuid: '1',
        shape: SideMenuTypes.RECT,
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

const meta: Meta<typeof Ellipse> = {
  component: Ellipse,
  title: 'molecules/ShapeEllipse',
  tags: ['autodocs'],
  argTypes: {
    stroke: { control: 'color' },
    fill: { control: 'color' },
  },
};
export default meta;

export const Default: StoryObj<typeof Ellipse> = {
  render: (args) => {
    return <Ellipse {...args} />;
  },
  args: {
    visible: true,
    x: 100,
    y: 100,
    text: 'Text',
    radiusX: 50,
    radiusY: 50,
    minRadiusX: 10,
    minRadiusY: 10,
    widthCells: 6,
    heightCells: 6,
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
