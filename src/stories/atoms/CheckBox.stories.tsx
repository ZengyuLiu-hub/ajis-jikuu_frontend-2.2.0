import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { CheckBox } from '../../components/atoms';

const meta: Meta<typeof CheckBox> = {
  title: 'atoms/CheckBox',
  component: CheckBox,
  tags: ['autodocs'],
  argTypes: {},
};
export default meta;

type Story = StoryObj<typeof CheckBox>;

export const Default: Story = {
  render: (args) => <CheckBox {...args} />,
  args: {
    value: 'CheckBox',
    checked: false,
    disabled: false,
    onChange: action('Change!'),
  },
};
