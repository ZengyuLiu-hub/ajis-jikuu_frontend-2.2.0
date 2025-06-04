import type { Meta, StoryObj } from '@storybook/react';

import { RangeSlider } from '../../components/atoms';

const meta: Meta<typeof RangeSlider> = {
  title: 'atoms/RangeSlider',
  component: RangeSlider,
  tags: ['autodocs'],
  argTypes: {},
};
export default meta;

type Story = StoryObj<typeof RangeSlider>;

export const Default: Story = {
  render: (args) => <RangeSlider {...args} />,
  args: {
    max: 150,
    min: 20,
    step: 10,
    value: 100,
    onClickIncremental: () => {},
    onClickDecremental: () => {},
    onChange: () => {},
  },
};
