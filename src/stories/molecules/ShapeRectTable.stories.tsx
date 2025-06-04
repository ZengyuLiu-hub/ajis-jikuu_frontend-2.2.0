import { useEffect, useRef } from 'react';
import { Stage, Layer } from 'react-konva';
import Konva from 'konva';

import type { Meta, StoryObj } from '@storybook/react';

import {
  ShapeRectTable,
  ShapeRectTableConfig,
} from '../../components/molecules/ShapeRectTable';
import { SideMenuTypes } from '../../types';
import { LocationTypes } from '../../components/molecules';

const RectTable = (props: ShapeRectTableConfig) => {
  const layerRef = useRef<Konva.Layer>(null);

  useEffect(() => {
    if (!layerRef.current || layerRef.current.children.length === 0) {
      return;
    }
    layerRef.current.destroyChildren();

    layerRef.current.add(
      new ShapeRectTable({
        ...props,
        uuid: '1',
        shape: SideMenuTypes.SQUARE_TABLE,
        locationType: LocationTypes.ISLAND,
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
      new ShapeRectTable({
        ...props,
        uuid: '1',
        shape: SideMenuTypes.SQUARE_TABLE,
        locationType: LocationTypes.ISLAND,
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

const meta: Meta<typeof RectTable> = {
  component: RectTable,
  title: 'molecules/ShapeRectTable',
  tags: ['autodocs'],
  argTypes: {
    stroke: { control: 'color' },
    fill: { control: 'color' },
  },
};
export default meta;

export const Default: StoryObj<typeof RectTable> = {
  render: (args) => {
    return <RectTable {...args} />;
  },
  args: {
    visible: true,
    x: 50,
    y: 50,
    text: 'Text',
    width: 100,
    height: 100,
    minWidth: 5,
    minHeight: 5,
    widthCells: 6,
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
    tableId: '01',
    branchNum: '01',
    locationNum: '0101',
    displayLocationNum: '0101',
    showFullLocationNum: false,
    stageScale: 70,
  },
};
