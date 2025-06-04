import { useEffect, useRef } from 'react';
import { Stage, Layer } from 'react-konva';
import Konva from 'konva';

import type { Meta, StoryObj } from '@storybook/react';

import { ShapeWc, ShapeWcConfig } from '../../components/molecules/ShapeWc';
import { SideMenuTypes } from '../../types';

const Wc = (props: ShapeWcConfig) => {
  const layerRef = useRef<Konva.Layer>(null);

  useEffect(() => {
    if (!layerRef.current || layerRef.current.children.length === 0) {
      return;
    }
    layerRef.current.destroyChildren();

    layerRef.current.add(
      new ShapeWc({
        ...props,
        uuid: '1',
        shape: SideMenuTypes.WC,
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
      new ShapeWc({
        ...props,
        uuid: '1',
        shape: SideMenuTypes.WC,
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

const meta: Meta<typeof Wc> = {
  component: Wc,
  title: 'molecules/ShapeWc',
  tags: ['autodocs'],
  argTypes: {},
};
export default meta;

export const Default: StoryObj<typeof Wc> = {
  render: (args) => {
    return <Wc {...args} />;
  },
  args: {
    visible: true,
    x: 50,
    y: 50,
    rotation: 0,
  },
};
