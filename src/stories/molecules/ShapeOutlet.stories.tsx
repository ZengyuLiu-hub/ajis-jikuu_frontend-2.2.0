import { useEffect, useRef } from 'react';
import { Stage, Layer } from 'react-konva';
import Konva from 'konva';

import type { Meta, StoryObj } from '@storybook/react';

import {
  ShapeOutlet,
  ShapeOutletConfig,
} from '../../components/molecules/ShapeOutlet';
import { SideMenuTypes } from '../../types';

const Outlet = (props: ShapeOutletConfig) => {
  const layerRef = useRef<Konva.Layer>(null);

  useEffect(() => {
    if (!layerRef.current || layerRef.current.children.length === 0) {
      return;
    }
    layerRef.current.destroyChildren();

    layerRef.current.add(
      new ShapeOutlet({
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
      new ShapeOutlet({
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

const meta: Meta<typeof Outlet> = {
  component: Outlet,
  title: 'molecules/ShapeOutlet',
  tags: ['autodocs'],
  argTypes: {},
};
export default meta;

export const Default: StoryObj<typeof Outlet> = {
  render: (args) => {
    return <Outlet {...args} />;
  },
  args: {
    visible: true,
    x: 50,
    y: 50,
    rotation: 0,
  },
};
