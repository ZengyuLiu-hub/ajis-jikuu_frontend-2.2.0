import { useEffect, useRef } from 'react';
import { Stage, Layer } from 'react-konva';
import Konva from 'konva';

import type { Meta, StoryObj } from '@storybook/react';

import {
  ShapeGondola,
  ShapeGondolaConfig,
} from '../../components/molecules/ShapeGondola';
import { GondolaAlignments, RGBA, SideMenuTypes } from '../../types';

const GONDOLA = (props: ShapeGondolaConfig) => {
  const layerRef = useRef<Konva.Layer>(null);

  const getDisplayLocationNum = (config: any) => {
    if (config.showFullLocationNum) {
      return config.locationNum;
    }
    return config.branchNum;
  };

  const toRgbaObject = (value: string): RGBA => {
    const rgba = value.replace(/rgba|\(|\)/g, '').split(',');
    const r: number = Number(rgba[0]);
    const g: number = Number(rgba[1]);
    const b: number = Number(rgba[2]);
    const a: number = Number(rgba[3]);

    return { r, g, b, a };
  };

  useEffect(() => {
    if (!layerRef.current || layerRef.current.children.length === 0) {
      return;
    }
    layerRef.current.destroyChildren();

    const strokeRgb = toRgbaObject(props.stroke);
    const fillRgb = toRgbaObject(props.fill);

    layerRef.current.add(
      new ShapeGondola({
        ...props,
        uuid: '1',
        shape: SideMenuTypes.GONDOLA,
        selectable: true,
        draw: true,
        disabled: false,
        strokeRgb,
        strokeTransparent: strokeRgb.a === 1,
        fillRgb,
        fillTransparent: fillRgb.a === 1,
        displayLocationNum: getDisplayLocationNum(props),
      }),
    );
  }, [props]);

  useEffect(() => {
    if (!layerRef.current) {
      return;
    }

    const strokeRgb = toRgbaObject(props.stroke);
    const fillRgb = toRgbaObject(props.fill);

    layerRef.current.add(
      new ShapeGondola({
        ...props,
        uuid: '1',
        shape: SideMenuTypes.GONDOLA,
        selectable: true,
        draw: true,
        disabled: false,
        strokeRgb,
        strokeTransparent: strokeRgb.a === 1,
        fillRgb,
        fillTransparent: fillRgb.a === 1,
        displayLocationNum: getDisplayLocationNum(props),
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

const meta: Meta<typeof GONDOLA> = {
  component: GONDOLA,
  title: 'molecules/ShapeGondola',
  tags: ['autodocs'],
  argTypes: {
    stroke: { control: 'color' },
    fill: { control: 'color' },
    placement: {
      control: 'select',
      options: [GondolaAlignments.HORIZONTAL, GondolaAlignments.VERTICAL],
    },
  },
};
export default meta;

export const Default: StoryObj<typeof GONDOLA> = {
  render: (args) => {
    return <GONDOLA {...args} />;
  },
  args: {
    visible: true,
    x: 50,
    y: 50,
    width: 100,
    height: 50,
    minWidth: 5,
    minHeight: 5,
    widthCells: 20,
    heightCells: 10,
    stroke: 'rgba(0, 0, 0, 1)',
    strokeWidth: 1,
    strokeDash: false,
    fill: 'rgba(228, 228, 228, 1)',
    rotation: 0,
    areaId: '01',
    tableId: '01',
    branchNum: '01',
    locationNum: '0101',
    showFullLocationNum: false,
    placement: GondolaAlignments.HORIZONTAL,
    text: 'Text',
    remarks: 'メモ',
    missingNumber: false,
    emptyNumber: false,
    visibleRemarksIcon: true,
    stageScale: 70,
    isDoubleLine: false,
  },
};
