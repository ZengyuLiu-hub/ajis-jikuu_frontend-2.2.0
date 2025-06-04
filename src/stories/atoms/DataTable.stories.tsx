import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import * as RV from 'react-virtualized';
import * as immutable from 'immutable';
import styled from 'styled-components';

import { DataTable } from '../../components/atoms';

const Outline = styled.div`
  display: flex;
  height: 200px;
`;

const data = [
  {
    id: '1',
    value1: 'ラベル１値１',
    value2: 'ラベル１値２',
    value3: 'ラベル１値３',
  },
  {
    id: '2',
    value1: 'ラベル２値１',
    value2: 'ラベル２値２',
    value3: 'ラベル２値３',
  },
  {
    id: '3',
    value1: 'ラベル３値１',
    value2: 'ラベル３値２',
    value3: 'ラベル３値３',
  },
  {
    id: '4',
    value1: 'ラベル４値１',
    value2: 'ラベル４値２',
    value3: 'ラベル４値３',
  },
  {
    id: '5',
    value1: 'ラベル５値１',
    value2: 'ラベル５値２',
    value3: 'ラベル５値３',
  },
  {
    id: '6',
    value1: 'ラベル６値１',
    value2: 'ラベル６値２',
    value3: 'ラベル６値３',
  },
];

const columns: RV.ColumnProps[] = [
  {
    label: 'id',
    dataKey: 'id',
    cellDataGetter: ({ rowData }: any) => rowData.id,
    width: 100,
  },
  {
    label: 'value1',
    dataKey: 'value1',
    cellDataGetter: ({ rowData }: any) => rowData.value1,
    width: 150,
    flexGrow: 1,
  },
  {
    label: 'value2',
    dataKey: 'value2',
    cellDataGetter: ({ rowData }: any) => rowData.value2,
    width: 100,
  },
  {
    label: 'value3',
    dataKey: 'value3',
    cellDataGetter: ({ rowData }: any) => rowData.value3,
    width: 100,
  },
];

const meta: Meta<typeof DataTable> = {
  title: 'atoms/DataTable',
  component: DataTable,
  tags: ['autodocs'],
  argTypes: {
    sortDirection: ['ASC', 'DESC'],
  },
};
export default meta;

type Story = StoryObj<typeof DataTable>;

export const Default: Story = {
  render: (args) => (
    <Outline>
      <DataTable {...args} />
    </Outline>
  ),
  args: {
    description: 'description',
    headerHeight: 45,
    overScanRowCount: 0,
    rowHeight: 30,
    sortedList: immutable.List.of(...data),
    sortBy: 'id',
    sortDirection: 'ASC',
    onSort: action('Sort!'),
    scrollToIndex: 0,
    columns,
    data,
    selectedRow: 'id',
    selectedUniqueKey: 'id',
    onRowClick: action('RowClick!'),
  },
};
