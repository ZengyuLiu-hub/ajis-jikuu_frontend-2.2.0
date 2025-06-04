import styled from 'styled-components';

import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { DatePicker } from '../../components/atoms';

const Outline = styled.div`
  padding: 0 60px;
  width: 600px;
  height: 350px;
`;

type DatePickerArgs = React.ComponentProps<typeof DatePicker>;

const meta: Meta<DatePickerArgs> = {
  title: 'atoms/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  argTypes: {
    dropdownMode: {
      control: 'select',
      options: ['select', 'scroll'],
    },
    minDate: {
      control: 'date',
    },
    maxDate: {
      control: 'date',
    },
    selected: {
      control: 'date',
    },
  },
};
export default meta;

type Story = StoryObj<DatePickerArgs>;

export const Default: Story = {
  render: (args: DatePickerArgs) => (
    <Outline>
      <DatePicker {...args} />
    </Outline>
  ),
  args: {
    fixedHeight: true,
    isClearable: true,
    todayButton: '今日',
    showYearDropdown: true,
    showMonthDropdown: true,
    dropdownMode: 'select',
    minDate: new Date('2024-07-01'),
    maxDate: new Date('2024-08-31'),
    selected: new Date('2024-08-14'),
    dateFormat: 'yyyy-MM-dd',
    withPortal: false,
    disabled: false,
    onChange: action('Change!'),
  },
};
