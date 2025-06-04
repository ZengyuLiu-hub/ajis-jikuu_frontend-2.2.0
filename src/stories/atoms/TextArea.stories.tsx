import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { TextArea } from '../../components/atoms';

const meta: Meta<typeof TextArea> = {
  title: 'atoms/TextArea',
  component: TextArea,
  tags: ['autodocs'],
  argTypes: {},
};
export default meta;

type Story = StoryObj<typeof TextArea>;

export const Default: Story = {
  render: (args) => <TextArea {...args} />,
  args: {
    placeholder: 'text area',
    minLength: 0,
    maxLength: 50,
    defaultValue: 'textarea',
    disabled: false,
    onChange: action('Change!'),
  },
};
