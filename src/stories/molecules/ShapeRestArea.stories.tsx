import { useEffect, useRef } from 'react';
import { Stage, Layer } from 'react-konva';
import Konva from 'konva';

import type { Meta, StoryObj } from '@storybook/react';

import {
  ShapeRestArea,
  ShapeRestAreaConfig,
} from '../../components/molecules/ShapeRestArea';
import { SideMenuTypes } from '../../types';

const RestArea = (props: ShapeRestAreaConfig) => {
  const layerRef = useRef<Konva.Layer>(null);

  useEffect(() => {
    if (!layerRef.current || layerRef.current.children.length === 0) {
      return;
    }
    layerRef.current.destroyChildren();

    layerRef.current.add(
      new ShapeRestArea({
        ...props,
        uuid: '1',
        shape: SideMenuTypes.REST_AREA,
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
      new ShapeRestArea({
        ...props,
        uuid: '1',
        shape: SideMenuTypes.REST_AREA,
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

const meta: Meta<typeof RestArea> = {
  component: RestArea,
  title: 'molecules/ShapeRestArea',
  tags: ['autodocs'],
  argTypes: {},
};
export default meta;

export const Default: StoryObj<typeof RestArea> = {
  render: (args) => {
    return <RestArea {...args} />;
  },
  args: {
    visible: true,
    x: 50,
    y: 50,
    rotation: 0,
  },
};
