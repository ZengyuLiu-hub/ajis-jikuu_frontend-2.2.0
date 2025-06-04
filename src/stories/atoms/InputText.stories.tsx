import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { InputText } from '../../components/atoms';

const meta: Meta<typeof InputText> = {
  title: 'atoms/InputText',
  component: InputText,
  tags: ['autodocs'],
  argTypes: {
    valueMode: {
      control: 'radio',
      options: [
        undefined,
        'HALF_WIDTH_ALPHABET',
        'HALF_WIDTH_NUMBER',
        'HALF_WIDTH_ALPHABET_AND_NUMBER',
        'HALF_WIDTH'
      ],
    },
  },
};
export default meta;

type Story = StoryObj<typeof InputText>;

export const Default: Story = {
  render: (args) => <InputText {...args} />,
  args: {
    disabled: false,
    valueMode: undefined,
    onChange: action('Change!'),
  },
};
