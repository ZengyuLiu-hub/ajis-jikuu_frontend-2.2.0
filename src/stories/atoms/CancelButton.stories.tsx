import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { CancelButton } from '../../components/atoms';

const meta: Meta<typeof CancelButton> = {
  title: 'atoms/CancelButton',
  component: CancelButton,
  tags: ['autodocs'],
  argTypes: {},
};
export default meta;

type Story = StoryObj<typeof CancelButton>;

export const Default: Story = {
  render: (args) => <CancelButton>{args.value}</CancelButton>,
  args: {
    value: 'CancelButton',
    onClick: action('Click!'),
  },
};
