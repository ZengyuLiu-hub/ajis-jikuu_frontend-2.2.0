import { useEffect, useRef } from 'react';
import { Stage, Layer } from 'react-konva';
import Konva from 'konva';

import type { Meta, StoryObj } from '@storybook/react';

import {
  ShapeCircleArrow,
  ShapeCircleArrowConfig,
} from '../../components/molecules/ShapeCircleArrow';
import { SideMenuTypes } from '../../types';

const CircleArrow = (props: ShapeCircleArrowConfig) => {
  const layerRef = useRef<Konva.Layer>(null);

  useEffect(() => {
    if (!layerRef.current || layerRef.current.children.length === 0) {
      return;
    }
    layerRef.current.destroyChildren();

    layerRef.current.add(
      new ShapeCircleArrow({
        ...props,
        uuid: '1',
        shape: SideMenuTypes.CIRCLE_ARROW,
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
      new ShapeCircleArrow({
        ...props,
        uuid: '1',
        shape: SideMenuTypes.CIRCLE_ARROW,
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

const meta: Meta<typeof CircleArrow> = {
  component: CircleArrow,
  title: 'molecules/ShapeCircleArrow',
  tags: ['autodocs'],
  argTypes: {},
};
export default meta;

export const Default: StoryObj<typeof CircleArrow> = {
  render: (args) => {
    return <CircleArrow {...args} />;
  },
  args: {
    visible: true,
    x: 50,
    y: 50,
    rotation: 0,
    flipHorizontal: false,
  },
};
