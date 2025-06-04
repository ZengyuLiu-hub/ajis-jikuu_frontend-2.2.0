import { useEffect, useRef } from 'react';
import { Stage, Layer } from 'react-konva';
import Konva from 'konva';

import type { Meta, StoryObj } from '@storybook/react';

import {
  ShapeEllipseTable,
  ShapeEllipseTableConfig,
} from '../../components/molecules/ShapeEllipseTable';
import { SideMenuTypes } from '../../types';
import { LocationTypes } from '../../components/molecules';

const EllipseTable = (props: ShapeEllipseTableConfig) => {
  const layerRef = useRef<Konva.Layer>(null);

  useEffect(() => {
    if (!layerRef.current || layerRef.current.children.length === 0) {
      return;
    }
    layerRef.current.destroyChildren();

    layerRef.current.add(
      new ShapeEllipseTable({
        ...props,
        uuid: '1',
        shape: SideMenuTypes.CIRCLE_TABLE,
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
      new ShapeEllipseTable({
        ...props,
        uuid: '1',
        shape: SideMenuTypes.CIRCLE_TABLE,
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

const meta: Meta<typeof EllipseTable> = {
  component: EllipseTable,
  title: 'molecules/ShapeEllipseTable',
  tags: ['autodocs'],
  argTypes: {
    stroke: { control: 'color' },
  },
};
export default meta;

export const Default: StoryObj<typeof EllipseTable> = {
  render: (args) => {
    return <EllipseTable {...args} />;
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
    missingNumber: false,
    emptyNumber: false,
    stroke: 'rgba(0, 0, 0, 1)',
    strokeRgb: { r: 0, g: 0, b: 0, a: 1 },
    strokeTransparent: false,
    strokeWidth: 1,
    strokeDash: false,
    areaId: '01',
    tableId: '01',
    branchNum: '01',
    locationNum: '0101',
    displayLocationNum: '0101',
    showFullLocationNum: false,
    stageScale: 70,
  },
};
