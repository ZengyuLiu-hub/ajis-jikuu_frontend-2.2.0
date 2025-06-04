import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { SubmitButton } from '../../components/atoms';

const meta: Meta<typeof SubmitButton> = {
  title: 'atoms/SubmitButton',
  component: SubmitButton,
  tags: ['autodocs'],
  argTypes: {},
};
export default meta;

type Story = StoryObj<typeof SubmitButton>;

export const Default: Story = {
  render: (args) => <SubmitButton {...args}>{args.value}</SubmitButton>,
  args: {
    value: 'SubmitButton',
    onClick: action('Submit!'),
  },
};
