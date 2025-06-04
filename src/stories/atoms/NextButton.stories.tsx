import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { NextButton } from '../../components/atoms';

const meta: Meta<typeof NextButton> = {
  title: 'atoms/NextButton',
  component: NextButton,
  tags: ['autodocs'],
  argTypes: {},
};
export default meta;

type Story = StoryObj<typeof NextButton>;

export const Default: Story = {
  render: (args) => <NextButton {...args}>{args.value}</NextButton>,
  args: {
    value: 'NextButton',
    onClick: action('Click!'),
  },
};
