import { useEffect, useRef } from 'react';
import { Stage, Layer } from 'react-konva';
import Konva from 'konva';

import type { Meta, StoryObj } from '@storybook/react';

import {
  ShapeText,
  ShapeTextConfig,
} from '../../components/molecules/ShapeText';
import { SideMenuTypes } from '../../types';

const Text = (props: ShapeTextConfig) => {
  const layerRef = useRef<Konva.Layer>(null);

  useEffect(() => {
    if (!layerRef.current || layerRef.current.children.length === 0) {
      return;
    }
    layerRef.current.destroyChildren();

    layerRef.current.add(
      new ShapeText({
        ...props,
        uuid: '1',
        shape: SideMenuTypes.TEXT,
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
      new ShapeText({
        ...props,
        uuid: '1',
        shape: SideMenuTypes.TEXT,
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

const meta: Meta<typeof Text> = {
  component: Text,
  title: 'molecules/ShapeText',
  tags: ['autodocs'],
  argTypes: {
    fill: { control: 'color' },
  },
};
export default meta;

export const Default: StoryObj<typeof Text> = {
  render: (args) => {
    return <Text {...args} />;
  },
  args: {
    visible: true,
    x: 50,
    y: 50,
    text: 'Text',
    fontSize: 24,
    fill: 'rgba(0, 0, 0, 1)',
    fillRgb: { r: 0, g: 0, b: 0, a: 1 },
    fillTransparent: false,
    rotation: 0,
  },
};
