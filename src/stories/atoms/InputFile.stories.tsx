import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { InputFile } from '../../components/atoms';

const meta: Meta<typeof InputFile> = {
  title: 'atoms/InputFile',
  component: InputFile,
  tags: ['autodocs'],
  argTypes: {},
};
export default meta;

type Story = StoryObj<typeof InputFile>;

export const Default: Story = {
  render: (args) => <InputFile {...args} />,
  args: {
    title: 'Tooltip label',
    className: '',
    children: 'InputFile',
    disabled: false,
    onClick: action('Click!'),
    onFileSelection: (file: File) => {
      action('FileSelection!');
      return true;
    },
  },
};
