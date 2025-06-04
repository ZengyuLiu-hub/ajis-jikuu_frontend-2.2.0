import { useEffect, useRef } from 'react';
import { Stage, Layer } from 'react-konva';
import Konva from 'konva';

import type { Meta, StoryObj } from '@storybook/react';

import {
  ShapeRegister,
  ShapeRegisterConfig,
} from '../../components/molecules/ShapeRegister';
import { SideMenuTypes } from '../../types';
import { LocationTypes } from '../../components/molecules';

const Register = (props: ShapeRegisterConfig) => {
  const layerRef = useRef<Konva.Layer>(null);

  useEffect(() => {
    if (!layerRef.current || layerRef.current.children.length === 0) {
      return;
    }
    layerRef.current.destroyChildren();

    layerRef.current.add(
      new ShapeRegister({
        ...props,
        uuid: '1',
        shape: SideMenuTypes.REGISTER_TABLE,
        locationType: LocationTypes.REGISTER,
      }),
    );
  }, [props]);

  useEffect(() => {
    if (!layerRef.current) {
      return;
    }
    layerRef.current.add(
      new ShapeRegister({
        ...props,
        uuid: '1',
        shape: SideMenuTypes.REGISTER_TABLE,
        locationType: LocationTypes.REGISTER,
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

const meta: Meta<typeof Register> = {
  component: Register,
  title: 'molecules/ShapeRegister',
  tags: ['autodocs'],
  argTypes: {
    stroke: { control: 'color' },
    fill: { control: 'color' },
  },
};
export default meta;

export const Default: StoryObj<typeof Register> = {
  render: (args) => {
    return <Register {...args} />;
  },
  args: {
    visible: true,
    x: 50,
    y: 50,
    width: 60,
    height: 30,
    minWidth: 5,
    minHeight: 5,
    widthCells: 12,
    heightCells: 6,
    missingNumber: false,
    emptyNumber: false,
    stroke: 'rgba(0, 0, 0, 1)',
    strokeRgb: { r: 0, g: 0, b: 0, a: 1 },
    strokeTransparent: false,
    strokeWidth: 1,
    strokeDash: false,
    fill: 'rgba(255, 255, 255, 1)',
    fillRgb: { r: 255, g: 255, b: 255, a: 1 },
    fillTransparent: false,
    areaId: '01',
    tableId: '85',
    branchNum: '01',
    locationNum: '8501',
    displayLocationNum: '8501',
    showFullLocationNum: true,
    stageScale: 70,
  },
};
