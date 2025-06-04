import Konva from 'konva';
import { useEffect, useRef } from 'react';
import { Layer, Stage } from 'react-konva';

import type { Meta, StoryObj } from '@storybook/react';

import React from 'react';
import { LocationTypes } from '../../components/molecules';
import {
  ShapeFreeText,
  ShapeFreeTextConfig,
} from '../../components/molecules/ShapeFreeText';
import { SideMenuTypes } from '../../types';

const FreeText = (props: ShapeFreeTextConfig) => {
  const layerRef = useRef<Konva.Layer>(null);

  useEffect(() => {
    if (!layerRef.current || layerRef.current.children.length === 0) {
      return;
    }
    layerRef.current.destroyChildren();

    layerRef.current.add(
      new ShapeFreeText({
        ...props,
        uuid: '1',
        shape: SideMenuTypes.FREE_TEXT,
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
      new ShapeFreeText({
        ...props,
        uuid: '1',
        shape: SideMenuTypes.FREE_TEXT,
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

const meta: Meta<typeof FreeText> = {
  component: FreeText,
  title: 'molecules/ShapeFreeText',
  tags: ['autodocs'],
  argTypes: {
    stroke: { control: 'color' },
  },
};
export default meta;

export const Default: StoryObj<typeof FreeText> = {
  render: (args) => {
    return <FreeText {...args} />;
  },
  args: {
    visible: true,
    x: 50,
    y: 50,
    width: 100,
    height: 50,
    minWidth: 5,
    minHeight: 5,
    missingNumber: false,
    emptyNumber: false,
    stroke: 'rgba(0, 0, 0, 1)',
    strokeRgb: { r: 0, g: 0, b: 0, a: 1 },
    strokeTransparent: false,
    strokeWidth: 1,
    strokeDash: false,
    rotation: 0,
    areaId: '01',
    tableId: '01',
    branchNum: '01',
    locationNum: '0101',
    displayLocationNum: '0101',
    showFullLocationNum: false,
    text: 'Free Text',
    stageScale: 70,
  },
};
