import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import styled from 'styled-components';

import { DataList } from '../../components/atoms';

const Outline = styled.div`
  display: flex;
  height: 200px;
`;

const data = [
  {
    id: '1',
    label1: 'ラベル１値１',
    label2: 'ラベル１値２',
    label3: 'ラベル１値３',
  },
  {
    id: '2',
    label1: 'ラベル２値１',
    label2: 'ラベル２値２',
    label3: 'ラベル２値３',
  },
  {
    id: '3',
    label1: 'ラベル３値１',
    label2: 'ラベル３値２',
    label3: 'ラベル３値３',
  },
];

const meta: Meta<typeof DataList> = {
  title: 'atoms/DataList',
  component: DataList,
  tags: ['autodocs'],
  argTypes: {},
};
export default meta;

type Story = StoryObj<typeof DataList>;

export const Default: Story = {
  render: (args) => (
    <Outline>
      <DataList {...args} />
    </Outline>
  ),
  args: {
    rowHeight: 22,
    data,
    label: 'label1',
    selectedItem: data[0],
    onClick: action('Click!'),
  },
};
